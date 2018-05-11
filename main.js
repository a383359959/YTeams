const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const net = electron.net;
const session = electron.session;
const Menu = electron.Menu;
const path = require('path');
const url = require('url');
const ip = 'http://192.168.1.108/';
// let mainWindow,addProjectWindow;

let loginWindow;
let homeWindow;

function checkCookie(){
    // 清除cookie
    // session.defaultSession.clearStorageData({
    //     origin : ip,
    //     storages : ['cookies']
    // },function(error){
    //     if (error) console.error(error);
    // });
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
    loginWindow = new BrowserWindow({width : 320,height : 320,frame : false,resizable : false});
    loginWindow.loadURL(url.format({
        pathname : path.join(__dirname,'index.html'),
        protocol : 'file:',
        slashes : true
    }));
    loginWindow.on('closed',function(){
        loginWindow = null;
    });
    loginWindow.webContents.openDevTools();
};

function createHome(){
    homeWindow = new BrowserWindow({width: 816,height : 737,minWidth : 816,minHeight : 737,show : false,frame : false});
    homeWindow.loadURL(url.format({
        pathname : path.join(__dirname,'home.html'),
        protocol : 'file:',
        slashes : true
    }));
    homeWindow.webContents.openDevTools();
    homeWindow.once('ready-to-show',function(){
        homeWindow.show();
    });
    homeWindow.on('closed',function(){
        homeWindow = null;
    });
}

app.on('ready',checkCookie);

app.on('window-all-closed',function(){
    if (process.platform !== 'darwin') app.quit();
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

ipc.on('logout',function(event,args){
    createLogin();
});
