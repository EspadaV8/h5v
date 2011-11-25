(function($){
    "use strict";

    $.fn.h5v = function(options) {
        var defaults = {
            'required' : !Modernizr.input.required,
            'pattern'  : !Modernizr.input.pattern,
            'my': 'left center',
            'at': 'right center',
            'errorClass': 'error'
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
                                        text: 'Please fill in this field'
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

                    e.preventDefault();
                    return false;
                });
            });
        }

        function validateInput(input) {
            var self = input;
            var val = self.val();
            var type = self.attr('type');
            var pattern = self.attr('pattern');
            var isValid = true;

            if((type == 'checkbox') || (type == 'radio')) {
                val = self.is(':checked');
            }
            else if((type == 'email') && (pattern === undefined)) {
                pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
