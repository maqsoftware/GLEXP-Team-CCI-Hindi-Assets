
function getValByTag(node, tag) {
    if (node && node.getElementsByTagName(tag).length && node.getElementsByTagName(tag)[0].innerHTML) {
        return node.getElementsByTagName(tag)[0].innerHTML;
    } else {
        return false;
    }
}

document.addEventListener("deviceready", function () {
    if (typeof Analytics !== "undefined") {
        window.AnalyticHandler = new Analytics();
    }
    viewportFix();
    // cordova.plugins.autoStart.enable();
    // Reading users.xml
    readFile("users.xml", function (xml) {
        if (xml === false) {
            createFile("users.xml", function () {
                writeFile("users.xml", "<users></users>", function () {
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onRequestFileSystemSuccess, null);
                    function onRequestFileSystemSuccess(fileSystem) {
                        var entry = fileSystem.root;
                        entry.getDirectory("users", { create: true, exclusive: false }, onGetDirectorySuccess, onGetDirectoryFail);
                    }
                    function onGetDirectorySuccess(dir) {
                        // console.log("Created dir " + dir.name);
                    }
                    function onGetDirectoryFail(error) {
                        console.log("Error creating directory " + error.code);
                    }
                    parseXML("<users></users>");
                });
            });
        } else {
            parseXML(xml);
        }
    });
    $.ajax({
        type: "GET",
        url: schoolLoc + "/school.xml", // not modified, who cares, just getting bg image
        dataType: "xml",
        success: function (xml) {
            window.schoolXML = xml;
            var initTutorial = "";
            var tuts = schoolXML.getElementsByTagName("tutorial");
            for (var t = 0; t < tuts.length; t++) {
                var tut = tuts[t];
                if (getValByTag(tuts[t], "type") == "app") {
                    initTutorial = getValByTag(tuts[t], "name");
                }
            }
        },
        error: function () {
            console.error("School xml did not load");
        }
    });
    // Parsing XML and calling click function for the click action on HTML attributes
    function parseXML(xml) {
        var userList = [];
        xml = $.parseXML(xml);
        window.xml = xml;
    }
    function addUser() {
        var users = xml.getElementsByTagName("user");
        var maxID = 0;
        for (var u = 0; u < users.length; u++) {
            var curID = getValByTag(users[u], "id");
            maxID = Math.max(curID, maxID);
        }
        var newID = maxID + 1;
        var cam = new QuickCamera();
        var picName = "profile_pic";
        cam.snap("users/" + newID, picName, function (url) {
            var user = xml.createElement("user");
            var id = xml.createElement("id");
            id.innerHTML = newID;
            user.appendChild(id);
            var uName = xml.createElement("name");
            uName.innerHTML = "";
            user.appendChild(uName);
            var picture = xml.createElement("picture");
            picture.innerHTML = url;
            user.appendChild(picture);
            var level = xml.createElement("level");
            level.innerHTML = "1";
            user.appendChild(level);
            var emptyNodes = ["unitsRead", "prevUnitsRead", "gamesWon", "prevGamesWon", "levelsUnlocked", "prevLevelsUnlocked", "schoolComplete"];
            for (var n = 0; n < emptyNodes.length; n++) {
                var name = emptyNodes[n];
                var node = xml.createElement(name);
                node.innerHTML = 0;
                user.appendChild(node);
            }
            xml.getElementsByTagName("users")[0].appendChild(user);
            var xmlText = new XMLSerializer().serializeToString(xml);
            overwriteFileSafe("users.xml", xmlText, function (ret) {
                createFile("users/" + newID + "/school.xml", function () {
                    var xmlText = new XMLSerializer().serializeToString(window.schoolXML);
                    writeFile("users/" + newID + "/school.xml", xmlText, function () {
                        createFile("users/" + newID + "/analytics-post.json", function () {
                            createFile("users/" + newID + "/analytics.json", function () {
                                var firstRecord = { type: "uc" };
                                var analyticsMain = { userID: newID, records: {} };
                                analyticsMain.records[retStamp()] = firstRecord;
                                writeFile("users/" + newID + "/analytics.json", JSON.stringify(analyticsMain), function () {
                                    login(newID);
                                });
                            });
                        })
                    })
                });
            })
        })
    }

    function login(id) {
        overwriteFile("loggedIn.txt", id, function (ret) {
            readFile("users/" + id + "/analytics.json", function (ret) {
                var loginRecord = { type: "li" };
                var analyticsMain = JSON.parse(ret);
                analyticsMain.records[retStamp()] = loginRecord;
                writeFile("users/" + id + "/analytics.json", JSON.stringify(analyticsMain), function () {
                    window.location.href = "school.html";
                });
            });
        })
    }


    $("#tutorial").click(function () {
        gotoTutorial();
    });
    $("#promptLeft").click(function () {
        gotoTutorial();
    });
    $("#login").click(function () {
        var users = xml.getElementsByTagName("user");
        if (users.length === 0)
            addUser();
        else
            login(users.length);
    });
    $("#promptRight").click(function () {
        var users = xml.getElementsByTagName("user");
        if (users.length === 0)
            addUser();
        else
            login(users.length);
    });


    function gotoTutorial() {
        $.ajax({
            type: "GET",
            url: schoolLoc + "/school.xml", // not modified, who cares, just getting bg image
            dataType: "xml",
            success: function (xml) {
                window.schoolXML = xml;
                var bgSrc = getValByTag(xml, "schoolBG");
                var initTutorial = "";
                var tuts = schoolXML.getElementsByTagName("tutorial");
                for (var t = 0; t < tuts.length; t++) {
                    var tut = tuts[t];
                    if (getValByTag(tuts[t], "type") == "app") {
                        initTutorial = getValByTag(tuts[t], "name");
                    }
                }
                if (initTutorial) {
                    window.location.href = schoolLoc + "/tutorials/" + initTutorial + "/index.html";
                } else {
                    console.log("No initial tutorial found in XML, no initial launch");
                    window.location.href = "login.html";
                }

            },
            error: function () {
                console.error("School xml did not load");
            }
        });
    }
});