    "use strict;"

    onload = () => {
        const webview = document.getElementById("webview_wrapper");
        const indicator = document.querySelector('.indicator')

        const loadstart = () => {
            indicator.innerText = 'loading...'
        }

        const loadstop = () => {
            indicator.innerText = ''
        }

        webview.addEventListener('did-start-loading', loadstart)
        webview.addEventListener('did-stop-loading', loadstop);

        var checkUnreadCountTimer = setInterval(function() {
            webview.send("window-data");
        }, 1000);


        const { ipcRenderer } = require('electron');
        window.addEventListener('load', () => ipcRenderer.send('ipc', 'webview.htmlのpreloadのwindow.onload'));
        ipcRenderer.send('ipc', 'webview.htmlのpreload');
    }