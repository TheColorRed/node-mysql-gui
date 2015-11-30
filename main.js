const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

var storage = require('storage');

// Report crashes to our server.
electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    var lastWindowState = storage.get("lastWindowState");
    if (lastWindowState === null) {
        lastWindowState = {
            width: 1024,
            height: 768,
            maximized: false
        }
    }

    mainWindow = new BrowserWindow({
        x: lastWindowState.x,
        y: lastWindowState.y,
        width: lastWindowState.width,
        height: lastWindowState.height,
        minWidth: 800,
        minHeight: 600
    });

    if (lastWindowState.maximized) {
        mainWindow.maximize();
    }

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Before window is destroyed
    mainWindow.on('close', function () {
        var bounds = mainWindow.getBounds();
        storage.set("lastWindowState", {
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
            maximized: mainWindow.isMaximized()
        });
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});