# Pull Request: Merge Devel into Main

## Summary
This PR merges the latest development changes into the main branch. It includes a major overhaul of the site layout, significant UI improvements (Navbar, Footer, Articles Page), and updates to the CDC content (new articles, cleaning up "vetado" items).

## Changes

### 🎨 UI/UX Improvements
- **New Site Layout**: Implemented a comprehensive layout update including a redesigned `Navbar` and `Footer`.
- **Articles Page**: Added a dedicated page for "All Articles" with an enhanced listing UI.
- **Search UI**: Refactored the search interface for better usability.
- **Removed Demo Modal**: Removed the demo modal to streamline the user experience.
- **Text Updates**: Updated content in the Footer and Navbar components.

### 📝 Content Updates (`cdc.json`)
- **Added Articles**: Included new articles (23 and 24).
- **Cleanup**: Removed a "vetado" (vetoed) item from the JSON data.
- **General Updates**: Routine updates to the `cdc.json` file.

### ⚙️ Chore / Config
- **Lockfile**: Added `bun.lock` for dependency management.

## Checklist
- [x] Build works without errors
- [x] UI components function as expected
- [x] Content in `cdc.json` is verified
