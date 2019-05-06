Acme.Feed = function() {};

Acme.Feed.prototype.fetch = function()
{
    var self = this;
    self.elem.html("Please wait...");
    // blogfeed makes 2 sql calls.  
    //      Offset is to get pinned contect 
    //      nonPinnedOffset gets the rest
    //      They're combined to return full result

    if (self.options.search != null) {
        self.options.blogid = this.options.blogid; // search takes an id instead of a guid
    }

    return Ajax_LoadFeed(self.options).done(function(data) {
        if (data.success == 1) {
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
                if (direction == 'down') {
                    self.fetch();
                }
            }
        });
    }
};






Acme.View.articleFeed = function(options)
{
    this.feedModel = options.model;
    this.limit     = options.limit      || 10;
    this.offset    = options.offset     || this.limit;
    this.infinite  = options.infinite   || false;
    this.failText  = options.failText   || null;
    this.container = $('#' + options.container);
    this.template  = options.cardTemplate;
    this.cardClass = options.card_class;

    this.options = {
        'nonPinnedOffset'   :   options.non_pinned || -1,
        'loadtype'          :   options.loadtype || "home",
        'offset'            :   options.offset || options.limit,
        'blogid'            :   options.blogid,
        'search'            :   options.searchterm    || null,
        'limit'             :   options.limit,
        // 'page'              :   self.elem.data('page') || 1, // page is used for user articles
    };

    this.waypoint  = false;
    this.elem      = $('#' + options.name);
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

    var label      =   self.button_label  || "Load more",
        ads_on     =   self.ads           || null;

    self.elem.html(label);

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
            console.log()
            articles[i].imageOptions = {'width': self.imgWidth, 'height': self.imgHeight};
            html.push( self.feedModel.renderCard(articles[i], self.cardClass, self.template) );
        }
    }

    (self.rendertype === "write")
        ? self.container.empty().append( html.join('') )
        : self.container.append( html.join('') );
    

    // show or hide the load more button depending on article count
    (articles.length < self.options.limit) 
        ? self.elem.css('display', 'none')
        : self.elem.show();

    // reset infinite load depending on article count
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








// used on my account page for managed users.  needed?
// Acme.View.userFeed = function(options)
// {
//     this.feedModel = options.model;
//     this.limit     = options.limit || 10;
//     this.offset    = options.offset || this.limit;
//     this.infinite  = options.infinite || false;
//     this.failText  = options.failText || null;
//     this.container = $('#' + options.container);
//     this.template  = options.cardTemplate;
//     this.cardClass = options.card_class;


//     this.options = {
//         'nonPinnedOffset'   :   options.non_pinned_offset || -1,
//         'loadtype'          :   options.loadtype || "home",
//         'offset'            :   options.offset || options.limit,
//         'blogid'            :   options.blogguid,
//         'search'            :   options.searchterm    || null,
//         'limit'             :   options.limit,
//         // 'page'              :   self.elem.data('page') || 1, // page is used for user articles
//     };

//     this.waypoint  = false;
//     this.elem      = $('#' + options.name);
//     this.events();
// };

// Acme.View.userFeed.prototype = new Acme.Feed();
// Acme.View.userFeed.constructor = Acme.View.userFeed;
// Acme.View.userFeed.prototype.parent = Acme.Feed.prototype;

// Acme.View.userFeed.prototype.render = function(data) 
// {
//     var self = this;
//     var users = data.users.users || data.users;



//     var label      =   self.button_label  || "Load more",
//         ads_on     =   self.ads           || null,
//         rendertype =   self.rendertype    || null;

//     self.elem.html(label);

//     // remove the load more button when finished
//     (users.length < self.options.limit) 
//         ? self.elem.css('display', 'none')
//         : self.elem.show();

//     // add counts to the dom for next request
//     self.options.offset += self.options.limit;

//     var html = [];

//     if (users.length === 0 && self.failText) {
//         html = ["<p>" + self.failText + "</p>"];
//     } else {
//         for (var i in users) {
//             users[i].imageOptions = {'width': self.imgWidth, 'height': self.imgHeight};
//             html.push( self.feedModel.renderCard(users[i], self.cardClass, self.template) );
//         }
//     }

//     (rendertype === "write")
//         ? self.container.empty().append( html.join('') )
//         : self.container.append( html.join('') );

        
//     (users.length < self.options.limit) 
//         ? self.elem.css('display', 'none')
//         : self.elem.show();


//     if (self.waypoint) {
//         (users.length < self.options.limit)
//             ? self.waypoint.disable()
//             : self.waypoint.enable();
//     }

    
//     $(".card .content > p, .card h2").dotdotdot();     
//     // $('.video-player').videoPlayer();
//     $("div.lazyload").lazyload({
//         effect: "fadeIn"
//     });
    
//     this.feedModel.events();

// };








// Acme.Usercard = function(){};
// Acme.Usercard.prototype.render = function(user, cardClass, template, type)
// {
//     user['cardClass'] = cardClass;
//     var template = (template) ? Acme.templates[template] : Acme.systemCardTemplate;
//     userTemplate = Handlebars.compile(template);
//     var template = userTemplate(user);
//     return template;
// }


