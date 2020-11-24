const prune_status = document.getElementById('prune_status')

function getBodyLoad() {
    //We created a Body load function just in case we wanted to start others things not planned.
    //gives us some growing room if needed.
    getResticSnapshots()
}

function getResticSnapshots() {
    window.restic.send("toMainRestic",["snapshots","--json"]);
}

function exePruneSnapshots() {
    window.restic.send("toMainResticIO",["prune"]);

   
}

function f_forget(id) {
    
    window.restic.send("toMainRestic",["forget","snapshot",id]);
       
}

window.restic.receive("fromMainResticIO", (data) => {
    if (data.prune) {
        //We set mseconds to 1000, this will keep getting set back to 1000 everytime data is sent
        mseconds = 1000
        //At the end of the last data received: we let the setTimeout count down
        //when it reaches 0 call function vanish text 
        setTimeout(vanish_text, mseconds)
        //While data is coming through blank out the classnames so no animation starts:
        prune_status.className = ""
        //Display the data in the div:
        prune_status.innerHTML = data.prune
    } 
    
})

function vanish_text() {
    //This is where the setTimeout is set to trigger
    //Can be used for many other things.
    prune_status.className = "text-vanish"
}

window.restic.receive("fromMainRestic", (data) => {

    if (data.forget) {
        alert("snapshot id: "+data.snapshot_id+" "+data.forget)
        //getResticSnapshots()
        let element = document.getElementById(data.snapshot_id)
        element.parentNode.removeChild(element)
    }

    if (data.prune) {
        console.log(data.prune)
    }

    if (data.snapshots) {
        let ul = document.getElementById('ul_snapshots')
        let obj = JSON.parse(data.snapshots)
        //console.log(obj)

        let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]

        //Deconstruct the array of snapshots:
        for (let i=0; i < obj.length; i++) {
            
            //Convert the snapshot time into js time
            snapshotDate = new Date(obj[i].time)
            
            //Create our li elements
            let li = document.createElement('li')

            //Setting our li id to the snapshot name:
            li.setAttribute('id',obj[i].short_id)

            //Any classes we need to add (using materialize)
            li.className = "collection-item grey darken-3"

            //Begin the div for the main content of the li element:
            li.innerHTML = `<div>
            <p><span id="span-date">Date: </span>` + months[snapshotDate.getMonth()] + `-` + snapshotDate.getDate() + `-` + snapshotDate.getFullYear() + `</p>` +
            `<span id="span-short_id">Short ID: </span>` + obj[i].short_id +
            `<button id="btn_restore" onclick="f_restore('`+obj[i].short_id+`')" class="btn right blue darken-4 pulse">Restore</button>` +
            `<button id="btn_forget" onclick="f_forget('`+obj[i].short_id+`')" class="btn right red darken-4">Forget</button>` +
            `</div>`
            //We need to call a function to get the list of paths into the corrent div element:
            li.innerHTML += `<div id="div-li-paths"><span id="span-paths">Paths:</span>`+ getPaths() 
            li.innerHTML += `</div>` //Ending of Paths div


            //Get the paths, could be multiple paths:
            function getPaths(){
                let paths = ""

                for (let i2=0; i2 < obj[i].paths.length; i2++) {
                    //console.log(obj[i].paths[i2])
                    paths += `<p>` + obj[i].paths[i2] + '</p>'
                    
                }
                //Send back all the paths of the snapshot, need to work on snapshots with
                //really long list of directories.
                //May have to rethink this whole program.
                return paths
            }
            
            ul.appendChild(li)
        }
    }

});

function showDetail(){
    
    //document.getElementById("0").className = " active"
}