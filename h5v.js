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
            'customQtip': {}
        };

        var opts = $.extend({}, defaults, options);

        var qtipOpts = {
            'content':
            {
                'text': opts.message
            },
            'position':
            {
                'my': opts.my,
                'at': opts.at
            },
            'show':
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
        };

        if(opts.required) {
            this.each(function() {
                $(this).attr('novalidate', 'novalidate');

                $(this).on('submit', function(e) {
                    $(this).find(opts.types).each(function() {
                        var self = $(this);
                        if((self.attr('type') === 'radio') &&
                           ($('input[type="radio"][name="' + self.attr('name') + '"]').index(self) !== 0)) {
                            return;
                        }
                        if(validateInput(self) === false) {
                            var localQtipOpts = $.extend(true, {}, qtipOpts);
                            if(opts.customQtip[self.attr('id')] !== undefined) {
                                localQtipOpts = $.extend(true, localQtipOpts, opts.customQtip[self.attr('id')]);
                            }

                            self.addClass(opts.errorClass).qtip(localQtipOpts).qtip('show');
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
                case 'radio':
                    var group = $('input[type="radio"][name="' + self.attr('name') + '"]');
                    val = group.is(':checked');
                    break;
                case 'checkbox':
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
            else if((input.attr('required') !== undefined) && (($.trim(val) === "") || (val === false))) {
                isValid = false;
            }
            return isValid;
        }
    };
})(jQuery);
