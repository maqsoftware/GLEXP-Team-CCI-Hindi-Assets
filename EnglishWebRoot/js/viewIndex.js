document.addEventListener("deviceready", function () {
    viewportFix();

    // for Google Pixel C tab show navigation bar

    AndroidFullScreen.immersiveMode(function () {
        window.location.href = "welcome.html?firstLaunch";
    }, function (err) {
        alert(err);
    });

});