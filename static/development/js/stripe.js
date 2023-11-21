// Create a Stripe client

(function ($) {

    if ($('#stripekey').length > 0) {

    var stripekey = $('#stripekey').html();

    var modal = new Acme.Signin('spinner', 'spinner-modal', {"spinner": 'spinnerTmpl'});

    var stripe = Stripe(stripekey);

    // Create an instance of Elements
    var elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
        base: {
            color: '#32325d',
            lineHeight: '24px',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    // Create an instance of the card Element
    var card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>
    var cardElement = document.getElementById('card-element');
    if (cardElement != null) {
        card.mount('#card-element');
    }

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    }); 

    // Handle form submission

    var SubscribeForm = function() {
        this.data = {};
        this.errorFields = [];

        this.validateRules = {
            "verifypassword"    : ["notEmpty"],
            "firstname"         : ["notEmpty"], 
            "lastname"          : ["notEmpty"], 
            "password"          : ["notEmpty"],
            "email"             : ["notEmpty"],
            "terms"             : ["isTrue"],
            "subscription_choice":["notEmpty"]
        };

        this.validateFields = Object.keys(this.validateRules);

        this.events();
        this.refreshingEvents();
        this.trialTermsContainer = $('#trialterms');
        this.trialTermsHtml = 
            '<div class="button-set c-checkbox u-margin-bottom-15"> \
                <input id="changeterms" name="changeterms" type="checkbox" class="c-checkbox__input validate[required]" /> \
                <label class="c-checkbox__label" for="changeterms"> \
                    <span class="c-checkbox__button"></span> \
                    I agree to my card being charged {{planPrice}} every {{frequency}} at the end of the {{trialPeriod}}-day free trial period. \
                </Label> \
            </div> \
            \
            <div class="button-set c-checkbox u-margin-bottom-15"> \
                <input id="cancelterms" name="cancelterms" type="checkbox" class="c-checkbox__input validate[required]" /> \
                <label class="c-checkbox__label" for="cancelterms"> \
                    <span class="c-checkbox__button"></span> \
                    I understand I can cancel for free before the end of the trial in My Account page, and I will be emailed a payment reminder 7 days before the end of the free trial period. I understand I can cancel my paid subscription at any time in My Account page. \
                </label> \
            </div>';


        // var trial = $('#trial').val();
        // if (trial == 1) {
        //     this.data['trial'] = 'true';
        // }
        // var signup = $('#signup').val();
        // if (signup == 1) {
        //     this.data['signup'] = 'true';
        // }

    };
    SubscribeForm.prototype = new Acme.Form(Acme.Validators);
    SubscribeForm.constructor = SubscribeForm;
    SubscribeForm.prototype.render = function(checkTerms) 
    {
        this.clearInlineErrors();
        this.addInlineErrors();
        var addedTerms = this.data.trial === true && this.data.plantype === 'time';

        if (checkTerms) {
            if (!this.data.terms || (addedTerms && (!this.data.cancelterms || !this.data.changeterms))) {
                this.confirmView = new Acme.Confirm('modal', 'signin-modal', {'terms': 'subscribeTerms'});
                this.confirmView.render("terms", "Terms of use");
            }
        }
    };
    SubscribeForm.prototype.submit = function(event) 
    {
        var self = this;
        event.preventDefault();
        var validated = self.validate();
        self.render(true);
        if (!validated) return;


        $('#signupErrors').text('');
        if ( $('#password').val() !== $('#verifypassword').val() ) {
            $('#signupErrors').text('Password fields do not match.');
            return;
        }

        function submitForm() {
            formhandler(self.data, '/auth/paywall-signup').then(function(response) {

                if (response.success == 1) {
                    // setTimeout('window.location.href = location.origin + "/auth/thank-you";', 2000);
                    window.location.href = location.origin + '/auth/thank-you';
                }
                
            });
        }

        if ($("#code-redeem").length > 0 || this.data.signup == 1) {
            self.data['username'] = Math.floor(100000000 + Math.random() * 9000000000000000);
            modal.render("spinner", "Authorising code");
            self.data['planid'] = $('#planid').val();
            self.data['giftcode'] = $('#code-redeem').val();
            self.data['stripetoken'] = null;
            self.data['redirect'] = false;
            if ( this.data.signup == 1 ) {
                self.data['signuponly'] = 1;
            }
            
            submitForm();

        } else {

            modal.render("spinner", "Your request is being processed.");

            var stripeCall = stripe.createToken(card).then(function(result) {
                if (result.error) {
                    modal.closeWindow();
                    // Inform the user if there was an error
                    var errorElement = document.getElementById('signupErrors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server

                    self.data['stripetoken'] = result.token.id;
                    self.data['planid'] = $('#planid').val();
                    self.data['redirect'] = false;
                    submitForm();
                }
            });   
        }
    };
    SubscribeForm.prototype.addValidationRule = function(ruleName, rules) 
    {
        this.validateRules[ruleName] = rules;
        this.validateFields = Object.keys(this.validateRules);
    },
    SubscribeForm.prototype.removeValidationRule = function(rule)
    {
        delete this.validateRules[rule];
        this.validateFields = Object.keys(this.validateRules);
    },
    SubscribeForm.prototype.events = function()
    {
        var self = this;

        $('.j-plan-subscribe').unbind().on("click", function(e) {
            var elem = $(this);
            var plan = elem.data('planid');
            var name = elem.data('plan-name');
            var cost = elem.data('cost');
            var period = elem.data('period');
            var periodcount = elem.data('periodcount');
            var trialperiod = elem.data('trialperiod');
            var trial = elem.data('trial');
            var signup = elem.data('signup');
            var plantype = elem.data('plantype');
            
            self.data.trial = trial == 1 ? true : false;
            self.data.signup = signup == 1 ? true : false;
            self.data.plantype = plantype;
            if (self.data.trial && self.data.plantype === 'time') {
                var planPeriod = period;
                var frequency = periodcount > 1 ? periodcount : "";
                if (periodcount > 1 ) {
                    planPeriod = period + 's';
                }
                frequency = frequency + " " + planPeriod;

                self.addValidationRule("cancelterms", ["isTrue"]);
                self.addValidationRule("changeterms", ["isTrue"]);
                var template = Handlebars.compile(self.trialTermsHtml);
                var html = template({'planPrice': cost, 'frequency': frequency, 'trialPeriod':trialperiod })
                self.trialTermsContainer.empty().append(html);

            } else {
                self.removeValidationRule("cancelterms");
                self.removeValidationRule("changeterms");
                self.trialTermsContainer.empty();
            }

            self.data.planid = plan;
            self.data.subscription_choice = name;

            $input = $('#subscription_choice');
            $inputId = $input.attr('name');
            $('#planid').val(plan);
            // $('#trial').val(trial);
            // $('#signup').val(signup);
            $input.val(name).addClass('shrink');
            $('#total_cost').text(cost);
            
            $addressFieldInfo = $('#displayAddress_info');
            if(plan == '9d11bab3-b33e-492b-9c78-6ae8f09f417c') {
                $addressFieldInfo.removeClass('d-none');
            }else {
                $addressFieldInfo.hasClass('d-none') ? '' : $addressFieldInfo.addClass('d-none');
            }

            $('.j-plan-subscribe').each(function(i, e) {
                var button = $(e);
                button.text('SUBSCRIBE');
                button.removeClass('c-button--red');
                button.addClass('c-button--grey');
            });

            elem.text('SELECTED');
            elem.removeClass('c-button--grey');
            elem.addClass('c-button--red');

            if (signup == true) {
                $('#payment-head').hide();
                $('#payment-types').hide();
                $('#stripe-form').hide();
                $('#payment-total').hide();
            } else {
                $('#payment-head').show();
                $('#payment-types').show();
                $('#stripe-form').show();
                $('#payment-total').show();
            }
            self.refreshingEvents();

            // self.validate();
        });


        var form = document.getElementById('payment-form');

        if (form != null) {
            form.addEventListener('submit', function(e) {
                self.submit(e);
            });
        }
    };



    SubscribeForm.prototype.refreshingEvents = function()
    {
        var self = this;

        $('#subscribe-form input, #subscribe-form textarea').unbind().on("change", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var data = {};
            var elem = $(e.target);
            var elemid = elem.attr('name');
            var inputType = elem.attr('type');
    
            if (inputType == 'text' || inputType == 'email' || inputType == 'password') {
                data[elemid] = elem.val();
                // username is created from the email plus a random number
                if (inputType == 'email') {
                    data['username'] = Math.floor(100000000 + Math.random() * 9000000000000000);
                }
    
            } else if (inputType =='checkbox') {
                var value = elem.is(":checked");
                data[elemid] = value;
            }
    
            self.updateData(data);
    
            if ( elem.val() != "" ) {
                elem.addClass('shrink');
            } else {
                elem.removeClass('shrink');
            }
    
            var validated = self.validate([elemid]);
            self.render();
        });
    }






    Acme.subscribe = new SubscribeForm();

   


    var formhandler = function(formdata, path) {
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        formdata['_csrf'] = csrfToken;

        
        return $.ajax({
            url: _appJsConfig.appHostName + path,
            type: 'post',
            data: formdata,
            dataType: 'json',
            success: function(data) {

                if(data.success) {
                    $('#signupErrors').text('Completed successfully.');
                } else {
                    modal.closeWindow();

                    var text = ''
                    for (var key in data.error) {
                        text = text + data.error[key] + " ";
                    } 
                    $('#signupErrors').text(text);
                }   
            },
            error: function(data) {
                modal.closeWindow();
            }
        });
    }



    var udform = document.getElementById('update-card-form');

    if (udform != null) {

        udform.addEventListener('submit', function(event) {
            event.preventDefault();
            modal.render("spinner", "Your request is being processed.");

            $('#card-errors').text('');
            
            stripe.createToken(card).then(function(result) {
                if (result.error) {
                    modal.closeWindow();

                    // Inform the user if there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server

                    formdata = {"stripetoken":result.token.id}
                    formhandler(formdata, '/user/update-payment-details').then(function() {
                        modal.closeWindow();
                        location.reload();
                    });
                }
            });
        });
    }
} 
}(jQuery));