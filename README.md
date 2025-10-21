# 🌈 CodeYaadein — Web Snippets Manager

> A lightweight, client-side web app to save, view, edit, and manage your code snippets directly in the browser — built using **HTML, CSS, and JavaScript**.  
> Your snippets live safely in your browser’s `localStorage`, no backend required 🚀

---

## 🌐 Demo
🔗 **Live Project:** [https://code-yaadein.vercel.app](https://code-yaadein.vercel.app)

---

## ✨ Features

- 🗂️ View all saved code snippets in a responsive card layout  
- 🔍 View full snippet details in a modal (title, language, code, description)  
- ✏️ Edit and update snippets directly inside the modal  
- 🗑️ Delete snippets with confirmation prompts  
- 💾 Automatic persistence in browser `localStorage`  
- 🔔 Smooth toast notifications for save/delete actions  
- 💡 Syntax highlighting (for Java snippets)  
- 📱 Fully responsive and mobile-friendly design  

---

## 📁 Project Structure

```

CodeYaadein/
├── assets/
│   ├── css/
│   │   ├── snippets.css     # Styles for the snippets page
│   │   └── styles.css       # Global site styles
│   └── js/
│       ├── snippets.js      # Main logic for managing snippets
│       └── script.js        # Additional site scripts (if any)
│
├── index.html               # Homepage (optional)
├── snippets.html            # Main Snippets Management Page
└── README.md

````

---

## 🧠 How It Works

All snippets are stored locally under the key **`codeSnippets`** in `localStorage`.

Example structure:

```json
[
  {
    "title": "Example Snippet",
    "language": "Java",
    "description": "Simple hello world example",
    "code": "public class Main { public static void main(String[] args) { System.out.println(\"Hello\"); } }"
  }
]
````

When no snippets exist, the app automatically displays a friendly

> “No snippets saved yet 😅” message.

---

## 🧩 Core Functionality

### 🔹 Viewing Snippets

Each snippet appears as a card with:

* Title and language tag
* Short description
* “View Code” button to open a modal

### 🔹 Editing Snippets

* Open modal → Edit code → Save
* Updates reflect instantly in localStorage

### 🔹 Deleting Snippets

* Click “Delete” → Confirm prompt
* Snippet is removed and UI re-renders

### 🔹 Syntax Highlighting

* Basic Java syntax highlighting using pure HTML, CSS, and JS
* Keywords, classes, methods, and comments are colorized dynamically

---

## 🧰 Running Locally

### Option 1: Using VS Code Live Server

1. Open the project in VS Code
2. Right-click `snippets.html` → **Open with Live Server**

### Option 2: Using Python

```bash
cd "C:\Users\Dell\Desktop\webBasics"
python -m http.server 8000
```

Then visit: [http://localhost:8000/snippets.html](http://localhost:8000/snippets.html)

> ⚠️ Some features may not work if opened directly via `file://`.

---

## 🧾 Troubleshooting

**Nothing displays?**

* Check if snippets exist:

  ```js
  console.log(JSON.parse(localStorage.getItem("codeSnippets")));
  ```
* Ensure file paths are correct:

  * `assets/js/snippets.js`
  * `assets/css/snippets.css`

**Modal not opening / buttons not working?**

* Open browser DevTools (F12) → Console tab → Check for JS errors
* Make sure `snippets.js` is included once at the bottom of `snippets.html`

---

## 💡 Future Enhancements

* 📤 Export/Import snippets as JSON
* 🧠 Multi-language syntax highlighting
* 🔍 Search and filter snippets
* 🌙 Dark/Light theme toggle
* ☁️ Cloud sync support (optional future update)

---

## 🔒 Privacy & Storage

All data is stored **locally** in your browser.
No data ever leaves your device.
Be aware that clearing browser data or using incognito mode will remove snippets.

---

## 🧑‍💻 Author

**Harpuneet Singh**
Frontend & Full Stack Developer
📍 [GitHub](https://github.com/harpuneet-singh) • [LinkedIn](https://linkedin.com/in/harpuneet-singh)

---

## 📜 License

This project is open source and available under the **MIT License**.

---

### ⭐ If you like this project, give it a star on GitHub!

```

---

Would you like me to format this README in **aesthetic GitHub-style** (with emojis + badges + collapsible sections like `<details>`) — or keep it this clean professional layout?
```
