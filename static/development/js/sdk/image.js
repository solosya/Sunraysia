
(function ($) {
    
    $.image = function (options) {
        var defaults = {
            media : {},
            mediaOptions: {}
        };

        var opts = $.extend({}, defaults, options);
        
        var imageId = opts.media.id;
        var path = opts.media.path;
        var cloudName = opts.media.cloudName;
        if(typeof cloudName === 'undefined' || cloudName === '') {
            return;
        }
        
        $.cloudinary.config({cloud_name:cloudName});
        if(imageId === '' &&  path === '') {
            return;
        }
        
        if (opts.width !== 0) {
            opts.mediaOptions.width = opts.width;
        }
        if (opts.height !== 0) {
            opts.mediaOptions.height = opts.height;
        } 

        if (opts.mediaOptions.width === 0) {
            delete opts.mediaOptions.width;
        }

        if (opts.mediaOptions.height === 0) {
            delete opts.mediaOptions.height;
        }

        opts.mediaOptions.gravity = opts.gravity || 'faces:auto';

        var url = $.cloudinary.url(imageId, opts.mediaOptions);

        return url;
    };
    
    $.video = function (options) {
        var defaults = {
            media : {},
            width: 700,
            height:400,
            mediaOptions: {}
        };

        var opts = $.extend({}, defaults, options);
        
        var videoId = opts.media.videoId;
        var path = opts.media.path;
        var cloudName = opts.media.cloudName;
        if(typeof cloudName === 'undefined' || cloudName === '') {
            return;
        }
        
        $.cloudinary.config({cloud_name:cloudName});
        if(videoId === '' &&  path === '') {
            return;
        }
        var videoOptions = $.extend({},{height: opts.height, width: opts.width}, opts.mediaOptions);
        var url = $.cloudinary.video(videoId, videoOptions);
        
        return url;
    };
}(jQuery));