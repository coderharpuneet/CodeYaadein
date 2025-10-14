let form = document.querySelector(".snippet-form");
let title = document.querySelector(".input-title");
let language = document.querySelector(".input-lang");
let code = document.querySelector("#code");
let description = document.querySelector("#desc");
let submitBtn = document.querySelector(".snippet-submit-btn");

let snippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let newSnippet = {
    title: title.value.trim(),
    language: language.value.trim(),
    code: code.value.trim(),
    description: description.value.trim(),
  };

  snippets.push(newSnippet);
  localStorage.setItem("codeSnippets", JSON.stringify(snippets));

  title.value = "";
  language.value = "";
  code.value = "";
  description.value = "";

  showToast("Snippet saved successfully!");
});

// Fixed Toaster Function
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

  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, duration);
}
