document.addEventListener("deviceready", function () {
    window.QuickCamera = function (folder, fileName, callback) {
        var THIS = this;

        this.snap = function (folder, fileName, callback) {
            THIS.folder = folder; // MyAppFolder
            THIS.fileName = fileName; // pic
            THIS.callback = callback;
            onPhotoDataSuccess();
        }

        function onPhotoDataSuccess() {
            if (sessionStorage.isprofileimage == 1) {
                getLocation();
            }
            // Taking the URL of image of avatar 
            var imageURL = "file://" + window.location.pathname;
            var lastIndex = imageURL.lastIndexOf("/");
            // Manipulating the URL 
            imageURL = imageURL.substr(0, lastIndex + 1) + "img/tabletpic.png";
            movePic(imageURL);
        }

        function movePic(file) {
            window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError);
        }

        //Callback function when the file system uri has been resolved
        function resolveOnSuccess(entry) {
            //new file name
            var newFileName = THIS.fileName + ".jpg";
            var myFolderApp = THIS.folder;
            // console.log("requesting FS");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
                // console.log("request granted");
                //The folder is created if doesn't exist
                fileSys.root.getDirectory(myFolderApp,
                    { create: true, exclusive: false },
                    function (directory) {
                        entry.moveTo(directory, newFileName, successMove, resOnError);
                    },
                    resOnError);
            },
                resOnError);
        }

        //Callback function when the file has been moved successfully - inserting the complete path
        function successMove(entry) {
            // console.log("good move");
            //Store imagepath in session for future use
            // like to store it in database
            sessionStorage.setItem('imagepath', entry.fullPath);
            // document.getElementById("imgProfile").setAttribute("src", entry.nativeURL);
            THIS.callback(entry.nativeURL);
        }

        function resOnError(error) {
            // alert(error.code);
        }

    };
});
