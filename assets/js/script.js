// ...existing code...
/**
 * script.js
 *
 * - Uses a STORAGE_KEY constant
 * - Guards DOM access (handles missing elements)
 * - Small helper functions (load/save/clear/toast)
 * - Well-indented, documented and modular
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------- Constants ------------------------------ */
  const STORAGE_KEY = "codeSnippets";

  /* --------------------------- Element Cache ---------------------------- */
  const form = document.querySelector(".snippet-form");
  const titleInput = document.querySelector(".input-title");
  const languageInput = document.querySelector(".input-lang");
  const codeInput = document.querySelector("#code");
  const descInput = document.querySelector("#desc");
  const submitBtn = document.querySelector(".snippet-submit-btn");

  /* ----------------------------- Utilities ------------------------------ */
  /**
   * Safely read snippets array from localStorage.
   * @returns {Array<Object>}
   */
  function loadSnippets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
      // If stored JSON is corrupted, return empty array and log warning.
      console.warn("loadSnippets: failed to parse localStorage value", err);
      return [];
    }
  }

  /**
   * Persist snippets array to localStorage.
   * @param {Array<Object>} snippets
   */
  function saveSnippets(snippets) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
    } catch (err) {
      console.error("saveSnippets: failed to write to localStorage", err);
    }
  }

  /**
   * Clear form inputs.
   */
  function clearForm() {
    if (titleInput) titleInput.value = "";
    if (languageInput) languageInput.value = "";
    if (codeInput) codeInput.value = "";
    if (descInput) descInput.value = "";
  }

  /**
   * Small toast/notification helper.
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
      padding: "12px 20px",
      borderRadius: "8px",
      fontWeight: "600",
      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
      opacity: "0",
      transition: "opacity 0.35s ease",
      zIndex: "9999",
    });

    document.body.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    // Fade out & remove
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  /* ---------------------------- Form Handler ---------------------------- */
  /**
   * Handle form submit - create a new snippet and persist it.
   * @param {SubmitEvent} event
   */
  function onFormSubmit(event) {
    event.preventDefault();

    if (!form) return;

    const newSnippet = {
      title: (titleInput && titleInput.value.trim()) || "",
      language: (languageInput && languageInput.value.trim()) || "",
      code: (codeInput && codeInput.value.trim()) || "",
      description: (descInput && descInput.value.trim()) || "",
    };

    // Basic validation: require at least a title or code
    if (!newSnippet.title && !newSnippet.code) {
      showToast("Please provide a title or some code before saving.", 2500);
      return;
    }

    const snippets = loadSnippets();
    snippets.push(newSnippet);
    saveSnippets(snippets);

    clearForm();
    showToast("Snippet saved successfully!");
  }

  /* --------------------------- Initialization --------------------------- */
  function init() {
    if (!form) {
      console.warn("script.js: snippet form not found — initialization skipped");
      return;
    }

    form.addEventListener("submit", onFormSubmit);

    // Progressive enhancement: enable submit button if present
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  }

  init();
});