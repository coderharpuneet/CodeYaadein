let form=document.querySelector(".snippet-form");
let title=document.querySelector(".input-title");
let language=document.querySelector(".input-lang");
let code=document.querySelector("#code");
let description=document.querySelector("#desc");
let submitBtn=document.querySelector(".snippet-submit-btn");

// Handling the submit button to save the code snippet and save it to Local Storage
let snippets = JSON.parse(localStorage.getItem("codeSnippets")) || [];
form.addEventListener("submit", (e) => {
     e.preventDefault();
     let newSnippet = { 
          title:title.value.trim(), 
          language:language.value.trim(), 
          code:code.value.trim(), 
          description:description.value.trim() 
     };

     snippets.push(newSnippet);
     localStorage.setItem("codeSnippets", JSON.stringify(snippets));

     // Clear form
     title.value = "";
     language.value = "";
     code.value = "";
     description.value = "";

     // alert("Snippet saved successfully ✅");
});


