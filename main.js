const { BrowserWindow, app } = require("electron");


process.env.NODE_ENV = "development"

const isDev = process.env.NODE_ENV !== "production" ? true : false;

let mainWindow

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

  //* null the pointer after app closed
  mainWindow.on("ready", () => mainWindow = null)
})