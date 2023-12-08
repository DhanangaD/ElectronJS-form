const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    title:"Parent"
  });
  mainWindow.loadFile("src/index.html");
  mainWindow.setMenuBarVisibility(false);
}

// Receive login attempt from renderer process
ipcMain.on("login", (event, { username,  password }) => {
  // Check username and password in the database
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.get(query, [username, password], (err, row) => {

      // console.log(username);
      // console.log(password);

    if (err) {
      console.error(err);
      event.reply("login-response", {
        success: false,
        message: "Internal error",
      });
    } else if (row) {
      // Successful login
      event.reply("login-response", {
        success: true,
        message: "Login successful",
      });

      // Open the dashboard window
      // openDashboardWindow();
      loadPage("dashboard.html");
    } else { 
      // console.log(username);
      // console.log(password);

      // Incorrect username or password
      event.reply("login-response", {
        success: false,
        message: "Incorrect username or password",
      });
      openErrorPopup();
    }
  });
});

// Handle other routes
ipcMain.on("load-page", (event, pageName) => {
  loadPage(pageName);
});

function loadPage(pageName) {
  mainWindow.loadFile(path.join(__dirname, pageName));
}

function showErrorDialog(message) {
  dialog.showErrorBox("Login Error", message);
}

// function openDashboardWindow() {
//   const dashboardWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {

//       nodeIntegration: true,
//       contextIsolation: false,
      
//     },
//   });

//   dashboardWindow.loadFile(path.join(__dirname, "dashboard.html"));
//   dashboardWindow.setMenuBarVisibility(false);
// }

function openErrorPopup() {
  const errorPopup = new BrowserWindow({
    width: 500,
    height: 320,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    parent: mainWindow,
    modal: true,
    title:"Child"
  });

  errorPopup.loadFile(path.join(__dirname, "error.html"));
  errorPopup.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});