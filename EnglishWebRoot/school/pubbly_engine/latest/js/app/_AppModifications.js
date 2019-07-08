// Main class for all android/ios app modifications (assuming cordova)
var endTime, startTime;
function Calculate_time() {

    var url = window.location.pathname.split("/");
    url.pop(); // index.html
    var book = url.pop();
    var subject = url.pop();
    var Module_name = url.pop();

    function removeSpecialChars(str) {
        return str.replace(/%20/g, "    ");
    }
    var Module_Name = removeSpecialChars(Module_name);
    var Level_Name = removeSpecialChars(subject);
    var Lesson_Name = removeSpecialChars(book);

    endTime = new Date();
    var timeDiff = endTime - startTime; //in seconds
    timeDiff /= 1000;
    var Elapsed_Time = Math.round(timeDiff);
    console.log(Elapsed_Time + " Elapsed_Time");

    document.addEventListener("deviceready", function () {
        window.FirebasePlugin.setAnalyticsCollectionEnabled(true);
        window.FirebasePlugin.setScreenName("Module_Play_Status");

        if (Lesson_Name == "Epic    Quest") {
            Module_Name = Lesson_Name;
            window.FirebasePlugin.logEvent("Module_Play_Status", { action: 'add', type: 'business', Module_Name, Elapsed_Time });
        }
        else {
            window.FirebasePlugin.logEvent("Module_Play_Status", { action: 'add', type: 'business', Module_Name, Level_Name, Lesson_Name, Elapsed_Time });
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
                        Calculate_time();
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