(function($){
    "use strict";

    $.fn.h5v = function(options) {
        var defaults = {
            'required' : !Modernizr.input.required,
            'pattern'  : !Modernizr.input.pattern,
            'my': 'left center',
            'at': 'right center',
            'errorClass': 'error',
            'message': 'Please fill in this field'
        };

        var opts = $.extend({}, defaults, options);

        if(opts.required) {
            this.each(function() {
                $(this).attr('novalidate', 'novalidate');

                $(this).on('submit', function(e) {
                    $(this).find('input').each(function() {
                        var self = $(this);
                        if(validateInput(self) === false) {
                            self.addClass(opts.errorClass).qtip(
                                {
                                    content:
                                    {
                                        text: opts.message
                                    },
                                    position:
                                    {
                                        my: opts.my,
                                        at: opts.at
                                    },
                                    show:
                                    {
                                        'event': false
                                    },
                                    hide: 
                                    {
                                        'event': 'focusout change'
                                    },
                                    'events': {
                                        hide: function(e, api) {
                                            var isValid = validateInput(api.elements.target);
                                            if(isValid) {
                                                api.elements.target.removeClass(opts.errorClass);
                                            }
                                            return isValid;
                                        }
                                    }
                                }
                            ).qtip('show');
                        }
                        else
                        {
                            self.removeClass(opts.errorClass);
                        }
                    });
                    return ($(this).find('.' + opts.errorClass).size() === 0);
                });
            });
        }

        function validateInput(input) {
            var self = input;
            var val = self.val();
            var type = self.attr('type');
            var pattern = self.attr('pattern');
            var isValid = true;

            switch(type)
            {
                case 'checkbox':
                case 'radio':
                    val = self.is(':checked');
                    break;
                case 'email':
                    if(pattern === undefined) {
                        pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    }
                    break;
                case 'number':
                    if(pattern === undefined) {
                        pattern = /[0-9]+/;
                    }
                    break;
                default:
                    break;
            }

            if(pattern !== undefined) {
                var regex = new RegExp(pattern);
                isValid = !!val.match(regex);
            }
            else if((input.attr('required') !== undefined) && ((val === "") || (val === false))) {
                isValid = false;
            }
            return isValid;
        }
    };
})(jQuery);
