document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".snippet-container");
  let snippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];

  const saveSnippets = () =>
    localStorage.setItem("codeSnippets", JSON.stringify(snippets));

  const createEmptyMessage = () => {
    container.innerHTML = `<p class="empty-msg">No snippets saved yet 😅</p>`;
  };

  function highlightJava(code) {
  // Escape HTML characters first
  code = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Java comments (single-line and multi-line)
  code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
  code = code.replace(/(\/\*[\s\S]*?\*\/)/gm, '<span class="comment">$1</span>');

  // Strings
  code = code.replace(/("(?:\\.|[^"\\])*")/g, '<span class="string">$1</span>');

  // Numbers
  code = code.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

  // Java keywords
  code = code.replace(
    new RegExp(
      "\\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|" +
      "default|do|double|else|enum|extends|final|finally|float|for|goto|if|" +
      "implements|import|instanceof|int|interface|long|native|new|package|private|" +
      "protected|public|return|short|static|strictfp|super|switch|synchronized|this|" +
      "throw|throws|transient|try|void|volatile|while)\\b", "g"
    ),
    '<span class="keyword">$1</span>'
  );

  // Data types (like String, Integer, etc.)
  code = code.replace(
    /\b(String|Integer|Double|Float|Character|Boolean|Object|System|Math|Thread)\b/g,
    '<span class="datatype">$1</span>'
  );

  // Class names (basic heuristic — capitalized identifiers)
  code = code.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="class">$1</span>');

  // Methods (something followed by parentheses)
  code = code.replace(/(\b[a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="method">$1</span>');

  return code;
}


  //Toaster Notification
  function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.background = "#b5ff18";
    toast.style.color = "#191919";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 0 10px rgba(181,255,24,0.5)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s ease";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);

    setTimeout(() => (toast.style.opacity = "1"), 100);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // showing all snippet cards
  const renderSnippets = () => {
    container.innerHTML = "";
    if (snippets.length === 0) {
      createEmptyMessage();
      return;
    }

    snippets.forEach((snippet, index) => {
      const card = document.createElement("div");
      card.className = "snippet-card";

      card.innerHTML = `
        <div class="snippet-header">
          <h2>${snippet.title || "Untitled"}</h2>
          <div class="card-actions">
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
          </div>
          <span class="lang-tag">${snippet.language || "Unknown"}</span>
        </div>
        <p class="snippet-desc">${
          snippet.description || "No description provided."
        }</p>
        <button class="view-btn" data-index="${index}">View Code</button>
      `;

      container.appendChild(card);
    });

    attachCardHandlers();
  };

  // modal for viewing and editing
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
  <span class="close-btn">&times;</span>

  <h2 id="modal-title"></h2>
  <p id="modal-lang"></p>
  
  <pre id="modal-code" style="white-space: pre-wrap; margin-top: 12px;"></pre>
  <textarea
  id="modal-edit-code"
  style="display:none; width:100%; height:240px; font-family:monospace;"
  ></textarea>
  
  <p id="modal-desc" style="margin-top: 6px; font-style: italic; color: #cfcfcf;"></p>
  <div class="modal-actions" style="margin-top: 8px;">
    <button id="save-btn" style="display:none;">Save</button>
    <button id="cancel-btn" style="display:none;">Cancel</button>
  </div>
</div>

  `;
  document.body.appendChild(modal);

  const closeModal = () => {
    modal.classList.remove("active");
    modal.querySelector("#modal-edit-code").style.display = "none";
    modal.querySelector("#save-btn").style.display = "none";
    modal.querySelector("#cancel-btn").style.display = "none";
    modal.querySelector("#modal-code").style.display = "block";
  };

  modal.querySelector(".close-btn").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // view/edit/delete buttons
  function attachCardHandlers() {
    // View
    container.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.dataset.index);
        const snippet = snippets[idx];
        document.getElementById("modal-title").textContent =
          snippet.title || "Untitled";
        document.getElementById("modal-lang").textContent = `Language: ${
          snippet.language || "Unknown"
        }`;
        const highlighted = highlightJava(snippet.code || "");
document.getElementById("modal-code").innerHTML = highlighted;

        document.getElementById("modal-desc").textContent =
          snippet.description || "No description provided.";
        modal.querySelector("#modal-code").style.display = "block";

        modal.querySelector("#modal-edit-code").style.display = "none";
        modal.querySelector("#save-btn").style.display = "none";
        modal.querySelector("#cancel-btn").style.display = "none";
        modal.classList.add("active");
      });
    });

    // Edit
    container.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.dataset.index);
        const snippet = snippets[idx];
        document.getElementById("modal-title").textContent =
          snippet.title || "Untitled";
        document.getElementById("modal-lang").textContent = `Language: ${
          snippet.language || "Unknown"
        }`;

        const editArea = modal.querySelector("#modal-edit-code");
        editArea.value = snippet.code || "";

        modal.querySelector("#modal-code").style.display = "none";
        editArea.style.display = "block";
        modal.querySelector("#save-btn").style.display = "inline-block";
        modal.querySelector("#cancel-btn").style.display = "inline-block";
        modal.classList.add("active");

        const saveBtn = modal.querySelector("#save-btn");
        const cancelBtn = modal.querySelector("#cancel-btn");
        saveBtn.replaceWith(saveBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));

        const newSave = modal.querySelector("#save-btn");
        const newCancel = modal.querySelector("#cancel-btn");

        newSave.addEventListener("click", () => {
          snippets[idx].code = editArea.value;
          saveSnippets();
          renderSnippets();
          closeModal();
          showToast("Changes saved successfully!");
        });

        newCancel.addEventListener("click", () => {
          closeModal();
        });
      });
    });

    // Delete
    container.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.dataset.index);
        const snippetName = snippets[idx].title || "Untitled";

        const confirmDel = confirm(`Delete snippet "${snippetName}"?`);
        if (!confirmDel) return;

        snippets.splice(idx, 1);
        saveSnippets();
        renderSnippets();
        showToast(`"${snippetName}" deleted successfully.`);
      });
    });
  }

  // initial render
  renderSnippets();
});
