import asyncio, sys
from playwright.async_api import async_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000/room-details-deluxe-double-room.html"
SCROLL = int(sys.argv[2]) if len(sys.argv) > 2 else 0
OUT = sys.argv[3] if len(sys.argv) > 3 else "/tmp/shot.png"

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/root/bin/chromium", args=["--no-sandbox"])
        pg = await b.new_page(viewport={"width":1600,"height":900})
        await pg.goto(URL, wait_until="load", timeout=40000)
        await pg.wait_for_timeout(3500)
        # force-hide preloader if still present
        await pg.evaluate("(()=>{const p=document.getElementById('preloader'); if(p) p.style.display='none';})()")
        if SCROLL:
            await pg.evaluate(f"window.scrollTo(0,{SCROLL})")
            await pg.wait_for_timeout(1500)
        await pg.screenshot(path=OUT)
        info = await pg.evaluate("""()=>{const g=document.querySelector('.gallery-detail');const m=document.querySelector('.gallery-detail .image-container img');const t=document.querySelectorAll('.gallery-detail .images .gallery-img');return {hasG:!!g,main:m?m.getAttribute('src'):null,thumbs:t.length, h: document.body.scrollHeight, galTop: g?Math.round(g.getBoundingClientRect().top+window.scrollY):null};}""")
        print(info)
        await b.close()

asyncio.run(main())
