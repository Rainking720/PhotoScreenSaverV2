define(['pluginManager'], function (pluginManager) {

    return function () {

        var self = this;        
        self.name = 'Photos ScreenSaver V2';
        self.type = 'screensaver';
        self.id = 'photoscreensaver2';
        self.supportsAnonymous = false;

        var currentSlideshow;

        self.show = function () {

            var query = {
                IncludeItemTypes: "Photo",
                SortBy: "Random",
                Recursive: true,
                Fields: "PremiereDate",
                ImageTypeLimit: 1,
                StartIndex: 0,
                Limit: 150
            };

            Emby.Models.items(query).then(function (result) {

                if (result.Items.length) {

                    require([pluginManager.mapPath(self, 'kenburns-slideshow2.js')], function (slideshow) {

                        var newSlideShow = new slideshow({
                            showDate: true,
                            cover: true,
                            fadeSpeed: 1200,
                            interval: 15000,
                            duration: 15000,
                            items: result.Items,
                            scale: .95
                        });

                        newSlideShow.show();
                        currentSlideshow = newSlideShow;
                    });
                }
            });
        };

        self.hide = function () {

            if (currentSlideshow) {
                currentSlideshow.hide();
                currentSlideshow = null;
            }
        };
    }
});