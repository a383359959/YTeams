const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const net = electron.net;
const session = electron.session;
const path = require('path');
const url = require('url');
const ip = 'http://192.168.1.108/';
let mainWindow;

function checkCookie(){
    // 清除cookie
    session.defaultSession.clearStorageData({
        origin : ip,
        storages : ['cookies']
    },function(error){
        if (error) console.error(error);
    });
    session.defaultSession.cookies.get({url : ip}, (error, cookies) => {
        var member_id = '';
        var token = '';
        for(var i = 0;i < cookies.length;i++){
            var row = cookies[i];
            if(row.name == 'member_id') member_id = row.value;
            if(row.name == 'token') token = row.value;
        }
        if(member_id != '' && token != ''){
            createHome();
        }else{
            createLogin();
        }
    });
}

function createLogin(){
    mainWindow = new BrowserWindow({width : 320,height : 320,frame : false,resizable : false});
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname,'index.html'),
        protocol : 'file:',
        slashes : true
    }));
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
    mainWindow.webContents.openDevTools();
};

function createHome(){
    mainWindow = new BrowserWindow({frame : false,resizable : false});
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname,'home.html'),
        protocol : 'file:',
        slashes : true
    }));
    mainWindow.on('closed',function(){
        mainWindow = null;
    });
}

app.on('ready',checkCookie);

app.on('window-all-closed',function(){
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function(){
    if (mainWindow === null) checkCookie();
});

ipc.on('dialog',function(event,args){
    dialog.showMessageBox({
        type : 'none',
        title : args.title,
        message : args.message
    });
});

ipc.on('mainWindow',function(event,args){
    createHome();
});
