"""
Pull the whole product catalogue from the live store in one go.

Every project and every service was a Shopify product, so one paged request
to /products.json gets all of their titles, descriptions and image lists.
Fetching them one handle at a time trips the store's rate limiter (HTTP 429)
within a dozen requests; this makes one request per 250 products instead.

    python -I scripts/fetch-store-products.py

Writes media-src/projects-data/all-products.json. Re-run whenever the store
copy changes, then re-run scripts/build-project-details.py.
"""

import json
import pathlib
import sys
import time
import urllib.error
from urllib.request import Request, urlopen

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "media-src" / "projects-data" / "all-products.json"

STORE = "https://www.fcec.sa"
PER_PAGE = 250
MAX_PAGES = 10
GAP = 5.0


def get_page(page):
    url = f"{STORE}/products.json?limit={PER_PAGE}&page={page}"
    request = Request(url, headers={"User-Agent": "fcec-migration"})
    with urlopen(request, timeout=90) as response:
        return json.loads(response.read())["products"]


def main():
    products = []
    for page in range(1, MAX_PAGES + 1):
        try:
            batch = get_page(page)
        except urllib.error.HTTPError as error:
            if error.code == 429:
                sys.exit("429 — the store is still throttling. Wait and re-run.")
            raise
        print(f"page {page}: {len(batch)}")
        products.extend(batch)
        if len(batch) < PER_PAGE:
            break
        time.sleep(GAP)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({"products": products}, ensure_ascii=False), encoding="utf-8")
    print(f"{len(products)} products -> {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
