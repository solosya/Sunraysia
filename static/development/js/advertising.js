(function($) {
    Acme.LoadAds = function() {
        if ($(".j-adslot").length > 0) {
            var adslots = $(".j-adslot");
            var deviceSize = getDeviceForAd();
            
            var allAdsKeywords = []
            for (var i=0;i<adslots.length;i++) {
                var elem = adslots[i];
                var self = $("#"+elem.id);
                self.removeClass("j-adslot");
                self.addClass("j-adslot-filled");
                let keysArray = [elem.id,deviceSize];
                if ($(".j-keyword-cont").length > 0) {
                    var keywordCont = $(".j-keyword-cont")[0];
                    var keysExtra = keywordCont.dataset.keywords.split(',');
                    if (keysExtra[0] != ""){
                        for (var j=0;j<keysExtra.length;j++){
                            if (keysExtra[j] != "") {
                                keysArray.push(keysExtra[j]);
                            }
                        }
                    } else {
                        keysArray.push('default');
                    }
                } else {
                    keysArray.push('default');
                }
                var keysString = keysArray.join(',')
                allAdsKeywords.push(keysString)
            }


            if(allAdsKeywords.length > 0) {
                $.ajax({
                    type: 'POST',
                    url: _appJsConfig.appHostName + '/api/ad/get-all',
                    dataType: 'json',
                    data: {
                        'multiKeywords': allAdsKeywords,
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data.length < 1 ){
                            console.log('no ads found with those keywords',keysString)
                            return;
                        } 

                        let k = 0;
                        for (k; k < data.length; k++) {

                            if (data[k].length < 1) {
                                continue;
                            }

                            let index = 0;
                            if (data[k].length > 1) {
                                index = Math.floor(Math.random() * data[k].length);
                            }

                            let item = data[k][index]
                            let keys = item.keywords.split(",");

                            if (item.media.path){
                                $("#"+keys[0]).html("<div class='advertisment advertisment__"+keys[0]+" advertisment__"+keys[1]+"'><a href='"+item.button.url+"'><img src='"+item.media.path+"'></a></div>");
                            } 
                            else if (item.description){
                                $("#"+keys[0]).html("<div class='advertisment advertisment__"+keys[0]+" advertisment__"+keys[1]+"'>"+item.description+"</div>");
                            }
                        }
 
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('error retreiving ad', textStatus, errorThrown);
                        $('#createUserErrorMessage').text(textStatus);
                    },
                });
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
    }

    Acme.LoadAds()
}(jQuery));
