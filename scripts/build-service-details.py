"""
Build the service detail content from the Shopify product records.

The nine services were Shopify products, so their copy and galleries lived in
the store rather than in the theme. This reads the records saved under
media-src/services-data/, re-hosts their images, and writes the content
module the detail page reads.

Run from the project root:

    python -I scripts/build-service-details.py

It skips any image already downloaded, so re-running after an edit to the
descriptions is cheap. Re-fetch a record with:

    curl -o media-src/services-data/<handle>.en.json \
         https://www.fcec.sa/products/<handle>.json
"""

import html
import json
import pathlib
import re
import sys
from html.parser import HTMLParser
from urllib.request import urlopen

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
RECORDS = ROOT / "media-src" / "services-data"
MASTERS = ROOT / "media-src" / "services-gallery"
EXPORTS = ROOT / "public" / "services-gallery"
OUTPUT = ROOT / "src" / "content" / "serviceDetails.js"

MAX_EDGE = 1000
QUALITY = 80

# The order the Services page lists them in, which is the homepage order.
ORDER = [
    "hydrological-studies-and-flood-risk-assessment",
    "urban-planning",
    "reengineering-and-digital-transformation",
    "smart-cities-services",
    "engineering-consultations",
    "engineering-services-to-the-public-in-all-cities",
    "project-management",
    "gis-and-its-applications",
    "geomatics-and-surveying",
]


class BodyParser(HTMLParser):
    """
    Shopify's rich-text editor wraps every run of text in a <span> carrying
    `font-weight: 400` and a pile of `data-mce-*` attributes. None of it
    means anything, so only the block structure is kept: paragraphs, and
    lists of items.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        self.buffer = []
        self.list_items = None
        self.depth = {"p": 0, "li": 0}

    def handle_starttag(self, tag, attrs):
        if tag in ("ul", "ol"):
            self.list_items = []
        elif tag in ("p", "li"):
            self.buffer = []
            self.depth[tag] += 1
        elif tag == "br":
            self.buffer.append(" ")

    def handle_endtag(self, tag):
        if tag in ("ul", "ol"):
            if self.list_items:
                self.blocks.append({"type": "list", "items": self.list_items})
            self.list_items = None
        elif tag in ("p", "li"):
            self.depth[tag] = max(0, self.depth[tag] - 1)
            text = self.flush()
            if not text:
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
        # Shopify's editor leaves non-breaking spaces behind everywhere.
        return re.sub(r"\s+", " ", text.replace("\u00a0", " ")).strip()


def parse_body(body_html):
    parser = BodyParser()
    parser.feed(body_html)
    parser.close()
    # A trailing run of text outside any block still belongs on the page.
    tail = parser.flush()
    if tail:
        parser.blocks.append({"type": "paragraph", "text": tail})
    return parser.blocks


def fetch(url, dest):
    if dest.exists() and dest.stat().st_size:
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urlopen(url, timeout=60) as response:
        dest.write_bytes(response.read())
    return True


def export(src, dest):
    img = Image.open(src).convert("RGB")
    scale = min(1.0, MAX_EDGE / max(img.size))
    if scale < 1.0:
        img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=QUALITY, method=6)
    return img.size


def main():
    details = {}
    downloaded = exported = 0

    for slug in ORDER:
        record = RECORDS / f"{slug}.en.json"
        if not record.exists():
            sys.exit(f"missing record: {record}")
        product = json.loads(record.read_text(encoding="utf-8"))["product"]

        gallery = []
        for index, image in enumerate(product.get("images", []), start=1):
            url = image["src"].split("?")[0]
            suffix = pathlib.Path(url).suffix.lower() or ".jpg"
            master = MASTERS / slug / f"{index:02d}{suffix}"
            if fetch(image["src"], master):
                downloaded += 1
            out = EXPORTS / slug / f"{index:02d}.webp"
            width, height = export(master, out)
            exported += 1
            gallery.append(
                {"src": f"services-gallery/{slug}/{index:02d}.webp", "width": width, "height": height}
            )

        details[slug] = {
            "blocks": parse_body(product["body_html"]),
            "gallery": gallery,
            # Kept for reference: the store's own title, which is all-caps and
            # does not match the translated name the site shows.
            "storeTitle": product["title"],
        }

    body = json.dumps(details, ensure_ascii=False, indent=2)
    OUTPUT.write_text(
        "/*\n"
        " * GENERATED by scripts/build-service-details.py — do not edit by hand.\n"
        " *\n"
        " * The nine services were Shopify products, so their copy and galleries\n"
        " * lived in the store rather than in the theme. This is that content,\n"
        " * parsed out of the product records in media-src/services-data/ and\n"
        " * re-hosted from public/services-gallery/.\n"
        " *\n"
        " * English only: the store had no Arabic product descriptions, and the\n"
        " * theme's translation files carry none either. See the README.\n"
        " */\n"
        f"export const SERVICE_DETAILS = {body}\n",
        encoding="utf-8",
    )
    print(f"{len(details)} services, {downloaded} downloaded, {exported} exported")


if __name__ == "__main__":
    main()
