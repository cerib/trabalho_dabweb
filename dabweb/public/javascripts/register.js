console.log("register script loaded");

window.onload = function() {
  //removes warning background color from this field when user presses a key
  var emailField = document.querySelector("#email-field");
  emailField.addEventListener("keydown", () => {
    emailField.classList.remove("bg-warning");
  });
};
