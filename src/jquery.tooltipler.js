// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "tolltipler",
			defaults = {
				eventsToBind: "mouseenter touchstart click",
                customClass: 'orange',
                counter: 0
            };


		function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		$.extend( Plugin.prototype, {

			init: function() {
                this.addElement();
				this.bindEvents();
			},

			bindEvents : function(){

                var $this = this;

                $( this.element ).bind( this._defaults.eventsToBind, function(e) {

					e.stopPropagation();
                    e.preventDefault();

                    if( !jQuery.data( $this.element, 'title' ) ){
                        return false;
                    }

                    $this.show();

				});


                $( this.element ).bind( 'mouseleave', function(e){
                    $this.hide();
                });

                $( this.element ).find('.tooltipler').bind( 'click', function(e){
                    $this.hide();
                });

			},

            addElement : function(){
                var customClass = $( this.element ).attr( 'tooltiplerclass' ) != undefined ? ' ' + $( this.element ).attr( 'tooltiplerclass' ) : '' ;
                var id = this.saveToolTiplerId();
                var tooltipElement = $( '<div class="tooltipler' + customClass + '" id="' + id + '" >' + $( this.element ).attr( 'title' ) + '</div>' );
                $('body').append( tooltipElement );
                this.saveTitle();
            },

            saveTitle : function(){
                jQuery.data( this.element, 'title', $( this.element ).attr( 'title' ) + 'Hola' );
                $(this.element).removeAttr( 'title' );
            },

            saveToolTiplerId : function(){
                var uniqueId = 'tollTipler' + this._defaults.counter;
                jQuery.data( this.element, 'toolTiplerId', uniqueId );
                this._defaults.counter = this._defaults.counter + 1;
                return uniqueId;
            },


            show : function(){

                var tooltip = $( '#' + jQuery.data( this.element, 'toolTiplerId') );
                var target =  $(this.element);

                if( $( window ).width() < tooltip.outerWidth() * 1.5 ){
                    tooltip.css( 'max-width', $( window ).width() / 2 );
                }else{
                    tooltip.css( 'max-width', 340 );
                }

                var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                    pos_top  = target.offset().top - tooltip.outerHeight() - 20;

                if( pos_left < 0 ){
                    pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                    tooltip.addClass( 'left' );
                }else{
                    tooltip.removeClass( 'left' );
                }

                if( pos_left + tooltip.outerWidth() > $( window ).width() ){
                    pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                    tooltip.addClass( 'right' );
                }else{
                    tooltip.removeClass( 'right' );
                }

                if( pos_top < 0 ) {
                    var pos_top  = target.offset().top + target.outerHeight();
                    tooltip.addClass( 'top' );
                }else{
                    tooltip.removeClass( 'top' );
                }

                tooltip.css(
                    {
                        left: pos_left,
                        top: ( pos_top + 10 )
                    }
                );

                tooltip.removeClass('hide');
                tooltip.addClass('show');

            },

            hide : function(){

                var tooltip = $( '#' + jQuery.data( this.element, 'toolTiplerId') );

                tooltip.removeClass('show');
                tooltip.addClass('hide');

            }

		} );

		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
