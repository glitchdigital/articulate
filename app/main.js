const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

var express = require('express'),
    partials = require('express-partials'),
    webapp = express(),
    ejs = require('ejs');
    
webapp.set('view engine', 'ejs');
webapp.engine('ejs', ejs.__express);
partials.register('.ejs', ejs);
webapp.use(partials());
webapp.use(express.static(__dirname));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  console.log("new window");
  // Create the browser window.
  win = new BrowserWindow({width: 1200, height: 900});

  //win.loadURL(`file://${__dirname}/index.html`);
  
  // Open the DevTools.
  //win.webContents.openDevTools();

  // Server server on automatically assigned port
  var listener = webapp.listen(0, function(s) {
    console.log(listener.address().port);
    console.log('Server running at http://127.0.0.1:%d', listener.address().port);
    win.loadURL('http://127.0.0.1:'+listener.address().port+'/index.html');
  });
  
  // Emitted when the window is closed.
  win.on('closed', () => {
    listener.close();
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
