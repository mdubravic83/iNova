import asyncio
from playwright.async_api import async_playwright

URL = "http://localhost:3000/room-details-deluxe-double-room.html"

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/root/bin/chromium", args=["--no-sandbox"])
        pg = await b.new_page(viewport={"width":1600,"height":900})
        await pg.goto(URL, wait_until="load", timeout=40000)
        await pg.wait_for_timeout(3500)
        await pg.evaluate("(()=>{const p=document.getElementById('preloader');if(p)p.style.display='none';})()")
        # click 3rd thumbnail
        thumbs = await pg.query_selector_all('.gallery-thumbs .gallery-img')
        print("thumb count:", len(thumbs))
        await thumbs[2].click()
        await pg.wait_for_timeout(600)
        main_src = await pg.eval_on_selector('.gallery-main-img', 'el=>el.getAttribute("src")')
        counter = await pg.eval_on_selector('.gallery-counter .gc-current', 'el=>el.textContent')
        print("after thumb3 click -> main:", main_src, "counter:", counter)
        # open lightbox via zoom button
        await pg.click('[data-testid="room-gallery-zoom"]')
        await pg.wait_for_timeout(700)
        lb_open = await pg.eval_on_selector('.glx-lightbox', 'el=>el.classList.contains("open")')
        print("lightbox open:", lb_open)
        await pg.screenshot(path="/app/frontend/site/_gal.png")
        # next in lightbox
        await pg.click('[data-testid="lightbox-next"]')
        await pg.wait_for_timeout(500)
        lb_cur = await pg.eval_on_selector('.glx-counter .lb-cur', 'el=>el.textContent')
        print("lightbox after next, cur:", lb_cur)
        await b.close()

asyncio.run(main())
