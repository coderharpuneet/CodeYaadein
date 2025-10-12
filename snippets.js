document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".snippet-container");
  let snippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];

  const saveSnippets = () =>
    localStorage.setItem("codeSnippets", JSON.stringify(snippets));

  const createEmptyMessage = () => {
    container.innerHTML = `<p class="empty-msg">No snippets saved yet 😅</p>`;
  };

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
        <p class="snippet-desc">${snippet.description || "No description provided."}</p>
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
      <pre id="modal-code" style="white-space:pre-wrap;"></pre>
      <textarea id="modal-edit-code" style="display:none; width:100%; height:240px; font-family:monospace;"></textarea>
      <div class="modal-actions" style="margin-top:8px;">
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

  // Attach handlers for view/edit/delete buttons (after render)
  function attachCardHandlers() {
    // View
    container.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.dataset.index);
        const snippet = snippets[idx];
        document.getElementById("modal-title").textContent =
          snippet.title || "Untitled";
        document.getElementById("modal-lang").textContent =
          `Language: ${snippet.language || "Unknown"}`;
        document.getElementById("modal-code").textContent =
          snippet.code || "No code found.";
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
        document.getElementById("modal-lang").textContent =
          `Language: ${snippet.language || "Unknown"}`;

        const editArea = modal.querySelector("#modal-edit-code");
        editArea.value = snippet.code || "";
        // show edit UI
        modal.querySelector("#modal-code").style.display = "none";
        editArea.style.display = "block";
        modal.querySelector("#save-btn").style.display = "inline-block";
        modal.querySelector("#cancel-btn").style.display = "inline-block";
        modal.classList.add("active");

        const saveBtn = modal.querySelector("#save-btn");
        const cancelBtn = modal.querySelector("#cancel-btn");

        // remove previous handlers to avoid duplicate actions
        saveBtn.replaceWith(saveBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));

        const newSave = modal.querySelector("#save-btn");
        const newCancel = modal.querySelector("#cancel-btn");

        newSave.addEventListener("click", () => {
          snippets[idx].code = editArea.value;
          saveSnippets();
          renderSnippets();
          closeModal();
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
        const confirmDel = confirm(
          `Delete snippet "${snippets[idx].title || "Untitled"}"?`
        );
        if (!confirmDel) return;
        snippets.splice(idx, 1);
        saveSnippets();
        renderSnippets();
      });
    });
  }

  // initial render
  renderSnippets();
});