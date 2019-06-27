function PubblyDom(xml, environment) {
    this.dom;
    this.build = function (environment) {
        let info = xml.info;
        let spreadWidth = (info.display == "composite") ? info.width * 2 : info.width;
        let domHeight = 0;
        let domWidth = 0;

        // Creates DOM skeleton. Also attaches sizing values via $().css({});
        $("#pubbly_main").append("<div id='header'></div>");
        $("#pubbly_main").append("<div id='canvases'></div>");
        $("#pubbly_main").append("<div id='footer'></div>");

        // Header
        $("#pubbly_main #header").append("<div id='bullet' style='background-color:" + info.bullet + ";'></div>");
        $("#pubbly_main #header").append("<p id='title'>" + info.name + "</p>");
        // Navigation UI now made from NavigationUI.init() call inside pubbly
        //  -- Because no navigation, no UI
        //  Also because we disable/enable nav during loads and turns and such.
        // $("#pubbly_main #header").append(messyHTML("nav"));
        $("#pubbly_main #header").css({ "width": spreadWidth });


        // Place to append video elements so they actually redraw on canvas at frame
        $("#pubbly_main").append("<!-- assetVisitorCenter is where I put video elements while they play. Cause there's no new Video() yet, and unless it's actually IN THE DOM, drawing a playing video on a canvas will only getcha the first frame -->");
        $("#pubbly_main").append("<div id='assetVisitorCenter'></div>");

        // Canvases
        $("#pubbly_main #canvases").append("<div id='cancover'></div>");
        $("#pubbly_main #canvases #cancover").addClass("noselect");

        // Loader
        $("#pubbly_main #cancover").append("<div id='loaderCont'></div>");

        $("#pubbly_main").append("<div id='workspaces'></div>");
        $("#pubbly_main #workspaces").css("display", "none");

        // textarea field for editable text
        $("#pubbly_main").append('<textarea id="textEntryHidden" type="text" autocorrect="off" autocomplete="off" autocapitalize="off" spellcheck="off"></textarea>');
        /*
         * Advantage, always scroll screen center
         * Disadvantage, non negative z index browsers show textarea
         $("#pubbly_main #textEntryHidden").css({
         "position": "absolute",
         "z-index": -1,
         "left": "50%",
         "top": "50%",
         });
         */
        // Changed... super left was still getting touch events, but only on David's egg tap book? Display none, no text areas in EQ anyway, figure out later.
        $("#pubbly_main #textEntryHidden").css({
            "position": "absolute",
            "z-index": -1,
            "top": "50%",
            "display": "none",
        });

        // Why in two ident blocks? Easier than appendBefore
        if (info.display == "composite") {
            $("#pubbly_main #canvases").addClass("composite");

            $("#pubbly_main #canvases #cancover").append(`<div class='previousSpreadLeft canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='previousSpreadLeft'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='previousSpreadRight canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='previousSpreadRight'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='previous canPlacer'>
                <canvas height=${info.height} width=${spreadWidth}
                class='previous'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='currentSpreadLeft canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='currentSpreadLeft'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='currentSpreadRight canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='currentSpreadRight'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='current canPlacer'>
                <canvas height=${info.height} width=${spreadWidth}
                class='current'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='nextSpreadLeft canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='nextSpreadLeft'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='nextSpreadRight canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='nextSpreadRight'></canvas>
                </div>`);


            $("#pubbly_main #canvases #cancover").append(`<div class='next canPlacer'>
                <canvas height=${info.height} width=${spreadWidth}
                class='next'></canvas>
                </div>`);

        } else {
            $("#pubbly_main #canvases").addClass("singlePage");

            $("#pubbly_main #canvases #cancover").append(`<div class='previous canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='previous'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='current canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='current'></canvas>
                </div>`);

            $("#pubbly_main #canvases #cancover").append(`<div class='next canPlacer'>
                <canvas height=${info.height} width=${info.width}
                class='next'></canvas>
                </div>`);
        }

        // Footer
        $("#pubbly_main #footer").append("<img class='logo' />");
        $("#pubbly_main #footer").append("<div class='clearfix'></div>");

        // Styling
        $("#pubbly_main #canvases #cancover").css({ "height": info.height, "width": spreadWidth });
        $("#pubbly_main #canvases").css({ "height": info.height, "width": spreadWidth });

        // Viewport sizing for mobiles
        // TODO: Do this on every viewport size change.
        domHeight = info.height + 111; // margins, subject to change
        domWidth = spreadWidth + 30; // margins
        let viewportScale = Math.min(screen.height / domHeight, screen.width / domWidth);
        let viewportScaleNoMargins = Math.min(screen.height / info.height, screen.width / spreadWidth);

        if (environment === "app") {
            $("#viewport").attr("content", "initial-scale=" + viewportScaleNoMargins + ", width=device-width, user-scalable=no");
        } else {
            $("#viewport").attr("content", "initial-scale=" + viewportScale);
        }

        // TODO: Update the goto with stuff
        for (let p = 0; p < xml.pages.length; p++) {
            let pageName = xml.pages[p].name;
            $("select.goto").append("<option class='page_" + p + "' val='" + pageName + "'>" + pageName + "</option>");
        }

        // Center mode, TODO: make a full screen and some other modes
        $("#main").addClass("transformCenterCont");
        $("#main > div").addClass("transformCenter");

        function scalingYCoordinate(screenAttributes) {
            screenAttributes.style.height = '100%';
            //  Converting 100% to pixel
            var totalpixel = parseFloat(window.getComputedStyle(screenAttributes).height);
            screenAttributes.style.height = domHeight;
            //  Calculating Scale % to increase the width of the screen
            return (totalpixel / info.height);
        }

        function scalingXCoordinate(screenAttributes) {
            screenAttributes.style.width = '100%';
            //  Converting 100% to pixel
            var totalpixel = parseFloat(window.getComputedStyle(screenAttributes).width);
            screenAttributes.style.width = domWidth;
            //  Calculating Scale % to increase the width of the screen
            return (totalpixel / info.width);
        }

        window.setTimeout(function (screenAttributes) {
            var screenAttributes = document.getElementsByClassName('transformCenter')[0];
            if (viewportScaleNoMargins > 1) {
                screenAttributes.style.top = "-7%";
                screenAttributes.style.left = "-1%";
                screenAttributes.style.transform = 'translate(0%,0%)';
                if (!(document.body.clientWidth === screen.width && document.body.clientHeight === screen.height)) {
                    if ((screen.height / info.height) > (screen.width / spreadWidth)) {
                        var scalingFactor = scalingYCoordinate(screenAttributes);
                        //  Calculating translate % for translating image to center and then scale it
                        var translatingFactor = (scalingFactor - 1) * 50;
                        screenAttributes.style.transform = 'translateY(' + translatingFactor + '%) scaleY(' + scalingFactor + ')';
                    }
                    else {
                        var scalingFactor = scalingXCoordinate(screenAttributes);
                        //  Calculating translate % for translating image to center and then scale it
                        var translatingFactor = (scalingFactor - 1) * 50;
                        screenAttributes.style.transform = 'translateX(' + translatingFactor + '%) scaleX(' + scalingFactor + ')';
                    }
                }
            }
            else {
                if (!(document.body.clientWidth === screen.width && document.body.clientHeight === screen.height)) {
                    screenAttributes.style.top = "-7%";
                    screenAttributes.style.left = "-1%";
                    screenAttributes.style.transform = 'translate(0%,0%)';
                    if ((screen.height / info.height) > (screen.width / spreadWidth)) {
                        var scalingFactor = scalingYCoordinate(screenAttributes);
                        //  Calculating translate % for translating image to center and then scale it
                        var translatingFactor = (scalingFactor - 1) * 50;
                        screenAttributes.style.transform = 'translateY(' + translatingFactor + '%) scaleY(' + scalingFactor + ')';
                    }
                    else {
                        var scalingFactor = scalingXCoordinate(screenAttributes);
                        //  Calculating translate % for translating image to center and then scale it
                        var translatingFactor = (scalingFactor - 1) * 50;
                        screenAttributes.style.transform = 'translateX(' + translatingFactor + '%) scaleX(' + scalingFactor + ')';
                    }
                }
            }
        }, 1);

        // Buid the DOM elem to return
        this.dom = {
            main: $("#pubbly_main"),
            header: $("#header"),
            textEntryHidden: $("#textEntryHidden"),
            canvases: $("#canvases"),
            workspaces: $("#workspaces"),
            canPlacers: {
                previousSpreadLeft: $("div.previousSpreadLeft.canPlacer"),
                previousSpreadRight: $("div.previousSpreadRight.canPlacer"),
                previous: $("div.previous.canPlacer"),
                currentSpreadLeft: $("div.currentSpreadLeft.canPlacer"),
                currentSpreadRight: $("div.currentSpreadRight.canPlacer"),
                current: $("div.current.canPlacer"),
                nextSpreadLeft: $("div.nextSpreadLeft.canPlacer"),
                nextSpreadRight: $("div.nextSpreadRight.canPlacer"),
                next: $("div.next.canPlacer"),
            }
        };

    }

    this.build(environment);
    return this.dom;
}
