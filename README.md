# CodeYaadein — Web Snippets Manager

A small client-side snippet manager (HTML/CSS/JS) that stores and manages code snippets in the browser's localStorage. Lightweight, static, and easy to deploy — ideal for personal use and demoing frontend features.

Demo / Deployment
- This is a static site and can be deployed to GitHub Pages, Netlify, Vercel, or any static host.
- Deployed: (you mentioned the project is deployed) — add your public URL here: https://your-deployed-url.example

Features
- View all saved code snippets.
- View snippet details in a modal (title, language, code, description).
- Edit snippet code inline and save back to localStorage.
- Delete snippets with confirmation.
- Toast notifications for save/delete actions.
- Responsive card layout with tasteful UI accents.

Project structure
- index.html — main/home page (if present)
- snippets.html — snippets management page (UI for listing, viewing, editing)
- assets/
  - css/
    - snippets.css — styles for snippets page
    - styles.css — global/site styles (if present)
  - js/
    - snippets.js — main logic for rendering and manipulating snippets
    - script.js — other site scripts (if present)
- README.md — this file

Important implementation details
- Local storage key: codeSnippets  
  The app reads/writes JSON arrays to localStorage under the key "codeSnippets".
  Example format:
  [
    {
      "title": "Example",
      "language": "JavaScript",
      "description": "Short note",
      "code": "console.log('Hello')"
    },
    ...
  ]

- When no snippets exist the UI shows a friendly "No snippets saved yet" message.
- Modal supports view and edit modes. Edits are saved back to the snippets array, persisted, and re-rendered.

How to run locally (Windows)
1. Open terminal (PowerShell or Command Prompt) in the project folder:
   cd "c:\Users\Dell\Desktop\webBasics"

2. Recommended: serve via a simple static server to avoid file:// restrictions.
   - Python 3:
     python -m http.server 8000
     Open http://localhost:8000/snippets.html

   - Or use VS Code Live Server extension and open snippets.html

3. Alternatively double-click snippets.html to open in browser (some browsers restrict features under file://).

How to add / import snippets
- Through the app (if UI provides an "Add" feature) — use the in-app form.
- Or manually add to localStorage in browser console:
  localStorage.setItem('codeSnippets', JSON.stringify([{ "title":"My Snip", "language":"HTML", "description":"desc", "code":"<div>hi</div>" }]));

Troubleshooting
- Nothing shows on snippets.html:
  - Confirm snippets are stored under key "codeSnippets": 
    console.log(JSON.parse(localStorage.getItem('codeSnippets')));
  - Ensure assets paths are correct (assets/js/snippets.js and assets/css/snippets.css).
  - If opening via file://, try serving over http:// as described above.

- Modal not opening / JS errors:
  - Open DevTools (F12) → Console and paste the error here.
  - Ensure snippets.js is included once and not duplicated.

UI notes & customization ideas
- The card UI supports Edit/Delete buttons top-right. CSS rules in assets/css/snippets.css control spacing; tweak .snippet-container and .snippet-card max-width when a single card is present.
- Add syntax highlighting (Prism.js or Highlight.js) to show code nicely in view mode.
- Add import/export JSON buttons to backup and transfer snippets between browsers.

Deployment tips
- GitHub Pages:
  - Push repo to GitHub, enable Pages for the branch (main or gh-pages).
  - Use snippets.html as the entry page or set index.html accordingly.

- Netlify / Vercel:
  - Connect repository and deploy — both auto-detect static sites.

Security & privacy
- All data is stored locally in the user's browser (localStorage). No server-side storage by default.
- Remind users that localStorage can be cleared by the browser or when using private/incognito sessions.

Contributing
- File issues / PRs for bugs or feature requests.
- Keep changes small and document UI/UX or storage changes.

License
- Add a LICENSE file or state the intended license (e.g., MIT) here.

Contact / Notes
- Replace the demo/deployment URL above with your actual deployed link.
- If you want, I can add:
  - Import/export UI,
  - Syntax highlighting,
  - A small "New snippet" form,
  - Or generate a LICENSE file.
