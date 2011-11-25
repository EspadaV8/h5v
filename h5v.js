(function($){
    "use strict";

    $.fn.h5v = function(options) {
        var defaults = {
            'required' : !Modernizr.input.required,
            'pattern'  : !Modernizr.input.pattern,
            'my': 'left center',
            'at': 'right center',
            'errorClass': 'error',
            'message': 'Please fill in this field',
            'types': 'input[type!="hidden"], textarea, select',
            'adjusts': {},
            'targets': {}
        };

        var opts = $.extend({}, defaults, options);

        if(opts.required) {
            this.each(function() {
                $(this).attr('novalidate', 'novalidate');

                $(this).on('submit', function(e) {
                    $(this).find(opts.types).each(function() {
                        var self = $(this);
                        if(validateInput(self) === false) {
                            var adjust = opts.adjusts[self.attr('id')] || {x:0,y:0};
                            var target = self;
                            if(opts.targets[self.attr('id')] !== undefined) {
                                target = $(opts.targets[self.attr('id')]);
                            }

                            self.addClass(opts.errorClass).qtip(
                                {
                                    content:
                                    {
                                        text: opts.message
                                    },
                                    position:
                                    {
                                        my: opts.my,
                                        at: opts.at,
                                        adjust: adjust,
                                        target: target
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

                    var hasErrors = ($(this).find('.' + opts.errorClass).size() > 0);

                    if(hasErrors) {
                        $(this).find(opts.types).eq(0).focus();
                    }

                    return (hasErrors === false);
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
