if ( typeof exports === 'object' && typeof exports.nodeName !== 'string' && typeof define !== 'function' ) {
    var define = function( factory ) {
        factory( require, exports, module );
    };
}
define( function( require, exports, module ) {
    'use strict';

    /**
     * Parses an Expression to extract a function call and its parameter content as a string.
     *
     * @param  {String} expr The expression to search
     * @param  {String} func The function name to search for
     * @return {<String, String>} The result array, where each result is an array containing the function call and the parameter content.
     */
    function parseFunctionFromExpression( expr, func ) {
        var index, result, openBrackets, start,
            findFunc = new RegExp( func + '\\s*\\(', 'g' ),
            results = [];

        if ( !expr || !func ) {
            return results;
        }

        while ( ( result = findFunc.exec( expr ) ) !== null ) {
            openBrackets = 1;
            start = result.index;
            index = findFunc.lastIndex;
            while ( openBrackets !== 0 ) {
                index++;
                if ( expr[ index ] === '(' ) {
                    openBrackets++;
                } else if ( expr[ index ] === ')' ) {
                    openBrackets--;
                }
            }
            // add [ 'function(a,b)', 'a,b' ] to result array
            results.push( [ expr.substring( start, index + 1 ), expr.substring( findFunc.lastIndex, index ).trim() ] );
        }

        return results;
    }

    function stripQuotes( str ) {
        if ( /^".+"$/.test( str ) || /^'.+'$/.test( str ) ) {
            return str.substring( 1, str.length - 1 );
        }
        return str;
    }

    module.exports = {
        parseFunctionFromExpression: parseFunctionFromExpression,
        stripQuotes: stripQuotes,
    };
} );
