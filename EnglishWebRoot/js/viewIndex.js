document.addEventListener("deviceready", function () {
    viewportFix();
    AndroidFullScreen.immersiveMode(function () {
        window.location.href = "welcome.html?firstLaunch";
    }, function (err) {
        alert(err);
    });
});