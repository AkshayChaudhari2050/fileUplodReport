const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const {
  ipcMain
} = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
  debugger
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index3.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', createWindow)
debugger
app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

// })
// ipcMain.on('openFile', (event, path) => { 
//   const {dialog} = require('electron') 
//   const fs = require('fs') 
//   dialog.showOpenDialog(function (fileNames) { 

//      // fileNames is an array that contains all the selected 
//      if(fileNames === undefined) { 
//         console.log("No file selected"); 

//      } else { 
//         readFile(fileNames[0]); 
//      } 
//   });

//   function readFile(filepath) { 

//      fs.readFile(filepath, 'utf-8', (err, data) => { 

//         if(err){ 
//            alert("An error ocurred reading the file :" + err.message) 
//            return 
//         } 

//         // handle the file content 
//         event.sender.send('fileData', data) 
//      }) 
//   } 
// })