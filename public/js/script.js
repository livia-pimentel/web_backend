function togglePassword() {
    // Get the password element
    var passwordInput = document.querySelector("#password");

    // Switch the input type between 'password' and 'text'
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }