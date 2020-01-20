
var Card = function() {
    this.events();
};


Card.prototype.renderCard = function(card, options)
{

    options = options || {};
    var template = (options.template) ? Acme.templates[options.template] : Acme.templates.systemCardTemplate;
    card['containerClass'] = options.cardClass || "";
    card['cardType'] = options.type || "";
    card['lightbox'] = options.lightbox || "";


    
    if (card.status == "draft") {
        card['articleStatus'] = "draft";
        card['containerClass'] += " draft"; 
    }

    card['pinTitle'] = (card.isPinned == 1) ? 'Un-Pin Article' : 'Pin Article';
    card['pinText']  = (card.isPinned == 1) ? 'Un-Pin' : 'Pin';
    card['promotedClass'] = (card.isPromoted == 1)? 'ad_icon' : '';

    // mainly for screen to turn off lazyload and loading background img
    // card['imgClass'] = (card.lazyloadImage == false) ? '' : 'lazyload';
    // card['imgBackgroundStyle'] = (card.lazyloadImage == false) ? '' : 'style="background-image:url(https://placeholdit.imgix.net/~text?w=1&h=1)"';
    

    // card['readingTime']= self.renderReadingTime(card.readingTime);
    
    var width = typeof options.imageWidth !== "undefined" ? options.imageWidth : 500;
    var height = typeof options.imageHeight !== "undefined" ? options.imageHeight : 350;
    var gravity = typeof options.imageGravity !== "undefined" ? options.imageGravity : null;

    if (options.imageOriginal) {
        var width = card.featuredMedia.width;
        var height = card.featuredMedia.height;
    }

    if (card.imageOptions) {
        width = card.imageOptions.width || width;
        height = card.imageOptions.height || height;
        gravity = card.imageOptions.gravity || gravity;
    }

    var articleContent = card.excerpt;
    if (typeof options.content != "undefined" && options.content === "full") {
        articleContent = '<div class="acme-c-cards-view__articleContent"><p>' + card.content + '</p></div>';
    }
    

    card['titleString'] = "";
    if (_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
        var totalstring = "";
        var totals = (card.total ) ? card.total : false;
        if ( totals ) {
            totalstring = "Viewed " + totals.view + " times";
            totalstring = totalstring + " Published " + card.publishedDateTime;
        }
        card['titleString'] = totalstring;
    }




    var articleId = parseInt(card.articleId);

    if (card.social) {
        card['hasMediaClass'] = (card.social.hasMedia == 1)? 'withImage__content' : 'without-image';

        card.params = {
            id          : card.socialId,
            guid        : card.socialGuid,
            image       : card.social.media.path,
            category    : card.social.source,
            title       : "",
            content     : card.social.content,
            author      : card.social.user.name,
            publishDate : card.publishDate,
            videoClass  : card.social.media['type'] == 'video' ? 'c-cards-view__media--video' : '',
            hasMedia    : card.social.hasMedia,
            social      : 1
        }

    } else {
        card['hasMediaClass'] = (card.hasMedia == 1)? 'withImage__content' : 'without-image';
        var imageOptions = {width: width , height: height, crop: 'fill', gravity: gravity};
        var imageUrl = $.image( {
            media : card['featuredMedia'], 
            mediaOptions: imageOptions
        });
        card.params = {
            id          : articleId,
            guid        : card.guid,
            image       : imageUrl,
            category    : card.label,
            title       : card.title,
            content     : articleContent,
            author      : card.createdBy.displayName,
            publishDate : card.publishDate,
            videoClass  : card.featuredMedia['type'] == 'video' ? 'c-cards-view__media--video' : '',
            hasMedia    : card.hasMedia,
            social      : 0

        };


    }

    var articleTemplate = Handlebars.compile(template);

    return articleTemplate(card);
}

Card.prototype.renderReadingTime = function (time) 
{
    if (time <= '59') {
        return ((time <= 0) ? 1 : time) + ' min read';
    } else {
        var hr = Math.round(parseInt(time) / 100);
        return hr + ' hour read';
    }
};



// events
Card.prototype.bindPinUnpinArticle = function()
{
    $('button.PinArticleBtn').Ajax_pinUnpinArticle({
        onSuccess: function(data, obj){
            var status = $(obj).data('status');
            var obj = $(obj);
            (status == 1) 
                ? obj.attr('title', 'Un-Pin Article') 
                : obj.attr('title', 'Pin Article');
            (status == 1) 
                ? obj.find('span').first().html('Un-Pin')
                : obj.find('span').first().html('Pin');        
        }
    });
};

Card.prototype.bindDeleteHideArticle = function()
{
    $('button.HideBlogArticle').Ajax_deleteArticle({
        onSuccess: function(data, obj){
            $(obj).closest('.card').parent('div').remove();
            var postsCount = $('body').find('.card').length;
            if(postsCount <= 0) {
                $('.NoArticlesMsg').removeClass('hide');
            }
        }
    });
};

Card.prototype.bindSocialUpdatePost = function () 
{
    $(document).on('click', '.j-editSocialPost', function (e) {

        e.preventDefault();
        var elem = $(this);
        var url = elem.data('url');
        var popup = window.open(url, '_blank', 'toolbar=no,scrollbars=yes,resizable=false,width=360,height=450');
        popup.focus();

        var intervalId = setInterval(function () {
            if (popup.closed) {
                clearInterval(intervalId);
                var socialId = elem.parents('a').data('id');
                if ($('#updateSocial' + socialId).data('update') == '1') {
                    $().General_ShowNotification({message: 'Social Post(s) updated successfully.'});
                }
            }
        }, 50);

        return;
    });
};

Card.prototype.bindLightbox = function()
{

    var isRequestSent = false;
    var self = this;
    $('article.lightbox').unbind().on('click', function (e) {

        e.preventDefault();
        var csrfToken = $('meta[name="csrf-token"]').attr("content");

        var layouts = {
            "classifieds" : 'systemCardTemplate',
        };

        Acme.LightBox = new Acme.lightBox('modal', 'lightbox-modal', layouts);
        
        Acme.LightBox.render(null, "Classifieds", {});
        Acme.LightBox.renderPreLayout('<div class="spinner" style="position:relative;height:70px;margin-top:30px;margin-bottom:30px"></div>');

        var isSocial = $(this).parent().data('social');
        var action = 'POST';

        if (isSocial) {
            var url = '/api/social/get-social-post';
            var blogGuid = $(this).parent().data('blog-guid');
            var postGuid = $(this).parent().data('guid');
            var payload = {blog_guid: blogGuid, guid: postGuid, _csrf: csrfToken}
        } else {
            var url = '/api/article/get-article';
            var articleId = $(this).parent().data('id');
            var payload = {articleId: articleId, _csrf: csrfToken}
            action = 'GET';
        }


        if (!isRequestSent) {

            $.ajax({
                type: action,
                url: _appJsConfig.appHostName + url,
                dataType: 'json',
                data: payload,
                success: function (data, textStatus, jqXHR) {

                    data.hasMediaVideo = false;
                    if (data.media['type'] === 'video') {
                        data.hasMediaVideo = true;
                    }
                    
                    if (data.source == 'youtube') {
                        var watch = data.media.videoUrl.split("=");
                        data.media.videoUrl = "https://www.youtube.com/embed/" + watch[1];
                    }
                    

                    data.templatePath = _appJsConfig.templatePath;



                    var article = self.renderCard(data, {
                        cardClass : "acme-card-10-mobile acme-card-10-tablet acme-card-10-desktop",
                        type : "acme-",
                        content: "full",
                        imageOriginal: true,
                    });

                    Acme.LightBox.renderPreLayout(article);

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown, textStatus, jqXHR);
                    isRequestSent = false;
                },
                beforeSend: function (jqXHR, settings) {
                    isRequestSent = true;
                },
                complete: function (jqXHR, textStatus) {
                    isRequestSent = false;
                }
            });
        }
    });
};

Card.prototype.initDraggable = function()
{

    $('.swap').draggable({
        helper: 'clone',
        revert: true,
        zIndex: 100,
        scroll: true,
        scrollSensitivity: 100,
        cursorAt: { left: 150, top: 50 },
        appendTo:'body',
        start: function( event, ui ) {
            ui.helper.attr('class', '');
            var postImage = $(ui.helper).data('article-image');
            var postText = $(ui.helper).data('article-text');
            if(postImage !== "") {
                $('div.SwappingHelper img.article-image').attr('src', postImage);
            }
            else {
                $('div.SwappingHelper img.article-image').attr('src', 'http://www.placehold.it/100x100/EFEFEF/AAAAAA&amp;text=no+image');
            }
            $('div.SwappingHelper p.article-text').html(postText);
            $(ui.helper).html($('div.SwappingHelper').html());    
        }
    });
};

Card.prototype.initDroppable = function()
{
    var self = this;

    $('.swap').droppable({
        hoverClass: "ui-state-hover",
        drop: function(event, ui) {
            function getElementAtPosition(elem, pos) {
                return elem.find('a.card').eq(pos);
            }

            var sourceObj       = $(ui.draggable);
            var destObject      = $(this);
            var sourceProxy     = null;
            var destProxy       = null;


            if (typeof sourceObj.data('proxyfor') !== 'undefined') {
                sourceProxy = sourceObj;
                sourceObj   = getElementAtPosition($( '.' + sourceProxy.data('proxyfor')), sourceProxy.data('position') -1);
                sourceObj.attr('data-position', destObject.data('position'));

            }
            if (typeof destObject.data('proxyfor') !== 'undefined') {
                destProxy = destObject;
                destObject = getElementAtPosition($( '.' + destObject.data('proxyfor')), destObject.data('position') -1);
                destObject.attr('data-position', sourceObj.data('position'));
            }



            //get positions
            var sourcePosition      = sourceObj.data('position');
            var sourcePostId        = sourceObj.data('id');
            var sourceIsSocial      = parseInt(sourceObj.data('social'));
            var destinationPosition = destObject.data('position');
            var destinationPostId   = destObject.data('id');
            var destinationIsSocial = parseInt(destObject.data('social'));

            var swappedDestinationElement = sourceObj.clone().removeAttr('style').insertAfter( destObject );
            var swappedSourceElement = destObject.clone().insertAfter( sourceObj );
            

            if (sourceProxy) {
                sourceProxy.find('h2').text(destObject.find('h2').text());
                swappedDestinationElement.addClass('swap');
                swappedSourceElement.removeClass('swap');
                sourceProxy.attr('data-article-text', destObject.data('article-text'));
                sourceProxy.attr('data-article-image', destObject.data('article-image'));
            }

            if (destProxy) {
                if (sourceIsSocial) {
                    destProxy.find('h2').text( sourceObj.find('p').text() );
                } else {
                    destProxy.find('h2').text( sourceObj.find('h2').text() );
                }
                swappedSourceElement.addClass('swap');
                swappedDestinationElement.removeClass('swap');
                destProxy.attr('data-article-text', sourceObj.data('article-text'));
                destProxy.attr('data-article-image', sourceObj.data('article-image'));
            }
            
            swappedSourceElement.data('position', sourcePosition);
            swappedDestinationElement.data('position', destinationPosition);
            swappedSourceElement.find('.PinArticleBtn').data('position', sourcePosition);
            swappedDestinationElement.find('.PinArticleBtn').data('position', destinationPosition);


            $(ui.helper).remove(); //destroy clone
            sourceObj.remove();
            destObject.remove();
            
            var csrfToken = $('meta[name="csrf-token"]').attr("content");
            var postData = {
                sourcePosition: sourcePosition,
                sourceArticleId: sourcePostId,
                sourceIsSocial: sourceIsSocial,
                
                destinationPosition: destinationPosition,
                destinationArticleId: destinationPostId,
                destinationIsSocial: destinationIsSocial,
                
                _csrf: csrfToken
            };

            $.ajax({
                url: _appJsConfig.baseHttpPath + '/home/swap-article',
                type: 'post',
                data: postData,
                dataType: 'json',
                success: function(data){

                    if(data.success) {
                        $.fn.General_ShowNotification({message: "Articles swapped successfully"});
                    }
                    
                    $(".card p, .card h2").dotdotdot();
                    // self.events();
                    self.events_refresh();

                },
            });

        }
    }); 
};

Card.prototype.events_refresh = function() 
{
    if (_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
        this.initDroppable();
        this.initDraggable();        
        this.bindPinUnpinArticle();
        this.bindDeleteHideArticle();
    }
};

Card.prototype.events = function() 
{
    this.bindLightbox();

    if (_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
        this.initDroppable();
        this.initDraggable();        
        this.bindPinUnpinArticle();
        this.bindDeleteHideArticle();
        this.bindSocialUpdatePost();
    }
};
