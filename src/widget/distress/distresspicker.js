if ( typeof exports === 'object' && typeof exports.nodeName !== 'string' && typeof define !== 'function' ) {
    var define = function( factory ) {
        factory( require, exports, module );
    };
}
/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modi Labs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define( function( require, exports, module ) {
    'use strict';
    var Widget = require( '../../js/Widget' );
    var $ = require( 'jquery' );
    require( 'bootstrap-slider-basic' );

    var pluginName = 'distresspicker';

    /**
     * Creates a distress picker.
     *
     * @constructor
     * @param {Element} element Element to apply widget to.
     * @param {(boolean|{touch: boolean})} options options
     * @param {*=} event     event
     */

    function Distresspicker( element, options, event ) {
        this.namespace = pluginName;
        Widget.call( this, element, options );
        this._init();
    }

    //copy the prototype functions from the Widget super class
    Distresspicker.prototype = Object.create( Widget.prototype );

    //ensure the constructor is the new one
    Distresspicker.prototype.constructor = Distresspicker;

    /**
     * Initialize
     */
    Distresspicker.prototype._init = function() {
        var step = ( $( this.element ).attr( 'data-type-xml' ) === 'decimal' ) ? 0.1 : 1,
            value = Number( this.element.value ) || -1;

        $( this.element ).slider( {
            reversed: true,
            min: -1,
            max: 10,
            orientation: 'vertical',
            step: step,
            value: value
        } );
        this.$widget = $( this.element ).next( '.widget' );
        this.$slider = this.$widget.find( '.slider' );
        this._addBulb();
        this._addScale();
        this._setChangeHandler();
    };

    Distresspicker.prototype._addBulb = function() {
        this.$slider.append(
            '<div class="bulb"><div class="inner"></div></div>'
        );
    };

    Distresspicker.prototype._addScale = function() {
        var $scale = $( '<div class="scale"></div>' );
        for ( var i = 10; i >= -1; i-- ) {
            $scale.append( '<div class="number"><div class="value">' + i + '</div></div>' );
        }
        this.$slider.prepend( $scale );
    };

    /**
     * Set delegated event handlers
     */
    Distresspicker.prototype._setChangeHandler = function() {
        $( this.element ).on( 'slideStop.' + this.namespace, function( slideEvt ) {
            // set to empty if value = -1
            if ( Number( this.value ) === -1 ) {
                this.value = '';
            }
            $( this ).trigger( 'change' );
        } );
    };

    Distresspicker.prototype.disable = function() {
        console.log( 'disableing', this.element );
        $( this.element )
            .slider( 'disable' )
            .slider( 'setValue', this.element.value );
    };

    Distresspicker.prototype.enable = function() {
        $( this.element )
            .slider( 'enable' );
    };

    $.fn[ pluginName ] = function( options, event ) {
        return this.each( function() {
            var $this = $( this ),
                data = $( this ).data( pluginName );

            options = options || {};

            if ( !data && typeof options === 'object' ) {
                $this.data( pluginName, ( data = new Distresspicker( this, options, event ) ) );
            } else if ( data && typeof options === 'string' ) {
                //pass the context, used for destroy() as this method is called on a cloned widget
                data[ options ]( this );
            }
        } );
    };

    module.exports = {
        'name': pluginName,
        'selector': '.or-appearance-distress input[type="number"]'
    };
} );
