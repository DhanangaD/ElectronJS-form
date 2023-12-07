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
  });
  mainWindow.loadFile("src/index.html");
}

// Receive login attempt from renderer process
ipcMain.on("login", (event, { username, password }) => {
  // Check username and password in the database
  const query = "SELECT * FROM users WHERE ( username = ? OR email = ?) AND password = ?";
  db.get(query, [username, email, password], (err, row) => {

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
      openDashboardWindow();
    } else { 
      // console.log(username);
      // console.log(password);

      // Incorrect username or password
      event.reply("login-response", {
        success: false,
        message: "Incorrect username or password",
      });
    }
  });
});

function openDashboardWindow() {
  const dashboardWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {

      nodeIntegration: true,
      contextIsolation: false,
      
    },
  });

  dashboardWindow.loadFile(path.join(__dirname, "dashboard.html"));
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
