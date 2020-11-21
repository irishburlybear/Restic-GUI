const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let win;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 450,
    webPreferences: {
      allowRunningInsecureContent: false,
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname,"preload.js")
    }
  });

  //Remove the top menu bar
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  //Original Working (This is for just running a command and getting a response back)
  ipcMain.on("toMainRestic", (event, args) => {
    console.log("main.js: "+args[0])
    
    //We use a if statement to determine what command we will be using and what to send back.
    if (args[0] === "version") {
      const {execFile} = require('child_process')
      const child = execFile('restic', args, (error, stdout, stderr) => {
          if (error) {
              throw error
          }
          //Lets create a javascript object to make it more identifiable
          let obj = {version: stdout}
          
          mainWindow.webContents.send("fromMainRestic", obj)
      })
    }

    if (args[0] === "snapshots") {
      const {execFile} = require('child_process')
      const child = execFile('restic', args, (error, stdout, stderr) => {
          if (error) {
              throw error
          }
          //Lets create a javascript object to make it more identifiable
          let obj = {snapshots: stdout}
          
          mainWindow.webContents.send("fromMainRestic", obj)
      })
    }

    if (args[0] === "forget") {
      const {execFile} = require('child_process')
      const child = execFile('restic', args, (error, stdout, stderr) => {
        //console.log(args)
          if (error) {
              throw error
          }
          //Lets create a javascript object to make it more identifiable
          //We are also sending back the snapshot id so we can remove the
          //li element. 
          let obj = {
                      forget: stdout,
                      snapshot_id: args[2]
                    }
          
          mainWindow.webContents.send("fromMainRestic",obj)
      })
    }

    if (args[0] === "prune") {
      const {execFile} = require('child_process')
      const child = execFile('restic', args, (error, stdout, stderr) => {
          if (error) {
              throw error
          }
          //Lets create a javascript object to make it more identifiable
          let obj = {prune: stdout}
          
          mainWindow.webContents.send("fromMainRestic", obj)
      })
    }
    
  });

  //IO STDOUT Stream (This is for getting a stream of info back from restic)
  ipcMain.on("toMainResticIO", (event, args) => {

    if (args[0] === "prune"){
      //Create a spawn which has access to a prompt or shell:
      const spawn = require('child_process').spawn

      //Build the command into a variable:
      const command = spawn('restic', args)

      //Console.log so I can see what arguments(parameters) I'm sending to restic:
      console.log("prune fork")

      //Set the encoding to utf8:
      command.stdout.setEncoding('utf8')

      //Begin the looping of the stdout stream:
      command.stdout.on('data', function(data){ 
      let obj = {prune: data}
      //Send this to the renderer:
      mainWindow.webContents.send("fromMainResticIO", obj )
      })

    } else {

      //Create a spawn which has access to a prompt or shell:
      const spawn = require('child_process').spawn

      //Build the command into a variable:
      const command = spawn('restic', args)

      //Console.log so I can see what arguments(parameters) I'm sending to restic:
      console.log(args)

      //Set the encoding to utf8:
      command.stdout.setEncoding('utf8')

      //Begin the looping of the stdout stream:
      command.stdout.on('data', function(data){ 

      //Send this to the renderer:
      mainWindow.webContents.send("fromMainResticIO", data )
      })
    }

    
       
    
  });


   //Folder Selector: This is for getting a folder to backup, 
   //later we will add it to a config file for automation )
   //async is here:
   ipcMain.on("toMainSelectDirs", async (event, args) => {

    //Get the Directory:
    //We need an async and await. If not it throws an error as the program trys to move on
    //so thus we tell it to hold it's horses, wait for the user to interact..
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })

    //Send the Result back to renderer:
    //result is a object with an array inside. We are only selecting the first
    //array as we want to have the user select one folder at a time.
    //thus the force selecting the first item -> [0]
    //console.log(result.filePaths[0])
    mainWindow.webContents.send("fromMainSelectDirs", result.filePaths[0])
           
    
  });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
  
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


