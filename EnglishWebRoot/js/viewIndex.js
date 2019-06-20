document.addEventListener("deviceready", function () {
    viewportFix();

    // for Google Pixel C tab show navigation bar
    if (window.outerWidth === 1280) {
        AndroidFullScreen.showSystemUI(function () {
            window.location.href = "welcome.html?firstLaunch";
        }, function (err) {
            alert(err);
        });
    } else {
        AndroidFullScreen.immersiveMode(function () {
            window.location.href = "welcome.html?firstLaunch";
        }, function (err) {
            alert(err);
        });
    }
});