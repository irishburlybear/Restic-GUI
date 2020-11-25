# Restic-GUI
A Restic GUI Electron based.

This is my attempt at making a Restic GUI and learning electronjs.

So currently you need a exe file somewhere in your path that is restic.exe Scoop I think does this for you.
I'm on a Windows 10 machine. Just so anyone knows my enviroment.

Also You need to have a repo in your enviroment variables. I'm currently using s3 minio as I get the basics done.

So no promises on what I may end up doing. I'm doing this mainly for myself, but decided to upload it to github for sh*t and giggles.

So far, I'm able to:
select a directory
send the command to backup that directory
progression bar and 2 file statuses
snapshot window
forget snapshots
prune snapshots

Upnext:
~~Creating restore functionality using a tree view of some sorts.~~
Creating restore by just searching for the files and using checkboxes for select.
Keeping it simple.

Select multiple files/folders for restore.
Selecting an output folder for said files/folders.

Far off future:
Ability to add multiple repos. Stored as "Campaigns"
"Campaigns" will have a simple what, where(s), and time to execute.
Campaigns will have an draggable rule set for order of execution top->bottom.
