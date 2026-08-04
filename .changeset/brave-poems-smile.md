---
'@jsekulowicz/ds-components': patch
---

Fix a render loop that froze the tab when scrolling a listbox whose rows aren't all the same height.

0.58.0 re-measured a row on every listbox render. But the measured height picks `startIdx`, which picks the row measured next — so a list holding two row heights can settle into a cycle where each height selects a row of the other. The two measurements then chase each other through the microtask queue, starving the event loop and freezing the tab. It needs enough scroll depth for the two heights to disagree about `startIdx` (roughly 1600px, or 40-odd rows), which is why it only bit a page or two into a long list.

Both selects now measure once per open. Rows still have to be uniform for the window to track the scroll position exactly; that was always true, but getting it wrong is now a small drift rather than a hang.
