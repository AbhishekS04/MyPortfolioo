---
type: community
cohesion: 0.50
members: 5
---

# Home Gallery

**Cohesion:** 0.50 - moderately connected
**Members:** 5 nodes

## Members

- [[Home()]] - code - src/app/(main)/page.tsx
- [[gallery.ts]] - code - src/app/actions/gallery.ts
- [[getFeaturedProjects()]] - code - src/app/actions/gallery.ts
- [[getGalleryImages()]] - code - src/app/actions/gallery.ts
- [[page.tsx]] - code - src/app/(main)/page.tsx

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Home_Gallery
SORT file.name ASC
```
