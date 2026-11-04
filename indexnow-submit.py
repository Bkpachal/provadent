#!/usr/bin/env python3
"""Submit every URL in sitemap.xml to IndexNow (api.indexnow.org), which
fans the submission out to Bing, Yandex, Seznam.cz and Naver so they can
crawl the site without waiting for their normal discovery schedule.

Run this ONCE the site is live at its real domain — submitting before
that just gives IndexNow a list of URLs that 404.

Usage:
    pip install requests
    python indexnow-submit.py
"""
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import requests

HOST='provadent.onrender.com'
KEY='e935894241eb2a13d16726fbc3ddd4d3'
KEY_LOCATION='https://provadent.onrender.com/e935894241eb2a13d16726fbc3ddd4d3.txt'
ENDPOINT='https://api.indexnow.org/indexnow'
SITEMAP=Path(__file__).resolve().parent/'sitemap.xml'


def load_urls():
 ns={'sm':'http://www.sitemaps.org/schemas/sitemap/0.9'}
 root=ET.parse(SITEMAP).getroot()
 return [loc.text.strip() for loc in root.findall('sm:url/sm:loc',ns) if loc.text and loc.text.strip()]


def main():
 urls=load_urls()
 if not urls:
  print('No URLs found in sitemap.xml');sys.exit(1)
 payload={'host':HOST,'key':KEY,'keyLocation':KEY_LOCATION,'urlList':urls}
 resp=requests.post(ENDPOINT,json=payload,headers={'Content-Type':'application/json; charset=utf-8'},timeout=30)
 print(f'IndexNow: submitted {len(urls)} URL(s) to {HOST} — HTTP {resp.status_code}')
 if resp.text.strip():print(resp.text.strip())


if __name__=='__main__':
 main()
