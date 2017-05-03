define(['datetime', 'dialogHelper', 'connectionManager', 'css!./style', 'html!./icons'], function (datetime, dialogHelper, connectionManager) {

    return function (options) {

        var self = this;
        var dlg;

        self.show = function () {
            createElements(options);

            startSlideshow(options);
        };

        function createElements(options) {

            dlg = dialogHelper.createDialog({
                exitAnimationDuration: 800,
                size: 'fullscreen'
            });

            dlg.classList.add('slideshowDialog');

            var html = '<div class="kenburns-slideshowImage" id="kenburns-slideshow2"></div><h1 class="kenburns-slideshowImageText"></h1>';
            dlg.innerHTML = html;

            document.body.appendChild(dlg);

            dialogHelper.open(dlg).then(function () {
                dlg.parentNode.removeChild(dlg);
            });
        }

        function startSlideshow(options) {

            var items = options.items;

            var imgUrls = [];
            var imgDates = [];
            $.each(items, function (index, item) {
                var url = getImgUrl(item);
                if (url != null) {
                    imgUrls.push(url);

                    if (!items[index].PremiereDate)
                        imgDates.push('');
                    else {
                        var date = datetime.parseISO8601Date(items[index].PremiereDate);
                        imgDates.push(date.toLocaleDateString());
                    }
                }
            });

            var cardImageContainer = dlg.querySelector('.kenburns-slideshowImage');

            var width = window.innerWidth;
            var height = window.innerHeight;

            cardImageContainer.style.width = width + "px";
            cardImageContainer.style.height = height + "px";

            $('#kenburns-slideshow2').bind('afterFadeIn', function (e, imgDate) {
                document.querySelector('.kenburns-slideshowImageText').innerHTML = imgDate;
            });

            $('#kenburns-slideshow2').bind('beforeFadeOut', function (e, imgDate) {
                document.querySelector('.kenburns-slideshowImageText').innerHTML = imgDate;
            });

            $('#kenburns-slideshow2').bind('afterFadeOut', function (e, imgDate) {
                document.querySelector('.kenburns-slideshowImageText').innerHTML = imgDate;
            });

            $('#kenburns-slideshow2').bind('beforeFadeIn', function (e, imgDate) {
                document.querySelector('.kenburns-slideshowImageText').innerHTML = imgDate;
            });

            $('#kenburns-slideshowImage').slideshowify({
                dataUrl: "http://gallerama.com/services/gallery/get.php?gid=2107&versions[]=9",
                dataType: "jsonp",
                parentEl: cardImageContainer,
                aniSpeedMin: 10000, // shortest ani8mation will be 8 seconds
                aniSpeedMax: 23000, // longest animation will be 10 seconds
                imgs: imgUrls,
                imgDates: imgDates
            });
        }

        function getImgUrl(item) {

            var apiClient = connectionManager.getApiClient(item.ServerId);

            return getImageUrl(item, {
                type: "Primary",
                maxWidth: window.innerWidth / options.scale,
                maxHeight: window.innerHeight / options.scale
            }, apiClient);
        }

        function getImageUrl(item, options, apiClient) {

            options = options || {};
            options.type = options.type || "Primary";

            if (typeof (item) === 'string') {
                return apiClient.getScaledImageUrl(item, options);
            }

            if (item.ImageTags && item.ImageTags[options.type]) {

                options.tag = item.ImageTags[options.type];
                return apiClient.getScaledImageUrl(item.Id, options);
            }

            if (options.type == 'Primary') {
                if (item.AlbumId && item.AlbumPrimaryImageTag) {

                    options.tag = item.AlbumPrimaryImageTag;
                    return apiClient.getScaledImageUrl(item.AlbumId, options);
                }
            }

            return null;
        }

        self.hide = function () {
            var dialog = dlg;
            if (dialog) {

                dialogHelper.close(dialog);
            }
        };
    }
});