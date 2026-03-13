# 🛡️ THE SANCTUARY: AI RULES OF ENGAGEMENT

## 1. DESIGN INTEGRITY (THE GOLD STANDARD)
- **Primary Color:** Teal-500 (#14b8a6) / Teal-400 for glows.
- **Background:** Obsidian (#0a0a0a) / Deep Black (#050505).
- **Typography:** Inter, Bold/Black weights, Tracking-widest for headers.
- **NEVER** change the Navbar or Footer structure without explicit user permission. Reference: Screenshot 163442.png.

## 2. CODE QUALITY & HYDRATION
- **Next.js 15+ Rules:** Do not use `if (typeof window !== 'undefined')` inside layout.tsx to avoid mismatch.
- **Component Guard:** All Client Components MUST be marked with `"use client";`.
- **Hydration:** Ensure HTML nesting is valid (e.g., no <div> inside <p> or <a>).

## 3. AGENT BOUNDARIES
- **DO NOT** wipe folders without checking for a Titan Lock backup.
- **DO NOT** refactor the bento grid logic unless addressing a specific functional bug.
- **STRICT:** Always maintain the "Sovereign Infrastructure" aesthetic.

## 4. DEPLOYMENT & VERIFICATION
- All changes must be tested via `npm run dev` before being committed.
- If a "Red Screen" hydration error occurs, revert immediately to the last Git commit.
- Use `git status` frequently to ensure only intended files are modified.
