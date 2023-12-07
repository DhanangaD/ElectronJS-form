const { electron, ipcRenderer  } = require("electron");

      document.getElementById("btnLogin").addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        console.log(username);
        console.log(password);
        console.log(email);

        // Send login attempt to main process
        ipcRenderer.send("login", { username,email, password });
      });

      // Receive login response from main process
      ipcRenderer.on("login-response", (event, { success, message }) => {
        if (success) {
          // Redirect to dashboard or another page
          window.location.href = 'dashboard.html';
          // Example: window.location.href = 'dashboard.html';
          console.log(message);
        } else {
          // Display error message
          console.error(message);
          alert("Login failed. Please check your credentials.");
        }
      });