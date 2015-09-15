if ( typeof exports === 'object' && typeof exports.nodeName !== 'string' && typeof define !== 'function' ) {
    var define = function( factory ) {
        factory( require, exports, module );
    };
}

define( function( require, exports, module ) {
    'use strict';
    var Widget = require( '../../js/Widget' );
    var $ = require( 'jquery' );
    var pluginName = 'analogscalepicker';

    require( 'bootstrap-slider-basic' );

    /**
     * Creates an analog scale picker
     *
     * @constructor
     * @param {Element} element Element to apply widget to.
     * @param {(boolean|{touch: boolean})} options options
     * @param {*=} event     event
     */
    function Analogscalepicker( element, options, event ) {
        this.namespace = pluginName;
        Widget.call( this, element, options );
        this._init();
    }

    // copy the prototype functions from the Widget super class
    Analogscalepicker.prototype = Object.create( Widget.prototype );

    // ensure the constructor is the new one
    Analogscalepicker.prototype.constructor = Analogscalepicker;

    /**
     * Initialize
     */
    Analogscalepicker.prototype._init = function() {
        var $question = $( this.element ).closest( '.question' );
        var value = Number( this.element.value ) || -1;

        this.orientation = $question.hasClass( 'or-appearance-horizontal' ) ? 'horizontal' : 'vertical';
        this.ticks = !$question.hasClass( 'or-appearance-no-ticks' );

        $( this.element ).slider( {
            reversed: true,
            min: -1,
            max: 100,
            orientation: this.orientation,
            step: 1,
            value: value
        } );
        this.$widget = $( this.element ).next( '.widget' );
        this.$slider = this.$widget.find( '.slider' );
        this._renderLabels();
        //this._addValueBox();
        this._renderScale();
        this._setChangeHandler();
    };

    /** 
     * (re-)Renders the widget labels based on the current content of .question-label.active
     */
    Analogscalepicker.prototype._renderLabels = function() {
        var $labelEl = $( this.element ).siblings( '.question-label.active' );
        var labels = $labelEl.html().split( /\|/ ).map( function( label ) {
            return label.trim();
        } );

        console.debug( 'label', labels ); // DEBUG

        this.$mainLabel = this.$mainLabel || $( '<span class="widget question-label active" />' ).insertAfter( $labelEl );
        this.$mainLabel.empty().append( labels[ 0 ] );

        this.$maxLabel = this.$maxLabel || $( '<div class="max-label" />' ).prependTo( this.$widget );
        this.$maxLabel.empty().append( labels[ 1 ] );

        this.$minLabel = this.$minLabel || $( '<div class="min-label" />' ).appendTo( this.$widget );
        this.$minLabel.empty().append( labels[ 2 ] );

        if ( labels[ 3 ] ) {
            this.$showValue = this.$showValue || $( '<div class="show-value" />' ).insertBefore( this.element );
            this.$showValue.empty().append( labels[ 3 ] + '<span class="value">' + this.element.value + '</span>' );
        } else if ( this.$showValue ) {
            this.$showValue.remove();
            this.$showValue = undefined;
        }
    };

    Analogscalepicker.prototype._renderValueBox = function() {
        this.$widget.append(
            '<div class="value-box"></div>'
        );
    };

    Analogscalepicker.prototype._renderScale = function() {
        var $scale = $( '<div class="scale"></div>' );
        for ( var i = 100; i >= 0; i -= 10 ) {
            $scale.append( '<div class="number"><div class="value">' + i + '</div><div class="ticks"></div></div>' );
        }
        this.$slider.prepend( $scale );
    };

    /**
     * Set delegated event handlers
     */
    Analogscalepicker.prototype._setChangeHandler = function() {
        var that = this;
        $( this.element ).on( 'slideStop.' + this.namespace, function( slideEvt ) {
            // set to empty if value = -1
            if ( Number( this.value ) === -1 ) {
                this.value = '';
            }
            console.debug( 'updating value', this.value ); //DEBUG
            that.$showValue.find( '.value' ).text( this.value );
            $( this ).trigger( 'change' );
        } );
    };

    Analogscalepicker.prototype.disable = function() {
        $( this.element )
            .slider( 'disable' )
            .slider( 'setValue', this.element.value );
    };

    Analogscalepicker.prototype.enable = function() {
        $( this.element )
            .slider( 'enable' );
    };

    Analogscalepicker.prototype.update = function() {
        this._renderLabels();
    };

    $.fn[ pluginName ] = function( options, event ) {
        return this.each( function() {
            var $this = $( this ),
                data = $( this ).data( pluginName );

            options = options || {};

            if ( !data && typeof options === 'object' ) {
                $this.data( pluginName, ( data = new Analogscalepicker( this, options, event ) ) );
            } else if ( data && typeof options === 'string' ) {
                //pass the context, used for destroy() as this method is called on a cloned widget
                data[ options ]( this );
            }
        } );
    };

    module.exports = {
        'name': pluginName,
        'selector': '.or-appearance-analog-scale input[data-type-xml="int"]'
    };
} );
