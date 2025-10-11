document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".snippet-container");
  const snippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];

  if (snippets.length === 0) {
    container.innerHTML = `<p class="empty-msg">No snippets saved yet 😅</p>`;
    return;
  }

  snippets.forEach((snippet, index) => {
    const card = document.createElement("div");
    card.classList.add("sn ippet-card");

    card.innerHTML = `
      <div class="snippet-header">
        <h2>${snippet.title || "Untitled"}</h2>
        <span class="lang-tag">${snippet.language || "Unknown"}</span>
      </div>
      <p class="snippet-desc">${
        snippet.description || "No description provided."
      }</p>
      <button class="view-btn" data-index="${index}">View Code</button>
    `;

    container.appendChild(card);
  });

  // Create modal dynamically
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2 id="modal-title"></h2>
      <p id="modal-lang"></p>
      <pre id="modal-code"></pre>
    </div>
  `;
  document.body.appendChild(modal);

  const closeModal = () => modal.classList.remove("active");
  document.querySelector(".close-btn").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // View button click logic
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const snippet = snippets[index];
      document.getElementById("modal-title").textContent =
        snippet.title || "Untitled";
      document.getElementById(
        "modal-lang"
      ).textContent = `Language: ${snippet.language}`;
      document.getElementById("modal-code").textContent =
        snippet.code || "No code found.";
      modal.classList.add("active");
    });
  });
});
