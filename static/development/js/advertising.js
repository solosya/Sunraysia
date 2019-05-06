(function($) {
    if ($(".j-adslot").length > 0) {
        var adslots = $(".j-adslot");
        var deviceSize = getDeviceForAd();
        for (i=0;i<adslots.length;i++) {
            var elem = adslots[i];
            var adShape = elem.dataset.adshape;
            var self = $("#"+elem.id);
            self.removeClass("j-adslot");
            if (adShape == "mrec"){
                self.html("<div class='advertisment advertisment__"+adShape+" advertisment__"+deviceSize+"'><img src='https://res.cloudinary.com/cognitives/image/upload/c_thumb,dpr_auto,f_auto,fl_lossy,q_auto,w_300/b8p32qun5ovsedngdth8'></div>");
            } else if (adShape == "banner") {
                if (deviceSize == "desktop") {
                    self.html("<div class='advertisment advertisment__"+adShape+" advertisment__"+deviceSize+"'><!-- /21651851619/PH --><div id='div-gpt-ad-1555304800383-0' style='height:90px; width:970px;'><script>googletag.cmd.push(function() { googletag.display('div-gpt-ad-1555304800383-0'); });</script></div></div>");
                } else if (deviceSize == "tablet") {
                    self.html("<div class='advertisment advertisment__"+adShape+" advertisment__"+deviceSize+"'><!-- /21651851619/PH --><div id='div-gpt-ad-1555304898119-0' style='height:90px; width:728px;'><script>googletag.cmd.push(function() { googletag.display('div-gpt-ad-1555304898119-0'); });</script></div></div>");
                } else if (deviceSize == "mobile") {
                    self.html("<div class='advertisment advertisment__"+adShape+" advertisment__"+deviceSize+"'><!-- /21651851619/PH --><div id='div-gpt-ad-1555304984686-0' style='height:100px; width:300px;'><script>googletag.cmd.push(function() { googletag.display('div-gpt-ad-1555304984686-0'); });</script></div></div>");
                }
            }

        }
    }

    function getDeviceForAd() {
        var width = $(window).width();
        if (width > 991) {
            return 'desktop';
        } else if (width < 992 && width > 767) {
            return 'tablet';
        } else if (width < 768) {
            return 'mobile';
        }
    }
}(jQuery));
