// Main class for all android/ios app modifications (assuming cordova)
var endTime, startTime;
function calculateTime() {

    var url = window.location.pathname.split("/");
    url.pop(); // index.html
    var book = url.pop();
    var subject = url.pop();
    var moduleName = url.pop();

    // remove the special characters found in the URL string
    function removeSpecialChars(str) {
        return str.replace(/%20/g, " ");
    }
    var moduleName = removeSpecialChars(moduleName);
    var levelName = removeSpecialChars(subject);
    var lessonName = removeSpecialChars(book);

    endTime = new Date();
    var timeDiff = endTime - startTime; //in seconds
    timeDiff /= 1000;
    var elapsedTime = Math.round(timeDiff);

    document.addEventListener("deviceready", function () {
        window.FirebasePlugin.setAnalyticsCollectionEnabled(true);
        window.FirebasePlugin.setScreenName("Module_Play_Status");
        // Log only the module name for the Epic Quest section
        if (lessonName.toLowerCase() === "epic quest") {
            moduleName = lessonName;
            window.FirebasePlugin.logEvent("Module_Play_Status", { action: 'add', type: 'Section_Open', moduleName, elapsedTime });
        }
        else {
            window.FirebasePlugin.logEvent("Module_Play_Status", { action: 'add', type: 'Section_Open', moduleName, levelName, lessonName, elapsedTime });
        }
    }, false);
}
class AppModifications {
    forceNavigationOverride() {

        if (window.history && window.history.pushState) {
            window.addEventListener("popstate", function (e) {
                if (this.props.forceBack) {
                    let THIS = this;
                    e.preventDefault();
                    pubbly.analytics.add({ type: "bc" }, function () {
                        window.location.href = THIS.props.forceBack;
                        calculateTime();
                    });
                    window.setTimeout(function () {
                        window.location.href = THIS.props.forceBack;
                    }, 2000);
                } else {
                    // Warning of data loss?
                }
            }.bind(this));
        }
    }
    constructor(props) {
        this.props = Object.assign({
            forceBack: false,
        }, props);
        startTime = new Date();
        this.forceNavigationOverride();
    }
}