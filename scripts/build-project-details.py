"""
Build the project content from the Shopify product records.

The thirty projects were Shopify products: their titles, the facts table
(Client, Location, Year...) and the galleries all lived in the store. This
reads the catalogue fetched by scripts/fetch-store-products.py, re-hosts the
images, and writes the content module the Projects pages read.

    python -I scripts/fetch-store-products.py
    python -I scripts/build-project-details.py

Images already downloaded are skipped, so re-running is cheap.
"""

import csv
import html
import json
import pathlib
import re
import sys
import time
import urllib.error
from html.parser import HTMLParser
from urllib.request import Request, urlopen

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
TABLE = ROOT / "scripts" / "projects.tsv"
CATALOGUE = ROOT / "media-src" / "projects-data" / "all-products.json"
MASTERS = ROOT / "media-src" / "projects"
EXPORTS = ROOT / "public" / "projects"
OUTPUT = ROOT / "src" / "content" / "projectDetails.js"

FILES_BASE = "https://cdn.shopify.com/s/files/1/0739/7625/0644/files/"
CARD_WIDTH = 800
GALLERY_EDGE = 1000
QUALITY = 80
# Galleries run long on a few projects and every image is a page-weight cost.
MAX_GALLERY = 8


class BodyParser(HTMLParser):
    """
    Splits a product description into its facts table and its prose.

    Shopify's editor wraps every run of text in a <span> carrying
    `font-weight: 400` and a pile of `data-mce-*` attributes, none of which
    means anything, so only the block structure is kept.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        self.facts = []
        self.buffer = []
        self.list_items = None
        self.in_table = 0
        self.row = None

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.in_table += 1
        elif tag == "tr" and self.in_table:
            self.row = []
        elif tag in ("td", "th") and self.in_table:
            self.buffer = []
        elif tag in ("ul", "ol") and not self.in_table:
            self.list_items = []
        elif tag in ("p", "li") and not self.in_table:
            self.buffer = []
        elif tag == "br":
            self.buffer.append(" ")

    def handle_endtag(self, tag):
        if tag == "table":
            self.in_table = max(0, self.in_table - 1)
        elif tag == "tr" and self.in_table:
            if self.row and len(self.row) >= 2 and any(self.row):
                label = self.row[0].rstrip(":").strip()
                value = " ".join(cell for cell in self.row[1:] if cell).strip()
                if label and value:
                    self.facts.append({"label": label, "value": value})
            self.row = None
        elif tag in ("td", "th") and self.in_table:
            if self.row is not None:
                self.row.append(self.flush())
        elif tag in ("ul", "ol") and not self.in_table:
            if self.list_items:
                self.blocks.append({"type": "list", "items": self.list_items})
            self.list_items = None
        elif tag in ("p", "li") and not self.in_table:
            text = self.flush()
            # The Qatif expropriation description ends on a paragraph holding
            # a single full stop, left behind by the rich-text editor.
            if not any(ch.isalnum() for ch in text):
                return
            if tag == "li" and self.list_items is not None:
                self.list_items.append(text)
            elif tag == "p":
                self.blocks.append({"type": "paragraph", "text": text})

    def handle_data(self, data):
        self.buffer.append(data)

    def flush(self):
        text = html.unescape("".join(self.buffer))
        self.buffer = []
        return re.sub(r"\s+", " ", text.replace(" ", " ")).strip()


def parse_body(body_html):
    parser = BodyParser()
    parser.feed(body_html)
    parser.close()
    tail = parser.flush()
    if tail:
        parser.blocks.append({"type": "paragraph", "text": tail})
    return parser.blocks, parser.facts


def fetch(url, dest):
    if dest.exists() and dest.stat().st_size:
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(4):
        try:
            with urlopen(Request(url, headers={"User-Agent": "fcec-migration"}), timeout=90) as r:
                dest.write_bytes(r.read())
            return True
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 3:
                raise
            time.sleep(4 ** (attempt + 1))
    return False


def export(src, dest, max_edge):
    img = Image.open(src)
    img = img.convert("RGBA" if img.mode in ("RGBA", "LA", "P") else "RGB")
    if img.mode == "RGBA":
        ground = Image.new("RGB", img.size, (255, 255, 255))
        ground.paste(img, mask=img.getchannel("A"))
        img = ground
    scale = min(1.0, max_edge / max(img.size))
    if scale < 1.0:
        img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=QUALITY, method=6)
    return img.size


def main():
    if not CATALOGUE.exists():
        sys.exit(f"missing {CATALOGUE}\nrun scripts/fetch-store-products.py first")
    catalogue = {
        product["handle"]: product
        for product in json.loads(CATALOGUE.read_text(encoding="utf-8"))["products"]
    }

    rows = list(csv.DictReader(TABLE.open(encoding="utf-8"), delimiter="\t"))
    projects = {}
    order = []
    downloaded = 0

    for row in rows:
        handle, card = row["handle"], row["card"]
        product = catalogue.get(handle)
        if product is None:
            sys.exit(f"{handle} is not in the catalogue — has it been unpublished?")
        images = product.get("images", [])
        blocks, facts = parse_body(product["body_html"])

        # Card art. The index page used hand-picked files from the store's
        # file library rather than each product's own first image; fall back
        # to the product image when one of those has gone.
        master = MASTERS / handle / ("card" + pathlib.Path(card).suffix.lower())
        try:
            if fetch(FILES_BASE + card, master):
                downloaded += 1
        except urllib.error.HTTPError as error:
            if not images:
                sys.exit(f"{handle}: card image {error.code} and no product images")
            print(f"  {handle}: card {error.code}, using the product image")
            master = MASTERS / handle / "card.jpg"
            if fetch(images[0]["src"], master):
                downloaded += 1
        card_size = export(master, EXPORTS / handle / "card.webp", CARD_WIDTH)

        gallery = []
        for index, image in enumerate(images[:MAX_GALLERY], start=1):
            url = image["src"].split("?")[0]
            suffix = pathlib.Path(url).suffix.lower() or ".jpg"
            source = MASTERS / handle / f"{index:02d}{suffix}"
            if fetch(image["src"], source):
                downloaded += 1
            width, height = export(source, EXPORTS / handle / f"{index:02d}.webp", GALLERY_EDGE)
            gallery.append(
                {"src": f"projects/{handle}/{index:02d}.webp", "width": width, "height": height}
            )

        client = next(
            (f["value"] for f in facts if f["label"].lower().startswith("client")), None
        )
        order.append(handle)
        projects[handle] = {
            "title": product["title"],
            "type": (product.get("product_type") or "").strip() or None,
            "client": client,
            "facts": facts,
            "blocks": blocks,
            "card": {
                "src": f"projects/{handle}/card.webp",
                "width": card_size[0],
                "height": card_size[1],
            },
            "gallery": gallery,
            "extraImages": max(0, len(images) - MAX_GALLERY),
        }

    header = (
        "/*\n"
        " * GENERATED by scripts/build-project-details.py - do not edit by hand.\n"
        " *\n"
        " * The projects were Shopify products, so their titles, their facts\n"
        " * tables and their galleries lived in the store rather than in the\n"
        " * theme. This is that content, parsed out of the records in\n"
        " * media-src/projects-data/ and re-hosted from public/projects/.\n"
        " *\n"
        " * English only. Arabic titles and client names go in the dictionaries\n"
        " * under `projects.<handle>.title` and `.client`, which override these.\n"
        " */\n"
    )
    OUTPUT.write_text(
        header
        + f"export const PROJECT_ORDER = {json.dumps(order, indent=2)}\n\n"
        + f"export const PROJECT_DETAILS = {json.dumps(projects, ensure_ascii=False, indent=2)}\n",
        encoding="utf-8",
    )
    galleries = sum(len(p["gallery"]) for p in projects.values())
    print(f"{len(projects)} projects, {galleries} gallery images, {downloaded} downloaded")


if __name__ == "__main__":
    main()
