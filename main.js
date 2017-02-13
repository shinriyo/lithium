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

const { app, BrowserWindow, ipcMain } = require('electron');
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

const path = require('path');

let widevineVersion = '1.4.8.866';
let baseWidevinePath = './widevine/' + widevineVersion + '/_platform_specific/';
var widevine_adapter_path = '';

switch (process.platform) {
    case "win32":
        widevine_adapter_path = baseWidevinePath + process.platform + "/" + process.arch + '/widevinecdmadapter.dll';
        break;
    default:
        widevine_adapter_path = baseWidevinePath + 'mac_x64/widevinecdmadapter.plugin';
        break
}

app.commandLine.appendSwitch('widevine-cdm-path', path.join(__dirname, widevine_adapter_path));
app.commandLine.appendSwitch('widevine-cdm-version', widevineVersion);
console.log(path.join(__dirname, widevine_adapter_path));

app.on('ready', function() {
    var user_lang; // = navigator.language || navigator.userLanguage; 
    var osLocale = require('os-locale');
    osLocale(function(err, locale) {
        console.log(locale);
        //=> 'en_US'
        user_lang = locale;
    });

    mainWindow = new BrowserWindow({
        webPreferences: {
            plugins: true
        },
        width: 1000,
        height: 600
    });

    // var filter = {
    //     urls: ["https://*.netflix.com/*", "*://www.netflix.com"]
    // };

    // var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A344 Safari/601.1';
    // var ses = mainWindow.webContents.session;
    // ses.webRequest.onBeforeSendHeaders(filter, function(details, callback) {
    //     details.requestHeaders['User-Agent'] = userAgent;
    //     callback({ cancel: false, requestHeaders: details.requestHeaders });
    // });

    // 手前
    mainWindow.setAlwaysOnTop(true);

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
    ipcMain.on('ipc', (event, arg) => console.log(arg));

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});