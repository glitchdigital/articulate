const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
    
var express = require('express'),
    partials = require('express-partials'),
    expressApp = express(),
    ejs = require('ejs')
    listener = null;

expressApp.set('view engine', 'ejs');
expressApp.engine('ejs', ejs.__express);
partials.register('.ejs', ejs);
expressApp.use(partials());
expressApp.use(express.static(__dirname));

let win;

global.exportedModules = {
  entityFinder: require('entity-finder')
};

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1200,
    height: 900
  });

  win.loadURL('http://127.0.0.1:'+listener.address().port+'/index.html');
  
  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });
}

// Server server on automatically assigned port
listener = expressApp.listen(0, function(s) {
  console.log(listener.address().port);
  console.log('Server running at http://127.0.0.1:%d', listener.address().port);

  app.on('ready', createWindow);
});

app.on("browser-window-created",function(e, window) {
  window.setMenu(null);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
