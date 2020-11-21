
const btn_getDir = document.getElementById('btn_getDir')
const show_version = document.getElementById('show_version')
const selected_folder = document.getElementById('selected_folder')
const backup_progress = document.getElementById('backup_progress')
const percent_done = document.getElementById('percent_done')
const current_file_0 = document.getElementById('current_file_0')
const current_file_1 = document.getElementById('current_file_1')

function initBackup() {
    //This function starts the backup, we should get the folder info from 
    //the config file in the end.
    if (selected_folder.value) {
        window.restic.send("toMainResticIO",["backup",selected_folder.value,"--json"]);
    } else {
        alert("No Selected Folder!")
    }
    
}

function getResticVersion() {
    window.restic.send("toMainRestic",["version","--json"]);
}

function getDirs() {
    window.restic.send("toMainSelectDirs")
   
}

window.restic.receive("fromMainRestic", (data) => {
    if (data.version) {
        show_version.innerHTML = data.version
    }
    
});

window.restic.receive("fromMainSelectDirs", (data) => {
console.log("renderer: " +data)
    selected_folder.value = data
});

//This is where the streaming STDOUT ends up at.
//We use several logical steps to pick the data apart
//and display to the user the progress
window.restic.receive("fromMainResticIO", (data) => {
    //Change the JSON to a javascript object
    //so we can pick out values:
    var obj = JSON.parse(data)
    
    //This goes through and gets the stream of stdout from Restic 
    //and calculates the progress bar:
    
    if (isNaN(obj.percent_done)) {
        //If it is NaN, then we have completed the backup.
        document.getElementById("backup_progress").style.width = 0
        percent_done.innerHTML = 0+'%'
        current_file_0.innerHTML = "Finished"
        current_file_1.innerHTML = "Finished"
        //This is the final summary data:
        
    } else {
        backup_progress.style.width = Math.round(obj.percent_done*100)+'%'
        percent_done.innerHTML = Math.round(obj.percent_done*100)+'%'
        
        //Lets make sure obj.current_files has something to offer
        //else lets tell the user it's sleeping..
        try {

            if (obj.current_files[0]) {
            
                current_file_0.innerHTML = obj.current_files[0]
            } else {
                current_file_0.innerHTML = "Sleeping ZZzz.."
            }
    
            if (obj.current_files[1]) {
    
                current_file_1.innerHTML = obj.current_files[1]
            } else {
                current_file_1.innerHTML = "Sleeping ZZzz.."
            }

        } 
        catch(err) {
            console.log(err)
        }

        
        
        
    }
    
    

});