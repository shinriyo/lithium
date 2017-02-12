'use strict';

const electron = require("electron");
const Menu = electron.Menu;
const {
    crashReporter
} = require('electron');
crashReporter.start({
    productName: 'shinriyo',
    companyName: 'shinriyo',
    submitURL: 'https://shinriyo.hateblo.jp',
    autoSubmit: true
});

const ipcMain = require('electron').ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

// user_lang のあとに.jsをつけたファイル名が呼ばれる
try {
    var localize = require('./localize/' + user_lang + '.js');
} catch (e) {
    // ユーザのが存在してなかったら仕方なくデフォルト
    localize = require('./localize/en-US.js');
}

app.on('ready', function() {
    var user_lang; // = navigator.language || navigator.userLanguage; 
    var osLocale = require('os-locale');
    osLocale(function(err, locale) {
        console.log(locale);
        //=> 'en_US'
        user_lang = locale;
    });

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600
    });

    var template = [{
        // label: 'Electron',
        label: localize.title,
        submenu: [{
            // label: 'Quit',
            label: localize.quit,
            accelerator: "CmdOrCtrl+Q",
            click: function() {
                app.quit();
            }
        }, ]
    }, {
        // label: 'Edit',
        label: localize.edit,
        submenu: [{
            // label: "Copy",
            label: localize.copy,
            accelerator: "CmdOrCtrl+C",
            selector: "copy:"
        }, {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            selector: "paste:"
        }]
    }, {
        // label: 'View',
        label: localize.view,
        submenu: [{
            // label: 'Reload',
            label: localize.reload,
            accelerator: 'CmdOrCtrl+R',
            click(item, focusedWindow) {
                if (focusedWindow) focusedWindow.reload();
            }
        }, {
            // label: 'Toggle Full Screen',
            label: localize.full_screen,
            accelerator: 'Ctrl+Command+F',
            click: function() {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
        }, {
            // label: 'Toggle Developer Tools',
            label: localize.developer_tools,
            accelerator: 'Alt+Command+I',
            click: function() {
                mainWindow.toggleDevTools();
            }
        }, ]
    }, {
        label: localize.help,
        submenu: []
    }];

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});