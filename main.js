const { BrowserWindow, app, ipcMain } = require("electron");
const Store = require("./Store")

process.env.NODE_ENV = "development"

const isDev = process.env.NODE_ENV !== "production" ? true : false;

let mainWindow

//! INIT STORE
const store = new Store({
  configName:"user-settings",
  defaults: {
    settings: {
      cpuOverload:80,
      alertFrequency:5
    }
  }
})

//! MAIN WINDOW
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title:"System Info | CPU monitor",
    height:500,
    width: 400,
    icon:"./assets/icons/icon.png",
    webPreferences: {
      nodeIntegration:true,
      contextIsolation:false
    }
  })
  mainWindow.loadFile("./app/main.html")
}

//! STARTS THE MAIN PROCESS
app.on("ready", () => {
  createMainWindow()

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("settings:get",store.get("settings"))
  })

  //* null the pointer after app closed
  mainWindow.on("ready", () => mainWindow = null)
})

ipcMain.on("settings:set", (e,val) => {
  store.set("settings", val)
  mainWindow.webContents.send("settings:get",store.get("settings"))

})

// For Mac features
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows.length === 0) {
    createMainWindow();
  }
});