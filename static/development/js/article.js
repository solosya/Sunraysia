Acme.ArticleController = function() {
    return new Acme.article();
}
Acme.article = function() {
    this.events();
};



Acme.article.prototype.events = function() {
    var self=this;

    $("#purchase, #favourite").on('click', function(e) {

        var elem = $(e.target);
        var guid = elem.data('guid');
        var id = elem.data('id');
        var url = elem.data('url');
        var caption = elem.data('caption');
        var action = elem.data('action');

        var photo = {
            guid: guid,
            id: id,
            url: [url],
            caption: caption,
            cart: true,
            saveType: "cart"
        };


        if ( _appJsConfig.isUserLoggedIn === 1 ) {
            Acme.server.create('/api/user/follow-media', {
                guid: guid,
                type: action
            }).then(function(r) {
                console.log(r);           
            });

        } else {

            var cart = [];
            var cartjson = localStorage.getItem('cart');
            if ( cartjson !== null) {
                cart = JSON.parse( cartjson );
            }
    
            var found = cart.filter(function(item) {
                return item.id !== photo.id;
            });
    
            if (found.length < cart.length) {
                // cart = found;
            } else {
                cart.push(photo);
            }
    
            localStorage.setItem('cart', JSON.stringify(cart));
    
        }


    });
}