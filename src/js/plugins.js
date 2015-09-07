if ( typeof exports === 'object' && typeof exports.nodeName !== 'string' && typeof define !== 'function' ) {
    var define = function( factory ) {
        factory( require, exports, module );
    };
}
define( function( require, exports, module ) {
    'use strict';
    var $ = require( 'jquery' );

    /**
     * Clears form input fields and triggers events when doing this. If formelement is cloned but not yet added to DOM
     * (and not synchronized with data object), the desired event is probably 'edit' (default). If it is already added
     * to the DOM (and synchronized with data object) a regular change event should be fired
     *
     * @param  {string=} ev event to be triggered when a value is cleared
     * @return { jQuery} [description]
     */
    $.fn.clearInputs = function( ev ) {
        ev = ev || 'edit';
        return this.each( function() {
            //remove media previews
            $( this ).find( '.file-preview' ).remove();
            //remove input values
            $( this ).find( 'input, select, textarea' ).not( '.ignore' ).each( function() {
                var $node = $( this ),
                    type = $node.attr( 'type' );
                if ( $node.prop( 'nodeName' ).toUpperCase() === 'SELECT' ) {
                    type = 'select';
                }
                if ( $node.prop( 'nodeName' ).toUpperCase() === 'TEXTAREA' ) {
                    type = 'textarea';
                }
                switch ( type ) {
                    case 'date':
                    case 'datetime':
                    case 'time':
                    case 'number':
                    case 'search':
                    case 'color':
                    case 'range':
                    case 'url':
                    case 'email':
                    case 'password':
                    case 'text':
                    case 'file':
                        $node.removeAttr( 'data-previous-file-name data-loaded-file-name' );
                        /* falls through */
                    case 'hidden':
                    case 'textarea':
                        if ( $node.val() !== '' ) {
                            $node.val( '' ).trigger( ev );
                        }
                        break;
                    case 'radio':
                    case 'checkbox':
                        if ( $node.prop( 'checked' ) ) {
                            $node.prop( 'checked', false );
                            $node.trigger( ev );
                        }
                        break;
                    case 'select':
                        if ( $node[ 0 ].selectedIndex >= 0 ) {
                            $node[ 0 ].selectedIndex = -1;
                            $node.trigger( ev );
                        }
                        break;
                    default:
                        console.error( 'Unrecognized input type found when trying to reset', this );
                }
            } );
        } );
    };

    /**
     * Supports a small subset of MarkDown and converts this to HTML: 
     * - _, __, *, **, [](), #, ##, ###, ####, #####, 
     * - html-encoded span tags,
     * - unordered markdown lists and order markdown lists
     * - newline characters
     *
     * Not supported: escaping and other MarkDown, HTML syntax
     */
    $.fn.markdownToHtml = function() {

        function _createHeader( match, hashtags, content ) {
            var level = hashtags.length;
            return '<h' + level + '>' + content.replace( /#+$/, '' ).trim() + '</h' + level + '>';
        }

        function _createUnorderedList( match ) {
            return '<ul>' + match.replace( /\n(\*|\+|-)(.*)/gm, '<li>$2</li>' ) + '</ul>';
        }

        function _createOrderedList( match ) {
            return '<ol>' + match.replace( /\n([0-9]+\.)(.*)/gm, '<li>$2</li>' ) + '</ol>';
        }

        return this.each( function() {
            var html,
                $childStore = $( '<div/>' );
            $( this ).children( ':not(input, select, textarea)' ).each( function( index ) {
                var name = '$$$' + index;
                $( this ).clone().markdownToHtml().appendTo( $childStore );
                $( this ).replaceWith( name );
            } );
            html = $( this ).html()
                // htmlencoding of < and > is already done in Pyxform, this is for handcoded forms
                .replace( '/</gm', '&lt;' )
                .replace( '/>/gm', '&gt;' )
                // strong
                .replace( /(\*\*|__)([^\s].*[^\s])\1/gm, '<strong>$2</strong>' )
                // emphasis
                .replace( /(\*|_)([^\s].*[^\s])\1/gm, '<em>$2</em>' )
                // links
                .replace( /\[([^\]]*)\]\(([^\)]+)\)/gm, '<a href="$2" target="_blank">$1</a>' )
                // headers
                .replace( /(#+)([^\n]*)\n/gm, _createHeader )
                // unordered lists (in JS $ matches end of line as well as end of string)
                .replace( /(\n(\*|\+|-)(.*))+$/gm, _createUnorderedList )
                // ordered lists (in JS $ matches end of line as well as end of string)
                .replace( /(\n([0-9]+\.)(.*))+$/gm, _createOrderedList )
                // span
                .replace( /&lt;\s?span(.+)&gt;(.+)&lt;\/\s?span\s?&gt;/gm, '<span$1>$2</span>' )
                // new lines
                .replace( /\n/gm, '<br />' );
            $childStore.children().each( function( i ) {
                var regex = new RegExp( '\\$\\$\\$' + i );
                html = html.replace( regex, $( this )[ 0 ].outerHTML );
            } );
            $( this ).text( '' ).append( html );
        } );
    };



    /**
     * Reverses a jQuery collection
     * @type {Array}
     */
    $.fn.reverse = [].reverse;

} );
