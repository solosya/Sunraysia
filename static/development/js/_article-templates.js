/**
 * Handlebar Article templates for listing
 */

Acme.templates = {};

Handlebars.registerHelper('fixPrice', function(text) {
    if (!text) return "";
    return text.replace(/\$/g, "");
});



Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

// **********************************************************
//                         CARDS
// **********************************************************

var cardTemplateTop = 
'<div class="{{containerClass}} "> \
    <a  href="{{url}}" \
        class="swap" \
        data-id="{{params.id}}" \
        data-guid="{{params.guid}}" \
        data-position="{{position}}" \
        data-blog-title="{{params.blogTitle}}" \
        data-social={{params.social}} \
        data-article-image="{{{image}}}" \
        data-article-text="{{params.title}}" \
        title="{{titleString}}"> \
        \
        <article class="{{cardType}}c-cards-view {{# ifCond params.social "==" 1}} social {{/ifCond}} {{params.category}} {{hasMediaClass}} {{status}} {{lightbox}}">';

var cardTemplateBottom = 
        '</article>\
        \
        {{#if userHasBlogAccess}} \
            <div class="btn_overlay articleMenu"> \
                <button \
                    title       = "Hide" \
                    data-guid   = "{{guid}}" \
                    class       = "btnhide social-tooltip HideBlogArticle" \
                    type        = "button" \
                    data-social = "0"> \
                    <i class="fa fa-eye-slash">\
                    </i><span class="u-display-none">Hide</span> \
                </button> \
                \
                <button \
                    onclick="window.location=\'{{{editUrl}}}\'; return false;" \
                    title="Edit" \
                    class="btnhide social-tooltip" \
                    type="button"> \
                    <i class="fa fa-edit"></i>\
                    <span class="u-display-none">Edit</span> \
                </button> \
                \
                <button data-position="{{position}}" \
                        data-social="0" \
                        data-id="{{articleId}}" \
                        title="{{pinTitle}}" \
                        class="btnhide social-tooltip PinArticleBtn {{# ifCond isPinned "==" 1 }}selected{{/ifCond}}" \
                        type="button" \
                        data-guid= "{{guid}}" \
                        data-status="{{isPinned}}"> \
                    <i class="fa fa-thumb-tack"></i>\
                    <span class="u-display-none">{{pinText}}</span> \
                </button> \
            </div> \
         {{/if}}\
    </a>\
</div>';



Acme.templates.systemCardTemplate = 
    cardTemplateTop + 
        '{{#if params.hasMedia}}\
            <figure class="{{cardType}}c-cards-view__media" {{params.videoClass}}>\
                <img class="img-fluid lazyload" data-original="{{params.image}}" src="{{params.image}}" style="background-image:url("{{placeholder}}"")>\
                <div class="video-icon"></div> \
            </figure>\
        {{/if}} \
        \
        <div class="social-icon"></div>\
        \
        <div class="{{cardType}}c-cards-view__container">\
            <div class="{{cardType}}c-cards-view__category">{{ params.category }}</div>\
            <h2 class="{{cardType}}c-cards-view__heading j-truncate">{{{ params.title }}}</h2>\
            <p class="{{cardType}}c-cards-view__description j-truncate">{{{ params.content }}}</p>\
            <div class="{{cardType}}c-cards-view__author">\
                <time class="{{cardType}}c-cards-view__time" datetime="{{params.publishDate}}">{{params.publishDate}}</time>\
            </div>\
        </div>'+ 
    cardTemplateBottom;



// **********************************************************
//                       CARDS END
// **********************************************************










Acme.templates.spinnerTmpl = '<div class="spinner"></div>';
Acme.templates.spinner = 
    '<div id="{{name}}" class="flex_col {{name}}"> \
        <div id="dialog" class="{{name}}__window"> \
            <div class="{{name}}__header"> \
                <h2 class="{{name}}__title">{{title}}</h2> \
            </div> \
            <div class="{{name}}__content-window" id="dialogContent"></div> \
        </div> \
    </div>';



// Acme.templates.carousel_item = 
// '<li class="carousel-tray__item swap-images"> \
//     <div data-id="{{imageid}}" class="carousel-tray__delete"> \
//         <span class="o-close"></span> \
//     </div> \
//     <img class="carousel-tray__img" src="{{imagePath}}" /> \
// </li>';

Acme.templates.swappingHelper = 
'<div class="SwappingHelper" style="display:none"> \
    <div style="width: 270px; height: 105px; padding: 3px; background-color: #FFF; max-width: 270px; max-height: 105px; overflow: hidden; z-index: 999 !important;"> \
        <img class="article-image" src="" style="width:97px; height: 97px; float: left;" /> \
        <p class="article-text" style="width: 165px; float: left; padding-left: 3px;color: #394659;font-size: 14px; font-family: Droid Serif,serif; line-height: 20px; margin-top:0px;"></p> \
    </div> \
</div>';








Acme.templates.managed_user = 
'<li id="{{id}}" class="c-managed-user"> \
    <p class="c-managed-user__email j-email">{{email}}</p> \
    <a class="c-managed-user__close j-delete "></a> \
    <a class="c-managed-user__edit j-edit"></a> \
</li>';










    
    

Acme.templates.ads_infinite = 
    "<div class='advert-desktop advert-tablet col-sm-9 hidden-xs u-margin-top-30' data-adsize='banner' style='padding:0;'></div>\
    <div class='col-xs-9 visible-xs-block' style='padding:0;width:300px;height:250px;'><div class='advert-mobile' data-adsize='mrec'></div></div>\
    <hr class='divide18 col-xs-9 visible-xs-block'>";



Acme.templates.modal = 
// style="scrolling == unusable position:fixed element might be fixing login for ios safari
// also margin-top:10px
'<div id="{{name}}" class="flex_col {{name}}" data-behaviour="close"> \
    <div id="dialog" class="{{name}}__window"> \
        <div class="{{name}}__container" style="scrolling == unusable position:fixed element"> \
            <div class="{{name}}__header"> \
                <h2 class="{{name}}__title">{{title}}</h2> \
                <a class="{{name}}__close" href="javascript:;" data-behaviour="close"></a> \
            </div> \
            <div class="{{name}}__content-window" id="dialogContent" style="scrolling == unusable position:fixed element"></div> \
        </div> \
    </div> \
</div>';
    
    
// Acme.templates.carousel_item = 
// '<div class="carousel-tray__item" style="background-image:url( {{imagePath}} )"> \
//     <span data-id="{{imageid}}" class="carousel-tray__delete"></span> \
// </div>';

// window.templates.listingDeleteTmpl =  
//     '<p>{{msg}}</p> \
//     <div> \
//         <form> \
//             <button class="_btn _btn--red" data-role="{{role}}">DELETE</button> \
//             <button class="_btn _btn--gray">CANCEL</button> \
//         </form> \
//     </div>';


Acme.templates.subscribeTerms =  
    '<p class="password-reset-form__p u-margin-bottom-20 centerText">Please agree to the terms of use.</p> \
    <div class="centerText"> \
        <button class="c-button c-button--blue">Okay</button> \
    </div>';

Acme.templates.listingDeleteTmpl =  
    '<p style="margin-top:10px;">{{msg}}</p> \
    <div style="display:flex"> \
        <form style="margin:auto; margin-top:20px;"> \
            <button class="c-button c-button--inline c-button--rounded c-button--blue-bordered u-margin-right-10" data-role="{{role}}">DELETE</button> \
            <button class="c-button c-button--inline c-button--rounded c-button--blue-bordered" data-role="cancel">CANCEL</button> \
        </form> \
    </div>';
    

Acme.templates.listingSentTmpl =
    '<div class="justify-content-center"> \
        <p class="u-margin-top-15">A staff member will be in touch with you soon.</p> \
    </div> \
    <div class="u-margin-top-15"> \
        <form class="justify-content-center"> \
            <button class="c-button c-button--inline c-button--blue-bordered">Okay</button> \
        </form> \
    </div>';


Acme.templates.listingSavedTmpl =  
'<p class=" u-margin-bottom-30 u-margin-top-20 centerText">Following approval it will be posted to the events page within 24 hours.</p> \
<div class="centerText"> \
    <button class="c-button c-button--blue">Okay</button> \
</div>';





Acme.templates.socialPopup =
'<div class="modal social--modal social--modal--md" id="ModalSocialCard"> \
    <div class="modal-dialog"> \
        <div class="modal-content modal-content--md"> \
            <div class="o-modal__container card-social-popup-desktop"> \
                \
                <div class="o-modal__container-head"> \
                    <button type="button" class="close" data-dismiss="modal">&times;</button> \
                </div> \
                \
                <div class="o-modal__container-body c-cards-view social facebook"> \
                    <figure class="c-cards-view__media"> \
                        <img src="{{media.path}}" alt="Image" class="img-fluid" /> \
                        <div class="video-icon"></div> \
                        <div class="social-icon"></div> \
                    </figure> \
                    \
                    <div class="c-cards-view__container"> \
                        <div class="c-cards-view__category">{{source}}</div> \
                        <div class="c-cards-view__heading">{{content}}</div> \
                        <div class="c-cards-view__author"> \
                            <div class="c-cards-view__author-name">{{user.name}}</div> \
                            <div class="c-cards-view__time">{{publishDate}}</div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div> \
    </div> \
</div>';


Acme.templates.classified =
'<div class="" id="ModalMultiImageGallery"> \
    <div class=""> \
        <div class="modal-content modal-content-md"> \
            <div class="o-modal__container o-modal__container--gallery"> \
            \
                <div class="o-modal__container-body o-modal__container-body"> \
                    <div class="o-media o-media-sm js-slider"> \
                        <figure class="o-media--item"> \
                            <div class="o-media--item--galllery"> \
                                <img src="static/images/slider/hockey.jpg" class="img-fluid o-media--image" alt="Article Info"> \
                                <div class="slide-count-wrap"> \
                                    <span class="current"></span> \
                                </div> \
                            </div> \
                        </figure> \
                        <figure class="o-media--item"> \
                            <div class="o-media--item--galllery"> \
                                <img src="static/images/slider/hockey.jpg" class="img-fluid o-media--image" alt="Article Info"> \
                                <div class="slide-count-wrap"> \
                                    <span class="current"></span> \
                                </div> \
                            </div> \
                        </figure> \
                    </div> \
                    <div class="o-modal--discription"> \
                        <div class="c-cards-view__container"> \
                            <div class="c-cards-view__ategory">Motor vehicles</div> \
                            <div class="c-cards-view__heading js-truncate">Vintage tractor</div> \
                            <div class="c-cards-view__description js-truncate">2004, BA, auto, FSH, 70,000kms, reg to July 2019, excellent cond, CAPPS3, $12,000. Phone 0448 235 740 after 6pm.</div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div> \
    </div> \
</div>';







// **********************************************************
//                       FORMS
// **********************************************************

Acme.templates.signinFormTmpl = 
'<form id="loginForm" class="vertical-form" action="#" method="post" autocomplete="off"> \
    <div class="c-form c-login-modal"> \
        <input id="email" class="c-login-modal__input c-form__input c-form__input--bordered-bottom" name="username" placeholder="Email Address" aria-required="true" type="text"> \
        <div class="c-form__help-block">Please enter your email address</div> \
        \
        <input id="password" class="c-login-modal__input c-form__input c-form__input--bordered-bottom u-margin-top-10" name="password" placeholder="Password" aria-required="true" type="password"> \
        <div class="c-form__help-block">Please enter your email Password</div> \
        <p id="signin_error" class="c-form__help-block u-font-size-14 u-margin-top-10"></p> \
        <a href="javascript:;" class="c-login-modal__password-link" data-layout="forgot">Forgot password?</a> \
    </div> \
    \
    <div class="c-form__buttons"> \
        <button id="signinBtn" type="submit" class="c-button c-button--blue j-signin">Log in</button> \
    </div> \
    \
    <div class="c-login-modal__subaction"> \
        <span>Trouble logging in? <a href="'+_appJsConfig.appHostName +'/faq" target="_blank">Read our FAQs</a></span>\
        <a href="javascript:;" class="c-login-modal__password-link text-center" data-layout="forgot">Set a PR password</a> \
    </div> \
</form>';



Acme.templates.forgotFormTmpl = 
'<form id="forgotForm" class="vertical-form" action="#" method="post" autocomplete="off"> \
    <div class="c-form c-forgot-modal__description"> \
        Enter your email below and if you have an account we will send you a link to set your password. \
    </div> \
    \
    <input id="email" class="c-form__input c-forgot-modal__input" name="email" placeholder="Email Address" aria-required="true" type="text"> \
    <div class="c-form__help-block">Please enter your email address</div> \
    \
    <div class="c-form__buttons"> \
        <button type="submit" class="c-button c-button--blue-bordered j-forgot-email">Send Email</button> \
    </div> \
</form>';



Acme.templates.userPlanMessage = 
'<p class="{{name}}__message centerText">{{{message}}}</p> \
<form name="loginForm" id="loginForm" class="active u-margin-top-20 centerText" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
    <button id="cancelbutton" class="c-button c-button--blue-bordered" data-role="okay">OK</button> \
</form>';

Acme.templates.userPlanOkCancel = 
'<p class="{{name}}__message centerText">{{message}}</p> \
<form name="loginForm" id="loginForm" class="active u-margin-top-20 centerText" action="javascript:void(0);" method="post" accept-charset="UTF-8" autocomplete="off"> \
    <button id="okaybutton" class="c-button c-button--inline c-button--blue-bordered" data-role="okay">Confirm</button> \
</form>';


Acme.templates.create_user = 
'<div id="newUser" class="col-12 c-managed-user-new u-margin-bottom-60"> \
    <div id="cancelUserCreate" class="c-managed-user__close c-managed-user__close--top"></div> \
    <div class="row u-desktop-padding-top-20 u-margin-bottom-15"> \
        <div class="col has-error"> \
            <input id="newuserfirstname" class="c-form__input c-form__input--bordered" name="firstname" placeholder="First Name" aria-required="true" type="text"> \
        </div> \
        <div class="col"> \
            <input id="newuserlastname" class="c-form__input c-form__input--bordered" name="lastname" placeholder="Last Name" aria-required="true" type="text"> \
        </div> \
    </div> \
    <div class="row"> \
        <div class="col"> \
            <input id="newuseruseremail" class="c-form__input c-form__input--bordered" name="email" placeholder="Email" aria-required="true" type="text"> \
        </div> \
    </div> \
    \
    <div id="userError" class="c-form__help-block u-margin-top-10"></div> \
    \
    <button id="saveUser" type="button" class="c-button c-button--blue-bordered u-margin-top-40">Save</button> \
</div>';
