---
name: Mobile carousel interaction
description: The mobile collections experience relies on a real scroll-snap track for partial-next visibility and reliable touch/mouse dragging.
---

Use a native horizontal scroll-snap track for mobile collection browsing, with pointer-drag fallback and card-local 3D arrival animation. A purely absolute flip stage is difficult to validate across touch and automation environments and cannot naturally expose the next card.

**Why:** The original flip-only stage repeatedly failed to advance under realistic drag input and did not provide the required partial-next/snap behavior.

**How to apply:** Keep page-level overflow contained, derive metadata from the nearest snapped card, and preserve arrows, keyboard controls, pagination, and one-card purchase semantics around the track.