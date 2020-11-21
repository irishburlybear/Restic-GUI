const { ipcRenderer, contextBridge } = require('electron')

//This is the main pipe in and out of the main and renderer
//We can add more channels in the validChannels variable for more commands
//This will go out and seek that channel name and Run whatever function
//Just as long as you complete the loop.

contextBridge.exposeInMainWorld(
  "restic", {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = [
        "toMainRestic",
        "toMainResticIO",
        "toMainSelectDirs",
      ];
      if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
      }
    },
    
    receive: (channel, func) => {
      let validChannels = [
        "fromMainRestic",
        "fromMainResticIO",
        "fromMainSelectDirs",
      ];
      if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          
          ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }

  }
  
)