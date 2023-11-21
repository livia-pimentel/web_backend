function togglePassword() {
    // Get the password element
    let passwordInput = document.querySelector("#password");
    let passwordBtn = document.querySelector("#passwordBtn")


    // Switch the input type between 'password' and 'text'
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordBtn.textContent = "Hide Password";
    } else {
      passwordInput.type = "password";
      passwordBtn.textContent = "Show Password";
    }
  }