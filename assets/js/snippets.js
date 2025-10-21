/**
 * snippets.js
 *
 * - Single responsibility helper functions
 * - Clear sections: constants, state, persistence, utils, rendering, modal, events
 * - Safer DOM access and defensive checks
 */

document.addEventListener("DOMContentLoaded", () => {
    /* ----------------------------- Constants ------------------------------ */
    const STORAGE_KEY = "codeSnippets";
    const SEL_CONTAINER = ".snippet-container";
    const SEL_SEARCH = "#search-input";

    /* --------------------------- Element Cache ---------------------------- */
    const container = document.querySelector(SEL_CONTAINER);
    const searchInput = document.querySelector(SEL_SEARCH);

    if (!container) {
        console.warn("snippets.js: container element not found:", SEL_CONTAINER);
        return;
    }

    /* ----------------------------- State --------------------------------- */
    let snippets = loadSnippets();

    /* --------------------------- Persistence ------------------------------ */
    /**
     * Load snippets array from localStorage (safe parse).
     * @returns {Array<Object>}
     */
    function loadSnippets() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.warn("snippets.js: failed to parse localStorage, returning []", err);
            return [];
        }
    }

    /**
     * Persist current snippets state to localStorage.
     */
    function persistSnippets() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
        } catch (err) {
            console.error("snippets.js: failed to write to localStorage", err);
        }
    }

    /* ---------------------------- Utilities ------------------------------- */
    /**
     * Escape HTML special characters to safely inject into innerHTML.
     * @param {string} str
     * @returns {string}
     */
    function escapeHTML(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    /**
     * Very small Java-ish highlighter that returns HTML with <span> classes.
     * Input is escaped inside this function.
     * @param {string} source
     * @returns {string}
     */
    function highlightJava(source) {
        let code = escapeHTML(source || "");

        // Comments
        code = code.replace(/(\/\*[\s\S]*?\*\/)/gm, '<span class="comment">$1</span>');
        code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');

        // Strings
        code = code.replace(/("(?:\\.|[^"\\])*")/g, '<span class="string">$1</span>');
        code = code.replace(/('(?:\\.|[^'\\])*')/g, '<span class="string">$1</span>');

        // Numbers
        code = code.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="number">$1</span>');

        // Keywords
        const keywords = [
            "abstract","assert","boolean","break","byte","case","catch","char","class","const","continue",
            "default","do","double","else","enum","extends","final","finally","float","for","goto","if",
            "implements","import","instanceof","int","interface","long","native","new","package","private",
            "protected","public","return","short","static","strictfp","super","switch","synchronized","this",
            "throw","throws","transient","try","void","volatile","while"
        ].join("|");
        code = code.replace(new RegExp("\\b(" + keywords + ")\\b", "g"), '<span class="keyword">$1</span>');

        // Common types / classes
        code = code.replace(/\b(String|Integer|Double|Float|Character|Boolean|Object|System|Math|Thread)\b/g, '<span class="datatype">$1</span>');

        // Class names (heuristic)
        code = code.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="class">$1</span>');

        // Methods (identifier followed by parentheses)
        code = code.replace(/(\b[a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="method">$1</span>');

        return code;
    }

    /**
     * Show a short toast notification.
     * @param {string} message
     * @param {number} [duration=3000]
     */
    function showToast(message, duration = 3000) {
        const toast = document.createElement("div");
        toast.className = "snack-toast";
        toast.textContent = message;
        Object.assign(toast.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#b5ff18",
            color: "#191919",
            padding: "10px 14px",
            borderRadius: "8px",
            fontWeight: "600",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            opacity: "0",
            transition: "opacity .3s ease",
            zIndex: "9999"
        });

        document.body.appendChild(toast);
        requestAnimationFrame(() => (toast.style.opacity = "1"));
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /* ----------------------------- Rendering ------------------------------ */
    function createEmptyMessage() {
        container.innerHTML = `<p class="empty-msg">No snippets saved yet.</p>`;
    }

    /**
     * Create a DOM card for a snippet.
     * data-index attribute always stores the original index inside `snippets`.
     * @param {object} snippet
     * @param {number} displayIndex - index used for presentation ordering (not used by actions)
     * @param {number} originalIndex - index in the global snippets array (used by actions)
     * @returns {HTMLElement}
     */
    function createSnippetCard(snippet, displayIndex, originalIndex) {
        const card = document.createElement("div");
        card.className = "snippet-card";

        const title = escapeHTML(snippet.title || "Untitled");
        const lang = escapeHTML(snippet.language || "Unknown");
        const desc = escapeHTML(snippet.description || "No description provided.");

        // data-index must reference originalIndex so actions map to correct snippet
        const idxAttr = typeof originalIndex === "number" ? originalIndex : displayIndex;

        card.innerHTML = `
            <div class="snippet-header">
                <h2 class="snippet-title">${title}</h2>
                <div class="card-actions">
                    <button class="edit-btn" data-index="${idxAttr}">Edit</button>
                    <button class="delete-btn" data-index="${idxAttr}">Delete</button>
                </div>
                <span class="lang-tag">${lang}</span>
            </div>
            <p class="snippet-desc">${desc}</p>
            <button class="view-btn" data-index="${idxAttr}">View Code</button>
        `;

        return card;
    }

    /**
     * Render full snippets list into container.
     */
    function renderSnippets() {
        container.innerHTML = "";

        if (!snippets || snippets.length === 0) {
            createEmptyMessage();
            return;
        }

        snippets.forEach((snippet, idx) => {
            const card = createSnippetCard(snippet, idx, idx);
            container.appendChild(card);
        });
    }

    /**
     * Render filtered results.
     * @param {Array<{item: object, idx: number}>} results
     */
    function renderFilteredSnippets(results) {
        container.innerHTML = "";

        if (!results || results.length === 0) {
            container.innerHTML = `<p class="empty-msg">No snippets found.</p>`;
            return;
        }

        results.forEach((r, i) => {
            const card = createSnippetCard(r.item, i, r.idx);
            container.appendChild(card);
        });
    }

    /* ------------------------------ Modal -------------------------------- */
    /**
     * Create modal once and return references.
     * Modal has view and edit modes.
     */
    function createModal() {
        const modal = document.createElement("div");
        modal.className = "modal";

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" title="Close">&times;</span>
                <h2 id="modal-title"></h2>
                <p id="modal-lang"></p>
                <pre id="modal-code" style="white-space: pre-wrap; margin-top:12px;"></pre>
                <textarea id="modal-edit-code" style="display:none; width:100%; height:240px; font-family:monospace;"></textarea>
                <p id="modal-desc" style="margin-top:6px; font-style:italic; color:#cfcfcf;"></p>
                <div class="modal-actions" style="margin-top:8px;">
                    <button id="save-btn" style="display:none;">Save</button>
                    <button id="cancel-btn" style="display:none;">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const refs = {
            modal,
            title: modal.querySelector("#modal-title"),
            lang: modal.querySelector("#modal-lang"),
            codePre: modal.querySelector("#modal-code"),
            editArea: modal.querySelector("#modal-edit-code"),
            desc: modal.querySelector("#modal-desc"),
            saveBtn: modal.querySelector("#save-btn"),
            cancelBtn: modal.querySelector("#cancel-btn"),
            closeBtn: modal.querySelector(".close-btn")
        };

        // close on overlay click
        refs.modal.addEventListener("click", (e) => {
            if (e.target === refs.modal) hideModal();
        });

        refs.closeBtn.addEventListener("click", hideModal);

        return refs;
    }

    const modal = createModal();

    function showModal() {
        modal.modal.classList.add("active");
    }

    function hideModal() {
        modal.modal.classList.remove("active");
        // reset to view mode
        modal.editArea.style.display = "none";
        modal.saveBtn.style.display = "none";
        modal.cancelBtn.style.display = "none";
        modal.codePre.style.display = "block";
    }

    /* -------------------------- Event Handlers ---------------------------- */
    /**
     * Handle view action.
     * @param {number} index - original index in snippets
     */
    function handleView(index) {
        if (typeof index !== "number" || !snippets[index]) return;
        const s = snippets[index];

        modal.title.textContent = s.title || "Untitled";
        modal.lang.textContent = `Language: ${s.language || "Unknown"}`;
        modal.desc.textContent = s.description || "No description provided.";

        modal.codePre.innerHTML = highlightJava(s.code || "");
        modal.codePre.style.display = "block";

        modal.editArea.style.display = "none";
        modal.saveBtn.style.display = "none";
        modal.cancelBtn.style.display = "none";

        showModal();
    }

    /**
     * Handle edit action.
     * Uses `once` on save listener so repeated attachments won't stack.
     * @param {number} index
     */
    function handleEdit(index) {
        if (typeof index !== "number" || !snippets[index]) return;
        const s = snippets[index];

        modal.title.textContent = s.title || "Untitled";
        modal.lang.textContent = `Language: ${s.language || "Unknown"}`;
        modal.desc.textContent = s.description || "No description provided.";

        modal.editArea.value = s.code || "";
        modal.codePre.style.display = "none";
        modal.editArea.style.display = "block";
        modal.saveBtn.style.display = "inline-block";
        modal.cancelBtn.style.display = "inline-block";

        showModal();

        // attach one-time save handler
        modal.saveBtn.addEventListener("click", function onSave() {
            snippets[index].code = modal.editArea.value;
            persistSnippets();
            renderSnippets();
            hideModal();
            showToast("Changes saved successfully!");
        }, { once: true });

        // attach one-time cancel handler
        modal.cancelBtn.addEventListener("click", function onCancel() {
            hideModal();
        }, { once: true });
    }

    /**
     * Handle delete action.
     * @param {number} index
     */
    function handleDelete(index) {
        if (typeof index !== "number" || !snippets[index]) return;
        const name = snippets[index].title || "Untitled";
        if (!confirm(`Delete snippet "${name}"?`)) return;

        snippets.splice(index, 1);
        persistSnippets();
        renderSnippets();
        showToast(`"${name}" deleted successfully.`);
    }

    /* -------------------------- Delegated Events -------------------------- */
    container.addEventListener("click", (ev) => {
        const btn = ev.target.closest("button");
        if (!btn) return;

        const rawIdx = btn.dataset.index;
        const idx = typeof rawIdx !== "undefined" && rawIdx !== "" ? Number(rawIdx) : NaN;
        if (Number.isNaN(idx)) return;

        if (btn.classList.contains("view-btn")) {
            handleView(idx);
        } else if (btn.classList.contains("edit-btn")) {
            handleEdit(idx);
        } else if (btn.classList.contains("delete-btn")) {
            handleDelete(idx);
        }
    });

    /* ----------------------------- Search -------------------------------- */
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const q = (searchInput.value || "").toLowerCase().trim();

            if (!q) {
                renderSnippets();
                return;
            }

            const results = snippets
                .map((item, idx) => ({ item, idx }))
                .filter(({ item }) => {
                    const title = (item.title || "").toLowerCase();
                    const lang = (item.language || "").toLowerCase();
                    const desc = (item.description || "").toLowerCase();
                    return title.includes(q) || lang.includes(q) || desc.includes(q);
                });

            renderFilteredSnippets(results);
        });
    }

    /* ---------------------------- Initialization -------------------------- */
    renderSnippets();
});