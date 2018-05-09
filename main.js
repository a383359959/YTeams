const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const net = electron.net;
const path = require('path');
const url = require('url');
let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width : 320,height : 320,frame : false,resizable : false});
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname,'index.html'),
        protocol : 'file:',
        slashes : true
    }));
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
};

function log(string){
    dialog.showMessageBox({
        type : 'none',
        title : '测试输出',
        message : string
    });
}

function ajax(url,method){
    const request = net.request({
        method : method,
        url : url
    });
    request.on('response',function(response){
        response.on('data',function(result){
            console.log(result);
        });
    });
    request.end();
}

app.on('ready',createWindow);

app.on('window-all-closed',function(){
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function(){
    if (mainWindow === null) createWindow();
});

ipc.on('login',function(event,args){
    ajax('https://www.zhihu.com/api/v3/oauth/account/unlock/request','GET');
});

