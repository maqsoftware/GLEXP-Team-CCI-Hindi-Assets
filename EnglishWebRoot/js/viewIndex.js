document.addEventListener("deviceready", function () {
    document.addEventListener("deviceready", function () {
        viewportFix(); viewportFix();

        AndroidFullScreen.immersiveMode(function () {
            // for Google Pixel C tab show navigation bar	        window.location.href = "welcome.html?firstLaunch";
            if (window.outerWidth === 1280) { }, function (err) {
                AndroidFullScreen.showSystemUI(function () {
                    alert(err);
                    window.location.href = "welcome.html?firstLaunch";
                });
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