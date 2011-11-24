(function($){
    "use strict";

    $.fn.h5v = function(options) {
        var defaults = {
            'required' : !Modernizr.input.required,
            'pattern'  : !Modernizr.input.pattern,
            'my': 'left center',
            'at': 'right center'
        };

        var opts = $.extend({}, defaults, options);

        this.each(function() {
            if(opts.required) {
                $(this).attr('novalidate', 'novalidate');

                $(this).on('submit', function(e) {
                    $(this).find('input').each(function() {
                        var self = $(this);
                        if(validateInput(self) === false) {
                            self.addClass('error').qtip(
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
                                        'event': ''
                                    },
                                    hide: 
                                    {
                                        'event': 'focusout change'
                                    },
                                    'events': {
                                        hide: function(e, api) {
                                            var isValid = validateInput(api.elements.target);
                                            if(isValid) {
                                                api.elements.target.removeClass('error');
                                            }
                                            return isValid;
                                        }
                                    }
                                }
                            ).qtip('show');
                        }
                        else
                        {
                            self.removeClass('error');
                        }
                    });

                    e.preventDefault();
                    return false;
                });
            }
        });

        function validateInput(input) {
            var self = input;
            var val = self.val();
            var type = self.attr('type');
            var isValid = true;

            if((type == 'checkbox') || (type == 'radio')) {
                val = self.is(':checked');
            }

            var pattern = input.attr('pattern');
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
