Acme.Feed = function() {};

Acme.Feed.prototype.fetch = function()
{

    var self = this;
    // self.elem.html("Please wait...");
    // blogfeed makes 2 sql calls.  
    //      Offset is to get pinned contect 
    //      nonPinnedOffset gets the rest
    //      They're combined to return full result

    if (self.options.search != null) {
        self.options.blogid = this.options.blogid; // search takes an id instead of a guid
    }

    return Ajax_LoadFeed(self.options).done(function(data) {
        if (data.success == 1) {
            console.log(data);
            self.render(data);
        }
    });
};

Acme.Feed.prototype.events = function() 
{
    var self = this;
    self.elem.unbind().on('click', function(e) {
        e.preventDefault();
        self.fetch();
    });

    if (this.infinite && this.offset >= this.limit) {
        self.waypoint = new Waypoint({
            element: self.elem,
            offset: '80%',
            handler: function (direction) {
                console.log('starting fetch');
                if (direction == 'down') {
                    self.fetch();
                }
            }
        });
    }
};






Acme.View.articleFeed = function(options)
{
    this.feedModel  = options.model;
    this.limit      = options.limit      || 10;
    this.offset     = options.offset     || 0;
    this.infinite   = options.infinite   || false;
    this.failText   = options.failText   || null;
    this.container  = $('#' + options.container);
    this.template   = options.cardTemplate;
    this.cardClass  = options.card_class;
    this.renderType = options.renderType || 'append';
    this.before     = options.before     || false;
    this.after      = options.after      || false;
    this.button_label = options.label    || false;
    
    this.options    = {
        'nonPinnedOffset'   :   options.non_pinned || -1,
        'loadtype'          :   options.loadtype || "home",
        'offset'            :   options.offset || 0,
        'blogid'            :   options.blogid,
        'search'            :   options.searchterm    || null,
        'limit'             :   options.limit,
        // 'page'              :   self.elem.data('page') || 1, // page is used for user articles
    };

    this.waypoint  = false;
    
    // This is the load more button
    this.elem      = $('#' + options.name);
    // This is the load LESS button if you have one
    this.lessElem  = $('#less-' + options.name);
    this.failText  = options.failText || null;
    this.events();
};

Acme.View.articleFeed.prototype = new Acme.Feed();
Acme.View.articleFeed.constructor = Acme.View.articleFeed;
Acme.View.articleFeed.prototype.render = function(data) 
{
    var self = this;
    var articles = [];
    if (data.articles) {
        articles = data.articles;
    }
    if (data.userArticles) {
        articles = data.userArticles;
    }
    if (data.users) {
        articles = data.users.users;
    }


    var label = "";
    if (typeof self.button_label != "undefined" || self.button_label != false ) {
        label = self.button_label;
    }
    var ads_on =   self.ads || null;

    self.elem.html(label);
    self.lessElem.show();

    // add counts to the dom for next request
    self.options.offset += self.options.limit;
    self.options.nonPinnedOffset = data.existingNonPinnedCount;

    var html = [];
    if (ads_on == "yes") {
        html.push( window.templates.ads_infinite );
    }

    if (articles.length === 0 && self.failText) {
        html = ["<p>" + self.failText + "</p>"];
    } else {
        for (var i in articles) {
            articles[i].imageOptions = {'width': self.imgWidth, 'height': self.imgHeight};
            html.push( self.feedModel.renderCard(articles[i], {
                cardClass: self.cardClass,
                template: self.template,
                type: ""
            }));
        }
        if (self.before ) {
            html = [self.before].concat(html);
        }
        if (self.after) {
            html = html.concat([self.after]);
        }
    
    }

    (self.renderType === "write")
        ? self.container.empty().append( html.join('') )
        : self.container.append( html.join('') );
    

    // show or hide the load more button depending on article count
    (articles.length < self.options.limit && !this.infinite) 
        ? self.elem.css('display', 'none')
        : self.elem.show();

    // reset infinite load depending on article count
    console.log(self.waypoint);
    if (self.waypoint) {
        (articles.length < self.options.limit)
            ? self.waypoint.disable()
            : self.waypoint.enable();
    }

    // $(".card .content > p, .card h2, .card .content .author > p").dotdotdot();     
    // $('.video-player').videoPlayer();
    $("div.lazyload").lazyload({
        effect: "fadeIn"
    });

    // self.elem.data('rendertype', '');
    this.feedModel.events();
};








