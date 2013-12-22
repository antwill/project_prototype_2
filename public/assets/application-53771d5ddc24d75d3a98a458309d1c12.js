/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function ($, window, document, undefined) {
  'use strict';

  // Used to retrieve Foundation media queries from CSS.
  if($('head').has('.foundation-mq-small').length === 0) {
    $('head').append('<meta class="foundation-mq-small">');
  }

  if($('head').has('.foundation-mq-medium').length === 0) {
    $('head').append('<meta class="foundation-mq-medium">');
  }

  if($('head').has('.foundation-mq-large').length === 0) {
    $('head').append('<meta class="foundation-mq-large">');
  }

  if($('head').has('.foundation-mq-xlarge').length === 0) {
    $('head').append('<meta class="foundation-mq-xlarge">');
  }

  if($('head').has('.foundation-mq-xxlarge').length === 0) {
    $('head').append('<meta class="foundation-mq-xxlarge">');
  }

  // Embed FastClick (this should be removed later)
  function FastClick(layer){'use strict';var oldOnClick,self=this;this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=10;this.layer=layer;if(!layer||!layer.nodeType){throw new TypeError('Layer must be a document node');}this.onClick=function(){return FastClick.prototype.onClick.apply(self,arguments)};this.onMouse=function(){return FastClick.prototype.onMouse.apply(self,arguments)};this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(self,arguments)};this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(self,arguments)};this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(self,arguments)};this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(self,arguments)};if(FastClick.notNeeded(layer)){return}if(this.deviceIsAndroid){layer.addEventListener('mouseover',this.onMouse,true);layer.addEventListener('mousedown',this.onMouse,true);layer.addEventListener('mouseup',this.onMouse,true)}layer.addEventListener('click',this.onClick,true);layer.addEventListener('touchstart',this.onTouchStart,false);layer.addEventListener('touchmove',this.onTouchMove,false);layer.addEventListener('touchend',this.onTouchEnd,false);layer.addEventListener('touchcancel',this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){layer.removeEventListener=function(type,callback,capture){var rmv=Node.prototype.removeEventListener;if(type==='click'){rmv.call(layer,type,callback.hijacked||callback,capture)}else{rmv.call(layer,type,callback,capture)}};layer.addEventListener=function(type,callback,capture){var adv=Node.prototype.addEventListener;if(type==='click'){adv.call(layer,type,callback.hijacked||(callback.hijacked=function(event){if(!event.propagationStopped){callback(event)}}),capture)}else{adv.call(layer,type,callback,capture)}}}if(typeof layer.onclick==='function'){oldOnClick=layer.onclick;layer.addEventListener('click',function(event){oldOnClick(event)},false);layer.onclick=null}}FastClick.prototype.deviceIsAndroid=navigator.userAgent.indexOf('Android')>0;FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent);FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&(/OS 4_\d(_\d)?/).test(navigator.userAgent);FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&(/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);FastClick.prototype.needsClick=function(target){'use strict';switch(target.nodeName.toLowerCase()){case'button':case'select':case'textarea':if(target.disabled){return true}break;case'input':if((this.deviceIsIOS&&target.type==='file')||target.disabled){return true}break;case'label':case'video':return true}return(/\bneedsclick\b/).test(target.className)};FastClick.prototype.needsFocus=function(target){'use strict';switch(target.nodeName.toLowerCase()){case'textarea':case'select':return true;case'input':switch(target.type){case'button':case'checkbox':case'file':case'image':case'radio':case'submit':return false}return!target.disabled&&!target.readOnly;default:return(/\bneedsfocus\b/).test(target.className)}};FastClick.prototype.sendClick=function(targetElement,event){'use strict';var clickEvent,touch;if(document.activeElement&&document.activeElement!==targetElement){document.activeElement.blur()}touch=event.changedTouches[0];clickEvent=document.createEvent('MouseEvents');clickEvent.initMouseEvent('click',true,true,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null);clickEvent.forwardedTouchEvent=true;targetElement.dispatchEvent(clickEvent)};FastClick.prototype.focus=function(targetElement){'use strict';var length;if(this.deviceIsIOS&&targetElement.setSelectionRange){length=targetElement.value.length;targetElement.setSelectionRange(length,length)}else{targetElement.focus()}};FastClick.prototype.updateScrollParent=function(targetElement){'use strict';var scrollParent,parentElement;scrollParent=targetElement.fastClickScrollParent;if(!scrollParent||!scrollParent.contains(targetElement)){parentElement=targetElement;do{if(parentElement.scrollHeight>parentElement.offsetHeight){scrollParent=parentElement;targetElement.fastClickScrollParent=parentElement;break}parentElement=parentElement.parentElement}while(parentElement)}if(scrollParent){scrollParent.fastClickLastScrollTop=scrollParent.scrollTop}};FastClick.prototype.getTargetElementFromEventTarget=function(eventTarget){'use strict';if(eventTarget.nodeType===Node.TEXT_NODE){return eventTarget.parentNode}return eventTarget};FastClick.prototype.onTouchStart=function(event){'use strict';var targetElement,touch,selection;if(event.targetTouches.length>1){return true}targetElement=this.getTargetElementFromEventTarget(event.target);touch=event.targetTouches[0];if(this.deviceIsIOS){selection=window.getSelection();if(selection.rangeCount&&!selection.isCollapsed){return true}if(!this.deviceIsIOS4){if(touch.identifier===this.lastTouchIdentifier){event.preventDefault();return false}this.lastTouchIdentifier=touch.identifier;this.updateScrollParent(targetElement)}}this.trackingClick=true;this.trackingClickStart=event.timeStamp;this.targetElement=targetElement;this.touchStartX=touch.pageX;this.touchStartY=touch.pageY;if((event.timeStamp-this.lastClickTime)<200){event.preventDefault()}return true};FastClick.prototype.touchHasMoved=function(event){'use strict';var touch=event.changedTouches[0],boundary=this.touchBoundary;if(Math.abs(touch.pageX-this.touchStartX)>boundary||Math.abs(touch.pageY-this.touchStartY)>boundary){return true}return false};FastClick.prototype.onTouchMove=function(event){'use strict';if(!this.trackingClick){return true}if(this.targetElement!==this.getTargetElementFromEventTarget(event.target)||this.touchHasMoved(event)){this.trackingClick=false;this.targetElement=null}return true};FastClick.prototype.findControl=function(labelElement){'use strict';if(labelElement.control!==undefined){return labelElement.control}if(labelElement.htmlFor){return document.getElementById(labelElement.htmlFor)}return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea')};FastClick.prototype.onTouchEnd=function(event){'use strict';var forElement,trackingClickStart,targetTagName,scrollParent,touch,targetElement=this.targetElement;if(!this.trackingClick){return true}if((event.timeStamp-this.lastClickTime)<200){this.cancelNextClick=true;return true}this.lastClickTime=event.timeStamp;trackingClickStart=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(this.deviceIsIOSWithBadTarget){touch=event.changedTouches[0];targetElement=document.elementFromPoint(touch.pageX-window.pageXOffset,touch.pageY-window.pageYOffset)||targetElement;targetElement.fastClickScrollParent=this.targetElement.fastClickScrollParent}targetTagName=targetElement.tagName.toLowerCase();if(targetTagName==='label'){forElement=this.findControl(targetElement);if(forElement){this.focus(targetElement);if(this.deviceIsAndroid){return false}targetElement=forElement}}else if(this.needsFocus(targetElement)){if((event.timeStamp-trackingClickStart)>100||(this.deviceIsIOS&&window.top!==window&&targetTagName==='input')){this.targetElement=null;return false}this.focus(targetElement);if(!this.deviceIsIOS4||targetTagName!=='select'){this.targetElement=null;event.preventDefault()}return false}if(this.deviceIsIOS&&!this.deviceIsIOS4){scrollParent=targetElement.fastClickScrollParent;if(scrollParent&&scrollParent.fastClickLastScrollTop!==scrollParent.scrollTop){return true}}if(!this.needsClick(targetElement)){event.preventDefault();this.sendClick(targetElement,event)}return false};FastClick.prototype.onTouchCancel=function(){'use strict';this.trackingClick=false;this.targetElement=null};FastClick.prototype.onMouse=function(event){'use strict';if(!this.targetElement){return true}if(event.forwardedTouchEvent){return true}if(!event.cancelable){return true}if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(event.stopImmediatePropagation){event.stopImmediatePropagation()}else{event.propagationStopped=true}event.stopPropagation();event.preventDefault();return false}return true};FastClick.prototype.onClick=function(event){'use strict';var permitted;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true}if(event.target.type==='submit'&&event.detail===0){return true}permitted=this.onMouse(event);if(!permitted){this.targetElement=null}return permitted};FastClick.prototype.destroy=function(){'use strict';var layer=this.layer;if(this.deviceIsAndroid){layer.removeEventListener('mouseover',this.onMouse,true);layer.removeEventListener('mousedown',this.onMouse,true);layer.removeEventListener('mouseup',this.onMouse,true)}layer.removeEventListener('click',this.onClick,true);layer.removeEventListener('touchstart',this.onTouchStart,false);layer.removeEventListener('touchmove',this.onTouchMove,false);layer.removeEventListener('touchend',this.onTouchEnd,false);layer.removeEventListener('touchcancel',this.onTouchCancel,false)};FastClick.notNeeded=function(layer){'use strict';var metaViewport;if(typeof window.ontouchstart==='undefined'){return true}if((/Chrome\/[0-9]+/).test(navigator.userAgent)){if(FastClick.prototype.deviceIsAndroid){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport&&metaViewport.content.indexOf('user-scalable=no')!==-1){return true}}else{return true}}if(layer.style.msTouchAction==='none'){return true}return false};FastClick.attach=function(layer){'use strict';return new FastClick(layer)};if(typeof define!=='undefined'&&define.amd){define(function(){'use strict';return FastClick})}else if(typeof module!=='undefined'&&module.exports){module.exports=FastClick.attach;module.exports.FastClick=FastClick}else{window.FastClick=FastClick}


  // Enable FastClick
  if(typeof FastClick !== 'undefined') {
    FastClick.attach(document.body);
  }

  // private Fast Selector wrapper,
  // returns jQuery object. Only use where
  // getElementById is not available.
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        return $(context.querySelectorAll(selector));
      }

      return $(document.querySelectorAll(selector));
    }

    return $(selector, context);
  };

  /*
    https://github.com/paulirish/matchMedia.js
  */

  window.matchMedia = window.matchMedia || (function( doc, undefined ) {

    "use strict";

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( "body" ),
        div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function(q){

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  /*
   * jquery.requestAnimationFrame
   * https://github.com/gnarf37/jquery-requestAnimationFrame
   * Requires jQuery 1.8+
   *
   * Copyright (c) 2012 Corey Frang
   * Licensed under the MIT license.
   */

  (function( $ ) {

  // requestAnimationFrame polyfill adapted from Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating


  var animating,
    lastTime = 0,
    vendors = ['webkit', 'moz'],
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame;

  for(; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
    requestAnimationFrame = window[ vendors[lastTime] + "RequestAnimationFrame" ];
    cancelAnimationFrame = cancelAnimationFrame ||
      window[ vendors[lastTime] + "CancelAnimationFrame" ] || 
      window[ vendors[lastTime] + "CancelRequestAnimationFrame" ];
  }

  function raf() {
    if ( animating ) {
      requestAnimationFrame( raf );
      jQuery.fx.tick();
    }
  }

  if ( requestAnimationFrame ) {
    // use rAF
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
    jQuery.fx.timer = function( timer ) {
      if ( timer() && jQuery.timers.push( timer ) && !animating ) {
        animating = true;
        raf();
      }
    };

    jQuery.fx.stop = function() {
      animating = false;
    };
  } else {
    // polyfill
    window.requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
        id = window.setTimeout( function() {
          callback( currTime + timeToCall );
        }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };

    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
      
  }

  }( jQuery ));


  function removeQuotes (string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^[\\/'"]+|(;\s?})+|[\\/'"]+$/g, '');
    }

    return string;
  }

  window.Foundation = {
    name : 'Foundation',

    version : '5.0.0',

    media_queries : {
      small : S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      medium : S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      large : S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xlarge: S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xxlarge: S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    init : function (scope, libraries, method, options, response) {
      var library_arr,
          args = [scope, method, options, response],
          responses = [];

      // check RTL
      this.rtl = /rtl/i.test(S('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }

      return scope;
    },

    init_lib : function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);

        if (args && args.hasOwnProperty(lib)) {
          return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
        }

        return this.libs[lib].init.apply(this.libs[lib], args);
      }

      return function () {};
    },

    patch : function (lib) {
      lib.scope = this.scope;
      lib['data_options'] = this.lib_methods.data_options;
      lib['bindings'] = this.lib_methods.bindings;
      lib['S'] = S;
      lib.rtl = this.rtl;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' ');

      for (var i = methods_arr.length - 1; i >= 0; i--) {
        if (this.lib_methods.hasOwnProperty(methods_arr[i])) {
          this.libs[scope.name][methods_arr[i]] = this.lib_methods[methods_arr[i]];
        }
      }
    },

    random_str : function (length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

      if (!length) {
        length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    },

    libs : {},

    // methods that can be inherited in libraries
    lib_methods : {
      throttle : function(fun, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          clearTimeout(timer);
          timer = setTimeout(function () {
            fun.apply(context, args);
          }, delay);
        };
      },

      // parses data-options attribute
      data_options : function (el) {
        var opts = {}, ii, p, opts_arr, opts_len,
            data_options = el.data('options');

        if (typeof data_options === 'object') {
          return data_options;
        }

        opts_arr = (data_options || ':').split(';'),
        opts_len = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        // parse options
        for (ii = opts_len - 1; ii >= 0; ii--) {
          p = opts_arr[ii].split(':');

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      delay : function (fun, delay) {
        return setTimeout(fun, delay);
      },

      // test for empty object or array
      empty : function (obj) {
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;

        for (var key in obj) {
          if (hasOwnProperty.call(obj, key))    return false;
        }

        return true;
      },

      register_media : function(media, media_class) {
        if(Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '">');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },

      addCustomRule : function(rule, media) {
        if(media === undefined) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];
          if(query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' + 
              Foundation.media_queries[media] + '{ ' + rule + ' }');
          }
        }
      },

      loaded : function (image, callback) {
        function loaded () {
          callback(image[0]);
        }

        function bindLoad () {
          this.one('load', loaded);

          if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            var src = this.attr( 'src' ),
                param = src.match( /\?/ ) ? '&' : '?';

            param += 'random=' + (new Date()).getTime();
            this.attr('src', src + param);
          }
        }

        if (!image.attr('src')) {
          loaded();
          return;
        }

        if (image[0].complete || image[0].readyState === 4) {
          loaded();
        } else {
          bindLoad.call(image);
        }
      },

      bindings : function (method, options) {
        var self = this,
            should_bind_events = !S(this).data(this.name + '-init');

        if (typeof method === 'string') {
          return this[method].call(this);
        }

        if (S(this.scope).is('[data-' + this.name +']')) {
          S(this.scope).data(this.name + '-init', $.extend({}, this.settings, (options || method), this.data_options(S(this.scope))));

          if (should_bind_events) {
            this.events(this.scope);
          }

        } else {
          S('[data-' + this.name + ']', this.scope).each(function () {
            var should_bind_events = !S(this).data(self.name + '-init');

            S(this).data(self.name + '-init', $.extend({}, self.settings, (options || method), self.data_options(S(this))));

            if (should_bind_events) {
              self.events(this);
            }
          });
        }
      }
    }
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.topbar = {
    name : 'topbar',

    version: '5.0.1',

    settings : {
      index : 0,
      sticky_class : 'sticky',
      custom_back_text: true,
      back_text: 'Back',
      is_hover: true,
      mobile_show_parent_link: false,
      scrolltop : true // jump to top when sticky nav menu toggle is clicked
    },

    init : function (section, method, options) {
      Foundation.inherit(this, 'addCustomRule register_media throttle');
      var self = this;

      self.register_media('topbar', 'foundation-mq-topbar');

      this.bindings(method, options);

      $('[data-topbar]', this.scope).each(function () {
        var topbar = $(this),
            settings = topbar.data('topbar-init'),
            section = $('section', this),
            titlebar = $('> ul', this).first();

        topbar.data('index', 0);

        var topbarContainer = topbar.parent();
        if(topbarContainer.hasClass('fixed') || topbarContainer.hasClass(settings.sticky_class)) {
          self.settings.sticky_class = settings.sticky_class;
          self.settings.stick_topbar = topbar;
          topbar.data('height', topbarContainer.outerHeight());
          topbar.data('stickyoffset', topbarContainer.offset().top);
        } else {
          topbar.data('height', topbar.outerHeight());
        }

        if (!settings.assembled) self.assemble(topbar);

        if (settings.is_hover) {
          $('.has-dropdown', topbar).addClass('not-click');
        } else {
          $('.has-dropdown', topbar).removeClass('not-click');
        }

        // Pad body when sticky (scrolled) or fixed.
        self.addCustomRule('.f-topbar-fixed { padding-top: ' + topbar.data('height') + 'px }');

        if (topbarContainer.hasClass('fixed')) {
          $('body').addClass('f-topbar-fixed');
        }
      });

    },

    toggle: function (toggleEl) {
      var self = this;

      if (toggleEl) {
        var topbar = $(toggleEl).closest('[data-topbar]');
      } else {
        var topbar = $('[data-topbar]');
      }

      var settings = topbar.data('topbar-init');

      var section = $('section, .section', topbar);

      if (self.breakpoint()) {
        if (!self.rtl) {
          section.css({left: '0%'});
          $('>.name', section).css({left: '100%'});
        } else {
          section.css({right: '0%'});
          $('>.name', section).css({right: '100%'});
        }

        $('li.moved', section).removeClass('moved');
        topbar.data('index', 0);

        topbar
          .toggleClass('expanded')
          .css('height', '');
      }

      if (settings.scrolltop) {
        if (!topbar.hasClass('expanded')) {
          if (topbar.hasClass('fixed')) {
            topbar.parent().addClass('fixed');
            topbar.removeClass('fixed');
            $('body').addClass('f-topbar-fixed');
          }
        } else if (topbar.parent().hasClass('fixed')) {
          if (settings.scrolltop) {
            topbar.parent().removeClass('fixed');
            topbar.addClass('fixed');
            $('body').removeClass('f-topbar-fixed');

            window.scrollTo(0,0);
          } else {
              topbar.parent().removeClass('expanded');
          }
        }
      } else {
        if(topbar.parent().hasClass(self.settings.sticky_class)) {
          topbar.parent().addClass('fixed');
        }

        if(topbar.parent().hasClass('fixed')) {
          if (!topbar.hasClass('expanded')) {
            topbar.removeClass('fixed');
            topbar.parent().removeClass('expanded');
            self.update_sticky_positioning();
          } else {
            topbar.addClass('fixed');
            topbar.parent().addClass('expanded');
          }
        }
      }
    },

    timer : null,

    events : function (bar) {
      var self = this;
      $(this.scope)
        .off('.topbar')
        .on('click.fndtn.topbar', '[data-topbar] .toggle-topbar', function (e) {
          e.preventDefault();
          self.toggle(this);
        })
        .on('click.fndtn.topbar', '[data-topbar] li.has-dropdown', function (e) {
          var li = $(this),
              target = $(e.target),
              topbar = li.closest('[data-topbar]'),
              settings = topbar.data('topbar-init');

          if(target.data('revealId')) {
            self.toggle();
            return;
          }

          if (self.breakpoint()) return;
          if (settings.is_hover && !Modernizr.touch) return;

          e.stopImmediatePropagation();

          if (li.hasClass('hover')) {
            li
              .removeClass('hover')
              .find('li')
              .removeClass('hover');

            li.parents('li.hover')
              .removeClass('hover');
          } else {
            li.addClass('hover');

            if (target[0].nodeName === 'A' && target.parent().hasClass('has-dropdown')) {
              e.preventDefault();
            }
          }
        })
        .on('click.fndtn.topbar', '[data-topbar] .has-dropdown>a', function (e) {
          if (self.breakpoint()) {

            e.preventDefault();

            var $this = $(this),
                topbar = $this.closest('[data-topbar]'),
                section = topbar.find('section, .section'),
                dropdownHeight = $this.next('.dropdown').outerHeight(),
                $selectedLi = $this.closest('li');

            topbar.data('index', topbar.data('index') + 1);
            $selectedLi.addClass('moved');

            if (!self.rtl) {
              section.css({left: -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({left: 100 * topbar.data('index') + '%'});
            } else {
              section.css({right: -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({right: 100 * topbar.data('index') + '%'});
            }

            topbar.css('height', $this.siblings('ul').outerHeight(true) + topbar.data('height'));
          }
        });
      
      $(window).off('.topbar').on('resize.fndtn.topbar', self.throttle(function () {
        self.resize.call(self);
      }, 50)).trigger('resize');

      $('body').off('.topbar').on('click.fndtn.topbar touchstart.fndtn.topbar', function (e) {
        var parent = $(e.target).closest('li').closest('li.hover');

        if (parent.length > 0) {
          return;
        }

        $('[data-topbar] li').removeClass('hover');
      });

      // Go up a level on Click
      $(this.scope).on('click.fndtn.topbar', '[data-topbar] .has-dropdown .back', function (e) {
        e.preventDefault();

        var $this = $(this),
            topbar = $this.closest('[data-topbar]'),
            section = topbar.find('section, .section'),
            settings = topbar.data('topbar-init'),
            $movedLi = $this.closest('li.moved'),
            $previousLevelUl = $movedLi.parent();

        topbar.data('index', topbar.data('index') - 1);

        if (!self.rtl) {
          section.css({left: -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({left: 100 * topbar.data('index') + '%'});
        } else {
          section.css({right: -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({right: 100 * topbar.data('index') + '%'});
        }

        if (topbar.data('index') === 0) {
          topbar.css('height', '');
        } else {
          topbar.css('height', $previousLevelUl.outerHeight(true) + topbar.data('height'));
        }

        setTimeout(function () {
          $movedLi.removeClass('moved');
        }, 300);
      });
    },

    resize : function () {
      var self = this;
      $('[data-topbar]').each(function () {
        var topbar = $(this),
            settings = topbar.data('topbar-init');

        var stickyContainer = topbar.parent('.' + self.settings.sticky_class);
        var stickyOffset;

        if (!self.breakpoint()) {
          var doToggle = topbar.hasClass('expanded');
          topbar
            .css('height', '')
            .removeClass('expanded')
            .find('li')
            .removeClass('hover');

            if(doToggle) {
              self.toggle(topbar);
            }
        }

        if(stickyContainer.length > 0) {
          if(stickyContainer.hasClass('fixed')) {
            // Remove the fixed to allow for correct calculation of the offset.
            stickyContainer.removeClass('fixed');

            stickyOffset = stickyContainer.offset().top;
            if($(document.body).hasClass('f-topbar-fixed')) {
              stickyOffset -= topbar.data('height');
            }

            topbar.data('stickyoffset', stickyOffset);
            stickyContainer.addClass('fixed');
          } else {
            stickyOffset = stickyContainer.offset().top;
            topbar.data('stickyoffset', stickyOffset);
          }
        }

      });
    },

    breakpoint : function () {
      return !matchMedia(Foundation.media_queries['topbar']).matches;
    },

    assemble : function (topbar) {
      var self = this,
          settings = topbar.data('topbar-init'),
          section = $('section', topbar),
          titlebar = $('> ul', topbar).first();

      // Pull element out of the DOM for manipulation
      section.detach();

      $('.has-dropdown>a', section).each(function () {
        var $link = $(this),
            $dropdown = $link.siblings('.dropdown'),
            url = $link.attr('href');

        if (settings.mobile_show_parent_link && url && url.length > 1) {
          var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li><li><a class="parent-link js-generated" href="' + url + '">' + $link.text() +'</a></li>');
        } else {
          var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li>');
        }

        // Copy link to subnav
        if (settings.custom_back_text == true) {
          $('h5>a', $titleLi).html(settings.back_text);
        } else {
          $('h5>a', $titleLi).html('&laquo; ' + $link.html());
        }
        $dropdown.prepend($titleLi);
      });

      // Put element back in the DOM
      section.appendTo(topbar);

      // check for sticky
      this.sticky();

      this.assembled(topbar);
    },

    assembled : function (topbar) {
      topbar.data('topbar-init', $.extend({}, topbar.data('topbar-init'), {assembled: true}));
    },

    height : function (ul) {
      var total = 0,
          self = this;

      $('> li', ul).each(function () { total += $(this).outerHeight(true); });

      return total;
    },

    sticky : function () {
      var $window = $(window),
          self = this;

      $(window).on('scroll', function() {
        self.update_sticky_positioning();
      });
    },

    update_sticky_positioning: function() {
      var klass = '.' + this.settings.sticky_class;
      var $window = $(window);

      if ($(klass).length > 0) {
        var distance = this.settings.sticky_topbar.data('stickyoffset');
        if (!$(klass).hasClass('expanded')) {
          if ($window.scrollTop() > (distance)) {
            if (!$(klass).hasClass('fixed')) {
              $(klass).addClass('fixed');
              $('body').addClass('f-topbar-fixed');
            }
          } else if ($window.scrollTop() <= distance) {
            if ($(klass).hasClass('fixed')) {
              $(klass).removeClass('fixed');
              $('body').removeClass('f-topbar-fixed');
            }
          }
        }
      }
    },

    off : function () {
      $(this.scope).off('.fndtn.topbar');
      $(window).off('.fndtn.topbar');
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, browserSupportsTurbolinks, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeHash, removeHashForIE10compatiblity, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  pageCache = {};

  cacheSize = 10;

  currentState = null;

  loadedAssets = null;

  referer = null;

  createDocument = null;

  xhr = null;

  fetchReplacement = function(url) {
    rememberReferer();
    cacheCurrentPage();
    triggerEvent('page:fetch', {
      url: url
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', removeHashForIE10compatiblity(url), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        resetScrollPosition();
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    cacheCurrentPage();
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent('page:change');
    return triggerEvent('page:update');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  removeHashForIE10compatiblity = function(url) {
    return removeHash(url);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref = testDoc.body) != null ? _ref.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent('page:change');
      return triggerEvent('page:update');
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent('page:update');
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[event.state.position]) {
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', installHistoryChangeHandler, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  installDocumentReadyPageEventTriggers();

  installJqueryAjaxSuccessPageUpdateTrigger();

  if (browserSupportsTurbolinks) {
    visit = fetchReplacement;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    supported: browserSupportsTurbolinks
  };

}).call(this);
//
// ChemDoodle Web Components uses the following open source software. None
// of these libraries were modified in any way, and are included without
// modification:
//
// - jQuery:          Software URL: http://jquery.com/
//                    License: MIT License
//                    License URL: http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt
// - jQuery:          Software URL: http://plugins.jquery.com/project/mousewheel
//    _mousewheel     License: MIT License
//                    License URL: http://www.opensource.org/licenses/mit-license.php
// - glMatrix:        Software URL: http://code.google.com/p/glmatrix/
//                    License: BSD License
//                    License URL: http://www.opensource.org/licenses/bsd-license.php
//
// =========================== glMatrix ===============================
// gl-matrix 1.3.7 - https://github.com/toji/gl-matrix/blob/master/LICENSE.md
(function(w,D){"object"===typeof exports?module.exports=D(global):"function"===typeof define&&define.amd?define([],function(){return D(w)}):D(w)})(this,function(w){function D(a){return o=a}function G(){return o="undefined"!==typeof Float32Array?Float32Array:Array}var E={};(function(){if("undefined"!=typeof Float32Array){var a=new Float32Array(1),b=new Int32Array(a.buffer);E.invsqrt=function(c){a[0]=c;b[0]=1597463007-(b[0]>>1);var d=a[0];return d*(1.5-0.5*c*d*d)}}else E.invsqrt=function(a){return 1/
Math.sqrt(a)}})();var o=null;G();var r={create:function(a){var b=new o(3);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2]):b[0]=b[1]=b[2]=0;return b},createFrom:function(a,b,c){var d=new o(3);d[0]=a;d[1]=b;d[2]=c;return d},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])},add:function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];
return c},subtract:function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c},multiply:function(a,b,c){if(!c||a===c)return a[0]*=b[0],a[1]*=b[1],a[2]*=b[2],a;c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];return c},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b},scale:function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c},normalize:function(a,b){b||(b=a);var c=
a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(!g)return b[0]=0,b[1]=0,b[2]=0,b;if(1===g)return b[0]=c,b[1]=d,b[2]=e,b;g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b},cross:function(a,b,c){c||(c=a);var d=a[0],e=a[1],a=a[2],g=b[0],f=b[1],b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c},length:function(a){var b=a[0],c=a[1],a=a[2];return Math.sqrt(b*b+c*c+a*a)},squaredLength:function(a){var b=a[0],c=a[1],a=a[2];return b*b+c*c+a*a},dot:function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]},direction:function(a,
b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1],a=a[2]-b[2],b=Math.sqrt(d*d+e*e+a*a);if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d},dist:function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return Math.sqrt(c*c+d*d+e*e)}},H=null,y=new o(4);r.unproject=function(a,b,c,d,e){e||(e=a);H||(H=x.create());var g=H;y[0]=2*(a[0]-d[0])/d[2]-1;y[1]=2*(a[1]-d[1])/d[3]-1;y[2]=
2*a[2]-1;y[3]=1;x.multiply(c,b,g);if(!x.inverse(g))return null;x.multiplyVec4(g,y);if(0===y[3])return null;e[0]=y[0]/y[3];e[1]=y[1]/y[3];e[2]=y[2]/y[3];return e};var L=r.createFrom(1,0,0),M=r.createFrom(0,1,0),N=r.createFrom(0,0,1),z=r.create();r.rotationTo=function(a,b,c){c||(c=k.create());var d=r.dot(a,b);if(1<=d)k.set(O,c);else if(-0.999999>d)r.cross(L,a,z),1.0E-6>r.length(z)&&r.cross(M,a,z),1.0E-6>r.length(z)&&r.cross(N,a,z),r.normalize(z),k.fromAngleAxis(Math.PI,z,c);else{var d=Math.sqrt(2*(1+
d)),e=1/d;r.cross(a,b,z);c[0]=z[0]*e;c[1]=z[1]*e;c[2]=z[2]*e;c[3]=0.5*d;k.normalize(c)}1<c[3]?c[3]=1:-1>c[3]&&(c[3]=-1);return c};r.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};var A={create:function(a){var b=new o(9);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8]):b[0]=b[1]=b[2]=b[3]=b[4]=b[5]=b[6]=b[7]=b[8]=0;return b},createFrom:function(a,b,c,d,e,g,f,h,j){var i=new o(9);i[0]=a;i[1]=b;i[2]=c;i[3]=d;i[4]=e;i[5]=g;i[6]=f;i[7]=h;i[8]=j;return i},
determinant:function(a){var b=a[3],c=a[4],d=a[5],e=a[6],g=a[7],f=a[8];return a[0]*(f*c-d*g)+a[1]*(-f*b+d*e)+a[2]*(g*b-c*e)},inverse:function(a,b){var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],j=a[6],i=a[7],m=a[8],l=m*f-h*i,C=-m*g+h*j,q=i*g-f*j,n=c*l+d*C+e*q;if(!n)return null;n=1/n;b||(b=A.create());b[0]=l*n;b[1]=(-m*d+e*i)*n;b[2]=(h*d-e*f)*n;b[3]=C*n;b[4]=(m*c-e*j)*n;b[5]=(-h*c+e*g)*n;b[6]=q*n;b[7]=(-i*c+d*j)*n;b[8]=(f*c-d*g)*n;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],
f=a[3],h=a[4],j=a[5],i=a[6],m=a[7],a=a[8],l=b[0],C=b[1],q=b[2],n=b[3],k=b[4],p=b[5],o=b[6],s=b[7],b=b[8];c[0]=l*d+C*f+q*i;c[1]=l*e+C*h+q*m;c[2]=l*g+C*j+q*a;c[3]=n*d+k*f+p*i;c[4]=n*e+k*h+p*m;c[5]=n*g+k*j+p*a;c[6]=o*d+s*f+b*i;c[7]=o*e+s*h+b*m;c[8]=o*g+s*j+b*a;return c},multiplyVec2:function(a,b,c){c||(c=b);var d=b[0],b=b[1];c[0]=d*a[0]+b*a[3]+a[6];c[1]=d*a[1]+b*a[4]+a[7];return c},multiplyVec3:function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=d*a[0]+e*a[3]+b*a[6];c[1]=d*a[1]+e*a[4]+b*a[7];c[2]=
d*a[2]+e*a[5]+b*a[8];return c},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])&&1.0E-6>Math.abs(a[4]-b[4])&&1.0E-6>Math.abs(a[5]-b[5])&&1.0E-6>Math.abs(a[6]-b[6])&&1.0E-6>Math.abs(a[7]-b[7])&&1.0E-6>Math.abs(a[8]-b[8])},identity:function(a){a||(a=A.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;
a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b},toMat4:function(a,b){b||(b=x.create());b[15]=1;b[14]=0;b[13]=0;b[12]=0;b[11]=0;b[10]=a[8];b[9]=a[7];b[8]=a[6];b[7]=0;b[6]=a[5];b[5]=a[4];b[4]=a[3];b[3]=0;b[2]=a[2];b[1]=a[1];b[0]=a[0];return b},str:function(a){return"["+a[0]+", "+a[1]+
", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"}},x={create:function(a){var b=new o(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b},createFrom:function(a,b,c,d,e,g,f,h,j,i,m,l,C,q,n,k){var p=new o(16);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=g;p[6]=f;p[7]=h;p[8]=j;p[9]=i;p[10]=m;p[11]=l;p[12]=C;p[13]=q;p[14]=n;p[15]=k;return p},set:function(a,
b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])&&1.0E-6>Math.abs(a[4]-b[4])&&1.0E-6>Math.abs(a[5]-b[5])&&1.0E-6>Math.abs(a[6]-b[6])&&1.0E-6>Math.abs(a[7]-b[7])&&1.0E-6>Math.abs(a[8]-b[8])&&1.0E-6>Math.abs(a[9]-b[9])&&1.0E-6>
Math.abs(a[10]-b[10])&&1.0E-6>Math.abs(a[11]-b[11])&&1.0E-6>Math.abs(a[12]-b[12])&&1.0E-6>Math.abs(a[13]-b[13])&&1.0E-6>Math.abs(a[14]-b[14])&&1.0E-6>Math.abs(a[15]-b[15])},identity:function(a){a||(a=x.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=
a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b},determinant:function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],j=a[7],i=a[8],m=a[9],l=a[10],C=a[11],q=a[12],n=a[13],k=a[14],a=a[15];return q*m*h*e-i*n*h*e-q*f*l*e+g*n*l*e+i*f*k*e-g*m*k*e-q*m*d*j+i*n*d*j+q*c*l*j-b*n*l*j-i*c*k*j+b*m*k*j+q*f*d*C-g*n*d*C-q*c*h*C+b*n*h*C+
g*c*k*C-b*f*k*C-i*f*d*a+g*m*d*a+i*c*h*a-b*m*h*a-g*c*l*a+b*f*l*a},inverse:function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],j=a[6],i=a[7],m=a[8],l=a[9],k=a[10],q=a[11],n=a[12],o=a[13],p=a[14],r=a[15],s=c*h-d*f,v=c*j-e*f,t=c*i-g*f,u=d*j-e*h,w=d*i-g*h,x=e*i-g*j,y=m*o-l*n,z=m*p-k*n,F=m*r-q*n,A=l*p-k*o,D=l*r-q*o,E=k*r-q*p,B=s*E-v*D+t*A+u*F-w*z+x*y;if(!B)return null;B=1/B;b[0]=(h*E-j*D+i*A)*B;b[1]=(-d*E+e*D-g*A)*B;b[2]=(o*x-p*w+r*u)*B;b[3]=(-l*x+k*w-q*u)*B;b[4]=(-f*E+j*F-i*z)*B;b[5]=
(c*E-e*F+g*z)*B;b[6]=(-n*x+p*t-r*v)*B;b[7]=(m*x-k*t+q*v)*B;b[8]=(f*D-h*F+i*y)*B;b[9]=(-c*D+d*F-g*y)*B;b[10]=(n*w-o*t+r*s)*B;b[11]=(-m*w+l*t-q*s)*B;b[12]=(-f*A+h*z-j*y)*B;b[13]=(c*A-d*z+e*y)*B;b[14]=(-n*u+o*v-p*s)*B;b[15]=(m*u-l*v+k*s)*B;return b},toRotationMat:function(a,b){b||(b=x.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b},toMat3:function(a,b){b||(b=A.create());b[0]=
a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b},toInverseMat3:function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],j=a[8],i=a[9],m=a[10],l=m*f-h*i,k=-m*g+h*j,q=i*g-f*j,n=c*l+d*k+e*q;if(!n)return null;n=1/n;b||(b=A.create());b[0]=l*n;b[1]=(-m*d+e*i)*n;b[2]=(h*d-e*f)*n;b[3]=k*n;b[4]=(m*c-e*j)*n;b[5]=(-h*c+e*g)*n;b[6]=q*n;b[7]=(-i*c+d*j)*n;b[8]=(f*c-d*g)*n;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],j=a[5],
i=a[6],m=a[7],l=a[8],k=a[9],q=a[10],n=a[11],o=a[12],p=a[13],r=a[14],a=a[15],s=b[0],v=b[1],t=b[2],u=b[3];c[0]=s*d+v*h+t*l+u*o;c[1]=s*e+v*j+t*k+u*p;c[2]=s*g+v*i+t*q+u*r;c[3]=s*f+v*m+t*n+u*a;s=b[4];v=b[5];t=b[6];u=b[7];c[4]=s*d+v*h+t*l+u*o;c[5]=s*e+v*j+t*k+u*p;c[6]=s*g+v*i+t*q+u*r;c[7]=s*f+v*m+t*n+u*a;s=b[8];v=b[9];t=b[10];u=b[11];c[8]=s*d+v*h+t*l+u*o;c[9]=s*e+v*j+t*k+u*p;c[10]=s*g+v*i+t*q+u*r;c[11]=s*f+v*m+t*n+u*a;s=b[12];v=b[13];t=b[14];u=b[15];c[12]=s*d+v*h+t*l+u*o;c[13]=s*e+v*j+t*k+u*p;c[14]=s*g+
v*i+t*q+u*r;c[15]=s*f+v*m+t*n+u*a;return c},multiplyVec3:function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c},multiplyVec4:function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c},translate:function(a,b,c){var d=b[0],e=b[1],b=b[2],g,f,h,j,i,m,l,k,q,
n,o,p;if(!c||a===c)return a[12]=a[0]*d+a[4]*e+a[8]*b+a[12],a[13]=a[1]*d+a[5]*e+a[9]*b+a[13],a[14]=a[2]*d+a[6]*e+a[10]*b+a[14],a[15]=a[3]*d+a[7]*e+a[11]*b+a[15],a;g=a[0];f=a[1];h=a[2];j=a[3];i=a[4];m=a[5];l=a[6];k=a[7];q=a[8];n=a[9];o=a[10];p=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=j;c[4]=i;c[5]=m;c[6]=l;c[7]=k;c[8]=q;c[9]=n;c[10]=o;c[11]=p;c[12]=g*d+i*e+q*b+a[12];c[13]=f*d+m*e+n*b+a[13];c[14]=h*d+l*e+o*b+a[14];c[15]=j*d+k*e+p*b+a[15];return c},scale:function(a,b,c){var d=b[0],e=b[1],b=b[2];if(!c||a===c)return a[0]*=
d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=b,a[9]*=b,a[10]*=b,a[11]*=b,a;c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c},rotate:function(a,b,c,d){var e=c[0],g=c[1],c=c[2],f=Math.sqrt(e*e+g*g+c*c),h,j,i,m,l,k,q,n,o,p,r,s,v,t,u,w,x,y,z,A;if(!f)return null;1!==f&&(f=1/f,e*=f,g*=f,c*=f);h=Math.sin(b);j=Math.cos(b);i=1-j;b=a[0];
f=a[1];m=a[2];l=a[3];k=a[4];q=a[5];n=a[6];o=a[7];p=a[8];r=a[9];s=a[10];v=a[11];t=e*e*i+j;u=g*e*i+c*h;w=c*e*i-g*h;x=e*g*i-c*h;y=g*g*i+j;z=c*g*i+e*h;A=e*c*i+g*h;e=g*c*i-e*h;g=c*c*i+j;d?a!==d&&(d[12]=a[12],d[13]=a[13],d[14]=a[14],d[15]=a[15]):d=a;d[0]=b*t+k*u+p*w;d[1]=f*t+q*u+r*w;d[2]=m*t+n*u+s*w;d[3]=l*t+o*u+v*w;d[4]=b*x+k*y+p*z;d[5]=f*x+q*y+r*z;d[6]=m*x+n*y+s*z;d[7]=l*x+o*y+v*z;d[8]=b*A+k*e+p*g;d[9]=f*A+q*e+r*g;d[10]=m*A+n*e+s*g;d[11]=l*A+o*e+v*g;return d},rotateX:function(a,b,c){var d=Math.sin(b),
b=Math.cos(b),e=a[4],g=a[5],f=a[6],h=a[7],j=a[8],i=a[9],m=a[10],l=a[11];c?a!==c&&(c[0]=a[0],c[1]=a[1],c[2]=a[2],c[3]=a[3],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[4]=e*b+j*d;c[5]=g*b+i*d;c[6]=f*b+m*d;c[7]=h*b+l*d;c[8]=e*-d+j*b;c[9]=g*-d+i*b;c[10]=f*-d+m*b;c[11]=h*-d+l*b;return c},rotateY:function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],j=a[8],i=a[9],m=a[10],l=a[11];c?a!==c&&(c[4]=a[4],c[5]=a[5],c[6]=a[6],c[7]=a[7],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=
a[15]):c=a;c[0]=e*b+j*-d;c[1]=g*b+i*-d;c[2]=f*b+m*-d;c[3]=h*b+l*-d;c[8]=e*d+j*b;c[9]=g*d+i*b;c[10]=f*d+m*b;c[11]=h*d+l*b;return c},rotateZ:function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],j=a[4],i=a[5],m=a[6],l=a[7];c?a!==c&&(c[8]=a[8],c[9]=a[9],c[10]=a[10],c[11]=a[11],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+j*d;c[1]=g*b+i*d;c[2]=f*b+m*d;c[3]=h*b+l*d;c[4]=e*-d+j*b;c[5]=g*-d+i*b;c[6]=f*-d+m*b;c[7]=h*-d+l*b;return c},frustum:function(a,b,c,d,e,g,f){f||
(f=x.create());var h=b-a,j=d-c,i=g-e;f[0]=2*e/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2*e/j;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/j;f[10]=-(g+e)/i;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(2*g*e)/i;f[15]=0;return f},perspective:function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b*=a;return x.frustum(-b,b,-a,a,c,d,e)},ortho:function(a,b,c,d,e,g,f){f||(f=x.create());var h=b-a,j=d-c,i=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/j;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/i;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/j;f[14]=
-(g+e)/i;f[15]=1;return f},lookAt:function(a,b,c,d){d||(d=x.create());var e,g,f,h,j,i,m,l,k=a[0],o=a[1],a=a[2];f=c[0];h=c[1];g=c[2];m=b[0];c=b[1];e=b[2];if(k===m&&o===c&&a===e)return x.identity(d);b=k-m;c=o-c;m=a-e;l=1/Math.sqrt(b*b+c*c+m*m);b*=l;c*=l;m*=l;e=h*m-g*c;g=g*b-f*m;f=f*c-h*b;(l=Math.sqrt(e*e+g*g+f*f))?(l=1/l,e*=l,g*=l,f*=l):f=g=e=0;h=c*f-m*g;j=m*e-b*f;i=b*g-c*e;(l=Math.sqrt(h*h+j*j+i*i))?(l=1/l,h*=l,j*=l,i*=l):i=j=h=0;d[0]=e;d[1]=h;d[2]=b;d[3]=0;d[4]=g;d[5]=j;d[6]=c;d[7]=0;d[8]=f;d[9]=
i;d[10]=m;d[11]=0;d[12]=-(e*k+g*o+f*a);d[13]=-(h*k+j*o+i*a);d[14]=-(b*k+c*o+m*a);d[15]=1;return d},fromRotationTranslation:function(a,b,c){c||(c=x.create());var d=a[0],e=a[1],g=a[2],f=a[3],h=d+d,j=e+e,i=g+g,a=d*h,m=d*j,d=d*i,k=e*j,e=e*i,g=g*i,h=f*h,j=f*j,f=f*i;c[0]=1-(k+g);c[1]=m+f;c[2]=d-j;c[3]=0;c[4]=m-f;c[5]=1-(a+g);c[6]=e+h;c[7]=0;c[8]=d+j;c[9]=e-h;c[10]=1-(a+k);c[11]=0;c[12]=b[0];c[13]=b[1];c[14]=b[2];c[15]=1;return c},str:function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+
a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"}},k={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):b[0]=b[1]=b[2]=b[3]=0;return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>
Math.abs(a[3]-b[3])},identity:function(a){a||(a=k.create());a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a}},O=k.identity();k.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a===b)return a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a;b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};k.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]};k.inverse=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[3],c=(c=c*c+d*d+e*e+g*g)?1/c:0;if(!b||a===b)return a[0]*=-c,a[1]*=-c,a[2]*=-c,a[3]*=
c,a;b[0]=-a[0]*c;b[1]=-a[1]*c;b[2]=-a[2]*c;b[3]=a[3]*c;return b};k.conjugate=function(a,b){if(!b||a===b)return a[0]*=-1,a[1]*=-1,a[2]*=-1,a;b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};k.length=function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};k.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(0===f)return b[0]=0,b[1]=0,b[2]=0,b[3]=0,b;f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};k.add=function(a,b,c){if(!c||
a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a[3]+=b[3],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];c[3]=a[3]+b[3];return c};k.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=b[0],h=b[1],j=b[2],b=b[3];c[0]=d*b+a*f+e*j-g*h;c[1]=e*b+a*h+g*f-d*j;c[2]=g*b+a*j+d*h-e*f;c[3]=a*b-d*f-e*h-g*j;return c};k.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=a[0],f=a[1],h=a[2],a=a[3],j=a*d+f*g-h*e,i=a*e+h*d-b*g,k=a*g+b*e-f*d,d=-b*d-f*e-h*g;c[0]=j*a+d*-b+i*-h-k*-f;c[1]=i*a+
d*-f+k*-b-j*-h;c[2]=k*a+d*-h+j*-f-i*-b;return c};k.scale=function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a[3]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;c[3]=a[3]*b;return c};k.toMat3=function(a,b){b||(b=A.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,j=e+e,i=c*f,k=c*h,c=c*j,l=d*h,d=d*j,e=e*j,f=g*f,h=g*h,g=g*j;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=k-g;b[4]=1-(i+e);b[5]=d+f;b[6]=c+h;b[7]=d-f;b[8]=1-(i+l);return b};k.toMat4=function(a,b){b||(b=x.create());var c=a[0],d=a[1],e=a[2],g=
a[3],f=c+c,h=d+d,j=e+e,i=c*f,k=c*h,c=c*j,l=d*h,d=d*j,e=e*j,f=g*f,h=g*h,g=g*j;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=0;b[4]=k-g;b[5]=1-(i+e);b[6]=d+f;b[7]=0;b[8]=c+h;b[9]=d-f;b[10]=1-(i+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};k.slerp=function(a,b,c,d){d||(d=a);var e=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],g,f;if(1<=Math.abs(e))return d!==a&&(d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=a[3]),d;g=Math.acos(e);f=Math.sqrt(1-e*e);if(0.001>Math.abs(f))return d[0]=0.5*a[0]+0.5*b[0],d[1]=0.5*a[1]+0.5*b[1],
d[2]=0.5*a[2]+0.5*b[2],d[3]=0.5*a[3]+0.5*b[3],d;e=Math.sin((1-c)*g)/f;c=Math.sin(c*g)/f;d[0]=a[0]*e+b[0]*c;d[1]=a[1]*e+b[1]*c;d[2]=a[2]*e+b[2]*c;d[3]=a[3]*e+b[3]*c;return d};k.fromRotationMatrix=function(a,b){b||(b=k.create());var c=a[0]+a[4]+a[8],d;if(0<c)d=Math.sqrt(c+1),b[3]=0.5*d,d=0.5/d,b[0]=(a[7]-a[5])*d,b[1]=(a[2]-a[6])*d,b[2]=(a[3]-a[1])*d;else{d=k.fromRotationMatrix.s_iNext=k.fromRotationMatrix.s_iNext||[1,2,0];c=0;a[4]>a[0]&&(c=1);a[8]>a[3*c+c]&&(c=2);var e=d[c],g=d[e];d=Math.sqrt(a[3*c+
c]-a[3*e+e]-a[3*g+g]+1);b[c]=0.5*d;d=0.5/d;b[3]=(a[3*g+e]-a[3*e+g])*d;b[e]=(a[3*e+c]+a[3*c+e])*d;b[g]=(a[3*g+c]+a[3*c+g])*d}return b};A.toQuat4=k.fromRotationMatrix;(function(){var a=A.create();k.fromAxes=function(b,c,d,e){a[0]=c[0];a[3]=c[1];a[6]=c[2];a[1]=d[0];a[4]=d[1];a[7]=d[2];a[2]=b[0];a[5]=b[1];a[8]=b[2];return k.fromRotationMatrix(a,e)}})();k.identity=function(a){a||(a=k.create());a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a};k.fromAngleAxis=function(a,b,c){c||(c=k.create());var a=0.5*a,d=Math.sin(a);
c[3]=Math.cos(a);c[0]=d*b[0];c[1]=d*b[1];c[2]=d*b[2];return c};k.toAngleAxis=function(a,b){b||(b=a);var c=a[0]*a[0]+a[1]*a[1]+a[2]*a[2];0<c?(b[3]=2*Math.acos(a[3]),c=E.invsqrt(c),b[0]=a[0]*c,b[1]=a[1]*c,b[2]=a[2]*c):(b[3]=0,b[0]=1,b[1]=0,b[2]=0);return b};k.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};var J={create:function(a){var b=new o(2);a?(b[0]=a[0],b[1]=a[1]):(b[0]=0,b[1]=0);return b},createFrom:function(a,b){var c=new o(2);c[0]=a;c[1]=b;return c},add:function(a,b,c){c||
(c=b);c[0]=a[0]+b[0];c[1]=a[1]+b[1];return c},subtract:function(a,b,c){c||(c=b);c[0]=a[0]-b[0];c[1]=a[1]-b[1];return c},multiply:function(a,b,c){c||(c=b);c[0]=a[0]*b[0];c[1]=a[1]*b[1];return c},divide:function(a,b,c){c||(c=b);c[0]=a[0]/b[0];c[1]=a[1]/b[1];return c},scale:function(a,b,c){c||(c=a);c[0]=a[0]*b;c[1]=a[1]*b;return c},dist:function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return Math.sqrt(c*c+d*d)},set:function(a,b){b[0]=a[0];b[1]=a[1];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-
b[0])&&1.0E-6>Math.abs(a[1]-b[1])},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];return b},normalize:function(a,b){b||(b=a);var c=a[0]*a[0]+a[1]*a[1];0<c?(c=Math.sqrt(c),b[0]=a[0]/c,b[1]=a[1]/c):b[0]=b[1]=0;return b},cross:function(a,b,c){a=a[0]*b[1]-a[1]*b[0];if(!c)return a;c[0]=c[1]=0;c[2]=a;return c},length:function(a){var b=a[0],a=a[1];return Math.sqrt(b*b+a*a)},squaredLength:function(a){var b=a[0],a=a[1];return b*b+a*a},dot:function(a,b){return a[0]*b[0]+a[1]*b[1]},direction:function(a,
b,c){c||(c=a);var d=a[0]-b[0],a=a[1]-b[1],b=d*d+a*a;if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/Math.sqrt(b);c[0]=d*b;c[1]=a*b;return c},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);return d},str:function(a){return"["+a[0]+", "+a[1]+"]"}},I={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):b[0]=b[1]=b[2]=b[3]=0;return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},set:function(a,b){b[0]=a[0];b[1]=a[1];
b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])},identity:function(a){a||(a=I.create());a[0]=1;a[1]=0;a[2]=0;a[3]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1];a[1]=a[2];a[2]=c;return a}b[0]=a[0];b[1]=a[2];b[2]=a[1];b[3]=a[3];return b},determinant:function(a){return a[0]*a[3]-a[2]*a[1]},inverse:function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=c*g-e*
d;if(!f)return null;f=1/f;b[0]=g*f;b[1]=-d*f;b[2]=-e*f;b[3]=c*f;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3];c[0]=d*b[0]+e*b[2];c[1]=d*b[1]+e*b[3];c[2]=g*b[0]+a*b[2];c[3]=g*b[1]+a*b[3];return c},rotate:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=Math.sin(b),b=Math.cos(b);c[0]=d*b+e*f;c[1]=d*-f+e*b;c[2]=g*b+a*f;c[3]=g*-f+a*b;return c},multiplyVec2:function(a,b,c){c||(c=b);var d=b[0],b=b[1];c[0]=d*a[0]+b*a[1];c[1]=d*a[2]+b*a[3];return c},scale:function(a,
b,c){c||(c=a);var d=a[1],e=a[2],g=a[3],f=b[0],b=b[1];c[0]=a[0]*f;c[1]=d*b;c[2]=e*f;c[3]=g*b;return c},str:function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"}},K={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):(b[0]=0,b[1]=0,b[2]=0,b[3]=0);return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},add:function(a,b,c){c||(c=b);c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];c[3]=a[3]+b[3];return c},subtract:function(a,b,c){c||(c=
b);c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];c[3]=a[3]-b[3];return c},multiply:function(a,b,c){c||(c=b);c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];c[3]=a[3]*b[3];return c},divide:function(a,b,c){c||(c=b);c[0]=a[0]/b[0];c[1]=a[1]/b[1];c[2]=a[2]/b[2];c[3]=a[3]/b[3];return c},scale:function(a,b,c){c||(c=a);c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;c[3]=a[3]*b;return c},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>
Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=-a[3];return b},length:function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)},squaredLength:function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return b*b+c*c+d*d+a*a},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);d[3]=a[3]+c*(b[3]-a[3]);return d},str:function(a){return"["+a[0]+", "+
a[1]+", "+a[2]+", "+a[3]+"]"}};w&&(w.glMatrixArrayType=o,w.MatrixArray=o,w.setMatrixArrayType=D,w.determineMatrixArrayType=G,w.glMath=E,w.vec2=J,w.vec3=r,w.vec4=K,w.mat2=I,w.mat3=A,w.mat4=x,w.quat4=k);return{glMatrixArrayType:o,MatrixArray:o,setMatrixArrayType:D,determineMatrixArrayType:G,glMath:E,vec2:J,vec3:r,vec4:K,mat2:I,mat3:A,mat4:x,quat4:k}});
// =========================== _mousewheel ===============================
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 * Version: 3.1.6
 * Requires: jQuery 1.2.2+
 */
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e}else{e(jQuery)}})(function(e){function u(t){var n=t||window.event,o=r.call(arguments,1),u=0,f=0,l=0,c=0;t=e.event.fix(n);t.type="mousewheel";if("detail"in n){l=n.detail*-1}if("wheelDelta"in n){l=n.wheelDelta}if("wheelDeltaY"in n){l=n.wheelDeltaY}if("wheelDeltaX"in n){f=n.wheelDeltaX*-1}if("axis"in n&&n.axis===n.HORIZONTAL_AXIS){f=l*-1;l=0}u=l===0?f:l;if("deltaY"in n){l=n.deltaY*-1;u=l}if("deltaX"in n){f=n.deltaX;if(l===0){u=f*-1}}if(l===0&&f===0){return}c=Math.max(Math.abs(l),Math.abs(f));if(!s||c<s){s=c}u=Math[u>=1?"floor":"ceil"](u/s);f=Math[f>=1?"floor":"ceil"](f/s);l=Math[l>=1?"floor":"ceil"](l/s);t.deltaX=f;t.deltaY=l;t.deltaFactor=s;o.unshift(t,u,f,l);if(i){clearTimeout(i)}i=setTimeout(a,200);return(e.event.dispatch||e.event.handle).apply(this,o)}function a(){s=null}var t=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],n="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],r=Array.prototype.slice,i,s;if(e.event.fixHooks){for(var o=t.length;o;){e.event.fixHooks[t[--o]]=e.event.mouseHooks}}e.event.special.mousewheel={version:"3.1.6",setup:function(){if(this.addEventListener){for(var e=n.length;e;){this.addEventListener(n[--e],u,false)}}else{this.onmousewheel=u}},teardown:function(){if(this.removeEventListener){for(var e=n.length;e;){this.removeEventListener(n[--e],u,false)}}else{this.onmousewheel=null}}};e.fn.extend({mousewheel:function(e){return e?this.bind("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.unbind("mousewheel",e)}})})
;
//
// ChemDoodle Web Components 5.2.3
//
// http://web.chemdoodle.com
//
// Copyright 2009-2013 iChemLabs, LLC.  All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// As a special exception to the GPL, any HTML file in a public website
// or any free web service which merely makes function calls to this
// code, and for that purpose includes it by reference, shall be deemed
// a separate work for copyright law purposes. If you modify this code,
// you may extend this exception to your version of the code, but you
// are not obligated to do so. If you do not wish to do so, delete this
// exception statement from your version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// Please contact iChemLabs <http://www.ichemlabs.com/contact-us> for
// alternate licensing options.
//
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2934 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-08 20:53:47 -0500 (Wed, 08 Dec 2010) $
//
var ChemDoodle = (function() {
  'use strict';
  var c = {};

  c.structures = {};
  c.structures.d2 = {};
  c.structures.d3 = {};
  c.iChemLabs = {};
  c.informatics = {};
  c.io = {};

  var VERSION = '5.2.3';

  c.getVersion = function() {
    return VERSION;
  };

  return c;

})();
//
//  Copyright 2006-2010 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4401 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-08 12:26:27 -0400 (Sat, 08 Jun 2013) $
//

ChemDoodle.extensions = (function(structures, v3, m) {
  'use strict';
  var ext = {};

  ext.stringStartsWith = function(str, match) {
    return str.slice(0, match.length) === match;
  };

  ext.vec3AngleFrom = function(v1, v2) {
    var length1 = v3.length(v1);
    var length2 = v3.length(v2);
    var dot = v3.dot(v1, v2);
    var cosine = dot / length1 / length2;
    return m.acos(cosine);
  };

  ext.contextHashTo = function(ctx, xs, ys, xt, yt, width, spacing) {
    var travelled = 0;
    var dist = new structures.Point(xs, ys).distance(new structures.Point(xt, yt));
    var space = false;
    var lastX = xs;
    var lastY = ys;
    var difX = xt - xs;
    var difY = yt - ys;
    while (travelled < dist) {
      if (space) {
        if (travelled + spacing > dist) {
          ctx.moveTo(xt, yt);
          break;
        } else {
          var percent = spacing / dist;
          lastX += percent * difX;
          lastY += percent * difY;
          ctx.moveTo(lastX, lastY);
          travelled += spacing;
        }
      } else {
        if (travelled + width > dist) {
          ctx.lineTo(xt, yt);
          break;
        } else {
          var percent = width / dist;
          lastX += percent * difX;
          lastY += percent * difY;
          ctx.lineTo(lastX, lastY);
          travelled += width;
        }
      }
      space = !space;
    }
  };

  ext.contextRoundRect = function(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  ext.contextEllipse = function(ctx, x, y, w, h) {
    var kappa = .5522848;
    var ox = (w / 2) * kappa;
    var oy = (h / 2) * kappa;
    var xe = x + w;
    var ye = y + h;
    var xm = x + w / 2;
    var ym = y + h / 2;

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
  };

  ext.getFontString = function(size, families, bold, italic) {
    var sb = [];
    if (bold) {
      sb.push('bold ');
    }
    if (italic) {
      sb.push('italic ');
    }
    sb.push(size + 'px ');
    for ( var i = 0, ii = families.length; i < ii; i++) {
      var use = families[i];
      if (use.indexOf(' ') !== -1) {
        use = '"' + use + '"';
      }
      sb.push((i !== 0 ? ',' : '') + use);
    }
    return sb.join('');
  };

  return ext;

})(ChemDoodle.structures, vec3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

ChemDoodle.math = (function(extensions, structures, m) {
  'use strict';
  var pack = {};

  var namedColors = {
    'aliceblue' : '#f0f8ff',
    'antiquewhite' : '#faebd7',
    'aqua' : '#00ffff',
    'aquamarine' : '#7fffd4',
    'azure' : '#f0ffff',
    'beige' : '#f5f5dc',
    'bisque' : '#ffe4c4',
    'black' : '#000000',
    'blanchedalmond' : '#ffebcd',
    'blue' : '#0000ff',
    'blueviolet' : '#8a2be2',
    'brown' : '#a52a2a',
    'burlywood' : '#deb887',
    'cadetblue' : '#5f9ea0',
    'chartreuse' : '#7fff00',
    'chocolate' : '#d2691e',
    'coral' : '#ff7f50',
    'cornflowerblue' : '#6495ed',
    'cornsilk' : '#fff8dc',
    'crimson' : '#dc143c',
    'cyan' : '#00ffff',
    'darkblue' : '#00008b',
    'darkcyan' : '#008b8b',
    'darkgoldenrod' : '#b8860b',
    'darkgray' : '#a9a9a9',
    'darkgreen' : '#006400',
    'darkkhaki' : '#bdb76b',
    'darkmagenta' : '#8b008b',
    'darkolivegreen' : '#556b2f',
    'darkorange' : '#ff8c00',
    'darkorchid' : '#9932cc',
    'darkred' : '#8b0000',
    'darksalmon' : '#e9967a',
    'darkseagreen' : '#8fbc8f',
    'darkslateblue' : '#483d8b',
    'darkslategray' : '#2f4f4f',
    'darkturquoise' : '#00ced1',
    'darkviolet' : '#9400d3',
    'deeppink' : '#ff1493',
    'deepskyblue' : '#00bfff',
    'dimgray' : '#696969',
    'dodgerblue' : '#1e90ff',
    'firebrick' : '#b22222',
    'floralwhite' : '#fffaf0',
    'forestgreen' : '#228b22',
    'fuchsia' : '#ff00ff',
    'gainsboro' : '#dcdcdc',
    'ghostwhite' : '#f8f8ff',
    'gold' : '#ffd700',
    'goldenrod' : '#daa520',
    'gray' : '#808080',
    'green' : '#008000',
    'greenyellow' : '#adff2f',
    'honeydew' : '#f0fff0',
    'hotpink' : '#ff69b4',
    'indianred ' : '#cd5c5c',
    'indigo ' : '#4b0082',
    'ivory' : '#fffff0',
    'khaki' : '#f0e68c',
    'lavender' : '#e6e6fa',
    'lavenderblush' : '#fff0f5',
    'lawngreen' : '#7cfc00',
    'lemonchiffon' : '#fffacd',
    'lightblue' : '#add8e6',
    'lightcoral' : '#f08080',
    'lightcyan' : '#e0ffff',
    'lightgoldenrodyellow' : '#fafad2',
    'lightgrey' : '#d3d3d3',
    'lightgreen' : '#90ee90',
    'lightpink' : '#ffb6c1',
    'lightsalmon' : '#ffa07a',
    'lightseagreen' : '#20b2aa',
    'lightskyblue' : '#87cefa',
    'lightslategray' : '#778899',
    'lightsteelblue' : '#b0c4de',
    'lightyellow' : '#ffffe0',
    'lime' : '#00ff00',
    'limegreen' : '#32cd32',
    'linen' : '#faf0e6',
    'magenta' : '#ff00ff',
    'maroon' : '#800000',
    'mediumaquamarine' : '#66cdaa',
    'mediumblue' : '#0000cd',
    'mediumorchid' : '#ba55d3',
    'mediumpurple' : '#9370d8',
    'mediumseagreen' : '#3cb371',
    'mediumslateblue' : '#7b68ee',
    'mediumspringgreen' : '#00fa9a',
    'mediumturquoise' : '#48d1cc',
    'mediumvioletred' : '#c71585',
    'midnightblue' : '#191970',
    'mintcream' : '#f5fffa',
    'mistyrose' : '#ffe4e1',
    'moccasin' : '#ffe4b5',
    'navajowhite' : '#ffdead',
    'navy' : '#000080',
    'oldlace' : '#fdf5e6',
    'olive' : '#808000',
    'olivedrab' : '#6b8e23',
    'orange' : '#ffa500',
    'orangered' : '#ff4500',
    'orchid' : '#da70d6',
    'palegoldenrod' : '#eee8aa',
    'palegreen' : '#98fb98',
    'paleturquoise' : '#afeeee',
    'palevioletred' : '#d87093',
    'papayawhip' : '#ffefd5',
    'peachpuff' : '#ffdab9',
    'peru' : '#cd853f',
    'pink' : '#ffc0cb',
    'plum' : '#dda0dd',
    'powderblue' : '#b0e0e6',
    'purple' : '#800080',
    'red' : '#ff0000',
    'rosybrown' : '#bc8f8f',
    'royalblue' : '#4169e1',
    'saddlebrown' : '#8b4513',
    'salmon' : '#fa8072',
    'sandybrown' : '#f4a460',
    'seagreen' : '#2e8b57',
    'seashell' : '#fff5ee',
    'sienna' : '#a0522d',
    'silver' : '#c0c0c0',
    'skyblue' : '#87ceeb',
    'slateblue' : '#6a5acd',
    'slategray' : '#708090',
    'snow' : '#fffafa',
    'springgreen' : '#00ff7f',
    'steelblue' : '#4682b4',
    'tan' : '#d2b48c',
    'teal' : '#008080',
    'thistle' : '#d8bfd8',
    'tomato' : '#ff6347',
    'turquoise' : '#40e0d0',
    'violet' : '#ee82ee',
    'wheat' : '#f5deb3',
    'white' : '#ffffff',
    'whitesmoke' : '#f5f5f5',
    'yellow' : '#ffff00',
    'yellowgreen' : '#9acd32'
  };

  pack.angleBetweenLargest = function(angles) {
    if (angles.length === 0) {
      return {
        angle : 0,
        largest : m.PI * 2
      };
    }
    if (angles.length === 1) {
      return {
        angle : angles[0] + m.PI,
        largest : m.PI * 2
      };
    }
    var largest = 0;
    var angle = 0;
    var index = -1;
    for ( var i = 0, ii = angles.length - 1; i < ii; i++) {
      var dif = angles[i + 1] - angles[i];
      if (dif > largest) {
        largest = dif;
        angle = (angles[i + 1] + angles[i]) / 2;
        index = i;
      }
    }
    var last = angles[0] + m.PI * 2 - angles[angles.length - 1];
    if (last > largest) {
      angle = angles[0] - last / 2;
      largest = last;
      if (angle < 0) {
        angle += m.PI * 2;
      }
      index = angles.length - 1;
    }
    return {
      angle : angle,
      largest : largest
    };
  };

  pack.isBetween = function(x, left, right) {
    if (left > right) {
      var tmp = left;
      left = right;
      right = tmp;
    }
    return x >= left && x <= right;
  };

  pack.getRGB = function(color, multiplier) {
    var err = [ 0, 0, 0 ];
    if (namedColors[color.toLowerCase()]) {
      color = namedColors[color.toLowerCase()];
    }
    if (color.charAt(0) === '#') {
      if (color.length === 4) {
        color = '#' + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3);
      }
      return [ parseInt(color.substring(1, 3), 16) / 255.0 * multiplier, parseInt(color.substring(3, 5), 16) / 255.0 * multiplier, parseInt(color.substring(5, 7), 16) / 255.0 * multiplier ];
    } else if (extensions.stringStartsWith(color, 'rgb')) {
      var cs = color.replace(/rgb\(|\)/g, '').split(',');
      if (cs.length !== 3) {
        return err;
      }
      return [ parseInt(cs[0]) / 255.0 * multiplier, parseInt(cs[1]) / 255.0 * multiplier, parseInt(cs[2]) / 255.0 * multiplier ];
    }
    return err;
  };

  pack.idx2color = function(value) {
    var hex = value.toString(16);

    // add '0' padding
    for ( var i = 0, ii = 6 - hex.length; i < ii; i++) {
      hex = "0" + hex;
    }

    return "#" + hex;
  };

  pack.distanceFromPointToLineInclusive = function(p, l1, l2) {
    var length = l1.distance(l2);
    var angle = l1.angle(l2);
    var angleDif = m.PI / 2 - angle;
    var newAngleP = l1.angle(p) + angleDif;
    var pDist = l1.distance(p);
    var pcopRot = new structures.Point(pDist * m.cos(newAngleP), -pDist * m.sin(newAngleP));
    if (pack.isBetween(-pcopRot.y, 0, length)) {
      return m.abs(pcopRot.x);
    }
    return -1;
  };

  pack.calculateDistanceInterior = function(to, from, r) {
    if (this.isBetween(from.x, r.x, r.x + r.w) && this.isBetween(from.y, r.y, r.y + r.w)) {
      return to.distance(from);
    }
    // calculates the distance that a line needs to remove from itself to be
    // outside that rectangle
    var lines = [];
    // top
    lines.push({
      x1 : r.x,
      y1 : r.y,
      x2 : r.x + r.w,
      y2 : r.y
    });
    // bottom
    lines.push({
      x1 : r.x,
      y1 : r.y + r.h,
      x2 : r.x + r.w,
      y2 : r.y + r.h
    });
    // left
    lines.push({
      x1 : r.x,
      y1 : r.y,
      x2 : r.x,
      y2 : r.y + r.h
    });
    // right
    lines.push({
      x1 : r.x + r.w,
      y1 : r.y,
      x2 : r.x + r.w,
      y2 : r.y + r.h
    });

    var intersections = [];
    for ( var i = 0; i < 4; i++) {
      var l = lines[i];
      var p = this.intersectLines(from.x, from.y, to.x, to.y, l.x1, l.y1, l.x2, l.y2);
      if (p) {
        intersections.push(p);
      }
    }
    if (intersections.length === 0) {
      return 0;
    }
    var max = 0;
    for ( var i = 0, ii = intersections.length; i < ii; i++) {
      var p = intersections[i];
      var dx = to.x - p.x;
      var dy = to.y - p.y;
      max = m.max(max, m.sqrt(dx * dx + dy * dy));
    }
    return max;
  };

  pack.intersectLines = function(ax, ay, bx, by, cx, cy, dx, dy) {
    // calculate the direction vectors
    bx -= ax;
    by -= ay;
    dx -= cx;
    dy -= cy;

    // are they parallel?
    var denominator = by * dx - bx * dy;
    if (denominator === 0) {
      return false;
    }

    // calculate point of intersection
    var r = (dy * (ax - cx) - dx * (ay - cy)) / denominator;
    var s = (by * (ax - cx) - bx * (ay - cy)) / denominator;
    if ((s >= 0) && (s <= 1) && (r >= 0) && (r <= 1)) {
      return {
        x : (ax + r * bx),
        y : (ay + r * by)
      };
    } else {
      return false;
    }
  };

  pack.hsl2rgb = function(h, s, l) {
    var hue2rgb = function(p, q, t) {
      if (t < 0) {
        t += 1;
      } else if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      } else if (t < 1 / 2) {
        return q;
      } else if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };
    var r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [ r * 255, g * 255, b * 255 ];
  };

  pack.isPointInPoly = function(poly, pt) {
    for ( var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);
    }
    return c;
  };

  pack.clamp = function(value, min, max) {
    return value < min ? min : value > max ? max : value;
  };

  return pack;

})(ChemDoodle.extensions, ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3469 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-21 10:01:03 -0500 (Sat, 21 Jan 2012) $
//

(function(math, m) {
  'use strict';
  math.Bounds = function() {
  };
  var _ = math.Bounds.prototype;
  _.minX = _.minY = _.minZ = Infinity;
  _.maxX = _.maxY = _.maxZ = -Infinity;
  _.expand = function(x1, y1, x2, y2) {
    if (x1 instanceof math.Bounds) {
      // only need to compare min and max since bounds already has
      // them ordered
      this.minX = m.min(this.minX, x1.minX);
      this.minY = m.min(this.minY, x1.minY);
      this.maxX = m.max(this.maxX, x1.maxX);
      this.maxY = m.max(this.maxY, x1.maxY);
      if(x1.maxZ!==Infinity){
        this.minZ = m.min(this.minZ, x1.minZ);
        this.maxZ = m.max(this.maxZ, x1.maxZ);
      }
    } else {
      this.minX = m.min(this.minX, x1);
      this.maxX = m.max(this.maxX, x1);
      this.minY = m.min(this.minY, y1);
      this.maxY = m.max(this.maxY, y1);
      // these two values could be 0, so check if undefined
      if (x2 !== undefined && y2 !== undefined) {
        this.minX = m.min(this.minX, x2);
        this.maxX = m.max(this.maxX, x2);
        this.minY = m.min(this.minY, y2);
        this.maxY = m.max(this.maxY, y2);
      }
    }
  };
  _.expand3D = function(x1, y1, z1, x2, y2, z2) {
    this.minX = m.min(this.minX, x1);
    this.maxX = m.max(this.maxX, x1);
    this.minY = m.min(this.minY, y1);
    this.maxY = m.max(this.maxY, y1);
    this.minZ = m.min(this.minZ, z1);
    this.maxZ = m.max(this.maxZ, z1);
    // these two values could be 0, so check if undefined
    if (x2 !== undefined && y2 !== undefined && z2 !== undefined) {
      this.minX = m.min(this.minX, x2);
      this.maxX = m.max(this.maxX, x2);
      this.minY = m.min(this.minY, y2);
      this.maxY = m.max(this.maxY, y2);
      this.minZ = m.min(this.minZ, z2);
      this.maxZ = m.max(this.maxZ, z2);
    }
  };

})(ChemDoodle.math, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3469 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-21 10:01:03 -0500 (Sat, 21 Jan 2012) $
//

/**
 * jsBezier-0.5
 *
 * Copyright (c) 2010 - 2011 Simon Porritt (simon.porritt@gmail.com)
 *
 * licensed under the MIT license.
 *
 * a set of Bezier curve functions that deal with Beziers, used by jsPlumb, and
 * perhaps useful for other people. These functions work with Bezier curves of
 * arbitrary degree.
 *  - functions are all in the 'jsBezier' namespace.
 *  - all input points should be in the format {x:.., y:..}. all output points
 * are in this format too.
 *  - all input curves should be in the format [ {x:.., y:..}, {x:.., y:..},
 * {x:.., y:..}, {x:.., y:..} ]
 *  - 'location' as used as an input here refers to a decimal in the range 0-1
 * inclusive, which indicates a point some proportion along the length of the
 * curve. location as output has the same format and meaning.
 *
 *
 * Function List: --------------
 *
 * distanceFromCurve(point, curve)
 *
 * Calculates the distance that the given point lies from the given Bezier. Note
 * that it is computed relative to the center of the Bezier, so if you have
 * stroked the curve with a wide pen you may wish to take that into account! The
 * distance returned is relative to the values of the curve and the point - it
 * will most likely be pixels.
 *
 * gradientAtPoint(curve, location)
 *
 * Calculates the gradient to the curve at the given location, as a decimal
 * between 0 and 1 inclusive.
 *
 * gradientAtPointAlongCurveFrom (curve, location)
 *
 * Calculates the gradient at the point on the given curve that is 'distance'
 * units from location.
 *
 * nearestPointOnCurve(point, curve)
 *
 * Calculates the nearest point to the given point on the given curve. The
 * return value of this is a JS object literal, containing both the point's
 * coordinates and also the 'location' of the point (see above), for example: {
 * point:{x:551,y:150}, location:0.263365 }.
 *
 * pointOnCurve(curve, location)
 *
 * Calculates the coordinates of the point on the given Bezier curve at the
 * given location.
 *
 * pointAlongCurveFrom(curve, location, distance)
 *
 * Calculates the coordinates of the point on the given curve that is 'distance'
 * units from location. 'distance' should be in the same coordinate space as
 * that used to construct the Bezier curve. For an HTML Canvas usage, for
 * example, distance would be a measure of pixels.
 *
 * locationAlongCurveFrom(curve, location, distance)
 *
 * Calculates the location on the given curve that is 'distance' units from
 * location. 'distance' should be in the same coordinate space as that used to
 * construct the Bezier curve. For an HTML Canvas usage, for example, distance
 * would be a measure of pixels.
 *
 * perpendicularToCurveAt(curve, location, length, distance)
 *
 * Calculates the perpendicular to the given curve at the given location. length
 * is the length of the line you wish for (it will be centered on the point at
 * 'location'). distance is optional, and allows you to specify a point along
 * the path from the given location as the center of the perpendicular returned.
 * The return value of this is an array of two points: [ {x:...,y:...},
 * {x:...,y:...} ].
 *
 *
 */

(function(math) {
  'use strict';
  function sgn(x) {
    return x == 0 ? 0 : x > 0 ? 1 : -1;
  }

  var Vectors = {
    subtract : function(v1, v2) {
      return {
        x : v1.x - v2.x,
        y : v1.y - v2.y
      };
    },
    dotProduct : function(v1, v2) {
      return (v1.x * v2.x) + (v1.y * v2.y);
    },
    square : function(v) {
      return Math.sqrt((v.x * v.x) + (v.y * v.y));
    },
    scale : function(v, s) {
      return {
        x : v.x * s,
        y : v.y * s
      };
    }
  },

  maxRecursion = 64, flatnessTolerance = Math.pow(2.0, -maxRecursion - 1);

  /**
   * Calculates the distance that the point lies from the curve.
   *
   * @param point
   *            a point in the form {x:567, y:3342}
   * @param curve
   *            a Bezier curve in the form [{x:..., y:...}, {x:..., y:...},
   *            {x:..., y:...}, {x:..., y:...}]. note that this is currently
   *            hardcoded to assume cubiz beziers, but would be better off
   *            supporting any degree.
   * @return a JS object literal containing location and distance, for
   *         example: {location:0.35, distance:10}. Location is analogous to
   *         the location argument you pass to the pointOnPath function: it is
   *         a ratio of distance travelled along the curve. Distance is the
   *         distance in pixels from the point to the curve.
   */
  var _distanceFromCurve = function(point, curve) {
    var candidates = [], w = _convertToBezier(point, curve), degree = curve.length - 1, higherDegree = (2 * degree) - 1, numSolutions = _findRoots(w, higherDegree, candidates, 0), v = Vectors.subtract(point, curve[0]), dist = Vectors.square(v), t = 0.0;

    for ( var i = 0; i < numSolutions; i++) {
      v = Vectors.subtract(point, _bezier(curve, degree, candidates[i], null, null));
      var newDist = Vectors.square(v);
      if (newDist < dist) {
        dist = newDist;
        t = candidates[i];
      }
    }
    v = Vectors.subtract(point, curve[degree]);
    newDist = Vectors.square(v);
    if (newDist < dist) {
      dist = newDist;
      t = 1.0;
    }
    return {
      location : t,
      distance : dist
    };
  };
  /**
   * finds the nearest point on the curve to the given point.
   */
  var _nearestPointOnCurve = function(point, curve) {
    var td = _distanceFromCurve(point, curve);
    return {
      point : _bezier(curve, curve.length - 1, td.location, null, null),
      location : td.location
    };
  };
  var _convertToBezier = function(point, curve) {
    var degree = curve.length - 1, higherDegree = (2 * degree) - 1, c = [], d = [], cdTable = [], w = [], z = [ [ 1.0, 0.6, 0.3, 0.1 ], [ 0.4, 0.6, 0.6, 0.4 ], [ 0.1, 0.3, 0.6, 1.0 ] ];

    for ( var i = 0; i <= degree; i++)
      c[i] = Vectors.subtract(curve[i], point);
    for ( var i = 0; i <= degree - 1; i++) {
      d[i] = Vectors.subtract(curve[i + 1], curve[i]);
      d[i] = Vectors.scale(d[i], 3.0);
    }
    for ( var row = 0; row <= degree - 1; row++) {
      for ( var column = 0; column <= degree; column++) {
        if (!cdTable[row])
          cdTable[row] = [];
        cdTable[row][column] = Vectors.dotProduct(d[row], c[column]);
      }
    }
    for (i = 0; i <= higherDegree; i++) {
      if (!w[i])
        w[i] = [];
      w[i].y = 0.0;
      w[i].x = parseFloat(i) / higherDegree;
    }
    var n = degree, m = degree - 1;
    for ( var k = 0; k <= n + m; k++) {
      var lb = Math.max(0, k - m), ub = Math.min(k, n);
      for (i = lb; i <= ub; i++) {
        var j = k - i;
        w[i + j].y += cdTable[j][i] * z[j][i];
      }
    }
    return w;
  };
  /**
   * counts how many roots there are.
   */
  var _findRoots = function(w, degree, t, depth) {
    var left = [], right = [], left_count, right_count, left_t = [], right_t = [];

    switch (_getCrossingCount(w, degree)) {
    case 0: {
      return 0;
    }
    case 1: {
      if (depth >= maxRecursion) {
        t[0] = (w[0].x + w[degree].x) / 2.0;
        return 1;
      }
      if (_isFlatEnough(w, degree)) {
        t[0] = _computeXIntercept(w, degree);
        return 1;
      }
      break;
    }
    }
    _bezier(w, degree, 0.5, left, right);
    left_count = _findRoots(left, degree, left_t, depth + 1);
    right_count = _findRoots(right, degree, right_t, depth + 1);
    for ( var i = 0; i < left_count; i++)
      t[i] = left_t[i];
    for ( var i = 0; i < right_count; i++)
      t[i + left_count] = right_t[i];
    return (left_count + right_count);
  };
  var _getCrossingCount = function(curve, degree) {
    var n_crossings = 0, sign, old_sign;
    sign = old_sign = sgn(curve[0].y);
    for ( var i = 1; i <= degree; i++) {
      sign = sgn(curve[i].y);
      if (sign != old_sign)
        n_crossings++;
      old_sign = sign;
    }
    return n_crossings;
  };
  var _isFlatEnough = function(curve, degree) {
    var error, intercept_1, intercept_2, left_intercept, right_intercept, a, b, c, det, dInv, a1, b1, c1, a2, b2, c2;
    a = curve[0].y - curve[degree].y;
    b = curve[degree].x - curve[0].x;
    c = curve[0].x * curve[degree].y - curve[degree].x * curve[0].y;

    var max_distance_above = 0.0, max_distance_below = 0.0;

    for ( var i = 1; i < degree; i++) {
      var value = a * curve[i].x + b * curve[i].y + c;
      if (value > max_distance_above)
        max_distance_above = value;
      else if (value < max_distance_below)
        max_distance_below = value;
    }

    a1 = 0.0;
    b1 = 1.0;
    c1 = 0.0;
    a2 = a;
    b2 = b;
    c2 = c - max_distance_above;
    det = a1 * b2 - a2 * b1;
    dInv = 1.0 / det;
    intercept_1 = (b1 * c2 - b2 * c1) * dInv;
    a2 = a;
    b2 = b;
    c2 = c - max_distance_below;
    det = a1 * b2 - a2 * b1;
    dInv = 1.0 / det;
    intercept_2 = (b1 * c2 - b2 * c1) * dInv;
    left_intercept = Math.min(intercept_1, intercept_2);
    right_intercept = Math.max(intercept_1, intercept_2);
    error = right_intercept - left_intercept;
    return (error < flatnessTolerance) ? 1 : 0;
  };
  var _computeXIntercept = function(curve, degree) {
    var XLK = 1.0, YLK = 0.0, XNM = curve[degree].x - curve[0].x, YNM = curve[degree].y - curve[0].y, XMK = curve[0].x - 0.0, YMK = curve[0].y - 0.0, det = XNM * YLK - YNM * XLK, detInv = 1.0 / det, S = (XNM * YMK - YNM * XMK) * detInv;
    return 0.0 + XLK * S;
  };
  var _bezier = function(curve, degree, t, left, right) {
    var temp = [ [] ];
    for ( var j = 0; j <= degree; j++)
      temp[0][j] = curve[j];
    for ( var i = 1; i <= degree; i++) {
      for ( var j = 0; j <= degree - i; j++) {
        if (!temp[i])
          temp[i] = [];
        if (!temp[i][j])
          temp[i][j] = {};
        temp[i][j].x = (1.0 - t) * temp[i - 1][j].x + t * temp[i - 1][j + 1].x;
        temp[i][j].y = (1.0 - t) * temp[i - 1][j].y + t * temp[i - 1][j + 1].y;
      }
    }
    if (left != null)
      for (j = 0; j <= degree; j++)
        left[j] = temp[j][0];
    if (right != null)
      for (j = 0; j <= degree; j++)
        right[j] = temp[degree - j][j];

    return (temp[degree][0]);
  };

  var _curveFunctionCache = {};
  var _getCurveFunctions = function(order) {
    var fns = _curveFunctionCache[order];
    if (!fns) {
      fns = [];
      var f_term = function() {
        return function(t) {
          return Math.pow(t, order);
        };
      }, l_term = function() {
        return function(t) {
          return Math.pow((1 - t), order);
        };
      }, c_term = function(c) {
        return function(t) {
          return c;
        };
      }, t_term = function() {
        return function(t) {
          return t;
        };
      }, one_minus_t_term = function() {
        return function(t) {
          return 1 - t;
        };
      }, _termFunc = function(terms) {
        return function(t) {
          var p = 1;
          for ( var i = 0; i < terms.length; i++)
            p = p * terms[i](t);
          return p;
        };
      };

      fns.push(new f_term()); // first is t to the power of the curve
                  // order
      for ( var i = 1; i < order; i++) {
        var terms = [ new c_term(order) ];
        for ( var j = 0; j < (order - i); j++)
          terms.push(new t_term());
        for ( var j = 0; j < i; j++)
          terms.push(new one_minus_t_term());
        fns.push(new _termFunc(terms));
      }
      fns.push(new l_term()); // last is (1-t) to the power of the curve
                  // order

      _curveFunctionCache[order] = fns;
    }

    return fns;
  };

  /**
   * calculates a point on the curve, for a Bezier of arbitrary order.
   *
   * @param curve
   *            an array of control points, eg [{x:10,y:20}, {x:50,y:50},
   *            {x:100,y:100}, {x:120,y:100}]. For a cubic bezier this should
   *            have four points.
   * @param location
   *            a decimal indicating the distance along the curve the point
   *            should be located at. this is the distance along the curve as
   *            it travels, taking the way it bends into account. should be a
   *            number from 0 to 1, inclusive.
   */
  var _pointOnPath = function(curve, location) {
    var cc = _getCurveFunctions(curve.length - 1), _x = 0, _y = 0;
    for ( var i = 0; i < curve.length; i++) {
      _x = _x + (curve[i].x * cc[i](location));
      _y = _y + (curve[i].y * cc[i](location));
    }

    return {
      x : _x,
      y : _y
    };
  };

  var _dist = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  /**
   * finds the point that is 'distance' along the path from 'location'. this
   * method returns both the x,y location of the point and also its 'location'
   * (proportion of travel along the path); the method below -
   * _pointAlongPathFrom - calls this method and just returns the point.
   */
  var _pointAlongPath = function(curve, location, distance) {
    var prev = _pointOnPath(curve, location), tally = 0, curLoc = location, direction = distance > 0 ? 1 : -1, cur = null;

    while (tally < Math.abs(distance)) {
      curLoc += (0.005 * direction);
      cur = _pointOnPath(curve, curLoc);
      tally += _dist(cur, prev);
      prev = cur;
    }
    return {
      point : cur,
      location : curLoc
    };
  };

  var _length = function(curve) {
    var prev = _pointOnPath(curve, 0), tally = 0, curLoc = 0, direction = 1, cur = null;

    while (curLoc < 1) {
      curLoc += (0.005 * direction);
      cur = _pointOnPath(curve, curLoc);
      tally += _dist(cur, prev);
      prev = cur;
    }
    return tally;
  };

  /**
   * finds the point that is 'distance' along the path from 'location'.
   */
  var _pointAlongPathFrom = function(curve, location, distance) {
    return _pointAlongPath(curve, location, distance).point;
  };

  /**
   * finds the location that is 'distance' along the path from 'location'.
   */
  var _locationAlongPathFrom = function(curve, location, distance) {
    return _pointAlongPath(curve, location, distance).location;
  };

  /**
   * returns the gradient of the curve at the given location, which is a
   * decimal between 0 and 1 inclusive.
   *
   * thanks // http://bimixual.org/AnimationLibrary/beziertangents.html
   */
  var _gradientAtPoint = function(curve, location) {
    var p1 = _pointOnPath(curve, location), p2 = _pointOnPath(curve.slice(0, curve.length - 1), location), dy = p2.y - p1.y, dx = p2.x - p1.x;
    return dy == 0 ? Infinity : Math.atan(dy / dx);
  };

  /**
   * returns the gradient of the curve at the point which is 'distance' from
   * the given location. if this point is greater than location 1, the
   * gradient at location 1 is returned. if this point is less than location
   * 0, the gradient at location 0 is returned.
   */
  var _gradientAtPointAlongPathFrom = function(curve, location, distance) {
    var p = _pointAlongPath(curve, location, distance);
    if (p.location > 1)
      p.location = 1;
    if (p.location < 0)
      p.location = 0;
    return _gradientAtPoint(curve, p.location);
  };

  /**
   * calculates a line that is 'length' pixels long, perpendicular to, and
   * centered on, the path at 'distance' pixels from the given location. if
   * distance is not supplied, the perpendicular for the given location is
   * computed (ie. we set distance to zero).
   */
  var _perpendicularToPathAt = function(curve, location, length, distance) {
    distance = distance == null ? 0 : distance;
    var p = _pointAlongPath(curve, location, distance), m = _gradientAtPoint(curve, p.location), _theta2 = Math.atan(-1 / m), y = length / 2 * Math.sin(_theta2), x = length / 2 * Math.cos(_theta2);
    return [ {
      x : p.point.x + x,
      y : p.point.y + y
    }, {
      x : p.point.x - x,
      y : p.point.y - y
    } ];
  };

  ChemDoodle.math.jsBezier = {
    distanceFromCurve : _distanceFromCurve,
    gradientAtPoint : _gradientAtPoint,
    gradientAtPointAlongCurveFrom : _gradientAtPointAlongPathFrom,
    nearestPointOnCurve : _nearestPointOnCurve,
    pointOnCurve : _pointOnPath,
    pointAlongCurveFrom : _pointAlongPathFrom,
    perpendicularToCurveAt : _perpendicularToPathAt,
    locationAlongCurveFrom : _locationAlongPathFrom,
    getLength : _length
  };
})(ChemDoodle.math);
//
//  Copyright 2006-2010 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4404 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-09 18:47:35 -0400 (Sun, 09 Jun 2013) $
//

ChemDoodle.featureDetection = (function(iChemLabs, q, document, window) {
  'use strict';
  var features = {};

  features.supports_canvas = function() {
    return !!document.createElement('canvas').getContext;
  };

  features.supports_canvas_text = function() {
    if (!features.supports_canvas()) {
      return false;
    }
    var dummy_canvas = document.createElement('canvas');
    var context = dummy_canvas.getContext('2d');
    return typeof context.fillText === 'function';
  };

  features.supports_webgl = function() {
    var dummy_canvas = document.createElement('canvas');
    try {
      if (dummy_canvas.getContext('webgl')) {
        return true;
      }
      if (dummy_canvas.getContext('experimental-webgl')) {
        return true;
      }
    } catch (b) {
    }
    return false;
  };

  features.supports_xhr2 = function() {
    return q.support.cors;
  };

  features.supports_touch = function() {
    // check the mobile os so we don't interfere with hybrid pcs
    return 'ontouchstart' in window && navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|BB10/i);
  };

  features.supports_gesture = function() {
    return 'ongesturestart' in window;
  };

  return features;

})(ChemDoodle.iChemLabs, jQuery, document, window);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

// all symbols
ChemDoodle.SYMBOLS = [ 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl',
    'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Uut', 'Uuq', 'Uup', 'Uuh', 'Uus', 'Uuo' ];

ChemDoodle.ELEMENT = (function(SYMBOLS) {
  'use strict';
  var E = [];

  function Element(symbol, name, atomicNumber, addH, color, covalentRadius, vdWRadius, valency, mass) {
    this.symbol = symbol;
    this.name = name;
    this.atomicNumber = atomicNumber;
    this.addH = addH;
    this.jmolColor = this.pymolColor = color;
    this.covalentRadius = covalentRadius;
    this.vdWRadius = vdWRadius;
    this.valency = valency;
    this.mass = mass;
  }

  E.H = new Element('H', 'Hydrogen', 1, false, '#FFFFFF', 0.31, 1.2, 1, 1);
  E.He = new Element('He', 'Helium', 2, false, '#D9FFFF', 0.28, 1.4, 0, 4);
  E.Li = new Element('Li', 'Lithium', 3, false, '#CC80FF', 1.28, 1.82, 1, 7);
  E.Be = new Element('Be', 'Beryllium', 4, false, '#C2FF00', 0.96, 0, 2, 9);
  E.B = new Element('B', 'Boron', 5, true, '#FFB5B5', 0.84, 0, 3, 11);
  E.C = new Element('C', 'Carbon', 6, true, '#909090', 0.76, 1.7, 4, 12);
  E.N = new Element('N', 'Nitrogen', 7, true, '#3050F8', 0.71, 1.55, 3, 14);
  E.O = new Element('O', 'Oxygen', 8, true, '#FF0D0D', 0.66, 1.52, 2, 16);
  E.F = new Element('F', 'Fluorine', 9, true, '#90E050', 0.57, 1.47, 1, 19);
  E.Ne = new Element('Ne', 'Neon', 10, false, '#B3E3F5', 0.58, 1.54, 0, 20);
  E.Na = new Element('Na', 'Sodium', 11, false, '#AB5CF2', 1.66, 2.27, 1, 23);
  E.Mg = new Element('Mg', 'Magnesium', 12, false, '#8AFF00', 1.41, 1.73, 0, 24);
  E.Al = new Element('Al', 'Aluminum', 13, false, '#BFA6A6', 1.21, 0, 0, 27);
  E.Si = new Element('Si', 'Silicon', 14, true, '#F0C8A0', 1.11, 2.1, 4, 28);
  E.P = new Element('P', 'Phosphorus', 15, true, '#FF8000', 1.07, 1.8, 3, 31);
  E.S = new Element('S', 'Sulfur', 16, true, '#FFFF30', 1.05, 1.8, 2, 32);
  E.Cl = new Element('Cl', 'Chlorine', 17, true, '#1FF01F', 1.02, 1.75, 1, 35);
  E.Ar = new Element('Ar', 'Argon', 18, false, '#80D1E3', 1.06, 1.88, 0, 40);
  E.K = new Element('K', 'Potassium', 19, false, '#8F40D4', 2.03, 2.75, 0, 39);
  E.Ca = new Element('Ca', 'Calcium', 20, false, '#3DFF00', 1.76, 0, 0, 40);
  E.Sc = new Element('Sc', 'Scandium', 21, false, '#E6E6E6', 1.7, 0, 0, 45);
  E.Ti = new Element('Ti', 'Titanium', 22, false, '#BFC2C7', 1.6, 0, 1, 48);
  E.V = new Element('V', 'Vanadium', 23, false, '#A6A6AB', 1.53, 0, 1, 51);
  E.Cr = new Element('Cr', 'Chromium', 24, false, '#8A99C7', 1.39, 0, 2, 52);
  E.Mn = new Element('Mn', 'Manganese', 25, false, '#9C7AC7', 1.39, 0, 3, 55);
  E.Fe = new Element('Fe', 'Iron', 26, false, '#E06633', 1.32, 0, 2, 56);
  E.Co = new Element('Co', 'Cobalt', 27, false, '#F090A0', 1.26, 0, 1, 59);
  E.Ni = new Element('Ni', 'Nickel', 28, false, '#50D050', 1.24, 1.63, 1, 58);
  E.Cu = new Element('Cu', 'Copper', 29, false, '#C88033', 1.32, 1.4, 0, 63);
  E.Zn = new Element('Zn', 'Zinc', 30, false, '#7D80B0', 1.22, 1.39, 0, 64);
  E.Ga = new Element('Ga', 'Gallium', 31, false, '#C28F8F', 1.22, 1.87, 0, 69);
  E.Ge = new Element('Ge', 'Germanium', 32, false, '#668F8F', 1.2, 0, 4, 74);
  E.As = new Element('As', 'Arsenic', 33, true, '#BD80E3', 1.19, 1.85, 3, 75);
  E.Se = new Element('Se', 'Selenium', 34, true, '#FFA100', 1.2, 1.9, 2, 80);
  E.Br = new Element('Br', 'Bromine', 35, true, '#A62929', 1.2, 1.85, 1, 79);
  E.Kr = new Element('Kr', 'Krypton', 36, false, '#5CB8D1', 1.16, 2.02, 0, 84);
  E.Rb = new Element('Rb', 'Rubidium', 37, false, '#702EB0', 2.2, 0, 0, 85);
  E.Sr = new Element('Sr', 'Strontium', 38, false, '#00FF00', 1.95, 0, 0, 88);
  E.Y = new Element('Y', 'Yttrium', 39, false, '#94FFFF', 1.9, 0, 0, 89);
  E.Zr = new Element('Zr', 'Zirconium', 40, false, '#94E0E0', 1.75, 0, 0, 90);
  E.Nb = new Element('Nb', 'Niobium', 41, false, '#73C2C9', 1.64, 0, 1, 93);
  E.Mo = new Element('Mo', 'Molybdenum', 42, false, '#54B5B5', 1.54, 0, 2, 98);
  E.Tc = new Element('Tc', 'Technetium', 43, false, '#3B9E9E', 1.47, 0, 3, 0);
  E.Ru = new Element('Ru', 'Ruthenium', 44, false, '#248F8F', 1.46, 0, 2, 102);
  E.Rh = new Element('Rh', 'Rhodium', 45, false, '#0A7D8C', 1.42, 0, 1, 103);
  E.Pd = new Element('Pd', 'Palladium', 46, false, '#006985', 1.39, 1.63, 0, 106);
  E.Ag = new Element('Ag', 'Silver', 47, false, '#C0C0C0', 1.45, 1.72, 0, 107);
  E.Cd = new Element('Cd', 'Cadmium', 48, false, '#FFD98F', 1.44, 1.58, 0, 114);
  E.In = new Element('In', 'Indium', 49, false, '#A67573', 1.42, 1.93, 0, 115);
  E.Sn = new Element('Sn', 'Tin', 50, false, '#668080', 1.39, 2.17, 4, 120);
  E.Sb = new Element('Sb', 'Antimony', 51, false, '#9E63B5', 1.39, 0, 3, 121);
  E.Te = new Element('Te', 'Tellurium', 52, true, '#D47A00', 1.38, 2.06, 2, 130);
  E.I = new Element('I', 'Iodine', 53, true, '#940094', 1.39, 1.98, 1, 127);
  E.Xe = new Element('Xe', 'Xenon', 54, false, '#429EB0', 1.4, 2.16, 0, 132);
  E.Cs = new Element('Cs', 'Cesium', 55, false, '#57178F', 2.44, 0, 0, 133);
  E.Ba = new Element('Ba', 'Barium', 56, false, '#00C900', 2.15, 0, 0, 138);
  E.La = new Element('La', 'Lanthanum', 57, false, '#70D4FF', 2.07, 0, 0, 139);
  E.Ce = new Element('Ce', 'Cerium', 58, false, '#FFFFC7', 2.04, 0, 0, 140);
  E.Pr = new Element('Pr', 'Praseodymium', 59, false, '#D9FFC7', 2.03, 0, 0, 141);
  E.Nd = new Element('Nd', 'Neodymium', 60, false, '#C7FFC7', 2.01, 0, 0, 142);
  E.Pm = new Element('Pm', 'Promethium', 61, false, '#A3FFC7', 1.99, 0, 0, 0);
  E.Sm = new Element('Sm', 'Samarium', 62, false, '#8FFFC7', 1.98, 0, 0, 152);
  E.Eu = new Element('Eu', 'Europium', 63, false, '#61FFC7', 1.98, 0, 0, 153);
  E.Gd = new Element('Gd', 'Gadolinium', 64, false, '#45FFC7', 1.96, 0, 0, 158);
  E.Tb = new Element('Tb', 'Terbium', 65, false, '#30FFC7', 1.94, 0, 0, 159);
  E.Dy = new Element('Dy', 'Dysprosium', 66, false, '#1FFFC7', 1.92, 0, 0, 164);
  E.Ho = new Element('Ho', 'Holmium', 67, false, '#00FF9C', 1.92, 0, 0, 165);
  E.Er = new Element('Er', 'Erbium', 68, false, '#00E675', 1.89, 0, 0, 166);
  E.Tm = new Element('Tm', 'Thulium', 69, false, '#00D452', 1.9, 0, 0, 169);
  E.Yb = new Element('Yb', 'Ytterbium', 70, false, '#00BF38', 1.87, 0, 0, 174);
  E.Lu = new Element('Lu', 'Lutetium', 71, false, '#00AB24', 1.87, 0, 0, 175);
  E.Hf = new Element('Hf', 'Hafnium', 72, false, '#4DC2FF', 1.75, 0, 0, 180);
  E.Ta = new Element('Ta', 'Tantalum', 73, false, '#4DA6FF', 1.7, 0, 1, 181);
  E.W = new Element('W', 'Tungsten', 74, false, '#2194D6', 1.62, 0, 2, 184);
  E.Re = new Element('Re', 'Rhenium', 75, false, '#267DAB', 1.51, 0, 3, 187);
  E.Os = new Element('Os', 'Osmium', 76, false, '#266696', 1.44, 0, 2, 192);
  E.Ir = new Element('Ir', 'Iridium', 77, false, '#175487', 1.41, 0, 3, 193);
  E.Pt = new Element('Pt', 'Platinum', 78, false, '#D0D0E0', 1.36, 1.75, 0, 195);
  E.Au = new Element('Au', 'Gold', 79, false, '#FFD123', 1.36, 1.66, 1, 197);
  E.Hg = new Element('Hg', 'Mercury', 80, false, '#B8B8D0', 1.32, 1.55, 0, 202);
  E.Tl = new Element('Tl', 'Thallium', 81, false, '#A6544D', 1.45, 1.96, 0, 205);
  E.Pb = new Element('Pb', 'Lead', 82, false, '#575961', 1.46, 2.02, 4, 208);
  E.Bi = new Element('Bi', 'Bismuth', 83, false, '#9E4FB5', 1.48, 0, 3, 209);
  E.Po = new Element('Po', 'Polonium', 84, false, '#AB5C00', 1.4, 0, 2, 0);
  E.At = new Element('At', 'Astatine', 85, true, '#754F45', 1.5, 0, 1, 0);
  E.Rn = new Element('Rn', 'Radon', 86, false, '#428296', 1.5, 0, 0, 0);
  E.Fr = new Element('Fr', 'Francium', 87, false, '#420066', 2.6, 0, 0, 0);
  E.Ra = new Element('Ra', 'Radium', 88, false, '#007D00', 2.21, 0, 0, 0);
  E.Ac = new Element('Ac', 'Actinium', 89, false, '#70ABFA', 2.15, 0, 0, 0);
  E.Th = new Element('Th', 'Thorium', 90, false, '#00BAFF', 2.06, 0, 0, 232);
  E.Pa = new Element('Pa', 'Protactinium', 91, false, '#00A1FF', 2, 0, 0, 231);
  E.U = new Element('U', 'Uranium', 92, false, '#008FFF', 1.96, 1.86, 0, 238);
  E.Np = new Element('Np', 'Neptunium', 93, false, '#0080FF', 1.9, 0, 0, 0);
  E.Pu = new Element('Pu', 'Plutonium', 94, false, '#006BFF', 1.87, 0, 0, 0);
  E.Am = new Element('Am', 'Americium', 95, false, '#545CF2', 1.8, 0, 0, 0);
  E.Cm = new Element('Cm', 'Curium', 96, false, '#785CE3', 1.69, 0, 0, 0);
  E.Bk = new Element('Bk', 'Berkelium', 97, false, '#8A4FE3', 0, 0, 0, 0);
  E.Cf = new Element('Cf', 'Californium', 98, false, '#A136D4', 0, 0, 0, 0);
  E.Es = new Element('Es', 'Einsteinium', 99, false, '#B31FD4', 0, 0, 0, 0);
  E.Fm = new Element('Fm', 'Fermium', 100, false, '#B31FBA', 0, 0, 0, 0);
  E.Md = new Element('Md', 'Mendelevium', 101, false, '#B30DA6', 0, 0, 0, 0);
  E.No = new Element('No', 'Nobelium', 102, false, '#BD0D87', 0, 0, 0, 0);
  E.Lr = new Element('Lr', 'Lawrencium', 103, false, '#C70066', 0, 0, 0, 0);
  E.Rf = new Element('Rf', 'Rutherfordium', 104, false, '#CC0059', 0, 0, 0, 0);
  E.Db = new Element('Db', 'Dubnium', 105, false, '#D1004F', 0, 0, 0, 0);
  E.Sg = new Element('Sg', 'Seaborgium', 106, false, '#D90045', 0, 0, 0, 0);
  E.Bh = new Element('Bh', 'Bohrium', 107, false, '#E00038', 0, 0, 0, 0);
  E.Hs = new Element('Hs', 'Hassium', 108, false, '#E6002E', 0, 0, 0, 0);
  E.Mt = new Element('Mt', 'Meitnerium', 109, false, '#EB0026', 0, 0, 0, 0);
  E.Ds = new Element('Ds', 'Darmstadtium', 110, false, '#000000', 0, 0, 0, 0);
  E.Rg = new Element('Rg', 'Roentgenium', 111, false, '#000000', 0, 0, 0, 0);
  E.Cn = new Element('Cn', 'Copernicium', 112, false, '#000000', 0, 0, 0, 0);
  E.Uut = new Element('Uut', 'Ununtrium', 113, false, '#000000', 0, 0, 0, 0);
  E.Uuq = new Element('Uuq', 'Ununquadium', 114, false, '#000000', 0, 0, 0, 0);
  E.Uup = new Element('Uup', 'Ununpentium', 115, false, '#000000', 0, 0, 0, 0);
  E.Uuh = new Element('Uuh', 'Ununhexium', 116, false, '#000000', 0, 0, 0, 0);
  E.Uus = new Element('Uus', 'Ununseptium', 117, false, '#000000', 0, 0, 0, 0);
  E.Uuo = new Element('Uuo', 'Ununoctium', 118, false, '#000000', 0, 0, 0, 0);

  E.H.pymolColor = '#E6E6E6';
  E.C.pymolColor = '#33FF33';
  E.N.pymolColor = '#3333FF';
  E.O.pymolColor = '#FF4D4D';
  E.F.pymolColor = '#B3FFFF';
  E.S.pymolColor = '#E6C640';

  return E;

})(ChemDoodle.SYMBOLS);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3008 $
//  $Author: kevin $
//  $LastChangedDate: 2011-01-07 21:28:00 -0500 (Fri, 07 Jan 2011) $
//
ChemDoodle.RESIDUE = (function() {
  'use strict';
  var R = [];

  function Residue(symbol, name, polar, aminoColor, shapelyColor) {
    this.symbol = symbol;
    this.name = name;
    this.polar = polar;
    this.aminoColor = aminoColor;
    this.shapelyColor = shapelyColor;
  }

  R.Ala = new Residue('Ala', 'Alanine', false, '#C8C8C8', '#8CFF8C');
  R.Arg = new Residue('Arg', 'Arginine', true, '#145AFF', '#00007C');
  R.Asn = new Residue('Asn', 'Asparagine', true, '#00DCDC', '#FF7C70');
  R.Asp = new Residue('Asp', 'Aspartic Acid', true, '#E60A0A', '#A00042');
  R.Cys = new Residue('Cys', 'Cysteine', true, '#E6E600', '#FFFF70');
  R.Gln = new Residue('Gln', 'Glutamine', true, '#00DCDC', '#FF4C4C');
  R.Glu = new Residue('Glu', 'Glutamic Acid', true, '#E60A0A', '#660000');
  R.Gly = new Residue('Gly', 'Glycine', false, '#EBEBEB', '#FFFFFF');
  R.His = new Residue('His', 'Histidine', true, '#8282D2', '#7070FF');
  R.Ile = new Residue('Ile', 'Isoleucine', false, '#0F820F', '#004C00');
  R.Leu = new Residue('Leu', 'Leucine', false, '#0F820F', '#455E45');
  R.Lys = new Residue('Lys', 'Lysine', true, '#145AFF', '#4747B8');
  R.Met = new Residue('Met', 'Methionine', false, '#E6E600', '#B8A042');
  R.Phe = new Residue('Phe', 'Phenylalanine', false, '#3232AA', '#534C52');
  R.Pro = new Residue('Pro', 'Proline', false, '#DC9682', '#525252');
  R.Ser = new Residue('Ser', 'Serine', true, '#FA9600', '#FF7042');
  R.Thr = new Residue('Thr', 'Threonine', true, '#FA9600', '#B84C00');
  R.Trp = new Residue('Trp', 'Tryptophan', true, '#B45AB4', '#4F4600');
  R.Tyr = new Residue('Tyr', 'Tyrosine', true, '#3232AA', '#8C704C');
  R.Val = new Residue('Val', 'Valine', false, '#0F820F', '#FF8CFF');
  R.Asx = new Residue('Asx', 'Asparagine/Aspartic Acid', true, '#FF69B4', '#FF00FF');
  R.Glx = new Residue('Glx', 'Glutamine/Glutamic Acid', true, '#FF69B4', '#FF00FF');
  R['*'] = new Residue('*', 'Other', false, '#BEA06E', '#FF00FF');
  R.A = new Residue('A', 'Adenine', false, '#BEA06E', '#A0A0FF');
  R.G = new Residue('G', 'Guanine', false, '#BEA06E', '#FF7070');
  R.I = new Residue('I', '', false, '#BEA06E', '#80FFFF');
  R.C = new Residue('C', 'Cytosine', false, '#BEA06E', '#FF8C4B');
  R.T = new Residue('T', 'Thymine', false, '#BEA06E', '#A0FFA0');
  R.U = new Residue('U', 'Uracil', false, '#BEA06E', '#FF8080');

  return R;

})();
//
//  Copyright 2006-2010 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(structures) {
  'use strict';
  /*
   * Creates a new Queue. A Queue is a first-in-first-out (FIFO) data
   * structure. Functions of the Queue object allow elements to be
   * enthis.queued and dethis.queued, the first element to be obtained without
   * dequeuing, and for the current size of the Queue and empty/non-empty
   * status to be obtained.
   */
  structures.Queue = function() {
    // the list of elements, initialised to the empty array
    this.queue = [];
  };
  var _ = structures.Queue.prototype;

  // the amount of space at the front of the this.queue, initialised to zero
  _.queueSpace = 0;

  /*
   * Returns the size of this Queue. The size of a Queue is equal to the
   * number of elements that have been enthis.queued minus the number of
   * elements that have been dethis.queued.
   */
  _.getSize = function() {

    // return the number of elements in the this.queue
    return this.queue.length - this.queueSpace;

  };

  /*
   * Returns true if this Queue is empty, and false otherwise. A Queue is
   * empty if the number of elements that have been enthis.queued equals the
   * number of elements that have been dethis.queued.
   */
  _.isEmpty = function() {

    // return true if the this.queue is empty, and false otherwise
    return this.queue.length === 0;

  };

  /*
   * Enthis.queues the specified element in this Queue. The parameter is:
   *
   * element - the element to enthis.queue
   */
  _.enqueue = function(element) {
    this.queue.push(element);
  };

  /*
   * Dethis.queues an element from this Queue. The oldest element in this
   * Queue is removed and returned. If this Queue is empty then undefined is
   * returned.
   */
  _.dequeue = function() {

    // initialise the element to return to be undefined
    var element;

    // check whether the this.queue is empty
    if (this.queue.length) {

      // fetch the oldest element in the this.queue
      element = this.queue[this.queueSpace];

      // update the amount of space and check whether a shift should
      // occur
      if (++this.queueSpace * 2 >= this.queue.length) {

        // set the this.queue equal to the non-empty portion of the
        // this.queue
        this.queue = this.queue.slice(this.queueSpace);

        // reset the amount of space at the front of the this.queue
        this.queueSpace = 0;

      }

    }

    // return the removed element
    return element;

  };

  /*
   * Returns the oldest element in this Queue. If this Queue is empty then
   * undefined is returned. This function returns the same value as the
   * dethis.queue function, but does not remove the returned element from this
   * Queue.
   */
  _.getOldestElement = function() {

    // initialise the element to return to be undefined
    var element;

    // if the this.queue is not element then fetch the oldest element in the
    // this.queue
    if (this.queue.length) {
      element = this.queue[this.queueSpace];
    }

    // return the oldest element
    return element;
  };

})(ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(structures, m) {
  'use strict';
  structures.Point = function(x, y) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
  };
  var _ = structures.Point.prototype;
  _.sub = function(p) {
    this.x -= p.x;
    this.y -= p.y;
  };
  _.add = function(p) {
    this.x += p.x;
    this.y += p.y;
  };
  _.distance = function(p) {
    var dx = p.x - this.x;
    var dy = p.y - this.y;
    return m.sqrt(dx * dx + dy * dy);
  };
  _.angleForStupidCanvasArcs = function(p) {
    var dx = p.x - this.x;
    var dy = p.y - this.y;
    var angle = 0;
    // Calculate angle
    if (dx === 0) {
      if (dy === 0) {
        angle = 0;
      } else if (dy > 0) {
        angle = m.PI / 2;
      } else {
        angle = 3 * m.PI / 2;
      }
    } else if (dy === 0) {
      if (dx > 0) {
        angle = 0;
      } else {
        angle = m.PI;
      }
    } else {
      if (dx < 0) {
        angle = m.atan(dy / dx) + m.PI;
      } else if (dy < 0) {
        angle = m.atan(dy / dx) + 2 * m.PI;
      } else {
        angle = m.atan(dy / dx);
      }
    }
    while (angle < 0) {
      angle += m.PI * 2;
    }
    angle = angle % (m.PI * 2);
    return angle;
  };
  _.angle = function(p) {
    // y is upside down to account for inverted canvas
    var dx = p.x - this.x;
    var dy = this.y - p.y;
    var angle = 0;
    // Calculate angle
    if (dx === 0) {
      if (dy === 0) {
        angle = 0;
      } else if (dy > 0) {
        angle = m.PI / 2;
      } else {
        angle = 3 * m.PI / 2;
      }
    } else if (dy === 0) {
      if (dx > 0) {
        angle = 0;
      } else {
        angle = m.PI;
      }
    } else {
      if (dx < 0) {
        angle = m.atan(dy / dx) + m.PI;
      } else if (dy < 0) {
        angle = m.atan(dy / dx) + 2 * m.PI;
      } else {
        angle = m.atan(dy / dx);
      }
    }
    while (angle < 0) {
      angle += m.PI * 2;
    }
    angle = angle % (m.PI * 2);
    return angle;
  };

})(ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

(function(ELEMENT, extensions, math, structures, m, m4) {
  'use strict';
  structures.Atom = function(label, x, y, z) {
    this.label = label ? label.replace(/\s/g, '') : 'C';
    if (!ELEMENT[this.label]) {
      this.label = 'C';
    }
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.z = z ? z : 0;
  };
  var _ = structures.Atom.prototype = new structures.Point(0, 0);
  _.charge = 0;
  _.numLonePair = 0;
  _.numRadical = 0;
  _.mass = -1;
  _.coordinationNumber = 0;
  _.bondNumber = 0;
  _.angleOfLeastInterference = 0;
  _.isHidden = false;
  _.altLabel = undefined;
  _.any = false;
  _.rgroup = -1;
  _.isLone = false;
  _.isHover = false;
  _.isSelected = false;
  _.add3D = function(p) {
    this.x += p.x;
    this.y += p.y;
    this.z += p.z;
  };
  _.sub3D = function(p) {
    this.x -= p.x;
    this.y -= p.y;
    this.z -= p.z;
  };
  _.distance3D = function(p) {
    var dx = p.x - this.x;
    var dy = p.y - this.y;
    var dz = p.z - this.z;
    return m.sqrt(dx * dx + dy * dy + dz * dz);
  };
  _.draw = function(ctx, specs) {
    if (this.isLassoed) {
      var grd = ctx.createRadialGradient(this.x - 1, this.y - 1, 0, this.x, this.y, 7);
      grd.addColorStop(0, 'rgba(212, 99, 0, 0)');
      grd.addColorStop(0.7, 'rgba(212, 99, 0, 0.8)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, m.PI * 2, false);
      ctx.fill();
    }
    this.textBounds = [];
    if (this.specs) {
      specs = this.specs;
    }
    var font = extensions.getFontString(specs.atoms_font_size_2D, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
    ctx.font = font;
    ctx.fillStyle = this.getElementColor(specs.atoms_useJMOLColors, specs.atoms_usePYMOLColors, specs.atoms_color, 2);
    var hAngle;
    if (this.isLone && !specs.atoms_displayAllCarbonLabels_2D || specs.atoms_circles_2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, specs.atoms_circleDiameter_2D / 2, 0, m.PI * 2, false);
      ctx.fill();
      if (specs.atoms_circleBorderWidth_2D > 0) {
        ctx.lineWidth = specs.atoms_circleBorderWidth_2D;
        ctx.strokeStyle = 'black';
        ctx.stroke(this.x, this.y, 0, m.PI * 2, specs.atoms_circleDiameter_2D / 2);
      }
    } else if (this.isLabelVisible(specs)) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // keep check to undefined here as dev may set altLabel to empty
      // string
      if (this.altLabel !== undefined) {
        // altLabel can be 0, so check if undefined
        ctx.fillText(this.altLabel, this.x, this.y);
        var symbolWidth = ctx.measureText(this.altLabel).width;
        this.textBounds.push({
          x : this.x - symbolWidth / 2,
          y : this.y - specs.atoms_font_size_2D / 2 + 1,
          w : symbolWidth,
          h : specs.atoms_font_size_2D - 2
        });
      } else if (this.any) {
        ctx.font = extensions.getFontString(specs.atoms_font_size_2D + 5, specs.atoms_font_families_2D, true);
        ctx.fillText('*', this.x + 1, this.y + 3);
        var symbolWidth = ctx.measureText('*').width;
        this.textBounds.push({
          x : this.x - symbolWidth / 2,
          y : this.y - specs.atoms_font_size_2D / 2 + 1,
          w : symbolWidth,
          h : specs.atoms_font_size_2D - 2
        });
      } else if (this.rgroup !== -1) {
        var rlabel = 'R' + this.rgroup;
        ctx.fillText(rlabel, this.x, this.y);
        var symbolWidth = ctx.measureText(rlabel).width;
        this.textBounds.push({
          x : this.x - symbolWidth / 2,
          y : this.y - specs.atoms_font_size_2D / 2 + 1,
          w : symbolWidth,
          h : specs.atoms_font_size_2D - 2
        });
      } else {
        ctx.fillText(this.label, this.x, this.y);
        var symbolWidth = ctx.measureText(this.label).width;
        this.textBounds.push({
          x : this.x - symbolWidth / 2,
          y : this.y - specs.atoms_font_size_2D / 2 + 1,
          w : symbolWidth,
          h : specs.atoms_font_size_2D - 2
        });
        // mass
        var massWidth = 0;
        if (this.mass !== -1) {
          var subFont = extensions.getFontString(specs.atoms_font_size_2D * .7, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
          var fontSave = ctx.font;
          ctx.font = extensions.getFontString(specs.atoms_font_size_2D * .7, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
          massWidth = ctx.measureText(this.mass).width;
          ctx.fillText(this.mass, this.x - massWidth - .5, this.y - specs.atoms_font_size_2D / 2 + 1);
          this.textBounds.push({
            x : this.x - symbolWidth / 2 - massWidth - .5,
            y : this.y - (specs.atoms_font_size_2D * 1.7) / 2 + 1,
            w : massWidth,
            h : specs.atoms_font_size_2D / 2 - 1
          });
          ctx.font = fontSave;
        }
        // implicit hydrogens
        var chargeOffset = symbolWidth / 2;
        var numHs = this.getImplicitHydrogenCount();
        if (specs.atoms_implicitHydrogens_2D && numHs > 0) {
          hAngle = 0;
          var hWidth = ctx.measureText('H').width;
          var moveCharge = true;
          if (numHs > 1) {
            var xoffset = symbolWidth / 2 + hWidth / 2;
            var yoffset = 0;
            var subFont = extensions.getFontString(specs.atoms_font_size_2D * .8, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
            ctx.font = subFont;
            var numWidth = ctx.measureText(numHs).width;
            if (this.bondNumber === 1) {
              if (this.angleOfLeastInterference > m.PI / 2 && this.angleOfLeastInterference < 3 * m.PI / 2) {
                xoffset = -symbolWidth / 2 - numWidth - hWidth / 2 - massWidth / 2;
                moveCharge = false;
                hAngle = m.PI;
              }
            } else {
              if (this.angleOfLeastInterference <= m.PI / 4) {
                // default
              } else if (this.angleOfLeastInterference < 3 * m.PI / 4) {
                xoffset = 0;
                yoffset = -specs.atoms_font_size_2D * .9;
                if (this.charge !== 0) {
                  yoffset -= specs.atoms_font_size_2D * .3;
                }
                moveCharge = false;
                hAngle = m.PI / 2;
              } else if (this.angleOfLeastInterference <= 5 * m.PI / 4) {
                xoffset = -symbolWidth / 2 - numWidth - hWidth / 2 - massWidth / 2;
                moveCharge = false;
                hAngle = m.PI;
              } else if (this.angleOfLeastInterference < 7 * m.PI / 4) {
                xoffset = 0;
                yoffset = specs.atoms_font_size_2D * .9;
                moveCharge = false;
                hAngle = 3 * m.PI / 2;
              }
            }
            ctx.font = font;
            ctx.fillText('H', this.x + xoffset, this.y + yoffset);
            ctx.font = subFont;
            ctx.fillText(numHs, this.x + xoffset + hWidth / 2 + numWidth / 2, this.y + yoffset + specs.atoms_font_size_2D * .3);
            this.textBounds.push({
              x : this.x + xoffset - hWidth / 2,
              y : this.y + yoffset - specs.atoms_font_size_2D / 2 + 1,
              w : hWidth,
              h : specs.atoms_font_size_2D - 2
            });
            this.textBounds.push({
              x : this.x + xoffset + hWidth / 2,
              y : this.y + yoffset + specs.atoms_font_size_2D * .3 - specs.atoms_font_size_2D / 2 + 1,
              w : numWidth,
              h : specs.atoms_font_size_2D * .8 - 2
            });
          } else {
            var xoffset = symbolWidth / 2 + hWidth / 2;
            var yoffset = 0;
            if (this.bondNumber === 1) {
              if (this.angleOfLeastInterference > m.PI / 2 && this.angleOfLeastInterference < 3 * m.PI / 2) {
                xoffset = -symbolWidth / 2 - hWidth / 2 - massWidth / 2;
                hAngle = m.PI;
              }
            } else {
              if (this.angleOfLeastInterference <= m.PI / 4) {
                // default
              } else if (this.angleOfLeastInterference < 3 * m.PI / 4) {
                xoffset = 0;
                yoffset = -specs.atoms_font_size_2D * .9;
                moveCharge = false;
                hAngle = m.PI / 2;
              } else if (this.angleOfLeastInterference <= 5 * m.PI / 4) {
                xoffset = -symbolWidth / 2 - hWidth / 2 - massWidth / 2;
                moveCharge = false;
                hAngle = m.PI;
              } else if (this.angleOfLeastInterference < 7 * m.PI / 4) {
                xoffset = 0;
                yoffset = specs.atoms_font_size_2D * .9;
                moveCharge = false;
                hAngle = 3 * m.PI / 2;
              }
            }
            ctx.fillText('H', this.x + xoffset, this.y + yoffset);
            this.textBounds.push({
              x : this.x + xoffset - hWidth / 2,
              y : this.y + yoffset - specs.atoms_font_size_2D / 2 + 1,
              w : hWidth,
              h : specs.atoms_font_size_2D - 2
            });
          }
          if (moveCharge) {
            chargeOffset += hWidth;
          }
          // adjust the angles metadata to account for hydrogen
          // placement
          /*
           * this.angles.push(hAngle); var angleData =
           * math.angleBetweenLargest(this.angles);
           * this.angleOfLeastInterference = angleData.angle % (m.PI *
           * 2); this.largestAngle = angleData.largest;
           */
        }
        // charge
        if (this.charge !== 0) {
          var s = this.charge.toFixed(0);
          if (s === '1') {
            s = '+';
          } else if (s === '-1') {
            s = '\u2013';
          } else if (extensions.stringStartsWith(s, '-')) {
            s = s.substring(1) + '\u2013';
          } else {
            s += '+';
          }
          var chargeWidth = ctx.measureText(s).width;
          chargeOffset += chargeWidth / 2;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = extensions.getFontString(m.floor(specs.atoms_font_size_2D * .8), specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
          ctx.fillText(s, this.x + chargeOffset - 1, this.y - specs.atoms_font_size_2D / 2 + 1);
          this.textBounds.push({
            x : this.x + chargeOffset - chargeWidth / 2 - 1,
            y : this.y - (specs.atoms_font_size_2D * 1.8) / 2 + 5,
            w : chargeWidth,
            h : specs.atoms_font_size_2D / 2 - 1
          });
        }
      }
    }
    if (this.numLonePair > 0 || this.numRadical > 0) {
      ctx.fillStyle = 'black';
      var as = this.angles.slice(0);
      var ali = this.angleOfLeastInterference;
      var la = this.largestAngle;
      if (hAngle !== undefined) {
        // have to check for undefined here as this number can be 0
        as.push(hAngle);
        as.sort();
        var angleData = math.angleBetweenLargest(as);
        ali = angleData.angle % (m.PI * 2);
        la = angleData.largest;
      }
      var things = [];
      for ( var i = 0; i < this.numLonePair; i++) {
        things.push({
          t : 2
        });
      }
      for ( var i = 0; i < this.numRadical; i++) {
        things.push({
          t : 1
        });
      }
      if (hAngle === undefined && m.abs(la - 2 * m.PI / as.length) < m.PI / 60) {
        var mid = m.ceil(things.length / as.length);
        for ( var i = 0, ii = things.length; i < ii; i += mid, ali += la) {
          this.drawElectrons(ctx, specs, things.slice(i, m.min(things.length, i + mid)), ali, la, hAngle);
        }
      } else {
        this.drawElectrons(ctx, specs, things, ali, la, hAngle);
      }
    }
    // for debugging atom label dimensions
    // ctx.strokeStyle = 'red'; for(var i = 0, ii =
    // this.textBounds.length;i<ii; i++){ var r = this.textBounds[i];
    // ctx.beginPath();ctx.rect(r.x, r.y, r.w, r.h); ctx.stroke(); }

  };
  _.drawElectrons = function(ctx, specs, things, angle, largest, hAngle) {
    var segment = largest / (things.length + (this.bonds.length === 0 && hAngle === undefined ? 0 : 1));
    var angleStart = angle - largest / 2 + segment;
    for ( var i = 0; i < things.length; i++) {
      var t = things[i];
      var angle = angleStart + i * segment;
      var p1x = this.x + Math.cos(angle) * specs.atoms_lonePairDistance_2D;
      var p1y = this.y - Math.sin(angle) * specs.atoms_lonePairDistance_2D;
      if (t.t === 2) {
        var perp = angle + Math.PI / 2;
        var difx = Math.cos(perp) * specs.atoms_lonePairSpread_2D / 2;
        var dify = -Math.sin(perp) * specs.atoms_lonePairSpread_2D / 2;
        ctx.beginPath();
        ctx.arc(p1x + difx, p1y + dify, specs.atoms_lonePairDiameter_2D, 0, m.PI * 2, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p1x - difx, p1y - dify, specs.atoms_lonePairDiameter_2D, 0, m.PI * 2, false);
        ctx.fill();
      } else if (t.t === 1) {
        ctx.beginPath();
        ctx.arc(p1x, p1y, specs.atoms_lonePairDiameter_2D, 0, m.PI * 2, false);
        ctx.fill();
      }
    }
  };
  _.drawDecorations = function(ctx) {
    if (this.isHover || this.isSelected) {
      ctx.strokeStyle = this.isHover ? '#885110' : '#0060B2';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      var radius = this.isHover ? 7 : 15;
      ctx.arc(this.x, this.y, radius, 0, m.PI * 2, false);
      ctx.stroke();
    }
    if (this.isOverlap) {
      ctx.strokeStyle = '#C10000';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 7, 0, m.PI * 2, false);
      ctx.stroke();
    }
  };
  _.render = function(gl, specs, noColor) {
    if (this.specs) {
      specs = this.specs;
    }
    var transform = m4.translate(gl.modelViewMatrix, [ this.x, this.y, this.z ], []);
    var radius = specs.atoms_useVDWDiameters_3D ? ELEMENT[this.label].vdWRadius * specs.atoms_vdwMultiplier_3D : specs.atoms_sphereDiameter_3D / 2;
    if (radius === 0) {
      radius = 1;
    }
    m4.scale(transform, [ radius, radius, radius ]);

    // colors
    if (!noColor) {
      var color = specs.atoms_color;
      if (specs.atoms_useJMOLColors) {
        color = ELEMENT[this.label].jmolColor;
      } else if (specs.atoms_usePYMOLColors) {
        color = ELEMENT[this.label].pymolColor;
      }
      gl.material.setDiffuseColor(color);
    }

    // render
    gl.setMatrixUniforms(transform);
    var buffer = this.renderAsStar ? gl.starBuffer : gl.sphereBuffer;
    gl.drawElements(gl.TRIANGLES, buffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  };
  _.isLabelVisible = function(specs) {
    if (specs.atoms_displayAllCarbonLabels_2D) {
      // show all carbons
      return true;
    }
    if (this.label !== 'C') {
      // not a carbon
      return true;
    }
    if (this.altLabel) {
      // there is an alternative label
      return true;
    }
    if (this.any || this.rgroup !== -1) {
      // this is a query atom
      return true;
    }
    if (this.mass !== -1 || this.charge !== 0) {
      // an isotope or charge designation, so label must be shown
      return true;
    }
    if (specs.atoms_showAttributedCarbons_2D && (this.numRadical !== 0 || this.numLonePair !== 0)) {
      // there are attributes and we want to show the associated label
      return true;
    }
    if (this.isHidden && specs.atoms_showHiddenCarbons_2D) {
      // if it is hidden and we want to show them
      return true;
    }
    if (specs.atoms_displayTerminalCarbonLabels_2D && this.bondNumber === 1) {
      // if it is terminal and we want to show them
      return true;
    }
    return false;
  };
  _.getImplicitHydrogenCount = function() {
    if (this.label === 'H' || !ELEMENT[this.label] || !ELEMENT[this.label].addH) {
      return 0;
    }
    var valence = ELEMENT[this.label].valency;
    var dif = valence - this.coordinationNumber;
    if (this.numRadical > 0) {
      dif = m.max(0, dif - this.numRadical);
    }
    if (this.charge > 0) {
      var vdif = 4 - valence;
      if (this.charge <= vdif) {
        dif += this.charge;
      } else {
        dif = 4 - this.coordinationNumber - this.charge + vdif;
      }
    } else {
      dif += this.charge;
    }
    return dif < 0 ? 0 : m.floor(dif);
  };
  _.getBounds = function() {
    var bounds = new math.Bounds();
    bounds.expand(this.x, this.y);
    if (this.textBounds) {
      for ( var i = 0, ii = this.textBounds.length; i < ii; i++) {
        var tb = this.textBounds[i];
        bounds.expand(tb.x, tb.y, tb.x + tb.w, tb.y + tb.h);
      }
    }
    return bounds;
  };
  _.getBounds3D = function() {
    var bounds = new math.Bounds();
    bounds.expand3D(this.x, this.y, this.z);
    return bounds;
  };
  /**
   * Get Color by atom element.
   *
   * @param {boolean} useJMOLColors
   * @param {boolean} usePYMOLColors
   * @param {string} color The default color
   * @param {number} dim The render dimension
   * @return {string} The atom element color
   */
  _.getElementColor = function(useJMOLColors, usePYMOLColors, color, dim) {
    if(dim==2 && this.any || this.rgroup !== -1){
      return color;
    }
    if (useJMOLColors) {
      color = ELEMENT[this.label].jmolColor;
    } else if (usePYMOLColors) {
      color = ELEMENT[this.label].pymolColor;
    }
    return color;
  };

})(ChemDoodle.ELEMENT, ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4500 $
//  $Author: kevin $
//  $LastChangedDate: 2013-09-06 14:28:15 -0400 (Fri, 06 Sep 2013) $
//

(function(ELEMENT, extensions, structures, math, m, m4, v3) {
  'use strict';
  structures.Bond = function(a1, a2, bondOrder) {
    this.a1 = a1;
    this.a2 = a2;
    // bondOrder can be 0, so need to check against undefined
    this.bondOrder = bondOrder !== undefined ? bondOrder : 1;
  };
  structures.Bond.STEREO_NONE = 'none';
  structures.Bond.STEREO_PROTRUDING = 'protruding';
  structures.Bond.STEREO_RECESSED = 'recessed';
  structures.Bond.STEREO_AMBIGUOUS = 'ambiguous';
  var _ = structures.Bond.prototype;
  _.stereo = structures.Bond.STEREO_NONE;
  _.isHover = false;
  _.ring = undefined;
  _.getCenter = function() {
    return new structures.Point((this.a1.x + this.a2.x) / 2, (this.a1.y + this.a2.y) / 2);
  };
  _.getLength = function() {
    return this.a1.distance(this.a2);
  };
  _.getLength3D = function() {
    return this.a1.distance3D(this.a2);
  };
  _.contains = function(a) {
    return a === this.a1 || a === this.a2;
  };
  _.getNeighbor = function(a) {
    if (a === this.a1) {
      return this.a2;
    } else if (a === this.a2) {
      return this.a1;
    }
    return undefined;
  };
  _.draw = function(ctx, specs) {
    if (this.a1.x === this.a2.x && this.a1.y === this.a2.y) {
      // return, as there is nothing to render, will only cause fill
      // overflows
      return;
    }
    if (this.specs) {
      specs = this.specs;
    }
    var x1 = this.a1.x;
    var x2 = this.a2.x;
    var y1 = this.a1.y;
    var y2 = this.a2.y;
    var dist = this.a1.distance(this.a2);
    var difX = x2 - x1;
    var difY = y2 - y1;
    if (this.a1.isLassoed && this.a2.isLassoed) {
      var grd = ctx.createLinearGradient(x1, y1, x2, y2);
      grd.addColorStop(0, 'rgba(212, 99, 0, 0)');
      grd.addColorStop(0.5, 'rgba(212, 99, 0, 0.8)');
      grd.addColorStop(1, 'rgba(212, 99, 0, 0)');
      var useDist = 2.5;
      var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
      var mcosp = m.cos(perpendicular);
      var msinp = m.sin(perpendicular);
      var cx1 = x1 - mcosp * useDist;
      var cy1 = y1 + msinp * useDist;
      var cx2 = x1 + mcosp * useDist;
      var cy2 = y1 - msinp * useDist;
      var cx3 = x2 + mcosp * useDist;
      var cy3 = y2 - msinp * useDist;
      var cx4 = x2 - mcosp * useDist;
      var cy4 = y2 + msinp * useDist;
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(cx1, cy1);
      ctx.lineTo(cx2, cy2);
      ctx.lineTo(cx3, cy3);
      ctx.lineTo(cx4, cy4);
      ctx.closePath();
      ctx.fill();
    }
    if (specs.atoms_display && !specs.atoms_circles_2D && this.a1.isLabelVisible(specs) && this.a1.textBounds) {
      var distShrink = 0;
      for ( var i = 0, ii = this.a1.textBounds.length; i < ii; i++) {
        distShrink = Math.max(distShrink, math.calculateDistanceInterior(this.a1, this.a2, this.a1.textBounds[i]));
      }
      distShrink += specs.bonds_atomLabelBuffer_2D;
      var perc = distShrink / dist;
      x1 += difX * perc;
      y1 += difY * perc;
    }
    if (specs.atoms_display && !specs.atoms_circles_2D && this.a2.isLabelVisible(specs) && this.a2.textBounds) {
      var distShrink = 0;
      for ( var i = 0, ii = this.a2.textBounds.length; i < ii; i++) {
        distShrink = Math.max(distShrink, math.calculateDistanceInterior(this.a2, this.a1, this.a2.textBounds[i]));
      }
      distShrink += specs.bonds_atomLabelBuffer_2D;
      var perc = distShrink / dist;
      x2 -= difX * perc;
      y2 -= difY * perc;
    }
    if (specs.bonds_clearOverlaps_2D) {
      var xs = x1 + difX * .15;
      var ys = y1 + difY * .15;
      var xf = x2 - difX * .15;
      var yf = y2 - difY * .15;
      ctx.strokeStyle = specs.backgroundColor;
      ctx.lineWidth = specs.bonds_width_2D + specs.bonds_overlapClearWidth_2D * 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(xs, ys);
      ctx.lineTo(xf, yf);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.strokeStyle = specs.bonds_color;
    ctx.fillStyle = specs.bonds_color;
    ctx.lineWidth = specs.bonds_width_2D;
    ctx.lineCap = specs.bonds_ends_2D;
    if (specs.bonds_useJMOLColors || specs.bonds_usePYMOLColors) {
      var linearGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      var color1 = this.a1.getElementColor(specs.bonds_useJMOLColors, specs.bonds_usePYMOLColors, specs.atoms_color, 2);
      var color2 = this.a2.getElementColor(specs.bonds_useJMOLColors, specs.bonds_usePYMOLColors, specs.atoms_color, 2);
      linearGradient.addColorStop(0, color1);
      if (!specs.bonds_colorGradient) {
        linearGradient.addColorStop(0.5, color1);
        linearGradient.addColorStop(0.51, color2);
      }
      linearGradient.addColorStop(1, color2);
      ctx.strokeStyle = linearGradient;
      ctx.fillStyle = linearGradient;
    }
    switch (this.bondOrder) {
    case 0:
      var dx = x2 - x1;
      var dy = y2 - y1;
      var innerDist = m.sqrt(dx * dx + dy * dy);
      var num = m.floor(innerDist / specs.bonds_dotSize_2D);
      var remainder = (innerDist - (num - 1) * specs.bonds_dotSize_2D) / 2;
      if (num % 2 === 1) {
        remainder += specs.bonds_dotSize_2D / 4;
      } else {
        remainder -= specs.bonds_dotSize_2D / 4;
        num += 2;
      }
      num /= 2;
      var angle = this.a1.angle(this.a2);
      var xs = x1 + remainder * Math.cos(angle);
      var ys = y1 - remainder * Math.sin(angle);
      ctx.beginPath();
      for ( var i = 0; i < num; i++) {
        ctx.arc(xs, ys, specs.bonds_dotSize_2D / 2, 0, m.PI * 2, false);
        xs += 2 * specs.bonds_dotSize_2D * Math.cos(angle);
        ys -= 2 * specs.bonds_dotSize_2D * Math.sin(angle);
      }
      ctx.fill();
      break;
    case 0.5:
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      extensions.contextHashTo(ctx, x1, y1, x2, y2, specs.bonds_hashSpacing_2D, specs.bonds_hashSpacing_2D);
      ctx.stroke();
      break;
    case 1:
      if (this.stereo === structures.Bond.STEREO_PROTRUDING || this.stereo === structures.Bond.STEREO_RECESSED) {
        var thinSpread = specs.bonds_width_2D / 2;
        var useDist = this.a1.distance(this.a2) * specs.bonds_wedgeThickness_2D / 2;
        var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
        var mcosp = m.cos(perpendicular);
        var msinp = m.sin(perpendicular);
        var cx1 = x1 - mcosp * thinSpread;
        var cy1 = y1 + msinp * thinSpread;
        var cx2 = x1 + mcosp * thinSpread;
        var cy2 = y1 - msinp * thinSpread;
        var cx3 = x2 + mcosp * useDist;
        var cy3 = y2 - msinp * useDist;
        var cx4 = x2 - mcosp * useDist;
        var cy4 = y2 + msinp * useDist;
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.lineTo(cx3, cy3);
        ctx.lineTo(cx4, cy4);
        ctx.closePath();
        if (this.stereo === structures.Bond.STEREO_PROTRUDING) {
          ctx.fill();
        } else {
          ctx.save();
          ctx.clip();
          ctx.lineWidth = useDist * 2;
          ctx.lineCap = 'butt';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          extensions.contextHashTo(ctx, x1, y1, x2, y2, specs.bonds_hashWidth_2D, specs.bonds_hashSpacing_2D);
          ctx.stroke();
          ctx.restore();
        }
      } else if (this.stereo === structures.Bond.STEREO_AMBIGUOUS) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        var curves = m.floor(m.sqrt(difX * difX + difY * difY) / specs.bonds_wavyLength_2D);
        var x = x1;
        var y = y1;
        var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
        var mcosp = m.cos(perpendicular);
        var msinp = m.sin(perpendicular);

        var curveX = difX / curves;
        var curveY = difY / curves;
        var cpx1, cpx2, cpy1, cpy2;
        for ( var i = 0, ii = curves; i < ii; i++) {
          x += curveX;
          y += curveY;
          cpx1 = specs.bonds_wavyLength_2D * mcosp + x - curveX * 0.5;
          cpy1 = specs.bonds_wavyLength_2D * -msinp + y - curveY * 0.5;
          cpx2 = specs.bonds_wavyLength_2D * -mcosp + x - curveX * 0.5;
          cpy2 = specs.bonds_wavyLength_2D * msinp + y - curveY * 0.5;
          if (i % 2 === 0) {
            ctx.quadraticCurveTo(cpx1, cpy1, x, y);
          } else {
            ctx.quadraticCurveTo(cpx2, cpy2, x, y);
          }
        }
        ctx.stroke();
        break;
      } else {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      break;
    case 1.5:
    case 2:
      if (this.stereo === structures.Bond.STEREO_AMBIGUOUS) {
        var useDist = this.a1.distance(this.a2) * specs.bonds_saturationWidth_2D / 2;
        var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
        var mcosp = m.cos(perpendicular);
        var msinp = m.sin(perpendicular);
        var cx1 = x1 - mcosp * useDist;
        var cy1 = y1 + msinp * useDist;
        var cx2 = x1 + mcosp * useDist;
        var cy2 = y1 - msinp * useDist;
        var cx3 = x2 + mcosp * useDist;
        var cy3 = y2 - msinp * useDist;
        var cx4 = x2 - mcosp * useDist;
        var cy4 = y2 + msinp * useDist;
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx3, cy3);
        ctx.moveTo(cx2, cy2);
        ctx.lineTo(cx4, cy4);
        ctx.stroke();
      } else if (!specs.bonds_symmetrical_2D && (this.ring || this.a1.label === 'C' && this.a2.label === 'C')) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        var clip = 0;
        var dist = this.a1.distance(this.a2);
        var angle = this.a1.angle(this.a2);
        var perpendicular = angle + m.PI / 2;
        var useDist = dist * specs.bonds_saturationWidth_2D;
        var clipAngle = specs.bonds_saturationAngle_2D;
        if (clipAngle < m.PI / 2) {
          clip = -(useDist / m.tan(clipAngle));
        }
        if (m.abs(clip) < dist / 2) {
          var xuse1 = x1 - m.cos(angle) * clip;
          var xuse2 = x2 + m.cos(angle) * clip;
          var yuse1 = y1 + m.sin(angle) * clip;
          var yuse2 = y2 - m.sin(angle) * clip;
          var mcosp = m.cos(perpendicular);
          var msinp = m.sin(perpendicular);
          var cx1 = xuse1 - mcosp * useDist;
          var cy1 = yuse1 + msinp * useDist;
          var cx2 = xuse1 + mcosp * useDist;
          var cy2 = yuse1 - msinp * useDist;
          var cx3 = xuse2 - mcosp * useDist;
          var cy3 = yuse2 + msinp * useDist;
          var cx4 = xuse2 + mcosp * useDist;
          var cy4 = yuse2 - msinp * useDist;
          var flip = !this.ring || (this.ring.center.angle(this.a1) > this.ring.center.angle(this.a2) && !(this.ring.center.angle(this.a1) - this.ring.center.angle(this.a2) > m.PI) || (this.ring.center.angle(this.a1) - this.ring.center.angle(this.a2) < -m.PI));
          if (flip) {
            ctx.moveTo(cx1, cy1);
            if (this.bondOrder === 2) {
              ctx.lineTo(cx3, cy3);
            } else {
              extensions.contextHashTo(ctx, cx1, cy1, cx3, cy3, specs.bonds_hashSpacing_2D, specs.bonds_hashSpacing_2D);
            }
          } else {
            ctx.moveTo(cx2, cy2);
            if (this.bondOrder === 2) {
              ctx.lineTo(cx4, cy4);
            } else {
              extensions.contextHashTo(ctx, cx2, cy2, cx4, cy4, specs.bonds_hashSpacing_2D, specs.bonds_hashSpacing_2D);
            }
          }
          ctx.stroke();
        }
      } else {
        var useDist = this.a1.distance(this.a2) * specs.bonds_saturationWidth_2D / 2;
        var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
        var mcosp = m.cos(perpendicular);
        var msinp = m.sin(perpendicular);
        var cx1 = x1 - mcosp * useDist;
        var cy1 = y1 + msinp * useDist;
        var cx2 = x1 + mcosp * useDist;
        var cy2 = y1 - msinp * useDist;
        var cx3 = x2 + mcosp * useDist;
        var cy3 = y2 - msinp * useDist;
        var cx4 = x2 - mcosp * useDist;
        var cy4 = y2 + msinp * useDist;
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx4, cy4);
        ctx.moveTo(cx2, cy2);
        if (this.bondOrder === 2) {
          ctx.lineTo(cx3, cy3);
        } else {
          extensions.contextHashTo(ctx, cx2, cy2, cx3, cy3, specs.bonds_hashSpacing_2D, specs.bonds_hashSpacing_2D);
        }
        ctx.stroke();
      }
      break;
    case 3:
      var useDist = this.a1.distance(this.a2) * specs.bonds_saturationWidth_2D;
      var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
      var mcosp = m.cos(perpendicular);
      var msinp = m.sin(perpendicular);
      var cx1 = x1 - mcosp * useDist;
      var cy1 = y1 + msinp * useDist;
      var cx2 = x1 + mcosp * useDist;
      var cy2 = y1 - msinp * useDist;
      var cx3 = x2 + mcosp * useDist;
      var cy3 = y2 - msinp * useDist;
      var cx4 = x2 - mcosp * useDist;
      var cy4 = y2 + msinp * useDist;
      ctx.beginPath();
      ctx.moveTo(cx1, cy1);
      ctx.lineTo(cx4, cy4);
      ctx.moveTo(cx2, cy2);
      ctx.lineTo(cx3, cy3);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      break;
    }
  };
  _.drawDecorations = function(ctx) {
    if (this.isHover || this.isSelected) {
      var pi2 = 2 * m.PI;
      var angle = (this.a1.angleForStupidCanvasArcs(this.a2) + m.PI / 2) % pi2;
      ctx.strokeStyle = this.isHover ? '#885110' : '#0060B2';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      var angleTo = (angle + m.PI) % pi2;
      angleTo = angleTo % (m.PI * 2);
      ctx.arc(this.a1.x, this.a1.y, 7, angle, angleTo, false);
      ctx.stroke();
      ctx.beginPath();
      angle += m.PI;
      angleTo = (angle + m.PI) % pi2;
      ctx.arc(this.a2.x, this.a2.y, 7, angle, angleTo, false);
      ctx.stroke();
    }
  };
  /**
   *
   * @param {WegGLRenderingContext} gl
   * @param {structures.VisualSpecifications} specs
   * @param {boolean} asSegments Using cylinder/solid line or segmented pills/dashed line
   * @return {void}
   */
  _.render = function(gl, specs, asSegments) {
    if (this.specs) {
      specs = this.specs;
    }
    // this is the elongation vector for the cylinder
    var height = this.a1.distance3D(this.a2);
    if (height === 0) {
      // if there is no height, then no point in rendering this bond,
      // just return
      return;
    }

    // scale factor for cylinder/pill radius.
    // when scale pill, the cap will affected too.
    var radiusScale = specs.bonds_cylinderDiameter_3D / 2;

    // atom1 color and atom2 color
    var a1Color = specs.bonds_color;
    var a2Color;

    // transform to the atom as well as the opposite atom (for Jmol and
    // PyMOL
    // color splits)
    var transform = m4.translate(gl.modelViewMatrix, [ this.a1.x, this.a1.y, this.a1.z ], []);
    var transformOpposite;

    // vector from atom1 to atom2
    var a2b = [ this.a2.x - this.a1.x, this.a2.y - this.a1.y, this.a2.z - this.a1.z ];

    // calculate the rotation
    var y = [ 0, 1, 0 ];
    var ang = 0;
    var axis;
    if (this.a1.x === this.a2.x && this.a1.z === this.a2.z) {
      axis = [ 0, 0, 1 ];
      if (this.a2.y < this.a1.y) {
        ang = m.PI;
      }
    } else {
      ang = extensions.vec3AngleFrom(y, a2b);
      axis = v3.cross(y, a2b, []);
    }


    var useJMOLColors = specs.bonds_useJMOLColors;
    var usePYMOLColors = specs.bonds_usePYMOLColors;

    // the specs will use JMol or PyMol color are
    // - Line
    // - Stick
    // - Wireframe
    if (useJMOLColors || usePYMOLColors) {

      a1Color = this.a1.getElementColor(useJMOLColors, usePYMOLColors, a1Color);
      a2Color = this.a2.getElementColor(useJMOLColors, usePYMOLColors, specs.bonds_color);

      // the transformOpposite will use for split color.
      // just make it splited if the color different.
      if(a1Color != a2Color) {
        transformOpposite = m4.translate(gl.modelViewMatrix, [ this.a2.x, this.a2.y, this.a2.z ], []);
      }
    }

    // calculate the translations for unsaturated bonds.
    // represenattio use saturatedCross are
    // - Line
    // - Wireframe
    // - Ball and Stick
    // just Stick will set bonds_showBondOrders_3D to false
    var others = [ 0 ];
    var saturatedCross;

    if(asSegments) { // block for draw bond as segmented line/pill

      if (specs.bonds_showBondOrders_3D && this.bondOrder > 1) {

        // The "0.5" part set here,
        // the other part (1) will render as cylinder
        others = [/*-specs.bonds_cylinderDiameter_3D, */ specs.bonds_cylinderDiameter_3D];

        var z = [ 0, 0, 1 ];
        var inverse = m4.inverse(gl.rotationMatrix, []);
        m4.multiplyVec3(inverse, z);
        saturatedCross = v3.cross(a2b, z, []);
        v3.normalize(saturatedCross);
      }

      var segmentScale = 1;

      var spaceBetweenPill = specs.bonds_pillSpacing_3D;

      var pillHeight = specs.bonds_pillHeight_3D;

      if(this.bondOrder == 0) {

        if(specs.bonds_renderAsLines_3D) {
          pillHeight = spaceBetweenPill;
        } else {
          pillHeight = specs.bonds_pillDiameter_3D;

          // Detect Ball and Stick representation
          if(pillHeight < specs.bonds_cylinderDiameter_3D) {
            pillHeight /= 2;
          }

          segmentScale = pillHeight / 2;
          height /= segmentScale;
          spaceBetweenPill /= segmentScale / 2;
        }

      }

      // total space need for one pill, iclude the space.
      var totalSpaceForPill = pillHeight + spaceBetweenPill;

      // segmented pills for one bond.
      var totalPillsPerBond = height / totalSpaceForPill;

      // segmented one unit pill for one bond
      var pillsPerBond = m.floor(totalPillsPerBond);

      var extraSegmentedSpace = height - totalSpaceForPill * pillsPerBond;

      var paddingSpace = (spaceBetweenPill + specs.bonds_pillDiameter_3D + extraSegmentedSpace) / 2;

      // pillSegmentsLength will change if both atom1 and atom2 color used for rendering
      var pillSegmentsLength = pillsPerBond;

      if(transformOpposite) {
        // floor will effected for odd pills, because one pill at the center
        // will replace with splited pills
        pillSegmentsLength = m.floor(pillsPerBond / 2);
      }

      // render bonds
      for ( var i = 0, ii = others.length; i < ii; i++) {
        var transformUse = m4.set(transform, []);

        if (others[i] !== 0) {
          m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
        }
        if (ang !== 0) {
          m4.rotate(transformUse, ang, axis);
        }

        if(segmentScale != 1) {
          m4.scale(transformUse, [ segmentScale, segmentScale, segmentScale ]);
        }

        // colors
        if(a1Color) gl.material.setDiffuseColor(a1Color);

        m4.translate(transformUse, [0, paddingSpace, 0]);

        for(var j = 0; j < pillSegmentsLength; j++) {

          if (specs.bonds_renderAsLines_3D) {
            if(this.bondOrder == 0) {
              gl.setMatrixUniforms(transformUse);
              gl.drawArrays(gl.POINTS, 0, 1);
            } else {
              m4.scale(transformUse, [1, pillHeight, 1]);

              gl.setMatrixUniforms(transformUse);
              gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);

              m4.scale(transformUse, [1, 1/pillHeight, 1]);
            }
          } else {
            gl.setMatrixUniforms(transformUse);
            if(this.bondOrder == 0) {
              gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            } else {
              gl.drawElements(gl.TRIANGLES, gl.pillBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
          }

          m4.translate(transformUse, [0, totalSpaceForPill, 0]);
        }


        // if rendering segmented pill use atom1 and atom2 color
        if (transformOpposite) {
          // parameter for calculate splited pills
          var scaleY, halfOneMinScaleY;

          if (specs.bonds_renderAsLines_3D) {
            scaleY = pillHeight;
            // if(this.bondOrder != 0) {
            //  scaleY -= spaceBetweenPill;
            // }
            scaleY /= 2;
            halfOneMinScaleY = 0;
          } else {
            scaleY = 2/3;
            halfOneMinScaleY = (1 - scaleY) / 2;
          }

          // if count of pills per bound is odd,
          // then draw the splited pills of atom1
          if(pillsPerBond % 2 != 0) {

            m4.scale(transformUse, [1, scaleY, 1]);

            gl.setMatrixUniforms(transformUse);

            if (specs.bonds_renderAsLines_3D) {

              if(this.bondOrder == 0) {
                gl.drawArrays(gl.POINTS, 0, 1);
              } else {
                gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
              }

            } else {

              if(this.bondOrder == 0) {
                gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
              } else {
                gl.drawElements(gl.TRIANGLES, gl.pillBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
              }

            }

            m4.translate(transformUse, [0, totalSpaceForPill * (1 + halfOneMinScaleY), 0]);

            m4.scale(transformUse, [1, 1/scaleY, 1]);
          }

          // prepare to render the atom2

          m4.set(transformOpposite, transformUse);
          if (others[i] !== 0) {
            m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
          }
          // don't check for 0 here as that means it should be rotated
          // by PI, but PI will be negated
          m4.rotate(transformUse, ang + m.PI, axis);

          if(segmentScale != 1) {
            m4.scale(transformUse, [ segmentScale, segmentScale, segmentScale ]);
          }

          // colors
          if(a2Color) gl.material.setDiffuseColor(a2Color);

          m4.translate(transformUse, [0, paddingSpace, 0]);


          // draw the remain pills which use the atom2 color
          for(var j = 0; j < pillSegmentsLength; j++) {

            if (specs.bonds_renderAsLines_3D) {
              if(this.bondOrder == 0) {
                gl.setMatrixUniforms(transformUse);
                gl.drawArrays(gl.POINTS, 0, 1);
              } else {
                m4.scale(transformUse, [1, pillHeight, 1]);

                gl.setMatrixUniforms(transformUse);
                gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);

                m4.scale(transformUse, [1, 1/pillHeight, 1]);
              }
            } else {
              gl.setMatrixUniforms(transformUse);
              if(this.bondOrder == 0) {
                gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
              } else {
                gl.drawElements(gl.TRIANGLES, gl.pillBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
              }
            }

            m4.translate(transformUse, [0, totalSpaceForPill, 0]);
          }

          // draw the splited center pills of atom2
          if(pillsPerBond % 2 != 0) {

            m4.scale(transformUse, [1, scaleY, 1]);

            gl.setMatrixUniforms(transformUse);

            if (specs.bonds_renderAsLines_3D) {

              if(this.bondOrder == 0) {
                gl.drawArrays(gl.POINTS, 0, 1);
              } else {
                gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
              }

            } else {

              if(this.bondOrder == 0) {
                gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
              } else {
                gl.drawElements(gl.TRIANGLES, gl.pillBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
              }

            }

            m4.translate(transformUse, [0, totalSpaceForPill * (1 + halfOneMinScaleY), 0]);

            m4.scale(transformUse, [1, 1/scaleY, 1]);
          }
        }
      }
    } else {
      // calculate the translations for unsaturated bonds.
      // represenation that use saturatedCross are
      // - Line
      // - Wireframe
      // - Ball and Stick
      // just Stick will set bonds_showBondOrders_3D to false
      if (specs.bonds_showBondOrders_3D) {

        switch (this.bondOrder) {
        // the 0 and 0.5 bond order will draw as segmented pill.
        // so we not set that here.
        // case 0:
        // case 0.5: break;

        case 1.5:
          // The "1" part set here,
          // the other part (0.5) will render as segmented pill
          others = [ -specs.bonds_cylinderDiameter_3D /*, specs.bonds_cylinderDiameter_3D */];
          break;
        case 2:
          others = [ -specs.bonds_cylinderDiameter_3D, specs.bonds_cylinderDiameter_3D ];
          break;
        case 3:
          others = [ -1.2 * specs.bonds_cylinderDiameter_3D, 0, 1.2 * specs.bonds_cylinderDiameter_3D ];
          break;
        }

        // saturatedCross just need for need for bondorder greather than 1
        if(this.bondOrder > 1) {
          var z = [ 0, 0, 1 ];
          var inverse = m4.inverse(gl.rotationMatrix, []);
          m4.multiplyVec3(inverse, z);
          saturatedCross = v3.cross(a2b, z, []);
          v3.normalize(saturatedCross);
        }
      }
      // for Stick representation, we just change the cylinder radius
      else {

        switch (this.bondOrder) {
        case 0:
          radiusScale *= 0.25;
          break;
        case 0.5:
        case 1.5:
          radiusScale *= 0.5;
          break;
        }
      }


      // if transformOpposite is set, the it mean the color must be splited.
      // so the heigh of cylinder will be half.
      // one half for atom1 color the other for atom2 color
      if(transformOpposite) {
        height /= 2;
      }

      // Radius of cylinder already defined when initialize cylinder mesh,
      // so at this rate, the scale just needed for Y to strech
      // cylinder to bond length (height) and X and Z for radius.
      var scaleVector = [ radiusScale, height, radiusScale ];

      // render bonds
      for ( var i = 0, ii = others.length; i < ii; i++) {
        var transformUse = m4.set(transform, []);
        if (others[i] !== 0) {
          m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
        }
        if (ang !== 0) {
          m4.rotate(transformUse, ang, axis);
        }
        m4.scale(transformUse, scaleVector);

        // colors
        if(a1Color) gl.material.setDiffuseColor(a1Color);

        // render
        gl.setMatrixUniforms(transformUse);
        if (specs.bonds_renderAsLines_3D) {
          gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
        } else {
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.cylinderBuffer.vertexPositionBuffer.numItems);
        }

        // if transformOpposite is set, then a2Color also shoudl be seted as well.
        if (transformOpposite) {

          m4.set(transformOpposite, transformUse);
          if (others[i] !== 0) {
            m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
          }
          // don't check for 0 here as that means it should be rotated
          // by PI, but PI will be negated
          m4.rotate(transformUse, ang + m.PI, axis);
          m4.scale(transformUse, scaleVector);

          // colors
          if(a2Color) gl.material.setDiffuseColor(a2Color);

          // render
          gl.setMatrixUniforms(transformUse);
          if (specs.bonds_renderAsLines_3D) {
            gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
          } else {
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.cylinderBuffer.vertexPositionBuffer.numItems);
          }
        }

      }
    }
  };
  /**
   *
   * @param {WegGLRenderingContext} gl
   * @param {structures.VisualSpecifications} specs
   * @return {void}
   */
  _.renderPicker = function(gl, specs) {

    // gl.cylinderBuffer.bindBuffers(gl);
    // gl.material.setDiffuseColor(
    //  this.bondOrder == 0   ? '#FF0000' : // merah
    //  this.bondOrder == 0.5 ? '#FFFF00' : // kuning
    //  this.bondOrder == 1   ? '#FF00FF' : // ungu
    //  this.bondOrder == 1.5 ? '#00FF00' : // hijau
    //  this.bondOrder == 2   ? '#00FFFF' : // cyan
    //  this.bondOrder == 3   ? '#0000FF' : // biru
    //  '#FFFFFF');
    // gl.material.setAlpha(1);


    if (this.specs) {
      specs = this.specs;
    }
    // this is the elongation vector for the cylinder
    var height = this.a1.distance3D(this.a2);
    if (height === 0) {
      // if there is no height, then no point in rendering this bond,
      // just return
      return;
    }

    // scale factor for cylinder/pill radius.
    // when scale pill, the cap will affected too.
    var radiusScale = specs.bonds_cylinderDiameter_3D / 2;

    // transform to the atom as well as the opposite atom (for Jmol and
    // PyMOL
    // color splits)
    var transform = m4.translate(gl.modelViewMatrix, [ this.a1.x, this.a1.y, this.a1.z ], []);

    // vector from atom1 to atom2
    var a2b = [ this.a2.x - this.a1.x, this.a2.y - this.a1.y, this.a2.z - this.a1.z ];

    // calculate the rotation
    var y = [ 0, 1, 0 ];
    var ang = 0;
    var axis;
    if (this.a1.x === this.a2.x && this.a1.z === this.a2.z) {
      axis = [ 0, 0, 1 ];
      if (this.a2.y < this.a1.y) {
        ang = m.PI;
      }
    } else {
      ang = extensions.vec3AngleFrom(y, a2b);
      axis = v3.cross(y, a2b, []);
    }

    // calculate the translations for unsaturated bonds.
    // represenattio use saturatedCross are
    // - Line
    // - WIreframe
    // - Ball and Stick
    // just Stick will set bonds_showBondOrders_3D to false
    var others = [ 0 ];
    var saturatedCross;

    if (specs.bonds_showBondOrders_3D) {

      if (specs.bonds_renderAsLines_3D) {

        switch (this.bondOrder) {

        case 1.5:
        case 2:
          others = [ -specs.bonds_cylinderDiameter_3D, specs.bonds_cylinderDiameter_3D ];
          break;
        case 3:
          others = [ -1.2 * specs.bonds_cylinderDiameter_3D, 0, 1.2 * specs.bonds_cylinderDiameter_3D ];
          break;
        }

        // saturatedCross just need for need for bondorder greather than 1
        if(this.bondOrder > 1) {
          var z = [ 0, 0, 1 ];
          var inverse = m4.inverse(gl.rotationMatrix, []);
          m4.multiplyVec3(inverse, z);
          saturatedCross = v3.cross(a2b, z, []);
          v3.normalize(saturatedCross);
        }

      } else {

        switch (this.bondOrder) {
        case 1.5:
        case 2:
          radiusScale *= 3;
          break;
        case 3:
          radiusScale *= 3.4;
          break;
        }

      }

    } else {
      // this is for Stick repersentation because Stick not have bonds_showBondOrders_3D

      switch (this.bondOrder) {

      case 0:
        radiusScale *= 0.25;
        break;
      case 0.5:
      case 1.5:
        radiusScale *= 0.5;
        break;
      }

    }

    // Radius of cylinder already defined when initialize cylinder mesh,
    // so at this rate, the scale just needed for Y to strech
    // cylinder to bond length (height) and X and Z for radius.
    var scaleVector = [ radiusScale, height, radiusScale ];

    // render bonds
    for ( var i = 0, ii = others.length; i < ii; i++) {
      var transformUse = m4.set(transform, []);
      if (others[i] !== 0) {
        m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
      }
      if (ang !== 0) {
        m4.rotate(transformUse, ang, axis);
      }
      m4.scale(transformUse, scaleVector);

      // render
      gl.setMatrixUniforms(transformUse);
      if (specs.bonds_renderAsLines_3D) {
        gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
      } else {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.cylinderBuffer.vertexPositionBuffer.numItems);
      }

    }
  };

})(ChemDoodle.ELEMENT, ChemDoodle.extensions, ChemDoodle.structures, ChemDoodle.math, Math, mat4, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(structures, m) {
  'use strict';
  structures.Ring = function() {
    this.atoms = [];
    this.bonds = [];
  };
  var _ = structures.Ring.prototype;
  _.center = undefined;
  _.setupBonds = function() {
    for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
      this.bonds[i].ring = this;
    }
    this.center = this.getCenter();
  };
  _.getCenter = function() {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
      minX = m.min(this.atoms[i].x, minX);
      minY = m.min(this.atoms[i].y, minY);
      maxX = m.max(this.atoms[i].x, maxX);
      maxY = m.max(this.atoms[i].y, maxY);
    }
    return new structures.Point((maxX + minX) / 2, (maxY + minY) / 2);
  };

})(ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

(function(c, math, structures, RESIDUE, m) {
  'use strict';
  structures.Molecule = function() {
    this.atoms = [];
    this.bonds = [];
    this.rings = [];
  };
  var _ = structures.Molecule.prototype;
  // this can be an extensive algorithm for large molecules, you may want
  // to turn this off
  _.findRings = true;
  _.draw = function(ctx, specs) {
    if (this.specs) {
      specs = this.specs;
    }
    // draw
    // need this weird render of atoms before and after, just in case
    // circles are rendered, as those should be on top
    if (specs.atoms_display && !specs.atoms_circles_2D) {
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        this.atoms[i].draw(ctx, specs);
      }
    }
    if (specs.bonds_display) {
      for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
        this.bonds[i].draw(ctx, specs);
      }
    }
    if (specs.atoms_display && specs.atoms_circles_2D) {
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        this.atoms[i].draw(ctx, specs);
      }
    }
  };
  _.render = function(gl, specs) {
    // uncomment this to render the picking frame
    // return this.renderPickFrame(gl, specs, []);
    if (this.specs) {
      specs = this.specs;
    }
    // check explicitly if it is undefined here, since hetatm is a
    // boolean that can be true or false, as long as it is set, it is
    // macro
    var isMacro = this.atoms.length > 0 && this.atoms[0].hetatm !== undefined;
    if (isMacro) {
      if (specs.macro_displayBonds) {
        if (this.bonds.length > 0) {
          if (specs.bonds_renderAsLines_3D && !this.residueSpecs || this.residueSpecs && this.residueSpecs.bonds_renderAsLines_3D) {
            gl.lineWidth(this.residueSpecs ? this.residueSpecs.bonds_width_2D : specs.bonds_width_2D);
            gl.lineBuffer.bindBuffers(gl);
          } else {
            gl.cylinderBuffer.bindBuffers(gl);
          }
          // colors
          gl.material.setTempColors(specs.bonds_materialAmbientColor_3D, undefined, specs.bonds_materialSpecularColor_3D, specs.bonds_materialShininess_3D);
        }
        for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
          var b = this.bonds[i];
          // closestDistance may be 0, so check if undefined
          if (!b.a1.hetatm && (specs.macro_atomToLigandDistance === -1 || (b.a1.closestDistance !== undefined && specs.macro_atomToLigandDistance >= b.a1.closestDistance && specs.macro_atomToLigandDistance >= b.a2.closestDistance))) {
            b.render(gl, this.residueSpecs ? this.residueSpecs : specs);
          }
        }
      }
      if (specs.macro_displayAtoms) {
        if (this.atoms.length > 0) {
          gl.sphereBuffer.bindBuffers(gl);
          // colors
          gl.material.setTempColors(specs.atoms_materialAmbientColor_3D, undefined, specs.atoms_materialSpecularColor_3D, specs.atoms_materialShininess_3D);
        }
        for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
          var a = this.atoms[i];
          // closestDistance may be 0, so check if undefined
          if (!a.hetatm && (specs.macro_atomToLigandDistance === -1 || (a.closestDistance !== undefined && specs.macro_atomToLigandDistance >= a.closestDistance))) {
            a.render(gl, this.residueSpecs ? this.residueSpecs : specs);
          }
        }
      }
    }
    if (specs.bonds_display) {
      // Array for Half Bonds. It is needed because Half Bonds use the
      // pill buffer.
      var asPills = [];
      // Array for 0 bond order.
      var asSpheres = [];
      if (this.bonds.length > 0) {
        if (specs.bonds_renderAsLines_3D) {
          gl.lineWidth(specs.bonds_width_2D);
          gl.lineBuffer.bindBuffers(gl);
        } else {
          gl.cylinderBuffer.bindBuffers(gl);
        }
        // colors
        gl.material.setTempColors(specs.bonds_materialAmbientColor_3D, undefined, specs.bonds_materialSpecularColor_3D, specs.bonds_materialShininess_3D);
      }
      for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
        var b = this.bonds[i];
        if (!isMacro || b.a1.hetatm) {
          // Check if render as segmented pill will used.
          if (specs.bonds_showBondOrders_3D) {
            if (b.bondOrder == 0) {
              // 0 bond order
              asSpheres.push(b);
            } else if (b.bondOrder == 0.5) {
              // 0.5 bond order
              asPills.push(b);
            } else {
              if (b.bondOrder == 1.5) {
                // For 1.5 bond order, the "1" part will render
                // as cylinder, and the "0.5" part will render
                // as segmented pills
                asPills.push(b);
              }
              b.render(gl, specs);
            }
          } else {
            // this will render the Stick representation
            b.render(gl, specs);
          }

        }
      }
      // Render the Half Bond
      if (asPills.length > 0) {
        // if bonds_renderAsLines_3D is true, then lineBuffer will
        // binded.
        // so in here we just need to check if we need to change
        // the binding buffer to pillBuffer or not.
        if (!specs.bonds_renderAsLines_3D) {
          gl.pillBuffer.bindBuffers(gl);
        }
        for ( var i = 0, ii = asPills.length; i < ii; i++) {
          asPills[i].render(gl, specs, true);
        }
      }
      // Render zero bond order
      if (asSpheres.length > 0) {
        // if bonds_renderAsLines_3D is true, then lineBuffer will
        // binded.
        // so in here we just need to check if we need to change
        // the binding buffer to pillBuffer or not.
        if (!specs.bonds_renderAsLines_3D) {
          gl.sphereBuffer.bindBuffers(gl);
        }
        for ( var i = 0, ii = asSpheres.length; i < ii; i++) {
          asSpheres[i].render(gl, specs, true);
        }
      }
    }
    if (specs.atoms_display) {
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        var a = this.atoms[i];
        a.bondNumber = 0;
        a.renderAsStar = false;
      }
      for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
        var b = this.bonds[i];
        b.a1.bondNumber++;
        b.a2.bondNumber++;
      }
      if (this.atoms.length > 0) {
        gl.sphereBuffer.bindBuffers(gl);
        // colors
        gl.material.setTempColors(specs.atoms_materialAmbientColor_3D, undefined, specs.atoms_materialSpecularColor_3D, specs.atoms_materialShininess_3D);
      }
      var asStars = [];
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        var a = this.atoms[i];
        if (!isMacro || (a.hetatm && (specs.macro_showWater || !a.isWater))) {
          if (specs.atoms_nonBondedAsStars_3D && a.bondNumber === 0) {
            a.renderAsStar = true;
            asStars.push(a);
          } else {
            a.render(gl, specs);
          }
        }
      }
      if (asStars.length > 0) {
        gl.starBuffer.bindBuffers(gl);
        for ( var i = 0, ii = asStars.length; i < ii; i++) {
          asStars[i].render(gl, specs);
        }
      }
    }
    if (this.chains) {
      // set up the model view matrix, since it won't be modified
      // for macromolecules
      gl.setMatrixUniforms(gl.modelViewMatrix);
      // render chains
      if (specs.proteins_displayRibbon) {
        // proteins
        // colors
        gl.material.setTempColors(specs.proteins_materialAmbientColor_3D, undefined, specs.proteins_materialSpecularColor_3D, specs.proteins_materialShininess_3D);
        for ( var j = 0, jj = this.ribbons.length; j < jj; j++) {
          if (specs.proteins_useShapelyColors || specs.proteins_useAminoColors || specs.proteins_usePolarityColors) {
            var use = specs.proteins_ribbonCartoonize ? this.cartoons[j] : this.ribbons[j];
            use.front.bindBuffers(gl);
            for ( var i = 0, ii = use.front.segments.length; i < ii; i++) {
              use.front.segments[i].render(gl, specs);
            }
            use.back.bindBuffers(gl);
            for ( var i = 0, ii = use.back.segments.length; i < ii; i++) {
              use.back.segments[i].render(gl, specs);
            }
          } else {
            if (specs.proteins_ribbonCartoonize) {
              var use = this.cartoons[j];
              use.front.bindBuffers(gl);
              for ( var i = 0, ii = use.front.cartoonSegments.length; i < ii; i++) {
                use.front.cartoonSegments[i].render(gl, specs);
              }
              use.back.bindBuffers(gl);
              for ( var i = 0, ii = use.back.cartoonSegments.length; i < ii; i++) {
                use.back.cartoonSegments[i].render(gl, specs);
              }
            } else {
              var use = this.ribbons[j];
              use.front.render(gl, specs);
              use.back.render(gl, specs);
            }
          }
        }
      }
      if (specs.proteins_displayBackbone) {
        if (!this.alphaCarbonTrace) {
          // cache the alpha carbon trace
          this.alphaCarbonTrace = {
            nodes : [],
            edges : []
          };
          for ( var j = 0, jj = this.chains.length; j < jj; j++) {
            var rs = this.chains[j];
            var isNucleotide = rs.length > 2 && RESIDUE[rs[2].name] && RESIDUE[rs[2].name].aminoColor === '#BEA06E';
            if (!isNucleotide && rs.length > 0) {
              for ( var i = 1, ii = rs.length - 2; i < ii; i++) {
                var n = rs[i].cp1;
                n.chainColor = rs.chainColor;
                this.alphaCarbonTrace.nodes.push(n);
                var b = new structures.Bond(rs[i].cp1, rs[i + 1].cp1);
                b.residueName = rs[i].name;
                b.chainColor = rs.chainColor;
                this.alphaCarbonTrace.edges.push(b);
                if (i === rs.length - 3) {
                  n = rs[i + 1].cp1;
                  n.chainColor = rs.chainColor;
                  this.alphaCarbonTrace.nodes.push(n);
                }
              }
            }
          }
        }
        if (this.alphaCarbonTrace.nodes.length > 0) {
          var traceSpecs = new structures.VisualSpecifications();
          traceSpecs.atoms_display = true;
          traceSpecs.bonds_display = true;
          traceSpecs.atoms_sphereDiameter_3D = specs.proteins_backboneThickness;
          traceSpecs.bonds_cylinderDiameter_3D = specs.proteins_backboneThickness;
          traceSpecs.bonds_useJMOLColors = false;
          traceSpecs.atoms_color = specs.proteins_backboneColor;
          traceSpecs.bonds_color = specs.proteins_backboneColor;
          traceSpecs.atoms_useVDWDiameters_3D = false;
          // colors
          gl.material.setTempColors(specs.proteins_materialAmbientColor_3D, undefined, specs.proteins_materialSpecularColor_3D, specs.proteins_materialShininess_3D);
          gl.material.setDiffuseColor(specs.proteins_backboneColor);
          for ( var i = 0, ii = this.alphaCarbonTrace.nodes.length; i < ii; i++) {
            var n = this.alphaCarbonTrace.nodes[i];
            if (specs.macro_colorByChain) {
              traceSpecs.atoms_color = n.chainColor;
            }
            gl.sphereBuffer.bindBuffers(gl);
            n.render(gl, traceSpecs);
          }
          for ( var i = 0, ii = this.alphaCarbonTrace.edges.length; i < ii; i++) {
            var e = this.alphaCarbonTrace.edges[i];
            var color;
            var r = RESIDUE[e.residueName] ? RESIDUE[e.residueName] : RESIDUE['*'];
            if (specs.macro_colorByChain) {
              color = e.chainColor;
            } else if (specs.proteins_useShapelyColors) {
              color = r.shapelyColor;
            } else if (specs.proteins_useAminoColors) {
              color = r.aminoColor;
            } else if (specs.proteins_usePolarityColors) {
              if (r.polar) {
                color = '#C10000';
              } else {
                color = '#FFFFFF';
              }
            }
            if (color) {
              traceSpecs.bonds_color = color;
            }
            gl.cylinderBuffer.bindBuffers(gl);
            e.render(gl, traceSpecs);
          }
        }
      }
      if (specs.nucleics_display) {
        // nucleic acids
        // colors
        gl.material.setTempColors(specs.nucleics_materialAmbientColor_3D, undefined, specs.nucleics_materialSpecularColor_3D, specs.nucleics_materialShininess_3D);
        for ( var j = 0, jj = this.tubes.length; j < jj; j++) {
          gl.setMatrixUniforms(gl.modelViewMatrix);
          var use = this.tubes[j];
          use.render(gl, specs);
        }
      }
    }
    if (specs.crystals_displayUnitCell && this.unitCell) {
      gl.setMatrixUniforms(gl.modelViewMatrix);
      this.unitCell.bindBuffers(gl);
      // colors
      gl.material.setDiffuseColor(specs.crystals_unitCellColor);
      gl.lineWidth(specs.crystals_unitCellLineWidth);
      // render
      gl.drawElements(gl.LINES, this.unitCell.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    if (this.surface && specs.surfaces_display) {
      gl.setMatrixUniforms(gl.modelViewMatrix);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      // gl.enable(gl.BLEND);
      // gl.disable(gl.DEPTH_TEST);
      this.surface.bindBuffers(gl);
      gl.material.setTempColors(specs.surfaces_materialAmbientColor_3D, specs.surfaces_color, specs.surfaces_materialSpecularColor_3D, specs.surfaces_materialShininess_3D);
      // gl.material.setAlpha(.2);
      if (specs.surfaces_style === 'Dot') {
        gl.drawArrays(gl.POINTS, 0, this.surface.vertexPositionBuffer.numItems);
        // } else if (specs.surfaces_style === 'Mesh') {
        // gl.drawElements(gl.LINES,
        // this.surface.vertexIndexBuffer.numItems,
        // gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawElements(gl.TRIANGLES, this.surface.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      }
      // gl.disable(gl.BLEND);
      // gl.enable(gl.DEPTH_TEST);
    }
  };
  _.renderPickFrame = function(gl, specs, objects) {
    if (this.specs) {
      specs = this.specs;
    }
    var isMacro = this.atoms.length > 0 && this.atoms[0].hetatm !== undefined;
    if (specs.bonds_display) {
      if (this.bonds.length > 0) {
        if (specs.bonds_renderAsLines_3D) {
          gl.lineWidth(specs.bonds_width_2D);
          gl.lineBuffer.bindBuffers(gl);
        } else {
          gl.cylinderBuffer.bindBuffers(gl);
        }
      }
      for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
        var b = this.bonds[i];
        if (!isMacro || b.a1.hetatm) {
          gl.material.setDiffuseColor(math.idx2color(objects.length));
          b.renderPicker(gl, specs);
          objects.push(b);
        }
      }
    }
    if (specs.atoms_display) {
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        var a = this.atoms[i];
        a.bondNumber = 0;
        a.renderAsStar = false;
      }
      for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
        var b = this.bonds[i];
        b.a1.bondNumber++;
        b.a2.bondNumber++;
      }
      if (this.atoms.length > 0) {
        gl.sphereBuffer.bindBuffers(gl);
      }
      var asStars = [];
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        var a = this.atoms[i];
        if (!isMacro || (a.hetatm && (specs.macro_showWater || !a.isWater))) {
          if (specs.atoms_nonBondedAsStars_3D && a.bondNumber === 0) {
            a.renderAsStar = true;
            asStars.push(a);
          } else {
            gl.material.setDiffuseColor(math.idx2color(objects.length));
            a.render(gl, specs, true);
            objects.push(a);
          }
        }
      }
      if (asStars.length > 0) {
        gl.starBuffer.bindBuffers(gl);
        for ( var i = 0, ii = asStars.length; i < ii; i++) {
          var a = asStars[i];
          gl.material.setDiffuseColor(math.idx2color(objects.length));
          a.render(gl, specs, true);
          objects.push(a);
        }
      }
    }
  };
  _.getCenter3D = function() {
    if (this.atoms.length === 1) {
      return new structures.Atom('C', this.atoms[0].x, this.atoms[0].y, this.atoms[0].z);
    }
    var minX = Infinity, minY = Infinity, minZ = Infinity;
    var maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    if (this.chains) {
      // residues
      for ( var i = 0, ii = this.chains.length; i < ii; i++) {
        var chain = this.chains[i];
        for ( var j = 0, jj = chain.length; j < jj; j++) {
          var residue = chain[j];
          minX = m.min(residue.cp1.x, residue.cp2.x, minX);
          minY = m.min(residue.cp1.y, residue.cp2.y, minY);
          minZ = m.min(residue.cp1.z, residue.cp2.z, minZ);
          maxX = m.max(residue.cp1.x, residue.cp2.x, maxX);
          maxY = m.max(residue.cp1.y, residue.cp2.y, maxY);
          maxZ = m.max(residue.cp1.z, residue.cp2.z, maxZ);
        }
      }
    }
    for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
      minX = m.min(this.atoms[i].x, minX);
      minY = m.min(this.atoms[i].y, minY);
      minZ = m.min(this.atoms[i].z, minZ);
      maxX = m.max(this.atoms[i].x, maxX);
      maxY = m.max(this.atoms[i].y, maxY);
      maxZ = m.max(this.atoms[i].z, maxZ);
    }
    return new structures.Atom('C', (maxX + minX) / 2, (maxY + minY) / 2, (maxZ + minZ) / 2);
  };
  _.getCenter = function() {
    if (this.atoms.length === 1) {
      return new structures.Point(this.atoms[0].x, this.atoms[0].y);
    }
    var minX = Infinity, minY = Infinity;
    var maxX = -Infinity, maxY = -Infinity;
    for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
      minX = m.min(this.atoms[i].x, minX);
      minY = m.min(this.atoms[i].y, minY);
      maxX = m.max(this.atoms[i].x, maxX);
      maxY = m.max(this.atoms[i].y, maxY);
    }
    return new structures.Point((maxX + minX) / 2, (maxY + minY) / 2);
  };
  _.getDimension = function() {
    if (this.atoms.length === 1) {
      return new structures.Point(0, 0);
    }
    var minX = Infinity, minY = Infinity;
    var maxX = -Infinity, maxY = -Infinity;
    if (this.chains) {
      for ( var i = 0, ii = this.chains.length; i < ii; i++) {
        var chain = this.chains[i];
        for ( var j = 0, jj = chain.length; j < jj; j++) {
          var residue = chain[j];
          minX = m.min(residue.cp1.x, residue.cp2.x, minX);
          minY = m.min(residue.cp1.y, residue.cp2.y, minY);
          maxX = m.max(residue.cp1.x, residue.cp2.x, maxX);
          maxY = m.max(residue.cp1.y, residue.cp2.y, maxY);
        }
      }
      minX -= 30;
      minY -= 30;
      maxX += 30;
      maxY += 30;
    }
    for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
      minX = m.min(this.atoms[i].x, minX);
      minY = m.min(this.atoms[i].y, minY);
      maxX = m.max(this.atoms[i].x, maxX);
      maxY = m.max(this.atoms[i].y, maxY);
    }
    return new structures.Point(maxX - minX, maxY - minY);
  };
  _.check = function(force) {
    // using force improves efficiency, so changes will not be checked
    // until a render occurs
    // you can force a check by sending true to this function after
    // calling check with a false
    if (force && this.doChecks) {
      // only check if the number of bonds has changed
      if (this.findRings) {
        if (this.bonds.length - this.atoms.length !== this.fjNumCache) {
          // find rings
          this.rings = new c.informatics.SSSRFinder(this).rings;
          for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
            this.bonds[i].ring = undefined;
          }
          for ( var i = 0, ii = this.rings.length; i < ii; i++) {
            this.rings[i].setupBonds();
          }
        } else {
          // update rings if any
          for ( var i = 0, ii = this.rings.length; i < ii; i++) {
            var r = this.rings[i];
            r.center = r.getCenter();
          }
        }
      }
      // find lones
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        this.atoms[i].isLone = false;
        if (this.atoms[i].label === 'C') {
          var counter = 0;
          for ( var j = 0, jj = this.bonds.length; j < jj; j++) {
            if (this.bonds[j].a1 === this.atoms[i] || this.bonds[j].a2 === this.atoms[i]) {
              counter++;
            }
          }
          if (counter === 0) {
            this.atoms[i].isLone = true;
          }
        }
      }
      // sort
      var sort = false;
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        if (this.atoms[i].z !== 0) {
          sort = true;
        }
      }
      if (sort) {
        this.sortAtomsByZ();
        this.sortBondsByZ();
      }
      // setup metadata
      this.setupMetaData();
      this.atomNumCache = this.atoms.length;
      this.bondNumCache = this.bonds.length;
      // fj number cache doesnt care if there are separate molecules,
      // as the change will signal a need to check for rings; the
      // accuracy doesn't matter
      this.fjNumCache = this.bonds.length - this.atoms.length;
    }
    this.doChecks = !force;
  };
  _.getAngles = function(a) {
    var angles = [];
    for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
      if (this.bonds[i].contains(a)) {
        angles.push(a.angle(this.bonds[i].getNeighbor(a)));
      }
    }
    angles.sort();
    return angles;
  };
  _.getCoordinationNumber = function(bs) {
    var coordinationNumber = 0;
    for ( var i = 0, ii = bs.length; i < ii; i++) {
      coordinationNumber += bs[i].bondOrder;
    }
    return coordinationNumber;
  };
  _.getBonds = function(a) {
    var bonds = [];
    for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
      if (this.bonds[i].contains(a)) {
        bonds.push(this.bonds[i]);
      }
    }
    return bonds;
  };
  _.sortAtomsByZ = function() {
    for ( var i = 1, ii = this.atoms.length; i < ii; i++) {
      var index = i;
      while (index > 0 && this.atoms[index].z < this.atoms[index - 1].z) {
        var hold = this.atoms[index];
        this.atoms[index] = this.atoms[index - 1];
        this.atoms[index - 1] = hold;
        index--;
      }
    }
  };
  _.sortBondsByZ = function() {
    for ( var i = 1, ii = this.bonds.length; i < ii; i++) {
      var index = i;
      while (index > 0 && (this.bonds[index].a1.z + this.bonds[index].a2.z) < (this.bonds[index - 1].a1.z + this.bonds[index - 1].a2.z)) {
        var hold = this.bonds[index];
        this.bonds[index] = this.bonds[index - 1];
        this.bonds[index - 1] = hold;
        index--;
      }
    }
  };
  _.setupMetaData = function() {
    var center = this.getCenter();
    for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
      var a = this.atoms[i];
      a.bonds = this.getBonds(a);
      a.angles = this.getAngles(a);
      a.isHidden = a.bonds.length === 2 && m.abs(m.abs(a.angles[1] - a.angles[0]) - m.PI) < m.PI / 30 && a.bonds[0].bondOrder === a.bonds[1].bondOrder;
      var angleData = math.angleBetweenLargest(a.angles);
      a.angleOfLeastInterference = angleData.angle % (m.PI * 2);
      a.largestAngle = angleData.largest;
      a.coordinationNumber = this.getCoordinationNumber(a.bonds);
      a.bondNumber = a.bonds.length;
      a.molCenter = center;
    }
    for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
      var b = this.bonds[i];
      b.molCenter = center;
    }
  };
  _.scaleToAverageBondLength = function(length) {
    var avBondLength = this.getAverageBondLength();
    if (avBondLength !== 0) {
      var scale = length / avBondLength;
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        this.atoms[i].x *= scale;
        this.atoms[i].y *= scale;
      }
    }
  };
  _.getAverageBondLength = function() {
    if (this.bonds.length === 0) {
      return 0;
    }
    var tot = 0;
    for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
      tot += this.bonds[i].getLength();
    }
    tot /= this.bonds.length;
    return tot;
  };
  _.getBounds = function() {
    var bounds = new math.Bounds();
    for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
      bounds.expand(this.atoms[i].getBounds());
    }
    if (this.chains) {
      for ( var i = 0, ii = this.chains.length; i < ii; i++) {
        var chain = this.chains[i];
        for ( var j = 0, jj = chain.length; j < jj; j++) {
          var residue = chain[j];
          bounds.expand(residue.cp1.x, residue.cp1.y);
          bounds.expand(residue.cp2.x, residue.cp2.y);
        }
      }
      bounds.minX -= 30;
      bounds.minY -= 30;
      bounds.maxX += 30;
      bounds.maxY += 30;
    }
    return bounds;
  };
  _.getBounds3D = function() {
    var bounds = new math.Bounds();
    for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
      bounds.expand(this.atoms[i].getBounds3D());
    }
    if (this.chains) {
      for ( var i = 0, ii = this.chains.length; i < ii; i++) {
        var chain = this.chains[i];
        for ( var j = 0, jj = chain.length; j < jj; j++) {
          var residue = chain[j];
          bounds.expand3D(residue.cp1.x, residue.cp1.y, residue.cp1.z);
          bounds.expand3D(residue.cp2.x, residue.cp2.y, residue.cp2.z);
        }
      }
    }
    return bounds;
  };

})(ChemDoodle, ChemDoodle.math, ChemDoodle.structures, ChemDoodle.RESIDUE, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(structures, m, m4, v3) {
  'use strict';
  var SB;
  var lastVerticalResolution = -1;

  function setupMatrices(verticalResolution) {
    var n2 = verticalResolution * verticalResolution;
    var n3 = verticalResolution * verticalResolution * verticalResolution;
    var S = [ 6 / n3, 0, 0, 0, 6 / n3, 2 / n2, 0, 0, 1 / n3, 1 / n2, 1 / verticalResolution, 0, 0, 0, 0, 1 ];
    var Bm = [ -1 / 6, 1 / 2, -1 / 2, 1 / 6, 1 / 2, -1, 1 / 2, 0, -1 / 2, 0, 1 / 2, 0, 1 / 6, 2 / 3, 1 / 6, 0 ];
    SB = m4.multiply(Bm, S, []);
    lastVerticalResolution = verticalResolution;
  }

  structures.Residue = function(resSeq) {
    // number of vertical slashes per segment
    this.resSeq = resSeq;
  };
  var _ = structures.Residue.prototype;
  _.setup = function(nextAlpha, horizontalResolution) {
    this.horizontalResolution = horizontalResolution;
    // define plane
    var A = [ nextAlpha.x - this.cp1.x, nextAlpha.y - this.cp1.y, nextAlpha.z - this.cp1.z ];
    var B = [ this.cp2.x - this.cp1.x, this.cp2.y - this.cp1.y, this.cp2.z - this.cp1.z ];
    var C = v3.cross(A, B, []);
    this.D = v3.cross(C, A, []);
    v3.normalize(C);
    v3.normalize(this.D);
    // generate guide coordinates
    // guides for the narrow parts of the ribbons
    this.guidePointsSmall = [];
    // guides for the wide parts of the ribbons
    this.guidePointsLarge = [];
    var P = [ (nextAlpha.x + this.cp1.x) / 2, (nextAlpha.y + this.cp1.y) / 2, (nextAlpha.z + this.cp1.z) / 2 ];
    if (this.helix) {
      // expand helices
      v3.scale(C, 1.5);
      v3.add(P, C);
    }
    this.guidePointsSmall[0] = new structures.Atom('', P[0] - this.D[0] / 2, P[1] - this.D[1] / 2, P[2] - this.D[2] / 2);
    for ( var i = 1; i < horizontalResolution; i++) {
      this.guidePointsSmall[i] = new structures.Atom('', this.guidePointsSmall[0].x + this.D[0] * i / horizontalResolution, this.guidePointsSmall[0].y + this.D[1] * i / horizontalResolution, this.guidePointsSmall[0].z + this.D[2] * i / horizontalResolution);
    }
    v3.scale(this.D, 4);
    this.guidePointsLarge[0] = new structures.Atom('', P[0] - this.D[0] / 2, P[1] - this.D[1] / 2, P[2] - this.D[2] / 2);
    for ( var i = 1; i < horizontalResolution; i++) {
      this.guidePointsLarge[i] = new structures.Atom('', this.guidePointsLarge[0].x + this.D[0] * i / horizontalResolution, this.guidePointsLarge[0].y + this.D[1] * i / horizontalResolution, this.guidePointsLarge[0].z + this.D[2] * i / horizontalResolution);
    }
  };
  _.getGuidePointSet = function(type) {
    if (type === 0) {
      return this.helix || this.sheet ? this.guidePointsLarge : this.guidePointsSmall;
    } else if (type === 1) {
      return this.guidePointsSmall;
    } else if (type === 2) {
      return this.guidePointsLarge;
    }
  };
  _.computeLineSegments = function(b1, a3, a4, doCartoon, verticalResolution) {
    if (verticalResolution !== lastVerticalResolution) {
      setupMatrices(verticalResolution);
    }
    this.split = a3.helix !== this.helix || a3.sheet !== this.sheet;
    this.lineSegments = this.innerCompute(0, b1, a3, a4, false, verticalResolution);
    if (doCartoon) {
      this.lineSegmentsCartoon = this.innerCompute(a3.helix || a3.sheet ? 2 : 1, b1, a3, a4, true, verticalResolution);
    }
  };
  _.innerCompute = function(set, b1, a3, a4, useArrows, verticalResolution) {
    var segments = [];
    var use = this.getGuidePointSet(set);
    var useb1 = b1.getGuidePointSet(set);
    var usea3 = a3.getGuidePointSet(set);
    var usea4 = a4.getGuidePointSet(set);
    for ( var l = 0, ll = this.guidePointsLarge.length; l < ll; l++) {
      var G = [ useb1[l].x, useb1[l].y, useb1[l].z, 1, use[l].x, use[l].y, use[l].z, 1, usea3[l].x, usea3[l].y, usea3[l].z, 1, usea4[l].x, usea4[l].y, usea4[l].z, 1 ];
      var M = m4.multiply(G, SB, []);
      var strand = [];
      for ( var k = 0; k < verticalResolution; k++) {
        for ( var i = 3; i > 0; i--) {
          for ( var j = 0; j < 4; j++) {
            M[i * 4 + j] += M[(i - 1) * 4 + j];
          }
        }
        strand[k] = new structures.Atom('', M[12] / M[15], M[13] / M[15], M[14] / M[15]);
      }
      segments[l] = strand;
    }
    if (useArrows && this.arrow) {
      for ( var i = 0, ii = verticalResolution; i < ii; i++) {
        var mult = 1.5 - 1.3 * i / verticalResolution;
        var mid = m.floor(this.horizontalResolution / 2);
        var center = segments[mid];
        for ( var j = 0, jj = segments.length; j < jj; j++) {
          if (j !== mid) {
            var o = center[i];
            var f = segments[j][i];
            var vec = [ f.x - o.x, f.y - o.y, f.z - o.z ];
            v3.scale(vec, mult);
            f.x = o.x + vec[0];
            f.y = o.y + vec[1];
            f.z = o.z + vec[2];
          }
        }
      }
    }
    return segments;
  };

})(ChemDoodle.structures, Math, mat4, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4402 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-08 14:47:08 -0400 (Sat, 08 Jun 2013) $
//

(function(extensions, structures, math, q, m) {
  'use strict';
  structures.Spectrum = function() {
    this.data = [];
    this.metadata = [];
    this.dataDisplay = [];
    this.memory = {
      offsetTop : 0,
      offsetLeft : 0,
      offsetBottom : 0,
      flipXAxis : false,
      scale : 1,
      width : 0,
      height : 0
    };
  };
  var _ = structures.Spectrum.prototype;
  _.title = undefined;
  _.xUnit = undefined;
  _.yUnit = undefined;
  _.continuous = true;
  _.integrationSensitivity = 0.01;
  _.draw = function(ctx, specs, width, height) {
    if (this.specs) {
      specs = this.specs;
    }
    var offsetTop = 5;
    var offsetLeft = 0;
    var offsetBottom = 0;
    // draw decorations
    ctx.fillStyle = specs.text_color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
    if (this.xUnit) {
      offsetBottom += specs.text_font_size;
      ctx.fillText(this.xUnit, width / 2, height - 2);
    }
    if (this.yUnit && specs.plots_showYAxis) {
      offsetLeft += specs.text_font_size;
      ctx.save();
      ctx.translate(specs.text_font_size, height / 2);
      ctx.rotate(-m.PI / 2);
      ctx.fillText(this.yUnit, 0, 0);
      ctx.restore();
    }
    if (this.title) {
      offsetTop += specs.text_font_size;
      ctx.fillText(this.title, width / 2, specs.text_font_size);
    }
    // draw ticks
    offsetBottom += 5 + specs.text_font_size;
    if (specs.plots_showYAxis) {
      offsetLeft += 5 + ctx.measureText('1000').width;
    }
    if (specs.plots_showGrid) {
      ctx.strokeStyle = specs.plots_gridColor;
      ctx.lineWidth = specs.plots_gridLineWidth;
      ctx.strokeRect(offsetLeft, offsetTop, width - offsetLeft, height - offsetBottom - offsetTop);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var span = this.maxX - this.minX;
    var t = span / 100;
    var major = .001;
    while (major < t || span / major > 25) {
      major *= 10;
    }
    var counter = 0;
    var overlapX = specs.plots_flipXAxis ? width : 0;
    for ( var i = m.round(this.minX / major) * major; i <= this.maxX; i += major / 2) {
      var x = this.getTransformedX(i, specs, width, offsetLeft);
      if (x > offsetLeft) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        if (counter % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(x, height - offsetBottom);
          ctx.lineTo(x, height - offsetBottom + 2);
          ctx.stroke();
          var s = i.toFixed(5);
          while (s.charAt(s.length - 1) === '0') {
            s = s.substring(0, s.length - 1);
          }
          if (s.charAt(s.length - 1) === '.') {
            s = s.substring(0, s.length - 1);
          }
          // do this to avoid label overlap
          var numWidth = ctx.measureText(s).width;
          if (specs.plots_flipXAxis) {
            numWidth *= -1;
          }
          var ls = x - numWidth / 2;
          if (specs.plots_flipXAxis ? ls < overlapX : ls > overlapX) {
            ctx.fillText(s, x, height - offsetBottom + 2);
            overlapX = x + numWidth / 2;
          }
          if (specs.plots_showGrid) {
            ctx.strokeStyle = specs.plots_gridColor;
            ctx.lineWidth = specs.plots_gridLineWidth;
            ctx.beginPath();
            ctx.moveTo(x, height - offsetBottom);
            ctx.lineTo(x, offsetTop);
            ctx.stroke();
          }
        } else {
          ctx.beginPath();
          ctx.moveTo(x, height - offsetBottom);
          ctx.lineTo(x, height - offsetBottom + 2);
          ctx.stroke();
        }
      }
      counter++;
    }
    if (specs.plots_showYAxis || specs.plots_showGrid) {
      var spany = 1 / specs.scale;
      var counter = 0;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for ( var i = 0; i <= 10; i++) {
        var yval = spany / 10 * i;
        var y = offsetTop + (height - offsetBottom - offsetTop) * (1 - yval * specs.scale);
        if (specs.plots_showGrid) {
          ctx.strokeStyle = specs.plots_gridColor;
          ctx.lineWidth = specs.plots_gridLineWidth;
          ctx.beginPath();
          ctx.moveTo(offsetLeft, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        if (specs.plots_showYAxis) {
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(offsetLeft, y);
          ctx.lineTo(offsetLeft - 3, y);
          ctx.stroke();
          var val = yval * 100;
          var cutoff = m.max(0, 3 - m.floor(val).toString().length);
          var s = val.toFixed(cutoff);
          if (cutoff > 0) {
            while (s.charAt(s.length - 1) === '0') {
              s = s.substring(0, s.length - 1);
            }
          }
          if (s.charAt(s.length - 1) === '.') {
            s = s.substring(0, s.length - 1);
          }
          ctx.fillText(s, offsetLeft - 3, y);
        }
      }
    }
    // draw axes
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // draw x axis
    ctx.moveTo(width, height - offsetBottom);
    ctx.lineTo(offsetLeft, height - offsetBottom);
    // draw y axis
    if (specs.plots_showYAxis) {
      ctx.lineTo(offsetLeft, offsetTop);
    }
    ctx.stroke();
    // draw metadata
    if (this.dataDisplay.length > 0) {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      var mcount = 0;
      for ( var i = 0, ii = this.dataDisplay.length; i < ii; i++) {
        if (this.dataDisplay[i].value) {
          ctx.fillText([ this.dataDisplay[i].display, ': ', this.dataDisplay[i].value ].join(''), offsetLeft + 10, offsetTop + 10 + mcount * (specs.text_font_size + 5));
          mcount++;
        } else if (this.dataDisplay[i].tag) {
          for ( var j = 0, jj = this.metadata.length; j < jj; j++) {
            if (extensions.stringStartsWith(this.metadata[j], this.dataDisplay[i].tag)) {
              var draw = this.metadata[j];
              if (this.dataDisplay[i].display) {
                var index = this.metadata[j].indexOf('=');
                draw = [ this.dataDisplay[i].display, ': ', index > -1 ? this.metadata[j].substring(index + 2) : this.metadata[j] ].join('');
              }
              ctx.fillText(draw, offsetLeft + 10, offsetTop + 10 + mcount * (specs.text_font_size + 5));
              mcount++;
              break;
            }
          }
        }
      }
    }
    this.drawPlot(ctx, specs, width, height, offsetTop, offsetLeft, offsetBottom);
    this.memory.offsetTop = offsetTop;
    this.memory.offsetLeft = offsetLeft;
    this.memory.offsetBottom = offsetBottom;
    this.memory.flipXAxis = specs.plots_flipXAxis;
    this.memory.scale = specs.scale;
    this.memory.width = width;
    this.memory.height = height;
  };
  _.drawPlot = function(ctx, specs, width, height, offsetTop, offsetLeft, offsetBottom) {
    if (this.specs) {
      specs = this.specs;
    }
    ctx.strokeStyle = specs.plots_color;
    ctx.lineWidth = specs.plots_width;
    var integration = [];
    ctx.beginPath();
    if (this.continuous) {
      var started = false;
      var counter = 0;
      for ( var i = 0, ii = this.data.length; i < ii; i++) {
        var x = this.getTransformedX(this.data[i].x, specs, width, offsetLeft);
        if (x >= offsetLeft && x < width) {
          var y = this.getTransformedY(this.data[i].y, specs, height, offsetBottom, offsetTop);
          if (specs.plots_showIntegration && m.abs(this.data[i].y) > this.integrationSensitivity) {
            integration.push(new structures.Point(this.data[i].x, this.data[i].y));
          }
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          }
          ctx.lineTo(x, y);
          counter++;
          if (counter % 1000 === 0) {
            // segment the path to avoid crashing safari on mac
            // os x
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
          }
        } else if (started) {
          break;
        }
      }
    } else {
      for ( var i = 0, ii = this.data.length; i < ii; i++) {
        var x = this.getTransformedX(this.data[i].x, specs, width, offsetLeft);
        if (x >= offsetLeft && x < width) {
          ctx.moveTo(x, height - offsetBottom);
          ctx.lineTo(x, this.getTransformedY(this.data[i].y, specs, height, offsetBottom, offsetTop));
        }
      }
    }
    ctx.stroke();
    if (specs.plots_showIntegration && integration.length > 1) {
      ctx.strokeStyle = specs.plots_integrationColor;
      ctx.lineWidth = specs.plots_integrationLineWidth;
      ctx.beginPath();
      var ascending = integration[1].x > integration[0].x;
      var max;
      if (this.flipXAxis && !ascending || !this.flipXAxis && ascending) {
        for ( var i = integration.length - 2; i >= 0; i--) {
          integration[i].y = integration[i].y + integration[i + 1].y;
        }
        max = integration[0].y;
      } else {
        for ( var i = 1, ii = integration.length; i < ii; i++) {
          integration[i].y = integration[i].y + integration[i - 1].y;
        }
        max = integration[integration.length - 1].y;
      }
      for ( var i = 0, ii = integration.length; i < ii; i++) {
        var x = this.getTransformedX(integration[i].x, specs, width, offsetLeft);
        var y = this.getTransformedY(integration[i].y / specs.scale / max, specs, height, offsetBottom, offsetTop);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  };
  _.getTransformedY = function(y, specs, height, offsetBottom, offsetTop) {
    return offsetTop + (height - offsetBottom - offsetTop) * (1 - y * specs.scale);
  };
  _.getInverseTransformedY = function(y) {
    // can only be called after a render when memory is set, this
    // function doesn't make sense without a render first anyway
    return (1 - (y - this.memory.offsetTop) / (this.memory.height - this.memory.offsetBottom - this.memory.offsetTop)) / this.memory.scale * 100;
  };
  _.getTransformedX = function(x, specs, width, offsetLeft) {
    var returning = offsetLeft + (x - this.minX) / (this.maxX - this.minX) * (width - offsetLeft);
    if (specs.plots_flipXAxis) {
      returning = width + offsetLeft - returning;
    }
    return returning;
  };
  _.getInverseTransformedX = function(x) {
    // can only be called after a render when memory is set, this
    // function doesn't make sense without a render first anyway
    if (this.memory.flipXAxis) {
      x = this.memory.width + this.memory.offsetLeft - x;
    }
    return (x - this.memory.offsetLeft) * (this.maxX - this.minX) / (this.memory.width - this.memory.offsetLeft) + this.minX;
  };
  _.setup = function() {
    var xmin = Number.MAX_VALUE;
    var xmax = Number.MIN_VALUE;
    var ymax = Number.MIN_VALUE;
    for ( var i = 0, ii = this.data.length; i < ii; i++) {
      xmin = m.min(xmin, this.data[i].x);
      xmax = m.max(xmax, this.data[i].x);
      ymax = m.max(ymax, this.data[i].y);
    }
    if (this.continuous) {
      this.minX = xmin;
      this.maxX = xmax;
    } else {
      this.minX = xmin - 1;
      this.maxX = xmax + 1;
    }
    for ( var i = 0, ii = this.data.length; i < ii; i++) {
      this.data[i].y /= ymax;
    }
  };
  _.zoom = function(pixel1, pixel2, width, rescaleY) {
    var p1 = this.getInverseTransformedX(pixel1);
    var p2 = this.getInverseTransformedX(pixel2);
    this.minX = m.min(p1, p2);
    this.maxX = m.max(p1, p2);
    if (rescaleY) {
      var ymax = Number.MIN_VALUE;
      for ( var i = 0, ii = this.data.length; i < ii; i++) {
        if (math.isBetween(this.data[i].x, this.minX, this.maxX)) {
          ymax = m.max(ymax, this.data[i].y);
        }
      }
      return 1 / ymax;
    }
  };
  _.translate = function(dif, width) {
    var dist = dif / (width - this.memory.offsetLeft) * (this.maxX - this.minX) * (this.memory.flipXAxis ? 1 : -1);
    this.minX += dist;
    this.maxX += dist;
  };
  _.alertMetadata = function() {
    alert(this.metadata.join('\n'));
  };
  _.getInternalCoordinates = function(x, y) {
    return new ChemDoodle.structures.Point(this.getInverseTransformedX(x), this.getInverseTransformedY(y));
  };
  _.getClosestPlotInternalCoordinates = function(x) {
    var xtl = this.getInverseTransformedX(x - 1);
    var xtr = this.getInverseTransformedX(x + 1);
    if (xtl > xtr) {
      var temp = xtl;
      xtl = xtr;
      xtr = temp;
    }
    var highest = -1;
    var max = -Infinity;
    var inRange = false;
    for ( var i = 0, ii = this.data.length; i < ii; i++) {
      var p = this.data[i];
      if (math.isBetween(p.x, xtl, xtr)) {
        if (p.y > max) {
          inRange = true;
          max = p.y;
          highest = i;
        }
      } else if (inRange) {
        break;
      }
    }
    if (highest === -1) {
      return undefined;
    }
    var p = this.data[highest];
    return new ChemDoodle.structures.Point(p.x, p.y * 100);
  };
  _.getClosestPeakInternalCoordinates = function(x) {
    var xt = this.getInverseTransformedX(x);
    var closest = 0;
    var dif = Infinity;
    for ( var i = 0, ii = this.data.length; i < ii; i++) {
      var sub = m.abs(this.data[i].x - xt);
      if (sub <= dif) {
        dif = sub;
        closest = i;
      } else {
        break;
      }
    }
    var highestLeft = highestRight = closest;
    var maxLeft = maxRight = this.data[closest].y;
    for ( var i = closest + 1, ii = this.data.length; i < ii; i++) {
      if (this.data[i].y + .05 > maxRight) {
        maxRight = this.data[i].y;
        highestRight = i;
      } else {
        break;
      }
    }
    for ( var i = closest - 1; i >= 0; i--) {
      if (this.data[i].y + .05 > maxLeft) {
        maxLeft = this.data[i].y;
        highestLeft = i;
      } else {
        break;
      }
    }
    var p = this.data[highestLeft - closest > highestRight - closest ? highestRight : highestLeft];
    return new ChemDoodle.structures.Point(p.x, p.y * 100);
  };

})(ChemDoodle.extensions, ChemDoodle.structures, ChemDoodle.math, jQuery, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3385 $
//  $Author: kevin $
//  $LastChangedDate: 2011-09-18 11:40:07 -0400 (Sun, 18 Sep 2011) $
//

(function(math, d2, m) {
  'use strict';
  d2._Shape = function() {
  };
  var _ = d2._Shape.prototype;
  _.drawDecorations = function(ctx, specs) {
    if (this.isHover) {
      var ps = this.getPoints();
      for ( var i = 0, ii = ps.length; i < ii; i++) {
        var p = ps[i];
        this.drawAnchor(ctx, specs, p, p === this.hoverPoint);
      }
    }
  };
  _.getBounds = function() {
    var bounds = new math.Bounds();
    var ps = this.getPoints();
    for ( var i = 0, ii = ps.length; i < ii; i++) {
      var p = ps[i];
      bounds.expand(p.x, p.y);
    }
    return bounds;
  };
  _.drawAnchor = function(ctx, specs, p, hovered) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(m.PI / 4);
    ctx.scale(1 / specs.scale, 1 / specs.scale);
    var boxRadius = 4;
    var innerRadius = boxRadius / 2;

    ctx.beginPath();
    ctx.moveTo(-boxRadius, -boxRadius);
    ctx.lineTo(boxRadius, -boxRadius);
    ctx.lineTo(boxRadius, boxRadius);
    ctx.lineTo(-boxRadius, boxRadius);
    ctx.closePath();
    if (hovered) {
      ctx.fillStyle = '#885110';
    } else {
      ctx.fillStyle = 'white';
    }
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-boxRadius, -innerRadius);
    ctx.lineTo(-boxRadius, -boxRadius);
    ctx.lineTo(-innerRadius, -boxRadius);
    ctx.moveTo(innerRadius, -boxRadius);
    ctx.lineTo(boxRadius, -boxRadius);
    ctx.lineTo(boxRadius, -innerRadius);
    ctx.moveTo(boxRadius, innerRadius);
    ctx.lineTo(boxRadius, boxRadius);
    ctx.lineTo(innerRadius, boxRadius);
    ctx.moveTo(-innerRadius, boxRadius);
    ctx.lineTo(-boxRadius, boxRadius);
    ctx.lineTo(-boxRadius, innerRadius);
    ctx.moveTo(-boxRadius, -innerRadius);

    ctx.strokeStyle = 'rgba(0,0,0,.2)';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };

})(ChemDoodle.math, ChemDoodle.structures.d2, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3462 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-05 15:33:29 -0500 (Thu, 05 Jan 2012) $
//

(function(extensions, math, structures, d2, m) {
  'use strict';
  d2.Bracket = function(p1, p2) {
    this.p1 = p1 ? p1 : new structures.Point();
    this.p2 = p2 ? p2 : new structures.Point();
  };
  var _ = d2.Bracket.prototype = new d2._Shape();
  _.charge = 0;
  _.mult = 0;
  _.repeat = 0;
  _.draw = function(ctx, specs) {
    var minX = m.min(this.p1.x, this.p2.x);
    var maxX = m.max(this.p1.x, this.p2.x);
    var minY = m.min(this.p1.y, this.p2.y);
    var maxY = m.max(this.p1.y, this.p2.y);
    var w = maxX - minX;
    var h = maxY - minY;
    var lip = h / 10;
    ctx.beginPath();
    ctx.moveTo(minX + lip, minY);
    ctx.lineTo(minX, minY);
    ctx.lineTo(minX, maxY);
    ctx.lineTo(minX + lip, maxY);
    ctx.moveTo(maxX - lip, maxY);
    ctx.lineTo(maxX, maxY);
    ctx.lineTo(maxX, minY);
    ctx.lineTo(maxX - lip, minY);
    if (this.isLassoed) {
      var grd = ctx.createLinearGradient(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
      grd.addColorStop(0, 'rgba(212, 99, 0, 0)');
      grd.addColorStop(0.5, 'rgba(212, 99, 0, 0.8)');
      grd.addColorStop(1, 'rgba(212, 99, 0, 0)');
      ctx.lineWidth = specs.shapes_lineWidth_2D + 5;
      ctx.strokeStyle = grd;
      ctx.lineJoin = 'miter';
      ctx.lineCap = 'square';
      ctx.stroke();
    }
    ctx.strokeStyle = specs.shapes_color;
    ctx.lineWidth = specs.shapes_lineWidth_2D;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.stroke();
    if (this.charge !== 0) {
      ctx.fillStyle = specs.text_color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
      var s = this.charge.toFixed(0);
      if (s === '1') {
        s = '+';
      } else if (s === '-1') {
        s = '\u2013';
      } else if (extensions.stringStartsWith(s, '-')) {
        s = s.substring(1) + '\u2013';
      } else {
        s += '+';
      }
      ctx.fillText(s, maxX + 5, minY + 5);
    }
    if (this.mult !== 0) {
      ctx.fillStyle = specs.text_color;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
      ctx.fillText(this.mult.toFixed(0), minX - 5, minY + h / 2);
    }
    if (this.repeat !== 0) {
      ctx.fillStyle = specs.text_color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
      var s = this.repeat.toFixed(0);
      ctx.fillText(s, maxX + 5, maxY - 5);
    }
  };
  _.getPoints = function() {
    return [ this.p1, this.p2 ];
  };
  _.isOver = function(p, barrier) {
    return math.isBetween(p.x, this.p1.x, this.p2.x) && math.isBetween(p.y, this.p1.y, this.p2.y);
  };

})(ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3462 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-05 15:33:29 -0500 (Thu, 05 Jan 2012) $
//

(function(math, structures, d2, m) {
  'use strict';
  d2.Line = function(p1, p2) {
    this.p1 = p1 ? p1 : new structures.Point();
    this.p2 = p2 ? p2 : new structures.Point();
  };
  d2.Line.ARROW_SYNTHETIC = 'synthetic';
  d2.Line.ARROW_RETROSYNTHETIC = 'retrosynthetic';
  d2.Line.ARROW_RESONANCE = 'resonance';
  d2.Line.ARROW_EQUILIBRIUM = 'equilibrium';
  var _ = d2.Line.prototype = new d2._Shape();
  _.arrowType = undefined;
  _.topText = undefined;
  _.bottomText = undefined;
  _.draw = function(ctx, specs) {
    if (this.isLassoed) {
      var grd = ctx.createLinearGradient(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
      grd.addColorStop(0, 'rgba(212, 99, 0, 0)');
      grd.addColorStop(0.5, 'rgba(212, 99, 0, 0.8)');
      grd.addColorStop(1, 'rgba(212, 99, 0, 0)');
      var useDist = 2.5;
      var perpendicular = this.p1.angle(this.p2) + m.PI / 2;
      var mcosp = m.cos(perpendicular);
      var msinp = m.sin(perpendicular);
      var cx1 = this.p1.x - mcosp * useDist;
      var cy1 = this.p1.y + msinp * useDist;
      var cx2 = this.p1.x + mcosp * useDist;
      var cy2 = this.p1.y - msinp * useDist;
      var cx3 = this.p2.x + mcosp * useDist;
      var cy3 = this.p2.y - msinp * useDist;
      var cx4 = this.p2.x - mcosp * useDist;
      var cy4 = this.p2.y + msinp * useDist;
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(cx1, cy1);
      ctx.lineTo(cx2, cy2);
      ctx.lineTo(cx3, cy3);
      ctx.lineTo(cx4, cy4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = specs.shapes_color;
    ctx.fillStyle = specs.shapes_color;
    ctx.lineWidth = specs.shapes_lineWidth_2D;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    if (this.p1.x !== this.p2.x || this.p1.y !== this.p2.y) {
      // only render if the points are different, otherwise this will
      // cause fill overflows
      if (this.arrowType === d2.Line.ARROW_RETROSYNTHETIC) {
        var r2 = m.sqrt(2) * 2;
        var useDist = specs.shapes_arrowLength_2D / r2;
        var angle = this.p1.angle(this.p2);
        var perpendicular = angle + m.PI / 2;
        var retract = specs.shapes_arrowLength_2D / r2;
        var mcosa = m.cos(angle);
        var msina = m.sin(angle);
        var mcosp = m.cos(perpendicular);
        var msinp = m.sin(perpendicular);
        var cx1 = this.p1.x - mcosp * useDist;
        var cy1 = this.p1.y + msinp * useDist;
        var cx2 = this.p1.x + mcosp * useDist;
        var cy2 = this.p1.y - msinp * useDist;
        var cx3 = this.p2.x + mcosp * useDist - mcosa * retract;
        var cy3 = this.p2.y - msinp * useDist + msina * retract;
        var cx4 = this.p2.x - mcosp * useDist - mcosa * retract;
        var cy4 = this.p2.y + msinp * useDist + msina * retract;
        var ax1 = this.p2.x + mcosp * useDist * 2 - mcosa * retract * 2;
        var ay1 = this.p2.y - msinp * useDist * 2 + msina * retract * 2;
        var ax2 = this.p2.x - mcosp * useDist * 2 - mcosa * retract * 2;
        var ay2 = this.p2.y + msinp * useDist * 2 + msina * retract * 2;
        ctx.beginPath();
        ctx.moveTo(cx2, cy2);
        ctx.lineTo(cx3, cy3);
        ctx.moveTo(ax1, ay1);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.lineTo(ax2, ay2);
        ctx.moveTo(cx4, cy4);
        ctx.lineTo(cx1, cy1);
        ctx.stroke();
      } else if (this.arrowType === d2.Line.ARROW_EQUILIBRIUM) {
        var r2 = m.sqrt(2) * 2;
        var useDist = specs.shapes_arrowLength_2D / r2 / 2;
        var angle = this.p1.angle(this.p2);
        var perpendicular = angle + m.PI / 2;
        var retract = specs.shapes_arrowLength_2D * 2 / m.sqrt(3);
        var mcosa = m.cos(angle);
        var msina = m.sin(angle);
        var mcosp = m.cos(perpendicular);
        var msinp = m.sin(perpendicular);
        var cx1 = this.p1.x - mcosp * useDist;
        var cy1 = this.p1.y + msinp * useDist;
        var cx2 = this.p1.x + mcosp * useDist;
        var cy2 = this.p1.y - msinp * useDist;
        var cx3 = this.p2.x + mcosp * useDist;
        var cy3 = this.p2.y - msinp * useDist;
        var cx4 = this.p2.x - mcosp * useDist;
        var cy4 = this.p2.y + msinp * useDist;
        ctx.beginPath();
        ctx.moveTo(cx2, cy2);
        ctx.lineTo(cx3, cy3);
        ctx.moveTo(cx4, cy4);
        ctx.lineTo(cx1, cy1);
        ctx.stroke();
        // right arrow
        var rx1 = cx3 - mcosa * retract * .8;
        var ry1 = cy3 + msina * retract * .8;
        var ax1 = cx3 + mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
        var ay1 = cy3 - msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
        ctx.beginPath();
        ctx.moveTo(cx3, cy3);
        ctx.lineTo(ax1, ay1);
        ctx.lineTo(rx1, ry1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // left arrow
        rx1 = cx1 + mcosa * retract * .8;
        ry1 = cy1 - msina * retract * .8;
        ax1 = cx1 - mcosp * specs.shapes_arrowLength_2D / 3 + mcosa * retract;
        ay1 = cy1 + msinp * specs.shapes_arrowLength_2D / 3 - msina * retract;
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(ax1, ay1);
        ctx.lineTo(rx1, ry1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (this.arrowType === d2.Line.ARROW_SYNTHETIC) {
        var angle = this.p1.angle(this.p2);
        var perpendicular = angle + m.PI / 2;
        var retract = specs.shapes_arrowLength_2D * 2 / m.sqrt(3);
        var mcosa = m.cos(angle);
        var msina = m.sin(angle);
        var mcosp = m.cos(perpendicular);
        var msinp = m.sin(perpendicular);
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x - mcosa * retract / 2, this.p2.y + msina * retract / 2);
        ctx.stroke();
        var rx1 = this.p2.x - mcosa * retract * .8;
        var ry1 = this.p2.y + msina * retract * .8;
        var ax1 = this.p2.x + mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
        var ay1 = this.p2.y - msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
        var ax2 = this.p2.x - mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
        var ay2 = this.p2.y + msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
        ctx.beginPath();
        ctx.moveTo(this.p2.x, this.p2.y);
        ctx.lineTo(ax2, ay2);
        ctx.lineTo(rx1, ry1);
        ctx.lineTo(ax1, ay1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (this.arrowType === d2.Line.ARROW_RESONANCE) {
        var angle = this.p1.angle(this.p2);
        var perpendicular = angle + m.PI / 2;
        var retract = specs.shapes_arrowLength_2D * 2 / m.sqrt(3);
        var mcosa = m.cos(angle);
        var msina = m.sin(angle);
        var mcosp = m.cos(perpendicular);
        var msinp = m.sin(perpendicular);
        ctx.beginPath();
        ctx.moveTo(this.p1.x + mcosa * retract / 2, this.p1.y - msina * retract / 2);
        ctx.lineTo(this.p2.x - mcosa * retract / 2, this.p2.y + msina * retract / 2);
        ctx.stroke();
        // right arrow
        var rx1 = this.p2.x - mcosa * retract * .8;
        var ry1 = this.p2.y + msina * retract * .8;
        var ax1 = this.p2.x + mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
        var ay1 = this.p2.y - msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
        var ax2 = this.p2.x - mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
        var ay2 = this.p2.y + msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
        ctx.beginPath();
        ctx.moveTo(this.p2.x, this.p2.y);
        ctx.lineTo(ax2, ay2);
        ctx.lineTo(rx1, ry1);
        ctx.lineTo(ax1, ay1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // left arrow
        rx1 = this.p1.x + mcosa * retract * .8;
        ry1 = this.p1.y - msina * retract * .8;
        ax1 = this.p1.x - mcosp * specs.shapes_arrowLength_2D / 3 + mcosa * retract;
        ay1 = this.p1.y + msinp * specs.shapes_arrowLength_2D / 3 - msina * retract;
        ax2 = this.p1.x + mcosp * specs.shapes_arrowLength_2D / 3 + mcosa * retract;
        ay2 = this.p1.y - msinp * specs.shapes_arrowLength_2D / 3 - msina * retract;
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(ax2, ay2);
        ctx.lineTo(rx1, ry1);
        ctx.lineTo(ax1, ay1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
      }
      if(this.topText){
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(this.topText, (this.p1.x+this.p2.x)/2, this.p1.y-5);
      }
      if(this.bottomText){
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(this.bottomText, (this.p1.x+this.p2.x)/2, this.p1.y+5);
      }
    }
  };
  _.getPoints = function() {
    return [ this.p1, this.p2 ];
  };
  _.isOver = function(p, barrier) {
    var dist = math.distanceFromPointToLineInclusive(p, this.p1, this.p2);
    return dist !== -1 && dist < barrier;
  };

})(ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3462 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-05 15:33:29 -0500 (Thu, 05 Jan 2012) $
//

(function(math, jsb, structures, d2, m) {
  'use strict';
  var getPossibleAngles = function(o) {
    var as = [];
    if (o instanceof structures.Atom) {
      if (o.bondNumber === 0) {
        as.push(m.PI);
      } else if (o.angles) {
        if (o.angles.length === 1) {
          as.push(o.angles[0] + m.PI);
        } else {
          for ( var i = 1, ii = o.angles.length; i < ii; i++) {
            as.push(o.angles[i - 1] + (o.angles[i] - o.angles[i - 1]) / 2);
          }
          var firstIncreased = o.angles[0] + m.PI * 2;
          var last = o.angles[o.angles.length - 1];
          as.push(last + (firstIncreased - last) / 2);
        }
        if (o.largestAngle > m.PI) {
          // always use angle of least interfearence if it is greater
          // than 120
          as = [ o.angleOfLeastInterference ];
        }
        if (o.bonds) {
          // point up towards a carbonyl
          for ( var i = 0, ii = o.bonds.length; i < ii; i++) {
            var b = o.bonds[i];
            if (b.bondOrder === 2) {
              var n = b.getNeighbor(o);
              if (n.label === 'O') {
                as = [ n.angle(o) ];
                break;
              }
            }
          }
        }
      }
    } else {
      var angle = o.a1.angle(o.a2);
      as.push(angle + m.PI / 2);
      as.push(angle + 3 * m.PI / 2);
    }
    for ( var i = 0, ii = as.length; i < ii; i++) {
      while (as[i] > m.PI * 2) {
        as[i] -= m.PI * 2;
      }
      while (as[i] < 0) {
        as[i] += m.PI * 2;
      }
    }
    return as;
  };
  var getPullBack = function(o, specs) {
    var pullback = 3;
    if (o instanceof structures.Atom) {
      if (o.isLabelVisible(specs)) {
        pullback = 8;
      }
      if (o.charge !== 0 || o.numRadical !== 0 || o.numLonePair !== 0) {
        pullback = 13;
      }
    } else if (o instanceof structures.Point) {
      // this is the midpoint of a bond forming pusher
      pullback = 0;
    } else {
      if (o.bondOrder > 1) {
        pullback = 5;
      }
    }
    return pullback;
  };
  var drawPusher = function(ctx, specs, o1, o2, p1, c1, c2, p2, numElectron, caches) {
    var angle1 = c1.angle(p1);
    var angle2 = c2.angle(p2);
    var perpendicular = angle1 + m.PI / 2;
    var mcosa = m.cos(angle1);
    var msina = m.sin(angle1);
    // pull back from start
    var pullBack = getPullBack(o1, specs);
    p1.x -= mcosa * pullBack;
    p1.y += msina * pullBack;
    // arrow
    var perpendicular = angle2 + m.PI / 2;
    var retract = specs.shapes_arrowLength_2D * 2 / m.sqrt(3);
    var mcosa = m.cos(angle2);
    var msina = m.sin(angle2);
    var mcosp = m.cos(perpendicular);
    var msinp = m.sin(perpendicular);
    p2.x -= mcosa * 5;
    p2.y += msina * 5;
    var nap = new structures.Point(p2.x, p2.y);
    // pull back from end
    pullBack = getPullBack(o2, specs) / 3;
    nap.x -= mcosa * pullBack;
    nap.y += msina * pullBack;
    p2.x -= mcosa * (retract * 0.8 + pullBack);
    p2.y += msina * (retract * 0.8 + pullBack);
    var rx1 = nap.x - mcosa * retract * 0.8;
    var ry1 = nap.y + msina * retract * 0.8;
    var a1 = new structures.Point(nap.x + mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract, nap.y - msinp * specs.shapes_arrowLength_2D / 3 + msina * retract);
    var a2 = new structures.Point(nap.x - mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract, nap.y + msinp * specs.shapes_arrowLength_2D / 3 + msina * retract);
    var include1 = true, include2 = true;
    if (numElectron === 1) {
      if (a1.distance(c1) > a2.distance(c1)) {
        include2 = false;
      } else {
        include1 = false;
      }
    }
    ctx.beginPath();
    ctx.moveTo(nap.x, nap.y);
    if (include2) {
      ctx.lineTo(a2.x, a2.y);
    }
    ctx.lineTo(rx1, ry1);
    if (include1) {
      ctx.lineTo(a1.x, a1.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // bezier
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
    ctx.stroke();
    caches.push([ p1, c1, c2, p2 ]);
  };

  d2.Pusher = function(o1, o2, numElectron) {
    this.o1 = o1;
    this.o2 = o2;
    this.numElectron = numElectron ? numElectron : 1;
  };
  var _ = d2.Pusher.prototype = new d2._Shape();
  _.drawDecorations = function(ctx, specs) {
    if (this.isHover) {
      var p1 = this.o1 instanceof structures.Atom ? new structures.Point(this.o1.x, this.o1.y) : this.o1.getCenter();
      var p2 = this.o2 instanceof structures.Atom ? new structures.Point(this.o2.x, this.o2.y) : this.o2.getCenter();
      var ps = [ p1, p2 ];
      for ( var i = 0, ii = ps.length; i < ii; i++) {
        var p = ps[i];
        this.drawAnchor(ctx, specs, p, p === this.hoverPoint);
      }
    }
  };
  _.draw = function(ctx, specs) {
    if (this.o1 && this.o2) {
      ctx.strokeStyle = specs.shapes_color;
      ctx.fillStyle = specs.shapes_color;
      ctx.lineWidth = specs.shapes_lineWidth_2D;
      ctx.lineJoin = 'miter';
      ctx.lineCap = 'butt';
      var p1 = this.o1 instanceof structures.Atom ? new structures.Point(this.o1.x, this.o1.y) : this.o1.getCenter();
      var p2 = this.o2 instanceof structures.Atom ? new structures.Point(this.o2.x, this.o2.y) : this.o2.getCenter();
      var controlDist = 35;
      var as1 = getPossibleAngles(this.o1);
      var as2 = getPossibleAngles(this.o2);
      var c1, c2;
      var minDif = Infinity;
      for ( var i = 0, ii = as1.length; i < ii; i++) {
        for ( var j = 0, jj = as2.length; j < jj; j++) {
          var c1c = new structures.Point(p1.x + controlDist * m.cos(as1[i]), p1.y - controlDist * m.sin(as1[i]));
          var c2c = new structures.Point(p2.x + controlDist * m.cos(as2[j]), p2.y - controlDist * m.sin(as2[j]));
          var dif = c1c.distance(c2c);
          if (dif < minDif) {
            minDif = dif;
            c1 = c1c;
            c2 = c2c;
          }
        }
      }
      this.caches = [];
      if (this.numElectron === -1) {
        var dist = p1.distance(p2)/2;
        var angle = p1.angle(p2);
        var perp = angle+m.PI/2;
        var mcosa = m.cos(angle);
        var msina = m.sin(angle);
        var m1 = new structures.Point(p1.x+(dist-1)*mcosa, p1.y-(dist-1)*msina);
        var cm1 = new structures.Point(m1.x+m.cos(perp+m.PI/6)*controlDist, m1.y - m.sin(perp+m.PI/6)*controlDist);
        var m2 = new structures.Point(p1.x+(dist+1)*mcosa, p1.y-(dist+1)*msina);
        var cm2 = new structures.Point(m2.x+m.cos(perp-m.PI/6)*controlDist, m2.y - m.sin(perp-m.PI/6)*controlDist);
        drawPusher(ctx, specs, this.o1, m1, p1, c1, cm1, m1, 1, this.caches);
        drawPusher(ctx, specs, this.o2, m2, p2, c2, cm2, m2, 1, this.caches);
      } else {
        if (math.intersectLines(p1.x, p1.y, c1.x, c1.y, p2.x, p2.y, c2.x, c2.y)) {
          var tmp = c1;
          c1 = c2;
          c2 = tmp;
        }
        // try to clean up problems, like loops
        var angle1 = c1.angle(p1);
        var angle2 = c2.angle(p2);
        var angleDif = (m.max(angle1, angle2) - m.min(angle1, angle2));
        if (m.abs(angleDif - m.PI) < .001 && this.o1.molCenter === this.o2.molCenter) {
          // in the case where the control tangents are parallel
          angle1 += m.PI / 2;
          angle2 -= m.PI / 2;
          c1.x = p1.x + controlDist * m.cos(angle1 + m.PI);
          c1.y = p1.y - controlDist * m.sin(angle1 + m.PI);
          c2.x = p2.x + controlDist * m.cos(angle2 + m.PI);
          c2.y = p2.y - controlDist * m.sin(angle2 + m.PI);
        }
        drawPusher(ctx, specs, this.o1, this.o2, p1, c1, c2, p2, this.numElectron, this.caches);
      }
    }
  };
  _.getPoints = function() {
    return [];
  };
  _.isOver = function(p, barrier) {
    for ( var i = 0, ii = this.caches.length; i < ii; i++) {
      var r = jsb.distanceFromCurve(p, this.caches[i]);
      if (r.distance < barrier) {
        return true;
      }
    }
    return false;
  };

})(ChemDoodle.math, ChemDoodle.math.jsBezier, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3385 $
//  $Author: kevin $
//  $LastChangedDate: 2011-09-18 11:40:07 -0400 (Sun, 18 Sep 2011) $
//

(function(d3, m) {
  'use strict';
  d3._Mesh = function() {
  };
  var _ = d3._Mesh.prototype;
  _.storeData = function(positionData, normalData, indexData) {
    this.positionData = positionData;
    this.normalData = normalData;
    this.indexData = indexData;
  };
  _.setupBuffers = function(gl) {
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionData), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = this.positionData.length / 3;

    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = this.normalData.length / 3;

    if (this.indexData) {
      this.vertexIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), gl.STATIC_DRAW);
      this.vertexIndexBuffer.itemSize = 1;
      this.vertexIndexBuffer.numItems = this.indexData.length;
    }

    if (this.partitions) {
      for ( var i = 0, ii = this.partitions.length; i < ii; i++) {
        var p = this.partitions[i];
        var buffers = this.generateBuffers(gl, p.positionData, p.normalData, p.indexData);
        p.vertexPositionBuffer = buffers[0];
        p.vertexNormalBuffer = buffers[1];
        p.vertexIndexBuffer = buffers[2];
      }
    }
  };
  _.generateBuffers = function(gl, positionData, normalData, indexData) {
    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = positionData.length / 3;

    var vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
    vertexNormalBuffer.itemSize = 3;
    vertexNormalBuffer.numItems = normalData.length / 3;

    var vertexIndexBuffer;
    if (indexData) {
      vertexIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
      vertexIndexBuffer.itemSize = 1;
      vertexIndexBuffer.numItems = indexData.length;
    }

    return [ vertexPositionBuffer, vertexNormalBuffer, vertexIndexBuffer ];
  };
  _.bindBuffers = function(gl) {
    if (!this.vertexPositionBuffer) {
      this.setupBuffers(gl);
    }
    // positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(gl.shader.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // normals
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.vertexAttribPointer(gl.shader.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    if (this.vertexIndexBuffer) {
      // indexes
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    }
  };

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, m) {
  'use strict';
  d3.Arrow = function(radius, longitudeBands) {
    var positionData = [];
    var normalData = [];

    for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      var theta = longNumber * 2 * m.PI / longitudeBands;
      var sinTheta = m.sin(theta);
      var cosTheta = m.cos(theta);

      var x = cosTheta;
      var y = sinTheta;
      var z = 0;

      normalData.push(
      // base cylinder
      0, 0, -1, 0, 0, -1,
      // cylinder
      x, y, 0, x, y, 0,
      // base cone
      0, 0, -1, 0, 0, -1,
      // cone
      x, y, 1, x, y, 1);

      positionData.push(
      // base cylinder
      0, 0, 0, radius * x, radius * y, 0,
      // cylinder
      radius * x, radius * y, 0, radius * x, radius * y, 2,
      // base cone
      radius * x, radius * y, 2, radius * x * 2, radius * y * 2, 2,
      // cone
      radius * x * 2, radius * y * 2, 2, 0, 0, 3);
    }

    var indexData = [];
    for ( var i = 0; i < longitudeBands; i++) {
      var offset = i * 8;
      for ( var j = 0, jj = 7; j < jj; j++) {
        var first = j + offset;
        var second = first + 1;
        var third = first + jj + 2;
        var forth = third - 1;
        indexData.push(first, third, second, third, first, forth);
      }
    }

    this.storeData(positionData, normalData, indexData);
  };
  var _ = d3.Arrow.prototype = new d3._Mesh();
  _.getLength = function() {
    return 3;
  };

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, m, m4) {
  'use strict';
  d3.Compass = function(gl, specs) {
    // setup text X Y Z
    this.textImage = new d3.TextImage();
    this.textImage.init(gl);
    this.textImage.updateFont(gl, specs.text_font_size, specs.text_font_families, specs.text_font_bold, specs.text_font_italic, specs.text_font_stroke_3D);

    this.textMesh = new d3.TextMesh();
    this.textMesh.init(gl);

    var screenRatioHeight = specs.compass_size_3D / gl.canvas.clientHeight;

    var height = gl.arrowBuffer.getLength() / screenRatioHeight;
    var tanTheta = m.tan(specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * m.PI);
    var depth = height / tanTheta;
    var near = m.max(depth - height, 0.1);
    var far = depth + height;

    // var near = 0.1;
    // var far = 10000;

    var aspec = gl.canvas.clientWidth / gl.canvas.clientHeight;

    var deltaX = -(gl.canvas.clientWidth - specs.compass_size_3D) / 2 + this.textImage.charHeight;
    var deltaY = -(gl.canvas.clientHeight - specs.compass_size_3D) / 2 + this.textImage.charHeight;

    var fnProjection, z;

    if (specs.projectionPerspective_3D) {
      z = near;
      fnProjection = m4.frustum;
    } else {
      z = depth;
      fnProjection = m4.ortho;
    }

    var nearRatio = z / gl.canvas.clientHeight * 2 * tanTheta;
    var x = deltaX * nearRatio;
    var y = deltaY * nearRatio;
    var top = tanTheta * z;
    var bottom = -top;
    var left = aspec * bottom;
    var right = aspec * top;

    this.projectionMatrix = fnProjection(left - x, right - x, bottom - y, top - y, near, far);
    this.translationMatrix = m4.translate(m4.identity([]), [ 0, 0, -depth ]);

    // vertex data for X Y Z text label
    var vertexData = {
      position : [],
      texCoord : [],
      translation : [],
      zDepth : []
    };

    this.textImage.pushVertexData('X', [ 3.5, 0, 0 ], 0, vertexData);
    this.textImage.pushVertexData('Y', [ 0, 3.5, 0 ], 0, vertexData);
    this.textImage.pushVertexData('Z', [ 0, 0, 3.5 ], 0, vertexData);

    this.textMesh.storeData(gl, vertexData.position, vertexData.texCoord, vertexData.translation, vertexData.zDepth);
  };

  var _ = d3.Compass.prototype;
  _.renderArrow = function(gl, color, mvMatrix) {
    gl.material.setDiffuseColor(color);
    gl.setMatrixUniforms(mvMatrix);
    gl.drawElements(gl.TRIANGLES, gl.arrowBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  };
  _.render = function(gl, specs) {
    gl.arrowBuffer.bindBuffers(gl);
    gl.material.setTempColors(specs.bonds_materialAmbientColor_3D, undefined, specs.bonds_materialSpecularColor_3D, specs.bonds_materialShininess_3D);

    var modelMatrix = m4.multiply(this.translationMatrix, gl.rotationMatrix, []);
    var angle = m.PI / 2;

    // compass not need Fogging effect (and other effect)
    gl.fogging.setMode(0);

    // x - axis
    this.renderArrow(gl, specs.compass_axisXColor_3D, m4.rotateY(modelMatrix, angle, []));

    // y-axis
    this.renderArrow(gl, specs.compass_axisYColor_3D, m4.rotateX(modelMatrix, -angle, []));

    // z-axis
    this.renderArrow(gl, specs.compass_axisZColor_3D, modelMatrix);
  };
  _.renderText = function(gl) {
    var modelMatrix = m4.multiply(this.translationMatrix, gl.rotationMatrix, []);
    gl.shaderText.setUniforms(gl, modelMatrix, this.projectionMatrix);
    this.textImage.useTexture(gl);
    this.textMesh.render(gl);
  };

})(ChemDoodle.structures.d3, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, m) {
  'use strict';
  d3.Cylinder = function(radius, height, bands) {
    var positionData = [];
    var normalData = [];
    for ( var i = 0; i < bands; i++) {
      var theta = i * 2 * m.PI / bands;
      var cosTheta = m.cos(theta);
      var sinTheta = m.sin(theta);
      normalData.push(cosTheta, 0, sinTheta);
      positionData.push(radius * cosTheta, 0, radius * sinTheta);
      normalData.push(cosTheta, 0, sinTheta);
      positionData.push(radius * cosTheta, height, radius * sinTheta);
    }
    normalData.push(1, 0, 0);
    positionData.push(radius, 0, 0);
    normalData.push(1, 0, 0);
    positionData.push(radius, height, 0);

    this.storeData(positionData, normalData);
  };
  d3.Cylinder.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(math, d3, v3) {
  'use strict';

  d3.Fog = function(gl) {
    this.gl = gl;
    var prefix = 'u_fog.';
    this.mUL = gl.getUniformLocation(gl.program, prefix + 'mode');
    this.cUL = gl.getUniformLocation(gl.program, prefix + 'color');
    this.sUL = gl.getUniformLocation(gl.program, prefix + 'start');
    this.eUL = gl.getUniformLocation(gl.program, prefix + 'end');
    this.dUL = gl.getUniformLocation(gl.program, prefix + 'density');
  };

  var _ = d3.Fog.prototype;
  _.setTempParameter = function(color, fogStart, fogEnd, density) {
    if (!this.cCache || this.cCache !== color) {
      this.cCache = color;
      var cs = math.getRGB(color, 1);
      this.gl.uniform3f(this.cUL, cs[0], cs[1], cs[2]);
    }
    if (!this.sCache || this.sCache !== fogStart) {
      this.sCache = fogStart;
      this.gl.uniform1f(this.sUL, fogStart);
    }
    if (!this.eCache || this.eCache !== fogEnd) {
      this.eCache = fogEnd;
      this.gl.uniform1f(this.eUL, fogEnd);
    }
    if (!this.dCache || this.dCache !== density) {
      this.dCache = density;
      this.gl.uniform1f(this.dUL, density);
    }
  };
  _.setMode = function(mode) {
    if (!this.mCache || this.mCache !== mode) {
      this.mCache = mode;
      this.gl.uniform1i(this.mUL, mode);
    }
  };
})(ChemDoodle.math, ChemDoodle.structures.d3, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3994 $
//  $Author: kevin $
//  $LastChangedDate: 2012-12-13 18:52:20 -0500 (Thu, 13 Dec 2012) $
//

(function(ELEMENT, d3) {

  d3.Label = function() {
    this.textImage = new d3.TextImage();
  };
  var _ = d3.Label.prototype;
  _.init = function(gl, specs) {
    this.textImage.init(gl);
    this.textImage.updateFont(gl, specs.atoms_font_size_2D, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D, specs.text_font_stroke_3D);
  };
  _.updateVerticesBuffer = function(gl, molecules, specs) {
    for ( var i = 0, ii = molecules.length; i < ii; i++) {
      var molecule = molecules[i];
      var moleculeLabel = molecule.labelMesh;
      var atoms = molecule.atoms;
      var textImage = this.textImage;
      var vertexData = {
        position : [],
        texCoord : [],
        translation : [],
        zDepth : []
      };

      var isMacro = atoms.length > 0 && atoms[0].hetatm != undefined;

      for ( var j = 0, jj = atoms.length; j < jj; j++) {
        var atom = atoms[j];

        var atomLabel = atom.label;
        var zDepth = 0.05;

        // Sphere or Ball and Stick
        if (specs.atoms_useVDWDiameters_3D) {
          var add = ELEMENT[atomLabel].vdWRadius * specs.atoms_vdwMultiplier_3D;
          if (add === 0) {
            add = 1;
          }
          zDepth += add;
        }
        // if Stick or Wireframe
        else if (specs.atoms_sphereDiameter_3D) {
          zDepth += specs.atoms_sphereDiameter_3D / 2 * 1.5;
        }

        if (isMacro) {
          if (!atom.hetatm) {
            if (!specs.macro_displayAtoms) {
              continue;
            }
          } else if (atom.isWater) {
            if (!specs.macro_showWaters) {
              continue;
            }
          }
        }

        textImage.pushVertexData(atomLabel, [ atom.x, atom.y, atom.z ], zDepth, vertexData);

      }

      var chains = molecule.chains;

      if (chains && (specs.proteins_displayRibbon || specs.proteins_displayBackbone)) {

        for ( var j = 0, jj = chains.length; j < jj; j++) {
          var chain = chains[j];

          for ( var k = 0, kk = chain.length; k < kk; k++) {
            var residue = chain[k];

            if (residue.name) {
              var atom = residue.cp1;
              textImage.pushVertexData(residue.name, [ atom.x, atom.y, atom.z ], 2, vertexData);
            }
          }
        }

      }

      moleculeLabel.storeData(gl, vertexData.position, vertexData.texCoord, vertexData.translation, vertexData.zDepth);

    }
  };
  _.render = function(gl, specs, molecules) {
    // use projection for shader text.
    gl.shaderText.setUniforms(gl, gl.modelViewMatrix, gl.projectionMatrix);

    this.textImage.useTexture(gl);
    for ( var i = 0, ii = molecules.length; i < ii; i++) {
      if (molecules[i].labelMesh) {
        molecules[i].labelMesh.render(gl);
      }
    }
  };

})(ChemDoodle.ELEMENT, ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4401 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-08 12:26:27 -0400 (Sat, 08 Jun 2013) $
//

(function(d3, m) {
  'use strict';
  d3.Sphere = function(radius, latitudeBands, longitudeBands) {
    var positionData = [];
    var normalData = [];
    for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * m.PI / latitudeBands;
      var sinTheta = m.sin(theta);
      var cosTheta = m.cos(theta);

      for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * m.PI / longitudeBands;
        var sinPhi = m.sin(phi);
        var cosPhi = m.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;

        normalData.push(x, y, z);
        positionData.push(radius * x, radius * y, radius * z);
      }
    }

    var indexData = [];
    longitudeBands += 1;
    for ( var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for ( var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * longitudeBands) + (longNumber % longitudeBands);
        var second = first + longitudeBands;
        indexData.push(first, first + 1, second);
        if (longNumber < longitudeBands - 1) {
          indexData.push(second, first + 1, second + 1);
        }
      }
    }

    this.storeData(positionData, normalData, indexData);
  };
  d3.Sphere.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(RESIDUE, d3, m, v3) {
  'use strict';
  var loadPartition = function(gl, p) {
    // positions
    gl.bindBuffer(gl.ARRAY_BUFFER, p.vertexPositionBuffer);
    gl.vertexAttribPointer(gl.shader.vertexPositionAttribute, p.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // normals
    gl.bindBuffer(gl.ARRAY_BUFFER, p.vertexNormalBuffer);
    gl.vertexAttribPointer(gl.shader.vertexNormalAttribute, p.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // indexes
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.vertexIndexBuffer);
  };

  function SubRibbon(entire, name, indexes, pi) {
    this.entire = entire;
    this.name = name;
    this.indexes = indexes;
    this.pi = pi;
  }
  var _2 = SubRibbon.prototype;
  _2.getColor = function(specs) {
    if (specs.macro_colorByChain) {
      return this.chainColor;
    } else if (this.name) {
      return this.getResidueColor(RESIDUE[this.name] ? this.name : '*', specs);
    } else if (this.helix) {
      return this.entire.front ? specs.proteins_ribbonCartoonHelixPrimaryColor : specs.proteins_ribbonCartoonHelixSecondaryColor;
    } else if (this.sheet) {
      return specs.proteins_ribbonCartoonSheetColor;
    } else {
      return this.entire.front ? specs.proteins_primaryColor : specs.proteins_secondaryColor;
    }
  };
  _2.getResidueColor = function(name, specs) {
    var r = RESIDUE[name];
    if (specs.proteins_useShapelyColors) {
      return r.shapelyColor;
    } else if (specs.proteins_useAminoColors) {
      return r.aminoColor;
    } else if (specs.proteins_usePolarityColors) {
      if (r.polar) {
        return '#C10000';
      } else {
        return '#FFFFFF';
      }
    }
    return '#FFFFFF';
  };
  _2.render = function(gl, specs) {
    if (this.entire.partitions && this.pi !== this.entire.partitions.lastRender) {
      loadPartition(gl, this.entire.partitions[this.pi]);
      this.entire.partitions.lastRender = this.pi;
    }
    if (!this.vertexIndexBuffer) {
      this.vertexIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), gl.STATIC_DRAW);
      this.vertexIndexBuffer.itemSize = 1;
      this.vertexIndexBuffer.numItems = this.indexes.length;
    }
    // indexes
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    // colors
    gl.material.setDiffuseColor(this.getColor(specs));
    // render
    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  };

  d3.Ribbon = function(chain, offset, cartoon) {
    // ribbon meshes build front to back, not side to side, so keep this in
    // mind
    var lineSegmentNum = chain[0].lineSegments.length;
    var lineSegmentLength = chain[0].lineSegments[0].length;
    this.partitions = [];
    this.partitions.lastRender = 0;
    var currentPartition;
    this.front = offset > 0;
    // calculate vertex and normal points
    for ( var i = 0, ii = chain.length - 1; i < ii; i++) {
      if (!currentPartition || currentPartition.positionData.length > 65000) {
        if (this.partitions.length > 0) {
          i--;
        }
        currentPartition = {
          count : 0,
          positionData : [],
          normalData : [],
          indexData : []
        };
        this.partitions.push(currentPartition);
      }
      var residue = chain[i];
      currentPartition.count++;
      for ( var j = 0; j < lineSegmentNum; j++) {
        var lineSegment = cartoon ? residue.lineSegmentsCartoon[j] : residue.lineSegments[j];
        var doSide1 = j === 0;
        var doSide2 = false;
        for ( var k = 0; k < lineSegmentLength; k++) {
          var a = lineSegment[k];
          // normals
          var abovei = i;
          var abovek = k + 1;
          if (i === chain.length - 2 && k === lineSegmentLength - 1) {
            abovek--;
          } else if (k === lineSegmentLength - 1) {
            abovei++;
            abovek = 0;
          }
          var above = cartoon ? chain[abovei].lineSegmentsCartoon[j][abovek] : chain[abovei].lineSegments[j][abovek];
          var negate = false;
          var nextj = j + 1;
          if (j === lineSegmentNum - 1) {
            nextj -= 2;
            negate = true;
          }
          var side = cartoon ? residue.lineSegmentsCartoon[nextj][k] : residue.lineSegments[nextj][k];
          var toAbove = [ above.x - a.x, above.y - a.y, above.z - a.z ];
          var toSide = [ side.x - a.x, side.y - a.y, side.z - a.z ];
          var normal = v3.cross(toAbove, toSide, []);
          // positions
          if (k === 0) {
            // tip
            v3.normalize(toAbove);
            v3.scale(toAbove, -1);
            currentPartition.normalData.push(toAbove[0], toAbove[1], toAbove[2]);
            currentPartition.positionData.push(a.x, a.y, a.z);
          }
          if (doSide1 || doSide2) {
            // sides
            v3.normalize(toSide);
            v3.scale(toSide, -1);
            currentPartition.normalData.push(toSide[0], toSide[1], toSide[2]);
            currentPartition.positionData.push(a.x, a.y, a.z);
            if (doSide1 && k === lineSegmentLength - 1) {
              doSide1 = false;
              k = -1;
            }
          } else {
            // center strips
            v3.normalize(normal);
            if (negate && !this.front || !negate && this.front) {
              v3.scale(normal, -1);
            }
            currentPartition.normalData.push(normal[0], normal[1], normal[2]);
            v3.scale(normal, m.abs(offset));
            currentPartition.positionData.push(a.x + normal[0], a.y + normal[1], a.z + normal[2]);
            if (j === lineSegmentNum - 1 && k === lineSegmentLength - 1) {
              doSide2 = true;
              k = -1;
            }
          }
          if (k === -1 || k === lineSegmentLength - 1) {
            // end
            v3.normalize(toAbove);
            currentPartition.normalData.push(toAbove[0], toAbove[1], toAbove[2]);
            currentPartition.positionData.push(a.x, a.y, a.z);
          }
        }
      }
    }

    // build mesh connectivity
    // add 2 to lineSegmentNum and lineSegmentLength to account for sides
    // and ends
    lineSegmentNum += 2;
    lineSegmentLength += 2;
    if (cartoon) {
      this.cartoonSegments = [];
    }
    this.segments = [];
    for ( var n = 0, nn = this.partitions.length; n < nn; n++) {
      var currentPartition = this.partitions[n];
      var cartoonSegmentIndexData;
      if (cartoon) {
        cartoonSegmentIndexData = [];
      }
      for ( var i = 0, ii = currentPartition.count - 1; i < ii; i++) {
        var chainIndex = i;
        for ( var j = 0; j < n; j++) {
          chainIndex += this.partitions[j].count - 1;
        }
        var c = chain[chainIndex];
        if (i > 0 && cartoon && c.split) {
          var sr = new SubRibbon(this, undefined, cartoonSegmentIndexData, n);
          if (c.helix) {
            sr.helix = true;
          }
          if (c.sheet) {
            sr.sheet = true;
          }
          this.cartoonSegments.push(sr);
          cartoonSegmentIndexData = [];
        }
        var residueIndexStart = i * lineSegmentNum * lineSegmentLength;
        var individualIndexData = [];
        for ( var j = 0, jj = lineSegmentNum - 1; j < jj; j++) {
          var segmentIndexStart = residueIndexStart + j * lineSegmentLength;
          for ( var k = 0; k < lineSegmentLength; k++) {
            var nextRes = 1;
            if (i === currentPartition.count - 1) {
              nextRes = 0;
            } else if (k === lineSegmentLength - 1) {
              nextRes = lineSegmentNum * lineSegmentLength - k;
            }
            var add = [ segmentIndexStart + k, segmentIndexStart + lineSegmentLength + k, segmentIndexStart + lineSegmentLength + k + nextRes, segmentIndexStart + k, segmentIndexStart + k + nextRes, segmentIndexStart + lineSegmentLength + k + nextRes ];
            if (k !== lineSegmentLength - 1) {
              if (this.front) {
                individualIndexData.push(add[0], add[1], add[2], add[3], add[5], add[4]);
              } else {
                individualIndexData.push(add[0], add[2], add[1], add[3], add[4], add[5]);
              }
            }
            if (k === lineSegmentLength - 2 && i < currentPartition.count - 1) {
              // jump the gap, the other mesh points will be
              // covered,
              // so no need to explicitly skip them
              var jump = lineSegmentNum * lineSegmentLength - k;
              add[2] += jump;
              add[4] += jump;
              add[5] += jump;
            }
            if (this.front) {
              currentPartition.indexData.push(add[0], add[1], add[2], add[3], add[5], add[4]);
            } else {
              currentPartition.indexData.push(add[0], add[2], add[1], add[3], add[4], add[5]);
            }

            if (cartoon) {
              if (this.front) {
                cartoonSegmentIndexData.push(add[0], add[1], add[2], add[3], add[5], add[4]);
              } else {
                cartoonSegmentIndexData.push(add[0], add[2], add[1], add[3], add[4], add[5]);
              }
            }
          }
        }
        var resName = chain[chainIndex + 1].name;
        this.segments.push(new SubRibbon(this, resName, individualIndexData, n));
      }
      if (cartoon) {
        var sr = new SubRibbon(this, undefined, cartoonSegmentIndexData, n);
        var chainIndex = currentPartition.count - 1;
        for ( var j = 0; j < n; j++) {
          chainIndex += this.partitions[j].count - 1;
        }
        var c = chain[chainIndex];
        if (c.helix) {
          sr.helix = true;
        }
        if (c.sheet) {
          sr.sheet = true;
        }
        this.cartoonSegments.push(sr);
      }
    }

    this.storeData(this.partitions[0].positionData, this.partitions[0].normalData, this.partitions[0].indexData);
    if (this.partitions.length === 1) {
      // clear partitions to reduce overhead
      this.partitions = undefined;
    }
  };
  var _ = d3.Ribbon.prototype = new d3._Mesh();
  _.render = function(gl, specs) {
    this.bindBuffers(gl);
    // colors
    var color = specs.macro_colorByChain ? this.chainColor : undefined;
    if (!color) {
      color = this.front ? specs.proteins_primaryColor : specs.proteins_secondaryColor;
    }
    gl.material.setDiffuseColor(color);
    // render
    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    if (this.partitions) {
      for ( var i = 1, ii = this.partitions.length; i < ii; i++) {
        var p = this.partitions[i];
        loadPartition(gl, p);
        // render
        gl.drawElements(gl.TRIANGLES, p.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      }
    }
  };

})(ChemDoodle.RESIDUE, ChemDoodle.structures.d3, Math, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(math, d3, v3) {
  'use strict';
  d3.Light = function(diffuseColor, specularColor, direction) {
    this.diffuseRGB = math.getRGB(diffuseColor, 1);
    this.specularRGB = math.getRGB(specularColor, 1);
    this.direction = direction;
  };
  var _ = d3.Light.prototype;
  _.lightScene = function(gl) {
    var prefix = 'u_light.';
    gl.uniform3f(gl.getUniformLocation(gl.program, prefix + 'diffuse_color'), this.diffuseRGB[0], this.diffuseRGB[1], this.diffuseRGB[2]);
    gl.uniform3f(gl.getUniformLocation(gl.program, prefix + 'specular_color'), this.specularRGB[0], this.specularRGB[1], this.specularRGB[2]);

    var lightingDirection = v3.create(this.direction);
    v3.normalize(lightingDirection);
    v3.negate(lightingDirection);
    gl.uniform3f(gl.getUniformLocation(gl.program, prefix + 'direction'), lightingDirection[0], lightingDirection[1], lightingDirection[2]);

    // compute the half vector
    var eyeVector = [ 0, 0, 0 ];
    var halfVector = [ eyeVector[0] + lightingDirection[0], eyeVector[1] + lightingDirection[1], eyeVector[2] + lightingDirection[2] ];
    var length = v3.length(halfVector);
    if (length === 0)
      halfVector = [ 0, 0, 1 ];
    else {
      v3.scale(1 / length);
    }
    gl.uniform3f(gl.getUniformLocation(gl.program, prefix + 'half_vector'), halfVector[0], halfVector[1], halfVector[2]);
  };

})(ChemDoodle.math, ChemDoodle.structures.d3, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3100 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-17 07:35:56 -0500 (Thu, 17 Feb 2011) $
//

(function(d3) {
  'use strict';
  d3.Line = function() {
    this.storeData([ 0, 0, 0, 0, 1, 0 ], [ 0, 0, 0, 0, 0, 0 ]);
  };
  d3.Line.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(math, d3) {
  'use strict';
  d3.Material = function(gl) {
    this.gl = gl;
    var prefix = 'u_material.';
    this.aUL = gl.getUniformLocation(gl.program, prefix + 'ambient_color');
    this.dUL = gl.getUniformLocation(gl.program, prefix + 'diffuse_color');
    this.sUL = gl.getUniformLocation(gl.program, prefix + 'specular_color');
    this.snUL = gl.getUniformLocation(gl.program, prefix + 'shininess');
    this.alUL = gl.getUniformLocation(gl.program, prefix + 'alpha');
  };
  var _ = d3.Material.prototype;
  _.setTempColors = function(ambientColor, diffuseColor, specularColor, shininess) {
    if (!this.aCache || this.aCache !== ambientColor) {
      this.aCache = ambientColor;
      var cs = math.getRGB(ambientColor, 1);
      this.gl.uniform3f(this.aUL, cs[0], cs[1], cs[2]);
    }
    if (diffuseColor && (!this.dCache || this.dCache !== diffuseColor)) {
      this.dCache = diffuseColor;
      var cs = math.getRGB(diffuseColor, 1);
      this.gl.uniform3f(this.dUL, cs[0], cs[1], cs[2]);
    }
    if (!this.sCache || this.sCache !== specularColor) {
      this.sCache = specularColor;
      var cs = math.getRGB(specularColor, 1);
      this.gl.uniform3f(this.sUL, cs[0], cs[1], cs[2]);
    }
    if (!this.snCache || this.snCache !== shininess) {
      this.snCache = shininess;
      this.gl.uniform1f(this.snUL, shininess);
    }
    this.alCache = 1;
    this.gl.uniform1f(this.alUL, 1);
  };
  _.setDiffuseColor = function(diffuseColor) {
    if (!this.dCache || this.dCache !== diffuseColor) {
      this.dCache = diffuseColor;
      var cs = math.getRGB(diffuseColor, 1);
      this.gl.uniform3f(this.dUL, cs[0], cs[1], cs[2]);
    }
  };
  _.setAlpha = function(alpha) {
    if (!this.alCache || this.alCache !== alpha) {
      this.alCache = alpha;
      this.gl.uniform1f(this.alUL, alpha);
    }
  };

})(ChemDoodle.math, ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3387 $
//  $Author: kevin $
//  $LastChangedDate: 2011-09-25 08:54:07 -0400 (Sun, 25 Sep 2011) $
//

(function(structures, d3, ELEMENT, m) {
  'use strict';
  d3.MolecularSurface = function(molecule, latitudeBands, longitudeBands, probeRadius, atomRadius) {
    var positionData = [];
    var normalData = [];
    var indexData = [];

    // determine a generic set of normals to define a single atom surface
    var genericSurface = [];
    for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * m.PI / latitudeBands;
      var sinTheta = m.sin(theta);
      var cosTheta = m.cos(theta);
      for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * m.PI / longitudeBands;
        genericSurface.push(m.cos(phi) * sinTheta, cosTheta, m.sin(phi) * sinTheta);
      }
    }

    // add surfaces for each atom, to be post processed
    var atomSurfaces = [];
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      var atomSurface = [];
      var atom = molecule.atoms[i];

      // cache the atoms within distance, so that we don't need to waste
      // calculations later
      var radius = ELEMENT[atom.label][atomRadius] + probeRadius;
      var checks = [];
      for ( var j = 0, jj = molecule.atoms.length; j < jj; j++) {
        if (j !== i) {
          var check = molecule.atoms[j];
          check.index = j;
          if (atom.distance3D(check) < radius + ELEMENT[check.label][atomRadius] + probeRadius) {
            checks.push(check);
          }
        }
      }

      for ( var j = 0, jj = genericSurface.length; j < jj; j += 3) {
        var p = new structures.Atom('C', atom.x + radius * genericSurface[j], atom.y + radius * genericSurface[j + 1], atom.z + radius * genericSurface[j + 2]);
        for ( var k = 0, kk = checks.length; k < kk; k++) {
          var check = checks[k];
          if (p.distance3D(check) < ELEMENT[check.label][atomRadius] + probeRadius) {
            p.contained = true;
            break;
          }
        }
        atomSurface.push(p);
      }

      atomSurfaces.push(atomSurface);
    }

    // set up the mesh vectors
    var genericIndexes = [];
    longitudeBands++;
    for ( var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for ( var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * longitudeBands) + (longNumber % longitudeBands);
        var second = first + longitudeBands;
        genericIndexes.push(first);
        genericIndexes.push(second);
        genericIndexes.push(first + 1);
        if (longNumber < longitudeBands - 1) {
          genericIndexes.push(second);
          genericIndexes.push(second + 1);
          genericIndexes.push(first + 1);
        }
      }
    }

    var indexCounter = 0;
    // connect discrete sphere parts
    for ( var i = 0, ii = atomSurfaces.length; i < ii; i++) {
      var atomSurface = atomSurfaces[i];
      for ( var j = 0, jj = atomSurface.length; j < jj; j++) {
        var p = atomSurface[j];
        if (!p.contained) {
          p.index = indexCounter;
          indexCounter++;
          positionData.push(p.x, p.y, p.z);
          normalData.push(genericSurface[j * 3], genericSurface[j * 3 + 1], genericSurface[j * 3 + 2]);
        }
      }
      for ( var j = 0, jj = genericIndexes.length; j < jj; j += 3) {
        var first = atomSurface[genericIndexes[j]];
        var second = atomSurface[genericIndexes[j + 1]];
        var third = atomSurface[genericIndexes[j + 2]];
        if (!first.contained && !second.contained && !third.contained) {
          indexData.push(first.index, second.index, third.index);
        }
      }
    }
    // sow together spheres
    function findClosestPoint(pNotContained, checks, exclude1, exclude2) {
      var index = pNotContained.index;
      if (pNotContained.contained) {
        index = -1;
        var dist = Infinity;
        for ( var k = 0, kk = checks.length; k < kk; k++) {
          var check = checks[k];
          for ( var l = 0, ll = check.length; l < ll; l++) {
            var p = check[l];
            if (!p.contained && p.index !== exclude1 && p.index !== exclude2) {
              var distCheck = p.distance3D(pNotContained);
              if (distCheck < dist) {
                index = p.index;
                dist = distCheck;
              }
            }
          }
        }
      }
      return index;
    }
    var seams = [];
    for ( var i = 0, ii = atomSurfaces.length; i < ii; i++) {
      var atomSurface = atomSurfaces[i];
      for ( var j = 0, jj = genericIndexes.length; j < jj; j += 3) {
        var first = atomSurface[genericIndexes[j]];
        var second = atomSurface[genericIndexes[j + 1]];
        var third = atomSurface[genericIndexes[j + 2]];
        var checks = [];
        for ( var k = 0, kk = atomSurfaces.length; k < kk; k++) {
          if (k !== i) {
            checks.push(atomSurfaces[k]);
          }
        }
        if (!(first.contained && second.contained && third.contained) && (first.contained || second.contained || third.contained)) {
          var fi = findClosestPoint(first, checks, -1, -1);
          var si = findClosestPoint(second, checks, fi, -1);
          var ti = findClosestPoint(third, checks, fi, si);
          if (fi !== -1 && si !== -1 && ti !== -1) {
            var already = false;
            for ( var k = 0, kk = seams.length; k < kk; k += 3) {
              var already1 = seams[k];
              var already2 = seams[k + 1];
              var already3 = seams[k + 2];
              var f1 = fi === already1 || fi === already2 || fi === already3;
              var f2 = si === already1 || si === already2 || si === already3;
              var f3 = ti === already1 || ti === already2 || ti === already3;
              if (f1 && f2 && f3) {
                already = true;
                break;
              }
            }
            if (!already) {
              seams.push(fi, si, ti);
            }
          }
        }
      }
    }
    indexData = indexData.concat(seams);

    this.storeData(positionData, normalData, indexData);
  };
  d3.MolecularSurface.prototype = new d3._Mesh();

})(ChemDoodle.structures, ChemDoodle.structures.d3, ChemDoodle.ELEMENT, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, document) {
  'use strict';
  d3.Picker = function() {
  };
  var _ = d3.Picker.prototype;

  _.init = function(gl) {
    // setup for picking system
    this.framebuffer = gl.createFramebuffer();

    // set pick texture
    var texture2D = gl.createTexture();
    var renderbuffer = gl.createRenderbuffer();

    gl.bindTexture(gl.TEXTURE_2D, texture2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

    // set framebuffer and bind the texture and renderbuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2D, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  _.setDimension = function(gl, width, height) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    // get binded depth attachment renderbuffer
    var renderbuffer = gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
    if (gl.isRenderbuffer(renderbuffer)) {
      // set renderbuffer dimension
      gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    // get binded color attachment texture 2d
    var texture2D = gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
    if (gl.isTexture(texture2D)) {
      // set texture dimension
      gl.bindTexture(gl.TEXTURE_2D, texture2D);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  _.pick = function(gl, molecules, specs, x, y) {
    var object = undefined;

    // current clear color
    var cs = gl.getParameter(gl.COLOR_CLEAR_VALUE);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    gl.clearColor(1.0, 1.0, 1.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // disable foging effect
    gl.fogging.setMode(0);

    // not need the normal for diffuse light, we need flat color
    gl.disableVertexAttribArray(gl.shader.vertexNormalAttribute);

    var objects = [];

    gl.material.setAlpha(255);
    for ( var i = 0, ii = molecules.length; i < ii; i++) {
      molecules[i].renderPickFrame(gl, specs, objects);
    }

    // flush as this is seen in documentation
    gl.flush();

    var rgba = new Uint8Array(4);
    gl.readPixels(x - 2, y + 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, rgba);

    var idxMolecule = rgba[3];
    if (idxMolecule > 0) {
      var idxAtom = rgba[2] | (rgba[1] << 8) | (rgba[0] << 16);
      object = objects[idxAtom];
    }

    // release a little bit memory
    objects = undefined;

    // reenable the normal attribute
    gl.enableVertexAttribArray(gl.shader.vertexNormalAttribute);

    // enable fogging
    gl.fogging.setMode(specs.fog_mode_3D);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // set back the clear color
    gl.clearColor(cs[0], cs[1], cs[2], cs[3]);

    return object;
  };

})(ChemDoodle.structures.d3, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, m) {
  'use strict';

  /**
   * @constructor d3.Pill
   * @inherit {d3._Mesh}
   * @param {number}
   *            height Height of pill including the rounded cap
   * @param {number}
   *            radius Radius of pill
   * @param {number}
   *            latitudeBands Total bands of latitute division on one pill's
   *            cap
   * @param {number}
   *            longitudeBands Total bands of longitude division on one pill's
   *            cap and cylinder part
   */
  d3.Pill = function(radius, height, latitudeBands, longitudeBands) {

    var capHeightScale = 1;
    var capDiameter = 2 * radius;

    height -= capDiameter;

    if (height < 0) {
      capHeightScale = 0;
      height += capDiameter;
    } else if (height < capDiameter) {
      capHeightScale = height / capDiameter;
      height = capDiameter;
    }

    // update latitude and logintude band for two caps.
    // latitudeBands *= 2;
    // longitudeBands *= 2;

    var positionData = [];
    var normalData = [];
    for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * m.PI / latitudeBands;
      var sinTheta = m.sin(theta);
      var cosTheta = m.cos(theta) * capHeightScale;

      // console.log(cosTheta);

      for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * m.PI / longitudeBands;
        var sinPhi = m.sin(phi);
        var cosPhi = m.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;

        normalData.push(x, y, z);
        positionData.push(radius * x, radius * y + (latNumber < latitudeBands / 2 ? height : 0), radius * z);
      }
    }

    var indexData = [];
    longitudeBands += 1;
    for ( var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for ( var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * longitudeBands) + (longNumber % longitudeBands);
        var second = first + longitudeBands;
        indexData.push(first, first + 1, second);
        if (longNumber < longitudeBands - 1) {
          indexData.push(second, first + 1, second + 1);
        }
      }
    }

    this.storeData(positionData, normalData, indexData);
  };
  d3.Pill.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4500 $
//  $Author: kevin $
//  $LastChangedDate: 2013-09-06 14:28:15 -0400 (Fri, 06 Sep 2013) $
//

(function(d3, document) {
  'use strict';
  d3.Shader = function() {
  };
  var _ = d3.Shader.prototype;
  _.init = function(gl) {
    var vertexShader = this.getShader(gl, 'vertex-shader');
    if (!vertexShader) {
      vertexShader = this.loadDefaultVertexShader(gl);
    }
    var fragmentShader = this.getShader(gl, 'fragment-shader');
    if (!fragmentShader) {
      fragmentShader = this.loadDefaultFragmentShader(gl);
    }

    gl.attachShader(gl.program, vertexShader);
    gl.attachShader(gl.program, fragmentShader);

    // the vertex position location must be explicit set to '0',
    // to prefent vertex normal become location '0'.
    // It's needed because later normal must be disabled for
    // rendering on picking framebuffer
    this.vertexPositionAttribute = 0;
    gl.bindAttribLocation(gl.program, this.vertexPositionAttribute, 'a_vertex_position');

    gl.linkProgram(gl.program);

    if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
      alert('Could not initialize shaders: ' + gl.getProgramInfoLog(gl.program));
    }

    gl.useProgram(gl.program);

    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.vertexNormalAttribute = gl.getAttribLocation(gl.program, 'a_vertex_normal');
    gl.enableVertexAttribArray(this.vertexNormalAttribute);
  };
  _.getShader = function(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return undefined;
    }
    var sb = [];
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType === 3) {
        sb.push(k.textContent);
      }
      k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return undefined;
    }
    gl.shaderSource(shader, sb.join(''));
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(shaderScript.type + ' ' + gl.getShaderInfoLog(shader));
      return undefined;
    }
    return shader;
  };
  _.loadDefaultVertexShader = function(gl) {
    var sb = [
    'precision mediump float;',
    // phong shader
    'struct Light',
      '{',
        'vec3 diffuse_color;',
        'vec3 specular_color;',
        'vec3 direction;',
        'vec3 half_vector;',
      '};',

    'struct Material',
      '{',
        'vec3 ambient_color;',
        'vec3 diffuse_color;',
        'vec3 specular_color;',
        'float shininess;',
        'float alpha;',
      '};',
    // attributes set when rendering objects
    'attribute vec3 a_vertex_position;',
    'attribute vec3 a_vertex_normal;',
    // scene structs
    'uniform Light u_light;',
    'uniform Material u_material;',
    // matrices set by gl.setMatrixUniforms
    'uniform mat4 u_model_view_matrix;',
    'uniform mat4 u_projection_matrix;',
    'uniform mat3 u_normal_matrix;',
    // sent to the fragment shader
    'varying vec3 v_diffuse;',
    'varying vec4 v_ambient;',
    'varying vec3 v_normal;',
    'void main(void)',
      '{',
        'v_normal = length(a_vertex_normal)==0.0 ? a_vertex_normal : normalize(u_normal_matrix * a_vertex_normal);',

        'v_ambient = vec4(u_material.ambient_color, 1.0);',
        'v_diffuse = u_material.diffuse_color * u_light.diffuse_color;',

        'gl_Position = u_projection_matrix * u_model_view_matrix * vec4(a_vertex_position, 1.0);',
        // just to make sure the w is 1
        'gl_Position /= gl_Position.w;',
        'gl_PointSize = 2.0;',
      '}'
    ].join(''); // reduce memory to hold the array value

    var shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, sb);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('Vertex shader failed to compile: ' + gl.getShaderInfoLog(shader));
      return undefined;
    }
    return shader;
  };
  _.loadDefaultFragmentShader = function(gl) {
    var sb = [
    // set float precision
    'precision mediump float;\n',
    'struct Light',
      '{',
        'vec3 diffuse_color;',
        'vec3 specular_color;',
        'vec3 direction;',
        'vec3 half_vector;',
      '};',
    'struct Material',
      '{',
        'vec3 ambient_color;',
        'vec3 diffuse_color;',
        'vec3 specular_color;',
        'float shininess;',
        'float alpha;',
      '};',
    'struct Fog',
      '{',
        'int mode;',
        'vec3 color;',
        'float density;',
        'float start;',
        'float end;',
      '};',


    // scene structs
    'uniform Light u_light;',
    'uniform Material u_material;',
    'uniform Fog u_fog;',

    // from the vertex shader
    'varying vec3 v_diffuse;',
    'varying vec4 v_ambient;',
    'varying vec3 v_normal;',
    'void main(void)',
      '{',
        'if(length(v_normal)==0.0){',
          'gl_FragColor = vec4(vec3(v_diffuse.rgb),u_material.alpha);',
        '}else{',
          'float nDotL = max(dot(v_normal, u_light.direction), 0.0);',
          'vec4 color = vec4(v_diffuse*nDotL, 1.0);',
          'float nDotHV = max(dot(v_normal, u_light.half_vector), 0.0);',
          'vec3 specular = u_material.specular_color * u_light.specular_color;',
          'color+=vec4(specular * pow(nDotHV, u_material.shininess), 1.0);',

          // set the color
          'gl_FragColor = color+v_ambient;',
          'gl_FragColor.a*=u_material.alpha;',


          // fogging
          'float fogCoord = gl_FragCoord.z/gl_FragCoord.w;',
          'float fogFactor = 1.;',

          // linear equation
          'if(u_fog.mode == 1){',
            // 'if(u_fog.start <= fogCoord && fogCoord <= u_fog.end){',
            'if(fogCoord < u_fog.start){',
              'fogFactor = 1.;',
            '}else if(fogCoord > u_fog.end){',
              'fogFactor = 0.;',
            '}else{',
              'fogFactor = clamp((u_fog.end - fogCoord) / (u_fog.end - u_fog.start), 0.0, 1.0);',
            '}',
          '}',
          // exp equation
          'else if(u_fog.mode == 2) {',
            'fogFactor = clamp(exp(-u_fog.density*fogCoord), 0.0, 1.0);',
          '}',
          // exp2 equation
          'else if(u_fog.mode == 3) {',
            'fogFactor = clamp(exp(-pow(u_fog.density*fogCoord, 2.0)), 0.0, 1.0);',
          '}',
          'gl_FragColor = mix(vec4(vec3(u_fog.color), 1.), gl_FragColor, fogFactor);',
           // 'gl_FragColor = vec4(vec3(fogFactor), 1.0);',
        '}',
      '}'
    ].join('');

    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, sb);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('Fragment shader failed to compile: ' + gl.getShaderInfoLog(shader));
      return undefined;
    }
    return shader;
  };

})(ChemDoodle.structures.d3, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3100 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-17 07:35:56 -0500 (Thu, 17 Feb 2011) $
//

(function(structures, d3, v3) {
  'use strict';
  d3.Shape = function(points, thickness) {
    // points must be in the xy-plane, all z-coords must be 0, thickness
    // will be in the z-plane
    var numPoints = points.length;
    var positionData = [];
    var normalData = [];

    // calculate vertex and normal points
    var center = new structures.Point();
    for ( var i = 0, ii = numPoints; i < ii; i++) {
      var next = i + 1;
      if (i === ii - 1) {
        next = 0;
      }
      var z = [ 0, 0, 1 ];
      var currentPoint = points[i];
      var nextPoint = points[next];
      var v = [ nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y, 0 ];
      var normal = v3.cross(z, v);
      // first four are for the side normal
      // second four will do both the bottom and top triangle normals
      for ( var j = 0; j < 2; j++) {
        positionData.push(currentPoint.x, currentPoint.y, thickness / 2);
        positionData.push(currentPoint.x, currentPoint.y, -thickness / 2);
        positionData.push(nextPoint.x, nextPoint.y, thickness / 2);
        positionData.push(nextPoint.x, nextPoint.y, -thickness / 2);
      }
      // side normals
      for ( var j = 0; j < 4; j++) {
        normalData.push(normal[0], normal[1], normal[2]);
      }
      // top and bottom normals
      normalData.push(0, 0, 1);
      normalData.push(0, 0, -1);
      normalData.push(0, 0, 1);
      normalData.push(0, 0, -1);
      center.add(currentPoint);
    }
    // centers
    center.x /= numPoints;
    center.y /= numPoints;
    normalData.push(0, 0, 1);
    positionData.push(center.x, center.y, thickness / 2);
    normalData.push(0, 0, -1);
    positionData.push(center.x, center.y, -thickness / 2);

    // build mesh connectivity
    var indexData = [];
    var centerIndex = numPoints * 8;
    for ( var i = 0, ii = numPoints; i < ii; i++) {
      var start = i * 8;
      // sides
      indexData.push(start);
      indexData.push(start + 3);
      indexData.push(start + 1);
      indexData.push(start);
      indexData.push(start + 2);
      indexData.push(start + 3);
      // top and bottom
      indexData.push(start + 4);
      indexData.push(centerIndex);
      indexData.push(start + 6);
      indexData.push(start + 5);
      indexData.push(start + 7);
      indexData.push(centerIndex + 1);
    }

    this.storeData(positionData, normalData, indexData);
  };
  d3.Shape.prototype = new d3._Mesh();

})(ChemDoodle.structures, ChemDoodle.structures.d3, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3458 $
//  $Author: kevin $
//  $LastChangedDate: 2011-12-23 10:57:22 -0500 (Fri, 23 Dec 2011) $
//

(function(d3, m, v3) {
  'use strict';
  d3.Star = function() {
    var ps = [ .8944, .4472, 0, .2764, .4472, .8506, .2764, .4472, -.8506, -.7236, .4472, .5257, -.7236, .4472, -.5257, -.3416, .4472, 0, -.1056, .4472, .3249, -.1056, .4472, -.3249, .2764, .4472, .2008, .2764, .4472, -.2008, -.8944, -.4472, 0, -.2764, -.4472, .8506, -.2764, -.4472, -.8506, .7236, -.4472, .5257, .7236, -.4472, -.5257, .3416, -.4472, 0, .1056, -.4472, .3249, .1056, -.4472, -.3249, -.2764, -.4472, .2008, -.2764, -.4472, -.2008, -.5527, .1058, 0, -.1708, .1058, .5527, -.1708,
        .1058, -.5527, .4471, .1058, .3249, .4471, .1058, -.3249, .5527, -.1058, 0, .1708, -.1058, .5527, .1708, -.1058, -.5527, -.4471, -.1058, .3249, -.4471, -.1058, -.3249, 0, 1, 0, 0, -1, 0 ];
    var is = [ 0, 9, 8, 2, 7, 9, 4, 5, 7, 3, 6, 5, 1, 8, 6, 0, 8, 23, 30, 6, 8, 3, 21, 6, 11, 26, 21, 13, 23, 26, 2, 9, 24, 30, 8, 9, 1, 23, 8, 13, 25, 23, 14, 24, 25, 4, 7, 22, 30, 9, 7, 0, 24, 9, 14, 27, 24, 12, 22, 27, 3, 5, 20, 30, 7, 5, 2, 22, 7, 12, 29, 22, 10, 20, 29, 1, 6, 21, 30, 5, 6, 4, 20, 5, 10, 28, 20, 11, 21, 28, 10, 19, 18, 12, 17, 19, 14, 15, 17, 13, 16, 15, 11, 18, 16, 31, 19, 17, 14, 17, 27, 2, 27, 22, 4, 22, 29, 10, 29, 19, 31, 18, 19, 12, 19, 29, 4, 29, 20, 3, 20, 28,
        11, 28, 18, 31, 16, 18, 10, 18, 28, 3, 28, 21, 1, 21, 26, 13, 26, 16, 31, 15, 16, 11, 16, 26, 1, 26, 23, 0, 23, 25, 14, 25, 15, 31, 17, 15, 13, 15, 25, 0, 25, 24, 2, 24, 27, 12, 27, 17 ];

    var positionData = [];
    var normalData = [];
    var indexData = [];
    for ( var i = 0, ii = is.length; i < ii; i += 3) {
      var j1 = is[i] * 3;
      var j2 = is[i + 1] * 3;
      var j3 = is[i + 2] * 3;

      var p1 = [ ps[j1], ps[j1 + 1], ps[j1 + 2] ];
      var p2 = [ ps[j2], ps[j2 + 1], ps[j2 + 2] ];
      var p3 = [ ps[j3], ps[j3 + 1], ps[j3 + 2] ];

      var toAbove = [ p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2] ];
      var toSide = [ p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2] ];
      var normal = v3.cross(toSide, toAbove, []);
      v3.normalize(normal);

      positionData.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
      normalData.push(normal[0], normal[1], normal[2], normal[0], normal[1], normal[2], normal[0], normal[1], normal[2]);
      indexData.push(i, i + 1, i + 2);
    }

    this.storeData(positionData, normalData, indexData);
  };
  d3.Star.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, Math, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3994 $
//  $Author: kevin $
//  $LastChangedDate: 2012-12-13 18:52:20 -0500 (Thu, 13 Dec 2012) $
//

(function(d3, extensions, document) {
  'use strict';
  d3.TextImage = function() {
    this.ctx = document.createElement('canvas').getContext('2d');
    this.data = [];
    this.text = '';
    this.charHeight = 0;
  };

  var _ = d3.TextImage.prototype;

  _.init = function(gl) {
    // init texture
    this.textureImage = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.textureImage);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.updateFont(gl, 12, [ 'Sans-serif' ], false, false, false);
  };

  _.charData = function(character) {
    var index = this.text.indexOf(character);
    return index >= 0 ? this.data[index] : null;
  };

  _.updateFont = function(gl, fontSize, fontFamilies, fontBold, fontItalic, fontStroke) {
    var ctx = this.ctx;
    var canvas = this.ctx.canvas;
    var data = [];
    var text = "";
    var contextFont = extensions.getFontString(fontSize, fontFamilies, fontBold, fontItalic);

    ctx.font = contextFont;

    ctx.save();

    var totalWidth = 0;
    var charHeight = fontSize * 1.5;

    for ( var i = 32, ii = 127; i < ii; i++) {

      // skip control characters
      // if(i <= 31 || i == 127) continue;

      var character = String.fromCharCode(i), width = ctx.measureText(character).width;

      data.push({
        text : character,
        width : width,
        height : charHeight
      });

      totalWidth += width * 2;
    }

    var areaImage = totalWidth * charHeight;
    var sqrtArea = Math.sqrt(areaImage);
    var totalRows = Math.ceil(sqrtArea / charHeight);
    var maxWidth = Math.ceil(totalWidth / (totalRows - 1));

    canvas.width = maxWidth;
    canvas.height = totalRows * charHeight;

    ctx.font = contextFont;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.4;

    ctx.fillStyle = "#fff";

    var offsetRow = 0;
    var posX = 0;
    for ( var i = 0, ii = data.length; i < ii; i++) {
      var charData = data[i];
      var charWidth = charData.width * 2;
      var charHeight = charData.height;
      var charText = charData.text;
      var willWidth = posX + charWidth;

      if (willWidth > maxWidth) {
        offsetRow++;
        posX = 0;
      }

      var posY = offsetRow * charHeight;

      if (fontStroke) {
        // stroke must draw before fill
        ctx.strokeText(charText, posX, posY + (charHeight / 2));
      }

      ctx.fillText(charText, posX, posY + (charHeight / 2));

      charData.x = posX;
      charData.y = posY;

      text += charText;

      posX += charWidth;
    }

    this.text = text;
    this.data = data;
    this.charHeight = charHeight;

    // also update the texture
    gl.bindTexture(gl.TEXTURE_2D, this.textureImage);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  _.pushVertexData = function(text, position, zDepth, data) {
    // characters of string text
    var textPiece = text.toString().split("");

    // height of texture image
    var heightImage = this.getHeight();
    var widthImage = this.getWidth();

    var x1 = -this.textWidth(text) / 2;
    var y1 = -this.charHeight / 2;

    // iterate each character
    for ( var j = 0, jj = textPiece.length; j < jj; j++) {
      var charData = this.charData(textPiece[j]);

      var width = charData.width;
      var left = charData.x / widthImage;
      var right = left + charData.width * 1.8 / widthImage;
      var top = charData.y / heightImage;
      var bottom = top + charData.height / heightImage;

      var x2 = x1 + width * 1.8;
      var y2 = this.charHeight / 2;

      data.position.push(
      // left top
      position[0], position[1], position[2],
      // right top
      position[0], position[1], position[2],
      // right bottom
      position[0], position[1], position[2],

      // left top
      position[0], position[1], position[2],
      // left bottom
      position[0], position[1], position[2],
      // right bottom
      position[0], position[1], position[2]);

      data.texCoord.push(
      // left top
      left, top,
      // right bottom
      right, bottom,
      // right top
      right, top,

      // left top
      left, top,
      // left bottom
      left, bottom,
      // right bottom
      right, bottom);

      data.translation.push(
      // left top
      x1, y2,
      // right bottom
      x2, y1,
      // right top
      x2, y2,

      // left top
      x1, y2,
      // left bottom
      x1, y1,
      // right bottom
      x2, y1);

      data.zDepth.push(zDepth, zDepth, zDepth,

      zDepth, zDepth, zDepth);

      x1 = x2 + width - width * 1.8;
    }

  };
  _.getCanvas = function() {
    return this.ctx.canvas;
  };
  _.getHeight = function() {
    return this.getCanvas().height;
  };
  _.getWidth = function() {
    return this.getCanvas().width;
  };
  _.textWidth = function(text) {
    return this.ctx.measureText(text).width;
  };
  _.test = function() {
    document.body.appendChild(this.getCanvas());
  };
  _.useTexture = function(gl) {
    gl.bindTexture(gl.TEXTURE_2D, this.textureImage);
  };

})(ChemDoodle.structures.d3, ChemDoodle.extensions, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3994 $
//  $Author: kevin $
//  $LastChangedDate: 2012-12-13 18:52:20 -0500 (Thu, 13 Dec 2012) $
//

(function(d3, m) {
  'use strict';
  d3.TextMesh = function() {
  };
  var _ = d3.TextMesh.prototype;
  _.init = function(gl) {

    // set vertex buffer
    this.vertexPositionBuffer = gl.createBuffer();
    this.vertexTexCoordBuffer = gl.createBuffer();
    this.vertexTranslationBuffer = gl.createBuffer();
    this.vertexZDepthBuffer = gl.createBuffer();

  };
  _.setVertexData = function(gl, vertexBuffer, bufferData, itemSize) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
    vertexBuffer.itemSize = itemSize;
    vertexBuffer.numItems = bufferData.length / itemSize;
  };
  _.storeData = function(gl, vertexPositionData, vertexTexCoordData, vertexTranslationData, vertexZDepthData) {
    this.setVertexData(gl, this.vertexPositionBuffer, vertexPositionData, 3);
    this.setVertexData(gl, this.vertexTexCoordBuffer, vertexTexCoordData, 2);
    this.setVertexData(gl, this.vertexTranslationBuffer, vertexTranslationData, 2);
    this.setVertexData(gl, this.vertexZDepthBuffer, vertexZDepthData, 1);
  };
  _.bindBuffers = function(gl) {
    var shaderText = gl.shaderText;

    // positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderText.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // texCoord
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
    gl.vertexAttribPointer(shaderText.vertexTexCoordAttribute, this.vertexTexCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // translation
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTranslationBuffer);
    gl.vertexAttribPointer(shaderText.vertexTranslationAttribute, this.vertexTranslationBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // z depth
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexZDepthBuffer);
    gl.vertexAttribPointer(shaderText.vertexZDepthAttribute, this.vertexZDepthBuffer.itemSize, gl.FLOAT, false, 0, 0);

  };
  _.render = function(gl) {
    var numItems = this.vertexPositionBuffer.numItems;

    if (!numItems) {
      // nothing to do here
      return;
    }

    this.bindBuffers(gl);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
  };

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3994 $
//  $Author: kevin $
//  $LastChangedDate: 2012-12-13 18:52:20 -0500 (Thu, 13 Dec 2012) $
//

(function(d3) {
  'use strict';
  d3.TextShader = function() {
  };

  var _ = d3.TextShader.prototype = new d3.Shader();
  _.init = function(gl) {

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // init gl program
    var vertexShader = this.loadDefaultVertexShader(gl);
    var fragmentShader = this.loadDefaultFragmentShader(gl);

    gl.attachShader(gl.programLabel, vertexShader);
    gl.attachShader(gl.programLabel, fragmentShader);
    gl.linkProgram(gl.programLabel);

    if (!gl.getProgramParameter(gl.programLabel, gl.LINK_STATUS)) {
      alert('Could not initialize shaders: ' + gl.getProgramInfoLog(gl.programLabel));
    }

    // assign attribute properties
    this.vertexPositionAttribute = gl.getAttribLocation(gl.programLabel, 'a_vertex_position');
    this.vertexTexCoordAttribute = gl.getAttribLocation(gl.programLabel, 'a_vertex_texcoord');
    this.vertexTranslationAttribute = gl.getAttribLocation(gl.programLabel, 'a_translation');
    this.vertexZDepthAttribute = gl.getAttribLocation(gl.programLabel, 'a_z_depth');

    // assign uniform properties
    this.modelViewMatrixUniform = gl.getUniformLocation(gl.programLabel, 'u_model_view_matrix');
    this.projectionMatrixUniform = gl.getUniformLocation(gl.programLabel, 'u_projection_matrix');
    this.dimensionUniform = gl.getUniformLocation(gl.programLabel, 'u_dimension');

  };
  _.loadDefaultVertexShader = function(gl) {
    var sb = [
    'precision mediump float;',

    'attribute vec3 a_vertex_position;', 'attribute vec2 a_vertex_texcoord;', 'attribute vec2 a_translation;', 'attribute float a_z_depth;',

    'uniform mat4 u_model_view_matrix;', 'uniform mat4 u_projection_matrix;', 'uniform vec2 u_dimension;',

    'varying vec2 v_texcoord;',

    'void main() {',

    'gl_Position = u_model_view_matrix * vec4(a_vertex_position, 1.0);',

    'vec4 depth_pos = vec4(gl_Position);',

    'depth_pos.z += a_z_depth;',

    'gl_Position = u_projection_matrix * gl_Position;',

    'depth_pos = u_projection_matrix * depth_pos;',

    'gl_Position /= gl_Position.w;',

    'gl_Position.xy += a_translation / u_dimension * 2.0;',

    'gl_Position.z = depth_pos.z / depth_pos.w;',

    'v_texcoord = a_vertex_texcoord;', '}' ].join('');

    var shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, sb);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('Vertex shader failed to compile: ' + gl.getShaderInfoLog(shader));
      return undefined;
    }
    return shader;
  };
  _.loadDefaultFragmentShader = function(gl) {
    var sb = [
    'precision mediump float;',

    // our texture
    'uniform sampler2D u_image;',

    // the texCoords passed in from the vertex shader.
    'varying vec2 v_texcoord;',

    'void main() {', 'gl_FragColor = texture2D(u_image, v_texcoord);',

    // 'if(gl_FragColor.a == 0.0) discard;',

    // 'gl_FragColor = vec4(1.0,1.0,1.0,1.0);',
    '}' ].join('');

    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, sb);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('Fragment shader failed to compile: ' + gl.getShaderInfoLog(shader));
      return undefined;
    }
    return shader;
  };
  _.setUniforms = function(gl, modelViewMatrix, projectionMatrix) {
    gl.uniformMatrix4fv(this.modelViewMatrixUniform, false, modelViewMatrix);
    gl.uniformMatrix4fv(this.projectionMatrixUniform, false, projectionMatrix);
    gl.uniform2f(this.dimensionUniform, gl.canvas.clientWidth, gl.canvas.clientHeight);
  };
})(ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(extensions, RESIDUE, structures, d3, m, m4, v3) {
  'use strict';
  var loadPartition = function(gl, p) {
    // positions
    gl.bindBuffer(gl.ARRAY_BUFFER, p.vertexPositionBuffer);
    gl.vertexAttribPointer(gl.shader.vertexPositionAttribute, p.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // normals
    gl.bindBuffer(gl.ARRAY_BUFFER, p.vertexNormalBuffer);
    gl.vertexAttribPointer(gl.shader.vertexNormalAttribute, p.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // indexes
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.vertexIndexBuffer);
  };

  var PointRotator = function(point, axis, angle) {
    var d = m.sqrt(axis[1] * axis[1] + axis[2] * axis[2]);
    var Rx = [ 1, 0, 0, 0, 0, axis[2] / d, -axis[1] / d, 0, 0, axis[1] / d, axis[2] / d, 0, 0, 0, 0, 1 ];
    var RxT = [ 1, 0, 0, 0, 0, axis[2] / d, axis[1] / d, 0, 0, -axis[1] / d, axis[2] / d, 0, 0, 0, 0, 1 ];
    var Ry = [ d, 0, -axis[0], 0, 0, 1, 0, 0, axis[0], 0, d, 0, 0, 0, 0, 1 ];
    var RyT = [ d, 0, axis[0], 0, 0, 1, 0, 0, -axis[0], 0, d, 0, 0, 0, 0, 1 ];
    var Rz = [ m.cos(angle), -m.sin(angle), 0, 0, m.sin(angle), m.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
    var matrix = m4.multiply(Rx, m4.multiply(Ry, m4.multiply(Rz, m4.multiply(RyT, RxT, []))));
    this.rotate = function() {
      return m4.multiplyVec3(matrix, point);
    };
  };

  d3.Tube = function(chain, thickness, cylinderResolution) {
    var lineSegmentNum = chain[0].lineSegments[0].length;
    this.partitions = [];
    var currentPartition;
    this.ends = [];
    this.ends.push(chain[0].lineSegments[0][0]);
    this.ends.push(chain[chain.length - 2].lineSegments[0][0]);
    // calculate vertex and normal points
    var last = [ 1, 0, 0 ];
    for ( var i = 0, ii = chain.length - 1; i < ii; i++) {
      if (!currentPartition || currentPartition.positionData.length > 65000) {
        if (this.partitions.length > 0) {
          i--;
        }
        currentPartition = {
          count : 0,
          positionData : [],
          normalData : [],
          indexData : []
        };
        this.partitions.push(currentPartition);
      }
      var residue = chain[i];
      currentPartition.count++;
      var min = Infinity;
      var p = new structures.Atom('', chain[i + 1].cp1.x, chain[i + 1].cp1.y, chain[i + 1].cp1.z);
      for ( var j = 0; j < lineSegmentNum; j++) {
        var currentPoint = residue.lineSegments[0][j];
        var nextPoint;
        if (j === lineSegmentNum - 1) {
          if (i === chain.length - 2) {
            nextPoint = residue.lineSegments[0][j - 1];
          } else {
            nextPoint = chain[i + 1].lineSegments[0][0];
          }
        } else {
          nextPoint = residue.lineSegments[0][j + 1];
        }
        var axis = [ nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y, nextPoint.z - currentPoint.z ];
        v3.normalize(axis);
        if (i === chain.length - 2 && j === lineSegmentNum - 1) {
          v3.scale(axis, -1);
        }
        var startVector = vec3.cross(axis, last, []);
        v3.normalize(startVector);
        v3.scale(startVector, thickness / 2);
        var rotator = new PointRotator(startVector, axis, 2 * Math.PI / cylinderResolution);
        for ( var k = 0, kk = cylinderResolution; k < kk; k++) {
          var use = rotator.rotate();
          if (k === m.floor(cylinderResolution / 4)) {
            last = [ use[0], use[1], use[2] ];
          }
          currentPartition.normalData.push(use[0], use[1], use[2]);
          currentPartition.positionData.push(currentPoint.x + use[0], currentPoint.y + use[1], currentPoint.z + use[2]);
        }
        // find closest point to attach stick to
        if (p) {
          var dist = currentPoint.distance3D(p);
          if (dist < min) {
            min = dist;
            chain[i + 1].pPoint = currentPoint;
          }
        }
      }
    }

    // build mesh connectivity
    for ( var n = 0, nn = this.partitions.length; n < nn; n++) {
      var currentPartition = this.partitions[n];
      for ( var i = 0, ii = currentPartition.count - 1; i < ii; i++) {
        var indexStart = i * lineSegmentNum * cylinderResolution;
        for ( var j = 0, jj = lineSegmentNum; j < jj; j++) {
          var segmentIndexStart = indexStart + j * cylinderResolution;
          for ( var k = 0; k < cylinderResolution; k++) {
            var next = 1;
            var sk = segmentIndexStart + k;
            currentPartition.indexData.push(sk);
            currentPartition.indexData.push(sk + cylinderResolution);
            currentPartition.indexData.push(sk + cylinderResolution + next);
            currentPartition.indexData.push(sk);
            currentPartition.indexData.push(sk + cylinderResolution + next);
            currentPartition.indexData.push(sk + next);
          }
        }
      }
    }

    this.storeData(this.partitions[0].positionData, this.partitions[0].normalData, this.partitions[0].indexData);

    var ps = [ new structures.Point(2, 0) ];
    for ( var i = 0; i < 60; i++) {
      var ang = i / 60 * m.PI;
      ps.push(new structures.Point(2 * m.cos(ang), -2 * m.sin(ang)));
    }
    ps.push(new structures.Point(-2, 0), new structures.Point(-2, 4), new structures.Point(2, 4));
    var platform = new structures.d3.Shape(ps, 1);

    this.render = function(gl, specs) {
      // draw tube
      this.bindBuffers(gl);
      // colors
      gl.material.setDiffuseColor(specs.macro_colorByChain ? this.chainColor : specs.nucleics_tubeColor);
      // render
      gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      if (this.partitions) {
        for ( var i = 1, ii = this.partitions.length; i < ii; i++) {
          var p = this.partitions[i];
          loadPartition(gl, p);
          // render
          gl.drawElements(gl.TRIANGLES, p.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
      }

      // draw ends
      gl.sphereBuffer.bindBuffers(gl);
      for ( var i = 0; i < 2; i++) {
        var p = this.ends[i];
        var transform = m4.translate(gl.modelViewMatrix, [ p.x, p.y, p.z ], []);
        var radius = thickness / 2;
        m4.scale(transform, [ radius, radius, radius ]);
        // render
        gl.setMatrixUniforms(transform);
        gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      }

      // draw nucleotide handles
      gl.cylinderBuffer.bindBuffers(gl);
      for ( var i = 1, ii = chain.length - 1; i < ii; i++) {
        var residue = chain[i];
        var p1 = residue.pPoint;
        var p2 = new structures.Atom('', residue.cp2.x, residue.cp2.y, residue.cp2.z);
        var height = 1.001 * p1.distance3D(p2);
        var scaleVector = [ thickness / 4, height, thickness / 4 ];
        var transform = m4.translate(gl.modelViewMatrix, [ p1.x, p1.y, p1.z ], []);
        var y = [ 0, 1, 0 ];
        var ang = 0;
        var axis;
        var a2b = [ p2.x - p1.x, p2.y - p1.y, p2.z - p1.z ];
        if (p1.x === p2.x && p1.z === p2.z) {
          axis = [ 0, 0, 1 ];
          if (p1.y < p1.y) {
            ang = m.PI;
          }
        } else {
          ang = extensions.vec3AngleFrom(y, a2b);
          axis = v3.cross(y, a2b, []);
        }
        if (ang !== 0) {
          m4.rotate(transform, ang, axis);
        }
        m4.scale(transform, scaleVector);
        gl.setMatrixUniforms(transform);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.cylinderBuffer.vertexPositionBuffer.numItems);
      }

      // draw nucleotide platforms
      platform.bindBuffers(gl);
      // colors
      if (!specs.nucleics_useShapelyColors && !specs.macro_colorByChain) {
        gl.material.setDiffuseColor(specs.nucleics_baseColor);
      }
      for ( var i = 1, ii = chain.length - 1; i < ii; i++) {
        var residue = chain[i];
        var p2 = residue.cp2;
        var transform = m4.translate(gl.modelViewMatrix, [ p2.x, p2.y, p2.z ], []);
        // rotate to direction
        var y = [ 0, 1, 0 ];
        var ang = 0;
        var axis;
        var p3 = residue.cp3;
        var a2b = [ p3.x - p2.x, p3.y - p2.y, p3.z - p2.z ];
        if (p2.x === p3.x && p2.z === p3.z) {
          axis = [ 0, 0, 1 ];
          if (p2.y < p2.y) {
            ang = m.PI;
          }
        } else {
          ang = extensions.vec3AngleFrom(y, a2b);
          axis = v3.cross(y, a2b, []);
        }
        if (ang !== 0) {
          m4.rotate(transform, ang, axis);
        }
        // rotate to orientation
        var x = [ 1, 0, 0 ];
        var rM = m4.rotate(m4.identity([]), ang, axis);
        m4.multiplyVec3(rM, x);
        var p4 = residue.cp4;
        var p5 = residue.cp5;
        if (!(p4.y === p5.y && p4.z === p5.z)) {
          var pivot = [ p5.x - p4.x, p5.y - p4.y, p5.z - p4.z ];
          var ang2 = extensions.vec3AngleFrom(x, pivot);
          if (v3.dot(a2b, v3.cross(x, pivot)) < 0) {
            ang2 *= -1;
          }
          m4.rotateY(transform, ang2);
        }
        // color
        if (specs.nucleics_useShapelyColors && !specs.macro_colorByChain) {
          if (RESIDUE[residue.name]) {
            gl.material.setDiffuseColor(RESIDUE[residue.name].shapelyColor);
          } else {
            gl.material.setDiffuseColor(RESIDUE['*'].shapelyColor);
          }
        }
        // render
        gl.setMatrixUniforms(transform);
        gl.drawElements(gl.TRIANGLES, platform.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      }

    };
  };
  d3.Tube.prototype = new d3._Mesh();

})(ChemDoodle.extensions, ChemDoodle.RESIDUE, ChemDoodle.structures, ChemDoodle.structures.d3, Math, mat4, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3100 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-17 07:35:56 -0500 (Thu, 17 Feb 2011) $
//

(function(d3, v3) {
  'use strict';
  d3.UnitCell = function(unitCellVectors) {
    var positionData = [];
    var normalData = [];
    // calculate vertex and normal points

    var pushSide = function(p1, p2, p3, p4) {
      positionData.push(p1[0], p1[1], p1[2]);
      positionData.push(p2[0], p2[1], p2[2]);
      positionData.push(p3[0], p3[1], p3[2]);
      positionData.push(p4[0], p4[1], p4[2]);
      // push 0s for normals so shader gives them full color
      for ( var i = 0; i < 4; i++) {
        normalData.push(0, 0, 0);
      }
    };
    pushSide(unitCellVectors.o, unitCellVectors.x, unitCellVectors.xy, unitCellVectors.y);
    pushSide(unitCellVectors.o, unitCellVectors.y, unitCellVectors.yz, unitCellVectors.z);
    pushSide(unitCellVectors.o, unitCellVectors.z, unitCellVectors.xz, unitCellVectors.x);
    pushSide(unitCellVectors.yz, unitCellVectors.y, unitCellVectors.xy, unitCellVectors.xyz);
    pushSide(unitCellVectors.xyz, unitCellVectors.xz, unitCellVectors.z, unitCellVectors.yz);
    pushSide(unitCellVectors.xy, unitCellVectors.x, unitCellVectors.xz, unitCellVectors.xyz);

    // build mesh connectivity
    var indexData = [];
    for ( var i = 0; i < 6; i++) {
      var start = i * 4;
      // sides
      indexData.push(start, start + 1, start + 1, start + 2, start + 2, start + 3, start + 3, start);
    }

    this.storeData(positionData, normalData, indexData);
  };
  d3.UnitCell.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(structures, extensions, m) {
  'use strict';
  structures.Plate = function(lanes) {
    this.lanes = new Array(lanes);
    for (i = 0, ii = lanes; i < ii; i++) {
      this.lanes[i] = [];
    }
  };
  var _ = structures.Plate.prototype;
  _.sort = function() {
    for (i = 0, ii = this.lanes.length; i < ii; i++) {
      this.lanes[i].sort(function(a, b) {
        return a - b;
      });
    }
  };
  _.draw = function(ctx, specs) {
    // Front and origin
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    this.origin = 9 * height / 10;
    this.front = height / 10;
    this.laneLength = this.origin - this.front;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(0, this.front);
    extensions.contextHashTo(ctx, 0, this.front, width, this.front, 3, 3);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, this.origin);
    ctx.lineTo(width, this.origin);
    ctx.closePath();
    ctx.stroke();
    // Lanes
    for (i = 0, ii = this.lanes.length; i < ii; i++) {
      var laneX = (i + 1) * width / (ii + 1);
      ctx.beginPath();
      ctx.moveTo(laneX, this.origin);
      ctx.lineTo(laneX, this.origin + 3);
      ctx.closePath();
      ctx.stroke();
      // Spots
      for (s = 0, ss = this.lanes[i].length; s < ss; s++) {
        var spotY = this.origin - (this.laneLength * this.lanes[i][s].rf);
        switch (this.lanes[i][s].type) {
        case 'compact':
          ctx.beginPath();
          ctx.arc(laneX, spotY, 3, 0, 2 * m.PI, false);
          ctx.closePath();
          break;
        case 'expanded':
          ctx.beginPath();
          ctx.arc(laneX, spotY, 7, 0, 2 * m.PI, false);
          ctx.closePath();
          break;
        case 'trailing':
          // trailing
          break;
        case 'widened':
          extensions.contextOval(ctx, laneX - 18, spotY - 10, 36, 10);
          break;
        case 'cresent':
          ctx.beginPath();
          ctx.arc(laneX, spotY, 9, 0, m.PI, true);
          ctx.closePath();
          break;
        }
        switch (this.lanes[i][s].style) {
        case 'solid':
          ctx.fillStyle = '#000000';
          ctx.fill();
          break;
        case 'transparent':
          ctx.stroke();
          break;
        case 'gradient':
          // gradient
          break;
        }
      }
    }
  };

  structures.Plate.Spot = function(type, rf, style) {
    this.type = type;
    this.rf = rf;
    this.style = style ? style : 'solid';
  };

})(ChemDoodle.structures, ChemDoodle.extensions, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

(function(c, structures, m) {
  'use strict';
  // default canvas properties
  c.default_backgroundColor = '#FFFFFF';
  c.default_scale = 1;
  c.default_rotateAngle = 0;
  c.default_bondLength_2D = 20;
  c.default_angstromsPerBondLength = 1.25;
  c.default_lightDirection_3D = [ -.1, -.1, -1 ];
  c.default_lightDiffuseColor_3D = '#FFFFFF';
  c.default_lightSpecularColor_3D = '#FFFFFF';
  c.default_projectionPerspective_3D = true;
  c.default_projectionPerspectiveVerticalFieldOfView_3D = 45;
  c.default_projectionOrthoWidth_3D = 40;
  c.default_projectionWidthHeightRatio_3D = undefined;
  c.default_projectionFrontCulling_3D = .1;
  c.default_projectionBackCulling_3D = 10000;
  c.default_cullBackFace_3D = true;
  c.default_fog_mode_3D = 0;
  c.default_fog_color_3D = '#000000';
  c.default_fog_start_3D = 0;
  c.default_fog_end_3D = 1;
  c.default_fog_density_3D = 1;

  // default atom properties
  c.default_atoms_display = true;
  c.default_atoms_color = '#000000';
  c.default_atoms_font_size_2D = 12;
  c.default_atoms_font_families_2D = [ 'Helvetica', 'Arial', 'Dialog' ];
  c.default_atoms_font_bold_2D = false;
  c.default_atoms_font_italic_2D = false;
  c.default_atoms_circles_2D = false;
  c.default_atoms_circleDiameter_2D = 10;
  c.default_atoms_circleBorderWidth_2D = 1;
  c.default_atoms_lonePairDistance_2D = 8;
  c.default_atoms_lonePairSpread_2D = 4;
  c.default_atoms_lonePairDiameter_2D = 1;
  c.default_atoms_useJMOLColors = false;
  c.default_atoms_usePYMOLColors = false;
  c.default_atoms_resolution_3D = 60;
  c.default_atoms_sphereDiameter_3D = .8;
  c.default_atoms_useVDWDiameters_3D = false;
  c.default_atoms_vdwMultiplier_3D = 1;
  c.default_atoms_materialAmbientColor_3D = '#000000';
  c.default_atoms_materialSpecularColor_3D = '#555555';
  c.default_atoms_materialShininess_3D = 32;
  c.default_atoms_implicitHydrogens_2D = true;
  c.default_atoms_displayTerminalCarbonLabels_2D = false;
  c.default_atoms_showHiddenCarbons_2D = true;
  c.default_atoms_showAttributedCarbons_2D = true;
  c.default_atoms_displayAllCarbonLabels_2D = false;
  c.default_atoms_nonBondedAsStars_3D = false;
  c.default_atoms_displayLabels_3D = false;

  // default bond properties
  c.default_bonds_display = true;
  c.default_bonds_color = '#000000';
  c.default_bonds_width_2D = 1;
  c.default_bonds_saturationWidth_2D = .2;
  c.default_bonds_ends_2D = 'round';
  c.default_bonds_useJMOLColors = false;
  c.default_bonds_usePYMOLColors = false;
  c.default_bonds_colorGradient = false;
  c.default_bonds_saturationAngle_2D = m.PI / 3;
  c.default_bonds_symmetrical_2D = false;
  c.default_bonds_clearOverlaps_2D = false;
  c.default_bonds_overlapClearWidth_2D = .5;
  c.default_bonds_atomLabelBuffer_2D = 1;
  c.default_bonds_wedgeThickness_2D = .22;
  c.default_bonds_hashWidth_2D = 1;
  c.default_bonds_hashSpacing_2D = 2.5;
  c.default_bonds_dotSize_2D = 2;
  c.default_bonds_showBondOrders_3D = false;
  c.default_bonds_resolution_3D = 60;
  c.default_bonds_renderAsLines_3D = false;
  c.default_bonds_cylinderDiameter_3D = .3;
  c.default_bonds_pillLatitudeResolution_3D = 10;
  c.default_bonds_pillLongitudeResolution_3D = 20;
  c.default_bonds_pillHeight_3D = .3;
  c.default_bonds_pillSpacing_3D = .1;
  c.default_bonds_pillDiameter_3D = .3;
  c.default_bonds_materialAmbientColor_3D = '#222222';
  c.default_bonds_materialSpecularColor_3D = '#555555';
  c.default_bonds_materialShininess_3D = 32;

  // default macromolecular properties
  c.default_proteins_displayRibbon = true;
  c.default_proteins_displayBackbone = false;
  c.default_proteins_backboneThickness = 1.5;
  c.default_proteins_backboneColor = '#CCCCCC';
  c.default_proteins_ribbonCartoonize = false;
  c.default_proteins_useShapelyColors = false;
  c.default_proteins_useAminoColors = false;
  c.default_proteins_usePolarityColors = false;
  c.default_proteins_primaryColor = '#FF0D0D';
  c.default_proteins_secondaryColor = '#FFFF30';
  c.default_proteins_ribbonCartoonHelixPrimaryColor = '#00E740';
  c.default_proteins_ribbonCartoonHelixSecondaryColor = '#9905FF';
  c.default_proteins_ribbonCartoonSheetColor = '#E8BB99';
  c.default_proteins_ribbonThickness = .2;
  c.default_proteins_verticalResolution = 10;
  c.default_proteins_horizontalResolution = 9;
  c.default_proteins_materialAmbientColor_3D = '#222222';
  c.default_proteins_materialSpecularColor_3D = '#555555';
  c.default_proteins_materialShininess_3D = 32;
  c.default_nucleics_display = true;
  c.default_nucleics_tubeColor = '#CCCCCC';
  c.default_nucleics_baseColor = '#C10000';
  c.default_nucleics_useShapelyColors = true;
  c.default_nucleics_tubeThickness = 1.5;
  c.default_nucleics_tubeResolution_3D = 60;
  c.default_nucleics_verticalResolution = 10;
  c.default_nucleics_materialAmbientColor_3D = '#222222';
  c.default_nucleics_materialSpecularColor_3D = '#555555';
  c.default_nucleics_materialShininess_3D = 32;
  c.default_macro_displayAtoms = false;
  c.default_macro_displayBonds = false;
  c.default_macro_atomToLigandDistance = -1;
  c.default_macro_showWater = false;
  c.default_macro_colorByChain = false;

  // default surface properties
  c.default_surfaces_display = true;
  c.default_surfaces_style = 'Dot';
  c.default_surfaces_color = '#E9B862';
  c.default_surfaces_materialAmbientColor_3D = '#000000';
  c.default_surfaces_materialSpecularColor_3D = '#000000';
  c.default_surfaces_materialShininess_3D = 32;

  // default crystallographic properties
  c.default_crystals_displayUnitCell = true;
  c.default_crystals_unitCellColor = 'green';
  c.default_crystals_unitCellLineWidth = 1;

  // default spectrum properties
  c.default_plots_color = '#000000';
  c.default_plots_width = 1;
  c.default_plots_showIntegration = false;
  c.default_plots_integrationColor = '#c10000';
  c.default_plots_integrationLineWidth = 1;
  c.default_plots_showGrid = false;
  c.default_plots_gridColor = 'gray';
  c.default_plots_gridLineWidth = .5;
  c.default_plots_showYAxis = true;
  c.default_plots_flipXAxis = false;

  // default shape properties
  c.default_text_font_size = 12;
  c.default_text_font_families = [ 'Helvetica', 'Arial', 'Dialog' ];
  c.default_text_font_bold = true;
  c.default_text_font_italic = false;
  c.default_text_font_stroke_3D = true;
  c.default_text_color = '#000000';
  c.default_shapes_color = '#000000';
  c.default_shapes_lineWidth_2D = 1;
  c.default_shapes_arrowLength_2D = 8;
  c.default_compass_display = false;
  c.default_compass_axisXColor_3D = '#FF0000';
  c.default_compass_axisYColor_3D = '#00FF00';
  c.default_compass_axisZColor_3D = '#0000FF';
  c.default_compass_size_3D = 50;
  c.default_compass_resolution_3D = 10;
  c.default_compass_displayText_3D = true;

  structures.VisualSpecifications = function() {
    // canvas properties
    this.backgroundColor = c.default_backgroundColor;
    this.scale = c.default_scale;
    this.rotateAngle = c.default_rotateAngle;
    this.bondLength = c.default_bondLength_2D;
    this.angstromsPerBondLength = c.default_angstromsPerBondLength;
    this.lightDirection_3D = c.default_lightDirection_3D;
    this.lightDiffuseColor_3D = c.default_lightDiffuseColor_3D;
    this.lightSpecularColor_3D = c.default_lightSpecularColor_3D;
    this.projectionPerspective_3D = c.default_projectionPerspective_3D;
    this.projectionPerspectiveVerticalFieldOfView_3D = c.default_projectionPerspectiveVerticalFieldOfView_3D;
    this.projectionOrthoWidth_3D = c.default_projectionOrthoWidth_3D;
    this.projectionWidthHeightRatio_3D = c.default_projectionWidthHeightRatio_3D;
    this.projectionFrontCulling_3D = c.default_projectionFrontCulling_3D;
    this.projectionBackCulling_3D = c.default_projectionBackCulling_3D;
    this.cullBackFace_3D = c.default_cullBackFace_3D;
    this.fog_mode_3D = c.default_fog_mode_3D;
    this.fog_color_3D = c.default_fog_color_3D;
    this.fog_start_3D = c.default_fog_start_3D;
    this.fog_end_3D = c.default_fog_end_3D;
    this.fog_density_3D = c.default_fog_density_3D;

    // atom properties
    this.atoms_display = c.default_atoms_display;
    this.atoms_color = c.default_atoms_color;
    this.atoms_font_size_2D = c.default_atoms_font_size_2D;
    this.atoms_font_families_2D = [];
    for ( var i = 0, ii = c.default_atoms_font_families_2D.length; i < ii; i++) {
      this.atoms_font_families_2D[i] = c.default_atoms_font_families_2D[i];
    }
    this.atoms_font_bold_2D = c.default_atoms_font_bold_2D;
    this.atoms_font_italic_2D = c.default_atoms_font_italic_2D;
    this.atoms_circles_2D = c.default_atoms_circles_2D;
    this.atoms_circleDiameter_2D = c.default_atoms_circleDiameter_2D;
    this.atoms_circleBorderWidth_2D = c.default_atoms_circleBorderWidth_2D;
    this.atoms_lonePairDistance_2D = c.default_atoms_lonePairDistance_2D;
    this.atoms_lonePairSpread_2D = c.default_atoms_lonePairSpread_2D;
    this.atoms_lonePairDiameter_2D = c.default_atoms_lonePairDiameter_2D;
    this.atoms_useJMOLColors = c.default_atoms_useJMOLColors;
    this.atoms_usePYMOLColors = c.default_atoms_usePYMOLColors;
    this.atoms_resolution_3D = c.default_atoms_resolution_3D;
    this.atoms_sphereDiameter_3D = c.default_atoms_sphereDiameter_3D;
    this.atoms_useVDWDiameters_3D = c.default_atoms_useVDWDiameters_3D;
    this.atoms_vdwMultiplier_3D = c.default_atoms_vdwMultiplier_3D;
    this.atoms_materialAmbientColor_3D = c.default_atoms_materialAmbientColor_3D;
    this.atoms_materialSpecularColor_3D = c.default_atoms_materialSpecularColor_3D;
    this.atoms_materialShininess_3D = c.default_atoms_materialShininess_3D;
    this.atoms_implicitHydrogens_2D = c.default_atoms_implicitHydrogens_2D;
    this.atoms_displayTerminalCarbonLabels_2D = c.default_atoms_displayTerminalCarbonLabels_2D;
    this.atoms_showHiddenCarbons_2D = c.default_atoms_showHiddenCarbons_2D;
    this.atoms_showAttributedCarbons_2D = c.default_atoms_showAttributedCarbons_2D;
    this.atoms_displayAllCarbonLabels_2D = c.default_atoms_displayAllCarbonLabels_2D;
    this.atoms_nonBondedAsStars_3D = c.default_atoms_nonBondedAsStars_3D;
    this.atoms_displayLabels_3D = c.default_atoms_displayLabels_3D;

    // bond properties
    this.bonds_display = c.default_bonds_display;
    this.bonds_color = c.default_bonds_color;
    this.bonds_width_2D = c.default_bonds_width_2D;
    this.bonds_saturationWidth_2D = c.default_bonds_saturationWidth_2D;
    this.bonds_ends_2D = c.default_bonds_ends_2D;
    this.bonds_useJMOLColors = c.default_bonds_useJMOLColors;
    this.bonds_usePYMOLColors = c.default_bonds_usePYMOLColors;
    this.bonds_colorGradient = c.default_bonds_colorGradient;
    this.bonds_saturationAngle_2D = c.default_bonds_saturationAngle_2D;
    this.bonds_symmetrical_2D = c.default_bonds_symmetrical_2D;
    this.bonds_clearOverlaps_2D = c.default_bonds_clearOverlaps_2D;
    this.bonds_overlapClearWidth_2D = c.default_bonds_overlapClearWidth_2D;
    this.bonds_atomLabelBuffer_2D = c.default_bonds_atomLabelBuffer_2D;
    this.bonds_wedgeThickness_2D = c.default_bonds_wedgeThickness_2D;
    this.bonds_hashWidth_2D = c.default_bonds_hashWidth_2D;
    this.bonds_hashSpacing_2D = c.default_bonds_hashSpacing_2D;
    this.bonds_dotSize_2D = c.default_bonds_dotSize_2D;
    this.bonds_showBondOrders_3D = c.default_bonds_showBondOrders_3D;
    this.bonds_resolution_3D = c.default_bonds_resolution_3D;
    this.bonds_renderAsLines_3D = c.default_bonds_renderAsLines_3D;
    this.bonds_cylinderDiameter_3D = c.default_bonds_cylinderDiameter_3D;
    this.bonds_pillHeight_3D = c.default_bonds_pillHeight_3D;
    this.bonds_pillLatitudeResolution_3D = c.default_bonds_pillLatitudeResolution_3D;
    this.bonds_pillLongitudeResolution_3D = c.default_bonds_pillLongitudeResolution_3D;
    this.bonds_pillSpacing_3D = c.default_bonds_pillSpacing_3D;
    this.bonds_pillDiameter_3D = c.default_bonds_pillDiameter_3D;
    this.bonds_materialAmbientColor_3D = c.default_bonds_materialAmbientColor_3D;
    this.bonds_materialSpecularColor_3D = c.default_bonds_materialSpecularColor_3D;
    this.bonds_materialShininess_3D = c.default_bonds_materialShininess_3D;

    // macromolecular properties
    this.proteins_displayRibbon = c.default_proteins_displayRibbon;
    this.proteins_displayBackbone = c.default_proteins_displayBackbone;
    this.proteins_backboneThickness = c.default_proteins_backboneThickness;
    this.proteins_backboneColor = c.default_proteins_backboneColor;
    this.proteins_ribbonCartoonize = c.default_proteins_ribbonCartoonize;
    this.proteins_useShapelyColors = c.default_proteins_useShapelyColors;
    this.proteins_useAminoColors = c.default_proteins_useAminoColors;
    this.proteins_usePolarityColors = c.default_proteins_usePolarityColors;
    this.proteins_primaryColor = c.default_proteins_primaryColor;
    this.proteins_secondaryColor = c.default_proteins_secondaryColor;
    this.proteins_ribbonCartoonHelixPrimaryColor = c.default_proteins_ribbonCartoonHelixPrimaryColor;
    this.proteins_ribbonCartoonHelixSecondaryColor = c.default_proteins_ribbonCartoonHelixSecondaryColor;
    this.proteins_ribbonCartoonSheetColor = c.default_proteins_ribbonCartoonSheetColor;
    this.proteins_ribbonThickness = c.default_proteins_ribbonThickness;
    this.proteins_verticalResolution = c.default_proteins_verticalResolution;
    this.proteins_horizontalResolution = c.default_proteins_horizontalResolution;
    this.proteins_materialAmbientColor_3D = c.default_proteins_materialAmbientColor_3D;
    this.proteins_materialSpecularColor_3D = c.default_proteins_materialSpecularColor_3D;
    this.proteins_materialShininess_3D = c.default_proteins_materialShininess_3D;
    this.macro_displayAtoms = c.default_macro_displayAtoms;
    this.macro_displayBonds = c.default_macro_displayBonds;
    this.macro_atomToLigandDistance = c.default_macro_atomToLigandDistance;
    this.nucleics_display = c.default_nucleics_display;
    this.nucleics_tubeColor = c.default_nucleics_tubeColor;
    this.nucleics_baseColor = c.default_nucleics_baseColor;
    this.nucleics_useShapelyColors = c.default_nucleics_useShapelyColors;
    this.nucleics_tubeThickness = c.default_nucleics_tubeThickness;
    this.nucleics_tubeResolution_3D = c.default_nucleics_tubeResolution_3D;
    this.nucleics_verticalResolution = c.default_nucleics_verticalResolution;
    this.nucleics_materialAmbientColor_3D = c.default_nucleics_materialAmbientColor_3D;
    this.nucleics_materialSpecularColor_3D = c.default_nucleics_materialSpecularColor_3D;
    this.nucleics_materialShininess_3D = c.default_nucleics_materialShininess_3D;
    this.macro_showWater = c.default_macro_showWater;
    this.macro_colorByChain = c.default_macro_colorByChain;

    // surface properties
    this.surfaces_display = c.default_surfaces_display;
    this.surfaces_style = c.default_surfaces_style;
    this.surfaces_color = c.default_surfaces_color;
    this.surfaces_materialAmbientColor_3D = c.default_surfaces_materialAmbientColor_3D;
    this.surfaces_materialSpecularColor_3D = c.default_surfaces_materialSpecularColor_3D;
    this.surfaces_materialShininess_3D = c.default_surfaces_materialShininess_3D;

    // crystallographic properties
    this.crystals_displayUnitCell = c.default_crystals_displayUnitCell;
    this.crystals_unitCellColor = c.default_crystals_unitCellColor;
    this.crystals_unitCellLineWidth = c.default_crystals_unitCellLineWidth;

    // spectrum properties
    this.plots_color = c.default_plots_color;
    this.plots_width = c.default_plots_width;
    this.plots_showIntegration = c.default_plots_showIntegration;
    this.plots_integrationColor = c.default_plots_integrationColor;
    this.plots_integrationLineWidth = c.default_plots_integrationLineWidth;
    this.plots_showGrid = c.default_plots_showGrid;
    this.plots_gridColor = c.default_plots_gridColor;
    this.plots_gridLineWidth = c.default_plots_gridLineWidth;
    this.plots_showYAxis = c.default_plots_showYAxis;
    this.plots_flipXAxis = c.default_plots_flipXAxis;

    // shape properties
    this.text_font_size = c.default_text_font_size;
    this.text_font_families = [];
    for ( var i = 0, ii = c.default_text_font_families.length; i < ii; i++) {
      this.text_font_families[i] = c.default_text_font_families[i];
    }
    this.text_font_bold = c.default_text_font_bold;
    this.text_font_italic = c.default_text_font_italic;
    this.text_font_stroke_3D = c.default_text_font_stroke_3D;
    this.text_color = c.default_text_color;
    this.shapes_color = c.default_shapes_color;
    this.shapes_lineWidth_2D = c.default_shapes_lineWidth_2D;
    this.shapes_arrowLength_2D = c.default_shapes_arrowLength_2D;
    this.compass_display = c.default_compass_display;
    this.compass_axisXColor_3D = c.default_compass_axisXColor_3D;
    this.compass_axisYColor_3D = c.default_compass_axisYColor_3D;
    this.compass_axisZColor_3D = c.default_compass_axisZColor_3D;
    this.compass_size_3D = c.default_compass_size_3D;
    this.compass_resolution_3D = c.default_compass_resolution_3D;
    this.compass_displayText_3D = c.default_compass_displayText_3D;
  };
  var _ = structures.VisualSpecifications.prototype;
  _.set3DRepresentation = function(representation) {
    this.atoms_display = true;
    this.bonds_display = true;
    this.bonds_color = '#777777';
    this.atoms_useVDWDiameters_3D = true;
    this.atoms_useJMOLColors = true;
    this.bonds_useJMOLColors = true;
    this.bonds_showBondOrders_3D = true;
    this.bonds_renderAsLines_3D = false;
    if (representation === 'Ball and Stick') {
      this.atoms_vdwMultiplier_3D = .3;
      this.bonds_useJMOLColors = false;
      this.bonds_cylinderDiameter_3D = .3;
      this.bonds_materialAmbientColor_3D = c.default_atoms_materialAmbientColor_3D;
      this.bonds_pillDiameter_3D = .15;
    } else if (representation === 'van der Waals Spheres') {
      this.bonds_display = false;
      this.atoms_vdwMultiplier_3D = 1;
    } else if (representation === 'Stick') {
      this.atoms_useVDWDiameters_3D = false;
      this.bonds_showBondOrders_3D = false;
      this.bonds_cylinderDiameter_3D = this.atoms_sphereDiameter_3D = .8;
      this.bonds_materialAmbientColor_3D = this.atoms_materialAmbientColor_3D;
    } else if (representation === 'Wireframe') {
      this.atoms_useVDWDiameters_3D = false;
      this.bonds_cylinderDiameter_3D = this.bonds_pillDiameter_3D = .05;
      this.atoms_sphereDiameter_3D = .15;
      this.bonds_materialAmbientColor_3D = c.default_atoms_materialAmbientColor_3D;
    } else if (representation === 'Line') {
      this.atoms_display = false;
      this.bonds_renderAsLines_3D = true;
      this.bonds_width_2D = 1;
      this.bonds_cylinderDiameter_3D = .05;
    } else {
      alert('"' + representation + '" is not recognized. Use one of the following strings:\n\n' + '1. Ball and Stick\n' + '2. van der Waals Spheres\n' + '3. Stick\n' + '4. Wireframe\n' + '5. Line\n');
    }
  };

})(ChemDoodle, ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(c, ELEMENT, informatics, structures) {
  'use strict';
  informatics.getPointsPerAngstrom = function() {
    return c.default_bondLength_2D / c.default_angstromsPerBondLength;
  };

  informatics.BondDeducer = function() {
  };
  var _ = informatics.BondDeducer.prototype;
  _.margin = 1.1;
  _.deduceCovalentBonds = function(molecule, customPointsPerAngstrom) {
    var pointsPerAngstrom = informatics.getPointsPerAngstrom();
    if (customPointsPerAngstrom) {
      pointsPerAngstrom = customPointsPerAngstrom;
    }
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      for ( var j = i + 1; j < ii; j++) {
        var first = molecule.atoms[i];
        var second = molecule.atoms[j];
        if (first.distance3D(second) < (ELEMENT[first.label].covalentRadius + ELEMENT[second.label].covalentRadius) * pointsPerAngstrom * this.margin) {
          molecule.bonds.push(new structures.Bond(first, second, 1));
        }
      }
    }
  };

})(ChemDoodle, ChemDoodle.ELEMENT, ChemDoodle.informatics, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(informatics) {
  'use strict';
  informatics.HydrogenDeducer = function() {
  };
  var _ = informatics.HydrogenDeducer.prototype;
  _.removeHydrogens = function(molecule) {
    var atoms = [];
    var bonds = [];
    for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
      if (molecule.bonds[i].a1.label !== 'H' && molecule.bonds[i].a2.label !== 'H') {
        bonds.push(molecule.bonds[i]);
      }
    }
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      if (molecule.atoms[i].label !== 'H') {
        atoms.push(molecule.atoms[i]);
      }
    }
    molecule.atoms = atoms;
    molecule.bonds = bonds;
  };

})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3103 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-20 12:58:08 -0500 (Sun, 20 Feb 2011) $
//
(function(c, informatics, d3) {
  'use strict';
  informatics.MolecularSurfaceGenerator = function() {
  };
  var _ = informatics.MolecularSurfaceGenerator.prototype;
  _.generateSurface = function(molecule, latitudeBands, longitudeBands, probeRadius, atomRadius) {
    return new d3.MolecularSurface(molecule, latitudeBands, longitudeBands, probeRadius, atomRadius);
  };

})(ChemDoodle, ChemDoodle.informatics, ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3103 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-20 12:58:08 -0500 (Sun, 20 Feb 2011) $
//
(function(informatics, structures) {
  'use strict';
  informatics.Splitter = function() {
  };
  var _ = informatics.Splitter.prototype;
  _.split = function(molecule) {
    var mols = [];
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      molecule.atoms[i].visited = false;
    }
    for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
      molecule.bonds[i].visited = false;
    }
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      var a = molecule.atoms[i];
      if (!a.visited) {
        var newMol = new structures.Molecule();
        newMol.atoms.push(a);
        a.visited = true;
        var q = new structures.Queue();
        q.enqueue(a);
        while (!q.isEmpty()) {
          var atom = q.dequeue();
          for ( var j = 0, jj = molecule.bonds.length; j < jj; j++) {
            var b = molecule.bonds[j];
            if (b.contains(atom) && !b.visited) {
              b.visited = true;
              newMol.bonds.push(b);
              var neigh = b.getNeighbor(atom);
              if (!neigh.visited) {
                neigh.visited = true;
                newMol.atoms.push(neigh);
                q.enqueue(neigh);
              }
            }
          }
        }
        mols.push(newMol);
      }
    }
    return mols;
  };

})(ChemDoodle.informatics, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4208 $
//  $Author: kevin $
//  $LastChangedDate: 2013-03-24 10:31:41 -0400 (Sun, 24 Mar 2013) $
//
(function(informatics, io, structures) {
  'use strict';
  informatics.StructureBuilder = function() {
  };
  var _ = informatics.StructureBuilder.prototype;
  _.copy = function(molecule) {
    var json = new io.JSONInterpreter();
    return json.molFrom(json.molTo(molecule));
  };

})(ChemDoodle.informatics, ChemDoodle.io, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(informatics) {
  'use strict';
  informatics._Counter = function() {
  };
  var _ = informatics._Counter.prototype;
  _.value = 0;
  _.molecule = undefined;
  _.setMolecule = function(molecule) {
    this.value = 0;
    this.molecule = molecule;
    if (this.innerCalculate) {
      this.innerCalculate();
    }
  };
})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(informatics) {
  'use strict';
  informatics.FrerejacqueNumberCounter = function(molecule) {
    this.setMolecule(molecule);
  };
  var _ = informatics.FrerejacqueNumberCounter.prototype = new informatics._Counter();
  _.innerCalculate = function() {
    this.value = this.molecule.bonds.length - this.molecule.atoms.length + new informatics.NumberOfMoleculesCounter(this.molecule).value;
  };
})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(structures, informatics) {
  'use strict';
  informatics.NumberOfMoleculesCounter = function(molecule) {
    this.setMolecule(molecule);
  };
  var _ = informatics.NumberOfMoleculesCounter.prototype = new informatics._Counter();
  _.innerCalculate = function() {
    for ( var i = 0, ii = this.molecule.atoms.length; i < ii; i++) {
      this.molecule.atoms[i].visited = false;
    }
    for ( var i = 0, ii = this.molecule.atoms.length; i < ii; i++) {
      if (!this.molecule.atoms[i].visited) {
        this.value++;
        var q = new structures.Queue();
        this.molecule.atoms[i].visited = true;
        q.enqueue(this.molecule.atoms[i]);
        while (!q.isEmpty()) {
          var atom = q.dequeue();
          for ( var j = 0, jj = this.molecule.bonds.length; j < jj; j++) {
            var b = this.molecule.bonds[j];
            if (b.contains(atom)) {
              var neigh = b.getNeighbor(atom);
              if (!neigh.visited) {
                neigh.visited = true;
                q.enqueue(neigh);
              }
            }
          }
        }
      }
    }
  };
})(ChemDoodle.structures, ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4137 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-22 12:46:00 -0500 (Fri, 22 Feb 2013) $
//

(function(informatics) {
  'use strict';
  informatics._RingFinder = function() {
  };
  var _ = informatics._RingFinder.prototype;
  _.atoms = undefined;
  _.bonds = undefined;
  _.rings = undefined;
  _.reduce = function(molecule) {
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      molecule.atoms[i].visited = false;
    }
    for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
      molecule.bonds[i].visited = false;
    }
    var cont = true;
    while (cont) {
      cont = false;
      for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
        var count = 0;
        var bond;
        for ( var j = 0, jj = molecule.bonds.length; j < jj; j++) {
          if (molecule.bonds[j].contains(molecule.atoms[i]) && !molecule.bonds[j].visited) {
            count++;
            if (count === 2) {
              break;
            }
            bond = molecule.bonds[j];
          }
        }
        if (count === 1) {
          cont = true;
          bond.visited = true;
          molecule.atoms[i].visited = true;
        }
      }
    }
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      if (!molecule.atoms[i].visited) {
        this.atoms.push(molecule.atoms[i]);
      }
    }
    for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
      if (!molecule.bonds[i].visited) {
        this.bonds.push(molecule.bonds[i]);
      }
    }
    if (this.bonds.length === 0 && this.atoms.length !== 0) {
      this.atoms = [];
    }
  };
  _.setMolecule = function(molecule) {
    this.atoms = [];
    this.bonds = [];
    this.rings = [];
    this.reduce(molecule);
    if (this.atoms.length > 2 && this.innerGetRings) {
      this.innerGetRings();
    }
  };
  _.fuse = function() {
    for ( var i = 0, ii = this.rings.length; i < ii; i++) {
      for ( var j = 0, jj = this.bonds.length; j < jj; j++) {
        if (this.rings[i].atoms.indexOf(this.bonds[j].a1) !== -1 && this.rings[i].atoms.indexOf(this.bonds[j].a2) !== -1) {
          this.rings[i].bonds.push(this.bonds[j]);
        }
      }
    }
  };

})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4137 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-22 12:46:00 -0500 (Fri, 22 Feb 2013) $
//
(function(informatics, structures) {
  'use strict';
  function Finger(a, from) {
    this.atoms = [];
    if (from) {
      for ( var i = 0, ii = from.atoms.length; i < ii; i++) {
        this.atoms[i] = from.atoms[i];
      }
    }
    this.atoms.push(a);
  }
  var _2 = Finger.prototype;
  _2.grow = function(bonds, blockers) {
    var last = this.atoms[this.atoms.length - 1];
    var neighs = [];
    for ( var i = 0, ii = bonds.length; i < ii; i++) {
      if (bonds[i].contains(last)) {
        var neigh = bonds[i].getNeighbor(last);
        if (blockers.indexOf(neigh) === -1) {
          neighs.push(neigh);
        }
      }
    }
    var returning = [];
    for ( var i = 0, ii = neighs.length; i < ii; i++) {
      returning.push(new Finger(neighs[i], this));
    }
    return returning;
  };
  _2.check = function(bonds, finger, a) {
    // check that they dont contain similar parts
    for ( var i = 0, ii = finger.atoms.length - 1; i < ii; i++) {
      if (this.atoms.indexOf(finger.atoms[i]) !== -1) {
        return undefined;
      }
    }
    var ring;
    // check if fingers meet at tips
    if (finger.atoms[finger.atoms.length - 1] === this.atoms[this.atoms.length - 1]) {
      ring = new structures.Ring();
      ring.atoms[0] = a;
      for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
        ring.atoms.push(this.atoms[i]);
      }
      for ( var i = finger.atoms.length - 2; i >= 0; i--) {
        ring.atoms.push(finger.atoms[i]);
      }
    } else {
      // check if fingers meet at bond
      var endbonds = [];
      for ( var i = 0, ii = bonds.length; i < ii; i++) {
        if (bonds[i].contains(finger.atoms[finger.atoms.length - 1])) {
          endbonds.push(bonds[i]);
        }
      }
      for ( var i = 0, ii = endbonds.length; i < ii; i++) {
        if ((finger.atoms.length === 1 || !endbonds[i].contains(finger.atoms[finger.atoms.length - 2])) && endbonds[i].contains(this.atoms[this.atoms.length - 1])) {
          ring = new structures.Ring();
          ring.atoms[0] = a;
          for ( var j = 0, jj = this.atoms.length; j < jj; j++) {
            ring.atoms.push(this.atoms[j]);
          }
          for ( var j = finger.atoms.length - 1; j >= 0; j--) {
            ring.atoms.push(finger.atoms[j]);
          }
          break;
        }
      }
    }
    return ring;
  };

  informatics.EulerFacetRingFinder = function(molecule) {
    this.setMolecule(molecule);
  };
  var _ = informatics.EulerFacetRingFinder.prototype = new informatics._RingFinder();
  _.fingerBreak = 5;
  _.innerGetRings = function() {
    for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
      var neigh = [];
      for ( var j = 0, jj = this.bonds.length; j < jj; j++) {
        if (this.bonds[j].contains(this.atoms[i])) {
          neigh.push(this.bonds[j].getNeighbor(this.atoms[i]));
        }
      }
      for ( var j = 0, jj = neigh.length; j < jj; j++) {
        // weird that i can't optimize this loop without breaking a test
        // case...
        for ( var k = j + 1; k < neigh.length; k++) {
          var fingers = [];
          fingers[0] = new Finger(neigh[j]);
          fingers[1] = new Finger(neigh[k]);
          var blockers = [];
          blockers[0] = this.atoms[i];
          for ( var l = 0, ll = neigh.length; l < ll; l++) {
            if (l !== j && l !== k) {
              blockers.push(neigh[l]);
            }
          }
          var found = [];
          // check for 3 membered ring
          var three = fingers[0].check(this.bonds, fingers[1], this.atoms[i]);
          if (three) {
            found[0] = three;
          }
          while (found.length === 0 && fingers.length > 0 && fingers[0].atoms.length < this.fingerBreak) {
            var newfingers = [];
            for ( var l = 0, ll = fingers.length; l < ll; l++) {
              var adding = fingers[l].grow(this.bonds, blockers);
              for ( var m = 0, mm = adding.length; m < mm; m++) {
                newfingers.push(adding[m]);
              }
            }
            fingers = newfingers;
            for ( var l = 0, ll = fingers.length; l < ll; l++) {
              for ( var m = l + 1; m < ll; m++) {
                var r = fingers[l].check(this.bonds, fingers[m], this.atoms[i]);
                if (r) {
                  found.push(r);
                }
              }
            }
            if (found.length === 0) {
              var newBlockers = [];
              for ( var l = 0, ll = blockers.length; l < ll; l++) {
                for ( var m = 0, mm = this.bonds.length; m < mm; m++) {
                  if (this.bonds[m].contains(blockers[l])) {
                    var neigh = this.bonds[m].getNeighbor(blockers[l]);
                    if (blockers.indexOf(neigh) === -1 && newBlockers.indexOf(neigh) === -1) {
                      newBlockers.push(neigh);
                    }
                  }
                }
              }
              for ( var l = 0, ll = newBlockers.length; l < ll; l++) {
                blockers.push(newBlockers[l]);
              }
            }
          }
          if (found.length > 0) {
            // this undefined is required...weird, don't know why
            var use = undefined;
            for ( var l = 0, ll = found.length; l < ll; l++) {
              if (!use || use.atoms.length > found[l].atoms.length) {
                use = found[l];
              }
            }
            var already = false;
            for ( var l = 0, ll = this.rings.length; l < ll; l++) {
              var all = true;
              for ( var m = 0, mm = use.atoms.length; m < mm; m++) {
                if (this.rings[l].atoms.indexOf(use.atoms[m]) === -1) {
                  all = false;
                  break;
                }
              }
              if (all) {
                already = true;
                break;
              }
            }
            if (!already) {
              this.rings.push(use);
            }
          }
        }
      }
    }
    this.fuse();
  };

})(ChemDoodle.informatics, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(informatics) {
  'use strict';
  informatics.SSSRFinder = function(molecule) {
    this.rings = [];
    if (molecule.atoms.length > 0) {
      var frerejacqueNumber = new informatics.FrerejacqueNumberCounter(molecule).value;
      var all = new informatics.EulerFacetRingFinder(molecule).rings;
      all.sort(function(a, b) {
        return a.atoms.length - b.atoms.length;
      });
      for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
        molecule.bonds[i].visited = false;
      }
      for ( var i = 0, ii = all.length; i < ii; i++) {
        var use = false;
        for ( var j = 0, jj = all[i].bonds.length; j < jj; j++) {
          if (!all[i].bonds[j].visited) {
            use = true;
            break;
          }
        }
        if (use) {
          for ( var j = 0, jj = all[i].bonds.length; j < jj; j++) {
            all[i].bonds[j].visited = true;
          }
          this.rings.push(all[i]);
        }
        if (this.rings.length === frerejacqueNumber) {
          break;
        }
      }
    }
  };

})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3915 $
//  $Author: kevin $
//  $LastChangedDate: 2012-11-30 12:11:00 -0500 (Fri, 30 Nov 2012) $
//
(function(io) {
  'use strict';
  io._Interpreter = function() {
  };
  var _ = io._Interpreter.prototype;
  _.fit = function(data, length, leftAlign) {
    var size = data.length;
    var padding = [];
    for ( var i = 0; i < length - size; i++) {
      padding.push(' ');
    }
    return leftAlign ? data + padding.join('') : padding.join('') + data;
  };

})(ChemDoodle.io);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3385 $
//  $Author: kevin $
//  $LastChangedDate: 2011-09-18 11:40:07 -0400 (Sun, 18 Sep 2011) $
//

(function(c, extensions, io, structures, m, m4, v3) {
  'use strict';
  var whitespaceRegex = /\s+/g;
  var whitespaceAndParenthesisRegex = /\(|\)|\s+/g;
  var whitespaceAndQuoteRegex = /\'|\s+/g;
  var whitespaceAndQuoteAndCommaRegex = /,|\'|\s+/g;
  var leadingWhitespaceRegex = /^\s+/;
  var digitsRegex = /[0-9]/g;
  var digitsSymbolRegex = /[0-9]|\+|\-/g;

  var filter = function(s) {
    return s.length !== 0;
  };

  var hallTranslations = {
    'P' : [],
    'A' : [ [ 0, .5, .5 ] ],
    'B' : [ [ .5, 0, .5 ] ],
    'C' : [ [ .5, .5, 0 ] ],
    'I' : [ [ .5, .5, .5 ] ],
    'R' : [ [ 2 / 3, 1 / 3, 1 / 3 ], [ 1 / 3, 2 / 3, 2 / 3 ] ],
    'S' : [ [ 1 / 3, 1 / 3, 2 / 3 ], [ 2 / 3, 2 / 3, 1 / 3 ] ],
    'T' : [ [ 1 / 3, 2 / 3, 1 / 3 ], [ 2 / 3, 1 / 3, 2 / 3 ] ],
    'F' : [ [ 0, .5, .5 ], [ .5, 0, .5 ], [ .5, .5, 0 ] ]
  };

  var parseTransform = function(s) {
    var displacement = 0;
    var x = 0, y = 0, z = 0;
    var indexx = s.indexOf('x');
    var indexy = s.indexOf('y');
    var indexz = s.indexOf('z');
    if (indexx !== -1) {
      x++;
      if (indexx > 0 && s.charAt(indexx - 1) !== '+') {
        x *= -1;
      }
    }
    if (indexy !== -1) {
      y++;
      if (indexy > 0 && s.charAt(indexy - 1) !== '+') {
        y *= -1;
      }
    }
    if (indexz !== -1) {
      z++;
      if (indexz > 0 && s.charAt(indexz - 1) !== '+') {
        z *= -1;
      }
    }
    if (s.length > 2) {
      var op = '+';
      for ( var i = 0, ii = s.length; i < ii; i++) {
        var l = s.charAt(i);
        if ((l === '-' || l === '/') && (i === s.length - 1 || s.charAt(i + 1).match(digitsRegex))) {
          op = l;
        }
        if (l.match(digitsRegex)) {
          if (op === '+') {
            displacement += parseInt(l);
          } else if (op === '-') {
            displacement -= parseInt(l);
          } else if (op === '/') {
            displacement /= parseInt(l);
          }
        }
      }
    }
    return [ displacement, x, y, z ];
  };

  var generateABC2XYZ = function(a, b, c, alpha, beta, gamma) {
    var d = (m.cos(alpha) - m.cos(gamma) * m.cos(beta)) / m.sin(gamma);
    return [ a, 0, 0, 0, b * m.cos(gamma), b * m.sin(gamma), 0, 0, c * m.cos(beta), c * d, c * m.sqrt(1 - m.pow(m.cos(beta), 2) - d * d), 0, 0, 0, 0, 1 ];
  };

  io.CIFInterpreter = function() {
  };
  var _ = io.CIFInterpreter.prototype = new io._Interpreter();
  _.read = function(content, xSuper, ySuper, zSuper) {
    xSuper = xSuper ? xSuper : 1;
    ySuper = ySuper ? ySuper : 1;
    zSuper = zSuper ? zSuper : 1;
    var molecule = new structures.Molecule();
    if (!content) {
      return molecule;
    }
    var lines = content.split('\n');
    var aLength = 0, bLength = 0, cLength = 0, alphaAngle = 0, betaAngle = 0, gammaAngle = 0;
    var hallClass = 'P';
    var transformLoop;
    var atomLoop;
    var bondLoop;

    var line;
    var shift = true;
    while (lines.length > 0) {
      if (shift) {
        line = lines.shift();
      } else {
        shift = true;
      }
      if (line.length > 0) {
        if (extensions.stringStartsWith(line, '_cell_length_a')) {
          aLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
        } else if (extensions.stringStartsWith(line, '_cell_length_b')) {
          bLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
        } else if (extensions.stringStartsWith(line, '_cell_length_c')) {
          cLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
        } else if (extensions.stringStartsWith(line, '_cell_angle_alpha')) {
          alphaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
        } else if (extensions.stringStartsWith(line, '_cell_angle_beta')) {
          betaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
        } else if (extensions.stringStartsWith(line, '_cell_angle_gamma')) {
          gammaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
        } else if (extensions.stringStartsWith(line, '_symmetry_space_group_name_H-M')) {
          hallClass = line.split(whitespaceAndQuoteRegex)[1];
        } else if (extensions.stringStartsWith(line, 'loop_')) {
          var loop = {
            fields : [],
            lines : []
          };
          var pushingLines = false;
          // keep undefined check here because the line may be an
          // empty string
          while ((line = lines.shift()) !== undefined && !extensions.stringStartsWith(line = line.replace(leadingWhitespaceRegex, ''), 'loop_') && line.length > 0) {
            // remove leading whitespace that may appear in
            // subloop lines ^
            if (extensions.stringStartsWith(line, '_')) {
              if (pushingLines) {
                break;
              }
              loop.fields = loop.fields.concat(line.split(whitespaceRegex).filter(filter));
            } else {
              pushingLines = true;
              loop.lines.push(line);
            }
          }
          if (lines.length !== 0 && (extensions.stringStartsWith(line, 'loop_') || extensions.stringStartsWith(line, '_'))) {
            shift = false;
          }
          if (loop.fields.indexOf('_symmetry_equiv_pos_as_xyz') !== -1 || loop.fields.indexOf('_space_group_symop_operation_xyz') !== -1) {
            transformLoop = loop;
          } else if (loop.fields.indexOf('_atom_site_label') !== -1) {
            atomLoop = loop;
          } else if (loop.fields.indexOf('_geom_bond_atom_site_label_1') !== -1) {
            bondLoop = loop;
          }
        }
      }
    }
    var abc2xyz = generateABC2XYZ(aLength, bLength, cLength, alphaAngle, betaAngle, gammaAngle);
    // internal atom coordinates
    if (atomLoop) {
      var labelIndex = -1, altLabelIndex = -1, xIndex = -1, yIndex = -1, zIndex = -1;
      for ( var i = 0, ii = atomLoop.fields.length; i < ii; i++) {
        var field = atomLoop.fields[i];
        if (field === '_atom_site_type_symbol') {
          labelIndex = i;
        } else if (field === '_atom_site_label') {
          altLabelIndex = i;
        } else if (field === '_atom_site_fract_x') {
          xIndex = i;
        } else if (field === '_atom_site_fract_y') {
          yIndex = i;
        } else if (field === '_atom_site_fract_z') {
          zIndex = i;
        }
      }
      for ( var i = 0, ii = atomLoop.lines.length; i < ii; i++) {
        line = atomLoop.lines[i];
        var tokens = line.split(whitespaceRegex).filter(filter);
        var a = new structures.Atom(tokens[labelIndex === -1 ? altLabelIndex : labelIndex].split(digitsSymbolRegex)[0], parseFloat(tokens[xIndex]), parseFloat(tokens[yIndex]), parseFloat(tokens[zIndex]));
        molecule.atoms.push(a);
        if (altLabelIndex !== -1) {
          a.cifId = tokens[altLabelIndex];
          a.cifPart = 0;
        }
      }
    }
    // transforms, unless bonds are specified
    if (transformLoop && !bondLoop) {
      // assume the index is 0, just incase a different identifier is
      // used
      var symIndex = 0;
      for ( var i = 0, ii = transformLoop.fields.length; i < ii; i++) {
        var field = transformLoop.fields[i];
        if (field === '_symmetry_equiv_pos_as_xyz' || field === '_space_group_symop_operation_xyz') {
          symIndex = i;
        }
      }
      var impliedTranslations = hallTranslations[hallClass];
      var add = [];
      for ( var i = 0, ii = transformLoop.lines.length; i < ii; i++) {
        var parts = transformLoop.lines[i].split(whitespaceAndQuoteAndCommaRegex).filter(filter);
        var multx = parseTransform(parts[symIndex]);
        var multy = parseTransform(parts[symIndex + 1]);
        var multz = parseTransform(parts[symIndex + 2]);
        for ( var j = 0, jj = molecule.atoms.length; j < jj; j++) {
          var a = molecule.atoms[j];
          var x = a.x * multx[1] + a.y * multx[2] + a.z * multx[3] + multx[0];
          var y = a.x * multy[1] + a.y * multy[2] + a.z * multy[3] + multy[0];
          var z = a.x * multz[1] + a.y * multz[2] + a.z * multz[3] + multz[0];
          var copy1 = new structures.Atom(a.label, x, y, z);
          add.push(copy1);
          // cifID could be 0, so check for undefined
          if (a.cifId !== undefined) {
            copy1.cifId = a.cifId;
            copy1.cifPart = i + 1;
          }
          if (impliedTranslations) {
            for ( var k = 0, kk = impliedTranslations.length; k < kk; k++) {
              var trans = impliedTranslations[k];
              var copy2 = new structures.Atom(a.label, x + trans[0], y + trans[1], z + trans[2]);
              add.push(copy2);
              // cifID could be 0, so check for undefined
              if (a.cifId !== undefined) {
                copy2.cifId = a.cifId;
                copy2.cifPart = i + 1;
              }
            }
          }
        }
      }
      // make sure all atoms are within the unit cell
      for ( var i = 0, ii = add.length; i < ii; i++) {
        var a = add[i];
        while (a.x >= 1) {
          a.x--;
        }
        while (a.x < 0) {
          a.x++;
        }
        while (a.y >= 1) {
          a.y--;
        }
        while (a.y < 0) {
          a.y++;
        }
        while (a.z >= 1) {
          a.z--;
        }
        while (a.z < 0) {
          a.z++;
        }
      }
      // remove overlaps
      var noOverlaps = [];
      for ( var i = 0, ii = add.length; i < ii; i++) {
        var overlap = false;
        var a = add[i];
        for ( var j = 0, jj = molecule.atoms.length; j < jj; j++) {
          if (molecule.atoms[j].distance3D(a) < .0001) {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          for ( var j = 0, jj = noOverlaps.length; j < jj; j++) {
            if (noOverlaps[j].distance3D(a) < .0001) {
              overlap = true;
              break;
            }
          }
          if (!overlap) {
            noOverlaps.push(a);
          }
        }
      }
      // concat arrays
      molecule.atoms = molecule.atoms.concat(noOverlaps);
    }
    // build super cell
    var extras = [];
    for ( var i = 0; i < xSuper; i++) {
      for ( var j = 0; j < ySuper; j++) {
        for ( var k = 0; k < zSuper; k++) {
          if (!(i === 0 && j === 0 && k === 0)) {
            for ( var l = 0, ll = molecule.atoms.length; l < ll; l++) {
              var a = molecule.atoms[l];
              var copy = new structures.Atom(a.label, a.x + i, a.y + j, a.z + k);
              extras.push(copy);
              // cifID could be 0, so check for undefined
              if (a.cifId !== undefined) {
                copy.cifId = a.cifId;
                copy.cifPart = a.cifPart + (transformLoop ? transformLoop.lines.length : 0) + i + j * 10 + k * 100;
              }
            }
          }
        }
      }
    }
    molecule.atoms = molecule.atoms.concat(extras);
    // convert to xyz
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      var a = molecule.atoms[i];
      var xyz = m4.multiplyVec3(abc2xyz, [ a.x, a.y, a.z ]);
      a.x = xyz[0];
      a.y = xyz[1];
      a.z = xyz[2];
    }
    // handle bonds
    if (bondLoop) {
      var atom1 = -1, atom2 = -1;
      for ( var i = 0, ii = bondLoop.fields.length; i < ii; i++) {
        var field = bondLoop.fields[i];
        if (field === '_geom_bond_atom_site_label_1') {
          atom1 = i;
        } else if (field === '_geom_bond_atom_site_label_2') {
          atom2 = i;
        }
      }
      for ( var k = 0, kk = bondLoop.lines.length; k < kk; k++) {
        var tokens = bondLoop.lines[k].split(whitespaceRegex).filter(filter);
        var id1 = tokens[atom1];
        var id2 = tokens[atom2];
        for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
          for ( var j = i + 1; j < ii; j++) {
            var ai = molecule.atoms[i];
            var aj = molecule.atoms[j];
            if (ai.cifPart !== aj.cifPart) {
              break;
            }
            if (ai.cifId === id1 && aj.cifId === id2 || ai.cifId === id2 && aj.cifId === id1) {
              molecule.bonds.push(new structures.Bond(ai, aj));
            }
          }
        }
      }
    } else {
      new c.informatics.BondDeducer().deduceCovalentBonds(molecule, 1);
    }
    // generate unit cell
    var o = [ -xSuper / 2, -ySuper / 2, -zSuper / 2 ];
    molecule.unitCellVectors = {
      o : m4.multiplyVec3(abc2xyz, o, []),
      x : m4.multiplyVec3(abc2xyz, [ o[0] + 1, o[1], o[2] ]),
      y : m4.multiplyVec3(abc2xyz, [ o[0], o[1] + 1, o[2] ]),
      z : m4.multiplyVec3(abc2xyz, [ o[0], o[1], o[2] + 1 ]),
      xy : m4.multiplyVec3(abc2xyz, [ o[0] + 1, o[1] + 1, o[2] ]),
      xz : m4.multiplyVec3(abc2xyz, [ o[0] + 1, o[1], o[2] + 1 ]),
      yz : m4.multiplyVec3(abc2xyz, [ o[0], o[1] + 1, o[2] + 1 ]),
      xyz : m4.multiplyVec3(abc2xyz, [ o[0] + 1, o[1] + 1, o[2] + 1 ])
    };
    return molecule;
  };

  // shortcuts
  var interpreter = new io.CIFInterpreter();
  c.readCIF = function(content, xSuper, ySuper, zSuper) {
    return interpreter.read(content, xSuper, ySuper, zSuper);
  };

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, Math, mat4, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4500 $
//  $Author: kevin $
//  $LastChangedDate: 2013-09-06 14:28:15 -0400 (Fri, 06 Sep 2013) $
//

(function(c, ELEMENT, io, structures) {
  'use strict';
  io.MOLInterpreter = function() {
  };
  var _ = io.MOLInterpreter.prototype = new io._Interpreter();
  _.read = function(content, multiplier) {
    if (!multiplier) {
      multiplier = c.default_bondLength_2D;
    }
    var molecule = new structures.Molecule();
    if (!content) {
      return molecule;
    }
    var currentTagTokens = content.split('\n');

    var counts = currentTagTokens[3];
    var numAtoms = parseInt(counts.substring(0, 3));
    var numBonds = parseInt(counts.substring(3, 6));

    for ( var i = 0; i < numAtoms; i++) {
      var line = currentTagTokens[4 + i];
      molecule.atoms[i] = new structures.Atom(line.substring(31, 34), parseFloat(line.substring(0, 10)) * multiplier, (multiplier === 1 ? 1 : -1) * parseFloat(line.substring(10, 20)) * multiplier, parseFloat(line.substring(20, 30)) * multiplier);
      var massDif = parseInt(line.substring(34, 36));
      if (massDif !== 0 && ELEMENT[molecule.atoms[i].label]) {
        molecule.atoms[i].mass = ELEMENT[molecule.atoms[i].label].mass + massDif;
      }
      switch (parseInt(line.substring(36, 39))) {
      case 1:
        molecule.atoms[i].charge = 3;
        break;
      case 2:
        molecule.atoms[i].charge = 2;
        break;
      case 3:
        molecule.atoms[i].charge = 1;
        break;
      case 5:
        molecule.atoms[i].charge = -1;
        break;
      case 6:
        molecule.atoms[i].charge = -2;
        break;
      case 7:
        molecule.atoms[i].charge = -3;
        break;
      }
    }
    for ( var i = 0; i < numBonds; i++) {
      var line = currentTagTokens[4 + numAtoms + i];
      var bondOrder = parseInt(line.substring(6, 9));
      var stereo = parseInt(line.substring(9, 12));
      if (bondOrder > 3) {
        switch (bondOrder) {
        case 4:
          bondOrder = 1.5;
          break;
        default:
          bondOrder = 1;
          break;
        }
      }
      var b = new structures.Bond(molecule.atoms[parseInt(line.substring(0, 3)) - 1], molecule.atoms[parseInt(line.substring(3, 6)) - 1], bondOrder);
      switch (stereo) {
      case 3:
        b.stereo = structures.Bond.STEREO_AMBIGUOUS;
        break;
      case 1:
        b.stereo = structures.Bond.STEREO_PROTRUDING;
        break;
      case 6:
        b.stereo = structures.Bond.STEREO_RECESSED;
        break;
      }
      molecule.bonds[i] = b;
    }
    return molecule;
  };
  _.write = function(molecule) {
    var sb = [];
    sb.push('Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n');
    sb.push(this.fit(molecule.atoms.length.toString(), 3));
    sb.push(this.fit(molecule.bonds.length.toString(), 3));
    sb.push('  0  0  0  0            999 V2000\n');
    var p = molecule.getCenter();
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      var a = molecule.atoms[i];
      var mass = ' 0';
      if (a.mass !== -1 && ELEMENT[a.label]) {
        var dif = a.mass - ELEMENT[a.label].mass;
        if (dif < 5 && dif > -4) {
          mass = (dif > -1 ? ' ' : '') + dif;
        }
      }
      var charge = '  0';
      if (a.charge !== 0) {
        switch (a.charge) {
        case 3:
          charge = '  1';
          break;
        case 2:
          charge = '  2';
          break;
        case 1:
          charge = '  3';
          break;
        case -1:
          charge = '  5';
          break;
        case -2:
          charge = '  6';
          break;
        case -3:
          charge = '  7';
          break;
        }
      }
      sb.push(this.fit(((a.x - p.x) / c.default_bondLength_2D).toFixed(4), 10));
      sb.push(this.fit((-(a.y - p.y) / c.default_bondLength_2D).toFixed(4), 10));
      sb.push(this.fit((a.z / c.default_bondLength_2D).toFixed(4), 10));
      sb.push(' ');
      sb.push(this.fit(a.label, 3, true));
      sb.push(mass);
      sb.push(charge);
      sb.push('  0  0  0  0\n');
    }
    for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
      var b = molecule.bonds[i];
      var stereo = 0;
      if (b.stereo === structures.Bond.STEREO_AMBIGUOUS) {
        stereo = 3;
      } else if (b.stereo === structures.Bond.STEREO_PROTRUDING) {
        stereo = 1;
      } else if (b.stereo === structures.Bond.STEREO_RECESSED) {
        stereo = 6;
      }
      sb.push(this.fit((molecule.atoms.indexOf(b.a1) + 1).toString(), 3));
      sb.push(this.fit((molecule.atoms.indexOf(b.a2) + 1).toString(), 3));
      var btype = b.bondOrder;
      if(btype==1.5){
        btype = 4;
      }else if(btype>3 || btype%1!=0){
        btype = 1;
      }
      sb.push(this.fit(btype, 3));
      sb.push('  ');
      sb.push(stereo);
      sb.push('     0  0\n');
    }
    sb.push('M  END');
    return sb.join('');
  };

  // shortcuts
  var interpreter = new io.MOLInterpreter();
  c.readMOL = function(content, multiplier) {
    return interpreter.read(content, multiplier);
  };
  c.writeMOL = function(mol) {
    return interpreter.write(mol);
  };

})(ChemDoodle, ChemDoodle.ELEMENT, ChemDoodle.io, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, extensions, io, structures, ELEMENT, trim, m) {
  'use strict';
  function checkContained(residue, set, chainID, index, helix) {
    for ( var j = 0, jj = set.length; j < jj; j++) {
      var check = set[j];
      if (check.id === chainID && index >= check.start && index <= check.end) {
        if (helix) {
          residue.helix = true;
        } else {
          residue.sheet = true;
        }
        if (index + 1 === check.end) {
          residue.arrow = true;
        }
        return;
      }
    }
  }

  io.PDBInterpreter = function() {
  };
  var _ = io.PDBInterpreter.prototype = new io._Interpreter();
  _.calculateRibbonDistances = false;
  _.deduceResidueBonds = false;
  _.read = function(content, multiplier) {
    var molecule = new structures.Molecule();
    molecule.chains = [];
    if (!content) {
      return molecule;
    }
    var currentTagTokens = content.split('\n');
    if (!multiplier) {
      multiplier = 1;
    }
    var helices = [];
    var sheets = [];
    var lastC;
    var currentChain = [];
    var resatoms = [];
    var atomSerials = [];
    for ( var i = 0, ii = currentTagTokens.length; i < ii; i++) {
      var line = currentTagTokens[i];
      if (extensions.stringStartsWith(line, 'HELIX')) {
        helices.push({
          id : line.substring(19, 20),
          start : parseInt(line.substring(21, 25)),
          end : parseInt(line.substring(33, 37))
        });
      } else if (extensions.stringStartsWith(line, 'SHEET')) {
        sheets.push({
          id : line.substring(21, 22),
          start : parseInt(line.substring(22, 26)),
          end : parseInt(line.substring(33, 37))
        });
      } else if (extensions.stringStartsWith(line, 'ATOM')) {
        var altLoc = line.substring(16, 17);
        if (altLoc === ' ' || altLoc === 'A') {
          var label = trim(line.substring(76, 78));
          if (label.length === 0) {
            var s = trim(line.substring(12, 14));
            if (s === 'HD') {
              label = 'H';
            } else if (s.length > 0) {
              if (s.length > 1) {
                label = s.charAt(0) + s.substring(1).toLowerCase();
              } else {
                label = s;
              }
            }
          }
          var a = new structures.Atom(label, parseFloat(line.substring(30, 38)) * multiplier, parseFloat(line.substring(38, 46)) * multiplier, parseFloat(line.substring(46, 54)) * multiplier);
          a.hetatm = false;
          resatoms.push(a);
          // set up residue
          var resSeq = parseInt(line.substring(22, 26));
          if (currentChain.length === 0) {
            for ( var j = 0; j < 2; j++) {
              var dummyFront = new structures.Residue(-1);
              dummyFront.cp1 = a;
              dummyFront.cp2 = a;
              currentChain.push(dummyFront);
            }
          }
          if (resSeq !== Number.NaN && currentChain[currentChain.length - 1].resSeq !== resSeq) {
            var r = new structures.Residue(resSeq);
            r.name = trim(line.substring(17, 20));
            if (r.name.length === 3) {
              r.name = r.name.substring(0, 1) + r.name.substring(1).toLowerCase();
            } else {
              if (r.name.length === 2 && r.name.charAt(0) === 'D') {
                r.name = r.name.substring(1);
              }
            }
            currentChain.push(r);
            var chainID = line.substring(21, 22);
            checkContained(r, helices, chainID, resSeq, true);
            checkContained(r, sheets, chainID, resSeq, false);
          }
          // end residue setup
          var atomName = trim(line.substring(12, 16));
          var currentResidue = currentChain[currentChain.length - 1];
          if (atomName === 'CA' || atomName === 'P' || atomName === 'O5\'') {
            if (!currentResidue.cp1) {
              currentResidue.cp1 = a;
            }
          } else if (atomName === 'N3' && (currentResidue.name === 'C' || currentResidue.name === 'U' || currentResidue.name === 'T') || atomName === 'N1' && (currentResidue.name === 'A' || currentResidue.name === 'G')) {
            // control points for base platform direction
            currentResidue.cp3 = a;
          } else if (atomName === 'C2') {
            // control points for base platform orientation
            currentResidue.cp4 = a;
          } else if (atomName === 'C4' && (currentResidue.name === 'C' || currentResidue.name === 'U' || currentResidue.name === 'T') || atomName === 'C6' && (currentResidue.name === 'A' || currentResidue.name === 'G')) {
            // control points for base platform orientation
            currentResidue.cp5 = a;
          } else if (atomName === 'O' || atomName === 'C6' && (currentResidue.name === 'C' || currentResidue.name === 'U' || currentResidue.name === 'T') || atomName === 'N9') {
            if (!currentChain[currentChain.length - 1].cp2) {
              if (atomName === 'C6' || atomName === 'N9') {
                lastC = a;
              }
              currentResidue.cp2 = a;
            }
          } else if (atomName === 'C') {
            lastC = a;
          }
        }
      } else if (extensions.stringStartsWith(line, 'HETATM')) {
        var symbol = trim(line.substring(76, 78));
        if (symbol.length === 0) {
          // handle the case where an improperly formatted PDB
          // file states the element label in the atom name column
          symbol = trim(line.substring(12, 16));
        }
        if (symbol.length > 1) {
          symbol = symbol.substring(0, 1) + symbol.substring(1).toLowerCase();
        }
        var het = new structures.Atom(symbol, parseFloat(line.substring(30, 38)) * multiplier, parseFloat(line.substring(38, 46)) * multiplier, parseFloat(line.substring(46, 54)) * multiplier);
        het.hetatm = true;
        var residueName = trim(line.substring(17, 20));
        if (residueName === 'HOH') {
          het.isWater = true;
        }
        molecule.atoms.push(het);
        atomSerials[parseInt(trim(line.substring(6, 11)))] = het;
      } else if (extensions.stringStartsWith(line, 'CONECT')) {
        var oid = parseInt(trim(line.substring(6, 11)));
        if (atomSerials[oid]) {
          var origin = atomSerials[oid];
          for ( var k = 0; k < 4; k++) {
            var next = trim(line.substring(11 + k * 5, 16 + k * 5));
            if (next.length !== 0) {
              var nid = parseInt(next);
              if (atomSerials[nid]) {
                var a2 = atomSerials[nid];
                var found = false;
                for ( var j = 0, jj = molecule.bonds.length; j < jj; j++) {
                  var b = molecule.bonds[j];
                  if (b.a1 === origin && b.a2 === a2 || b.a1 === a2 && b.a2 === origin) {
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  molecule.bonds.push(new structures.Bond(origin, a2));
                }
              }
            }
          }
        }
      } else if (extensions.stringStartsWith(line, 'TER')) {
        this.endChain(molecule, currentChain, lastC, resatoms);
        currentChain = [];
      } else if (extensions.stringStartsWith(line, 'ENDMDL')) {
        break;
      }
    }
    this.endChain(molecule, currentChain, lastC, resatoms);
    if (molecule.bonds.size === 0) {
      new c.informatics.BondDeducer().deduceCovalentBonds(molecule, multiplier);
    }
    if (this.deduceResidueBonds) {
      for ( var i = 0, ii = resatoms.length; i < ii; i++) {
        var max = m.min(ii, i + 20);
        for ( var j = i + 1; j < max; j++) {
          var first = resatoms[i];
          var second = resatoms[j];
          if (first.distance3D(second) < (ELEMENT[first.label].covalentRadius + ELEMENT[second.label].covalentRadius) * 1.1) {
            molecule.bonds.push(new structures.Bond(first, second, 1));
          }
        }
      }
    }
    molecule.atoms = molecule.atoms.concat(resatoms);
    if (this.calculateRibbonDistances) {
      this.calculateDistances(molecule, resatoms);
    }
    return molecule;
  };
  _.endChain = function(molecule, chain, lastC, resatoms) {
    if (chain.length > 0) {
      var last = chain[chain.length - 1];
      if (!last.cp1) {
        last.cp1 = resatoms[resatoms.length - 2];
      }
      if (!last.cp2) {
        last.cp2 = resatoms[resatoms.length - 1];
      }
      for ( var i = 0; i < 4; i++) {
        var dummyEnd = new structures.Residue(-1);
        dummyEnd.cp1 = lastC;
        dummyEnd.cp2 = chain[chain.length - 1].cp2;
        chain.push(dummyEnd);
      }
      molecule.chains.push(chain);
    }
  };
  _.calculateDistances = function(molecule, resatoms) {
    var hetatm = [];
    for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
      var a = molecule.atoms[i];
      if (a.hetatm) {
        if (!a.isWater) {
          hetatm.push(a);
        }
      }
    }
    for ( var i = 0, ii = resatoms.length; i < ii; i++) {
      var a = resatoms[i];
      a.closestDistance = Number.POSITIVE_INFINITY;
      if (hetatm.length === 0) {
        a.closestDistance = 0;
      } else {
        for ( var j = 0, jj = hetatm.length; j < jj; j++) {
          a.closestDistance = Math.min(a.closestDistance, a.distance3D(hetatm[j]));
        }
      }
    }
  };

  // shortcuts
  var interpreter = new io.PDBInterpreter();
  c.readPDB = function(content, multiplier) {
    return interpreter.read(content, multiplier);
  };

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.ELEMENT, jQuery.trim, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4137 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-22 12:46:00 -0500 (Fri, 22 Feb 2013) $
//

(function(c, extensions, io, structures, q, trim) {
  'use strict';
  var SQZ_HASH = {
    '@' : 0,
    'A' : 1,
    'B' : 2,
    'C' : 3,
    'D' : 4,
    'E' : 5,
    'F' : 6,
    'G' : 7,
    'H' : 8,
    'I' : 9,
    'a' : -1,
    'b' : -2,
    'c' : -3,
    'd' : -4,
    'e' : -5,
    'f' : -6,
    'g' : -7,
    'h' : -8,
    'i' : -9
  }, DIF_HASH = {
    '%' : 0,
    'J' : 1,
    'K' : 2,
    'L' : 3,
    'M' : 4,
    'N' : 5,
    'O' : 6,
    'P' : 7,
    'Q' : 8,
    'R' : 9,
    'j' : -1,
    'k' : -2,
    'l' : -3,
    'm' : -4,
    'n' : -5,
    'o' : -6,
    'p' : -7,
    'q' : -8,
    'r' : -9
  }, DUP_HASH = {
    'S' : 1,
    'T' : 2,
    'U' : 3,
    'V' : 4,
    'W' : 5,
    'X' : 6,
    'Y' : 7,
    'Z' : 8,
    's' : 9
  };

  io.JCAMPInterpreter = function() {
  };
  var _ = io.JCAMPInterpreter.prototype = new io._Interpreter();
  _.convertHZ2PPM = false;
  _.read = function(content) {
    this.isBreak = function(c) {
      // some of these arrays may return zero, so check if undefined
      return SQZ_HASH[c] !== undefined || DIF_HASH[c] !== undefined || DUP_HASH[c] !== undefined || c === ' ' || c === '-' || c === '+';
    };
    this.getValue = function(decipher, lastDif) {
      var first = decipher.charAt(0);
      var rest = decipher.substring(1);
      // some of these arrays may return zero, so check if undefined
      if (SQZ_HASH[first] !== undefined) {
        return parseFloat(SQZ_HASH[first] + rest);
      } else if (DIF_HASH[first] !== undefined) {
        return parseFloat(DIF_HASH[first] + rest) + lastDif;
      }
      return parseFloat(rest);
    };
    var spectrum = new structures.Spectrum();
    if (content === undefined || content.length === 0) {
      return spectrum;
    }
    var lines = content.split('\n');
    var sb = [];
    var xLast, xFirst, yFirst, nPoints, xFactor = 1, yFactor = 1, observeFrequency = 1, deltaX = -1, shiftOffsetNum = -1, shiftOffsetVal = -1;
    var recordMeta = true, divideByFrequency = false;
    for ( var i = 0, ii = lines.length; i < ii; i++) {
      var use = trim(lines[i]);
      var index = use.indexOf('$$');
      if (index !== -1) {
        use = use.substring(0, index);
      }
      if (sb.length === 0 || !extensions.stringStartsWith(lines[i], '##')) {
        if (sb.length !== 0) {
          sb.push('\n');
        }
        sb.push(trim(use));
      } else {
        var currentRecord = sb.join('');
        if (recordMeta && currentRecord.length < 100) {
          spectrum.metadata.push(currentRecord);
        }
        sb = [ use ];
        if (extensions.stringStartsWith(currentRecord, '##TITLE=')) {
          spectrum.title = trim(currentRecord.substring(8));
        } else if (extensions.stringStartsWith(currentRecord, '##XUNITS=')) {
          spectrum.xUnit = trim(currentRecord.substring(9));
          if (this.convertHZ2PPM && spectrum.xUnit.toUpperCase() === 'HZ') {
            spectrum.xUnit = 'PPM';
            divideByFrequency = true;
          }
        } else if (extensions.stringStartsWith(currentRecord, '##YUNITS=')) {
          spectrum.yUnit = trim(currentRecord.substring(9));
        } else if (extensions.stringStartsWith(currentRecord, '##XYPAIRS=')) {
          // spectrum.yUnit =
          // trim(currentRecord.substring(9));
        } else if (extensions.stringStartsWith(currentRecord, '##FIRSTX=')) {
          xFirst = parseFloat(trim(currentRecord.substring(9)));
        } else if (extensions.stringStartsWith(currentRecord, '##LASTX=')) {
          xLast = parseFloat(trim(currentRecord.substring(8)));
        } else if (extensions.stringStartsWith(currentRecord, '##FIRSTY=')) {
          yFirst = parseFloat(trim(currentRecord.substring(9)));
        } else if (extensions.stringStartsWith(currentRecord, '##NPOINTS=')) {
          nPoints = parseFloat(trim(currentRecord.substring(10)));
        } else if (extensions.stringStartsWith(currentRecord, '##XFACTOR=')) {
          xFactor = parseFloat(trim(currentRecord.substring(10)));
        } else if (extensions.stringStartsWith(currentRecord, '##YFACTOR=')) {
          yFactor = parseFloat(trim(currentRecord.substring(10)));
        } else if (extensions.stringStartsWith(currentRecord, '##DELTAX=')) {
          deltaX = parseFloat(trim(currentRecord.substring(9)));
        } else if (extensions.stringStartsWith(currentRecord, '##.OBSERVE FREQUENCY=')) {
          if (this.convertHZ2PPM) {
            observeFrequency = parseFloat(trim(currentRecord.substring(21)));
          }
        } else if (extensions.stringStartsWith(currentRecord, '##.SHIFT REFERENCE=')) {
          if (this.convertHZ2PPM) {
            var parts = currentRecord.substring(19).split(',');
            shiftOffsetNum = parseInt(trim(parts[2]));
            shiftOffsetVal = parseFloat(trim(parts[3]));
          }
        } else if (extensions.stringStartsWith(currentRecord, '##XYDATA=')) {
          if (!divideByFrequency) {
            observeFrequency = 1;
          }
          recordMeta = false;
          var lastWasDif = false;
          var innerLines = currentRecord.split('\n');
          var abscissaSpacing = (xLast - xFirst) / (nPoints - 1);
          // use provided deltaX if determined to be compressed
          // and discontinuous
          if (deltaX !== -1) {
            for ( var j = 1, jj = innerLines.length; j < jj; j++) {
              if (innerLines[j].charAt(0) === '|') {
                abscissaSpacing = deltaX;
                break;
              }
            }
          }
          var lastX = xFirst - abscissaSpacing;
          var lastY = yFirst;
          var lastDif = 0;
          var lastOrdinate;
          for ( var j = 1, jj = innerLines.length; j < jj; j++) {
            var data = [];
            var read = trim(innerLines[j]);
            var sb = [];
            var isCompressedDiscontinuous = false;
            for ( var k = 0, kk = read.length; k < kk; k++) {
              if (this.isBreak(read.charAt(k))) {
                if (sb.length > 0 && !(sb.length === 1 && sb[0] === ' ')) {
                  data.push(sb.join(''));
                }
                sb = [ read.charAt(k) ];
              } else {
                if (read.charAt(k) === '|') {
                  isCompressedDiscontinuous = true;
                } else {
                  sb.push(read.charAt(k));
                }
              }
            }
            data.push(sb.join(''));
            lastX = parseFloat(data[0]) * xFactor - abscissaSpacing;
            for ( var k = 1, kk = data.length; k < kk; k++) {
              var decipher = data[k];
              // some of these arrays may return zero, so
              // check if undefined
              if (DUP_HASH[decipher.charAt(0)] !== undefined) {
                // be careful when reading this, to keep
                // spectra efficient, DUPS are actually
                // discarded, except the last y!
                var dup = parseInt(DUP_HASH[decipher.charAt(0)] + decipher.substring(1)) - 1;
                for ( var l = 0; l < dup; l++) {
                  lastX += abscissaSpacing;
                  lastDif = this.getValue(lastOrdinate, lastDif);
                  lastY = lastDif * yFactor;
                  count++;
                  spectrum.data[spectrum.data.length - 1] = new structures.Point(lastX / observeFrequency, lastY);
                }
              } else {
                // some of these arrays may return zero, so
                // check if undefined
                if (!(SQZ_HASH[decipher.charAt(0)] !== undefined && lastWasDif)) {
                  lastWasDif = DIF_HASH[decipher.charAt(0)] !== undefined;
                  lastOrdinate = decipher;
                  lastX += abscissaSpacing;
                  lastDif = this.getValue(decipher, lastDif);
                  lastY = lastDif * yFactor;
                  count++;
                  spectrum.data.push(new structures.Point(lastX / observeFrequency, lastY));
                } else {
                  lastY = this.getValue(decipher, lastDif) * yFactor;
                  if (isCompressedDiscontinuous) {
                    lastX += abscissaSpacing;
                    spectrum.data.push(new structures.Point(lastX / observeFrequency, lastY));
                  }
                }
              }
            }
          }
          if (shiftOffsetNum !== -1) {
            var dif = shiftOffsetVal - spectrum.data[shiftOffsetNum - 1].x;
            for ( var i = 0, ii = spectrum.data.length; i < ii; i++) {
              spectrum.data[i].x += dif;
            }
          }
        } else if (extensions.stringStartsWith(currentRecord, '##PEAK TABLE=')) {
          recordMeta = false;
          spectrum.continuous = false;
          var innerLines = currentRecord.split('\n');
          var count = 0;
          for ( var j = 1, jj = innerLines.length; j < jj; j++) {
            var items = innerLines[j].split(/[\s,]+/);
            count += items.length / 2;
            for ( var k = 0, kk = items.length; k + 1 < kk; k += 2) {
              spectrum.data.push(new structures.Point(parseFloat(trim(items[k])), parseFloat(trim(items[k + 1]))));
            }
          }
        }
      }
    }
    spectrum.setup();
    return spectrum;
  };

  // shortcuts
  var interpreter = new io.JCAMPInterpreter();
  interpreter.convertHZ2PPM = true;
  c.readJCAMP = function(content) {
    return interpreter.read(content);
  };
})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, jQuery, jQuery.trim);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2934 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-08 20:53:47 -0500 (Wed, 08 Dec 2010) $
//
(function(c, io, structures, d2, JSON) {
  'use strict';
  io.JSONInterpreter = function() {
  };
  var _ = io.JSONInterpreter.prototype;
  _.contentTo = function(mols, shapes) {
    var count1 = 0, count2 = 0;
    for ( var i = 0, ii = mols.length; i < ii; i++) {
      var mol = mols[i];
      for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
        mol.atoms[j].tmpid = 'a' + count1++;
      }
      for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
        mol.bonds[j].tmpid = 'b' + count2++;
      }
    }
    count1 = 0;
    for ( var i = 0, ii = shapes.length; i < ii; i++) {
      shapes[i].tmpid = 's' + count1++;
    }
    var dummy = {};
    if (mols && mols.length > 0) {
      dummy.m = [];
      for ( var i = 0, ii = mols.length; i < ii; i++) {
        dummy.m.push(this.molTo(mols[i]));
      }
    }
    if (shapes && shapes.length > 0) {
      dummy.s = [];
      for ( var i = 0, ii = shapes.length; i < ii; i++) {
        dummy.s.push(this.shapeTo(shapes[i]));
      }
    }
    for ( var i = 0, ii = mols.length; i < ii; i++) {
      var mol = mols[i];
      for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
        mol.atoms[j].tmpid = undefined;
      }
      for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
        mol.bonds[j].tmpid = undefined;
      }
    }
    for ( var i = 0, ii = shapes.length; i < ii; i++) {
      shapes[i].tmpid = undefined;
    }
    return dummy;
  };
  _.contentFrom = function(dummy) {
    var obj = {
      molecules : [],
      shapes : []
    };
    if (dummy.m) {
      for ( var i = 0, ii = dummy.m.length; i < ii; i++) {
        obj.molecules.push(this.molFrom(dummy.m[i]));
      }
    }
    if (dummy.s) {
      for ( var i = 0, ii = dummy.s.length; i < ii; i++) {
        obj.shapes.push(this.shapeFrom(dummy.s[i], obj.molecules));
      }
    }
    for ( var i = 0, ii = obj.molecules.length; i < ii; i++) {
      var mol = obj.molecules[i];
      for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
        mol.atoms[j].tmpid = undefined;
      }
      for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
        mol.bonds[j].tmpid = undefined;
      }
    }
    for ( var i = 0, ii = obj.shapes.length; i < ii; i++) {
      obj.shapes[i].tmpid = undefined;
    }
    return obj;
  };
  _.molTo = function(mol) {
    var dummy = {
      a : []
    };
    for ( var i = 0, ii = mol.atoms.length; i < ii; i++) {
      var a = mol.atoms[i];
      var da = {
        x : a.x,
        y : a.y
      };
      if (a.tmpid) {
        da.i = a.tmpid;
      }
      if (a.label !== 'C') {
        da.l = a.label;
      }
      if (a.z !== 0) {
        da.z = a.z;
      }
      if (a.charge !== 0) {
        da.c = a.charge;
      }
      if (a.mass !== -1) {
        da.m = a.mass;
      }
      if (a.numRadical !== 0) {
        da.r = a.numRadical;
      }
      if (a.numLonePair !== 0) {
        da.p = a.numLonePair;
      }
      if (a.any) {
        da.q = true;
      }
      if (a.rgroup !== -1) {
        da.rg = a.rgroup;
      }
      dummy.a.push(da);
    }
    if (mol.bonds.length > 0) {
      dummy.b = [];
      for ( var i = 0, ii = mol.bonds.length; i < ii; i++) {
        var b = mol.bonds[i];
        var db = {
          b : mol.atoms.indexOf(b.a1),
          e : mol.atoms.indexOf(b.a2)
        };
        if (b.tmpid) {
          db.i = b.tmpid;
        }
        if (b.bondOrder !== 1) {
          db.o = b.bondOrder;
        }
        if (b.stereo !== structures.Bond.STEREO_NONE) {
          db.s = b.stereo;
        }
        dummy.b.push(db);
      }
    }
    return dummy;
  };
  _.molFrom = function(json) {
    var molecule = new structures.Molecule();
    for ( var i = 0, ii = json.a.length; i < ii; i++) {
      var c = json.a[i];
      var a = new structures.Atom(c.l ? c.l : 'C', c.x, c.y);
      if (c.i) {
        a.tmpid = c.i;
      }
      if (c.z) {
        a.z = c.z;
      }
      if (c.c) {
        a.charge = c.c;
      }
      if (c.m) {
        a.mass = c.m;
      }
      if (c.r) {
        a.numRadical = c.r;
      }
      if (c.p) {
        a.numLonePair = c.p;
      }
      if (c.q) {
        a.any = true;
      }
      if (c.rg) {
        a.rgroup = c.rg;
      }
      // these are booleans or numbers, so check if undefined
      if (c.p_h !== undefined) {
        a.hetatm = c.p_h;
      }
      if (c.p_w !== undefined) {
        a.isWater = c.p_w;
      }
      if (c.p_d !== undefined) {
        a.closestDistance = c.p_d;
      }
      molecule.atoms.push(a);
    }
    if (json.b) {
      for ( var i = 0, ii = json.b.length; i < ii; i++) {
        var c = json.b[i];
        // order can be 0, so check against undefined
        var b = new structures.Bond(molecule.atoms[c.b], molecule.atoms[c.e], c.o === undefined ? 1 : c.o);
        if (c.i) {
          b.tmpid = c.i;
        }
        if (c.s) {
          b.stereo = c.s;
        }
        molecule.bonds.push(b);
      }
    }
    return molecule;
  };
  _.shapeTo = function(shape) {
    var dummy = {};
    if (shape.tmpid) {
      dummy.i = shape.tmpid;
    }
    if (shape instanceof d2.Line) {
      dummy.t = 'Line';
      dummy.x1 = shape.p1.x;
      dummy.y1 = shape.p1.y;
      dummy.x2 = shape.p2.x;
      dummy.y2 = shape.p2.y;
      dummy.a = shape.arrowType;
    } else if (shape instanceof d2.Pusher) {
      dummy.t = 'Pusher';
      dummy.o1 = shape.o1.tmpid;
      dummy.o2 = shape.o2.tmpid;
      if (shape.numElectron !== 1) {
        dummy.e = shape.numElectron;
      }
    } else if (shape instanceof d2.Bracket) {
      dummy.t = 'Bracket';
      dummy.x1 = shape.p1.x;
      dummy.y1 = shape.p1.y;
      dummy.x2 = shape.p2.x;
      dummy.y2 = shape.p2.y;
      if (shape.charge !== 0) {
        dummy.c = shape.charge;
      }
      if (shape.mult !== 0) {
        dummy.m = shape.mult;
      }
      if (shape.repeat !== 0) {
        dummy.r = shape.repeat;
      }
    }
    return dummy;
  };
  _.shapeFrom = function(dummy, mols) {
    var shape;
    if (dummy.t === 'Line') {
      shape = new d2.Line(new structures.Point(dummy.x1, dummy.y1), new structures.Point(dummy.x2, dummy.y2));
      shape.arrowType = dummy.a;
    } else if (dummy.t === 'Pusher') {
      var o1;
      var o2;
      for ( var i = 0, ii = mols.length; i < ii; i++) {
        var mol = mols[i];
        for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
          var a = mol.atoms[j];
          if (a.tmpid === dummy.o1) {
            o1 = a;
          } else if (a.tmpid === dummy.o2) {
            o2 = a;
          }
        }
        for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
          var b = mol.bonds[j];
          if (b.tmpid === dummy.o1) {
            o1 = b;
          } else if (b.tmpid === dummy.o2) {
            o2 = b;
          }
        }
      }
      shape = new d2.Pusher(o1, o2);
      if (dummy.e) {
        shape.numElectron = dummy.e;
      }
    } else if (dummy.t === 'Bracket') {
      shape = new d2.Bracket(new structures.Point(dummy.x1, dummy.y1), new structures.Point(dummy.x2, dummy.y2));
      if (dummy.c !== undefined) {
        // have to check against undefined as it is an integer that can
        // be 0
        shape.charge = dummy.c;
      }
      if (dummy.m !== undefined) {
        // have to check against undefined as it is an integer that can
        // be 0
        shape.mult = dummy.m;
      }
      if (dummy.r !== undefined) {
        // have to check against undefined as it is an integer that can
        // be 0
        shape.repeat = dummy.r;
      }
    }
    return shape;
  };
  _.pdbFrom = function(content) {
    var mol = this.molFrom(content.mol);
    mol.findRings = false;
    // mark from JSON to note to algorithms that atoms in chain are not
    // same
    // objects as in atom array
    mol.fromJSON = true;
    mol.chains = this.chainsFrom(content.ribbons);
    return mol;
  };
  _.chainsFrom = function(content) {
    var chains = [];
    for ( var i = 0, ii = content.cs.length; i < ii; i++) {
      var chain = content.cs[i];
      var c = [];
      for ( var j = 0, jj = chain.length; j < jj; j++) {
        var convert = chain[j];
        var r = new structures.Residue();
        r.name = convert.n;
        r.cp1 = new structures.Atom('', convert.x1, convert.y1, convert.z1);
        r.cp2 = new structures.Atom('', convert.x2, convert.y2, convert.z2);
        if (convert.x3) {
          r.cp3 = new structures.Atom('', convert.x3, convert.y3, convert.z3);
          r.cp4 = new structures.Atom('', convert.x4, convert.y4, convert.z4);
          r.cp5 = new structures.Atom('', convert.x5, convert.y5, convert.z5);
        }
        r.helix = convert.h;
        r.sheet = convert.s;
        r.arrow = convert.a;
        c.push(r);
      }
      chains.push(c);
    }
    return chains;
  };

  // shortcuts
  var interpreter = new io.JSONInterpreter();
  c.readJSON = function(string) {
    var obj;
    try {
      obj = JSON.parse(string);
    } catch (e) {
      // not json
      return undefined;
    }
    if (obj) {
      if (obj.m || obj.s) {
        return interpreter.contentFrom(obj);
      } else if (obj.a) {
        return obj = {
          molecules : [ interpreter.molFrom(obj) ],
          shapes : []
        };
      } else {
        return obj = {
          molecules : [],
          shapes : []
        };
      }
    }
    return undefined;
  };
  c.writeJSON = function(mols, shapes) {
    return JSON.stringify(interpreter.contentTo(mols, shapes));
  };

})(ChemDoodle, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.structures.d2, JSON);
(function(c, io, structures) {
  'use strict';
  io.RXNInterpreter = function() {
  };
  var _ = io.RXNInterpreter.prototype = new io._Interpreter();
  _.read = function(content, multiplier) {
    if (!multiplier) {
      multiplier = c.default_bondLength_2D;
    }
    var molecules = [];
    var line;
    if (!content) {
      molecules.push(new structures.Molecule());
      line = new structures.d2.Line(new structures.Point(-20, 0), new structures.Point(20, 0));
    } else {
      var contentTokens = content.split('$MOL\n');
      var headerTokens = contentTokens[0].split('\n');
      var counts = headerTokens[4];
      var numReactants = parseInt(counts.substring(0, 3));
      var numProducts = parseInt(counts.substring(3, 6));
      var currentMolecule = 1;
      var start = 0;
      for ( var i = 0, ii = numReactants + numProducts; i < ii; i++) {
        molecules[i] = c.readMOL(contentTokens[currentMolecule], multiplier);
        var b = molecules[i].getBounds();
        var width = b.maxX - b.minX;
        start -= width + 40;
        currentMolecule++;
      }
      for ( var i = 0, ii = numReactants; i < ii; i++) {
        var b = molecules[i].getBounds();
        var width = b.maxX - b.minX;
        var center = molecules[i].getCenter();
        for ( var j = 0, jj = molecules[i].atoms.length; j < jj; j++) {
          var a = molecules[i].atoms[j];
          a.x += start + (width / 2) - center.x;
          a.y -= center.y;
        }
        start += width + 40;
      }
      line = new structures.d2.Line(new structures.Point(start, 0), new structures.Point(start + 40, 0));
      start += 80;
      for ( var i = numReactants, ii = numReactants + numProducts; i < ii; i++) {
        var b = molecules[i].getBounds();
        var width = b.maxX - b.minX;
        var center = molecules[i].getCenter();
        for ( var j = 0; j < molecules[i].atoms.length; j++) {
          var a = molecules[i].atoms[j];
          a.x += start + (width / 2) - center.x;
          a.y -= center.y;
        }
        start += width + 40;
      }
    }
    line.arrowType = structures.d2.Line.ARROW_SYNTHETIC;
    return {
      'molecules' : molecules,
      'shapes' : [ line ]
    };
  };
  _.write = function(mols, shapes) {
    var molecules = [ [], [] ];
    var ps = undefined;
    if (!mols || !shapes) {
      return;
    }
    for (i = 0, ii = shapes.length; i < ii; i++) {
      if (shapes[i] instanceof structures.d2.Line) {
        ps = shapes[i].getPoints();
        break;
      }
    }
    if (!ps) {
      return '';
    }
    for ( var i = 0, ii = mols.length; i < ii; i++) {
      var center = mols[i].getCenter();
      if (center.x < ps[1].x) {
        molecules[0].push(mols[i]);
      } else {
        molecules[1].push(mols[i]);
      }
    }
    var sb = [];
    sb.push('$RXN\nReaction from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n');
    sb.push(this.fit(molecules[0].length.toString(), 3));
    sb.push(this.fit(molecules[1].length.toString(), 3));
    sb.push('\n');
    for ( var i = 0; i < 2; i++) {
      for ( var j = 0, jj = molecules[i].length; j < jj; j++) {
        sb.push('$MOL\n');
        sb.push(c.writeMOL(molecules[i][j]));
        sb.push('\n');
      }
    }
    return sb.join('');
  };

  // shortcuts
  var interpreter = new io.RXNInterpreter();
  c.readRXN = function(content, multiplier) {
    return interpreter.read(content, multiplier);
  };
  c.writeRXN = function(mols, shapes) {
    return interpreter.write(mols, shapes);
  };

})(ChemDoodle, ChemDoodle.io, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3450 $
//  $Author: kevin $
//  $LastChangedDate: 2011-12-01 19:48:46 -0500 (Thu, 01 Dec 2011) $
//

(function(c, ELEMENT, SYMBOLS, io, structures, trim) {
  'use strict';
  io.XYZInterpreter = function() {
  };
  var _ = io.XYZInterpreter.prototype = new io._Interpreter();
  _.deduceCovalentBonds = true;
  _.read = function(content) {
    var molecule = new structures.Molecule();
    if (!content) {
      return molecule;
    }
    var lines = content.split('\n');

    var numAtoms = parseInt(trim(lines[0]));

    for ( var i = 0; i < numAtoms; i++) {
      var line = lines[i + 2];
      var tokens = line.split(/\s+/g);
      molecule.atoms[i] = new structures.Atom(isNaN(tokens[0]) ? tokens[0] : SYMBOLS[parseInt(tokens[0]) - 1], parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
    }
    if (this.deduceCovalentBonds) {
      new c.informatics.BondDeducer().deduceCovalentBonds(molecule, 1);
    }
    return molecule;
  };

  // shortcuts
  var interpreter = new io.XYZInterpreter();
  c.readXYZ = function(content) {
    return interpreter.read(content);
  };

})(ChemDoodle, ChemDoodle.ELEMENT, ChemDoodle.SYMBOLS, ChemDoodle.io, ChemDoodle.structures, jQuery.trim);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2974 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 11:07:06 -0500 (Wed, 29 Dec 2010) $
//

ChemDoodle.monitor = (function(featureDetection, q, document) {
  'use strict';
  var m = {};

  m.CANVAS_DRAGGING = undefined;
  m.CANVAS_OVER = undefined;
  m.ALT = false;
  m.SHIFT = false;
  m.META = false;

  if (!featureDetection.supports_touch()) {
    q(document).ready(function() {
      // handles dragging beyond the canvas bounds
      q(document).mousemove(function(e) {
        if (m.CANVAS_DRAGGING) {
          if (m.CANVAS_DRAGGING.drag) {
            m.CANVAS_DRAGGING.prehandleEvent(e);
            m.CANVAS_DRAGGING.drag(e);
          }
        }
      });
      q(document).mouseup(function(e) {
        if (m.CANVAS_DRAGGING && m.CANVAS_DRAGGING !== m.CANVAS_OVER) {
          if (m.CANVAS_DRAGGING.mouseup) {
            m.CANVAS_DRAGGING.prehandleEvent(e);
            m.CANVAS_DRAGGING.mouseup(e);
          }
        }
        m.CANVAS_DRAGGING = undefined;
      });
      // handles modifier keys from a single keyboard
      q(document).keydown(function(e) {
        m.SHIFT = e.shiftKey;
        m.ALT = e.altKey;
        m.META = e.metaKey || e.ctrlKey;
        var affecting = m.CANVAS_OVER;
        if (m.CANVAS_DRAGGING) {
          affecting = m.CANVAS_DRAGGING;
        }
        if (affecting) {
          if (affecting.keydown) {
            affecting.prehandleEvent(e);
            affecting.keydown(e);
          }
        }
      });
      q(document).keypress(function(e) {
        var affecting = m.CANVAS_OVER;
        if (m.CANVAS_DRAGGING) {
          affecting = m.CANVAS_DRAGGING;
        }
        if (affecting) {
          if (affecting.keypress) {
            affecting.prehandleEvent(e);
            affecting.keypress(e);
          }
        }
      });
      q(document).keyup(function(e) {
        m.SHIFT = e.shiftKey;
        m.ALT = e.altKey;
        m.META = e.metaKey || e.ctrlKey;
        var affecting = m.CANVAS_OVER;
        if (m.CANVAS_DRAGGING) {
          affecting = m.CANVAS_DRAGGING;
        }
        if (affecting) {
          if (affecting.keyup) {
            affecting.prehandleEvent(e);
            affecting.keyup(e);
          }
        }
      });
    });
  }

  return m;

})(ChemDoodle.featureDetection, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4208 $
//  $Author: kevin $
//  $LastChangedDate: 2013-03-24 10:31:41 -0400 (Sun, 24 Mar 2013) $
//
(function(c, featureDetection, math, monitor, structures, q, browser, m, document, window) {
  'use strict';
  c._Canvas = function() {
  };
  var _ = c._Canvas.prototype;
  _.molecules = undefined;
  _.shapes = undefined;
  _.emptyMessage = undefined;
  _.image = undefined;
  _.repaint = function() {
    if (this.test) {
      return;
    }
    var canvas = document.getElementById(this.id);
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      if (this.pixelRatio !== 1 && canvas.width === this.width) {
        canvas.width = this.width * this.pixelRatio;
        canvas.height = this.height * this.pixelRatio;
        ctx.scale(this.pixelRatio, this.pixelRatio);
      }
      if (!this.image) {
        if (this.specs.backgroundColor && this.bgCache !== canvas.style.backgroundColor) {
          canvas.style.backgroundColor = this.specs.backgroundColor;
          this.bgCache = canvas.style.backgroundColor;
        }
        // clearRect is correct, but doesn't work as expected on Android
        // ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = this.specs.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
      } else {
        ctx.drawImage(this.image, 0, 0);
      }
      if (this.innerRepaint) {
        this.innerRepaint(ctx);
      } else {
        if (this.molecules.length !== 0 || this.shapes.length !== 0) {
          ctx.save();
          ctx.translate(this.width / 2, this.height / 2);
          ctx.rotate(this.specs.rotateAngle);
          ctx.scale(this.specs.scale, this.specs.scale);
          ctx.translate(-this.width / 2, -this.height / 2);
          for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
            this.molecules[i].check(true);
            this.molecules[i].draw(ctx, this.specs);
          }
          for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
            this.shapes[i].draw(ctx, this.specs);
          }
          ctx.restore();
        } else if (this.emptyMessage) {
          ctx.fillStyle = '#737683';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '18px Helvetica, Verdana, Arial, Sans-serif';
          ctx.fillText(this.emptyMessage, this.width / 2, this.height / 2);
        }
      }
      if (this.drawChildExtras) {
        this.drawChildExtras(ctx);
      }
    }
  };
  _.resize = function(w, h) {
    var cap = q('#' + this.id);
    cap.attr({
      width : w,
      height : h
    });
    cap.css('width', w);
    cap.css('height', h);
    this.width = w;
    this.height = h;
    if (c._Canvas3D && this instanceof c._Canvas3D) {
      this.gl.viewport(0, 0, w, h);
      this.setupScene();
    } else if (this.molecules.length > 0) {
      this.center();
      for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
        this.molecules[i].check();
      }
    }
    this.repaint();
  };
  _.setBackgroundImage = function(path) {
    this.image = new Image(); // Create new Image object
    var me = this;
    this.image.onload = function() {
      me.repaint();
    };
    this.image.src = path; // Set source path
  };
  _.loadMolecule = function(molecule) {
    this.clear();
    this.molecules.push(molecule);
    this.center();
    if (!(c._Canvas3D && this instanceof c._Canvas3D)) {
      molecule.check();
    }
    if (this.afterLoadContent) {
      this.afterLoadContent();
    }
    this.repaint();
  };
  _.loadContent = function(mols, shapes) {
    this.molecules = mols?mols:[];
    this.shapes = shapes?shapes:[];
    this.center();
    if (!(c._Canvas3D && this instanceof c._Canvas3D)) {
      for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
        this.molecules[i].check();
      }
    }
    if (this.afterLoadContent) {
      this.afterLoadContent();
    }
    this.repaint();
  };
  _.addMolecule = function(molecule) {
    this.molecules.push(molecule);
    if (!(c._Canvas3D && this instanceof c._Canvas3D)) {
      molecule.check();
    }
    this.repaint();
  };
  _.removeMolecule = function(mol) {
    this.molecules = q.grep(this.molecules, function(value) {
      return value !== mol;
    });
    this.repaint();
  };
  _.getMolecule = function() {
    return this.molecules.length > 0 ? this.molecules[0] : undefined;
  };
  _.getMolecules = function() {
    return this.molecules;
  };
  _.addShape = function(shape) {
    this.shapes.push(shape);
    this.repaint();
  };
  _.removeShape = function(shape) {
    this.shapes = q.grep(this.shapes, function(value) {
      return value !== shape;
    });
    this.repaint();
  };
  _.getShapes = function() {
    return this.shapes;
  };
  _.clear = function() {
    this.molecules = [];
    this.shapes = [];
    this.specs.scale = 1;
    this.repaint();
  };
  _.center = function() {
    var bounds = this.getContentBounds();
    var center = new structures.Point((this.width - bounds.minX - bounds.maxX) / 2, (this.height - bounds.minY - bounds.maxY) / 2);
    for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
      var mol = this.molecules[i];
      for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
        mol.atoms[j].add(center);
      }
    }
    for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
      var sps = this.shapes[i].getPoints();
      for ( var j = 0, jj = sps.length; j < jj; j++) {
        sps[j].add(center);
      }
    }
    this.specs.scale = 1;
    var difX = bounds.maxX - bounds.minX;
    var difY = bounds.maxY - bounds.minY;
    if (difX > this.width || difY > this.height) {
      this.specs.scale = m.min(this.width / difX, this.height / difY) * .85;
    }
  };
  _.bondExists = function(a1, a2) {
    for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
      var mol = this.molecules[i];
      for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
        var b = mol.bonds[j];
        if (b.contains(a1) && b.contains(a2)) {
          return true;
        }
      }
    }
    return false;
  };
  _.getBond = function(a1, a2) {
    for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
      var mol = this.molecules[i];
      for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
        var b = mol.bonds[j];
        if (b.contains(a1) && b.contains(a2)) {
          return b;
        }
      }
    }
    return undefined;
  };
  _.getMoleculeByAtom = function(a) {
    for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
      var mol = this.molecules[i];
      if (mol.atoms.indexOf(a) !== -1) {
        return mol;
      }
    }
    return undefined;
  };
  _.getAllAtoms = function() {
    var as = [];
    for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
      as = as.concat(this.molecules[i].atoms);
    }
    return as;
  };
  _.getAllPoints = function() {
    var ps = [];
    for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
      ps = ps.concat(this.molecules[i].atoms);
    }
    for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
      ps = ps.concat(this.shapes[i].getPoints());
    }
    return ps;
  };
  _.getContentBounds = function() {
    var bounds = new math.Bounds();
    for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
      bounds.expand(this.molecules[i].getBounds());
    }
    for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
      bounds.expand(this.shapes[i].getBounds());
    }
    return bounds;
  };
  _.create = function(id, width, height) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.molecules = [];
    this.shapes = [];
    if (document.getElementById(id)) {
      var canvas = q('#' + id);
      if (!width) {
        this.width = canvas.attr('width');
      } else {
        canvas.attr('width', width);
      }
      if (!height) {
        this.height = canvas.attr('height');
      } else {
        canvas.attr('height', height);
      }
      // If the canvas is pre-created, make sure that the class attribute
      // is specified.
      canvas.attr('class', 'ChemDoodleWebComponent');
    } else if (!c.featureDetection.supports_canvas_text() && browser.msie && browser.version >= '6') {
      // Install Google Chrome Frame
      document.writeln('<div style="border: 1px solid black;" width="' + width + '" height="' + height + '">Please install <a href="http://code.google.com/chrome/chromeframe/">Google Chrome Frame</a>, then restart Internet Explorer.</div>');
      return;
    } else {
      document.writeln('<canvas class="ChemDoodleWebComponent" id="' + id + '" width="' + width + '" height="' + height + '" alt="ChemDoodle Web Component">This browser does not support HTML5/Canvas.</canvas>');
    }
    var jqCapsule = q('#' + id);
    jqCapsule.css('width', this.width);
    jqCapsule.css('height', this.height);
    this.pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    this.specs = new structures.VisualSpecifications();
    // setup input events
    // make sure prehandle events are only in if statements if handled, so
    // as not to block browser events
    var me = this;
    if (featureDetection.supports_touch()) {
      // for iPhone OS and Android devices (and other mobile browsers that
      // support mobile events)
      jqCapsule.bind('touchstart', function(e) {
        var time = new Date().getTime();
        if (!featureDetection.supports_gesture() && e.originalEvent.touches.length === 2) {
          // on some platforms, like Android, there is no gesture
          // support, so we have to implement it
          var ts = e.originalEvent.touches;
          var p1 = new structures.Point(ts[0].pageX, ts[0].pageY);
          var p2 = new structures.Point(ts[1].pageX, ts[1].pageY);
          me.implementedGestureDist = p1.distance(p2);
          me.implementedGestureAngle = p1.angle(p2);
          if (me.gesturestart) {
            me.prehandleEvent(e);
            me.gesturestart(e);
          }
        }
        if (me.lastTouch && e.originalEvent.touches.length === 1 && (time - me.lastTouch) < 500) {
          if (me.dbltap) {
            me.prehandleEvent(e);
            me.dbltap(e);
          } else if (me.dblclick) {
            me.prehandleEvent(e);
            me.dblclick(e);
          } else if (me.touchstart) {
            me.prehandleEvent(e);
            me.touchstart(e);
          } else if (me.mousedown) {
            me.prehandleEvent(e);
            me.mousedown(e);
          }
        } else if (me.touchstart) {
          me.prehandleEvent(e);
          me.touchstart(e);
          if (this.hold) {
            clearTimeout(this.hold);
          }
          if (this.touchhold) {
            this.hold = setTimeout(function() {
              me.touchhold(e);
            }, 1000);
          }
        } else if (me.mousedown) {
          me.prehandleEvent(e);
          me.mousedown(e);
        }
        me.lastTouch = time;
      });
      jqCapsule.bind('touchmove', function(e) {
        if (this.hold) {
          clearTimeout(this.hold);
          this.hold = undefined;
        }
        if (!featureDetection.supports_gesture() && e.originalEvent.touches.length === 2) {
          // on some platforms, like Android, there is no gesture
          // support, so we have to implement it
          if (me.gesturechange) {
            var ts = e.originalEvent.touches;
            var p1 = new structures.Point(ts[0].pageX, ts[0].pageY);
            var p2 = new structures.Point(ts[1].pageX, ts[1].pageY);
            var newDist = p1.distance(p2);
            var newAngle = p1.angle(p2);
            e.originalEvent.scale = newDist / me.implementedGestureDist;
            e.originalEvent.rotation = 180 * (me.implementedGestureAngle - newAngle) / m.PI;
            me.prehandleEvent(e);
            me.gesturechange(e);
          }
        }
        if (e.originalEvent.touches.length > 1 && me.multitouchmove) {
          var numFingers = e.originalEvent.touches.length;
          me.prehandleEvent(e);
          var center = new structures.Point(-e.offset.left * numFingers, -e.offset.top * numFingers);
          for ( var i = 0; i < numFingers; i++) {
            center.x += e.originalEvent.changedTouches[i].pageX;
            center.y += e.originalEvent.changedTouches[i].pageY;
          }
          center.x /= numFingers;
          center.y /= numFingers;
          e.p = center;
          me.multitouchmove(e, numFingers);
        } else if (me.touchmove) {
          me.prehandleEvent(e);
          me.touchmove(e);
        } else if (me.drag) {
          me.prehandleEvent(e);
          me.drag(e);
        }
      });
      jqCapsule.bind('touchend', function(e) {
        if (this.hold) {
          clearTimeout(this.hold);
          this.hold = undefined;
        }
        if (!featureDetection.supports_gesture() && me.implementedGestureDist) {
          // on some platforms, like Android, there is no gesture
          // support, so we have to implement it
          me.implementedGestureDist = undefined;
          me.implementedGestureAngle = undefined;
          if (me.gestureend) {
            me.prehandleEvent(e);
            me.gestureend(e);
          }
        }
        if (me.touchend) {
          me.prehandleEvent(e);
          me.touchend(e);
        } else if (me.mouseup) {
          me.prehandleEvent(e);
          me.mouseup(e);
        }
        if ((new Date().getTime() - me.lastTouch) < 250) {
          if (me.tap) {
            me.prehandleEvent(e);
            me.tap(e);
          } else if (me.click) {
            me.prehandleEvent(e);
            me.click(e);
          }
        }
      });
      jqCapsule.bind('gesturestart', function(e) {
        if (me.gesturestart) {
          me.prehandleEvent(e);
          me.gesturestart(e);
        }
      });
      jqCapsule.bind('gesturechange', function(e) {
        if (me.gesturechange) {
          me.prehandleEvent(e);
          me.gesturechange(e);
        }
      });
      jqCapsule.bind('gestureend', function(e) {
        if (me.gestureend) {
          me.prehandleEvent(e);
          me.gestureend(e);
        }
      });
    } else {
      // normal events
      // some mobile browsers will simulate mouse events, so do not set
      // these
      // events if mobile, or it will interfere with the handling of touch
      // events
      jqCapsule.click(function(e) {
        switch (e.which) {
        case 1:
          // left mouse button pressed
          if (me.click) {
            me.prehandleEvent(e);
            me.click(e);
          }
          break;
        case 2:
          // middle mouse button pressed
          if (me.middleclick) {
            me.prehandleEvent(e);
            me.middleclick(e);
          }
          break;
        case 3:
          // right mouse button pressed
          if (me.rightclick) {
            me.prehandleEvent(e);
            me.rightclick(e);
          }
          break;
        }
      });
      jqCapsule.dblclick(function(e) {
        if (me.dblclick) {
          me.prehandleEvent(e);
          me.dblclick(e);
        }
      });
      jqCapsule.mousedown(function(e) {
        switch (e.which) {
        case 1:
          // left mouse button pressed
          monitor.CANVAS_DRAGGING = me;
          if (me.mousedown) {
            me.prehandleEvent(e);
            me.mousedown(e);
          }
          break;
        case 2:
          // middle mouse button pressed
          if (me.middlemousedown) {
            me.prehandleEvent(e);
            me.middlemousedown(e);
          }
          break;
        case 3:
          // right mouse button pressed
          if (me.rightmousedown) {
            me.prehandleEvent(e);
            me.rightmousedown(e);
          }
          break;
        }
      });
      jqCapsule.mousemove(function(e) {
        if (!monitor.CANVAS_DRAGGING && me.mousemove) {
          me.prehandleEvent(e);
          me.mousemove(e);
        }
      });
      jqCapsule.mouseout(function(e) {
        monitor.CANVAS_OVER = undefined;
        if (me.mouseout) {
          me.prehandleEvent(e);
          me.mouseout(e);
        }
      });
      jqCapsule.mouseover(function(e) {
        monitor.CANVAS_OVER = me;
        if (me.mouseover) {
          me.prehandleEvent(e);
          me.mouseover(e);
        }
      });
      jqCapsule.mouseup(function(e) {
        switch (e.which) {
        case 1:
          // left mouse button pressed
          if (me.mouseup) {
            me.prehandleEvent(e);
            me.mouseup(e);
          }
          break;
        case 2:
          // middle mouse button pressed
          if (me.middlemouseup) {
            me.prehandleEvent(e);
            me.middlemouseup(e);
          }
          break;
        case 3:
          // right mouse button pressed
          if (me.rightmouseup) {
            me.prehandleEvent(e);
            me.rightmouseup(e);
          }
          break;
        }
      });
      jqCapsule.mousewheel(function(e, delta) {
        if (me.mousewheel) {
          me.prehandleEvent(e);
          me.mousewheel(e, delta);
        }
      });
    }
    if (this.subCreate) {
      this.subCreate();
    }
  };
  _.prehandleEvent = function(e) {
    if (e.originalEvent.changedTouches) {
      e.pageX = e.originalEvent.changedTouches[0].pageX;
      e.pageY = e.originalEvent.changedTouches[0].pageY;
    }
    e.preventDefault();
    e.offset = q('#' + this.id).offset();
    e.p = new structures.Point(e.pageX - e.offset.left, e.pageY - e.offset.top);
  };
})(ChemDoodle, ChemDoodle.featureDetection, ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.structures, jQuery, jQuery.browser, Math, document, window);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c) {
  'use strict';
  c._AnimatorCanvas = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  var _ = c._AnimatorCanvas.prototype = new c._Canvas();
  _.timeout = 33;
  _.startAnimation = function() {
    this.stopAnimation();
    this.lastTime = new Date().getTime();
    var me = this;
    if (this.nextFrame) {
      this.handle = setInterval(function() {
        // advance clock
        var timeNow = new Date().getTime();
        // update and repaint
        me.nextFrame(timeNow - me.lastTime);
        me.repaint();
        me.lastTime = timeNow;
      }, this.timeout);
    }
  };
  _.stopAnimation = function() {
    if (this.handle) {
      clearInterval(this.handle);
      this.handle = undefined;
    }
  };
  _.isRunning = function() {
    // must compare to undefined here to return a boolean
    return this.handle !== undefined;
  };

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, document) {
  'use strict';
  c.FileCanvas = function(id, width, height, action) {
    if (id) {
      this.create(id, width, height);
    }
    var form = '<br><form name="FileForm" enctype="multipart/form-data" method="POST" action="' + action + '" target="HiddenFileFrame"><input type="file" name="f" /><input type="submit" name="submitbutton" value="Show File" /></form><iframe id="HFF-' + id + '" name="HiddenFileFrame" height="0" width="0" style="display:none;" onLoad="GetMolFromFrame(\'HFF-' + id + '\', ' + id + ')"></iframe>';
    document.writeln(form);
    this.emptyMessage = 'Click below to load file';
    this.repaint();
  };
  c.FileCanvas.prototype = new c._Canvas();

})(ChemDoodle, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c) {
  'use strict';
  c.HyperlinkCanvas = function(id, width, height, urlOrFunction, color, size) {
    if (id) {
      this.create(id, width, height);
    }
    this.urlOrFunction = urlOrFunction;
    this.color = color ? color : 'blue';
    this.size = size ? size : 2;
  };
  var _ = c.HyperlinkCanvas.prototype = new c._Canvas();
  _.openInNewWindow = true;
  _.hoverImage = undefined;
  _.drawChildExtras = function(ctx) {
    if (this.e) {
      if (this.hoverImage) {
        ctx.drawImage(this.hoverImage, 0, 0);
      } else {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size * 2;
        ctx.strokeRect(0, 0, this.width, this.height);
      }
    }
  };
  _.setHoverImage = function(url) {
    this.hoverImage = new Image();
    this.hoverImage.src = url;
  };
  _.click = function(p) {
    this.e = undefined;
    this.repaint();
    if (this.urlOrFunction instanceof Function) {
      this.urlOrFunction();
    } else {
      if (this.openInNewWindow) {
        window.open(this.urlOrFunction);
      } else {
        location.href = this.urlOrFunction;
      }
    }
  };
  _.mouseout = function(e) {
    this.e = undefined;
    this.repaint();
  };
  _.mouseover = function(e) {
    this.e = e;
    this.repaint();
  };

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, iChemLabs, q, document) {
  'use strict';
  c.MolGrabberCanvas = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
    var sb = [];
    sb.push('<br><input type="text" id="');
    sb.push(id);
    sb.push('_query" size="32" value="" />');
    sb.push('<br><nobr>');
    sb.push('<select id="');
    sb.push(id);
    sb.push('_select">');
    sb.push('<option value="chemexper">ChemExper');
    sb.push('<option value="chemspider">ChemSpider');
    sb.push('<option value="pubchem" selected>PubChem');
    sb.push('</select>');
    sb.push('<button id="');
    sb.push(id);
    sb.push('_submit">Show Molecule</button>');
    sb.push('</nobr>');

    // Don't use document.writeln here, it breaks the whole page after
    // document is closed.
    document.getElementById(id);
    var canvas = q('#' + id);
    canvas.after(sb.join(''));

    var self = this;
    q('#' + id + '_submit').click(function() {
      self.search();
    });
    q('#' + id + '_query').keypress(function(e) {
      if (e.which === 13) {
        self.search();
      }
    });
    this.emptyMessage = 'Enter search term below';
    this.repaint();
  };
  var _ = c.MolGrabberCanvas.prototype = new c._Canvas();
  _.setSearchTerm = function(term) {
    q('#' + this.id + '_query').val(term);
    this.search();
  };
  _.search = function() {
    this.emptyMessage = 'Searching...';
    this.clear();
    var self = this;
    iChemLabs.getMoleculeFromDatabase(q('#' + this.id + '_query').val(), {
      database : q('#' + this.id + '_select').val()
    }, function(mol) {
      self.loadMolecule(mol);
    });
  };

})(ChemDoodle, ChemDoodle.iChemLabs, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, m, m4) {
  'use strict';
  // keep these declaration outside the loop to avoid overhead
  var matrix = [];
  var xAxis = [ 1, 0, 0 ];
  var yAxis = [ 0, 1, 0 ];
  var zAxis = [ 0, 0, 1 ];

  c.RotatorCanvas = function(id, width, height, rotate3D) {
    if (id) {
      this.create(id, width, height);
    }
    this.rotate3D = rotate3D;
  };
  var _ = c.RotatorCanvas.prototype = new c._AnimatorCanvas();
  var increment = m.PI / 15;
  _.xIncrement = increment;
  _.yIncrement = increment;
  _.zIncrement = increment;
  _.nextFrame = function(delta) {
    if (this.molecules.length === 0 && this.shapes.length === 0) {
      this.stopAnimation();
      return;
    }
    var change = delta / 1000;
    if (this.rotate3D) {
      m4.identity(matrix);
      m4.rotate(matrix, this.xIncrement * change, xAxis);
      m4.rotate(matrix, this.yIncrement * change, yAxis);
      m4.rotate(matrix, this.zIncrement * change, zAxis);
      for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
        var m = this.molecules[i];
        for ( var j = 0, jj = m.atoms.length; j < jj; j++) {
          var a = m.atoms[j];
          var p = [ a.x - this.width / 2, a.y - this.height / 2, a.z ];
          m4.multiplyVec3(matrix, p);
          a.x = p[0] + this.width / 2;
          a.y = p[1] + this.height / 2;
          a.z = p[2];
        }
        for ( var j = 0, jj = m.rings.length; j < jj; j++) {
          m.rings[j].center = m.rings[j].getCenter();
        }
        if (this.specs.atoms_display && this.specs.atoms_circles_2D) {
          m.sortAtomsByZ();
        }
        if (this.specs.bonds_display && this.specs.bonds_clearOverlaps_2D) {
          m.sortBondsByZ();
        }
      }
      for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
        var sps = this.shapes[i].getPoints();
        for ( var j = 0, jj = sps.length; j < jj; j++) {
          var a = sps[j];
          var p = [ a.x - this.width / 2, a.y - this.height / 2, 0 ];
          m4.multiplyVec3(matrix, p);
          a.x = p[0] + this.width / 2;
          a.y = p[1] + this.height / 2;
        }
      }
    } else {
      this.specs.rotateAngle += this.zIncrement * change;
    }
  };
  _.dblclick = function(e) {
    if (this.isRunning()) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  };

})(ChemDoodle, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, math) {
  'use strict';
  c.SlideshowCanvas = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  var _ = c.SlideshowCanvas.prototype = new c._AnimatorCanvas();
  _.frames = [];
  _.curIndex = 0;
  _.timeout = 5000;
  _.alpha = 0;
  _.innerHandle = undefined;
  _.phase = 0;
  _.drawChildExtras = function(ctx) {
    var rgb = math.getRGB(this.specs.backgroundColor, 255);
    ctx.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.alpha + ')';
    ctx.fillRect(0, 0, this.width, this.height);
  };
  _.nextFrame = function(delta) {
    if (this.frames.length === 0) {
      this.stopAnimation();
      return;
    }
    this.phase = 0;
    var me = this;
    var count = 1;
    this.innerHandle = setInterval(function() {
      me.alpha = count / 15;
      me.repaint();
      if (count === 15) {
        me.breakInnerHandle();
      }
      count++;
    }, 33);
  };
  _.breakInnerHandle = function() {
    if (this.innerHandle) {
      clearInterval(this.innerHandle);
      this.innerHandle = undefined;
    }
    if (this.phase === 0) {
      this.curIndex++;
      if (this.curIndex > this.frames.length - 1) {
        this.curIndex = 0;
      }
      this.alpha = 1;
      var f = this.frames[this.curIndex];
      this.loadContent(f.mols, f.shapes);
      this.phase = 1;
      var me = this;
      var count = 1;
      this.innerHandle = setInterval(function() {
        me.alpha = (15 - count) / 15;
        me.repaint();
        if (count === 15) {
          me.breakInnerHandle();
        }
        count++;
      }, 33);
    } else if (this.phase === 1) {
      this.alpha = 0;
      this.repaint();
    }
  };
  _.addFrame = function(molecules, shapes) {
    if (this.frames.length === 0) {
      this.loadContent(molecules, shapes);
    }
    this.frames.push({
      mols : molecules,
      shapes : shapes
    });
  };

})(ChemDoodle, ChemDoodle.math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4403 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-09 14:16:09 -0400 (Sun, 09 Jun 2013) $
//

(function(c, monitor, structures, m, m4) {
  'use strict';
  c.TransformCanvas = function(id, width, height, rotate3D) {
    if (id) {
      this.create(id, width, height);
    }
    this.rotate3D = rotate3D;
  };
  var _ = c.TransformCanvas.prototype = new c._Canvas();
  _.lastPoint = undefined;
  _.rotationMultMod = 1.3;
  _.lastPinchScale = 1;
  _.lastGestureRotate = 0;
  _.mousedown = function(e) {
    this.lastPoint = e.p;
  };
  _.dblclick = function(e) {
    // center structure
    this.center();
    this.repaint();
  };
  _.drag = function(e) {
    if (!this.lastPoint.multi) {
      if (monitor.ALT) {
        var t = new structures.Point(e.p.x, e.p.y);
        t.sub(this.lastPoint);
        for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
          var mol = this.molecules[i];
          for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
            mol.atoms[j].add(t);
          }
          mol.check();
        }
        for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
          var sps = this.shapes[i].getPoints();
          for ( var j = 0, jj = sps.length; j < jj; j++) {
            sps[j].add(t);
          }
        }
        this.lastPoint = e.p;
        this.repaint();
      } else {
        if (this.rotate3D === true) {
          var diameter = m.max(this.width / 4, this.height / 4);
          var difx = e.p.x - this.lastPoint.x;
          var dify = e.p.y - this.lastPoint.y;
          var yIncrement = difx / diameter * this.rotationMultMod;
          var xIncrement = -dify / diameter * this.rotationMultMod;
          var matrix = [];
          m4.identity(matrix);
          m4.rotate(matrix, xIncrement, [ 1, 0, 0 ]);
          m4.rotate(matrix, yIncrement, [ 0, 1, 0 ]);
          for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
            var mol = this.molecules[i];
            for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
              var a = mol.atoms[j];
              var p = [ a.x - this.width / 2, a.y - this.height / 2, a.z ];
              m4.multiplyVec3(matrix, p);
              a.x = p[0] + this.width / 2;
              a.y = p[1] + this.height / 2;
              a.z = p[2];
            }
            for ( var i = 0, ii = mol.rings.length; i < ii; i++) {
              mol.rings[i].center = mol.rings[i].getCenter();
            }
            this.lastPoint = e.p;
            if (this.specs.atoms_display && this.specs.atoms_circles_2D) {
              mol.sortAtomsByZ();
            }
            if (this.specs.bonds_display && this.specs.bonds_clearOverlaps_2D) {
              mol.sortBondsByZ();
            }
          }
          this.repaint();
        } else {
          var center = new structures.Point(this.width / 2, this.height / 2);
          var before = center.angle(this.lastPoint);
          var after = center.angle(e.p);
          this.specs.rotateAngle -= (after - before);
          this.lastPoint = e.p;
          this.repaint();
        }
      }
    }
  };
  _.mousewheel = function(e, delta) {
    this.specs.scale += delta / 50;
    if (this.specs.scale < .01) {
      this.specs.scale = .01;
    }
    this.repaint();
  };
  _.multitouchmove = function(e, numFingers) {
    if (numFingers === 2) {
      if (this.lastPoint.multi) {
        var t = new structures.Point(e.p.x, e.p.y);
        t.sub(this.lastPoint);
        for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
          var m = this.molecules[i];
          for ( var j = 0, jj = m.atoms.length; j < jj; j++) {
            m.atoms[j].add(t);
          }
          m.check();
        }
        for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
          var sps = this.shapes[i].getPoints();
          for ( var j = 0, jj = sps.length; j < jj; j++) {
            sps[j].add(t);
          }
        }
        this.lastPoint = e.p;
        this.lastPoint.multi = true;
        this.repaint();
      } else {
        this.lastPoint = e.p;
        this.lastPoint.multi = true;
      }
    }
  };
  _.gesturechange = function(e) {
    if (e.originalEvent.scale - this.lastPinchScale !== 0) {
      this.specs.scale *= e.originalEvent.scale / this.lastPinchScale;
      if (this.specs.scale < .01) {
        this.specs.scale = .01;
      }
      this.lastPinchScale = e.originalEvent.scale;
    }
    if (this.lastGestureRotate - e.originalEvent.rotation !== 0) {
      var rot = (this.lastGestureRotate - e.originalEvent.rotation) / 180 * m.PI;
      var center = new structures.Point(this.width / 2, this.height / 2);
      for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
        var m = this.molecules[i];
        for ( var j = 0, jj = m.atoms.length; j < jj; j++) {
          var a = m.atoms[j];
          var dist = center.distance(a);
          var angle = center.angle(a) + rot;
          a.x = center.x + dist * m.cos(angle);
          a.y = center.y - dist * m.sin(angle);
        }
        m.check();
      }
      this.lastGestureRotate = e.originalEvent.rotation;
    }
    this.repaint();
  };
  _.gestureend = function(e) {
    this.lastPinchScale = 1;
    this.lastGestureRotate = 0;
  };

})(ChemDoodle, ChemDoodle.monitor, ChemDoodle.structures, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c) {
  'use strict';
  c.ViewerCanvas = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  c.ViewerCanvas.prototype = new c._Canvas();

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, document) {
  'use strict';
  c._SpectrumCanvas = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  var _ = c._SpectrumCanvas.prototype = new c._Canvas();
  _.spectrum = undefined;
  _.emptyMessage = 'No Spectrum Loaded or Recognized';
  _.loadMolecule = undefined;
  _.getMolecule = undefined;
  _.innerRepaint = function(ctx) {
    if (this.spectrum && this.spectrum.data.length > 0) {
      this.spectrum.draw(ctx, this.specs, this.width, this.height);
    } else if (this.emptyMessage) {
      ctx.fillStyle = '#737683';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '18px Helvetica, Verdana, Arial, Sans-serif';
      ctx.fillText(this.emptyMessage, this.width / 2, this.height / 2);
    }
  };
  _.loadSpectrum = function(spectrum) {
    this.spectrum = spectrum;
    this.repaint();
  };
  _.getSpectrum = function() {
    return this.spectrum;
  };
  _.getSpectrumCoordinates = function(x, y) {
    return spectrum.getInternalCoordinates(x, y, this.width, this.height);
  };

})(ChemDoodle, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c) {
  'use strict';
  c.ObserverCanvas = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  c.ObserverCanvas.prototype = new c._SpectrumCanvas();

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(c) {
  'use strict';
  c.OverlayCanvas = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  var _ = c.OverlayCanvas.prototype = new c._SpectrumCanvas();
  _.overlaySpectra = [];
  _.superRepaint = _.innerRepaint;
  _.innerRepaint = function(ctx) {
    this.superRepaint(ctx);
    if (this.spectrum && this.spectrum.data.length > 0) {
      for ( var i = 0, ii = this.overlaySpectra.length; i < ii; i++) {
        var s = this.overlaySpectra[i];
        if (s && s.data.length > 0) {
          s.minX = this.spectrum.minX;
          s.maxX = this.spectrum.maxX;
          s.drawPlot(ctx, this.specs, this.width, this.height, this.spectrum.memory.offsetTop, this.spectrum.memory.offsetLeft, this.spectrum.memory.offsetBottom);
        }
      }
    }
  };
  _.addSpectrum = function(spectrum) {
    if (!this.spectrum) {
      this.spectrum = spectrum;
    } else {
      this.overlaySpectra.push(spectrum);
    }
  };

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, monitor, m) {
  'use strict';
  c.PerspectiveCanvas = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  var _ = c.PerspectiveCanvas.prototype = new c._SpectrumCanvas();
  _.dragRange = undefined;
  _.rescaleYAxisOnZoom = true;
  _.lastPinchScale = 1;
  _.mousedown = function(e) {
    this.dragRange = new c.structures.Point(e.p.x, e.p.x);
  };
  _.mouseup = function(e) {
    if (this.dragRange && this.dragRange.x !== this.dragRange.y) {
      if (!this.dragRange.multi) {
        var newScale = this.spectrum.zoom(this.dragRange.x, e.p.x, this.width, this.rescaleYAxisOnZoom);
        if (this.rescaleYAxisOnZoom) {
          this.specs.scale = newScale;
        }
      }
      this.dragRange = undefined;
      this.repaint();
    }
  };
  _.drag = function(e) {
    if (this.dragRange) {
      if (this.dragRange.multi) {
        this.dragRange = undefined;
      } else if (monitor.SHIFT) {
        this.spectrum.translate(e.p.x - this.dragRange.x, this.width);
        this.dragRange.x = e.p.x;
        this.dragRange.y = e.p.x;
      } else {
        this.dragRange.y = e.p.x;
      }
      this.repaint();
    }
  };
  _.drawChildExtras = function(ctx) {
    if (this.dragRange) {
      var xs = m.min(this.dragRange.x, this.dragRange.y);
      var xe = m.max(this.dragRange.x, this.dragRange.y);
      ctx.strokeStyle = 'gray';
      ctx.lineStyle = 1;
      ctx.beginPath();
      ctx.moveTo(xs, this.height / 2);
      for ( var i = xs; i <= xe; i++) {
        if (i % 10 < 5) {
          ctx.lineTo(i, m.round(this.height / 2));
        } else {
          ctx.moveTo(i, m.round(this.height / 2));
        }
      }
      ctx.stroke();
    }
  };
  _.mousewheel = function(e, delta) {
    this.specs.scale += delta / 10;
    if (this.specs.scale < .01) {
      this.specs.scale = .01;
    }
    this.repaint();
  };
  _.dblclick = function(e) {
    this.spectrum.setup();
    this.specs.scale = 1;
    this.repaint();
  };
  _.multitouchmove = function(e, numFingers) {
    if (numFingers === 2) {
      if (!this.dragRange || !this.dragRange.multi) {
        this.dragRange = new c.structures.Point(e.p.x, e.p.x);
        this.dragRange.multi = true;
      } else {
        this.spectrum.translate(e.p.x - this.dragRange.x, this.width);
        this.dragRange.x = e.p.x;
        this.dragRange.y = e.p.x;
        this.repaint();
      }
    }
  };
  _.gesturechange = function(e) {
    this.specs.scale *= e.originalEvent.scale / this.lastPinchScale;
    if (this.specs.scale < .01) {
      this.specs.scale = .01;
    }
    this.lastPinchScale = e.originalEvent.scale;
    this.repaint();
  };
  _.gestureend = function(e) {
    this.lastPinchScale = 1;
  };

})(ChemDoodle, ChemDoodle.monitor, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(c, extensions, m) {
  'use strict';
  c.SeekerCanvas = function(id, width, height, seekType) {
    if (id) {
      this.create(id, width, height);
    }
    this.seekType = seekType;
  };
  var _ = c.SeekerCanvas.prototype = new c._SpectrumCanvas();
  _.superRepaint = _.innerRepaint;
  _.innerRepaint = function(ctx) {
    this.superRepaint(ctx);
    if (this.spectrum && this.spectrum.data.length > 0 && this.p) {
      // set up coords
      var renderP;
      var internalP;
      if (this.seekType === c.SeekerCanvas.SEEK_POINTER) {
        renderP = this.p;
        internalP = this.spectrum.getInternalCoordinates(renderP.x, renderP.y);
      } else if (this.seekType === c.SeekerCanvas.SEEK_PLOT || this.seekType === c.SeekerCanvas.SEEK_PEAK) {
        internalP = this.seekType === c.SeekerCanvas.SEEK_PLOT ? this.spectrum.getClosestPlotInternalCoordinates(this.p.x) : this.spectrum.getClosestPeakInternalCoordinates(this.p.x);
        if (!internalP) {
          return;
        }
        renderP = {
          x : this.spectrum.getTransformedX(internalP.x, this.specs, this.width, this.spectrum.memory.offsetLeft),
          y : this.spectrum.getTransformedY(internalP.y / 100, this.specs, this.height, this.spectrum.memory.offsetBottom, this.spectrum.memory.offsetTop)
        };
      }
      // draw point
      ctx.fillStyle = 'white';
      ctx.strokeStyle = this.specs.plots_color;
      ctx.lineWidth = this.specs.plots_width;
      ctx.beginPath();
      ctx.arc(renderP.x, renderP.y, 3, 0, m.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      // draw internal coordinates
      ctx.font = extensions.getFontString(this.specs.text_font_size, this.specs.text_font_families);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      var s = 'x:' + internalP.x.toFixed(3) + ', y:' + internalP.y.toFixed(3);
      var x = renderP.x + 3;
      var w = ctx.measureText(s).width;
      if (x + w > this.width - 2) {
        x -= 6 + w;
      }
      var y = renderP.y;
      if (y - this.specs.text_font_size - 2 < 0) {
        y += this.specs.text_font_size;
      }
      ctx.fillRect(x, y - this.specs.text_font_size, w, this.specs.text_font_size);
      ctx.fillStyle = 'black';
      ctx.fillText(s, x, y);
    }
  };
  _.mouseout = function(e) {
    this.p = undefined;
    this.repaint();
  };
  _.mousemove = function(e) {
    this.p = {
      x : e.p.x - 2,
      y : e.p.y - 3
    };
    this.repaint();
  };
  _.touchstart = function(e) {
    this.mousemove(e);
  };
  _.touchmove = function(e) {
    this.mousemove(e);
  };
  _.touchend = function(e) {
    this.mouseout(e);
  };
  c.SeekerCanvas.SEEK_POINTER = 'pointer';
  c.SeekerCanvas.SEEK_PLOT = 'plot';
  c.SeekerCanvas.SEEK_PEAK = 'peak';

})(ChemDoodle, ChemDoodle.extensions, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4500 $
//  $Author: kevin $
//  $LastChangedDate: 2013-09-06 14:28:15 -0400 (Fri, 06 Sep 2013) $

(function(c, extensions, math, structures, d3, RESIDUE, m, document, m4, m3, v3, window) {
  'use strict';
  c._Canvas3D = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  var _ = c._Canvas3D.prototype = new c._Canvas();
  _.rotationMatrix = undefined;
  _.translationMatrix = undefined;
  _.lastPoint = undefined;
  _.emptyMessage = 'WebGL is Unavailable!';
  _.afterLoadContent = function() {
    var bounds = new math.Bounds();
    for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
      bounds.expand(this.molecules[i].getBounds3D());
    }
    // build fog parameter
    var maxDimension3D = v3.dist([bounds.maxX, bounds.maxY, bounds.maxZ], [bounds.minX, bounds.minY, bounds.minZ]) / 2 + 1.5;

    var fov = 45;
    var theta = fov / 360 * Math.PI;
    var tanTheta = Math.tan(theta) / 0.8;
    var top = maxDimension3D;
    this.depth = top / tanTheta;
    var near = m.max(this.depth - top, 0.1);
    var far = this.depth + top;
    var aspec = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

    if (aspec < 1) {
      fov /= aspec;
    }

    this.specs.projectionOrthoWidth_3D = Math.tan(fov / 360 * Math.PI) * this.depth * 2 * aspec;
    this.specs.projectionPerspectiveVerticalFieldOfView_3D = fov;
    this.specs.projectionFrontCulling_3D = near;
    this.specs.projectionBackCulling_3D = far;
    this.specs.projectionWidthHeightRatio_3D = aspec;

    this.translationMatrix = m4.translate(m4.identity([]), [ 0, 0, -this.depth ]);

    this.maxDimension = m.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
    // this.translationMatrix = m4.translate(m4.identity([]), [ 0, 0,
    // -this.maxDimension - 10 ]);
    this.setupScene();
  };
  _.setViewDistance = function(fov) {
    var minFov = 0.1;
    var maxFov = 179.9;
    this.specs.projectionPerspectiveVerticalFieldOfView_3D = math.clamp(this.specs.projectionPerspectiveVerticalFieldOfView_3D / fov, minFov, maxFov);
    this.specs.projectionOrthoWidth_3D = m.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * Math.PI) * this.depth * 2 * this.specs.projectionWidthHeightRatio_3D;
    this.updateScene();
  };
  _.repaint = function() {
    if (this.gl) {
      // ready the bits for rendering
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      // set up the model view matrix to the specified transformations
      this.gl.modelViewMatrix = m4.multiply(this.translationMatrix, this.rotationMatrix, []);
      this.gl.rotationMatrix = this.rotationMatrix;

      // use default projection matrix to draw the molecule
      var pUniform = this.gl.getUniformLocation(this.gl.program, 'u_projection_matrix');
      this.gl.uniformMatrix4fv(pUniform, false, this.gl.projectionMatrix);
      this.gl.fogging.setMode(this.specs.fog_mode_3D);

      for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
        this.molecules[i].render(this.gl, this.specs);
      }
      for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
        this.shapes[i].render(this.gl, this.specs);
      }

      if (this.specs.compass_display) {
        // use projection matrix to draw the compass
        this.gl.uniformMatrix4fv(pUniform, false, this.compass.projectionMatrix);
        this.compass.render(this.gl, this.specs);
      }

      // set up GLProgram and shader for rendering text
      var shaderText = this.gl.shaderText;
      this.gl.useProgram(this.gl.programLabel);

      // enable blend and depth mask set to false
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.depthMask(false);

      // enable vertex for draw text
      this.gl.enableVertexAttribArray(shaderText.vertexPositionAttribute);
      this.gl.enableVertexAttribArray(shaderText.vertexTexCoordAttribute);
      this.gl.enableVertexAttribArray(shaderText.vertexTranslationAttribute);
      this.gl.enableVertexAttribArray(shaderText.vertexZDepthAttribute);

      // draw label molecule
      if (this.specs.atoms_displayLabels_3D) {
        this.label3D.render(this.gl, this.specs, this.getMolecules());
      }

      // draw compass X Y Z text
      if (this.specs.compass_display && this.specs.compass_displayText_3D) {
        this.compass.renderText(this.gl);
      }

      // disable vertex for draw text
      this.gl.disableVertexAttribArray(shaderText.vertexPositionAttribute);
      this.gl.disableVertexAttribArray(shaderText.vertexTexCoordAttribute);
      this.gl.disableVertexAttribArray(shaderText.vertexTranslationAttribute);
      this.gl.disableVertexAttribArray(shaderText.vertexZDepthAttribute);

      // disable blend and depth mask set to true
      this.gl.disable(this.gl.BLEND);
      this.gl.depthMask(true);

      // reset to prev setting
      this.gl.useProgram(this.gl.program);
      this.gl.enableVertexAttribArray(this.gl.shader.vertexPositionAttribute);
      this.gl.enableVertexAttribArray(this.gl.shader.vertexNormalAttribute);

      // flush as this is seen in documentation
      this.gl.flush();
    }
  };
  _.pick = function(x, y) {
    if (this.gl) {
      var gl = this.gl;

      // set up the model view matrix to the specified transformations
      m4.multiply(this.translationMatrix, this.rotationMatrix, this.gl.modelViewMatrix);
      this.gl.rotationMatrix = this.rotationMatrix;

      // use default projection matrix to draw the molecule
      var pUniform = this.gl.getUniformLocation(this.gl.program, 'u_projection_matrix');
      this.gl.uniformMatrix4fv(pUniform, false, this.gl.projectionMatrix);

      // draw with pick framebuffer
      return this.picker.pick(gl, this.molecules, this.specs, x, this.height - y);
    }
    return undefined;
  };
  _.center = function() {
    var canvas = document.getElementById(this.id);
    var p = new structures.Atom();
    for ( var k = 0, kk = this.molecules.length; k < kk; k++) {
      var m = this.molecules[k];
      p.add3D(m.getCenter3D());
    }
    p.x /= this.molecules.length;
    p.y /= this.molecules.length;
    for ( var k = 0, kk = this.molecules.length; k < kk; k++) {
      var m = this.molecules[k];
      for ( var i = 0, ii = m.atoms.length; i < ii; i++) {
        m.atoms[i].sub3D(p);
      }
      if (m.chains && m.fromJSON) {
        for ( var i = 0, ii = m.chains.length; i < ii; i++) {
          var chain = m.chains[i];
          for ( var j = 0, jj = chain.length; j < jj; j++) {
            var residue = chain[j];
            residue.cp1.sub3D(p);
            residue.cp2.sub3D(p);
            if (residue.cp3) {
              residue.cp3.sub3D(p);
              residue.cp4.sub3D(p);
              residue.cp5.sub3D(p);
            }
          }
        }
      }
    }
  };
  _.subCreate = function() {
    // setup gl object
    try {
      var canvas = document.getElementById(this.id);
      this.gl = canvas.getContext('webgl');
      if (!this.gl) {
        this.gl = canvas.getContext('experimental-webgl');
      }
    } catch (e) {
    }
    if (this.gl) {
      // setup matrices
      this.rotationMatrix = m4.identity([]);
      this.translationMatrix = m4.identity([]);
      // setup viewport
      this.gl.viewport(0, 0, this.width, this.height);
      this.gl.program = this.gl.createProgram();
      // this is the shader
      this.gl.shader = new d3.Shader();
      this.gl.shader.init(this.gl);
      // shader for text renderer
      this.gl.programLabel = this.gl.createProgram();
      this.gl.shaderText = new d3.TextShader();
      this.gl.shaderText.init(this.gl);
      this.setupScene();
    } else {
      this.displayMessage();
    }
  };
  c._Canvas.prototype.displayMessage = function() {
    var canvas = document.getElementById(this.id);
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      if (this.specs.backgroundColor) {
        ctx.fillStyle = this.specs.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
      }
      if (this.emptyMessage) {
        ctx.fillStyle = '#737683';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '18px Helvetica, Verdana, Arial, Sans-serif';
        ctx.fillText(this.emptyMessage, this.width / 2, this.height / 2);
      }
    }
  };
  _.setupScene = function() {
    if (this.gl) {
      // clear the canvas
      var cs = math.getRGB(this.specs.backgroundColor, 1);
      this.gl.clearColor(cs[0], cs[1], cs[2], 1.0);
      this.gl.clearDepth(1.0);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      if (this.specs.cullBackFace_3D) {
        this.gl.enable(this.gl.CULL_FACE);
      }
      // here is the sphere buffer to be drawn, make it once, then scale
      // and translate to draw atoms
      this.gl.sphereBuffer = new d3.Sphere(1, this.specs.atoms_resolution_3D, this.specs.atoms_resolution_3D);
      this.gl.starBuffer = new d3.Star();
      this.gl.cylinderBuffer = new d3.Cylinder(1, 1, this.specs.bonds_resolution_3D);
      this.gl.pillBuffer = new d3.Pill(this.specs.bonds_pillDiameter_3D / 2, this.specs.bonds_pillHeight_3D, this.specs.bonds_pillLatitudeResolution_3D, this.specs.bonds_pillLongitudeResolution_3D);
      this.gl.lineBuffer = new d3.Line();
      this.gl.arrowBuffer = new d3.Arrow(0.3, this.specs.compass_resolution_3D);
      // add label
      this.label3D = new d3.Label();
      this.label3D.init(this.gl, this.specs);

      for ( var k = 0, kk = this.molecules.length; k < kk; k++) {
        var mol = this.molecules[k];
        if (!(mol.labelMesh instanceof d3.TextMesh)) {
          mol.labelMesh = new d3.TextMesh();
          mol.labelMesh.init(this.gl);
        }
        if (mol.unitCellVectors) {
          mol.unitCell = new d3.UnitCell(mol.unitCellVectors);
        }
        if (mol.chains) {
          mol.ribbons = [];
          mol.cartoons = [];
          mol.tubes = [];
          // set up ribbon diagram if available and not already setup
          for ( var j = 0, jj = mol.chains.length; j < jj; j++) {
            var rs = mol.chains[j];
            var isNucleotide = rs.length > 2 && RESIDUE[rs[2].name] && RESIDUE[rs[2].name].aminoColor === '#BEA06E';
            if (rs.length > 0 && !rs[0].lineSegments) {
              for ( var i = 0, ii = rs.length - 1; i < ii; i++) {
                rs[i].setup(rs[i + 1].cp1, isNucleotide ? 1 : this.specs.proteins_horizontalResolution);
              }
              if (!isNucleotide) {
                for ( var i = 1, ii = rs.length - 1; i < ii; i++) {
                  // reverse guide points if carbonyl
                  // orientation flips
                  if (extensions.vec3AngleFrom(rs[i - 1].D, rs[i].D) > m.PI / 2) {
                    rs[i].guidePointsSmall.reverse();
                    rs[i].guidePointsLarge.reverse();
                    v3.scale(rs[i].D, -1);
                  }
                }
              }
              for ( var i = 1, ii = rs.length - 3; i < ii; i++) {
                // compute line segments
                rs[i].computeLineSegments(rs[i - 1], rs[i + 1], rs[i + 2], !isNucleotide, isNucleotide ? this.specs.nucleics_verticalResolution : this.specs.proteins_verticalResolution);
              }
              // remove unneeded dummies
              rs.pop();
              rs.pop();
              rs.pop();
              rs.shift();
            }
            // create the hsl color for the chain
            var rgb = math.hsl2rgb(jj === 1 ? .5 : j / jj, 1, .5);
            var chainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            rs.chainColor = chainColor;
            if (isNucleotide) {
              var t = new d3.Tube(rs, this.specs.nucleics_tubeThickness, this.specs.nucleics_tubeResolution_3D);
              t.chainColor = chainColor;
              mol.tubes.push(t);
            } else {
              var r = {
                front : new d3.Ribbon(rs, this.specs.proteins_ribbonThickness, false),
                back : new d3.Ribbon(rs, -this.specs.proteins_ribbonThickness, false)
              };
              r.front.chainColor = chainColor;
              r.back.chainColor = chainColor;
              for ( var i = 0, ii = r.front.segments.length; i < ii; i++) {
                r.front.segments[i].chainColor = chainColor;
              }
              for ( var i = 0, ii = r.back.segments.length; i < ii; i++) {
                r.back.segments[i].chainColor = chainColor;
              }
              mol.ribbons.push(r);
              var d = {
                front : new d3.Ribbon(rs, this.specs.proteins_ribbonThickness, true),
                back : new d3.Ribbon(rs, -this.specs.proteins_ribbonThickness, true)
              };
              d.front.chainColor = chainColor;
              d.back.chainColor = chainColor;
              for ( var i = 0, ii = d.front.segments.length; i < ii; i++) {
                d.front.segments[i].chainColor = chainColor;
              }
              for ( var i = 0, ii = d.back.segments.length; i < ii; i++) {
                d.back.segments[i].chainColor = chainColor;
              }
              for ( var i = 0, ii = d.front.cartoonSegments.length; i < ii; i++) {
                d.front.cartoonSegments[i].chainColor = chainColor;
              }
              for ( var i = 0, ii = d.back.cartoonSegments.length; i < ii; i++) {
                d.back.cartoonSegments[i].chainColor = chainColor;
              }
              mol.cartoons.push(d);
            }
          }
        }
      }
      this.label3D.updateVerticesBuffer(this.gl, this.getMolecules(), this.specs);

      // the molecules in frame of MovieCanvas3D must be handled
      if (this instanceof c.MovieCanvas3D && this.frames) {
        for ( var i = 0, ii = this.frames.length; i < ii; i++) {
          var f = this.frames[i];
          for ( var j = 0, jj = f.mols.length; j < jj; j++) {
            var mol = f.mols[j];
            if (!(mol.labelMesh instanceof structures.d3.TextMesh)) {
              mol.labelMesh = new structures.d3.TextMesh();
              mol.labelMesh.init(this.gl);
            }
          }
          this.label3D.updateVerticesBuffer(this.gl, f.mols, this.specs);
        }
      }
      // set up lighting
      this.gl.lighting = new d3.Light(this.specs.lightDiffuseColor_3D, this.specs.lightSpecularColor_3D, this.specs.lightDirection_3D);
      this.gl.lighting.lightScene(this.gl);
      // set up material
      this.gl.material = new d3.Material(this.gl);
      // set up fogging
      this.gl.fogging = new d3.Fog(this.gl);
      this.gl.fogging.setTempParameter(this.specs.fog_color_3D || this.specs.backgroundColor, this.specs.fog_start_3D, this.specs.fog_end_3D, this.specs.fog_density_3D);
      // set up compass
      this.compass = new d3.Compass(this.gl, this.specs);

      // projection matrix
      // arg1: vertical field of view (degrees)
      // arg2: width to height ratio
      // arg3: front culling
      // arg4: back culling
      var widthHeightRatio = this.width / this.height;
      if (this.specs.projectionWidthHeightRatio_3D) {
        widthHeightRatio = this.specs.projectionWidthHeightRatio_3D;
      }
      this.gl.projectionMatrix = this.specs.projectionPerspective_3D ? m4.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D, widthHeightRatio, this.specs.projectionFrontCulling_3D, this.specs.projectionBackCulling_3D) : m4.ortho(-this.specs.projectionOrthoWidth_3D / 2, this.specs.projectionOrthoWidth_3D / 2, -this.specs.projectionOrthoWidth_3D / 2 / widthHeightRatio, this.specs.projectionOrthoWidth_3D / 2 / widthHeightRatio, this.specs.projectionFrontCulling_3D,
          this.specs.projectionBackCulling_3D);
      // push the projection matrix to the graphics card
      var pUniform = this.gl.getUniformLocation(this.gl.program, 'u_projection_matrix');
      this.gl.uniformMatrix4fv(pUniform, false, this.gl.projectionMatrix);
      // matrix setup functions
      var mvUL = this.gl.getUniformLocation(this.gl.program, 'u_model_view_matrix');
      var nUL = this.gl.getUniformLocation(this.gl.program, 'u_normal_matrix');
      this.gl.setMatrixUniforms = function(mvMatrix) {
        // push the model-view matrix to the graphics card
        this.uniformMatrix4fv(mvUL, false, mvMatrix);
        // create the normal matrix and push it to the graphics card
        var normalMatrix = m3.transpose(m4.toInverseMat3(mvMatrix, []));
        this.uniformMatrix3fv(nUL, false, normalMatrix);
      };

      // set framebuffer
      this.picker = new d3.Picker();
      this.picker.init(this.gl);
      this.picker.setDimension(this.gl, this.width, this.height);
    }
  };
  _.mousedown = function(e) {
    this.lastPoint = e.p;
  };
  _.rightmousedown = function(e) {
    this.lastPoint = e.p;
  };
  _.drag = function(e) {
    if (c.monitor.ALT) {
      var t = new structures.Point(e.p.x, e.p.y);
      t.sub(this.lastPoint);
      var theta = this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * m.PI;
      var tanTheta = m.tan(theta);
      var topScreen = this.height / 2;
      var nearScreen = topScreen / tanTheta;
      var nearRatio = this.depth / nearScreen;
      m4.translate(this.translationMatrix, [ t.x * nearRatio, -t.y * nearRatio, 0 ]);
      this.lastPoint = e.p;
      this.repaint();
    } else {
      var difx = e.p.x - this.lastPoint.x;
      var dify = e.p.y - this.lastPoint.y;
      var rotation = m4.rotate(m4.identity([]), difx * m.PI / 180.0, [ 0, 1, 0 ]);
      m4.rotate(rotation, dify * m.PI / 180.0, [ 1, 0, 0 ]);
      this.rotationMatrix = m4.multiply(rotation, this.rotationMatrix);
      this.lastPoint = e.p;
      this.repaint();
    }
  };
  _.mousewheel = function(e, delta) {
    var minFov = 0.1;
    var maxFov = 179.9;
    var dz = delta;
    var fov = this.specs.projectionPerspectiveVerticalFieldOfView_3D + dz;

    this.specs.projectionPerspectiveVerticalFieldOfView_3D = fov < minFov ? minFov : fov > maxFov ? maxFov : fov;
    this.specs.projectionOrthoWidth_3D = Math.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * Math.PI) * this.depth * 2 * this.specs.projectionWidthHeightRatio_3D;

    this.updateScene();
  };
  _.updateScene = function() {
    this.gl.fogging.setTempParameter(this.specs.fog_color_3D || this.specs.backgroundColor, this.specs.fog_start_3D, this.specs.fog_end_3D, this.specs.fog_density_3D);
    var widthHeightRatio = this.width / this.height;
    if (this.specs.projectionWidthHeightRatio_3D) {
      widthHeightRatio = this.specs.projectionWidthHeightRatio_3D;
    }
    this.gl.projectionMatrix = this.specs.projectionPerspective_3D ? m4.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D, widthHeightRatio, this.specs.projectionFrontCulling_3D, this.specs.projectionBackCulling_3D) : m4.ortho(-this.specs.projectionOrthoWidth_3D / 2, this.specs.projectionOrthoWidth_3D / 2, -this.specs.projectionOrthoWidth_3D / 2 / widthHeightRatio, this.specs.projectionOrthoWidth_3D / 2 / widthHeightRatio, this.specs.projectionFrontCulling_3D,
        this.specs.projectionBackCulling_3D);
    this.repaint();
  };

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d3, ChemDoodle.RESIDUE, Math, document, mat4, mat3, vec3, window);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, iChemLabs, q, document) {
  'use strict';
  c.MolGrabberCanvas3D = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
    var sb = [];
    sb.push('<br><input type="text" id="');
    sb.push(id);
    sb.push('_query" size="32" value="" />');
    sb.push('<br><nobr>');
    sb.push('<select id="');
    sb.push(id);
    sb.push('_select">');
    // sb.push('<option value="chemexper">ChemExper');
    // sb.push('<option value="chemspider">ChemSpider');
    sb.push('<option value="pubchem" selected>PubChem');
    sb.push('</select>');
    sb.push('<button id="');
    sb.push(id);
    sb.push('_submit">Show Molecule</button>');
    sb.push('</nobr>');
    document.writeln(sb.join(''));
    var self = this;
    q('#' + id + '_submit').click(function() {
      self.search();
    });
    q('#' + id + '_query').keypress(function(e) {
      if (e.which === 13) {
        self.search();
      }
    });
  };
  var _ = c.MolGrabberCanvas3D.prototype = new c._Canvas3D();
  _.setSearchTerm = function(term) {
    q('#' + this.id + '_query').val(term);
    this.search();
  };
  _.search = function() {
    var self = this;
    iChemLabs.getMoleculeFromDatabase(q('#' + this.id + '_query').val(), {
      database : q('#' + this.id + '_select').val(),
      dimension : 3
    }, function(mol) {
      self.loadMolecule(mol);
    });
  };

})(ChemDoodle, ChemDoodle.iChemLabs, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(c, structures) {
  'use strict';
  c.MovieCanvas3D = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
    this.frames = [];
  };
  c.MovieCanvas3D.PLAY_ONCE = 0;
  c.MovieCanvas3D.PLAY_LOOP = 1;
  c.MovieCanvas3D.PLAY_SPRING = 2;
  var _ = c.MovieCanvas3D.prototype = new c._Canvas3D();
  _.timeout = 50;
  _.frameNumber = 0;
  _.playMode = 2;
  _.reverse = false;
  _.startAnimation = c._AnimatorCanvas.prototype.startAnimation;
  _.stopAnimation = c._AnimatorCanvas.prototype.stopAnimation;
  _.isRunning = c._AnimatorCanvas.prototype.isRunning;
  _.dblclick = c.RotatorCanvas.prototype.dblclick;
  _.nextFrame = function(delta) {
    var f = this.frames[this.frameNumber];
    this.molecules = f.mols;
    this.shapes = f.shapes;
    if (this.playMode === 2 && this.reverse) {
      this.frameNumber--;
      if (this.frameNumber < 0) {
        this.frameNumber = 1;
        this.reverse = false;
      }
    } else {
      this.frameNumber++;
      if (this.frameNumber >= this.frames.length) {
        if (this.playMode === 2) {
          this.frameNumber -= 2;
          this.reverse = true;
        } else {
          this.frameNumber = 0;
          if (this.playMode === 0) {
            this.stopAnimation();
          }
        }
      }
    }
  };
  _.center = function() {
    // override this function to center the entire movie
    var p = new structures.Atom();
    var first = this.frames[0];
    for ( var j = 0, jj = first.mols.length; j < jj; j++) {
      p.add3D(first.mols[j].getCenter3D());
    }
    p.x /= first.mols.length;
    p.y /= first.mols.length;
    var center = new structures.Atom();
    center.sub3D(p);
    for ( var i = 0, ii = this.frames.length; i < ii; i++) {
      var f = this.frames[i];
      for ( var j = 0, jj = f.mols.length; j < jj; j++) {
        var mol = f.mols[j];
        for ( var k = 0, kk = mol.atoms.length; k < kk; k++) {
          mol.atoms[k].add3D(center);
        }
      }
    }
  };
  _.addFrame = function(molecules, shapes) {
    this.frames.push({
      mols : molecules,
      shapes : shapes
    });
  };

})(ChemDoodle, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, m, m4) {
  'use strict';
  // keep these declaration outside the loop to avoid overhead
  var matrix = [];
  var xAxis = [ 1, 0, 0 ];
  var yAxis = [ 0, 1, 0 ];
  var zAxis = [ 0, 0, 1 ];

  c.RotatorCanvas3D = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  var _ = c.RotatorCanvas3D.prototype = new c._Canvas3D();
  _.timeout = 33;
  var increment = m.PI / 15;
  _.xIncrement = increment;
  _.yIncrement = increment;
  _.zIncrement = increment;
  _.startAnimation = c._AnimatorCanvas.prototype.startAnimation;
  _.stopAnimation = c._AnimatorCanvas.prototype.stopAnimation;
  _.isRunning = c._AnimatorCanvas.prototype.isRunning;
  _.dblclick = c.RotatorCanvas.prototype.dblclick;
  _.mousedown = undefined;
  _.rightmousedown = undefined;
  _.drag = undefined;
  _.mousewheel = undefined;
  _.nextFrame = function(delta) {
    if (this.molecules.length === 0 && this.shapes.length === 0) {
      this.stopAnimation();
      return;
    }
    m4.identity(matrix);
    var change = delta / 1000;
    m4.rotate(matrix, this.xIncrement * change, xAxis);
    m4.rotate(matrix, this.yIncrement * change, yAxis);
    m4.rotate(matrix, this.zIncrement * change, zAxis);
    m4.multiply(this.rotationMatrix, matrix);
  };

})(ChemDoodle, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(c) {
  'use strict';
  c.TransformCanvas3D = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  c.TransformCanvas3D.prototype = new c._Canvas3D();

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(c) {
  'use strict';
  c.ViewerCanvas3D = function(id, width, height) {
    if (id) {
      this.create(id, width, height);
    }
  };
  var _ = c.ViewerCanvas3D.prototype = new c._Canvas3D();
  _.mousedown = undefined;
  _.rightmousedown = undefined;
  _.drag = undefined;
  _.mousewheel = undefined;

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(c, extensions, math, document) {
  'use strict';
  function PeriodicCell(element, x, y, dimension) {
    this.element = element;
    this.x = x;
    this.y = y;
    this.dimension = dimension;
  }

  c.PeriodicTableCanvas = function(id, cellDimension) {
    this.padding = 5;
    if (id) {
      this.create(id, cellDimension * 18 + this.padding * 2, cellDimension * 10 + this.padding * 2);
    }
    this.cellDimension = cellDimension ? cellDimension : 20;
    this.setupTable();
    this.repaint();
  };
  var _ = c.PeriodicTableCanvas.prototype = new c._Canvas();
  _.loadMolecule = undefined;
  _.getMolecule = undefined;
  _.getHoveredElement = function() {
    if (this.hovered) {
      return this.hovered.element;
    }
    return undefined;
  };
  _.innerRepaint = function(ctx) {
    for ( var i = 0, ii = this.cells.length; i < ii; i++) {
      this.drawCell(ctx, this.specs, this.cells[i]);
    }
    if (this.hovered) {
      this.drawCell(ctx, this.specs, this.hovered);
    }
    if (this.selected) {
      this.drawCell(ctx, this.specs, this.selected);
    }
  };
  _.setupTable = function() {
    this.cells = [];
    var x = this.padding;
    var y = this.padding;
    var count = 0;
    for ( var i = 0, ii = c.SYMBOLS.length; i < ii; i++) {
      if (count === 18) {
        count = 0;
        y += this.cellDimension;
        x = this.padding;
      }
      var e = c.ELEMENT[c.SYMBOLS[i]];
      if (e.atomicNumber === 2) {
        x += 16 * this.cellDimension;
        count += 16;
      } else if (e.atomicNumber === 5 || e.atomicNumber === 13) {
        x += 10 * this.cellDimension;
        count += 10;
      }
      if ((e.atomicNumber < 58 || e.atomicNumber > 71 && e.atomicNumber < 90 || e.atomicNumber > 103) && e.atomicNumber < 113) {
        this.cells.push(new PeriodicCell(e, x, y, this.cellDimension));
        x += this.cellDimension;
        count++;
      }
    }
    y += 2 * this.cellDimension;
    x = 3 * this.cellDimension + this.padding;
    for ( var i = 57; i < 104; i++) {
      var e = c.ELEMENT[c.SYMBOLS[i]];
      if (e.atomicNumber === 90) {
        y += this.cellDimension;
        x = 3 * this.cellDimension + this.padding;
      }
      if (e.atomicNumber >= 58 && e.atomicNumber <= 71 || e.atomicNumber >= 90 && e.atomicNumber <= 103) {
        this.cells.push(new PeriodicCell(e, x, y, this.cellDimension));
        x += this.cellDimension;
      }
    }
  };
  _.drawCell = function(ctx, specs, cell) {
    var radgrad = ctx.createRadialGradient(cell.x + cell.dimension / 3, cell.y + cell.dimension / 3, cell.dimension * 1.5, cell.x + cell.dimension / 3, cell.y + cell.dimension / 3, cell.dimension / 10);
    radgrad.addColorStop(0, '#000000');
    radgrad.addColorStop(.7, cell.element.jmolColor);
    radgrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = radgrad;
    extensions.contextRoundRect(ctx, cell.x, cell.y, cell.dimension, cell.dimension, cell.dimension / 8);
    if (cell === this.hovered || cell === this.selected) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#c10000';
      ctx.stroke();
      ctx.fillStyle = 'white';
    }
    ctx.fill();
    ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
    ctx.fillStyle = specs.text_color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cell.element.symbol, cell.x + cell.dimension / 2, cell.y + cell.dimension / 2);
  };
  _.click = function(e) {
    if (this.hovered) {
      this.selected = this.hovered;
      this.repaint();
    }
  };
  _.mousemove = function(e) {
    var x = e.p.x;
    var y = e.p.y;
    this.hovered = undefined;
    for ( var i = 0, ii = this.cells.length; i < ii; i++) {
      var c = this.cells[i];
      if (math.isBetween(x, c.x, c.x + c.dimension) && math.isBetween(y, c.y, c.y + c.dimension)) {
        this.hovered = c;
        break;
      }
    }
    this.repaint();
  };
  _.mouseout = function(e) {
    this.hovered = undefined;
    this.repaint();
  };

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.math, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3200 $
//  $Author: kevin $
//  $LastChangedDate: 2011-04-18 20:50:47 -0400 (Mon, 18 Apr 2011) $
//

(function(io, document, window) {
  'use strict';
  io.png = {};

  io.png.create = function(canvas) {
    // this will not work for WebGL canvases in some browsers
    // to fix that you need to set the "preserveDrawingBuffer" to true when
    // creating the WebGL context
    // note that this will cause performance issues on some platforms and is
    // therefore not done by default
    window.open(document.getElementById(canvas.id).toDataURL('image/png'));
  };

})(ChemDoodle.io, document, window);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3200 $
//  $Author: kevin $
//  $LastChangedDate: 2011-04-18 20:50:47 -0400 (Mon, 18 Apr 2011) $
//

(function(io, q) {
  'use strict';
  io.file = {};

  // this function will only work with files from the same origin it is being
  // called from, unless the receiving server supports XHR2
  io.file.content = function(url, callback) {
    q.get(url, '', callback);
  };

})(ChemDoodle.io, jQuery);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2976 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 18:16:10 -0500 (Wed, 29 Dec 2010) $
//

(function(c, iChemLabs, io, structures, q) {
  'use strict';
  iChemLabs.SERVER_URL = 'http://ichemlabs.cloud.chemdoodle.com/icl_cdc_v050000/WebHQ';

  iChemLabs.inRelay = false;
  iChemLabs.asynchronous = true;

  iChemLabs.INFO = {
    userAgent : navigator.userAgent,
    v_cwc : c.getVersion(),
    v_jQuery : q.version,
    v_jQuery_ui : (q.ui ? q.ui.version : 'N/A')
  };

  var JSON_INTERPRETER = new io.JSONInterpreter();

  iChemLabs._contactServer = function(call, content, options, callback, errorback) {
    if (this.inRelay) {
      alert('Already connecting to the server, please wait for the first request to finish.');
    } else {
      iChemLabs.inRelay = true;
      q.ajax({
        dataType : 'text',
        type : 'POST',
        data : JSON.stringify({
          'call' : call,
          'content' : content,
          'options' : options,
          'info' : iChemLabs.INFO
        }),
        url : this.SERVER_URL,
        success : function(data) {
          iChemLabs.inRelay = false;
          var o = JSON.parse(data);
          if (o.message) {
            alert(o.message);
          }
          if (callback && o.content && !o.stop) {
            callback(o.content);
          }
          if (o.stop && errorback) {
            errorback();
          }
        },
        error : function(xhr, status, error) {
          iChemLabs.inRelay = false;
          alert('Call failed. Please try again. If you continue to see this message, please contact iChemLabs customer support.');
          if (errorback) {
            errorback();
          }
        },
        xhrFields : {
          withCredentials : true
        },
        async : iChemLabs.asynchronous
      });
    }
  };

  // undocumented, this call is for clients that have licensed cloud for their
  // own servers
  iChemLabs.authenticate = function(credential, options, callback, errorback) {
    this._contactServer('authenticate', {
      'credential' : credential
    }, options, function(content) {
      callback(content);
    }, errorback);
  };

  iChemLabs.calculate = function(mol, options, callback, errorback) {
    this._contactServer('calculate', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(content);
    }, errorback);
  };

  iChemLabs.generateImage = function(mol, options, callback, errorback) {
    this._contactServer('generateImage', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(content.link);
    }, errorback);
  };

  iChemLabs.generateIUPACName = function(mol, options, callback, errorback) {
    this._contactServer('generateIUPACName', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(content.iupac);
    }, errorback);
  };

  iChemLabs.getAd = function(callback, errorback) {
    this._contactServer('getAd', {}, {}, function(content) {
      callback(content.image_url, content.target_url);
    }, errorback);
  };

  iChemLabs.getMoleculeFromContent = function(input, options, callback, errorback) {
    this._contactServer('getMoleculeFromContent', {
      'content' : input
    }, options, function(content) {
      var z = false;
      for ( var i = 0, ii = content.mol.a.length; i < ii; i++) {
        if (content.mol.a[i].z !== 0) {
          z = true;
          break;
        }
      }
      if (z) {
        for ( var i = 0, ii = content.mol.a.length; i < ii; i++) {
          content.mol.a[i].x /= 20;
          content.mol.a[i].y /= 20;
          content.mol.a[i].z /= 20;
        }
      }
      callback(JSON_INTERPRETER.molFrom(content.mol));
    }, errorback);
  };

  iChemLabs.getMoleculeFromDatabase = function(query, options, callback, errorback) {
    this._contactServer('getMoleculeFromDatabase', {
      'query' : query
    }, options, function(content) {
      if (options.dimension === 3) {
        for ( var i = 0, ii = content.mol.a.length; i < ii; i++) {
          content.mol.a[i].x /= 20;
          content.mol.a[i].y /= -20;
          content.mol.a[i].z /= 20;
        }
      }
      callback(JSON_INTERPRETER.molFrom(content.mol));
    }, errorback);
  };

  iChemLabs.getOptimizedPDBStructure = function(id, options, callback, errorback) {
    this._contactServer('getOptimizedPDBStructure', {
      'id' : id
    }, options, function(content) {
      var mol;
      if (content.mol) {
        mol = JSON_INTERPRETER.molFrom(content.mol);
      } else {
        var mol = new structures.Molecule();
      }
      mol.chains = JSON_INTERPRETER.chainsFrom(content.ribbons);
      mol.fromJSON = true;
      callback(mol);
    }, errorback);
  };

  iChemLabs.getZeoliteFromIZA = function(query, options, callback, errorback) {
    this._contactServer('getZeoliteFromIZA', {
      'query' : query
    }, options, function(content) {
      callback(ChemDoodle.readCIF(content.cif, options.xSuper, options.ySuper, options.zSuper));
    }, errorback);
  };

  iChemLabs.isGraphIsomorphism = function(arrow, target, options, callback, errorback) {
    this._contactServer('isGraphIsomorphism', {
      'arrow' : JSON_INTERPRETER.molTo(arrow),
      'target' : JSON_INTERPRETER.molTo(target)
    }, options, function(content) {
      callback(content.value);
    }, errorback);
  };

  iChemLabs.isSubgraphIsomorphism = function(arrow, target, options, callback, errorback) {
    this._contactServer('isSubgraphIsomorphism', {
      'arrow' : JSON_INTERPRETER.molTo(arrow),
      'target' : JSON_INTERPRETER.molTo(target)
    }, options, function(content) {
      callback(content.value);
    }, errorback);
  };

  iChemLabs.kekulize = function(mol, options, callback, errorback) {
    this._contactServer('kekulize', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(JSON_INTERPRETER.molFrom(content.mol));
    }, errorback);
  };

  iChemLabs.optimize = function(mol, options, callback, errorback) {
    this._contactServer('optimize', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      var optimized = JSON_INTERPRETER.molFrom(content.mol);
      if (options.dimension === 2) {
        for ( var i = 0, ii = optimized.atoms.length; i < ii; i++) {
          mol.atoms[i].x = optimized.atoms[i].x;
          mol.atoms[i].y = optimized.atoms[i].y;
        }
        callback();
      } else if (options.dimension === 3) {
        for ( var i = 0, ii = optimized.atoms.length; i < ii; i++) {
          optimized.atoms[i].x /= 20;
          optimized.atoms[i].y /= -20;
          optimized.atoms[i].z /= 20;
        }
        callback(optimized);
      }
    }, errorback);
  };

  iChemLabs.readIUPACName = function(iupac, options, callback, errorback) {
    this._contactServer('readIUPACName', {
      'iupac' : iupac
    }, options, function(content) {
      callback(JSON_INTERPRETER.molFrom(content.mol));
    }, errorback);
  };

  iChemLabs.readSMILES = function(smiles, options, callback, errorback) {
    this._contactServer('readSMILES', {
      'smiles' : smiles
    }, options, function(content) {
      callback(JSON_INTERPRETER.molFrom(content.mol));
    }, errorback);
  };

  iChemLabs.saveFile = function(mol, options, callback, errorback) {
    this._contactServer('saveFile', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(content.link);
    }, errorback);
  };

  iChemLabs.simulate13CNMR = function(mol, options, callback, errorback) {
    options.nucleus = 'C';
    options.isotope = 13;
    this._contactServer('simulateNMR', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(c.readJCAMP(content.jcamp));
    }, errorback);
  };

  iChemLabs.simulate1HNMR = function(mol, options, callback, errorback) {
    options.nucleus = 'H';
    options.isotope = 1;
    this._contactServer('simulateNMR', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(c.readJCAMP(content.jcamp));
    }, errorback);
  };

  iChemLabs.simulateMassParentPeak = function(mol, options, callback, errorback) {
    this._contactServer('simulateMassParentPeak', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(c.readJCAMP(content.jcamp));
    }, errorback);
  };

  iChemLabs.writeSMILES = function(mol, options, callback, errorback) {
    this._contactServer('writeSMILES', {
      'mol' : JSON_INTERPRETER.molTo(mol)
    }, options, function(content) {
      callback(content.smiles);
    }, errorback);
  };

  iChemLabs.version = function(options, callback, errorback) {
    this._contactServer('version', {}, options, function(content) {
      callback(content.value);
    }, errorback);
  };

})(ChemDoodle, ChemDoodle.iChemLabs, ChemDoodle.io, ChemDoodle.structures, jQuery);
// Custom ChemDoodle Web Components functions.
//$(function() {
  // the module
  // (function(ChemDoodle) {

  //   // private variables go here, they cannot be accessed beyond this local scope
  //   var labelToMatch = 'N';

  //   // append the function to the ChemDoodle variable
  //   ChemDoodle.countNitrogens = function(molecule){
  //     var count = 0;
  //     for(var i = 0, ii = molecule.atoms.length; i<ii; i++){
  //       if(molecule.atoms[i].label==labelToMatch){
  //         count++;
  //       }
  //     }
  //     return count;
  //   };

  // })(ChemDoodle);

//}); // jQuery ready.
;
var pdb_1B8E = new ChemDoodle.io.JSONInterpreter().pdbFrom({"ribbons":{"cs":[[{"s":false,"z1":36.079,"a":false,"y1":22.146,"y2":22.146,"z2":36.079,"x2":6.557,"h":false,"x1":6.557},{"s":false,"z1":36.079,"a":false,"y1":22.146,"y2":22.146,"z2":36.079,"x2":6.557,"h":false,"x1":6.557},{"s":false,"z1":35.478,"a":false,"y1":20.874,"n":"Leu","y2":20.764,"z2":37.665,"x2":7.981,"h":false,"x1":7.098},{"s":false,"z1":37.61,"a":false,"y1":18.064,"n":"Ile","y2":17.838,"z2":36.223,"x2":10.569,"h":true,"x1":8.625},{"s":false,"z1":38.131,"a":false,"y1":17.088,"n":"Val","y2":15.908,"z2":36.494,"x2":13.597,"h":true,"x1":12.283},{"s":false,"z1":36.078,"a":false,"y1":13.939,"n":"Thr","y2":13.451,"z2":33.801,"x2":11.744,"h":true,"x1":11.747},{"s":false,"z1":32.835,"a":true,"y1":15.826,"n":"Gln","y2":16.82,"z2":31.008,"x2":12.124,"h":true,"x1":10.855},{"s":false,"z1":32.63,"a":false,"y1":17.698,"n":"Thr","y2":15.576,"z2":32.765,"x2":15.328,"h":true,"x1":14.126},{"s":false,"z1":31.501,"a":false,"y1":16.5,"n":"Met","y2":16.884,"z2":33.396,"x2":18.924,"h":false,"x1":17.472},{"s":false,"z1":33.527,"a":false,"y1":14.212,"n":"Lys","y2":14.108,"z2":31.666,"x2":21.158,"h":false,"x1":19.646},{"s":false,"z1":33.212,"a":false,"y1":14.573,"n":"Gly","y2":15.539,"z2":31.483,"x2":24.709,"h":false,"x1":23.416},{"s":false,"z1":31.223,"a":false,"y1":17.833,"n":"Leu","y2":18.604,"z2":32.663,"x2":25.093,"h":false,"x1":23.367},{"s":false,"z1":30.592,"a":false,"y1":19.209,"n":"Asp","y2":20.647,"z2":28.659,"x2":26.753,"h":true,"x1":26.905},{"s":false,"z1":30.001,"a":false,"y1":22.868,"n":"Ile","y2":23.835,"z2":28.012,"x2":26.803,"h":true,"x1":26.077},{"s":false,"z1":28.345,"a":false,"y1":23.568,"n":"Gln","y2":23.736,"z2":26.029,"x2":29.738,"h":true,"x1":29.478},{"s":false,"z1":25.321,"a":false,"y1":21.338,"n":"Lys","y2":21.748,"z2":23.294,"x2":27.381,"h":true,"x1":28.569},{"s":false,"z1":24.32,"a":true,"y1":23.473,"n":"Val","y2":25.519,"z2":23.06,"x2":25.304,"h":true,"x1":25.531},{"s":false,"z1":23.551,"a":false,"y1":26.493,"n":"Ala","y2":25.634,"z2":21.344,"x2":27.904,"h":true,"x1":27.782},{"s":true,"z1":20.149,"a":true,"y1":28.107,"n":"Gly","y2":28.74,"z2":20.282,"x2":25.205,"h":false,"x1":27.472},{"s":true,"z1":17.558,"a":false,"y1":29.061,"n":"Thr","y2":26.79,"z2":17.512,"x2":24.059,"h":false,"x1":24.901},{"s":false,"z1":17.448,"a":false,"y1":27.618,"n":"Trp","y2":29.665,"z2":16.527,"x2":20.508,"h":false,"x1":21.401},{"s":true,"z1":15.454,"a":false,"y1":28.418,"n":"Tyr","y2":26.713,"z2":16.34,"x2":16.86,"h":false,"x1":18.26},{"s":true,"z1":16.865,"a":false,"y1":28.413,"n":"Ser","y2":28.604,"z2":14.88,"x2":13.42,"h":false,"x1":14.685},{"s":true,"z1":14.608,"a":false,"y1":25.951,"n":"Leu","y2":25.885,"z2":13.959,"x2":10.46,"h":false,"x1":12.785},{"s":true,"z1":16.474,"a":false,"y1":25.628,"n":"Ala","y2":25.985,"z2":18.739,"x2":10.178,"h":false,"x1":9.478},{"s":true,"z1":19.506,"a":false,"y1":26.974,"n":"Met","y2":26.386,"z2":18.931,"x2":5.483,"h":false,"x1":7.711},{"s":true,"z1":21.602,"a":true,"y1":26.177,"n":"Ala","y2":26.878,"z2":23.743,"x2":5.501,"h":false,"x1":4.617},{"s":true,"z1":24.665,"a":false,"y1":27.621,"n":"Ala","y2":26.753,"z2":24.484,"x2":0.789,"h":false,"x1":3},{"s":false,"z1":27.229,"a":false,"y1":26.749,"n":"Ser","y2":27.413,"z2":27.344,"x2":-1.947,"h":false,"x1":0.345},{"s":false,"z1":26.605,"a":false,"y1":30.073,"n":"Asp","y2":31.315,"z2":25.049,"x2":-0.075,"h":true,"x1":-1.423},{"s":false,"z1":23.224,"a":false,"y1":31.693,"n":"Ile","y2":33.359,"z2":22.524,"x2":-0.578,"h":true,"x1":-2.185},{"s":false,"z1":24.518,"a":false,"y1":35.134,"n":"Ser","y2":36.164,"z2":24.681,"x2":0.874,"h":true,"x1":-1.237},{"s":false,"z1":25.316,"a":false,"y1":33.985,"n":"Leu","y2":34.832,"z2":24.021,"x2":4.134,"h":true,"x1":2.322},{"s":false,"z1":21.582,"a":true,"y1":33.841,"n":"Leu","y2":34.5,"z2":19.296,"x2":2.867,"h":true,"x1":3.219},{"s":false,"z1":19.728,"a":false,"y1":35.68,"n":"Asp","y2":36.111,"z2":17.548,"x2":1.251,"h":true,"x1":0.409},{"s":false,"z1":17.925,"a":false,"y1":38.694,"n":"Ala","y2":38.478,"z2":19.212,"x2":3.961,"h":false,"x1":1.912},{"s":false,"z1":17.172,"a":false,"y1":39.542,"n":"Gln","y2":39.941,"z2":18.746,"x2":7.316,"h":false,"x1":5.558},{"s":false,"z1":20.412,"a":false,"y1":41.591,"n":"Ser","y2":41.316,"z2":22.776,"x2":6.003,"h":false,"x1":5.827},{"s":false,"z1":22.905,"a":false,"y1":38.917,"n":"Ala","y2":38.517,"z2":22.866,"x2":7.11,"h":false,"x1":4.742},{"s":false,"z1":25.6,"a":false,"y1":38.788,"n":"Pro","y2":37.42,"z2":25.566,"x2":9.392,"h":false,"x1":7.447},{"s":false,"z1":25.133,"a":false,"y1":35.051,"n":"Leu","y2":33.585,"z2":23.389,"x2":8.725,"h":false,"x1":8.098},{"s":false,"z1":21.31,"a":false,"y1":35.18,"n":"Arg","y2":36.747,"z2":20.433,"x2":9.79,"h":false,"x1":8.166},{"s":false,"z1":21.148,"a":false,"y1":35.346,"n":"Val","y2":33.093,"z2":20.477,"x2":12.383,"h":false,"x1":12.021},{"s":true,"z1":18.701,"a":false,"y1":33.644,"n":"Tyr","y2":34.503,"z2":19.331,"x2":16.519,"h":false,"x1":14.412},{"s":true,"z1":20.115,"a":false,"y1":32.063,"n":"Val","y2":31.494,"z2":17.933,"x2":18.374,"h":false,"x1":17.578},{"s":true,"z1":18.289,"a":false,"y1":32.965,"n":"Glu","y2":31.654,"z2":17.935,"x2":22.698,"h":false,"x1":20.759},{"s":true,"z1":20.563,"a":false,"y1":31.66,"n":"Glu","y2":32.117,"z2":22.731,"x2":22.823,"h":false,"x1":23.523},{"s":true,"z1":23.966,"a":false,"y1":29.956,"n":"Leu","y2":29.666,"z2":23.667,"x2":26.449,"h":false,"x1":24.086},{"s":true,"z1":25.938,"a":true,"y1":30.906,"n":"Lys","y2":31.478,"z2":28.262,"x2":27.066,"h":false,"x1":27.202},{"s":true,"z1":29.094,"a":false,"y1":28.966,"n":"Pro","y2":30.163,"z2":28.905,"x2":29.906,"h":false,"x1":27.825},{"s":false,"z1":31.549,"a":false,"y1":30.734,"n":"Thr","y2":28.576,"z2":32.569,"x2":30.48,"h":false,"x1":30.097},{"s":false,"z1":33.303,"a":false,"y1":29.144,"n":"Pro","y2":27.696,"z2":35.147,"x2":32.74,"h":false,"x1":33.086},{"s":false,"z1":36.497,"a":false,"y1":29.4,"n":"Glu","y2":28.244,"z2":37.356,"x2":29.17,"h":false,"x1":31.025},{"s":false,"z1":35.069,"a":false,"y1":27.253,"n":"Gly","y2":27.318,"z2":34.893,"x2":25.827,"h":false,"x1":28.189},{"s":false,"z1":34.3,"a":false,"y1":30.015,"n":"Asp","y2":29.536,"z2":32.027,"x2":26.319,"h":false,"x1":25.658},{"s":true,"z1":30.859,"a":false,"y1":30.425,"n":"Leu","y2":32.322,"z2":30.693,"x2":22.553,"h":false,"x1":24.045},{"s":true,"z1":28.78,"a":false,"y1":33.558,"n":"Glu","y2":32.318,"z2":26.74,"x2":23.787,"h":false,"x1":24.145},{"s":true,"z1":26.15,"a":false,"y1":33.658,"n":"Ile","y2":35.864,"z2":25.707,"x2":20.826,"h":false,"x1":21.412},{"s":true,"z1":22.976,"a":false,"y1":35.747,"n":"Leu","y2":34.337,"z2":21.669,"x2":20.186,"h":false,"x1":21.598},{"s":true,"z1":21.563,"a":false,"y1":36.242,"n":"Leu","y2":38.539,"z2":20.809,"x2":18.273,"h":false,"x1":18.126},{"s":true,"z1":18.805,"a":false,"y1":38.161,"n":"Gln","y2":37.275,"z2":19.323,"x2":14.252,"h":false,"x1":16.419},{"s":true,"z1":19.416,"a":false,"y1":39.808,"n":"Lys","y2":41.703,"z2":17.989,"x2":13.491,"h":false,"x1":13.074},{"s":true,"z1":17.207,"a":true,"y1":41.984,"n":"Trp","y2":42.882,"z2":19.042,"x2":9.602,"h":false,"x1":10.871},{"s":true,"z1":18.639,"a":false,"y1":45.501,"n":"Glu","y2":46.951,"z2":16.938,"x2":11.384,"h":false,"x1":10.509},{"s":false,"z1":16.613,"a":false,"y1":48.362,"n":"Asn","y2":49.153,"z2":14.512,"x2":9.702,"h":false,"x1":9.011},{"s":false,"z1":13.102,"a":false,"y1":46.877,"n":"Gly","y2":46.875,"z2":11.753,"x2":11.472,"h":false,"x1":9.476},{"s":true,"z1":13.818,"a":false,"y1":45.881,"n":"Glu","y2":43.927,"z2":15.13,"x2":12.447,"h":false,"x1":13.083},{"s":true,"z1":14.906,"a":false,"y1":42.768,"n":"Cys","y2":43.456,"z2":15.652,"x2":17.102,"h":false,"x1":14.953},{"s":true,"z1":18.287,"a":false,"y1":43.628,"n":"Ala","y2":41.291,"z2":18.922,"x2":16.664,"h":false,"x1":16.445},{"s":true,"z1":20.126,"a":false,"y1":41.702,"n":"Gln","y2":43.131,"z2":22.073,"x2":18.995,"h":false,"x1":19.096},{"s":true,"z1":23.824,"a":false,"y1":41,"n":"Lys","y2":38.71,"z2":23.914,"x2":19.686,"h":false,"x1":18.857},{"s":true,"z1":26.166,"a":false,"y1":39.275,"n":"Lys","y2":40.043,"z2":28.344,"x2":20.522,"h":false,"x1":21.246},{"s":true,"z1":29.265,"a":false,"y1":37.572,"n":"Ile","y2":35.571,"z2":29.239,"x2":21.271,"h":false,"x1":19.91},{"s":true,"z1":31.896,"a":false,"y1":35.555,"n":"Ile","y2":35.116,"z2":33.485,"x2":20.057,"h":false,"x1":21.755},{"s":true,"z1":33.264,"a":false,"y1":32.361,"n":"Ala","y2":31.064,"z2":33.8,"x2":22.194,"h":false,"x1":20.187},{"s":true,"z1":36.523,"a":true,"y1":31.424,"n":"Glu","y2":29.632,"z2":37.041,"x2":20.521,"h":false,"x1":21.943},{"s":true,"z1":37.687,"a":false,"y1":27.849,"n":"Lys","y2":28.889,"z2":39.774,"x2":21.572,"h":false,"x1":22.508},{"s":false,"z1":40.482,"a":false,"y1":26.625,"n":"Thr","y2":24.678,"z2":40.575,"x2":21.628,"h":false,"x1":20.288},{"s":false,"z1":42.775,"a":false,"y1":23.598,"n":"Lys","y2":21.266,"z2":42.181,"x2":20.493,"h":false,"x1":20.524},{"s":false,"z1":40.179,"a":false,"y1":21.598,"n":"Ile","y2":22.79,"z2":38.283,"x2":19.476,"h":false,"x1":18.616},{"s":false,"z1":37.197,"a":false,"y1":20.585,"n":"Pro","y2":20.331,"z2":36.293,"x2":18.451,"h":false,"x1":20.686},{"s":false,"z1":33.876,"a":false,"y1":21.629,"n":"Ala","y2":22.955,"z2":33.194,"x2":17.211,"h":false,"x1":19.103},{"s":true,"z1":35.619,"a":false,"y1":24.36,"n":"Val","y2":25.624,"z2":36.704,"x2":18.774,"h":false,"x1":17.055},{"s":true,"z1":35.278,"a":false,"y1":27.968,"n":"Phe","y2":28.926,"z2":35.257,"x2":16.153,"h":false,"x1":18.324},{"s":true,"z1":36.73,"a":true,"y1":31.131,"n":"Lys","y2":32.87,"z2":36.346,"x2":18.405,"h":false,"x1":16.826},{"s":true,"z1":35.054,"a":false,"y1":34.484,"n":"Ile","y2":35.458,"z2":36.439,"x2":14.912,"h":false,"x1":16.585},{"s":false,"z1":38.144,"a":false,"y1":36.65,"n":"Asp","y2":38.999,"z2":38.662,"x2":17.039,"h":false,"x1":16.834},{"s":false,"z1":36.758,"a":false,"y1":39.744,"n":"Ala","y2":39.397,"z2":38.51,"x2":13.481,"h":false,"x1":15.104},{"s":false,"z1":38.312,"a":false,"y1":41.831,"n":"Leu","y2":40.625,"z2":39.121,"x2":10.374,"h":false,"x1":12.304},{"s":false,"z1":36.723,"a":false,"y1":39.29,"n":"Asn","y2":37.858,"z2":35.511,"x2":11.421,"h":false,"x1":9.895},{"s":false,"z1":37.409,"a":false,"y1":35.862,"n":"Glu","y2":34.641,"z2":36.166,"x2":9.716,"h":false,"x1":11.359},{"s":true,"z1":34.747,"a":false,"y1":33.185,"n":"Asn","y2":32.347,"z2":35.31,"x2":13.673,"h":false,"x1":11.556},{"s":true,"z1":34.813,"a":false,"y1":29.687,"n":"Lys","y2":29.32,"z2":32.555,"x2":12.305,"h":false,"x1":13.036},{"s":true,"z1":31.837,"a":false,"y1":28.051,"n":"Val","y2":26.281,"z2":33.135,"x2":15.69,"h":false,"x1":14.703},{"s":true,"z1":31.804,"a":false,"y1":24.275,"n":"Leu","y2":23.709,"z2":29.544,"x2":14.219,"h":false,"x1":14.364},{"s":true,"z1":29.51,"a":false,"y1":22.042,"n":"Val","y2":19.929,"z2":30.53,"x2":15.995,"h":false,"x1":16.418},{"s":true,"z1":28.582,"a":false,"y1":19.068,"n":"Leu","y2":16.847,"z2":28.478,"x2":15.08,"h":false,"x1":14.292},{"s":true,"z1":26.312,"a":true,"y1":17.247,"n":"Asp","y2":18.961,"z2":24.715,"x2":17.262,"h":false,"x1":16.761},{"s":true,"z1":23.901,"a":false,"y1":17.728,"n":"Thr","y2":15.752,"z2":24.393,"x2":20.918,"h":false,"x1":19.644},{"s":false,"z1":21.994,"a":false,"y1":15.614,"n":"Asp","y2":15.957,"z2":21.151,"x2":24.405,"h":false,"x1":22.149},{"s":false,"z1":21.85,"a":false,"y1":18.656,"n":"Tyr","y2":20.16,"z2":20.086,"x2":25.074,"h":false,"x1":24.459},{"s":false,"z1":18.13,"a":false,"y1":18.244,"n":"Lys","y2":18.831,"z2":15.999,"x2":24.473,"h":false,"x1":25.255},{"s":false,"z1":16.527,"a":false,"y1":18.618,"n":"Lys","y2":20.404,"z2":16.48,"x2":20.242,"h":false,"x1":21.82},{"s":true,"z1":18.769,"a":false,"y1":19.643,"n":"Tyr","y2":19.294,"z2":21.022,"x2":19.726,"h":false,"x1":18.959},{"s":true,"z1":22.125,"a":false,"y1":21.18,"n":"Leu","y2":22.405,"z2":21.584,"x2":16.098,"h":false,"x1":18.068},{"s":true,"z1":23.652,"a":false,"y1":21.346,"n":"Leu","y2":21.6,"z2":25.92,"x2":15.194,"h":false,"x1":14.581},{"s":true,"z1":26.361,"a":false,"y1":23.872,"n":"Phe","y2":24.961,"z2":25.468,"x2":11.948,"h":false,"x1":13.838},{"s":true,"z1":28.056,"a":false,"y1":25.707,"n":"Cys","y2":26.822,"z2":29.729,"x2":12.399,"h":false,"x1":11.021},{"s":true,"z1":29.721,"a":false,"y1":29.125,"n":"Met","y2":28.956,"z2":29.915,"x2":8.316,"h":false,"x1":10.733},{"s":true,"z1":32.641,"a":true,"y1":29.245,"n":"Glu","y2":31.227,"z2":33.776,"x2":9.14,"h":false,"x1":8.349},{"s":true,"z1":34.281,"a":false,"y1":32.154,"n":"Asn","y2":31.385,"z2":35.571,"x2":4.74,"h":false,"x1":6.596},{"s":false,"z1":37.937,"a":false,"y1":31.241,"n":"Ser","y2":32.101,"z2":39.021,"x2":4.074,"h":false,"x1":6.042},{"s":false,"z1":38.996,"a":false,"y1":34.741,"n":"Ala","y2":35.434,"z2":39.153,"x2":2.647,"h":false,"x1":4.935},{"s":false,"z1":36.72,"a":false,"y1":34.296,"n":"Glu","y2":32.395,"z2":38.156,"x2":1.503,"h":false,"x1":1.887},{"s":false,"z1":37.652,"a":false,"y1":32.354,"n":"Pro","y2":30.369,"z2":38.7,"x2":-0.415,"h":false,"x1":-1.239},{"s":false,"z1":36.669,"a":false,"y1":28.693,"n":"Glu","y2":27.71,"z2":37.02,"x2":0.927,"h":false,"x1":-1.226},{"s":false,"z1":34.37,"a":false,"y1":27.508,"n":"Gln","y2":27.488,"z2":31.998,"x2":1.205,"h":false,"x1":1.517},{"s":true,"z1":31.695,"a":false,"y1":29.921,"n":"Ser","y2":29.519,"z2":32.1,"x2":4.909,"h":false,"x1":2.579},{"s":true,"z1":29.824,"a":false,"y1":27.851,"n":"Leu","y2":28,"z2":27.671,"x2":4.205,"h":false,"x1":5.162},{"s":true,"z1":26.337,"a":false,"y1":28.403,"n":"Ala","y2":27.708,"z2":26.88,"x2":8.838,"h":false,"x1":6.637},{"s":true,"z1":24.874,"a":false,"y1":25.732,"n":"Cys","y2":26.446,"z2":22.595,"x2":8.683,"h":false,"x1":8.962},{"s":true,"z1":21.839,"a":false,"y1":25.721,"n":"Gln","y2":23.84,"z2":22.345,"x2":12.593,"h":false,"x1":11.209},{"s":true,"z1":19.575,"a":false,"y1":23.274,"n":"Cys","y2":24.732,"z2":17.901,"x2":13.8,"h":false,"x1":12.904},{"s":true,"z1":18.734,"a":true,"y1":24.522,"n":"Leu","y2":22.412,"z2":18.299,"x2":17.33,"h":false,"x1":16.424},{"s":true,"z1":15.982,"a":false,"y1":23.073,"n":"Val","y2":25.02,"z2":15.642,"x2":20.033,"h":false,"x1":18.646},{"s":false,"z1":15.247,"a":false,"y1":23.609,"n":"Arg","y2":25.217,"z2":13.642,"x2":23.154,"h":false,"x1":22.362},{"s":false,"z1":11.529,"a":false,"y1":23.928,"n":"Thr","y2":22.7,"z2":11.279,"x2":19.771,"h":false,"x1":21.859},{"s":false,"z1":9.212,"a":false,"y1":24.319,"n":"Pro","y2":23.109,"z2":7.348,"x2":17.99,"h":false,"x1":18.894},{"s":false,"z1":7.734,"a":false,"y1":20.79,"n":"Glu","y2":20.606,"z2":8.514,"x2":17.245,"h":false,"x1":19.479},{"s":false,"z1":6.419,"a":false,"y1":18.883,"n":"Val","y2":16.682,"z2":6.434,"x2":15.359,"h":false,"x1":16.395},{"s":false,"z1":8.951,"a":false,"y1":16.048,"n":"Asp","y2":17.599,"z2":10.448,"x2":14.965,"h":false,"x1":15.875},{"s":false,"z1":11.339,"a":false,"y1":16.05,"n":"Asp","y2":15.214,"z2":13.426,"x2":12.009,"h":true,"x1":12.884},{"s":false,"z1":14.264,"a":false,"y1":14.142,"n":"Glu","y2":14.735,"z2":16.378,"x2":13.418,"h":true,"x1":14.377},{"s":false,"z1":16.363,"a":false,"y1":17.348,"n":"Ala","y2":17.732,"z2":17.652,"x2":12.372,"h":true,"x1":14.37},{"s":false,"z1":15.445,"a":false,"y1":18.104,"n":"Leu","y2":17.227,"z2":16.733,"x2":8.957,"h":true,"x1":10.759},{"s":false,"z1":16.337,"a":false,"y1":14.564,"n":"Glu","y2":14.243,"z2":18.636,"x2":8.919,"h":true,"x1":9.603},{"s":false,"z1":19.698,"a":false,"y1":14.679,"n":"Lys","y2":15.66,"z2":21.537,"x2":10.219,"h":true,"x1":11.369},{"s":false,"z1":20.406,"a":false,"y1":18.144,"n":"Phe","y2":17.984,"z2":21.649,"x2":7.736,"h":true,"x1":9.801},{"s":false,"z1":19.535,"a":false,"y1":16.743,"n":"Asp","y2":15.854,"z2":21.316,"x2":5.087,"h":true,"x1":6.4},{"s":false,"z1":21.833,"a":false,"y1":13.79,"n":"Lys","y2":13.953,"z2":24.209,"x2":6.527,"h":true,"x1":6.962},{"s":false,"z1":24.702,"a":true,"y1":15.91,"n":"Ala","y2":16.744,"z2":26.267,"x2":6.746,"h":true,"x1":8.311},{"s":false,"z1":24.485,"a":false,"y1":18.18,"n":"Leu","y2":18.055,"z2":24.826,"x2":2.822,"h":true,"x1":5.191},{"s":false,"z1":24.523,"a":false,"y1":15.305,"n":"Lys","y2":15.325,"z2":26.15,"x2":0.917,"h":true,"x1":2.668},{"s":false,"z1":28.325,"a":true,"y1":15.578,"n":"Ala","y2":17.03,"z2":29.981,"x2":1.692,"h":true,"x1":2.541},{"s":false,"z1":28.458,"a":false,"y1":19.348,"n":"Leu","y2":19.545,"z2":26.519,"x2":0.427,"h":true,"x1":1.868},{"s":false,"z1":27.626,"a":false,"y1":21.465,"n":"Pro","y2":23.85,"z2":27.244,"x2":-0.904,"h":false,"x1":-1.174},{"s":false,"z1":24.685,"a":false,"y1":23.568,"n":"Met","y2":23.329,"z2":23.226,"x2":-1.833,"h":false,"x1":0.051},{"s":false,"z1":23.107,"a":false,"y1":25.864,"n":"His","y2":27.064,"z2":21.083,"x2":-3.082,"h":false,"x1":-2.599},{"s":true,"z1":20.349,"a":false,"y1":27.414,"n":"Ile","y2":26.505,"z2":20.86,"x2":1.636,"h":false,"x1":-0.488},{"s":true,"z1":18.23,"a":false,"y1":25.767,"n":"Arg","y2":26.578,"z2":16.095,"x2":1.649,"h":false,"x1":2.162},{"s":true,"z1":15.573,"a":true,"y1":27.491,"n":"Leu","y2":26.268,"z2":15.887,"x2":6.343,"h":false,"x1":4.314},{"s":true,"z1":13.129,"a":false,"y1":26.066,"n":"Ser","y2":27.472,"z2":11.207,"x2":6.668,"h":false,"x1":6.818},{"s":false,"z1":11.186,"a":false,"y1":28.04,"n":"Phe","y2":26.25,"z2":9.87,"x2":10.373,"h":false,"x1":9.428},{"s":false,"z1":7.621,"a":false,"y1":28.046,"n":"Asn","y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":10.598},{"s":false,"z1":7.251,"a":false,"y1":28.931,"y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":11.782},{"s":false,"z1":7.251,"a":false,"y1":28.931,"y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":11.782},{"s":false,"z1":7.251,"a":false,"y1":28.931,"y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":11.782},{"s":false,"z1":7.251,"a":false,"y1":28.931,"y2":28.375,"z2":6.941,"x2":12.867,"h":false,"x1":11.782}]]},"mol":{"b":[],"a":[{"p_w":true,"p_h":true,"l":"O","z":35.308,"y":42.981,"x":14.595},{"p_w":true,"p_h":true,"l":"O","z":32.404,"y":38.947,"x":19.743},{"p_w":true,"p_h":true,"l":"O","z":34.276,"y":41.905,"x":11.812},{"p_w":true,"p_h":true,"l":"O","z":14.395,"y":25.181,"x":25.976},{"p_w":true,"p_h":true,"l":"O","z":37.301,"y":24.429,"x":21.296},{"p_w":true,"p_h":true,"l":"O","z":36.113,"y":36.136,"x":19.837},{"p_w":true,"p_h":true,"l":"O","z":33.169,"y":37.392,"x":12.801},{"p_w":true,"p_h":true,"l":"O","z":29.641,"y":26.574,"x":-3.932},{"p_w":true,"p_h":true,"l":"O","z":26.41,"y":25.939,"x":31.662},{"p_w":true,"p_h":true,"l":"O","z":23.254,"y":31.108,"x":9.276},{"p_w":true,"p_h":true,"l":"O","z":15.082,"y":31.475,"x":21.958},{"p_w":true,"p_h":true,"l":"O","z":13.297,"y":20.47,"x":21.262},{"p_w":true,"p_h":true,"l":"O","z":35.09,"y":17.46,"x":24.15},{"p_w":true,"p_h":true,"l":"O","z":33.302,"y":20.908,"x":26.202},{"p_w":true,"p_h":true,"l":"O","z":34.936,"y":24.836,"x":25.528},{"p_w":true,"p_h":true,"l":"O","z":35.289,"y":33.591,"x":28.505},{"p_w":true,"p_h":true,"l":"O","z":5.169,"y":28.743,"x":14.695},{"p_w":true,"p_h":true,"l":"O","z":40.139,"y":39.295,"x":19.995},{"p_w":true,"p_h":true,"l":"O","z":21.318,"y":20.426,"x":29.092},{"p_w":true,"p_h":true,"l":"O","z":13.26,"y":17.38,"x":16.826},{"p_w":true,"p_h":true,"l":"O","z":40.552,"y":25.501,"x":15.509},{"p_w":true,"p_h":true,"l":"O","z":25.77,"y":30.276,"x":-4.844},{"p_w":true,"p_h":true,"l":"O","z":20.908,"y":17.137,"x":2.716},{"p_w":true,"p_h":true,"l":"O","z":44.697,"y":20.831,"x":21.42},{"p_w":true,"p_h":true,"l":"O","z":29.261,"y":28.626,"x":32.504},{"p_w":true,"p_h":true,"l":"O","z":32.996,"y":25.952,"x":-0.526},{"p_w":true,"p_h":true,"l":"O","z":5.376,"y":31.069,"x":13.475},{"p_w":true,"p_h":true,"l":"O","z":29.279,"y":35.647,"x":-3.765},{"p_w":true,"p_h":true,"l":"O","z":13.052,"y":18.479,"x":23.383},{"p_w":true,"p_h":true,"l":"O","z":34.449,"y":41.801,"x":17.198},{"p_w":true,"p_h":true,"l":"O","z":14.886,"y":20.371,"x":26.888},{"p_w":true,"p_h":true,"l":"O","z":10.415,"y":12.098,"x":8.381},{"p_w":true,"p_h":true,"l":"O","z":32.494,"y":21.141,"x":30.589},{"p_w":true,"p_h":true,"l":"O","z":14.196,"y":33.382,"x":20.035},{"p_w":true,"p_h":true,"l":"O","z":15.146,"y":37.539,"x":8.007},{"p_w":true,"p_h":true,"l":"O","z":14.192,"y":40.621,"x":18.619},{"p_w":true,"p_h":true,"l":"O","z":26.101,"y":41.902,"x":7.717},{"p_w":true,"p_h":true,"l":"O","z":39.22,"y":26.6,"x":9.773},{"p_w":true,"p_h":true,"l":"O","z":34.13,"y":36.585,"x":-1.264},{"p_w":true,"p_h":true,"l":"O","z":18.527,"y":38.71,"x":9.549},{"p_w":true,"p_h":true,"l":"O","z":29.774,"y":25.775,"x":-6.226},{"p_w":true,"p_h":true,"l":"O","z":41.643,"y":20.408,"x":23.448},{"p_w":true,"p_h":true,"l":"O","z":34.516,"y":40.074,"x":21.928},{"p_w":true,"p_h":true,"l":"O","z":39.605,"y":31.636,"x":11.991},{"p_w":true,"p_h":true,"l":"O","z":29.247,"y":19.633,"x":32.596},{"p_w":true,"p_h":true,"l":"O","z":18.282,"y":14.384,"x":1.697},{"p_w":true,"p_h":true,"l":"O","z":15.52,"y":31.637,"x":16.433},{"p_w":true,"p_h":true,"l":"O","z":15.897,"y":26.576,"x":27.005},{"p_w":true,"p_h":true,"l":"O","z":9.026,"y":30.758,"x":13.613},{"p_w":true,"p_h":true,"l":"O","z":7.695,"y":25.739,"x":12.323},{"p_w":true,"p_h":true,"l":"O","z":37.501,"y":30.322,"x":9.474},{"p_w":true,"p_h":true,"l":"O","z":41.138,"y":30.125,"x":4.958},{"p_w":true,"p_h":true,"l":"O","z":15.07,"y":40.666,"x":1.934},{"p_w":true,"p_h":true,"l":"O","z":34.607,"y":22.052,"x":4.464},{"p_w":true,"p_h":true,"l":"O","z":13.867,"y":33.674,"x":16.899},{"p_w":true,"p_h":true,"l":"O","z":13.502,"y":30.827,"x":13.435},{"p_w":true,"p_h":true,"l":"O","z":33.755,"y":20.882,"x":28.687},{"p_w":true,"p_h":true,"l":"O","z":14.584,"y":49.647,"x":12.022},{"p_w":true,"p_h":true,"l":"O","z":30.837,"y":25.477,"x":-2.08},{"p_w":true,"p_h":true,"l":"O","z":13.572,"y":30.2,"x":16.545},{"p_w":true,"p_h":true,"l":"O","z":21.943,"y":30.711,"x":28.854},{"p_w":true,"p_h":true,"l":"O","z":32.951,"y":23.2,"x":1.192},{"p_w":true,"p_h":true,"l":"O","z":41.632,"y":10.593,"x":11.01},{"p_w":true,"p_h":true,"l":"O","z":20.983,"y":34.24,"x":30.574},{"p_w":true,"p_h":true,"l":"O","z":15.262,"y":40.183,"x":13.036},{"p_w":true,"p_h":true,"l":"O","z":9.683,"y":27.755,"x":14.616},{"p_w":true,"p_h":true,"l":"O","z":42.136,"y":29.273,"x":24.126},{"p_w":true,"p_h":true,"l":"O","z":13.772,"y":38.257,"x":13.083},{"p_w":true,"p_h":true,"l":"O","z":11.346,"y":30.068,"x":14.802},{"p_w":true,"p_h":true,"l":"O","z":24.94,"y":31.641,"x":22.102},{"p_w":true,"p_h":true,"l":"O","z":23.829,"y":13.587,"x":13.529},{"p_w":true,"p_h":true,"l":"O","z":18.389,"y":12.272,"x":6.943},{"p_w":true,"p_h":true,"l":"O","z":15.499,"y":21.686,"x":5.917},{"p_w":true,"p_h":true,"l":"O","z":18.074,"y":50.543,"x":12.403},{"p_w":true,"p_h":true,"l":"O","z":34.24,"y":18.774,"x":9.56},{"p_w":true,"p_h":true,"l":"O","z":35.235,"y":28.365,"x":3.937},{"p_w":true,"p_h":true,"l":"O","z":23.107,"y":13.299,"x":11.055},{"p_w":true,"p_h":true,"l":"O","z":12.727,"y":51.63,"x":8.06},{"p_w":true,"p_h":true,"l":"O","z":20.673,"y":43.217,"x":12.668},{"p_w":true,"p_h":true,"l":"O","z":6.398,"y":16.408,"x":18.842},{"p_w":true,"p_h":true,"l":"O","z":20.241,"y":22.086,"x":1.84},{"p_w":true,"p_h":true,"l":"O","z":36.234,"y":17.816,"x":17.209},{"p_w":true,"p_h":true,"l":"O","z":41.704,"y":17.592,"x":15.507},{"p_w":true,"p_h":true,"l":"O","z":41.441,"y":29.547,"x":8.429},{"p_w":true,"p_h":true,"l":"O","z":41.625,"y":41.499,"x":10.115},{"p_w":true,"p_h":true,"l":"O","z":17.515,"y":45.366,"x":13.347},{"p_w":true,"p_h":true,"l":"O","z":40.745,"y":32.517,"x":19.981},{"p_w":true,"p_h":true,"l":"O","z":4.393,"y":21.152,"x":14.392},{"p_w":true,"p_h":true,"l":"O","z":17.39,"y":44.661,"x":6.944},{"p_w":true,"p_h":true,"l":"O","z":35.033,"y":38.377,"x":18.838},{"p_w":true,"p_h":true,"l":"O","z":11.49,"y":41.485,"x":18.195},{"p_w":true,"p_h":true,"l":"O","z":19.941,"y":24.228,"x":-2.598},{"p_w":true,"p_h":true,"l":"O","z":16.308,"y":25.113,"x":25.174},{"p_w":true,"p_h":true,"l":"O","z":37.093,"y":26.48,"x":5.358},{"p_w":true,"p_h":true,"l":"O","z":20.073,"y":33.147,"x":-0.644},{"p_w":true,"p_h":true,"l":"O","z":33.695,"y":37.608,"x":20.806},{"p_w":true,"p_h":true,"l":"O","z":39.075,"y":29.433,"x":3.054},{"p_w":true,"p_h":true,"l":"O","z":10.942,"y":46.906,"x":18.371},{"p_w":true,"p_h":true,"l":"O","z":33.535,"y":23.775,"x":30.656},{"p_w":true,"p_h":true,"l":"O","z":22.622,"y":38.213,"x":15},{"p_w":true,"p_h":true,"l":"O","z":40.135,"y":46.201,"x":11.25},{"p_w":true,"p_h":true,"l":"O","z":18.064,"y":44.835,"x":3.394},{"p_w":true,"p_h":true,"l":"O","z":22.936,"y":44.279,"x":15.033},{"p_w":true,"p_h":true,"l":"O","z":9.008,"y":24.23,"x":8.645}]}});
var pdb_1BEB = new ChemDoodle.io.JSONInterpreter().pdbFrom({"ribbons":{"cs":[[{"s":false,"z1":-4.336,"a":false,"y1":14.212,"y2":14.212,"z2":-4.336,"x2":-25.924,"h":false,"x1":-25.924},{"s":false,"z1":-4.336,"a":false,"y1":14.212,"y2":14.212,"z2":-4.336,"x2":-25.924,"h":false,"x1":-25.924},{"s":false,"z1":-4.427,"a":false,"y1":15.615,"n":"Gln","y2":16.703,"z2":-4.806,"x2":-24.374,"h":false,"x1":-26.461},{"s":false,"z1":-7.381,"a":false,"y1":17.507,"n":"Thr","y2":19.642,"z2":-6.903,"x2":-26.039,"h":false,"x1":-25.054},{"s":false,"z1":-8.437,"a":false,"y1":21.052,"n":"Met","y2":20.946,"z2":-10.562,"x2":-25.31,"h":false,"x1":-24.189},{"s":false,"z1":-10.024,"a":false,"y1":23.037,"n":"Lys","y2":25.134,"z2":-10.103,"x2":-25.906,"h":false,"x1":-27.036},{"s":false,"z1":-12.771,"a":false,"y1":25.439,"n":"Gly","y2":26.456,"z2":-13.139,"x2":-24.029,"h":false,"x1":-26.126},{"s":false,"z1":-13.28,"a":false,"y1":24.084,"n":"Leu","y2":24.227,"z2":-15.671,"x2":-22.962,"h":false,"x1":-22.603},{"s":false,"z1":-16.023,"a":false,"y1":26.032,"n":"Asp","y2":25.914,"z2":-15.65,"x2":-18.505,"h":false,"x1":-20.866},{"s":false,"z1":-17.254,"a":false,"y1":23.681,"n":"Ile","y2":24.037,"z2":-17.642,"x2":-15.806,"h":true,"x1":-18.148},{"s":false,"z1":-19.132,"a":false,"y1":26.287,"n":"Gln","y2":27.244,"z2":-18.245,"x2":-14.092,"h":true,"x1":-16.104},{"s":false,"z1":-15.842,"a":true,"y1":28.021,"n":"Lys","y2":27.696,"z2":-14.077,"x2":-13.657,"h":true,"x1":-15.23},{"s":false,"z1":-14.467,"a":false,"y1":25.004,"n":"Val","y2":23.877,"z2":-14.724,"x2":-11.236,"h":true,"x1":-13.324},{"s":false,"z1":-17.165,"a":false,"y1":25.041,"n":"Ala","y2":26.451,"z2":-15.709,"x2":-9.459,"h":false,"x1":-10.669},{"s":false,"z1":-15.769,"a":false,"y1":24.933,"n":"Gly","y2":22.711,"z2":-14.856,"x2":-7.174,"h":false,"x1":-7.173},{"s":false,"z1":-13.326,"a":false,"y1":23.278,"n":"Thr","y2":24.217,"z2":-11.552,"x2":-6.158,"h":false,"x1":-4.802},{"s":false,"z1":-10.068,"a":false,"y1":21.804,"n":"Trp","y2":20.066,"z2":-10.029,"x2":-4.551,"h":false,"x1":-6.18},{"s":true,"z1":-7.304,"a":false,"y1":19.74,"n":"Tyr","y2":19.504,"z2":-5.877,"x2":-6.376,"h":false,"x1":-4.498},{"s":true,"z1":-5.331,"a":false,"y1":16.803,"n":"Ser","y2":16.493,"z2":-3.482,"x2":-4.47,"h":false,"x1":-5.97},{"s":true,"z1":-1.728,"a":false,"y1":18.058,"n":"Leu","y2":16.552,"z2":0.137,"x2":-5.784,"h":false,"x1":-6.032},{"s":true,"z1":-0.306,"a":false,"y1":15.26,"n":"Ala","y2":14.666,"z2":-2.233,"x2":-9.397,"h":false,"x1":-8.118},{"s":true,"z1":-1.38,"a":false,"y1":12.035,"n":"Met","y2":10.87,"z2":0.737,"x2":-9.797,"h":false,"x1":-9.789},{"s":true,"z1":0.184,"a":true,"y1":9.388,"n":"Ala","y2":8.622,"z2":-1.805,"x2":-13.166,"h":false,"x1":-12.072},{"s":true,"z1":-0.893,"a":false,"y1":6.086,"n":"Ala","y2":5.168,"z2":1.229,"x2":-14.241,"h":false,"x1":-13.577},{"s":false,"z1":0.136,"a":false,"y1":3.756,"n":"Ser","y2":1.869,"z2":1.611,"x2":-16.135,"h":false,"x1":-16.386},{"s":false,"z1":0.168,"a":false,"y1":0.765,"n":"Asp","y2":1.729,"z2":-0.581,"x2":-11.973,"h":false,"x1":-14.032},{"s":false,"z1":1.653,"a":false,"y1":0.896,"n":"Ile","y2":1.196,"z2":0.198,"x2":-8.601,"h":true,"x1":-10.536},{"s":false,"z1":-1.257,"a":true,"y1":-1.102,"n":"Ser","y2":-0.298,"z2":-3.258,"x2":-8.041,"h":true,"x1":-9.044},{"s":false,"z1":-3.739,"a":false,"y1":1.64,"n":"Leu","y2":3.15,"z2":-4.614,"x2":-8.229,"h":true,"x1":-9.909},{"s":false,"z1":-2.174,"a":false,"y1":3.981,"n":"Leu","y2":4.19,"z2":-1.263,"x2":-5.153,"h":false,"x1":-7.334},{"s":false,"z1":0.01,"a":false,"y1":1.717,"n":"Asp","y2":0.546,"z2":-1.675,"x2":-3.972,"h":false,"x1":-5.178},{"s":false,"z1":-1.26,"a":false,"y1":1.984,"n":"Ala","y2":3.031,"z2":-3.213,"x2":-2.536,"h":false,"x1":-1.588},{"s":false,"z1":-3.965,"a":false,"y1":4.277,"n":"Gln","y2":4.341,"z2":-6.175,"x2":-1.011,"h":false,"x1":-0.132},{"s":false,"z1":-6.426,"a":false,"y1":1.552,"n":"Ser","y2":0.605,"z2":-7.4,"x2":-3.001,"h":false,"x1":-1.035},{"s":false,"z1":-5.315,"a":false,"y1":1.321,"n":"Ala","y2":2.795,"z2":-7.236,"x2":-4.851,"h":false,"x1":-4.702},{"s":false,"z1":-8.359,"a":false,"y1":1.491,"n":"Pro","y2":2.391,"z2":-6.821,"x2":-8.432,"h":false,"x1":-7.047},{"s":false,"z1":-8.028,"a":false,"y1":4.917,"n":"Leu","y2":6.942,"z2":-6.942,"x2":-8.326,"h":false,"x1":-8.649},{"s":false,"z1":-6.301,"a":false,"y1":6.453,"n":"Arg","y2":6.944,"z2":-7.939,"x2":-4.037,"h":false,"x1":-5.705},{"s":false,"z1":-9.021,"a":false,"y1":9.115,"n":"Val","y2":11.084,"z2":-7.979,"x2":-6.335,"h":false,"x1":-5.436},{"s":true,"z1":-8.89,"a":false,"y1":12.762,"n":"Tyr","y2":13.431,"z2":-11.167,"x2":-3.925,"h":false,"x1":-4.268},{"s":true,"z1":-11.081,"a":false,"y1":15.365,"n":"Val","y2":16.862,"z2":-10.379,"x2":-4.177,"h":false,"x1":-5.928},{"s":true,"z1":-13.035,"a":false,"y1":17.585,"n":"Glu","y2":19.907,"z2":-13.289,"x2":-4.039,"h":false,"x1":-3.521},{"s":true,"z1":-15.327,"a":false,"y1":19.442,"n":"Glu","y2":17.91,"z2":-15.821,"x2":-7.68,"h":false,"x1":-5.915},{"s":true,"z1":-16.26,"a":false,"y1":19.986,"n":"Leu","y2":21.933,"z2":-17.604,"x2":-9.346,"h":false,"x1":-9.561},{"s":true,"z1":-19.914,"a":true,"y1":20.802,"n":"Lys","y2":19.611,"z2":-21.076,"x2":-11.872,"h":false,"x1":-10.143},{"s":true,"z1":-20.978,"a":false,"y1":21.574,"n":"Pro","y2":22.523,"z2":-22.932,"x2":-12.666,"h":false,"x1":-13.708},{"s":false,"z1":-24.72,"a":false,"y1":21.223,"n":"Thr","y2":22.389,"z2":-24.298,"x2":-16.316,"h":false,"x1":-14.261},{"s":false,"z1":-26.55,"a":false,"y1":23.917,"n":"Pro","y2":24.09,"z2":-26.417,"x2":-18.657,"h":false,"x1":-16.255},{"s":false,"z1":-26.921,"a":false,"y1":21.376,"n":"Glu","y2":20.365,"z2":-25.609,"x2":-20.789,"h":false,"x1":-19.091},{"s":false,"z1":-23.192,"a":false,"y1":20.894,"n":"Gly","y2":19.405,"z2":-21.337,"x2":-19.552,"h":false,"x1":-19.628},{"s":false,"z1":-22.479,"a":false,"y1":17.735,"n":"Asp","y2":19.296,"z2":-21.705,"x2":-15.941,"h":false,"x1":-17.625},{"s":true,"z1":-20.082,"a":false,"y1":17.492,"n":"Leu","y2":15.273,"z2":-20.373,"x2":-13.907,"h":false,"x1":-14.723},{"s":true,"z1":-20.519,"a":false,"y1":16.133,"n":"Glu","y2":17.394,"z2":-18.724,"x2":-10.307,"h":false,"x1":-11.272},{"s":true,"z1":-17.216,"a":false,"y1":15.273,"n":"Ile","y2":13.4,"z2":-17.609,"x2":-8.249,"h":false,"x1":-9.678},{"s":true,"z1":-17.011,"a":false,"y1":14.749,"n":"Leu","y2":15.084,"z2":-14.671,"x2":-5.706,"h":false,"x1":-5.913},{"s":true,"z1":-14.191,"a":false,"y1":12.697,"n":"Leu","y2":11.687,"z2":-15.252,"x2":-2.59,"h":false,"x1":-4.481},{"s":true,"z1":-12.691,"a":false,"y1":11.156,"n":"Gln","y2":10.027,"z2":-10.951,"x2":-2.549,"h":false,"x1":-1.356},{"s":true,"z1":-11.598,"a":true,"y1":7.542,"n":"Lys","y2":6.688,"z2":-12.623,"x2":0.617,"h":false,"x1":-1.392},{"s":true,"z1":-10.221,"a":false,"y1":5.524,"n":"Trp","y2":3.334,"z2":-10.265,"x2":0.54,"h":false,"x1":1.562},{"s":false,"z1":-12.37,"a":false,"y1":2.409,"n":"Glu","y2":0.503,"z2":-11.211,"x2":3.008,"h":false,"x1":1.986},{"s":false,"z1":-12.631,"a":false,"y1":0.656,"n":"Asn","y2":2.985,"z2":-12.414,"x2":5.64,"h":false,"x1":5.399},{"s":false,"z1":-10.64,"a":false,"y1":2.951,"n":"Gly","y2":5.291,"z2":-10.296,"x2":7.705,"h":false,"x1":7.826},{"s":false,"z1":-12.894,"a":false,"y1":5.94,"n":"Glu","y2":5.752,"z2":-12.068,"x2":4.629,"h":false,"x1":6.912},{"s":true,"z1":-12.306,"a":false,"y1":8.49,"n":"Cys","y2":9.623,"z2":-14.43,"x2":4.09,"h":false,"x1":4.186},{"s":true,"z1":-15.399,"a":false,"y1":7.974,"n":"Ala","y2":9.403,"z2":-14.568,"x2":0.285,"h":false,"x1":2.038},{"s":true,"z1":-17.021,"a":false,"y1":10.329,"n":"Gln","y2":9.01,"z2":-18.809,"x2":-1.283,"h":false,"x1":-0.431},{"s":true,"z1":-18.009,"a":false,"y1":9.227,"n":"Lys","y2":11.282,"z2":-17.572,"x2":-5.088,"h":false,"x1":-3.953},{"s":true,"z1":-19.944,"a":false,"y1":11.202,"n":"Lys","y2":9.624,"z2":-20.878,"x2":-8.06,"h":false,"x1":-6.51},{"s":true,"z1":-19.299,"a":false,"y1":10.507,"n":"Ile","y2":12.723,"z2":-19.727,"x2":-11.017,"h":false,"x1":-10.196},{"s":true,"z1":-21.601,"a":true,"y1":11.864,"n":"Ile","y2":10.471,"z2":-20.713,"x2":-14.662,"h":false,"x1":-12.901},{"s":true,"z1":-19.754,"a":false,"y1":12.656,"n":"Ala","y2":14.439,"z2":-21.076,"x2":-16.987,"h":false,"x1":-16.101},{"s":false,"z1":-21.838,"a":false,"y1":13.069,"n":"Glu","y2":13.21,"z2":-20.002,"x2":-20.8,"h":false,"x1":-19.244},{"s":false,"z1":-20.91,"a":false,"y1":15.593,"n":"Lys","y2":13.909,"z2":-21.786,"x2":-23.317,"h":false,"x1":-21.908},{"s":false,"z1":-20.14,"a":false,"y1":14.572,"n":"Thr","y2":16.892,"z2":-20.148,"x2":-25.97,"h":false,"x1":-25.45},{"s":false,"z1":-19.543,"a":false,"y1":16.51,"n":"Lys","y2":18.601,"z2":-18.37,"x2":-28.641,"h":false,"x1":-28.677},{"s":false,"z1":-16.097,"a":false,"y1":17.49,"n":"Ile","y2":17.082,"z2":-16.37,"x2":-25.099,"h":false,"x1":-27.446},{"s":false,"z1":-16.326,"a":false,"y1":19.863,"n":"Pro","y2":19.204,"z2":-15.69,"x2":-22.225,"h":false,"x1":-24.424},{"s":false,"z1":-13.118,"a":false,"y1":18.367,"n":"Ala","y2":16.326,"z2":-12.449,"x2":-21.885,"h":false,"x1":-22.979},{"s":true,"z1":-14.269,"a":false,"y1":14.763,"n":"Val","y2":14.959,"z2":-16.638,"x2":-23.041,"h":false,"x1":-23.068},{"s":true,"z1":-16.873,"a":true,"y1":13.159,"n":"Phe","y2":11.016,"z2":-15.818,"x2":-20.777,"h":false,"x1":-20.854},{"s":true,"z1":-18.337,"a":false,"y1":9.716,"n":"Lys","y2":10.214,"z2":-19.523,"x2":-18.418,"h":false,"x1":-20.421},{"s":false,"z1":-18.452,"a":false,"y1":8.038,"n":"Ile","y2":5.778,"z2":-18.185,"x2":-17.836,"h":false,"x1":-16.996},{"s":false,"z1":-19.39,"a":false,"y1":4.648,"n":"Asp","y2":4.298,"z2":-19.812,"x2":-13.257,"h":false,"x1":-15.577},{"s":false,"z1":-17.136,"a":false,"y1":4.549,"n":"Ala","y2":4.512,"z2":-14.944,"x2":-13.409,"h":false,"x1":-12.505},{"s":false,"z1":-13.929,"a":false,"y1":2.912,"n":"Leu","y2":2.216,"z2":-12.164,"x2":-12.689,"h":false,"x1":-11.235},{"s":false,"z1":-13.87,"a":false,"y1":0.643,"n":"Asn","y2":1.014,"z2":-12.778,"x2":-16.303,"h":false,"x1":-14.237},{"s":false,"z1":-13.215,"a":false,"y1":3.757,"n":"Glu","y2":3.964,"z2":-15.566,"x2":-16.577,"h":false,"x1":-16.298},{"s":false,"z1":-15.401,"a":false,"y1":5.128,"n":"Asn","y2":6.983,"z2":-16.104,"x2":-20.447,"h":false,"x1":-19.073},{"s":true,"z1":-13.792,"a":false,"y1":8.41,"n":"Lys","y2":8.923,"z2":-12.102,"x2":-18.521,"h":false,"x1":-20.154},{"s":true,"z1":-12.702,"a":false,"y1":11.668,"n":"Val","y2":13.034,"z2":-12.999,"x2":-20.49,"h":false,"x1":-18.559},{"s":true,"z1":-10.33,"a":false,"y1":13.847,"n":"Leu","y2":14.907,"z2":-8.817,"x2":-19.089,"h":false,"x1":-20.625},{"s":true,"z1":-9.599,"a":false,"y1":17.467,"n":"Val","y2":18.093,"z2":-8.672,"x2":-21.757,"h":false,"x1":-19.642},{"s":true,"z1":-6.042,"a":false,"y1":18.192,"n":"Leu","y2":20.149,"z2":-5.41,"x2":-22.058,"h":false,"x1":-20.859},{"s":true,"z1":-5.641,"a":true,"y1":21.857,"n":"Asp","y2":21.807,"z2":-6.148,"x2":-17.528,"h":false,"x1":-19.889},{"s":true,"z1":-6.819,"a":false,"y1":24.497,"n":"Thr","y2":26.412,"z2":-7.098,"x2":-18.855,"h":false,"x1":-17.42},{"s":false,"z1":-6.551,"a":false,"y1":28.196,"n":"Asp","y2":29.891,"z2":-7.873,"x2":-15.742,"h":false,"x1":-16.836},{"s":false,"z1":-9.751,"a":false,"y1":28.009,"n":"Tyr","y2":28.299,"z2":-10.207,"x2":-12.335,"h":false,"x1":-14.683},{"s":false,"z1":-8.18,"a":false,"y1":30.185,"n":"Lys","y2":29.768,"z2":-7.291,"x2":-9.817,"h":false,"x1":-12.004},{"s":false,"z1":-5.586,"a":false,"y1":27.867,"n":"Lys","y2":25.627,"z2":-5.478,"x2":-9.741,"h":false,"x1":-10.518},{"s":true,"z1":-4.942,"a":false,"y1":24.49,"n":"Tyr","y2":24.586,"z2":-6.393,"x2":-14.063,"h":false,"x1":-12.16},{"s":true,"z1":-6.736,"a":false,"y1":21.81,"n":"Leu","y2":19.881,"z2":-5.722,"x2":-13.201,"h":false,"x1":-14.145},{"s":true,"z1":-5.209,"a":false,"y1":18.679,"n":"Leu","y2":18.153,"z2":-6.804,"x2":-17.325,"h":false,"x1":-15.629},{"s":true,"z1":-7.25,"a":false,"y1":15.609,"n":"Phe","y2":13.867,"z2":-5.952,"x2":-15.408,"h":false,"x1":-16.435},{"s":true,"z1":-7.07,"a":false,"y1":11.871,"n":"Cys","y2":11.646,"z2":-9.34,"x2":-17.696,"h":false,"x1":-16.988},{"s":true,"z1":-9.564,"a":true,"y1":9.038,"n":"Met","y2":7.555,"z2":-7.749,"x2":-17.231,"h":false,"x1":-16.739},{"s":true,"z1":-9.266,"a":false,"y1":5.856,"n":"Glu","y2":5.454,"z2":-11.576,"x2":-19.122,"h":false,"x1":-18.722},{"s":false,"z1":-11.087,"a":false,"y1":2.843,"n":"Asn","y2":2.037,"z2":-9.545,"x2":-21.734,"h":false,"x1":-20.074},{"s":false,"z1":-11.089,"a":false,"y1":3.167,"n":"Ser","y2":1.671,"z2":-9.881,"x2":-25.281,"h":false,"x1":-23.838},{"s":false,"z1":-10.972,"a":false,"y1":-0.63,"n":"Ala","y2":-1.865,"z2":-8.982,"x2":-24.719,"h":false,"x1":-24.16},{"s":false,"z1":-7.504,"a":false,"y1":-0.805,"n":"Glu","y2":0.217,"z2":-6.782,"x2":-20.576,"h":false,"x1":-22.613},{"s":false,"z1":-5.845,"a":false,"y1":2.589,"n":"Pro","y2":2.931,"z2":-4.3,"x2":-19.98,"h":true,"x1":-21.801},{"s":false,"z1":-2.549,"a":true,"y1":0.915,"n":"Glu","y2":0.57,"z2":-1.736,"x2":-18.564,"h":true,"x1":-20.811},{"s":false,"z1":-4.076,"a":false,"y1":-0.651,"n":"Gln","y2":-0.089,"z2":-5.662,"x2":-15.984,"h":true,"x1":-17.705},{"s":false,"z1":-6.482,"a":false,"y1":2.255,"n":"Ser","y2":4.354,"z2":-6.85,"x2":-16.165,"h":false,"x1":-17.204},{"s":false,"z1":-4.794,"a":false,"y1":5.593,"n":"Leu","y2":5.617,"z2":-3.272,"x2":-15.692,"h":false,"x1":-17.57},{"s":true,"z1":-4.611,"a":false,"y1":7.749,"n":"Val","y2":9.618,"z2":-6.054,"x2":-14.928,"h":false,"x1":-14.434},{"s":true,"z1":-4.079,"a":false,"y1":11.512,"n":"Cys","y2":11.731,"z2":-3.086,"x2":-12.411,"h":false,"x1":-14.542},{"s":true,"z1":-4.19,"a":false,"y1":14.237,"n":"Gln","y2":16.188,"z2":-4.405,"x2":-13.309,"h":false,"x1":-11.931},{"s":true,"z1":-3.056,"a":false,"y1":17.783,"n":"Cys","y2":18.01,"z2":-3.603,"x2":-9.143,"h":false,"x1":-11.46},{"s":true,"z1":-5.66,"a":true,"y1":19.823,"n":"Leu","y2":21.971,"z2":-5.033,"x2":-10.445,"h":false,"x1":-9.619},{"s":true,"z1":-5.158,"a":false,"y1":23.19,"n":"Val","y2":22.986,"z2":-7.003,"x2":-6.345,"h":false,"x1":-7.897},{"s":false,"z1":-7.742,"a":false,"y1":25.655,"n":"Arg","y2":25.636,"z2":-8.5,"x2":-4.273,"h":false,"x1":-6.552},{"s":false,"z1":-6.083,"a":false,"y1":26.457,"n":"Thr","y2":24.851,"z2":-4.337,"x2":-3.566,"h":false,"x1":-3.23},{"s":false,"z1":-4.212,"a":false,"y1":24.019,"n":"Pro","y2":24.441,"z2":-2.166,"x2":0.271,"h":false,"x1":-0.904},{"s":false,"z1":-0.751,"a":false,"y1":25.226,"n":"Glu","y2":24.083,"z2":-0.894,"x2":-4.058,"h":false,"x1":-1.99},{"s":false,"z1":1.747,"a":false,"y1":23.638,"n":"Val","y2":25.653,"z2":2.83,"x2":-4.935,"h":false,"x1":-4.292},{"s":false,"z1":1.892,"a":false,"y1":25.467,"n":"Asp","y2":23.824,"z2":2.602,"x2":-9.203,"h":false,"x1":-7.6},{"s":false,"z1":5.207,"a":false,"y1":24.679,"n":"Asp","y2":24.008,"z2":5.413,"x2":-11.677,"h":true,"x1":-9.368},{"s":false,"z1":3.791,"a":false,"y1":26.003,"n":"Glu","y2":24.261,"z2":3.056,"x2":-14.105,"h":true,"x1":-12.66},{"s":false,"z1":0.837,"a":false,"y1":23.605,"n":"Ala","y2":21.433,"z2":1.195,"x2":-13.515,"h":true,"x1":-12.53},{"s":false,"z1":3.204,"a":false,"y1":20.701,"n":"Leu","y2":19.528,"z2":4.122,"x2":-13.667,"h":true,"x1":-11.772},{"s":false,"z1":5.471,"a":false,"y1":21.727,"n":"Glu","y2":20.573,"z2":5.029,"x2":-16.717,"h":true,"x1":-14.646},{"s":false,"z1":2.513,"a":false,"y1":21.722,"n":"Lys","y2":19.634,"z2":1.872,"x2":-18.067,"h":true,"x1":-17.094},{"s":false,"z1":1.554,"a":false,"y1":18.334,"n":"Phe","y2":16.521,"z2":2.389,"x2":-16.974,"h":true,"x1":-15.62},{"s":false,"z1":4.981,"a":false,"y1":16.829,"n":"Asp","y2":15.801,"z2":5.408,"x2":-18.367,"h":true,"x1":-16.233},{"s":false,"z1":4.98,"a":false,"y1":18.059,"n":"Lys","y2":16.533,"z2":4.194,"x2":-21.5,"h":true,"x1":-19.83},{"s":false,"z1":1.553,"a":true,"y1":16.658,"n":"Ala","y2":14.401,"z2":1.189,"x2":-21.296,"h":true,"x1":-20.625},{"s":false,"z1":2.65,"a":false,"y1":13.334,"n":"Leu","y2":11.572,"z2":4.118,"x2":-19.804,"h":true,"x1":-19.205},{"s":false,"z1":6.033,"a":false,"y1":13.224,"n":"Lys","y2":11.401,"z2":6.794,"x2":-22.242,"h":false,"x1":-20.945},{"s":false,"z1":4.511,"a":false,"y1":11.264,"n":"Ala","y2":9.015,"z2":3.69,"x2":-24.204,"h":false,"x1":-23.813},{"s":false,"z1":2.333,"a":false,"y1":8.918,"n":"Leu","y2":8.133,"z2":4.253,"x2":-20.544,"h":false,"x1":-21.751},{"s":false,"z1":3.318,"a":false,"y1":5.445,"n":"Pro","y2":4.28,"z2":2.548,"x2":-18.296,"h":false,"x1":-20.27},{"s":false,"z1":3.247,"a":false,"y1":6.342,"n":"Met","y2":5.742,"z2":5.52,"x2":-16.111,"h":false,"x1":-16.498},{"s":false,"z1":4.967,"a":false,"y1":3.966,"n":"His","y2":3.75,"z2":5.698,"x2":-11.842,"h":false,"x1":-14.074},{"s":true,"z1":3.988,"a":false,"y1":5.663,"n":"Ile","y2":7.474,"z2":2.571,"x2":-11.604,"h":false,"x1":-10.88},{"s":true,"z1":3.825,"a":false,"y1":9.331,"n":"Arg","y2":9.299,"z2":4.832,"x2":-7.739,"h":false,"x1":-9.931},{"s":true,"z1":2.946,"a":true,"y1":11.034,"n":"Leu","y2":13.018,"z2":1.98,"x2":-7.559,"h":false,"x1":-6.637},{"s":true,"z1":2.904,"a":false,"y1":14.667,"n":"Ser","y2":14.328,"z2":3.529,"x2":-3.217,"h":false,"x1":-5.524},{"s":false,"z1":1.522,"a":false,"y1":15.925,"n":"Phe","y2":18.159,"z2":2.279,"x2":-2.53,"h":false,"x1":-2.205},{"s":false,"z1":2.574,"a":false,"y1":18.669,"n":"Asn","y2":18.656,"z2":0.287,"x2":0.804,"h":false,"x1":0.188},{"s":false,"z1":0.22,"a":false,"y1":21.322,"n":"Pro","y2":20.782,"z2":-1.668,"x2":3.04,"h":true,"x1":1.654},{"s":false,"z1":-0.114,"a":false,"y1":19.318,"n":"Thr","y2":18.119,"z2":-2.148,"x2":4.997,"h":true,"x1":4.855},{"s":false,"z1":-1.524,"a":true,"y1":16.363,"n":"Gln","y2":16.37,"z2":-3.803,"x2":2.152,"h":true,"x1":2.945},{"s":false,"z1":-3.528,"a":false,"y1":18.667,"n":"Leu","y2":19.07,"z2":-5.903,"x2":0.956,"h":true,"x1":0.629},{"s":false,"z1":-5.679,"a":false,"y1":19.873,"n":"Glu","y2":19.184,"z2":-7.263,"x2":5.228,"h":false,"x1":3.558},{"s":false,"z1":-6.551,"a":false,"y1":16.509,"n":"Glu","y2":15.35,"z2":-7.1,"x2":3.115,"h":false,"x1":5.15},{"s":false,"z1":-9.4,"a":false,"y1":14.152,"n":"Gln","y2":12.289,"z2":-7.937,"x2":4.491,"h":false,"x1":4.151},{"s":false,"z1":-7.943,"a":false,"y1":11.497,"n":"Cys","y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.831},{"s":false,"z1":-6.419,"a":false,"y1":11.67,"y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.875},{"s":false,"z1":-6.419,"a":false,"y1":11.67,"y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.875},{"s":false,"z1":-6.419,"a":false,"y1":11.67,"y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.875},{"s":false,"z1":-6.419,"a":false,"y1":11.67,"y2":10.63,"z2":-5.715,"x2":1.813,"h":false,"x1":1.875}],[{"s":false,"z1":24.715,"a":false,"y1":15.059,"y2":15.059,"z2":24.715,"x2":-6.555,"h":false,"x1":-6.555},{"s":false,"z1":24.715,"a":false,"y1":15.059,"y2":15.059,"z2":24.715,"x2":-6.555,"h":false,"x1":-6.555},{"s":false,"z1":26.029,"a":false,"y1":14.688,"n":"Gln","y2":12.416,"z2":25.634,"x2":-6.545,"h":false,"x1":-7.166},{"s":false,"z1":28.256,"a":false,"y1":11.879,"n":"Thr","y2":12.524,"z2":30.022,"x2":-7.526,"h":false,"x1":-6.03},{"s":false,"z1":30.445,"a":false,"y1":9.986,"n":"Met","y2":9.374,"z2":32.428,"x2":-7.33,"h":false,"x1":-8.532},{"s":false,"z1":34.013,"a":false,"y1":11.195,"n":"Lys","y2":9.691,"z2":34.41,"x2":-10.559,"h":false,"x1":-8.736},{"s":false,"z1":36.427,"a":false,"y1":8.356,"n":"Gly","y2":6.24,"z2":36.042,"x2":-10.314,"h":false,"x1":-9.313},{"s":false,"z1":34.093,"a":false,"y1":5.453,"n":"Leu","y2":4.429,"z2":35.854,"x2":-7.24,"h":false,"x1":-8.556},{"s":false,"z1":35.919,"a":false,"y1":2.104,"n":"Asp","y2":0.4,"z2":34.334,"x2":-9.143,"h":false,"x1":-8.727},{"s":false,"z1":33.796,"a":false,"y1":-0.004,"n":"Ile","y2":-2.226,"z2":33.033,"x2":-6.871,"h":true,"x1":-6.473},{"s":false,"z1":35.399,"a":false,"y1":-3.272,"n":"Gln","y2":-4.706,"z2":34.16,"x2":-9.11,"h":true,"x1":-7.634},{"s":false,"z1":33.724,"a":true,"y1":-2.841,"n":"Lys","y2":-3.06,"z2":31.567,"x2":-12.038,"h":true,"x1":-11.018},{"s":false,"z1":30.134,"a":false,"y1":-2.801,"n":"Val","y2":-4.349,"z2":28.416,"x2":-9.022,"h":true,"x1":-9.715},{"s":false,"z1":30.225,"a":false,"y1":-6.413,"n":"Ala","y2":-7.143,"z2":29.423,"x2":-10.644,"h":false,"x1":-8.526},{"s":false,"z1":27.46,"a":false,"y1":-8.703,"n":"Gly","y2":-7.822,"z2":25.598,"x2":-8.393,"h":false,"x1":-9.62},{"s":false,"z1":23.746,"a":false,"y1":-9.101,"n":"Thr","y2":-7.354,"z2":23.772,"x2":-11.75,"h":false,"x1":-10.119},{"s":false,"z1":21.644,"a":false,"y1":-5.977,"n":"Trp","y2":-7.03,"z2":19.651,"x2":-9.648,"h":false,"x1":-10.506},{"s":true,"z1":17.901,"a":false,"y1":-5.312,"n":"Tyr","y2":-2.94,"z2":17.919,"x2":-11.267,"h":false,"x1":-10.928},{"s":true,"z1":15.943,"a":false,"y1":-2.411,"n":"Ser","y2":-2.696,"z2":13.836,"x2":-10.492,"h":false,"x1":-9.414},{"s":true,"z1":14.384,"a":false,"y1":-0.747,"n":"Leu","y2":0.479,"z2":12.325,"x2":-12.52,"h":false,"x1":-12.479},{"s":true,"z1":13.15,"a":false,"y1":2.399,"n":"Ala","y2":2.647,"z2":14.737,"x2":-8.962,"h":false,"x1":-10.739},{"s":true,"z1":13.006,"a":false,"y1":4.037,"n":"Met","y2":5.481,"z2":11.106,"x2":-7.693,"h":false,"x1":-7.306},{"s":true,"z1":11.981,"a":true,"y1":7.427,"n":"Ala","y2":7.381,"z2":13.418,"x2":-3.993,"h":false,"x1":-5.9},{"s":true,"z1":11.688,"a":false,"y1":8.866,"n":"Ala","y2":10.732,"z2":10.223,"x2":-2.807,"h":false,"x1":-2.397},{"s":false,"z1":11.382,"a":false,"y1":12.265,"n":"Ser","y2":13.129,"z2":9.238,"x2":-0.334,"h":false,"x1":-0.847},{"s":false,"z1":8.497,"a":false,"y1":11.119,"n":"Asp","y2":8.801,"z2":8.197,"x2":0.888,"h":false,"x1":1.338},{"s":false,"z1":5.61,"a":false,"y1":9.137,"n":"Ile","y2":6.754,"z2":5.808,"x2":0.195,"h":true,"x1":-0.141},{"s":false,"z1":5.33,"a":true,"y1":6.874,"n":"Ser","y2":4.694,"z2":6.379,"x2":3.015,"h":true,"x1":2.889},{"s":false,"z1":8.847,"a":false,"y1":5.56,"n":"Leu","y2":3.311,"z2":9.192,"x2":1.407,"h":true,"x1":2.192},{"s":false,"z1":7.706,"a":false,"y1":3.627,"n":"Leu","y2":2.229,"z2":6.056,"x2":-1.918,"h":false,"x1":-0.925},{"s":false,"z1":3.919,"a":false,"y1":3.676,"n":"Asp","y2":2.053,"z2":3.84,"x2":0.747,"h":false,"x1":-1.033},{"s":false,"z1":2.704,"a":false,"y1":0.034,"n":"Ala","y2":-0.399,"z2":5.053,"x2":-0.49,"h":false,"x1":-0.843},{"s":false,"z1":4.834,"a":false,"y1":-3.139,"n":"Gln","y2":-3.628,"z2":6.676,"x2":0.534,"h":false,"x1":-0.92},{"s":false,"z1":5.228,"a":false,"y1":-3.224,"n":"Ser","y2":-2.131,"z2":6.83,"x2":4.225,"h":false,"x1":2.841},{"s":false,"z1":6.859,"a":false,"y1":0.224,"n":"Ala","y2":-1.135,"z2":8.858,"x2":2.686,"h":false,"x1":2.76},{"s":false,"z1":10.232,"a":false,"y1":0.36,"n":"Pro","y2":-0.23,"z2":12.455,"x2":3.944,"h":false,"x1":4.692},{"s":false,"z1":12.409,"a":false,"y1":1.522,"n":"Leu","y2":1.205,"z2":12.71,"x2":-0.613,"h":false,"x1":1.769},{"s":false,"z1":10.619,"a":false,"y1":-0.575,"n":"Arg","y2":-2.974,"z2":10.91,"x2":-0.544,"h":false,"x1":-0.795},{"s":true,"z1":13.606,"a":false,"y1":-2.884,"n":"Val","y2":-2.091,"z2":14.339,"x2":-3.429,"h":false,"x1":-1.288},{"s":true,"z1":14.985,"a":false,"y1":-4.668,"n":"Tyr","y2":-6.307,"z2":16.619,"x2":-3.763,"h":false,"x1":-4.378},{"s":true,"z1":18.682,"a":false,"y1":-4.975,"n":"Val","y2":-6.248,"z2":18.411,"x2":-7.015,"h":false,"x1":-5.016},{"s":true,"z1":19.729,"a":false,"y1":-8.482,"n":"Glu","y2":-8.987,"z2":21.46,"x2":-7.429,"h":false,"x1":-5.874},{"s":true,"z1":23.492,"a":false,"y1":-8.266,"n":"Glu","y2":-6.862,"z2":23.913,"x2":-3.863,"h":false,"x1":-5.757},{"s":true,"z1":26.388,"a":false,"y1":-5.957,"n":"Leu","y2":-7.154,"z2":28.158,"x2":-5.963,"h":false,"x1":-4.938},{"s":true,"z1":29.525,"a":true,"y1":-7.679,"n":"Lys","y2":-6.806,"z2":30.557,"x2":-1.657,"h":false,"x1":-3.638},{"s":true,"z1":32.451,"a":false,"y1":-5.355,"n":"Pro","y2":-7.378,"z2":33.7,"x2":-2.832,"h":false,"x1":-2.87},{"s":false,"z1":35.062,"a":false,"y1":-6.749,"n":"Thr","y2":-5.174,"z2":36.487,"x2":-1.528,"h":false,"x1":-0.497},{"s":false,"z1":38.745,"a":false,"y1":-6.616,"n":"Pro","y2":-4.531,"z2":39.928,"x2":-1.35,"h":false,"x1":-1.455},{"s":false,"z1":39.111,"a":false,"y1":-3.938,"n":"Glu","y2":-1.625,"z2":38.448,"x2":1.486,"h":false,"x1":1.272},{"s":false,"z1":36.667,"a":false,"y1":-1.633,"n":"Gly","y2":-0.295,"z2":34.795,"x2":0.087,"h":false,"x1":-0.561},{"s":false,"z1":33.607,"a":false,"y1":-2.295,"n":"Asp","y2":-3.443,"z2":32.95,"x2":-0.444,"h":false,"x1":1.541},{"s":true,"z1":30.311,"a":false,"y1":-3.244,"n":"Leu","y2":-3.474,"z2":28.551,"x2":1.597,"h":false,"x1":0},{"s":true,"z1":27.982,"a":false,"y1":-6.067,"n":"Glu","y2":-6.137,"z2":27.008,"x2":-1.379,"h":false,"x1":0.829},{"s":true,"z1":24.556,"a":false,"y1":-5.418,"n":"Ile","y2":-6.424,"z2":22.998,"x2":0.888,"h":false,"x1":-0.628},{"s":true,"z1":21.968,"a":false,"y1":-8.147,"n":"Leu","y2":-7.265,"z2":20.652,"x2":-2.733,"h":false,"x1":-0.952},{"s":true,"z1":18.315,"a":false,"y1":-7.272,"n":"Leu","y2":-8.893,"z2":17.295,"x2":0.047,"h":false,"x1":-1.35},{"s":true,"z1":14.692,"a":false,"y1":-8.467,"n":"Gln","y2":-6.28,"z2":13.722,"x2":-1.088,"h":false,"x1":-1.131},{"s":true,"z1":12.076,"a":true,"y1":-6.855,"n":"Lys","y2":-8.821,"z2":10.895,"x2":1.787,"h":false,"x1":1.087},{"s":true,"z1":8.433,"a":false,"y1":-7.779,"n":"Trp","y2":-6.445,"z2":8.064,"x2":3.466,"h":false,"x1":1.502},{"s":false,"z1":7.992,"a":false,"y1":-8.494,"n":"Glu","y2":-8.233,"z2":6.032,"x2":6.577,"h":false,"x1":5.193},{"s":false,"z1":5.573,"a":false,"y1":-10.905,"n":"Asn","y2":-13.146,"z2":5.17,"x2":5.974,"h":false,"x1":6.772},{"s":false,"z1":3.494,"a":false,"y1":-12.316,"n":"Gly","y2":-13.731,"z2":4.064,"x2":2.025,"h":false,"x1":3.905},{"s":false,"z1":6.748,"a":false,"y1":-13.259,"n":"Glu","y2":-11.205,"z2":7.976,"x2":2.372,"h":false,"x1":2.203},{"s":true,"z1":9.647,"a":false,"y1":-11.883,"n":"Cys","y2":-13.298,"z2":11.565,"x2":0.511,"h":false,"x1":0.217},{"s":true,"z1":12.603,"a":false,"y1":-11.712,"n":"Ala","y2":-10.41,"z2":13.859,"x2":1.029,"h":false,"x1":2.649},{"s":true,"z1":16.289,"a":false,"y1":-11.478,"n":"Gln","y2":-11.401,"z2":17.12,"x2":4.076,"h":false,"x1":1.835},{"s":true,"z1":18.505,"a":false,"y1":-8.978,"n":"Lys","y2":-8.414,"z2":19.947,"x2":1.842,"h":false,"x1":3.637},{"s":true,"z1":22.234,"a":false,"y1":-8.426,"n":"Lys","y2":-7.16,"z2":22.422,"x2":5.571,"h":false,"x1":3.527},{"s":true,"z1":23.654,"a":false,"y1":-5.004,"n":"Ile","y2":-5.023,"z2":25.5,"x2":2.973,"h":false,"x1":4.439},{"s":true,"z1":27.349,"a":true,"y1":-4.259,"n":"Ile","y2":-2.048,"z2":27.232,"x2":5.872,"h":false,"x1":4.921},{"s":true,"z1":28.215,"a":false,"y1":-0.791,"n":"Ala","y2":-1.101,"z2":30.505,"x2":3.177,"h":false,"x1":3.736},{"s":false,"z1":31.455,"a":false,"y1":0.63,"n":"Glu","y2":2.824,"z2":31.292,"x2":4.221,"h":false,"x1":5.153},{"s":false,"z1":33.732,"a":false,"y1":2.732,"n":"Lys","y2":3.813,"z2":34.202,"x2":5.111,"h":false,"x1":3.021},{"s":false,"z1":34.584,"a":false,"y1":6.314,"n":"Thr","y2":6.036,"z2":36.194,"x2":2.176,"h":false,"x1":3.889},{"s":false,"z1":37.366,"a":false,"y1":8.533,"n":"Lys","y2":9.253,"z2":37.716,"x2":0.262,"h":false,"x1":2.516},{"s":false,"z1":34.989,"a":false,"y1":9.403,"n":"Ile","y2":7.425,"z2":33.668,"x2":-0.226,"h":false,"x1":-0.278},{"s":false,"z1":34.727,"a":false,"y1":6.346,"n":"Pro","y2":4.959,"z2":32.817,"x2":-2.986,"h":false,"x1":-2.614},{"s":false,"z1":31.106,"a":false,"y1":7.003,"n":"Ala","y2":7.14,"z2":28.909,"x2":-2.636,"h":false,"x1":-3.634},{"s":true,"z1":29.894,"a":false,"y1":7.416,"n":"Val","y2":5.999,"z2":31.428,"x2":1.095,"h":false,"x1":-0.023},{"s":true,"z1":29.471,"a":true,"y1":4.503,"n":"Phe","y2":5.369,"z2":27.578,"x2":3.54,"h":false,"x1":2.365},{"s":true,"z1":28.199,"a":false,"y1":4.178,"n":"Lys","y2":1.791,"z2":28.032,"x2":5.941,"h":false,"x1":5.949},{"s":false,"z1":25.374,"a":false,"y1":1.85,"n":"Ile","y2":3.262,"z2":24.328,"x2":8.519,"h":false,"x1":6.872},{"s":false,"z1":23.206,"a":false,"y1":1.108,"n":"Asp","y2":-1.019,"z2":22.089,"x2":10.037,"h":false,"x1":9.869},{"s":false,"z1":20.111,"a":false,"y1":-0.394,"n":"Ala","y2":1.453,"z2":19.28,"x2":7.04,"h":false,"x1":8.257},{"s":false,"z1":16.595,"a":false,"y1":0.63,"n":"Leu","y2":2.892,"z2":15.846,"x2":7.031,"h":false,"x1":7.282},{"s":false,"z1":16.846,"a":false,"y1":3.707,"n":"Asn","y2":5.864,"z2":17.471,"x2":8.749,"h":false,"x1":9.513},{"s":false,"z1":19.405,"a":false,"y1":4.88,"n":"Glu","y2":3.755,"z2":21.154,"x2":8.196,"h":false,"x1":6.975},{"s":false,"z1":23.028,"a":false,"y1":5.656,"n":"Asn","y2":5.957,"z2":25.284,"x2":6.881,"h":false,"x1":7.721},{"s":true,"z1":24.473,"a":false,"y1":6.615,"n":"Lys","y2":5.934,"z2":22.758,"x2":2.797,"h":false,"x1":4.327},{"s":true,"z1":24.621,"a":false,"y1":5.237,"n":"Val","y2":6.332,"z2":26.656,"x2":0.132,"h":false,"x1":0.791},{"s":true,"z1":25.594,"a":false,"y1":7.55,"n":"Leu","y2":6.585,"z2":24.428,"x2":-3.906,"h":false,"x1":-2.064},{"s":true,"z1":26.622,"a":false,"y1":6.279,"n":"Val","y2":8.31,"z2":27.605,"x2":-6.284,"h":false,"x1":-5.449},{"s":true,"z1":25.526,"a":false,"y1":8.909,"n":"Leu","y2":9.716,"z2":26.908,"x2":-9.774,"h":false,"x1":-7.967},{"s":true,"z1":26.736,"a":true,"y1":7.414,"n":"Asp","y2":5.185,"z2":25.812,"x2":-11.192,"h":false,"x1":-11.266},{"s":true,"z1":27.523,"a":false,"y1":4.222,"n":"Thr","y2":4.824,"z2":29.463,"x2":-14.419,"h":false,"x1":-13.166},{"s":false,"z1":28.917,"a":false,"y1":2.997,"n":"Asp","y2":1.079,"z2":30.152,"x2":-17.095,"h":false,"x1":-16.443},{"s":false,"z1":29.548,"a":false,"y1":-0.278,"n":"Tyr","y2":-2.4,"z2":28.499,"x2":-14.955,"h":false,"x1":-14.673},{"s":false,"z1":28.349,"a":false,"y1":-2.129,"n":"Lys","y2":-3.429,"z2":26.362,"x2":-17.978,"h":false,"x1":-17.763},{"s":false,"z1":24.68,"a":false,"y1":-1.266,"n":"Lys","y2":-1.58,"z2":23.021,"x2":-16.056,"h":false,"x1":-17.73},{"s":true,"z1":23.296,"a":false,"y1":0.845,"n":"Tyr","y2":1.717,"z2":25.334,"x2":-14.007,"h":false,"x1":-14.912},{"s":true,"z1":24.105,"a":false,"y1":2.307,"n":"Leu","y2":2.541,"z2":21.886,"x2":-10.686,"h":false,"x1":-11.517},{"s":true,"z1":22.252,"a":false,"y1":5.096,"n":"Leu","y2":5.759,"z2":23.92,"x2":-8.055,"h":false,"x1":-9.656},{"s":true,"z1":22.321,"a":false,"y1":5.377,"n":"Phe","y2":5.575,"z2":20.019,"x2":-5.345,"h":false,"x1":-5.877},{"s":true,"z1":20.531,"a":false,"y1":6.823,"n":"Cys","y2":6.217,"z2":22.141,"x2":-1.288,"h":false,"x1":-2.939},{"s":true,"z1":20.19,"a":true,"y1":6.012,"n":"Met","y2":7.769,"z2":18.619,"x2":0.889,"h":false,"x1":0.686},{"s":true,"z1":19.469,"a":false,"y1":8.534,"n":"Glu","y2":7.788,"z2":20.892,"x2":5.096,"h":false,"x1":3.338},{"s":false,"z1":19.646,"a":false,"y1":9.33,"n":"Asn","y2":11.682,"z2":19.355,"x2":7.093,"h":false,"x1":7.002},{"s":false,"z1":22.124,"a":false,"y1":12.203,"n":"Ser","y2":14.41,"z2":21.587,"x2":8.055,"h":false,"x1":7.33},{"s":false,"z1":20.098,"a":false,"y1":13.528,"n":"Ala","y2":15.331,"z2":18.507,"x2":10.328,"h":false,"x1":10.341},{"s":false,"z1":16.97,"a":false,"y1":14.172,"n":"Glu","y2":12.758,"z2":15.91,"x2":6.646,"h":false,"x1":8.285},{"s":false,"z1":17.468,"a":false,"y1":13.738,"n":"Pro","y2":12.852,"z2":15.595,"x2":3.327,"h":true,"x1":4.512},{"s":false,"z1":14.035,"a":true,"y1":15.127,"n":"Glu","y2":13.697,"z2":12.23,"x2":3.111,"h":true,"x1":3.719},{"s":false,"z1":12.104,"a":false,"y1":12.368,"n":"Gln","y2":10.029,"z2":12.341,"x2":5.908,"h":true,"x1":5.4},{"s":false,"z1":14.545,"a":false,"y1":9.712,"n":"Ser","y2":8.203,"z2":15.643,"x2":2.872,"h":false,"x1":4.425},{"s":false,"z1":15.927,"a":false,"y1":10.08,"n":"Leu","y2":9.32,"z2":14.081,"x2":-0.42,"h":false,"x1":0.906},{"s":true,"z1":15.447,"a":false,"y1":7.036,"n":"Val","y2":6.444,"z2":17.658,"x2":-1.984,"h":false,"x1":-1.311},{"s":true,"z1":17.121,"a":false,"y1":6.531,"n":"Cys","y2":5.307,"z2":15.395,"x2":-5.808,"h":false,"x1":-4.686},{"s":true,"z1":17.187,"a":false,"y1":3.704,"n":"Gln","y2":4.228,"z2":19.141,"x2":-8.522,"h":false,"x1":-7.191},{"s":true,"z1":18.109,"a":false,"y1":2.955,"n":"Cys","y2":0.744,"z2":17.27,"x2":-11.001,"h":false,"x1":-10.796},{"s":true,"z1":19.74,"a":true,"y1":-0.422,"n":"Leu","y2":0.142,"z2":20.962,"x2":-13.087,"h":false,"x1":-11.119},{"s":true,"z1":20.458,"a":false,"y1":-2.267,"n":"Val","y2":-4.464,"z2":20.594,"x2":-13.306,"h":false,"x1":-14.301},{"s":false,"z1":22.642,"a":false,"y1":-5.312,"n":"Arg","y2":-7.598,"z2":21.837,"x2":-15.069,"h":false,"x1":-14.983},{"s":false,"z1":20.136,"a":false,"y1":-7.203,"n":"Thr","y2":-5.584,"z2":18.402,"x2":-16.948,"h":false,"x1":-17.203},{"s":false,"z1":16.356,"a":false,"y1":-7.418,"n":"Pro","y2":-7.433,"z2":14.586,"x2":-18.283,"h":false,"x1":-16.667},{"s":false,"z1":15.418,"a":false,"y1":-5.129,"n":"Glu","y2":-3.136,"z2":15.962,"x2":-18.318,"h":false,"x1":-19.544},{"s":false,"z1":14.026,"a":false,"y1":-1.599,"n":"Val","y2":-1.046,"z2":14.978,"x2":-21.591,"h":false,"x1":-19.423},{"s":false,"z1":16.836,"a":false,"y1":0.785,"n":"Asp","y2":2.844,"z2":16.617,"x2":-19.168,"h":false,"x1":-20.424},{"s":false,"z1":15.57,"a":false,"y1":4.322,"n":"Asp","y2":6.395,"z2":16.478,"x2":-20.457,"h":true,"x1":-21.23},{"s":false,"z1":19.074,"a":false,"y1":5.793,"n":"Glu","y2":6.921,"z2":19.439,"x2":-19.026,"h":true,"x1":-21.091},{"s":false,"z1":19.391,"a":false,"y1":4.57,"n":"Ala","y2":6.209,"z2":18.543,"x2":-15.979,"h":true,"x1":-17.529},{"s":false,"z1":15.934,"a":false,"y1":5.992,"n":"Leu","y2":8.322,"z2":15.73,"x2":-16.341,"h":true,"x1":-16.836},{"s":false,"z1":17.012,"a":false,"y1":9.127,"n":"Glu","y2":10.77,"z2":17.55,"x2":-16.97,"h":true,"x1":-18.627},{"s":false,"z1":20.038,"a":false,"y1":9.557,"n":"Lys","y2":10.687,"z2":19.761,"x2":-14.235,"h":true,"x1":-16.357},{"s":false,"z1":17.978,"a":false,"y1":8.771,"n":"Phe","y2":10.683,"z2":17.211,"x2":-12.057,"h":true,"x1":-13.276},{"s":false,"z1":15.484,"a":false,"y1":11.534,"n":"Asp","y2":13.723,"z2":15.879,"x2":-13.059,"h":true,"x1":-13.947},{"s":false,"z1":18.219,"a":false,"y1":14.104,"n":"Lys","y2":15.337,"z2":18.861,"x2":-12.491,"h":true,"x1":-14.459},{"s":false,"z1":19.896,"a":false,"y1":13.096,"n":"Ala","y2":14.362,"z2":19.176,"x2":-9.317,"h":true,"x1":-11.226},{"s":false,"z1":16.561,"a":true,"y1":13.566,"n":"Leu","y2":15.108,"z2":14.753,"x2":-9.333,"h":true,"x1":-9.511},{"s":false,"z1":15.671,"a":false,"y1":16.868,"n":"Lys","y2":18.746,"z2":14.902,"x2":-9.799,"h":true,"x1":-11.076},{"s":false,"z1":17.125,"a":false,"y1":18.868,"n":"Ala","y2":18.929,"z2":17.366,"x2":-5.736,"h":false,"x1":-8.138},{"s":false,"z1":15.925,"a":false,"y1":16.567,"n":"Leu","y2":16.611,"z2":13.655,"x2":-6.142,"h":false,"x1":-5.344},{"s":false,"z1":12.518,"a":false,"y1":16.747,"n":"Pro","y2":15,"z2":11.215,"x2":-2.502,"h":false,"x1":-3.571},{"s":false,"z1":11.028,"a":false,"y1":13.407,"n":"Met","y2":14.293,"z2":9.039,"x2":-5.688,"h":false,"x1":-4.747},{"s":false,"z1":7.35,"a":false,"y1":12.952,"n":"His","y2":11.616,"z2":5.454,"x2":-4.604,"h":false,"x1":-3.992},{"s":true,"z1":6.967,"a":false,"y1":9.411,"n":"Ile","y2":8.69,"z2":9.189,"x2":-5.833,"h":false,"x1":-5.311},{"s":true,"z1":8.455,"a":false,"y1":7.635,"n":"Arg","y2":6.418,"z2":6.588,"x2":-9.191,"h":false,"x1":-8.347},{"s":true,"z1":8.004,"a":true,"y1":4.032,"n":"Leu","y2":3.601,"z2":10.182,"x2":-10.329,"h":false,"x1":-9.538},{"s":true,"z1":9.381,"a":false,"y1":2.348,"n":"Ser","y2":0.989,"z2":7.521,"x2":-13.204,"h":false,"x1":-12.645},{"s":false,"z1":9.056,"a":false,"y1":-1.372,"n":"Phe","y2":-1.249,"z2":9.672,"x2":-15.585,"h":false,"x1":-13.283},{"s":false,"z1":8.298,"a":false,"y1":-3.693,"n":"Asn","y2":-5.308,"z2":9.572,"x2":-14.962,"h":false,"x1":-16.165},{"s":false,"z1":10.649,"a":false,"y1":-6.499,"n":"Pro","y2":-8.346,"z2":10.734,"x2":-15.684,"h":true,"x1":-17.238},{"s":false,"z1":7.907,"a":false,"y1":-8.739,"n":"Thr","y2":-9.484,"z2":8.584,"x2":-13.646,"h":true,"x1":-15.867},{"s":false,"z1":8.209,"a":false,"y1":-6.963,"n":"Gln","y2":-7.193,"z2":10.017,"x2":-11.021,"h":true,"x1":-12.528},{"s":false,"z1":12.011,"a":false,"y1":-7.077,"n":"Leu","y2":-8.692,"z2":13.321,"x2":-11.77,"h":true,"x1":-12.965},{"s":false,"z1":12.31,"a":true,"y1":-10.864,"n":"Glu","y2":-12.171,"z2":12.281,"x2":-11.091,"h":true,"x1":-13.108},{"s":false,"z1":9.718,"a":false,"y1":-11.283,"n":"Glu","y2":-11.157,"z2":10.798,"x2":-8.21,"h":true,"x1":-10.356},{"s":false,"z1":11.049,"a":false,"y1":-8.263,"n":"Gln","y2":-7.131,"z2":9.279,"x2":-7.275,"h":false,"x1":-8.462},{"s":false,"z1":9.373,"a":false,"y1":-8.896,"n":"Cys","y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.142},{"s":false,"z1":8.532,"a":false,"y1":-10.179,"y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.059},{"s":false,"z1":8.532,"a":false,"y1":-10.179,"y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.059},{"s":false,"z1":8.532,"a":false,"y1":-10.179,"y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.059},{"s":false,"z1":8.532,"a":false,"y1":-10.179,"y2":-11.242,"z2":9.058,"x2":-5.485,"h":false,"x1":-5.059}]]},"mol":{"b":[{"e":1,"b":0},{"e":2,"b":0},{"e":3,"b":0},{"e":4,"b":0}],"a":[{"p_h":true,"l":"S","z":17.197,"y":-3.15,"x":10.085},{"p_h":true,"l":"O","z":16.373,"y":-3.679,"x":8.996},{"p_h":true,"l":"O","z":16.561,"y":-2.236,"x":11.062},{"p_h":true,"l":"O","z":18.1,"y":-4.103,"x":10.747},{"p_h":true,"l":"O","z":18.077,"y":-2.564,"x":9.08},{"p_w":true,"p_h":true,"l":"O","z":-9.626,"y":26.792,"x":-0.365},{"p_w":true,"p_h":true,"l":"H","z":-9.385,"y":26.68,"x":-1.277},{"p_w":true,"p_h":true,"l":"H","z":-9.658,"y":25.934,"x":0.02},{"p_w":true,"p_h":true,"l":"O","z":7.569,"y":7.159,"x":-13.287},{"p_w":true,"p_h":true,"l":"H","z":7.006,"y":7.905,"x":-13.496},{"p_w":true,"p_h":true,"l":"H","z":8.111,"y":7.444,"x":-12.569},{"p_w":true,"p_h":true,"l":"O","z":2.957,"y":-0.877,"x":-13.722},{"p_w":true,"p_h":true,"l":"H","z":3.304,"y":-1.679,"x":-13.26},{"p_w":true,"p_h":true,"l":"H","z":2.081,"y":-1.136,"x":-13.971},{"p_w":true,"p_h":true,"l":"O","z":-0.831,"y":3.434,"x":2.09},{"p_w":true,"p_h":true,"l":"H","z":-1.287,"y":2.995,"x":2.806},{"p_w":true,"p_h":true,"l":"H","z":-0.677,"y":2.746,"x":1.443},{"p_w":true,"p_h":true,"l":"O","z":-20.197,"y":7.919,"x":-13.927},{"p_w":true,"p_h":true,"l":"H","z":-20.468,"y":7.03,"x":-14.179},{"p_w":true,"p_h":true,"l":"H","z":-20.687,"y":8.489,"x":-14.539},{"p_w":true,"p_h":true,"l":"O","z":-12.806,"y":30.118,"x":-8.245},{"p_w":true,"p_h":true,"l":"H","z":-12.618,"y":30.836,"x":-7.659},{"p_w":true,"p_h":true,"l":"H","z":-12.067,"y":30.1,"x":-8.872},{"p_w":true,"p_h":true,"l":"O","z":-17.246,"y":1.713,"x":-16.145},{"p_w":true,"p_h":true,"l":"H","z":-17.412,"y":0.797,"x":-15.906},{"p_w":true,"p_h":true,"l":"H","z":-16.308,"y":1.812,"x":-16.126},{"p_w":true,"p_h":true,"l":"O","z":-19.825,"y":29.017,"x":-22.739},{"p_w":true,"p_h":true,"l":"H","z":-19.736,"y":29.775,"x":-23.26},{"p_w":true,"p_h":true,"l":"H","z":-20.563,"y":28.505,"x":-23.102},{"p_w":true,"p_h":true,"l":"O","z":-0.547,"y":22.728,"x":-20.904},{"p_w":true,"p_h":true,"l":"H","z":-1.037,"y":23.033,"x":-20.129},{"p_w":true,"p_h":true,"l":"H","z":0.288,"y":22.427,"x":-20.535},{"p_w":true,"p_h":true,"l":"O","z":-14.408,"y":-2.224,"x":-15.656},{"p_w":true,"p_h":true,"l":"H","z":-13.888,"y":-1.419,"x":-15.522},{"p_w":true,"p_h":true,"l":"H","z":-14.654,"y":-2.158,"x":-16.593},{"p_w":true,"p_h":true,"l":"O","z":-17.029,"y":0.782,"x":-13.331},{"p_w":true,"p_h":true,"l":"H","z":-17.667,"y":0.088,"x":-13.513},{"p_w":true,"p_h":true,"l":"H","z":-17.344,"y":1.519,"x":-13.905},{"p_w":true,"p_h":true,"l":"O","z":-16.298,"y":11.572,"x":-27.752},{"p_w":true,"p_h":true,"l":"H","z":-15.574,"y":10.949,"x":-27.656},{"p_w":true,"p_h":true,"l":"H","z":-16.28,"y":12.081,"x":-26.949},{"p_w":true,"p_h":true,"l":"O","z":-8.325,"y":3.644,"x":-26.772},{"p_w":true,"p_h":true,"l":"H","z":-7.853,"y":4.487,"x":-26.743},{"p_w":true,"p_h":true,"l":"H","z":-8.621,"y":3.541,"x":-25.857},{"p_w":true,"p_h":true,"l":"O","z":-12.26,"y":0.019,"x":-3.504},{"p_w":true,"p_h":true,"l":"H","z":-11.309,"y":0.157,"x":-3.394},{"p_w":true,"p_h":true,"l":"H","z":-12.648,"y":0.703,"x":-2.953},{"p_w":true,"p_h":true,"l":"O","z":-19.386,"y":8.962,"x":2.419},{"p_w":true,"p_h":true,"l":"H","z":-18.455,"y":9.085,"x":2.545},{"p_w":true,"p_h":true,"l":"H","z":-19.525,"y":8.936,"x":1.472},{"p_w":true,"p_h":true,"l":"O","z":2.205,"y":-0.763,"x":-17.425},{"p_w":true,"p_h":true,"l":"H","z":2.531,"y":-0.338,"x":-16.629},{"p_w":true,"p_h":true,"l":"H","z":1.549,"y":-0.122,"x":-17.758},{"p_w":true,"p_h":true,"l":"O","z":-25.121,"y":21.85,"x":-10.702},{"p_w":true,"p_h":true,"l":"H","z":-25.375,"y":21.211,"x":-10.031},{"p_w":true,"p_h":true,"l":"H","z":-24.266,"y":21.512,"x":-11.015},{"p_w":true,"p_h":true,"l":"O","z":-20.032,"y":23.687,"x":-7.338},{"p_w":true,"p_h":true,"l":"H","z":-19.718,"y":23.42,"x":-6.476},{"p_w":true,"p_h":true,"l":"H","z":-20.773,"y":24.275,"x":-7.147},{"p_w":true,"p_h":true,"l":"O","z":-11.186,"y":26.659,"x":-3.988},{"p_w":true,"p_h":true,"l":"H","z":-10.361,"y":26.201,"x":-4.226},{"p_w":true,"p_h":true,"l":"H","z":-10.897,"y":27.351,"x":-3.384},{"p_w":true,"p_h":true,"l":"O","z":-12.816,"y":26.879,"x":-5.991},{"p_w":true,"p_h":true,"l":"H","z":-12.356,"y":26.022,"x":-5.982},{"p_w":true,"p_h":true,"l":"H","z":-12.409,"y":27.339,"x":-5.248},{"p_w":true,"p_h":true,"l":"O","z":7.059,"y":12.171,"x":-7.945},{"p_w":true,"p_h":true,"l":"H","z":6.594,"y":11.767,"x":-8.668},{"p_w":true,"p_h":true,"l":"H","z":6.769,"y":11.694,"x":-7.168},{"p_w":true,"p_h":true,"l":"O","z":-16.331,"y":20.734,"x":-1.503},{"p_w":true,"p_h":true,"l":"H","z":-16.97,"y":20.007,"x":-1.378},{"p_w":true,"p_h":true,"l":"H","z":-15.675,"y":20.581,"x":-0.842},{"p_w":true,"p_h":true,"l":"O","z":-0.426,"y":-4.972,"x":-13.832},{"p_w":true,"p_h":true,"l":"H","z":0.494,"y":-5.216,"x":-13.898},{"p_w":true,"p_h":true,"l":"H","z":-0.414,"y":-4.007,"x":-13.93},{"p_w":true,"p_h":true,"l":"O","z":-16.615,"y":-1.01,"x":-17.393},{"p_w":true,"p_h":true,"l":"H","z":-17.056,"y":-1.769,"x":-17.777},{"p_w":true,"p_h":true,"l":"H","z":-17.322,"y":-0.405,"x":-17.178},{"p_w":true,"p_h":true,"l":"O","z":-8.213,"y":-4.469,"x":-25.023},{"p_w":true,"p_h":true,"l":"H","z":-8.223,"y":-5.4,"x":-25.299},{"p_w":true,"p_h":true,"l":"H","z":-7.364,"y":-4.38,"x":-24.589},{"p_w":true,"p_h":true,"l":"O","z":-14.265,"y":12.654,"x":2.033},{"p_w":true,"p_h":true,"l":"H","z":-13.865,"y":12.795,"x":2.893},{"p_w":true,"p_h":true,"l":"H","z":-14.449,"y":11.718,"x":1.994},{"p_w":true,"p_h":true,"l":"O","z":-18.149,"y":17.167,"x":-23.137},{"p_w":true,"p_h":true,"l":"H","z":-18.594,"y":16.831,"x":-22.359},{"p_w":true,"p_h":true,"l":"H","z":-17.48,"y":16.473,"x":-23.324},{"p_w":true,"p_h":true,"l":"O","z":-22.027,"y":8.158,"x":-11.943},{"p_w":true,"p_h":true,"l":"H","z":-22.379,"y":7.53,"x":-11.315},{"p_w":true,"p_h":true,"l":"H","z":-21.574,"y":8.799,"x":-11.407},{"p_w":true,"p_h":true,"l":"O","z":-21.05,"y":7.096,"x":-4.786},{"p_w":true,"p_h":true,"l":"H","z":-20.543,"y":7.698,"x":-4.246},{"p_w":true,"p_h":true,"l":"H","z":-21.124,"y":7.524,"x":-5.645},{"p_w":true,"p_h":true,"l":"O","z":-20.623,"y":10.16,"x":-27.889},{"p_w":true,"p_h":true,"l":"H","z":-21.029,"y":10.61,"x":-27.164},{"p_w":true,"p_h":true,"l":"H","z":-19.788,"y":10.583,"x":-28.03},{"p_w":true,"p_h":true,"l":"O","z":-31.971,"y":21.379,"x":-22.608},{"p_w":true,"p_h":true,"l":"H","z":-32.557,"y":22.021,"x":-22.229},{"p_w":true,"p_h":true,"l":"H","z":-32.469,"y":20.931,"x":-23.282},{"p_w":true,"p_h":true,"l":"O","z":-10.511,"y":-2.935,"x":-14.773},{"p_w":true,"p_h":true,"l":"H","z":-10.466,"y":-2.631,"x":-15.678},{"p_w":true,"p_h":true,"l":"H","z":-11.051,"y":-2.264,"x":-14.336},{"p_w":true,"p_h":true,"l":"O","z":-22.638,"y":24.712,"x":-19.645},{"p_w":true,"p_h":true,"l":"H","z":-21.698,"y":24.655,"x":-19.569},{"p_w":true,"p_h":true,"l":"H","z":-22.999,"y":24.217,"x":-18.914},{"p_w":true,"p_h":true,"l":"O","z":-9.809,"y":1.605,"x":-14.295},{"p_w":true,"p_h":true,"l":"H","z":-9.456,"y":0.862,"x":-13.792},{"p_w":true,"p_h":true,"l":"H","z":-10.597,"y":1.874,"x":-13.839},{"p_w":true,"p_h":true,"l":"O","z":-24.479,"y":4.164,"x":-16.019},{"p_w":true,"p_h":true,"l":"H","z":-24.93,"y":3.591,"x":-15.385},{"p_w":true,"p_h":true,"l":"H","z":-25.125,"y":4.824,"x":-16.25},{"p_w":true,"p_h":true,"l":"O","z":-17.449,"y":1.373,"x":-9.262},{"p_w":true,"p_h":true,"l":"H","z":-16.504,"y":1.384,"x":-9.244},{"p_w":true,"p_h":true,"l":"H","z":-17.7,"y":1.929,"x":-10.008},{"p_w":true,"p_h":true,"l":"O","z":-18.013,"y":23.595,"x":-22.136},{"p_w":true,"p_h":true,"l":"H","z":-17.16,"y":23.976,"x":-22.364},{"p_w":true,"p_h":true,"l":"H","z":-17.98,"y":22.714,"x":-22.577},{"p_w":true,"p_h":true,"l":"O","z":-25.048,"y":3.291,"x":-18.691},{"p_w":true,"p_h":true,"l":"H","z":-24.164,"y":3.24,"x":-19.064},{"p_w":true,"p_h":true,"l":"H","z":-24.876,"y":3.122,"x":-17.744},{"p_w":true,"p_h":true,"l":"O","z":-10.551,"y":19.589,"x":-1.796},{"p_w":true,"p_h":true,"l":"H","z":-10.067,"y":19.747,"x":-2.616},{"p_w":true,"p_h":true,"l":"H","z":-9.867,"y":19.516,"x":-1.125},{"p_w":true,"p_h":true,"l":"O","z":-20.891,"y":1.945,"x":-21.732},{"p_w":true,"p_h":true,"l":"H","z":-20.455,"y":2.738,"x":-22.028},{"p_w":true,"p_h":true,"l":"H","z":-20.743,"y":1.946,"x":-20.773},{"p_w":true,"p_h":true,"l":"O","z":-28.431,"y":16.923,"x":-23.533},{"p_w":true,"p_h":true,"l":"H","z":-27.808,"y":16.21,"x":-23.694},{"p_w":true,"p_h":true,"l":"H","z":-27.914,"y":17.569,"x":-23.035},{"p_w":true,"p_h":true,"l":"O","z":-13.182,"y":20.963,"x":-25.83},{"p_w":true,"p_h":true,"l":"H","z":-12.827,"y":20.617,"x":-24.992},{"p_w":true,"p_h":true,"l":"H","z":-12.355,"y":21.21,"x":-26.291},{"p_w":true,"p_h":true,"l":"O","z":-27.631,"y":2.013,"x":-18.259},{"p_w":true,"p_h":true,"l":"H","z":-26.762,"y":2.06,"x":-17.843},{"p_w":true,"p_h":true,"l":"H","z":-28.24,"y":2.279,"x":-17.584},{"p_w":true,"p_h":true,"l":"O","z":9.075,"y":22.077,"x":-9.888},{"p_w":true,"p_h":true,"l":"H","z":9.121,"y":22.178,"x":-8.937},{"p_w":true,"p_h":true,"l":"H","z":9.855,"y":21.591,"x":-10.123},{"p_w":true,"p_h":true,"l":"O","z":-12.338,"y":23.498,"x":1.513},{"p_w":true,"p_h":true,"l":"H","z":-11.387,"y":23.532,"x":1.719},{"p_w":true,"p_h":true,"l":"H","z":-12.748,"y":23.399,"x":2.369},{"p_w":true,"p_h":true,"l":"O","z":-11.221,"y":19.144,"x":-26.979},{"p_w":true,"p_h":true,"l":"H","z":-11.982,"y":19.06,"x":-27.554},{"p_w":true,"p_h":true,"l":"H","z":-10.718,"y":18.348,"x":-27.12},{"p_w":true,"p_h":true,"l":"O","z":-4.637,"y":27.389,"x":-20.104},{"p_w":true,"p_h":true,"l":"H","z":-3.821,"y":27.369,"x":-20.614},{"p_w":true,"p_h":true,"l":"H","z":-4.928,"y":26.467,"x":-20.119},{"p_w":true,"p_h":true,"l":"O","z":-12.356,"y":20.857,"x":0.211},{"p_w":true,"p_h":true,"l":"H","z":-13.019,"y":20.167,"x":0.238},{"p_w":true,"p_h":true,"l":"H","z":-12.708,"y":21.503,"x":-0.402},{"p_w":true,"p_h":true,"l":"O","z":-20.006,"y":0.065,"x":-19.733},{"p_w":true,"p_h":true,"l":"H","z":-20.637,"y":0.374,"x":-19.067},{"p_w":true,"p_h":true,"l":"H","z":-19.152,"y":0.329,"x":-19.386},{"p_w":true,"p_h":true,"l":"O","z":-12.686,"y":20.613,"x":-30.646},{"p_w":true,"p_h":true,"l":"H","z":-13.593,"y":20.323,"x":-30.658},{"p_w":true,"p_h":true,"l":"H","z":-12.441,"y":20.635,"x":-29.729},{"p_w":true,"p_h":true,"l":"O","z":-21.871,"y":-0.915,"x":-22.387},{"p_w":true,"p_h":true,"l":"H","z":-21.634,"y":-0.512,"x":-21.54},{"p_w":true,"p_h":true,"l":"H","z":-22.589,"y":-0.368,"x":-22.704},{"p_w":true,"p_h":true,"l":"O","z":-11.677,"y":23.4,"x":-31.518},{"p_w":true,"p_h":true,"l":"H","z":-11.612,"y":24.305,"x":-31.799},{"p_w":true,"p_h":true,"l":"H","z":-11.936,"y":22.914,"x":-32.309},{"p_w":true,"p_h":true,"l":"O","z":-19.801,"y":19.932,"x":-24.971},{"p_w":true,"p_h":true,"l":"H","z":-19.373,"y":19.993,"x":-25.828},{"p_w":true,"p_h":true,"l":"H","z":-20.08,"y":19.022,"x":-24.909},{"p_w":true,"p_h":true,"l":"O","z":-8.768,"y":22.104,"x":3.674},{"p_w":true,"p_h":true,"l":"H","z":-8.34,"y":21.272,"x":3.892},{"p_w":true,"p_h":true,"l":"H","z":-9.027,"y":22.461,"x":4.513},{"p_w":true,"p_h":true,"l":"O","z":-23.977,"y":22.642,"x":-8.18},{"p_w":true,"p_h":true,"l":"H","z":-23.989,"y":22.363,"x":-7.266},{"p_w":true,"p_h":true,"l":"H","z":-23.447,"y":22.024,"x":-8.645},{"p_w":true,"p_h":true,"l":"O","z":-17.15,"y":14.182,"x":-32.889},{"p_w":true,"p_h":true,"l":"H","z":-16.948,"y":13.553,"x":-33.584},{"p_w":true,"p_h":true,"l":"H","z":-17.094,"y":13.666,"x":-32.084},{"p_w":true,"p_h":true,"l":"O","z":-23.019,"y":7.966,"x":-17.032},{"p_w":true,"p_h":true,"l":"H","z":-22.804,"y":7.837,"x":-17.95},{"p_w":true,"p_h":true,"l":"H","z":-22.359,"y":8.568,"x":-16.698},{"p_w":true,"p_h":true,"l":"O","z":-3.002,"y":-6.039,"x":-15.728},{"p_w":true,"p_h":true,"l":"H","z":-3.303,"y":-6.901,"x":-15.982},{"p_w":true,"p_h":true,"l":"H","z":-2.983,"y":-6.042,"x":-14.776},{"p_w":true,"p_h":true,"l":"O","z":-8.333,"y":-0.726,"x":-14.589},{"p_w":true,"p_h":true,"l":"H","z":-7.856,"y":-0.269,"x":-15.284},{"p_w":true,"p_h":true,"l":"H","z":-7.617,"y":-1.156,"x":-14.085},{"p_w":true,"p_h":true,"l":"O","z":2.186,"y":-3.101,"x":-6.528},{"p_w":true,"p_h":true,"l":"H","z":2.28,"y":-2.159,"x":-6.463},{"p_w":true,"p_h":true,"l":"H","z":2.132,"y":-3.405,"x":-5.618},{"p_w":true,"p_h":true,"l":"O","z":-10.028,"y":0.196,"x":-11.37},{"p_w":true,"p_h":true,"l":"H","z":-9.364,"y":0.883,"x":-11.42},{"p_w":true,"p_h":true,"l":"H","z":-10.819,"y":0.591,"x":-11.734},{"p_w":true,"p_h":true,"l":"O","z":9.542,"y":19.916,"x":-15.96},{"p_w":true,"p_h":true,"l":"H","z":8.703,"y":19.585,"x":-15.644},{"p_w":true,"p_h":true,"l":"H","z":10.205,"y":19.449,"x":-15.478},{"p_w":true,"p_h":true,"l":"O","z":-17.702,"y":3.331,"x":13.035},{"p_w":true,"p_h":true,"l":"H","z":-17.396,"y":2.908,"x":12.239},{"p_w":true,"p_h":true,"l":"H","z":-17.862,"y":4.229,"x":12.817},{"p_w":true,"p_h":true,"l":"O","z":-3.595,"y":-0.093,"x":-24.07},{"p_w":true,"p_h":true,"l":"H","z":-4.382,"y":-0.503,"x":-23.686},{"p_w":true,"p_h":true,"l":"H","z":-3.915,"y":0.689,"x":-24.504},{"p_w":true,"p_h":true,"l":"O","z":-3.935,"y":31.051,"x":-1.041},{"p_w":true,"p_h":true,"l":"H","z":-3.881,"y":30.547,"x":-1.872},{"p_w":true,"p_h":true,"l":"H","z":-4.836,"y":31.354,"x":-1.025},{"p_w":true,"p_h":true,"l":"O","z":2.869,"y":25.765,"x":-0.936},{"p_w":true,"p_h":true,"l":"H","z":3.158,"y":25.882,"x":-1.844},{"p_w":true,"p_h":true,"l":"H","z":3.597,"y":26.1,"x":-0.41},{"p_w":true,"p_h":true,"l":"O","z":5.829,"y":11.32,"x":-15.746},{"p_w":true,"p_h":true,"l":"H","z":6.158,"y":10.55,"x":-15.281},{"p_w":true,"p_h":true,"l":"H","z":5.95,"y":12.041,"x":-15.116},{"p_w":true,"p_h":true,"l":"O","z":5.176,"y":2.717,"x":-9.72},{"p_w":true,"p_h":true,"l":"H","z":4.915,"y":1.948,"x":-10.207},{"p_w":true,"p_h":true,"l":"H","z":5.052,"y":2.489,"x":-8.806},{"p_w":true,"p_h":true,"l":"O","z":-5.915,"y":9.301,"x":-9.105},{"p_w":true,"p_h":true,"l":"H","z":-6.295,"y":9.925,"x":-8.489},{"p_w":true,"p_h":true,"l":"H","z":-6.274,"y":8.437,"x":-8.815},{"p_w":true,"p_h":true,"l":"O","z":-2.372,"y":26.321,"x":-4.975},{"p_w":true,"p_h":true,"l":"H","z":-3.158,"y":26.114,"x":-4.479},{"p_w":true,"p_h":true,"l":"H","z":-2.377,"y":27.273,"x":-5.08},{"p_w":true,"p_h":true,"l":"O","z":-2.58,"y":12.743,"x":5.249},{"p_w":true,"p_h":true,"l":"H","z":-2.031,"y":12.406,"x":5.935},{"p_w":true,"p_h":true,"l":"H","z":-2.263,"y":13.626,"x":5.064},{"p_w":true,"p_h":true,"l":"O","z":-18.766,"y":25.508,"x":-5.721},{"p_w":true,"p_h":true,"l":"H","z":-19.177,"y":24.893,"x":-5.125},{"p_w":true,"p_h":true,"l":"H","z":-19.198,"y":26.353,"x":-5.492},{"p_w":true,"p_h":true,"l":"O","z":-3.922,"y":27.318,"x":-7.447},{"p_w":true,"p_h":true,"l":"H","z":-3.581,"y":27.308,"x":-8.341},{"p_w":true,"p_h":true,"l":"H","z":-3.302,"y":27.862,"x":-6.964},{"p_w":true,"p_h":true,"l":"O","z":-7.893,"y":6.41,"x":-1.266},{"p_w":true,"p_h":true,"l":"H","z":-7.275,"y":5.759,"x":-1.651},{"p_w":true,"p_h":true,"l":"H","z":-7.879,"y":6.24,"x":-0.347},{"p_w":true,"p_h":true,"l":"O","z":-11.357,"y":-3.126,"x":5.585},{"p_w":true,"p_h":true,"l":"H","z":-11.354,"y":-3.952,"x":6.082},{"p_w":true,"p_h":true,"l":"H","z":-10.784,"y":-3.327,"x":4.837},{"p_w":true,"p_h":true,"l":"O","z":-16.115,"y":3.823,"x":4.418},{"p_w":true,"p_h":true,"l":"H","z":-16.974,"y":3.998,"x":4.007},{"p_w":true,"p_h":true,"l":"H","z":-15.521,"y":3.712,"x":3.693},{"p_w":true,"p_h":true,"l":"O","z":-17.427,"y":2.39,"x":9.232},{"p_w":true,"p_h":true,"l":"H","z":-17.665,"y":1.926,"x":10},{"p_w":true,"p_h":true,"l":"H","z":-17.527,"y":3.33,"x":9.447},{"p_w":true,"p_h":true,"l":"O","z":2.309,"y":-3.653,"x":-9.182},{"p_w":true,"p_h":true,"l":"H","z":1.542,"y":-3.605,"x":-8.633},{"p_w":true,"p_h":true,"l":"H","z":2.043,"y":-3.45,"x":-10.063},{"p_w":true,"p_h":true,"l":"O","z":2.368,"y":9.941,"x":2.762},{"p_w":true,"p_h":true,"l":"H","z":2.618,"y":9.065,"x":2.996},{"p_w":true,"p_h":true,"l":"H","z":3.155,"y":10.474,"x":2.832},{"p_w":true,"p_h":true,"l":"O","z":-15.596,"y":-3.39,"x":6.171},{"p_w":true,"p_h":true,"l":"H","z":-15.423,"y":-3.384,"x":7.125},{"p_w":true,"p_h":true,"l":"H","z":-16.319,"y":-3.989,"x":6.063},{"p_w":true,"p_h":true,"l":"O","z":-24.286,"y":19.121,"x":-10.252},{"p_w":true,"p_h":true,"l":"H","z":-23.859,"y":19.31,"x":-9.41},{"p_w":true,"p_h":true,"l":"H","z":-24.437,"y":18.168,"x":-10.218},{"p_w":true,"p_h":true,"l":"O","z":-17.114,"y":0.109,"x":-2.41},{"p_w":true,"p_h":true,"l":"H","z":-16.672,"y":-0.317,"x":-3.142},{"p_w":true,"p_h":true,"l":"H","z":-17.952,"y":-0.343,"x":-2.329},{"p_w":true,"p_h":true,"l":"O","z":-10.766,"y":18.029,"x":-31.341},{"p_w":true,"p_h":true,"l":"H","z":-10.504,"y":18.026,"x":-30.422},{"p_w":true,"p_h":true,"l":"H","z":-10.456,"y":17.226,"x":-31.704},{"p_w":true,"p_h":true,"l":"O","z":-9.169,"y":5.918,"x":-25.692},{"p_w":true,"p_h":true,"l":"H","z":-9.614,"y":6.768,"x":-25.786},{"p_w":true,"p_h":true,"l":"H","z":-8.74,"y":5.955,"x":-24.845},{"p_w":true,"p_h":true,"l":"O","z":-26.258,"y":17.901,"x":-26.682},{"p_w":true,"p_h":true,"l":"H","z":-26.135,"y":18.3,"x":-25.819},{"p_w":true,"p_h":true,"l":"H","z":-25.398,"y":17.599,"x":-26.944},{"p_w":true,"p_h":true,"l":"O","z":-10.265,"y":33.983,"x":-10.292},{"p_w":true,"p_h":true,"l":"H","z":-10.075,"y":34.828,"x":-9.882},{"p_w":true,"p_h":true,"l":"H","z":-11.064,"y":34.146,"x":-10.804},{"p_w":true,"p_h":true,"l":"O","z":-7.991,"y":16.381,"x":-3.034},{"p_w":true,"p_h":true,"l":"H","z":-8.71,"y":16.761,"x":-2.508},{"p_w":true,"p_h":true,"l":"H","z":-7.269,"y":16.297,"x":-2.396},{"p_w":true,"p_h":true,"l":"O","z":4.533,"y":18.568,"x":-4.076},{"p_w":true,"p_h":true,"l":"H","z":3.795,"y":18.07,"x":-3.684},{"p_w":true,"p_h":true,"l":"H","z":4.41,"y":19.448,"x":-3.728},{"p_w":true,"p_h":true,"l":"O","z":-8.798,"y":3.55,"x":-2.687},{"p_w":true,"p_h":true,"l":"H","z":-9.733,"y":3.443,"x":-2.859},{"p_w":true,"p_h":true,"l":"H","z":-8.762,"y":3.9,"x":-1.798},{"p_w":true,"p_h":true,"l":"O","z":-19.271,"y":12.86,"x":-29.405},{"p_w":true,"p_h":true,"l":"H","z":-18.603,"y":12.165,"x":-29.325},{"p_w":true,"p_h":true,"l":"H","z":-19.704,"y":12.661,"x":-30.244},{"p_w":true,"p_h":true,"l":"O","z":-8.012,"y":16.566,"x":-0.063},{"p_w":true,"p_h":true,"l":"H","z":-7.736,"y":16.716,"x":0.858},{"p_w":true,"p_h":true,"l":"H","z":-7.528,"y":17.236,"x":-0.54},{"p_w":true,"p_h":true,"l":"O","z":-27.637,"y":6.802,"x":-15.09},{"p_w":true,"p_h":true,"l":"H","z":-26.75,"y":6.547,"x":-15.381},{"p_w":true,"p_h":true,"l":"H","z":-27.762,"y":7.671,"x":-15.444},{"p_w":true,"p_h":true,"l":"O","z":-16.093,"y":2.486,"x":-5.553},{"p_w":true,"p_h":true,"l":"H","z":-16.742,"y":2.726,"x":-6.229},{"p_w":true,"p_h":true,"l":"H","z":-16.505,"y":2.691,"x":-4.733},{"p_w":true,"p_h":true,"l":"O","z":-20.461,"y":-0.34,"x":-17.015},{"p_w":true,"p_h":true,"l":"H","z":-19.569,"y":-0.039,"x":-17.152},{"p_w":true,"p_h":true,"l":"H","z":-20.491,"y":-1.234,"x":-17.336},{"p_w":true,"p_h":true,"l":"O","z":-8.384,"y":-0.859,"x":5.627},{"p_w":true,"p_h":true,"l":"H","z":-8.985,"y":-1.189,"x":6.285},{"p_w":true,"p_h":true,"l":"H","z":-8.934,"y":-0.503,"x":4.932},{"p_w":true,"p_h":true,"l":"O","z":-4.662,"y":10.568,"x":-23.002},{"p_w":true,"p_h":true,"l":"H","z":-5.617,"y":10.707,"x":-22.874},{"p_w":true,"p_h":true,"l":"H","z":-4.315,"y":11.466,"x":-22.958},{"p_w":true,"p_h":true,"l":"O","z":-13.908,"y":2.449,"x":8.709},{"p_w":true,"p_h":true,"l":"H","z":-14.403,"y":2.886,"x":7.992},{"p_w":true,"p_h":true,"l":"H","z":-13.032,"y":2.331,"x":8.341},{"p_w":true,"p_h":true,"l":"O","z":-18.036,"y":1.285,"x":-21.776},{"p_w":true,"p_h":true,"l":"H","z":-18.062,"y":1.665,"x":-20.906},{"p_w":true,"p_h":true,"l":"H","z":-18.822,"y":0.722,"x":-21.821},{"p_w":true,"p_h":true,"l":"O","z":-13.731,"y":0.781,"x":10.847},{"p_w":true,"p_h":true,"l":"H","z":-13.604,"y":1.717,"x":10.645},{"p_w":true,"p_h":true,"l":"H","z":-13.599,"y":0.35,"x":10.005},{"p_w":true,"p_h":true,"l":"O","z":-5.182,"y":14.78,"x":-0.386},{"p_w":true,"p_h":true,"l":"H","z":-5.55,"y":14.034,"x":0.15},{"p_w":true,"p_h":true,"l":"H","z":-5.477,"y":14.576,"x":-1.268},{"p_w":true,"p_h":true,"l":"O","z":-2.945,"y":12.792,"x":2.387},{"p_w":true,"p_h":true,"l":"H","z":-3.413,"y":11.939,"x":2.279},{"p_w":true,"p_h":true,"l":"H","z":-3.693,"y":13.418,"x":2.314},{"p_w":true,"p_h":true,"l":"O","z":-3.058,"y":11.057,"x":-26.974},{"p_w":true,"p_h":true,"l":"H","z":-2.94,"y":10.077,"x":-26.893},{"p_w":true,"p_h":true,"l":"H","z":-3.381,"y":11.294,"x":-26.109},{"p_w":true,"p_h":true,"l":"O","z":-5.595,"y":12.183,"x":-25.056},{"p_w":true,"p_h":true,"l":"H","z":-5.07,"y":12.124,"x":-25.841},{"p_w":true,"p_h":true,"l":"H","z":-5.952,"y":11.263,"x":-24.982},{"p_w":true,"p_h":true,"l":"O","z":-20.37,"y":5.279,"x":-1.971},{"p_w":true,"p_h":true,"l":"H","z":-21.088,"y":5.82,"x":-2.313},{"p_w":true,"p_h":true,"l":"H","z":-20.663,"y":4.38,"x":-2.136},{"p_w":true,"p_h":true,"l":"O","z":13.524,"y":16.4,"x":-21.154},{"p_w":true,"p_h":true,"l":"H","z":13.754,"y":15.5,"x":-20.914},{"p_w":true,"p_h":true,"l":"H","z":13.205,"y":16.784,"x":-20.332},{"p_w":true,"p_h":true,"l":"O","z":-2.559,"y":8.157,"x":-26.513},{"p_w":true,"p_h":true,"l":"H","z":-1.964,"y":8.069,"x":-25.743},{"p_w":true,"p_h":true,"l":"H","z":-3.395,"y":7.842,"x":-26.171},{"p_w":true,"p_h":true,"l":"O","z":-22.867,"y":3.487,"x":-20.631},{"p_w":true,"p_h":true,"l":"H","z":-23.826,"y":3.639,"x":-20.583},{"p_w":true,"p_h":true,"l":"H","z":-22.686,"y":3.651,"x":-21.566},{"p_w":true,"p_h":true,"l":"O","z":-26.159,"y":5.871,"x":-18.049},{"p_w":true,"p_h":true,"l":"H","z":-25.89,"y":6.786,"x":-17.977},{"p_w":true,"p_h":true,"l":"H","z":-26.999,"y":5.925,"x":-18.547},{"p_w":true,"p_h":true,"l":"O","z":-20.577,"y":29.1,"x":-12.834},{"p_w":true,"p_h":true,"l":"H","z":-19.66,"y":28.812,"x":-12.998},{"p_w":true,"p_h":true,"l":"H","z":-20.454,"y":29.861,"x":-12.258},{"p_w":true,"p_h":true,"l":"O","z":-10.397,"y":31.281,"x":-9.24},{"p_w":true,"p_h":true,"l":"H","z":-10.012,"y":31.83,"x":-8.544},{"p_w":true,"p_h":true,"l":"H","z":-11.301,"y":31.536,"x":-9.279},{"p_w":true,"p_h":true,"l":"O","z":4.246,"y":14.917,"x":-0.418},{"p_w":true,"p_h":true,"l":"H","z":3.759,"y":14.515,"x":0.272},{"p_w":true,"p_h":true,"l":"H","z":3.83,"y":14.575,"x":-1.254},{"p_w":true,"p_h":true,"l":"O","z":-20.865,"y":5.061,"x":-10.683},{"p_w":true,"p_h":true,"l":"H","z":-20.405,"y":5.555,"x":-11.363},{"p_w":true,"p_h":true,"l":"H","z":-20.953,"y":4.178,"x":-11.059},{"p_w":true,"p_h":true,"l":"O","z":-8.788,"y":28.285,"x":-26.724},{"p_w":true,"p_h":true,"l":"H","z":-8.489,"y":29.166,"x":-26.88},{"p_w":true,"p_h":true,"l":"H","z":-9.595,"y":28.392,"x":-26.196},{"p_w":true,"p_h":true,"l":"O","z":0.968,"y":12.053,"x":5.237},{"p_w":true,"p_h":true,"l":"H","z":0.619,"y":12.427,"x":4.413},{"p_w":true,"p_h":true,"l":"H","z":0.23,"y":12.094,"x":5.833},{"p_w":true,"p_h":true,"l":"O","z":-2.762,"y":-1.484,"x":-5.668},{"p_w":true,"p_h":true,"l":"H","z":-2.653,"y":-0.589,"x":-6.033},{"p_w":true,"p_h":true,"l":"H","z":-3.114,"y":-1.985,"x":-6.385},{"p_w":true,"p_h":true,"l":"O","z":7.968,"y":19.441,"x":-11.591},{"p_w":true,"p_h":true,"l":"H","z":8.061,"y":18.611,"x":-12.072},{"p_w":true,"p_h":true,"l":"H","z":8.773,"y":19.548,"x":-11.114},{"p_w":true,"p_h":true,"l":"O","z":-9.851,"y":-4.552,"x":3.591},{"p_w":true,"p_h":true,"l":"H","z":-9.998,"y":-3.65,"x":3.313},{"p_w":true,"p_h":true,"l":"H","z":-9.302,"y":-4.929,"x":2.9},{"p_w":true,"p_h":true,"l":"O","z":-21.299,"y":5.475,"x":-19.948},{"p_w":true,"p_h":true,"l":"H","z":-20.797,"y":6.238,"x":-20.179},{"p_w":true,"p_h":true,"l":"H","z":-22.072,"y":5.492,"x":-20.523},{"p_w":true,"p_h":true,"l":"O","z":-8.253,"y":8.597,"x":-26.393},{"p_w":true,"p_h":true,"l":"H","z":-8.122,"y":8.527,"x":-27.346},{"p_w":true,"p_h":true,"l":"H","z":-7.987,"y":7.743,"x":-26.06},{"p_w":true,"p_h":true,"l":"O","z":-6.868,"y":-7.401,"x":-25.835},{"p_w":true,"p_h":true,"l":"H","z":-6.05,"y":-7.763,"x":-25.503},{"p_w":true,"p_h":true,"l":"H","z":-7.247,"y":-8.136,"x":-26.351},{"p_w":true,"p_h":true,"l":"O","z":-0.219,"y":14.746,"x":-31.07},{"p_w":true,"p_h":true,"l":"H","z":-0.991,"y":15.197,"x":-30.675},{"p_w":true,"p_h":true,"l":"H","z":0.253,"y":14.39,"x":-30.333},{"p_w":true,"p_h":true,"l":"O","z":-24.223,"y":4.03,"x":-22.812},{"p_w":true,"p_h":true,"l":"H","z":-24.257,"y":4.993,"x":-22.82},{"p_w":true,"p_h":true,"l":"H","z":-25.179,"y":3.797,"x":-22.819},{"p_w":true,"p_h":true,"l":"O","z":5.832,"y":9.726,"x":-18.398},{"p_w":true,"p_h":true,"l":"H","z":6.277,"y":10.28,"x":-17.764},{"p_w":true,"p_h":true,"l":"H","z":6.169,"y":8.848,"x":-18.257},{"p_w":true,"p_h":true,"l":"O","z":-1.2,"y":14.557,"x":-23.469},{"p_w":true,"p_h":true,"l":"H","z":-0.346,"y":14.172,"x":-23.12},{"p_w":true,"p_h":true,"l":"H","z":-1.326,"y":14.04,"x":-24.248},{"p_w":true,"p_h":true,"l":"O","z":-18.242,"y":20.82,"x":-21.454},{"p_w":true,"p_h":true,"l":"H","z":-19.022,"y":21.311,"x":-21.217},{"p_w":true,"p_h":true,"l":"H","z":-18.404,"y":19.933,"x":-21.12},{"p_w":true,"p_h":true,"l":"O","z":-0.663,"y":12.449,"x":-25.379},{"p_w":true,"p_h":true,"l":"H","z":-1.387,"y":12.714,"x":-25.884},{"p_w":true,"p_h":true,"l":"H","z":-0.323,"y":11.647,"x":-25.829},{"p_w":true,"p_h":true,"l":"O","z":-23.933,"y":27.015,"x":-20.442},{"p_w":true,"p_h":true,"l":"H","z":-24.638,"y":26.377,"x":-20.349},{"p_w":true,"p_h":true,"l":"H","z":-24.04,"y":27.338,"x":-21.351},{"p_w":true,"p_h":true,"l":"O","z":1.436,"y":20.652,"x":-20.478},{"p_w":true,"p_h":true,"l":"H","z":1.351,"y":20.896,"x":-21.394},{"p_w":true,"p_h":true,"l":"H","z":1.954,"y":19.834,"x":-20.497},{"p_w":true,"p_h":true,"l":"O","z":-11.857,"y":21.403,"x":-33.757},{"p_w":true,"p_h":true,"l":"H","z":-11.844,"y":22.347,"x":-33.758},{"p_w":true,"p_h":true,"l":"H","z":-12.774,"y":21.156,"x":-33.748},{"p_w":true,"p_h":true,"l":"O","z":-2.133,"y":5.63,"x":-24.674},{"p_w":true,"p_h":true,"l":"H","z":-2.716,"y":5.852,"x":-23.939},{"p_w":true,"p_h":true,"l":"H","z":-1.897,"y":4.709,"x":-24.499},{"p_w":true,"p_h":true,"l":"O","z":-23.751,"y":7.413,"x":-4.79},{"p_w":true,"p_h":true,"l":"H","z":-23.744,"y":7.188,"x":-3.858},{"p_w":true,"p_h":true,"l":"H","z":-22.9,"y":7.855,"x":-4.912},{"p_w":true,"p_h":true,"l":"O","z":-14.805,"y":19.173,"x":1.171},{"p_w":true,"p_h":true,"l":"H","z":-15.39,"y":19.787,"x":0.752},{"p_w":true,"p_h":true,"l":"H","z":-14.308,"y":19.694,"x":1.806},{"p_w":true,"p_h":true,"l":"O","z":-13.165,"y":30.062,"x":-21.779},{"p_w":true,"p_h":true,"l":"H","z":-12.88,"y":29.305,"x":-21.252},{"p_w":true,"p_h":true,"l":"H","z":-13.14,"y":30.796,"x":-21.176},{"p_w":true,"p_h":true,"l":"O","z":33.809,"y":9.32,"x":-4.964},{"p_w":true,"p_h":true,"l":"H","z":34.003,"y":10.155,"x":-5.398},{"p_w":true,"p_h":true,"l":"H","z":34.34,"y":9.342,"x":-4.168},{"p_w":true,"p_h":true,"l":"O","z":34.041,"y":4.694,"x":0.155},{"p_w":true,"p_h":true,"l":"H","z":34.928,"y":4.562,"x":-0.187},{"p_w":true,"p_h":true,"l":"H","z":33.753,"y":3.866,"x":0.474},{"p_w":true,"p_h":true,"l":"O","z":12.598,"y":-16.364,"x":2.053},{"p_w":true,"p_h":true,"l":"H","z":12.202,"y":-15.527,"x":1.793},{"p_w":true,"p_h":true,"l":"H","z":13.247,"y":-16.539,"x":1.375},{"p_w":true,"p_h":true,"l":"O","z":18.403,"y":0.612,"x":11.479},{"p_w":true,"p_h":true,"l":"H","z":17.732,"y":-0.108,"x":11.35},{"p_w":true,"p_h":true,"l":"H","z":17.943,"y":1.406,"x":11.385},{"p_w":true,"p_h":true,"l":"O","z":6.428,"y":-7.372,"x":-8.591},{"p_w":true,"p_h":true,"l":"H","z":7.385,"y":-7.292,"x":-8.647},{"p_w":true,"p_h":true,"l":"H","z":6.246,"y":-7.34,"x":-7.658},{"p_w":true,"p_h":true,"l":"O","z":9.599,"y":1.255,"x":-16.979},{"p_w":true,"p_h":true,"l":"H","z":9.785,"y":0.317,"x":-16.858},{"p_w":true,"p_h":true,"l":"H","z":9.885,"y":1.454,"x":-17.867},{"p_w":true,"p_h":true,"l":"O","z":36.531,"y":2.57,"x":-5.264},{"p_w":true,"p_h":true,"l":"H","z":36.721,"y":2.005,"x":-6.003},{"p_w":true,"p_h":true,"l":"H","z":36.245,"y":3.411,"x":-5.669},{"p_w":true,"p_h":true,"l":"O","z":38.642,"y":-1.299,"x":-4.079},{"p_w":true,"p_h":true,"l":"H","z":38.569,"y":-1.792,"x":-4.906},{"p_w":true,"p_h":true,"l":"H","z":38.934,"y":-1.95,"x":-3.442},{"p_w":true,"p_h":true,"l":"O","z":5.313,"y":12.839,"x":1.053},{"p_w":true,"p_h":true,"l":"H","z":5.698,"y":13.321,"x":0.332},{"p_w":true,"p_h":true,"l":"H","z":4.38,"y":13.059,"x":1.036},{"p_w":true,"p_h":true,"l":"O","z":34.549,"y":2.966,"x":-3.357},{"p_w":true,"p_h":true,"l":"H","z":34.61,"y":2.335,"x":-2.666},{"p_w":true,"p_h":true,"l":"H","z":35.19,"y":2.68,"x":-4.02},{"p_w":true,"p_h":true,"l":"O","z":39.6,"y":1.001,"x":-2.122},{"p_w":true,"p_h":true,"l":"H","z":38.671,"y":1.125,"x":-2.222},{"p_w":true,"p_h":true,"l":"H","z":39.722,"y":0.422,"x":-1.382},{"p_w":true,"p_h":true,"l":"O","z":36.095,"y":1.895,"x":-1.026},{"p_w":true,"p_h":true,"l":"H","z":35.142,"y":1.763,"x":-1.044},{"p_w":true,"p_h":true,"l":"H","z":36.427,"y":1.115,"x":-0.595},{"p_w":true,"p_h":true,"l":"O","z":10.943,"y":7.279,"x":-13.617},{"p_w":true,"p_h":true,"l":"H","z":11.371,"y":7.988,"x":-14.085},{"p_w":true,"p_h":true,"l":"H","z":11.141,"y":7.425,"x":-12.699},{"p_w":true,"p_h":true,"l":"O","z":13.27,"y":7.662,"x":-22.152},{"p_w":true,"p_h":true,"l":"H","z":13.021,"y":6.764,"x":-21.977},{"p_w":true,"p_h":true,"l":"H","z":14.227,"y":7.657,"x":-22.201},{"p_w":true,"p_h":true,"l":"O","z":13.018,"y":0.78,"x":7.763},{"p_w":true,"p_h":true,"l":"H","z":12.75,"y":0.739,"x":8.68},{"p_w":true,"p_h":true,"l":"H","z":12.381,"y":0.24,"x":7.299},{"p_w":true,"p_h":true,"l":"O","z":14.144,"y":8.108,"x":9.17},{"p_w":true,"p_h":true,"l":"H","z":14.667,"y":7.889,"x":8.404},{"p_w":true,"p_h":true,"l":"H","z":14.545,"y":7.636,"x":9.896},{"p_w":true,"p_h":true,"l":"O","z":16.825,"y":-9.992,"x":-7.904},{"p_w":true,"p_h":true,"l":"H","z":16.92,"y":-9.216,"x":-7.356},{"p_w":true,"p_h":true,"l":"H","z":16.22,"y":-10.556,"x":-7.463},{"p_w":true,"p_h":true,"l":"O","z":12.675,"y":4.053,"x":7.546},{"p_w":true,"p_h":true,"l":"H","z":13.502,"y":3.805,"x":7.079},{"p_w":true,"p_h":true,"l":"H","z":12.127,"y":4.378,"x":6.831},{"p_w":true,"p_h":true,"l":"O","z":11.045,"y":18.005,"x":-10.377},{"p_w":true,"p_h":true,"l":"H","z":10.244,"y":18.461,"x":-10.568},{"p_w":true,"p_h":true,"l":"H","z":10.807,"y":17.084,"x":-10.285},{"p_w":true,"p_h":true,"l":"O","z":20.804,"y":-11.956,"x":5.233},{"p_w":true,"p_h":true,"l":"H","z":21.488,"y":-12.396,"x":5.765},{"p_w":true,"p_h":true,"l":"H","z":21.307,"y":-11.301,"x":4.733},{"p_w":true,"p_h":true,"l":"O","z":8.139,"y":-0.427,"x":-19.814},{"p_w":true,"p_h":true,"l":"H","z":8.475,"y":-0.596,"x":-18.931},{"p_w":true,"p_h":true,"l":"H","z":8.858,"y":0.074,"x":-20.232},{"p_w":true,"p_h":true,"l":"O","z":24.891,"y":18,"x":-8.056},{"p_w":true,"p_h":true,"l":"H","z":24.76,"y":18.979,"x":-8.112},{"p_w":true,"p_h":true,"l":"H","z":24.933,"y":17.743,"x":-8.985},{"p_w":true,"p_h":true,"l":"O","z":23.169,"y":21.391,"x":-9.635},{"p_w":true,"p_h":true,"l":"H","z":22.411,"y":21.089,"x":-9.135},{"p_w":true,"p_h":true,"l":"H","z":23.337,"y":20.713,"x":-10.274},{"p_w":true,"p_h":true,"l":"O","z":27.477,"y":0.135,"x":9.391},{"p_w":true,"p_h":true,"l":"H","z":27.377,"y":-0.633,"x":8.82},{"p_w":true,"p_h":true,"l":"H","z":27.67,"y":0.854,"x":8.794},{"p_w":true,"p_h":true,"l":"O","z":35.709,"y":-1.258,"x":7.124},{"p_w":true,"p_h":true,"l":"H","z":35.124,"y":-1.803,"x":6.595},{"p_w":true,"p_h":true,"l":"H","z":36.542,"y":-1.274,"x":6.616},{"p_w":true,"p_h":true,"l":"O","z":11.073,"y":7.032,"x":-17.242},{"p_w":true,"p_h":true,"l":"H","z":11.856,"y":6.49,"x":-17.354},{"p_w":true,"p_h":true,"l":"H","z":11.406,"y":7.857,"x":-16.894},{"p_w":true,"p_h":true,"l":"O","z":20.998,"y":4.022,"x":-26.506},{"p_w":true,"p_h":true,"l":"H","z":20.305,"y":3.369,"x":-26.611},{"p_w":true,"p_h":true,"l":"H","z":21.224,"y":3.996,"x":-25.588},{"p_w":true,"p_h":true,"l":"O","z":22.232,"y":11.444,"x":-14.564},{"p_w":true,"p_h":true,"l":"H","z":21.666,"y":10.692,"x":-14.423},{"p_w":true,"p_h":true,"l":"H","z":21.625,"y":12.188,"x":-14.617},{"p_w":true,"p_h":true,"l":"O","z":26.574,"y":-16.007,"x":-4.989},{"p_w":true,"p_h":true,"l":"H","z":26.04,"y":-16.757,"x":-4.739},{"p_w":true,"p_h":true,"l":"H","z":25.952,"y":-15.289,"x":-5.09},{"p_w":true,"p_h":true,"l":"O","z":26.097,"y":-0.661,"x":13.868},{"p_w":true,"p_h":true,"l":"H","z":25.412,"y":-0.294,"x":14.417},{"p_w":true,"p_h":true,"l":"H","z":26.744,"y":-1.017,"x":14.453},{"p_w":true,"p_h":true,"l":"O","z":12.791,"y":7.237,"x":11.621},{"p_w":true,"p_h":true,"l":"H","z":12.525,"y":6.442,"x":12.057},{"p_w":true,"p_h":true,"l":"H","z":12.128,"y":7.892,"x":11.863},{"p_w":true,"p_h":true,"l":"O","z":7.579,"y":14.62,"x":2.516},{"p_w":true,"p_h":true,"l":"H","z":7.369,"y":15.54,"x":2.344},{"p_w":true,"p_h":true,"l":"H","z":8.024,"y":14.331,"x":1.71},{"p_w":true,"p_h":true,"l":"O","z":18.136,"y":4.363,"x":-24.114},{"p_w":true,"p_h":true,"l":"H","z":17.96,"y":4.427,"x":-23.183},{"p_w":true,"p_h":true,"l":"H","z":18.589,"y":3.53,"x":-24.228},{"p_w":true,"p_h":true,"l":"O","z":10.122,"y":-12.29,"x":5.526},{"p_w":true,"p_h":true,"l":"H","z":10.293,"y":-13.25,"x":5.551},{"p_w":true,"p_h":true,"l":"H","z":10.579,"y":-11.958,"x":6.292},{"p_w":true,"p_h":true,"l":"O","z":38.408,"y":0.382,"x":-6.119},{"p_w":true,"p_h":true,"l":"H","z":39.251,"y":0.764,"x":-5.835},{"p_w":true,"p_h":true,"l":"H","z":38.482,"y":0.335,"x":-7.068},{"p_w":true,"p_h":true,"l":"O","z":26.604,"y":10.42,"x":9.398},{"p_w":true,"p_h":true,"l":"H","z":26.014,"y":9.743,"x":9.009},{"p_w":true,"p_h":true,"l":"H","z":26.042,"y":11.187,"x":9.472},{"p_w":true,"p_h":true,"l":"O","z":19.254,"y":7.6,"x":13.517},{"p_w":true,"p_h":true,"l":"H","z":19.357,"y":8.246,"x":12.801},{"p_w":true,"p_h":true,"l":"H","z":19.62,"y":8.067,"x":14.274},{"p_w":true,"p_h":true,"l":"O","z":14.451,"y":-12.111,"x":-19.285},{"p_w":true,"p_h":true,"l":"H","z":14.448,"y":-12.986,"x":-18.884},{"p_w":true,"p_h":true,"l":"H","z":13.673,"y":-11.685,"x":-18.956},{"p_w":true,"p_h":true,"l":"O","z":26.83,"y":7.723,"x":8.259},{"p_w":true,"p_h":true,"l":"H","z":27.093,"y":6.897,"x":7.857},{"p_w":true,"p_h":true,"l":"H","z":27.635,"y":8.068,"x":8.66},{"p_w":true,"p_h":true,"l":"O","z":17.508,"y":10.98,"x":4.139},{"p_w":true,"p_h":true,"l":"H","z":18.073,"y":10.295,"x":4.472},{"p_w":true,"p_h":true,"l":"H","z":18.122,"y":11.578,"x":3.706},{"p_w":true,"p_h":true,"l":"O","z":19.025,"y":-3.175,"x":-19.082},{"p_w":true,"p_h":true,"l":"H","z":19.935,"y":-2.999,"x":-19.328},{"p_w":true,"p_h":true,"l":"H","z":18.98,"y":-4.138,"x":-19.089},{"p_w":true,"p_h":true,"l":"O","z":9.057,"y":-4.827,"x":-0.621},{"p_w":true,"p_h":true,"l":"H","z":9.367,"y":-3.921,"x":-0.406},{"p_w":true,"p_h":true,"l":"H","z":9.824,"y":-5.234,"x":-1.003},{"p_w":true,"p_h":true,"l":"O","z":34.133,"y":-0.924,"x":-24.118},{"p_w":true,"p_h":true,"l":"H","z":34.127,"y":0.035,"x":-24.108},{"p_w":true,"p_h":true,"l":"H","z":33.201,"y":-1.16,"x":-24.108},{"p_w":true,"p_h":true,"l":"O","z":21.527,"y":-3.686,"x":-18.326},{"p_w":true,"p_h":true,"l":"H","z":21.803,"y":-2.786,"x":-18.558},{"p_w":true,"p_h":true,"l":"H","z":21.767,"y":-3.766,"x":-17.412},{"p_w":true,"p_h":true,"l":"O","z":37.438,"y":4.834,"x":-0.178},{"p_w":true,"p_h":true,"l":"H","z":37.108,"y":4.017,"x":0.193},{"p_w":true,"p_h":true,"l":"H","z":37.87,"y":4.574,"x":-0.987},{"p_w":true,"p_h":true,"l":"O","z":13.002,"y":-9.288,"x":-21.019},{"p_w":true,"p_h":true,"l":"H","z":12.899,"y":-9.293,"x":-21.975},{"p_w":true,"p_h":true,"l":"H","z":12.528,"y":-10.037,"x":-20.708},{"p_w":true,"p_h":true,"l":"O","z":37.68,"y":4.484,"x":6.518},{"p_w":true,"p_h":true,"l":"H","z":37.459,"y":4.02,"x":7.327},{"p_w":true,"p_h":true,"l":"H","z":38.564,"y":4.793,"x":6.637},{"p_w":true,"p_h":true,"l":"O","z":5.093,"y":13.522,"x":4.949},{"p_w":true,"p_h":true,"l":"H","z":5.277,"y":12.703,"x":4.458},{"p_w":true,"p_h":true,"l":"H","z":5.951,"y":13.751,"x":5.31},{"p_w":true,"p_h":true,"l":"O","z":13.406,"y":-7.013,"x":-22.835},{"p_w":true,"p_h":true,"l":"H","z":14.242,"y":-6.886,"x":-22.391},{"p_w":true,"p_h":true,"l":"H","z":13.584,"y":-6.829,"x":-23.756},{"p_w":true,"p_h":true,"l":"O","z":42.86,"y":0.782,"x":-3.327},{"p_w":true,"p_h":true,"l":"H","z":43.367,"y":0.499,"x":-4.076},{"p_w":true,"p_h":true,"l":"H","z":43.032,"y":1.719,"x":-3.241},{"p_w":true,"p_h":true,"l":"O","z":37.931,"y":-7.493,"x":2.47},{"p_w":true,"p_h":true,"l":"H","z":38.794,"y":-7.095,"x":2.456},{"p_w":true,"p_h":true,"l":"H","z":37.331,"y":-6.794,"x":2.175},{"p_w":true,"p_h":true,"l":"O","z":25.219,"y":10.985,"x":-15.469},{"p_w":true,"p_h":true,"l":"H","z":26.103,"y":11.06,"x":-15.114},{"p_w":true,"p_h":true,"l":"H","z":24.985,"y":10.063,"x":-15.313},{"p_w":true,"p_h":true,"l":"O","z":20.118,"y":-0.311,"x":-23.972},{"p_w":true,"p_h":true,"l":"H","z":20.698,"y":-0.784,"x":-24.581},{"p_w":true,"p_h":true,"l":"H","z":20.672,"y":-0.037,"x":-23.26},{"p_w":true,"p_h":true,"l":"O","z":22.745,"y":-11.07,"x":7.443},{"p_w":true,"p_h":true,"l":"H","z":22.011,"y":-10.803,"x":6.884},{"p_w":true,"p_h":true,"l":"H","z":23.313,"y":-10.299,"x":7.477},{"p_w":true,"p_h":true,"l":"O","z":21.658,"y":16.478,"x":-6.537},{"p_w":true,"p_h":true,"l":"H","z":22.466,"y":16.018,"x":-6.652},{"p_w":true,"p_h":true,"l":"H","z":21.827,"y":17.133,"x":-5.847},{"p_w":true,"p_h":true,"l":"O","z":22.589,"y":14.31,"x":-8.054},{"p_w":true,"p_h":true,"l":"H","z":21.775,"y":13.767,"x":-8.238},{"p_w":true,"p_h":true,"l":"H","z":22.279,"y":15.18,"x":-8.36},{"p_w":true,"p_h":true,"l":"O","z":22.54,"y":17.37,"x":-9.566},{"p_w":true,"p_h":true,"l":"H","z":22.86,"y":17.323,"x":-8.675},{"p_w":true,"p_h":true,"l":"H","z":23.071,"y":18.022,"x":-10.003},{"p_w":true,"p_h":true,"l":"O","z":5.355,"y":-9.949,"x":-8.169},{"p_w":true,"p_h":true,"l":"H","z":6.022,"y":-10.103,"x":-7.471},{"p_w":true,"p_h":true,"l":"H","z":4.69,"y":-9.431,"x":-7.73},{"p_w":true,"p_h":true,"l":"O","z":6.236,"y":-4.079,"x":-6.22},{"p_w":true,"p_h":true,"l":"H","z":7.077,"y":-3.897,"x":-5.809},{"p_w":true,"p_h":true,"l":"H","z":5.901,"y":-4.814,"x":-5.68},{"p_w":true,"p_h":true,"l":"O","z":14.143,"y":-11.54,"x":-9.134},{"p_w":true,"p_h":true,"l":"H","z":14.43,"y":-11.25,"x":-8.299},{"p_w":true,"p_h":true,"l":"H","z":13.18,"y":-11.51,"x":-9.109},{"p_w":true,"p_h":true,"l":"O","z":2.554,"y":-6.155,"x":-10.984},{"p_w":true,"p_h":true,"l":"H","z":2.907,"y":-6.86,"x":-10.429},{"p_w":true,"p_h":true,"l":"H","z":1.655,"y":-6.368,"x":-11.126},{"p_w":true,"p_h":true,"l":"O","z":12.098,"y":-15.212,"x":-9.51},{"p_w":true,"p_h":true,"l":"H","z":11.672,"y":-14.816,"x":-8.748},{"p_w":true,"p_h":true,"l":"H","z":12.243,"y":-14.465,"x":-10.107},{"p_w":true,"p_h":true,"l":"O","z":14.118,"y":5.912,"x":6.194},{"p_w":true,"p_h":true,"l":"H","z":14.889,"y":5.364,"x":6.256},{"p_w":true,"p_h":true,"l":"H","z":14.426,"y":6.736,"x":5.806},{"p_w":true,"p_h":true,"l":"O","z":5.566,"y":-0.626,"x":-14.3},{"p_w":true,"p_h":true,"l":"H","z":6.078,"y":-1.28,"x":-14.715},{"p_w":true,"p_h":true,"l":"H","z":6.185,"y":-0.012,"x":-13.867}]}});
var pdb_1BLF = new ChemDoodle.io.JSONInterpreter().pdbFrom({"ribbons":{"cs":[[{"s":false,"z1":50.446,"a":false,"y1":73.569,"y2":73.569,"z2":50.446,"x2":43.69,"h":false,"x1":43.69},{"s":false,"z1":50.446,"a":false,"y1":73.569,"y2":73.569,"z2":50.446,"x2":43.69,"h":false,"x1":43.69},{"s":false,"z1":49.673,"a":false,"y1":74.507,"n":"Asn","y2":74.771,"z2":47.536,"x2":43.974,"h":false,"x1":42.86},{"s":true,"z1":46.025,"a":false,"y1":74.113,"n":"Val","y2":75.401,"z2":45.942,"x2":39.738,"h":false,"x1":41.748},{"s":true,"z1":44.033,"a":false,"y1":77.107,"n":"Arg","y2":76.26,"z2":41.787,"x2":40.63,"h":false,"x1":40.659},{"s":true,"z1":41.646,"a":false,"y1":76.057,"n":"Trp","y2":78.24,"z2":41.405,"x2":37.026,"h":false,"x1":37.931},{"s":true,"z1":38.648,"a":true,"y1":78.228,"n":"Cys","y2":76.915,"z2":37.552,"x2":35.475,"h":false,"x1":37.184},{"s":true,"z1":37.838,"a":false,"y1":78.935,"n":"Thr","y2":81.119,"z2":36.874,"x2":33.862,"h":false,"x1":33.495},{"s":false,"z1":34.725,"a":false,"y1":80.722,"n":"Ile","y2":82.091,"z2":33.736,"x2":30.652,"h":false,"x1":32.337},{"s":false,"z1":35.878,"a":false,"y1":81.971,"n":"Ser","y2":81.291,"z2":38.18,"x2":28.966,"h":false,"x1":28.939},{"s":false,"z1":38.83,"a":false,"y1":83.117,"n":"Gln","y2":81.531,"z2":40.415,"x2":26.135,"h":true,"x1":26.835},{"s":false,"z1":38.767,"a":false,"y1":79.918,"n":"Pro","y2":78.104,"z2":40.052,"x2":25.629,"h":true,"x1":24.773},{"s":false,"z1":38.642,"a":false,"y1":77.969,"n":"Glu","y2":77.493,"z2":40.639,"x2":29.236,"h":true,"x1":28.01},{"s":false,"z1":41.4,"a":false,"y1":80.188,"n":"Trp","y2":79.543,"z2":43.709,"x2":29.248,"h":true,"x1":29.454},{"s":false,"z1":43.55,"a":false,"y1":79.636,"n":"Phe","y2":77.849,"z2":45.162,"x2":26.27,"h":true,"x1":26.387},{"s":false,"z1":43.29,"a":false,"y1":75.81,"n":"Lys","y2":74.551,"z2":44.84,"x2":28.216,"h":true,"x1":26.837},{"s":false,"z1":44.127,"a":false,"y1":76.021,"n":"Cys","y2":75.637,"z2":46.416,"x2":31.174,"h":true,"x1":30.523},{"s":false,"z1":47.201,"a":false,"y1":78.054,"n":"Arg","y2":76.925,"z2":49.254,"x2":29.258,"h":true,"x1":29.796},{"s":false,"z1":48.003,"a":false,"y1":75.537,"n":"Arg","y2":73.527,"z2":49.245,"x2":27.495,"h":true,"x1":27.071},{"s":false,"z1":47.573,"a":false,"y1":72.782,"n":"Trp","y2":72.087,"z2":49.33,"x2":31.161,"h":true,"x1":29.677},{"s":false,"z1":49.563,"a":false,"y1":74.717,"n":"Gln","y2":73.994,"z2":51.814,"x2":32.697,"h":true,"x1":32.288},{"s":false,"z1":52.735,"a":false,"y1":74.873,"n":"Trp","y2":73.023,"z2":54.243,"x2":30.112,"h":true,"x1":30.145},{"s":false,"z1":52.192,"a":false,"y1":71.28,"n":"Arg","y2":69.232,"z2":52.915,"x2":30.062,"h":true,"x1":29.002},{"s":false,"z1":52.16,"a":false,"y1":70.087,"n":"Met","y2":68.931,"z2":54.127,"x2":33.317,"h":true,"x1":32.607},{"s":false,"z1":55.502,"a":false,"y1":71.589,"n":"Lys","y2":70.216,"z2":57.21,"x2":34.925,"h":true,"x1":33.9},{"s":false,"z1":57.784,"a":true,"y1":68.872,"n":"Lys","y2":66.625,"z2":58.299,"x2":33.214,"h":true,"x1":32.521},{"s":false,"z1":55.778,"a":false,"y1":66.079,"n":"Leu","y2":65.066,"z2":55.769,"x2":36.347,"h":true,"x1":34.158},{"s":false,"z1":56.523,"a":false,"y1":67.465,"n":"Gly","y2":66.2,"z2":55.133,"x2":39.151,"h":false,"x1":37.627},{"s":false,"z1":53.762,"a":false,"y1":68.586,"n":"Ala","y2":66.719,"z2":52.358,"x2":39.341,"h":false,"x1":40.024},{"s":false,"z1":51.361,"a":false,"y1":69.916,"n":"Pro","y2":70.719,"z2":51.081,"x2":38.396,"h":false,"x1":40.662},{"s":false,"z1":51.361,"a":false,"y1":73.321,"n":"Ser","y2":73.613,"z2":49.1,"x2":39.815,"h":false,"x1":39.035},{"s":true,"z1":48.192,"a":false,"y1":74.669,"n":"Ile","y2":76.61,"z2":48.979,"x2":36.401,"h":false,"x1":37.527},{"s":true,"z1":47.03,"a":false,"y1":78.29,"n":"Thr","y2":77.569,"z2":44.812,"x2":37.083,"h":false,"x1":37.592},{"s":true,"z1":44.286,"a":false,"y1":79.584,"n":"Cys","y2":81.94,"z2":43.905,"x2":35.192,"h":false,"x1":35.302},{"s":true,"z1":41.812,"a":true,"y1":81.851,"n":"Val","y2":81.228,"z2":40.078,"x2":35.495,"h":false,"x1":37.027},{"s":true,"z1":39.543,"a":false,"y1":83.764,"n":"Arg","y2":85.292,"z2":38.353,"x2":36.108,"h":false,"x1":34.677},{"s":false,"z1":35.823,"a":false,"y1":84.209,"n":"Arg","y2":83.856,"z2":35.311,"x2":33.116,"h":false,"x1":35.427},{"s":false,"z1":32.704,"a":false,"y1":84.725,"n":"Ala","y2":83.274,"z2":31.254,"x2":32.138,"h":false,"x1":33.311},{"s":false,"z1":30.227,"a":false,"y1":82.083,"n":"Phe","y2":81.347,"z2":31.402,"x2":36.275,"h":false,"x1":34.339},{"s":false,"z1":29.799,"a":false,"y1":78.948,"n":"Ala","y2":78.887,"z2":30.498,"x2":38.752,"h":true,"x1":36.471},{"s":false,"z1":28.493,"a":false,"y1":80.642,"n":"Leu","y2":81.48,"z2":29.924,"x2":41.404,"h":true,"x1":39.632},{"s":false,"z1":31.395,"a":false,"y1":83.061,"n":"Glu","y2":82.596,"z2":33.336,"x2":40.952,"h":true,"x1":39.615},{"s":false,"z1":33.741,"a":false,"y1":80.082,"n":"Cys","y2":79.075,"z2":34.39,"x2":41.833,"h":true,"x1":39.737},{"s":false,"z1":31.653,"a":false,"y1":78.583,"n":"Ile","y2":78.985,"z2":32.43,"x2":44.71,"h":true,"x1":42.477},{"s":false,"z1":31.989,"a":false,"y1":81.77,"n":"Arg","y2":82.238,"z2":33.948,"x2":45.706,"h":true,"x1":44.41},{"s":false,"z1":35.731,"a":false,"y1":81.942,"n":"Ala","y2":81.114,"z2":37.382,"x2":45.019,"h":true,"x1":43.525},{"s":false,"z1":36.42,"a":true,"y1":78.476,"n":"Ile","y2":78.333,"z2":37.014,"x2":47.169,"h":true,"x1":44.847},{"s":false,"z1":34.336,"a":false,"y1":79.129,"n":"Ala","y2":80.061,"z2":35.459,"x2":49.919,"h":true,"x1":47.994},{"s":false,"z1":36.219,"a":false,"y1":82.345,"n":"Glu","y2":83.041,"z2":38.433,"x2":48.923,"h":false,"x1":48.599},{"s":false,"z1":39.552,"a":false,"y1":80.512,"n":"Lys","y2":81.5,"z2":41.562,"x2":47.295,"h":false,"x1":48.15},{"s":false,"z1":40.353,"a":false,"y1":82.501,"n":"Lys","y2":81.873,"z2":41.527,"x2":42.958,"h":false,"x1":44.991},{"s":false,"z1":40.276,"a":false,"y1":79.32,"n":"Ala","y2":77.984,"z2":39.646,"x2":44.876,"h":false,"x1":42.949},{"s":false,"z1":40.427,"a":false,"y1":75.578,"n":"Asp","y2":73.764,"z2":38.873,"x2":43.634,"h":false,"x1":43.722},{"s":false,"z1":38.7,"a":false,"y1":73.597,"n":"Ala","y2":75.212,"z2":38.339,"x2":39.135,"h":false,"x1":40.879},{"s":true,"z1":36.073,"a":false,"y1":73.701,"n":"Val","y2":71.706,"z2":34.96,"x2":38.86,"h":false,"x1":38.129},{"s":true,"z1":33.919,"a":true,"y1":71.1,"n":"Thr","y2":72.414,"z2":32.314,"x2":35.341,"h":false,"x1":36.404},{"s":true,"z1":30.196,"a":false,"y1":71.452,"n":"Leu","y2":69.178,"z2":29.588,"x2":36.308,"h":false,"x1":36.627},{"s":false,"z1":27.062,"a":false,"y1":69.945,"n":"Asp","y2":70.691,"z2":26.377,"x2":37.363,"h":false,"x1":35.171},{"s":false,"z1":24.669,"a":false,"y1":68.361,"n":"Gly","y2":69.377,"z2":23.684,"x2":39.683,"h":true,"x1":37.765},{"s":false,"z1":22.493,"a":false,"y1":71.451,"n":"Gly","y2":72.94,"z2":22.991,"x2":39.933,"h":true,"x1":38.157},{"s":false,"z1":25.59,"a":false,"y1":73.421,"n":"Met","y2":73.435,"z2":26.632,"x2":41.207,"h":true,"x1":39.091},{"s":false,"z1":26.827,"a":false,"y1":70.625,"n":"Val","y2":70.788,"z2":26.51,"x2":43.666,"h":true,"x1":41.267},{"s":false,"z1":23.681,"a":false,"y1":70.981,"n":"Phe","y2":72.345,"z2":23.841,"x2":45.221,"h":true,"x1":43.264},{"s":false,"z1":23.999,"a":false,"y1":74.706,"n":"Glu","y2":75.863,"z2":25.322,"x2":45.303,"h":true,"x1":43.698},{"s":false,"z1":27.649,"a":true,"y1":74.494,"n":"Ala","y2":74.255,"z2":28.557,"x2":46.824,"h":true,"x1":44.618},{"s":false,"z1":26.933,"a":false,"y1":72.111,"n":"Gly","y2":72.68,"z2":26.562,"x2":49.775,"h":true,"x1":47.475},{"s":false,"z1":24.558,"a":false,"y1":74.609,"n":"Arg","y2":75.886,"z2":26.6,"x2":49.538,"h":false,"x1":49.115},{"s":false,"z1":25.337,"a":false,"y1":77.353,"n":"Asp","y2":78.687,"z2":24.225,"x2":49.843,"h":false,"x1":51.527},{"s":false,"z1":27.294,"a":false,"y1":79.285,"n":"Pro","y2":78.929,"z2":29.654,"x2":51.42,"h":false,"x1":51.598},{"s":false,"z1":29.498,"a":false,"y1":77.61,"n":"Tyr","y2":76.387,"z2":31.291,"x2":49.945,"h":false,"x1":49.025},{"s":false,"z1":29.481,"a":false,"y1":74.14,"n":"Lys","y2":73.156,"z2":31.658,"x2":50.388,"h":false,"x1":50.545},{"s":true,"z1":31.46,"a":false,"y1":72.515,"n":"Leu","y2":70.787,"z2":29.863,"x2":47.334,"h":false,"x1":47.766},{"s":true,"z1":31.777,"a":false,"y1":68.808,"n":"Arg","y2":68.93,"z2":33.449,"x2":45.349,"h":false,"x1":47.064},{"s":true,"z1":32.448,"a":false,"y1":66.775,"n":"Pro","y2":64.87,"z2":33.334,"x2":44.973,"h":false,"x1":43.885},{"s":true,"z1":35.813,"a":false,"y1":65.277,"n":"Val","y2":63.174,"z2":36.695,"x2":43.502,"h":false,"x1":44.221},{"s":true,"z1":36.027,"a":false,"y1":63.552,"n":"Ala","y2":64.805,"z2":34.433,"x2":39.611,"h":false,"x1":40.823},{"s":true,"z1":33.603,"a":false,"y1":62.673,"n":"Ala","y2":61.483,"z2":35.102,"x2":36.622,"h":false,"x1":38.04},{"s":true,"z1":33.997,"a":true,"y1":62.466,"n":"Glu","y2":60.94,"z2":32.188,"x2":34.153,"h":false,"x1":34.298},{"s":true,"z1":33.592,"a":false,"y1":59.06,"n":"Ile","y2":59.699,"z2":34.176,"x2":30.632,"h":false,"x1":32.847},{"s":false,"z1":31.932,"a":false,"y1":58.652,"n":"Tyr","y2":56.272,"z2":32.185,"x2":29.69,"h":false,"x1":29.475},{"s":false,"z1":31.129,"a":false,"y1":55.691,"n":"Gly","y2":56.153,"z2":33.048,"x2":25.909,"h":false,"x1":27.268},{"s":false,"z1":33.633,"a":false,"y1":53.498,"n":"Thr","y2":53.03,"z2":34.552,"x2":27.597,"h":false,"x1":25.46},{"s":false,"z1":37.015,"a":false,"y1":52.141,"n":"Lys","y2":50.602,"z2":37.161,"x2":28.383,"h":false,"x1":26.514},{"s":false,"z1":35.595,"a":false,"y1":48.697,"n":"Glu","y2":47.828,"z2":33.814,"x2":28.504,"h":false,"x1":27.177},{"s":false,"z1":32.197,"a":false,"y1":49.96,"n":"Ser","y2":52.218,"z2":31.486,"x2":27.887,"h":false,"x1":28.108},{"s":false,"z1":32.456,"a":false,"y1":53.021,"n":"Pro","y2":52.284,"z2":30.414,"x2":31.282,"h":false,"x1":30.274},{"s":false,"z1":29.684,"a":false,"y1":54.81,"n":"Gln","y2":56.947,"z2":30.744,"x2":32.359,"h":false,"x1":32.063},{"s":false,"z1":29.427,"a":false,"y1":57.509,"n":"Thr","y2":58.495,"z2":27.678,"x2":35.953,"h":false,"x1":34.654},{"s":true,"z1":26.148,"a":false,"y1":58.994,"n":"His","y2":58.656,"z2":26.697,"x2":31.314,"h":false,"x1":33.589},{"s":true,"z1":24.593,"a":false,"y1":60.072,"n":"Tyr","y2":59.877,"z2":22.346,"x2":31.06,"h":false,"x1":30.341},{"s":true,"z1":21.254,"a":false,"y1":60.485,"n":"Tyr","y2":62.228,"z2":21.414,"x2":27.102,"h":false,"x1":28.687},{"s":true,"z1":19.206,"a":false,"y1":63.577,"n":"Ala","y2":62.151,"z2":17.457,"x2":27.205,"h":false,"x1":28.048},{"s":true,"z1":17.465,"a":false,"y1":63.349,"n":"Val","y2":65.703,"z2":17.542,"x2":24.084,"h":false,"x1":24.668},{"s":true,"z1":15.466,"a":false,"y1":65.508,"n":"Ala","y2":64.109,"z2":15.274,"x2":20.287,"h":false,"x1":22.246},{"s":true,"z1":16.832,"a":true,"y1":65.723,"n":"Val","y2":67.842,"z2":15.93,"x2":17.979,"h":false,"x1":18.725},{"s":true,"z1":14.576,"a":false,"y1":66.589,"n":"Val","y2":65.253,"z2":15.912,"x2":14.416,"h":false,"x1":15.882},{"s":true,"z1":15.24,"a":false,"y1":66.772,"n":"Lys","y2":65.95,"z2":13.014,"x2":12.057,"h":false,"x1":12.181},{"s":false,"z1":13.745,"a":false,"y1":63.871,"n":"Lys","y2":65.434,"z2":13.058,"x2":8.563,"h":false,"x1":10.241},{"s":false,"z1":10.44,"a":false,"y1":64.744,"n":"Gly","y2":67.13,"z2":10.139,"x2":9.002,"h":false,"x1":8.741},{"s":false,"z1":8.482,"a":false,"y1":66.755,"n":"Ser","y2":64.783,"z2":7.316,"x2":11.89,"h":false,"x1":11.254},{"s":false,"z1":4.977,"a":false,"y1":65.953,"n":"Asn","y2":65.186,"z2":3.862,"x2":14.314,"h":false,"x1":12.318},{"s":false,"z1":5.237,"a":false,"y1":66.975,"n":"Phe","y2":65.207,"z2":6.851,"x2":16.402,"h":false,"x1":15.984},{"s":false,"z1":5.74,"a":false,"y1":64.634,"n":"Gln","y2":66.659,"z2":5.968,"x2":20.029,"h":false,"x1":18.853},{"s":false,"z1":6.726,"a":false,"y1":65.29,"n":"Leu","y2":67.158,"z2":5.881,"x2":23.734,"h":false,"x1":22.439},{"s":false,"z1":3.214,"a":false,"y1":66.492,"n":"Asp","y2":68.772,"z2":2.451,"x2":22.978,"h":false,"x1":23.277},{"s":false,"z1":3.125,"a":false,"y1":68.784,"n":"Gln","y2":70.334,"z2":4.543,"x2":19.049,"h":false,"x1":20.232},{"s":false,"z1":5.961,"a":false,"y1":71.096,"n":"Leu","y2":73.406,"z2":6.387,"x2":21.832,"h":false,"x1":21.317},{"s":false,"z1":3.775,"a":false,"y1":74.066,"n":"Gln","y2":74.428,"z2":3.107,"x2":19.932,"h":false,"x1":22.186},{"s":false,"z1":4.377,"a":false,"y1":76.849,"n":"Gly","y2":76.545,"z2":5.289,"x2":17.524,"h":false,"x1":19.729},{"s":false,"z1":7.596,"a":false,"y1":75.405,"n":"Arg","y2":77.076,"z2":8.619,"x2":19.81,"h":false,"x1":18.463},{"s":false,"z1":11.087,"a":false,"y1":76.881,"n":"Lys","y2":74.884,"z2":12.398,"x2":18.371,"h":false,"x1":18.583},{"s":true,"z1":13.676,"a":false,"y1":75.129,"n":"Ser","y2":76.807,"z2":15.291,"x2":21.373,"h":false,"x1":20.725},{"s":true,"z1":17.308,"a":true,"y1":74.9,"n":"Cys","y2":73.092,"z2":17.295,"x2":22.974,"h":false,"x1":21.395},{"s":true,"z1":18.696,"a":false,"y1":74.59,"n":"His","y2":75.854,"z2":20.729,"x2":24.634,"h":false,"x1":24.883},{"s":false,"z1":22.226,"a":false,"y1":74.039,"n":"Thr","y2":75.768,"z2":23.547,"x2":27.194,"h":false,"x1":26.175},{"s":false,"z1":21.745,"a":false,"y1":76.277,"n":"Gly","y2":75.252,"z2":19.949,"x2":30.405,"h":false,"x1":29.206},{"s":false,"z1":19.508,"a":false,"y1":77.485,"n":"Leu","y2":77.094,"z2":21.103,"x2":33.701,"h":false,"x1":31.996},{"s":false,"z1":19.65,"a":false,"y1":75.023,"n":"Gly","y2":73.506,"z2":21.438,"x2":35.378,"h":false,"x1":34.812},{"s":false,"z1":21.618,"a":false,"y1":72.423,"n":"Arg","y2":71.178,"z2":19.623,"x2":32.682,"h":false,"x1":32.86},{"s":false,"z1":20.842,"a":false,"y1":68.682,"n":"Ser","y2":68.271,"z2":18.824,"x2":31.936,"h":false,"x1":33.132},{"s":false,"z1":20.188,"a":false,"y1":67.62,"n":"Ala","y2":68.616,"z2":18.434,"x2":28.249,"h":false,"x1":29.544},{"s":false,"z1":19.413,"a":false,"y1":71.125,"n":"Gly","y2":72.497,"z2":17.485,"x2":28.454,"h":false,"x1":28.441},{"s":false,"z1":17.001,"a":false,"y1":72.335,"n":"Trp","y2":71.305,"z2":14.965,"x2":31.791,"h":false,"x1":31.096},{"s":false,"z1":16.227,"a":false,"y1":70.335,"n":"Ile","y2":68.971,"z2":14.288,"x2":34.257,"h":true,"x1":34.26},{"s":false,"z1":15.499,"a":false,"y1":67.054,"n":"Ile","y2":66.7,"z2":13.253,"x2":31.934,"h":true,"x1":32.568},{"s":false,"z1":13.286,"a":false,"y1":68.341,"n":"Pro","y2":68.835,"z2":10.958,"x2":29.996,"h":true,"x1":29.705},{"s":false,"z1":11.336,"a":false,"y1":70.83,"n":"Met","y2":70.471,"z2":9.377,"x2":33.207,"h":true,"x1":31.842},{"s":false,"z1":10.235,"a":false,"y1":68.119,"n":"Gly","y2":66.666,"z2":8.324,"x2":34.202,"h":true,"x1":34.296},{"s":false,"z1":8.576,"a":false,"y1":66.33,"n":"Ile","y2":66.738,"z2":6.338,"x2":30.652,"h":true,"x1":31.443},{"s":false,"z1":6.955,"a":false,"y1":69.301,"n":"Leu","y2":70.545,"z2":4.969,"x2":30.181,"h":true,"x1":29.738},{"s":false,"z1":5.466,"a":false,"y1":70.629,"n":"Arg","y2":71.378,"z2":3.233,"x2":33.505,"h":true,"x1":33.03},{"s":false,"z1":1.962,"a":false,"y1":69.158,"n":"Pro","y2":70.508,"z2":0.291,"x2":31.375,"h":true,"x1":32.5},{"s":false,"z1":1.837,"a":true,"y1":70.827,"n":"Tyr","y2":73.048,"z2":1.45,"x2":28.427,"h":true,"x1":29.117},{"s":false,"z1":3.099,"a":false,"y1":74.109,"n":"Leu","y2":76.207,"z2":1.967,"x2":30.377,"h":true,"x1":30.476},{"s":false,"z1":-0.189,"a":false,"y1":75.249,"n":"Ser","y2":77.516,"z2":-0.025,"x2":33.062,"h":false,"x1":32.178},{"s":false,"z1":1.968,"a":false,"y1":76.812,"n":"Trp","y2":76.13,"z2":0.807,"x2":36.863,"h":false,"x1":34.868},{"s":false,"z1":0.131,"a":false,"y1":78.721,"n":"Thr","y2":80.653,"z2":1.507,"x2":37.758,"h":false,"x1":37.411},{"s":false,"z1":2.935,"a":false,"y1":79.16,"n":"Glu","y2":81.068,"z2":3.878,"x2":40.982,"h":false,"x1":39.893},{"s":false,"z1":1.418,"a":false,"y1":82.208,"n":"Ser","y2":84.476,"z2":2.243,"x2":41.383,"h":false,"x1":41.697},{"s":false,"z1":1.46,"a":false,"y1":84.576,"n":"Leu","y2":85.937,"z2":3.41,"x2":38.266,"h":false,"x1":38.698},{"s":false,"z1":4.847,"a":false,"y1":83.88,"n":"Glu","y2":81.662,"z2":5.235,"x2":38.072,"h":false,"x1":37.2},{"s":false,"z1":7.962,"a":false,"y1":81.659,"n":"Pro","y2":80.942,"z2":7.212,"x2":35.449,"h":false,"x1":37.603},{"s":false,"z1":8.81,"a":false,"y1":78.612,"n":"Leu","y2":78.734,"z2":8.725,"x2":33.106,"h":true,"x1":35.495},{"s":false,"z1":10.671,"a":false,"y1":80.82,"n":"Gln","y2":81.676,"z2":9.574,"x2":31.093,"h":true,"x1":33.041},{"s":false,"z1":7.486,"a":false,"y1":82.827,"n":"Gly","y2":82.274,"z2":5.833,"x2":30.852,"h":true,"x1":32.5},{"s":false,"z1":5.42,"a":false,"y1":79.704,"n":"Ala","y2":78.643,"z2":5.253,"x2":29.621,"h":true,"x1":31.785},{"s":false,"z1":8.058,"a":true,"y1":78.327,"n":"Val","y2":78.809,"z2":7.97,"x2":27.127,"h":true,"x1":29.499},{"s":false,"z1":8.313,"a":false,"y1":81.649,"n":"Ala","y2":81.843,"z2":7.18,"x2":25.461,"h":true,"x1":27.584},{"s":false,"z1":4.719,"a":false,"y1":81.548,"n":"Lys","y2":80.061,"z2":3.359,"x2":25.21,"h":false,"x1":26.466},{"s":false,"z1":4.871,"a":false,"y1":77.831,"n":"Phe","y2":77.298,"z2":4.656,"x2":23.405,"h":false,"x1":25.765},{"s":false,"z1":7.4,"a":false,"y1":77.741,"n":"Phe","y2":80.122,"z2":7.094,"x2":23.12,"h":false,"x1":22.922},{"s":false,"z1":7.509,"a":false,"y1":80.624,"n":"Ser","y2":82.195,"z2":8.926,"x2":21.588,"h":false,"x1":20.429},{"s":false,"z1":11.085,"a":false,"y1":81.603,"n":"Ala","y2":79.358,"z2":11.425,"x2":20.47,"h":false,"x1":19.878},{"s":true,"z1":14.008,"a":false,"y1":79.825,"n":"Ser","y2":81.664,"z2":15.562,"x2":21.617,"h":false,"x1":21.492},{"s":true,"z1":17.603,"a":true,"y1":79.966,"n":"Cys","y2":77.851,"z2":18.109,"x2":23.628,"h":false,"x1":22.564},{"s":true,"z1":18.224,"a":false,"y1":79.093,"n":"Val","y2":81.14,"z2":18.664,"x2":27.25,"h":false,"x1":26.157},{"s":false,"z1":21.479,"a":false,"y1":80.873,"n":"Pro","y2":79.953,"z2":20.991,"x2":29.284,"h":false,"x1":27.121},{"s":false,"z1":21.948,"a":false,"y1":82.388,"n":"Cys","y2":83.425,"z2":20.547,"x2":32.318,"h":false,"x1":30.654},{"s":false,"z1":18.282,"a":false,"y1":83.468,"n":"Ile","y2":85.576,"z2":19.137,"x2":29.862,"h":false,"x1":30.612},{"s":false,"z1":17.265,"a":false,"y1":87.052,"n":"Asp","y2":87.258,"z2":15.486,"x2":29.838,"h":false,"x1":31.46},{"s":false,"z1":17.394,"a":false,"y1":88.428,"n":"Arg","y2":89.613,"z2":15.576,"x2":26.894,"h":false,"x1":27.92},{"s":false,"z1":15.564,"a":false,"y1":91.605,"n":"Gln","y2":91.724,"z2":13.13,"x2":28.848,"h":false,"x1":28.918},{"s":false,"z1":12.783,"a":false,"y1":89.759,"n":"Ala","y2":88.667,"z2":10.819,"x2":29.88,"h":false,"x1":30.739},{"s":false,"z1":12.218,"a":false,"y1":86.743,"n":"Tyr","y2":85.644,"z2":13.798,"x2":26.931,"h":false,"x1":28.42},{"s":false,"z1":13.489,"a":false,"y1":87.837,"n":"Pro","y2":86.554,"z2":14.039,"x2":22.971,"h":true,"x1":24.941},{"s":false,"z1":11.685,"a":true,"y1":84.999,"n":"Asn","y2":82.898,"z2":12.634,"x2":22.466,"h":true,"x1":23.109},{"s":false,"z1":13.813,"a":false,"y1":82.511,"n":"Leu","y2":81.869,"z2":16.152,"x2":24.839,"h":true,"x1":25.007},{"s":false,"z1":16.877,"a":false,"y1":84.341,"n":"Cys","y2":85.17,"z2":17.888,"x2":21.667,"h":false,"x1":23.673},{"s":false,"z1":15.368,"a":false,"y1":85.227,"n":"Gln","y2":84.999,"z2":16.481,"x2":18.161,"h":false,"x1":20.27},{"s":false,"z1":16.913,"a":false,"y1":82.302,"n":"Leu","y2":81.554,"z2":19.101,"x2":17.819,"h":false,"x1":18.442},{"s":false,"z1":20.364,"a":false,"y1":82.834,"n":"Cys","y2":84.69,"z2":20.965,"x2":18.594,"h":false,"x1":20.007},{"s":false,"z1":23.145,"a":false,"y1":83.338,"n":"Lys","y2":84.707,"z2":25.084,"x2":17.065,"h":false,"x1":17.47},{"s":false,"z1":25.221,"a":false,"y1":85.772,"n":"Gly","y2":87.676,"z2":24.139,"x2":18.568,"h":false,"x1":19.589},{"s":false,"z1":26.429,"a":false,"y1":89.3,"n":"Glu","y2":89.593,"z2":25.992,"x2":21.139,"h":false,"x1":18.844},{"s":false,"z1":24.549,"a":false,"y1":92.017,"n":"Gly","y2":92.664,"z2":26.475,"x2":22.051,"h":false,"x1":20.771},{"s":false,"z1":24.983,"a":false,"y1":92.364,"n":"Glu","y2":91.514,"z2":26.807,"x2":25.969,"h":false,"x1":24.581},{"s":false,"z1":26.816,"a":false,"y1":89.033,"n":"Asn","y2":86.697,"z2":26.554,"x2":23.832,"h":false,"x1":24.44},{"s":false,"z1":24.036,"a":false,"y1":87.286,"n":"Gln","y2":87.528,"z2":22.936,"x2":24.713,"h":false,"x1":22.634},{"s":false,"z1":22.331,"a":false,"y1":84.645,"n":"Cys","y2":84.478,"z2":22.508,"x2":27.231,"h":false,"x1":24.816},{"s":false,"z1":25.35,"a":false,"y1":84.765,"n":"Ala","y2":82.358,"z2":25.247,"x2":27.13,"h":false,"x1":27.198},{"s":false,"z1":26.128,"a":false,"y1":82.028,"n":"Cys","y2":81.028,"z2":28.128,"x2":30.564,"h":false,"x1":29.688},{"s":false,"z1":29.3,"a":false,"y1":80.759,"n":"Ser","y2":81.006,"z2":28.493,"x2":25.79,"h":false,"x1":28.005},{"s":false,"z1":31.153,"a":false,"y1":80.098,"n":"Ser","y2":81.053,"z2":30.931,"x2":22.535,"h":false,"x1":24.763},{"s":false,"z1":30.436,"a":false,"y1":83.752,"n":"Arg","y2":84.106,"z2":29.171,"x2":21.708,"h":false,"x1":23.714},{"s":false,"z1":27.043,"a":false,"y1":82.585,"n":"Glu","y2":80.402,"z2":28.029,"x2":22.554,"h":false,"x1":22.621},{"s":false,"z1":27.69,"a":false,"y1":80.156,"n":"Pro","y2":77.866,"z2":27.023,"x2":19.682,"h":false,"x1":19.755},{"s":false,"z1":24.505,"a":false,"y1":78.333,"n":"Tyr","y2":77.002,"z2":23.524,"x2":22.313,"h":false,"x1":20.55},{"s":false,"z1":25.594,"a":false,"y1":77.671,"n":"Phe","y2":75.902,"z2":26.869,"x2":23.216,"h":false,"x1":24.148},{"s":false,"z1":26.319,"a":false,"y1":74.09,"n":"Gly","y2":73.39,"z2":24.527,"x2":23.869,"h":true,"x1":25.24},{"s":false,"z1":25.358,"a":false,"y1":70.728,"n":"Tyr","y2":70.665,"z2":24.57,"x2":21.535,"h":true,"x1":23.802},{"s":false,"z1":27.069,"a":false,"y1":71.286,"n":"Ser","y2":72.587,"z2":26.113,"x2":18.694,"h":true,"x1":20.472},{"s":false,"z1":25.825,"a":false,"y1":74.871,"n":"Gly","y2":75.29,"z2":23.746,"x2":19.236,"h":true,"x1":20.31},{"s":false,"z1":22.331,"a":false,"y1":73.51,"n":"Ala","y2":72.977,"z2":20.993,"x2":18.961,"h":true,"x1":20.87},{"s":false,"z1":22.818,"a":false,"y1":71.072,"n":"Phe","y2":71.724,"z2":22.309,"x2":15.76,"h":true,"x1":17.993},{"s":false,"z1":24.061,"a":false,"y1":73.937,"n":"Lys","y2":75.266,"z2":22.61,"x2":14.432,"h":true,"x1":15.812},{"s":false,"z1":20.82,"a":false,"y1":75.771,"n":"Cys","y2":75.612,"z2":18.925,"x2":15.039,"h":true,"x1":16.572},{"s":false,"z1":18.886,"a":true,"y1":72.814,"n":"Leu","y2":72.681,"z2":18.483,"x2":12.759,"h":true,"x1":15.144},{"s":false,"z1":21.331,"a":false,"y1":72.261,"n":"Gln","y2":73.313,"z2":21.113,"x2":10.13,"h":true,"x1":12.267},{"s":false,"z1":21.174,"a":false,"y1":75.861,"n":"Asp","y2":77.223,"z2":19.367,"x2":10.335,"h":false,"x1":11.141},{"s":false,"z1":17.381,"a":false,"y1":75.356,"n":"Gly","y2":76.946,"z2":15.66,"x2":11.544,"h":false,"x1":11.18},{"s":false,"z1":16.746,"a":false,"y1":77.945,"n":"Ala","y2":78.014,"z2":14.539,"x2":14.832,"h":false,"x1":13.855},{"s":false,"z1":14.869,"a":false,"y1":75.693,"n":"Gly","y2":73.789,"z2":15.165,"x2":14.835,"h":false,"x1":16.228},{"s":false,"z1":12.724,"a":false,"y1":72.641,"n":"Asp","y2":70.316,"z2":13.173,"x2":16.003,"h":false,"x1":15.619},{"s":true,"z1":14.269,"a":false,"y1":70.76,"n":"Val","y2":72.51,"z2":15.403,"x2":19.792,"h":false,"x1":18.546},{"s":true,"z1":17.395,"a":false,"y1":70.771,"n":"Ala","y2":68.544,"z2":17.084,"x2":21.482,"h":false,"x1":20.616},{"s":true,"z1":17.679,"a":false,"y1":69.224,"n":"Phe","y2":70.001,"z2":19.659,"x2":25.112,"h":false,"x1":24.074},{"s":true,"z1":21.174,"a":true,"y1":67.762,"n":"Val","y2":65.653,"z2":20.471,"x2":25.286,"h":false,"x1":24.438},{"s":true,"z1":22.966,"a":false,"y1":64.552,"n":"Lys","y2":63.945,"z2":22.777,"x2":23.124,"h":false,"x1":25.449},{"s":false,"z1":22.983,"a":false,"y1":61.178,"n":"Glu","y2":60.394,"z2":24.026,"x2":21.593,"h":false,"x1":23.633},{"s":false,"z1":26.415,"a":false,"y1":61.644,"n":"Thr","y2":62.869,"z2":27.548,"x2":20.287,"h":false,"x1":21.947},{"s":false,"z1":25.946,"a":false,"y1":65.208,"n":"Thr","y2":65.768,"z2":26.638,"x2":18.35,"h":true,"x1":20.605},{"s":false,"z1":24.774,"a":false,"y1":64.147,"n":"Val","y2":63.355,"z2":26.085,"x2":15.287,"h":true,"x1":17.15},{"s":false,"z1":27.548,"a":false,"y1":61.64,"n":"Phe","y2":62.094,"z2":29.684,"x2":15.875,"h":true,"x1":16.841},{"s":false,"z1":30.234,"a":true,"y1":64.147,"n":"Glu","y2":65.851,"z2":31.284,"x2":16.291,"h":true,"x1":17.609},{"s":false,"z1":28.934,"a":false,"y1":66.643,"n":"Asn","y2":66.926,"z2":29.022,"x2":12.722,"h":true,"x1":15.101},{"s":false,"z1":27.973,"a":false,"y1":64.483,"n":"Leu","y2":62.126,"z2":27.943,"x2":12.297,"h":false,"x1":12.104},{"s":false,"z1":30.757,"a":false,"y1":61.841,"n":"Pro","y2":59.55,"z2":30.267,"x2":10.919,"h":false,"x1":11.524},{"s":false,"z1":29.079,"a":false,"y1":60.165,"n":"Glu","y2":60.931,"z2":26.939,"x2":9.366,"h":false,"x1":8.598},{"s":false,"z1":25.779,"a":false,"y1":58.343,"n":"Lys","y2":59.245,"z2":23.618,"x2":8.602,"h":true,"x1":8.991},{"s":false,"z1":24.264,"a":false,"y1":60.08,"n":"Ala","y2":61.663,"z2":22.464,"x2":6.204,"h":true,"x1":5.905},{"s":false,"z1":24.037,"a":false,"y1":63.417,"n":"Asp","y2":63.854,"z2":22.357,"x2":9.385,"h":true,"x1":7.697},{"s":false,"z1":23.042,"a":false,"y1":61.576,"n":"Arg","y2":60.653,"z2":20.919,"x2":11.554,"h":true,"x1":10.875},{"s":false,"z1":20.207,"a":true,"y1":59.984,"n":"Asp","y2":60.641,"z2":17.93,"x2":8.789,"h":true,"x1":8.944},{"s":false,"z1":18.485,"a":false,"y1":63.355,"n":"Gln","y2":64.807,"z2":17.144,"x2":10.122,"h":true,"x1":8.689},{"s":true,"z1":17.805,"a":false,"y1":63.473,"n":"Tyr","y2":61.165,"z2":17.162,"x2":12.752,"h":false,"x1":12.485},{"s":true,"z1":15.565,"a":true,"y1":61.65,"n":"Glu","y2":63.087,"z2":15.933,"x2":16.934,"h":false,"x1":15.009},{"s":true,"z1":14.676,"a":false,"y1":61.302,"n":"Leu","y2":60.228,"z2":12.554,"x2":18.793,"h":false,"x1":18.715},{"s":false,"z1":11.403,"a":false,"y1":62.23,"n":"Leu","y2":61.613,"z2":11.978,"x2":22.621,"h":false,"x1":20.363},{"s":false,"z1":10.541,"a":false,"y1":59.415,"n":"Cys","y2":60.628,"z2":8.505,"x2":23.125,"h":false,"x1":22.727},{"s":false,"z1":8.48,"a":false,"y1":59.724,"n":"Leu","y2":59.908,"z2":6.102,"x2":26.094,"h":false,"x1":25.902},{"s":false,"z1":5.595,"a":false,"y1":57.627,"n":"Asn","y2":57.919,"z2":3.866,"x2":22.871,"h":false,"x1":24.532},{"s":false,"z1":5.085,"a":false,"y1":60.405,"n":"Asn","y2":59.93,"z2":4.349,"x2":19.69,"h":false,"x1":21.942},{"s":false,"z1":6.692,"a":false,"y1":58.455,"n":"Ser","y2":60.44,"z2":8.023,"x2":18.799,"h":false,"x1":19.189},{"s":false,"z1":9.983,"a":false,"y1":58.965,"n":"Arg","y2":56.644,"z2":10.486,"x2":17.09,"h":false,"x1":17.391},{"s":false,"z1":13.211,"a":false,"y1":56.944,"n":"Ala","y2":58.612,"z2":14.767,"x2":16.161,"h":false,"x1":16.872},{"s":false,"z1":16.671,"a":false,"y1":56.859,"n":"Pro","y2":56.694,"z2":17.488,"x2":17.461,"h":false,"x1":15.185},{"s":false,"z1":19.711,"a":false,"y1":58.464,"n":"Val","y2":57.737,"z2":21.114,"x2":18.753,"h":false,"x1":16.932},{"s":false,"z1":21.471,"a":false,"y1":55.178,"n":"Asp","y2":53.414,"z2":21.15,"x2":19.445,"h":false,"x1":17.841},{"s":false,"z1":18.402,"a":false,"y1":54.021,"n":"Ala","y2":54.982,"z2":16.933,"x2":21.422,"h":false,"x1":19.771},{"s":false,"z1":19.046,"a":false,"y1":56.567,"n":"Phe","y2":56.475,"z2":17.97,"x2":24.704,"h":false,"x1":22.553},{"s":false,"z1":19.13,"a":false,"y1":53.913,"n":"Lys","y2":52.749,"z2":17.419,"x2":26.572,"h":false,"x1":25.315},{"s":false,"z1":15.46,"a":false,"y1":53.375,"n":"Glu","y2":54.612,"z2":13.409,"x2":24.386,"h":false,"x1":24.597},{"s":false,"z1":14.532,"a":false,"y1":56.776,"n":"Cys","y2":59.028,"z2":15.432,"x2":23.273,"h":false,"x1":23.292},{"s":false,"z1":15.886,"a":false,"y1":59.12,"n":"His","y2":59.118,"z2":13.71,"x2":26.957,"h":false,"x1":25.956},{"s":false,"z1":14.216,"a":false,"y1":61.286,"n":"Leu","y2":60.724,"z2":13.558,"x2":30.754,"h":false,"x1":28.527},{"s":true,"z1":16.266,"a":false,"y1":60.459,"n":"Ala","y2":60.671,"z2":18.488,"x2":30.757,"h":false,"x1":31.642},{"s":true,"z1":19.677,"a":false,"y1":59.179,"n":"Gln","y2":60.263,"z2":19.605,"x2":34.859,"h":false,"x1":32.702},{"s":true,"z1":21.629,"a":true,"y1":61.953,"n":"Val","y2":61.071,"z2":23.737,"x2":33.863,"h":false,"x1":34.342},{"s":true,"z1":24.746,"a":false,"y1":61.668,"n":"Pro","y2":63.73,"z2":25.388,"x2":35.444,"h":false,"x1":36.487},{"s":false,"z1":27.972,"a":false,"y1":62.73,"n":"Ser","y2":64.262,"z2":28.207,"x2":36.78,"h":false,"x1":34.886},{"s":false,"z1":29.727,"a":false,"y1":66.089,"n":"His","y2":64.85,"z2":31.623,"x2":35.995,"h":false,"x1":35.258},{"s":true,"z1":31.99,"a":false,"y1":66.396,"n":"Ala","y2":68.758,"z2":32.38,"x2":38.3,"h":false,"x1":38.239},{"s":true,"z1":34.94,"a":false,"y1":68.458,"n":"Val","y2":67.798,"z2":34.448,"x2":41.516,"h":false,"x1":39.283},{"s":true,"z1":34.279,"a":false,"y1":70.342,"n":"Val","y2":71.868,"z2":36.124,"x2":42.55,"h":false,"x1":42.489},{"s":true,"z1":36.369,"a":true,"y1":71.614,"n":"Ala","y2":71.591,"z2":34.511,"x2":46.881,"h":false,"x1":45.35},{"s":true,"z1":36.029,"a":false,"y1":72.874,"n":"Arg","y2":70.653,"z2":36.664,"x2":49.568,"h":false,"x1":48.859},{"s":false,"z1":34.708,"a":false,"y1":70.7,"n":"Ser","y2":69.673,"z2":36.032,"x2":53.402,"h":false,"x1":51.678},{"s":false,"z1":37.344,"a":false,"y1":72.086,"n":"Val","y2":73.875,"z2":38.232,"x2":52.712,"h":false,"x1":53.989},{"s":false,"z1":40.894,"a":false,"y1":72.662,"n":"Asp","y2":73.522,"z2":41.426,"x2":50.597,"h":false,"x1":52.719},{"s":false,"z1":39.741,"a":false,"y1":71.756,"n":"Gly","y2":71.816,"z2":40.621,"x2":46.973,"h":false,"x1":49.186},{"s":false,"z1":43.203,"a":false,"y1":70.659,"n":"Lys","y2":69.302,"z2":43.537,"x2":45.929,"h":false,"x1":47.866},{"s":false,"z1":41.502,"a":false,"y1":67.402,"n":"Glu","y2":65.579,"z2":42.378,"x2":45.46,"h":true,"x1":46.735},{"s":false,"z1":44.738,"a":false,"y1":65.437,"n":"Asp","y2":65.018,"z2":45.903,"x2":44.928,"h":true,"x1":46.953},{"s":false,"z1":46.572,"a":false,"y1":67.782,"n":"Leu","y2":67.493,"z2":46.367,"x2":42.284,"h":true,"x1":44.64},{"s":false,"z1":43.524,"a":false,"y1":68.001,"n":"Ile","y2":66.551,"z2":43.505,"x2":40.521,"h":true,"x1":42.432},{"s":false,"z1":43.375,"a":false,"y1":64.25,"n":"Trp","y2":63.182,"z2":44.669,"x2":40.312,"h":true,"x1":42.049},{"s":false,"z1":47.165,"a":false,"y1":64.028,"n":"Lys","y2":63.861,"z2":47.954,"x2":39.274,"h":true,"x1":41.529},{"s":false,"z1":47.009,"a":false,"y1":66.498,"n":"Leu","y2":65.765,"z2":46.51,"x2":36.587,"h":true,"x1":38.786},{"s":false,"z1":43.958,"a":false,"y1":64.846,"n":"Leu","y2":62.992,"z2":43.869,"x2":35.767,"h":true,"x1":37.238},{"s":false,"z1":45.407,"a":false,"y1":61.421,"n":"Ser","y2":60.588,"z2":46.442,"x2":35.364,"h":true,"x1":37.344},{"s":false,"z1":48.671,"a":false,"y1":62.252,"n":"Lys","y2":62.464,"z2":48.971,"x2":33.261,"h":true,"x1":35.611},{"s":false,"z1":46.988,"a":false,"y1":64.497,"n":"Ala","y2":63.562,"z2":46.469,"x2":30.901,"h":true,"x1":33.032},{"s":false,"z1":44.617,"a":false,"y1":61.773,"n":"Gln","y2":59.965,"z2":45.203,"x2":30.552,"h":true,"x1":32.046},{"s":false,"z1":47.51,"a":true,"y1":59.355,"n":"Glu","y2":59.03,"z2":49.075,"x2":30.167,"h":true,"x1":31.961},{"s":false,"z1":49.615,"a":false,"y1":61.646,"n":"Lys","y2":62.008,"z2":49.442,"x2":27.494,"h":true,"x1":29.838},{"s":false,"z1":47.287,"a":false,"y1":63.632,"n":"Phe","y2":64.137,"z2":45.016,"x2":27.326,"h":false,"x1":27.623},{"s":false,"z1":44.137,"a":false,"y1":61.654,"n":"Gly","y2":61.909,"z2":43.959,"x2":25.527,"h":false,"x1":27.921},{"s":false,"z1":41.889,"a":false,"y1":60.073,"n":"Lys","y2":58.111,"z2":43.27,"x2":25.381,"h":false,"x1":25.353},{"s":false,"z1":44.261,"a":false,"y1":58.72,"n":"Asn","y2":57.605,"z2":46.332,"x2":23.256,"h":false,"x1":22.663},{"s":false,"z1":47.394,"a":false,"y1":59.601,"n":"Lys","y2":60.016,"z2":49.695,"x2":24.236,"h":false,"x1":24.671},{"s":false,"z1":49.319,"a":false,"y1":62.317,"n":"Ser","y2":63.182,"z2":47.727,"x2":21.206,"h":false,"x1":22.816},{"s":false,"z1":49.778,"a":false,"y1":64.212,"n":"Arg","y2":66.378,"z2":48.877,"x2":19.067,"h":false,"x1":19.573},{"s":false,"z1":50.43,"a":false,"y1":67.663,"n":"Ser","y2":69.308,"z2":48.707,"x2":21.402,"h":false,"x1":21.036},{"s":false,"z1":47.74,"a":false,"y1":68.102,"n":"Phe","y2":65.952,"z2":46.921,"x2":24.327,"h":false,"x1":23.653},{"s":false,"z1":44.242,"a":false,"y1":66.681,"n":"Gln","y2":68.474,"z2":42.865,"x2":24.913,"h":false,"x1":24.041},{"s":false,"z1":42.638,"a":false,"y1":67.198,"n":"Leu","y2":68.045,"z2":40.412,"x2":27.706,"h":false,"x1":27.488},{"s":false,"z1":39.314,"a":false,"y1":65.904,"n":"Phe","y2":65.758,"z2":38.034,"x2":24.315,"h":false,"x1":26.296},{"s":false,"z1":39.637,"a":false,"y1":67.584,"n":"Gly","y2":69.704,"z2":40.611,"x2":23.478,"h":false,"x1":22.95},{"s":false,"z1":38.612,"a":false,"y1":71.145,"n":"Ser","y2":70.75,"z2":37.656,"x2":19.921,"h":false,"x1":22.125},{"s":false,"z1":38.316,"a":false,"y1":73.502,"n":"Pro","y2":73.348,"z2":35.934,"x2":19.123,"h":false,"x1":18.974},{"s":false,"z1":35.58,"a":false,"y1":73.652,"n":"Pro","y2":76.001,"z2":35.603,"x2":16.453,"h":false,"x1":16.298},{"s":false,"z1":33.056,"a":false,"y1":76.173,"n":"Gly","y2":77.417,"z2":32.435,"x2":19.267,"h":false,"x1":17.321},{"s":false,"z1":34.071,"a":false,"y1":75.962,"n":"Gln","y2":74.233,"z2":35.545,"x2":21.806,"h":false,"x1":20.994},{"s":false,"z1":33.529,"a":false,"y1":72.442,"n":"Arg","y2":73.314,"z2":32.795,"x2":24.364,"h":false,"x1":22.268},{"s":false,"z1":33.9,"a":false,"y1":70.973,"n":"Asp","y2":72.598,"z2":33.862,"x2":27.428,"h":false,"x1":25.726},{"s":false,"z1":36.434,"a":false,"y1":73.35,"n":"Leu","y2":71.706,"z2":37.867,"x2":28.019,"h":false,"x1":27.073},{"s":false,"z1":37.249,"a":false,"y1":72.605,"n":"Leu","y2":71.252,"z2":35.962,"x2":32.284,"h":false,"x1":30.78},{"s":false,"z1":36.026,"a":false,"y1":69.036,"n":"Phe","y2":69.513,"z2":35.147,"x2":28.351,"h":false,"x1":30.52},{"s":false,"z1":33.621,"a":false,"y1":67.23,"n":"Lys","y2":66.095,"z2":35.605,"x2":27.431,"h":false,"x1":28.234},{"s":false,"z1":34.89,"a":false,"y1":66.251,"n":"Asp","y2":64.381,"z2":33.433,"x2":24.857,"h":false,"x1":24.824},{"s":false,"z1":35.659,"a":false,"y1":62.591,"n":"Ser","y2":60.885,"z2":34.475,"x2":25.603,"h":false,"x1":24.326},{"s":false,"z1":35.453,"a":false,"y1":61.852,"n":"Ala","y2":61.239,"z2":37.707,"x2":27.62,"h":false,"x1":28.02},{"s":false,"z1":37.561,"a":false,"y1":58.819,"n":"Leu","y2":58.988,"z2":39.686,"x2":29.984,"h":false,"x1":28.871},{"s":true,"z1":38.64,"a":false,"y1":60.03,"n":"Gly","y2":60.666,"z2":36.689,"x2":33.544,"h":false,"x1":32.27},{"s":true,"z1":38.076,"a":false,"y1":60.692,"n":"Phe","y2":58.865,"z2":38.92,"x2":37.204,"h":false,"x1":35.894},{"s":true,"z1":36.495,"a":true,"y1":58.582,"n":"Leu","y2":60.337,"z2":35.799,"x2":40.059,"h":false,"x1":38.563},{"s":true,"z1":37.617,"a":false,"y1":59.637,"n":"Arg","y2":58.176,"z2":36.042,"x2":43.19,"h":false,"x1":42.067},{"s":false,"z1":34.733,"a":false,"y1":60.292,"n":"Ile","y2":61.09,"z2":35.964,"x2":46.378,"h":false,"x1":44.488},{"s":false,"z1":34.701,"a":false,"y1":58.974,"n":"Pro","y2":60.964,"z2":33.396,"x2":48.574,"h":false,"x1":48.132},{"s":false,"z1":34.943,"a":false,"y1":61.636,"n":"Ser","y2":63.02,"z2":33.168,"x2":51.795,"h":false,"x1":50.925},{"s":false,"z1":31.488,"a":false,"y1":60.993,"n":"Lys","y2":61.699,"z2":29.256,"x2":51.788,"h":false,"x1":52.398},{"s":false,"z1":29.7,"a":false,"y1":61.496,"n":"Val","y2":63.572,"z2":30.667,"x2":48.448,"h":false,"x1":49.079},{"s":false,"z1":28.379,"a":false,"y1":64.986,"n":"Asp","y2":64.179,"z2":27.335,"x2":46.845,"h":false,"x1":48.849},{"s":false,"z1":26.693,"a":false,"y1":66.846,"n":"Ser","y2":65.947,"z2":24.868,"x2":44.768,"h":true,"x1":45.993},{"s":false,"z1":23.249,"a":false,"y1":65.589,"n":"Ala","y2":63.539,"z2":22.532,"x2":45.977,"h":true,"x1":46.985},{"s":false,"z1":24.486,"a":false,"y1":61.996,"n":"Leu","y2":60.48,"z2":24.567,"x2":45.55,"h":true,"x1":47.42},{"s":false,"z1":26.377,"a":true,"y1":62.168,"n":"Tyr","y2":61.394,"z2":25.208,"x2":42.178,"h":true,"x1":44.125},{"s":false,"z1":23.334,"a":false,"y1":63.479,"n":"Leu","y2":62.006,"z2":21.638,"x2":41.523,"h":true,"x1":42.312},{"s":false,"z1":20.994,"a":false,"y1":61.036,"n":"Gly","y2":62.565,"z2":19.22,"x2":43.363,"h":false,"x1":43.97},{"s":false,"z1":17.361,"a":false,"y1":61.286,"n":"Ser","y2":62.21,"z2":15.469,"x2":44.118,"h":true,"x1":45.236},{"s":false,"z1":15.865,"a":false,"y1":60.651,"n":"Arg","y2":62.595,"z2":15.006,"x2":40.633,"h":true,"x1":41.774},{"s":false,"z1":17.588,"a":false,"y1":63.641,"n":"Tyr","y2":65.84,"z2":16.801,"x2":40.644,"h":true,"x1":40.174},{"s":false,"z1":17.203,"a":false,"y1":65.497,"n":"Leu","y2":66.947,"z2":15.413,"x2":43.919,"h":true,"x1":43.428},{"s":false,"z1":13.478,"a":false,"y1":65.038,"n":"Thr","y2":67.042,"z2":12.456,"x2":42.663,"h":true,"x1":43.383},{"s":false,"z1":12.984,"a":false,"y1":66.354,"n":"Thr","y2":68.68,"z2":12.7,"x2":39.317,"h":true,"x1":39.826},{"s":false,"z1":15.209,"a":false,"y1":69.369,"n":"Leu","y2":71.382,"z2":14.15,"x2":41.272,"h":true,"x1":40.492},{"s":false,"z1":13.593,"a":false,"y1":70.239,"n":"Lys","y2":71.365,"z2":11.507,"x2":44.045,"h":true,"x1":43.784},{"s":false,"z1":10.102,"a":false,"y1":69.524,"n":"Asn","y2":71.115,"z2":8.611,"x2":41.459,"h":true,"x1":42.434},{"s":false,"z1":10.574,"a":true,"y1":72.267,"n":"Leu","y2":74.583,"z2":10.028,"x2":40.167,"h":true,"x1":39.849},{"s":false,"z1":11.335,"a":false,"y1":74.618,"n":"Arg","y2":75.879,"z2":9.812,"x2":44.073,"h":true,"x1":42.68},{"s":false,"z1":8.111,"a":false,"y1":73.735,"n":"Glu","y2":73.644,"z2":6.963,"x2":42.398,"h":false,"x1":44.501},{"s":false,"z1":4.501,"a":false,"y1":73.903,"n":"Thr","y2":71.596,"z2":4.495,"x2":44.11,"h":false,"x1":43.479},{"s":false,"z1":2.151,"a":false,"y1":71.073,"n":"Ala","y2":69.396,"z2":1.662,"x2":44.194,"h":true,"x1":42.606},{"s":false,"z1":0.468,"a":false,"y1":71.217,"n":"Glu","y2":70.144,"z2":1.245,"x2":47.895,"h":true,"x1":45.923},{"s":false,"z1":3.779,"a":false,"y1":71.359,"n":"Glu","y2":69.307,"z2":4.749,"x2":48.546,"h":true,"x1":47.779},{"s":false,"z1":4.919,"a":false,"y1":68.361,"n":"Val","y2":66.222,"z2":4.429,"x2":46.801,"h":true,"x1":45.829},{"s":false,"z1":1.598,"a":false,"y1":66.622,"n":"Lys","y2":65.119,"z2":1.638,"x2":48.348,"h":true,"x1":46.467},{"s":false,"z1":1.86,"a":false,"y1":67.318,"n":"Ala","y2":65.918,"z2":3.035,"x2":51.76,"h":true,"x1":50.218},{"s":false,"z1":5.476,"a":false,"y1":66.163,"n":"Arg","y2":63.948,"z2":5.97,"x2":51.099,"h":true,"x1":50.343},{"s":false,"z1":4.624,"a":true,"y1":62.723,"n":"Tyr","y2":60.918,"z2":3.811,"x2":50.341,"h":true,"x1":48.99},{"s":false,"z1":1.709,"a":false,"y1":62.417,"n":"Thr","y2":61.425,"z2":1.934,"x2":53.531,"h":true,"x1":51.349},{"s":false,"z1":3.651,"a":false,"y1":63.384,"n":"Arg","y2":62.088,"z2":5.498,"x2":53.592,"h":false,"x1":54.438},{"s":true,"z1":6.095,"a":false,"y1":61.089,"n":"Val","y2":62.404,"z2":6.656,"x2":58.012,"h":false,"x1":56.086},{"s":true,"z1":9.23,"a":false,"y1":62.616,"n":"Val","y2":60.851,"z2":10.809,"x2":57.596,"h":false,"x1":57.373},{"s":true,"z1":10.585,"a":false,"y1":60.758,"n":"Trp","y2":62.541,"z2":12.027,"x2":61.018,"h":false,"x1":60.345},{"s":true,"z1":14.288,"a":false,"y1":61.028,"n":"Cys","y2":59.625,"z2":14.49,"x2":63.258,"h":false,"x1":61.248},{"s":true,"z1":15.101,"a":true,"y1":61.788,"n":"Ala","y2":62.791,"z2":17.264,"x2":64.709,"h":false,"x1":64.911},{"s":true,"z1":18.558,"a":false,"y1":61.096,"n":"Val","y2":61.365,"z2":18.233,"x2":68.794,"h":false,"x1":66.396},{"s":false,"z1":19.386,"a":false,"y1":63.753,"n":"Gly","y2":64.475,"z2":17.057,"x2":68.768,"h":false,"x1":68.956},{"s":false,"z1":17.505,"a":false,"y1":66.45,"n":"Pro","y2":66.402,"z2":15.104,"x2":71.245,"h":true,"x1":70.998},{"s":false,"z1":15.154,"a":false,"y1":64.242,"n":"Glu","y2":63.596,"z2":12.962,"x2":72.333,"h":true,"x1":73.095},{"s":false,"z1":14.048,"a":false,"y1":62.266,"n":"Glu","y2":62.919,"z2":12.131,"x2":68.794,"h":true,"x1":70.065},{"s":false,"z1":13.267,"a":false,"y1":65.468,"n":"Gln","y2":66.263,"z2":10.986,"x2":68.171,"h":true,"x1":68.186},{"s":false,"z1":10.996,"a":false,"y1":66.588,"n":"Lys","y2":66.06,"z2":8.674,"x2":71.046,"h":true,"x1":71.034},{"s":false,"z1":9.155,"a":false,"y1":63.332,"n":"Lys","y2":63.112,"z2":7.277,"x2":69.482,"h":true,"x1":70.93},{"s":false,"z1":8.849,"a":false,"y1":63.538,"n":"Cys","y2":64.564,"z2":6.936,"x2":66.137,"h":true,"x1":67.175},{"s":false,"z1":7.506,"a":false,"y1":67.089,"n":"Gln","y2":67.577,"z2":5.175,"x2":67.542,"h":true,"x1":67.334},{"s":false,"z1":4.888,"a":false,"y1":65.954,"n":"Gln","y2":65.234,"z2":2.768,"x2":68.999,"h":true,"x1":69.824},{"s":false,"z1":3.97,"a":false,"y1":63.148,"n":"Trp","y2":63.621,"z2":2.178,"x2":65.979,"h":true,"x1":67.462},{"s":false,"z1":3.776,"a":false,"y1":65.527,"n":"Ser","y2":66.378,"z2":1.569,"x2":63.907,"h":true,"x1":64.502},{"s":false,"z1":1.41,"a":true,"y1":67.957,"n":"Gln","y2":67.546,"z2":-0.946,"x2":66.206,"h":true,"x1":66.271},{"s":false,"z1":-0.669,"a":false,"y1":65.085,"n":"Gln","y2":63.988,"z2":-2.351,"x2":66.268,"h":true,"x1":67.562},{"s":false,"z1":-0.665,"a":false,"y1":63.516,"n":"Ser","y2":64.075,"z2":-1.71,"x2":62.074,"h":false,"x1":64.11},{"s":false,"z1":-1.906,"a":false,"y1":66.809,"n":"Gly","y2":67.326,"z2":-1.644,"x2":60.342,"h":false,"x1":62.668},{"s":false,"z1":1.241,"a":false,"y1":67.123,"n":"Gln","y2":66.271,"z2":1.639,"x2":58.392,"h":false,"x1":60.591},{"s":false,"z1":0.769,"a":false,"y1":63.693,"n":"Asn","y2":62.515,"z2":2.62,"x2":58.002,"h":false,"x1":59.029},{"s":true,"z1":4.223,"a":false,"y1":62.837,"n":"Val","y2":65.012,"z2":4.484,"x2":61.268,"h":false,"x1":60.328},{"s":true,"z1":6.986,"a":false,"y1":65.45,"n":"Thr","y2":63.82,"z2":8.703,"x2":60.307,"h":false,"x1":60.006},{"s":true,"z1":10.427,"a":false,"y1":65.447,"n":"Cys","y2":67.127,"z2":11.58,"x2":60.385,"h":false,"x1":61.667},{"s":true,"z1":14.002,"a":false,"y1":65.726,"n":"Ala","y2":64.203,"z2":14.617,"x2":62.364,"h":false,"x1":60.643},{"s":true,"z1":16.882,"a":true,"y1":65.467,"n":"Thr","y2":66.347,"z2":18.761,"x2":61.813,"h":false,"x1":62.99},{"s":true,"z1":20.427,"a":false,"y1":64.351,"n":"Ala","y2":63.607,"z2":20.275,"x2":65.047,"h":false,"x1":62.767},{"s":false,"z1":22.918,"a":false,"y1":63.966,"n":"Ser","y2":62.028,"z2":23.545,"x2":66.87,"h":false,"x1":65.586},{"s":false,"z1":23.73,"a":false,"y1":60.356,"n":"Thr","y2":60.25,"z2":22.083,"x2":62.973,"h":false,"x1":64.701},{"s":false,"z1":21.93,"a":false,"y1":57.439,"n":"Thr","y2":57.284,"z2":21.521,"x2":60.816,"h":true,"x1":63.165},{"s":false,"z1":24.285,"a":false,"y1":57.375,"n":"Asp","y2":58.448,"z2":23.583,"x2":58.157,"h":true,"x1":60.228},{"s":false,"z1":23.42,"a":false,"y1":61.009,"n":"Asp","y2":61.538,"z2":21.641,"x2":57.939,"h":true,"x1":59.433},{"s":false,"z1":19.796,"a":false,"y1":60.068,"n":"Cys","y2":59.336,"z2":18.631,"x2":57.55,"h":true,"x1":59.494},{"s":false,"z1":20.468,"a":false,"y1":57.274,"n":"Ile","y2":57.822,"z2":19.956,"x2":54.733,"h":true,"x1":56.997},{"s":false,"z1":22.118,"a":false,"y1":59.762,"n":"Val","y2":60.846,"z2":20.77,"x2":53.113,"h":true,"x1":54.739},{"s":false,"z1":19.074,"a":false,"y1":62.027,"n":"Leu","y2":61.858,"z2":17.127,"x2":53.573,"h":true,"x1":54.993},{"s":false,"z1":16.809,"a":false,"y1":59.124,"n":"Val","y2":58.967,"z2":16.257,"x2":51.727,"h":true,"x1":54.058},{"s":false,"z1":19.045,"a":true,"y1":58.446,"n":"Leu","y2":59.553,"z2":18.655,"x2":48.987,"h":true,"x1":51.095},{"s":false,"z1":18.835,"a":false,"y1":62.119,"n":"Lys","y2":63.313,"z2":17.082,"x2":49.043,"h":true,"x1":50.123},{"s":false,"z1":15.082,"a":false,"y1":62.074,"n":"Gly","y2":63.532,"z2":13.395,"x2":51.234,"h":false,"x1":50.385},{"s":false,"z1":15.133,"a":false,"y1":64.693,"n":"Glu","y2":64.897,"z2":13.4,"x2":54.801,"h":false,"x1":53.131},{"s":false,"z1":13.629,"a":false,"y1":62.196,"n":"Ala","y2":60.575,"z2":13.6,"x2":53.782,"h":false,"x1":55.555},{"s":false,"z1":11.457,"a":false,"y1":59.179,"n":"Asp","y2":56.87,"z2":12.12,"x2":54.906,"h":false,"x1":54.815},{"s":true,"z1":12.075,"a":false,"y1":56.702,"n":"Ala","y2":58.121,"z2":12.505,"x2":59.575,"h":false,"x1":57.653},{"s":true,"z1":13.304,"a":false,"y1":55.741,"n":"Leu","y2":53.372,"z2":13.623,"x2":60.647,"h":false,"x1":61.128},{"s":true,"z1":13.288,"a":true,"y1":52.631,"n":"Asn","y2":53.258,"z2":15.427,"x2":64.253,"h":false,"x1":63.347},{"s":true,"z1":16.733,"a":false,"y1":50.989,"n":"Leu","y2":48.674,"z2":16.399,"x2":63.943,"h":false,"x1":63.603},{"s":false,"z1":18.794,"a":false,"y1":48.419,"n":"Asp","y2":48.321,"z2":19.899,"x2":63.38,"h":false,"x1":65.502},{"s":false,"z1":19.923,"a":false,"y1":45.45,"n":"Gly","y2":45.488,"z2":21.428,"x2":61.544,"h":true,"x1":63.374},{"s":false,"z1":23.561,"a":false,"y1":46.522,"n":"Gly","y2":47.984,"z2":24.393,"x2":61.253,"h":true,"x1":63.005},{"s":false,"z1":22.421,"a":false,"y1":49.844,"n":"Tyr","y2":50.214,"z2":21.833,"x2":59.333,"h":true,"x1":61.629},{"s":false,"z1":20.025,"a":false,"y1":47.982,"n":"Ile","y2":47.626,"z2":20.593,"x2":57.053,"h":true,"x1":59.357},{"s":false,"z1":23.044,"a":false,"y1":46.346,"n":"Tyr","y2":47.334,"z2":23.894,"x2":55.714,"h":true,"x1":57.751},{"s":false,"z1":24.465,"a":false,"y1":49.764,"n":"Thr","y2":50.732,"z2":23.869,"x2":54.93,"h":true,"x1":57.016},{"s":false,"z1":21.149,"a":false,"y1":51.001,"n":"Ala","y2":50.698,"z2":20.411,"x2":53.385,"h":true,"x1":55.672},{"s":false,"z1":20.639,"a":false,"y1":47.909,"n":"Gly","y2":47.803,"z2":21.473,"x2":51.277,"h":true,"x1":53.511},{"s":false,"z1":24.083,"a":true,"y1":48.351,"n":"Lys","y2":49.926,"z2":24.937,"x2":50.435,"h":true,"x1":52.04},{"s":false,"z1":22.939,"a":false,"y1":51.791,"n":"Cys","y2":52.643,"z2":21.107,"x2":49.752,"h":true,"x1":51.004},{"s":false,"z1":19.794,"a":false,"y1":50.272,"n":"Gly","y2":50.454,"z2":17.443,"x2":49.592,"h":false,"x1":49.646},{"s":false,"z1":17.127,"a":false,"y1":50.972,"n":"Leu","y2":48.618,"z2":17.213,"x2":52.691,"h":false,"x1":52.281},{"s":true,"z1":14.542,"a":false,"y1":48.282,"n":"Val","y2":49.375,"z2":13.331,"x2":54.578,"h":false,"x1":52.861},{"s":true,"z1":12.759,"a":false,"y1":46.986,"n":"Pro","y2":46.632,"z2":10.817,"x2":54.585,"h":false,"x1":55.939},{"s":true,"z1":9.141,"a":false,"y1":47.914,"n":"Val","y2":46.443,"z2":7.43,"x2":57.105,"h":false,"x1":56.346},{"s":true,"z1":7.931,"a":false,"y1":46.951,"n":"Leu","y2":47.607,"z2":9.838,"x2":61.062,"h":false,"x1":59.773},{"s":true,"z1":9.599,"a":false,"y1":45.379,"n":"Ala","y2":45.504,"z2":7.635,"x2":64.154,"h":false,"x1":62.804},{"s":true,"z1":9.123,"a":false,"y1":46.021,"n":"Glu","y2":43.681,"z2":9.519,"x2":66.942,"h":false,"x1":66.515},{"s":true,"z1":7.067,"a":true,"y1":43.351,"n":"Asn","y2":44.521,"z2":5.654,"x2":69.726,"h":false,"x1":68.195},{"s":true,"z1":6.692,"a":false,"y1":43.15,"n":"Arg","y2":41.19,"z2":5.358,"x2":71.478,"h":false,"x1":71.974},{"s":false,"z1":4.615,"a":false,"y1":40.834,"n":"Lys","y2":39.4,"z2":6.529,"x2":74.707,"h":false,"x1":74.225},{"s":false,"z1":5.307,"a":false,"y1":37.112,"n":"Ser","y2":36.807,"z2":4.126,"x2":75.751,"h":false,"x1":73.645},{"s":false,"z1":4.889,"a":false,"y1":34.144,"n":"Ser","y2":32.8,"z2":2.939,"x2":76.448,"h":false,"x1":75.969},{"s":false,"z1":2.452,"a":false,"y1":32.238,"n":"Lys","y2":32.796,"z2":0.113,"x2":74.139,"h":false,"x1":73.748},{"s":false,"z1":-0.182,"a":false,"y1":34.242,"n":"His","y2":36.339,"z2":0.016,"x2":72.932,"h":false,"x1":71.734},{"s":false,"z1":-2.939,"a":false,"y1":36.564,"n":"Ser","y2":37.662,"z2":-4.838,"x2":71.687,"h":false,"x1":72.8},{"s":false,"z1":-4.945,"a":false,"y1":35.276,"n":"Ser","y2":36.908,"z2":-5.526,"x2":68.198,"h":false,"x1":69.872},{"s":false,"z1":-3.019,"a":false,"y1":36.375,"n":"Leu","y2":38.003,"z2":-2.028,"x2":68.293,"h":false,"x1":66.829},{"s":false,"z1":-2.83,"a":false,"y1":40.174,"n":"Asp","y2":39.776,"z2":-0.695,"x2":65.586,"h":false,"x1":66.554},{"s":false,"z1":0.55,"a":false,"y1":41.766,"n":"Cys","y2":41.874,"z2":2.376,"x2":65.797,"h":false,"x1":67.358},{"s":false,"z1":0.711,"a":false,"y1":43.162,"n":"Val","y2":41.932,"z2":1.889,"x2":62.094,"h":false,"x1":63.805},{"s":false,"z1":0.267,"a":false,"y1":39.713,"n":"Leu","y2":37.657,"z2":1.519,"x2":62.466,"h":false,"x1":62.335},{"s":false,"z1":2.247,"a":false,"y1":38.039,"n":"Arg","y2":39.362,"z2":4.222,"x2":64.682,"h":false,"x1":65.13},{"s":false,"z1":5.912,"a":false,"y1":37.04,"n":"Pro","y2":37.465,"z2":6.443,"x2":66.792,"h":false,"x1":64.471},{"s":false,"z1":8.873,"a":false,"y1":38.698,"n":"Thr","y2":36.574,"z2":9.908,"x2":65.978,"h":false,"x1":66.108},{"s":false,"z1":10.838,"a":false,"y1":36.618,"n":"Glu","y2":35.961,"z2":13.136,"x2":68.332,"h":false,"x1":68.488},{"s":false,"z1":14.118,"a":false,"y1":38.457,"n":"Gly","y2":38,"z2":14.033,"x2":71.06,"h":false,"x1":68.721},{"s":true,"z1":16.01,"a":false,"y1":39.663,"n":"Tyr","y2":38.497,"z2":17.963,"x2":71.127,"h":false,"x1":71.741},{"s":true,"z1":18.677,"a":false,"y1":38.018,"n":"Leu","y2":39.873,"z2":19.617,"x2":74.942,"h":false,"x1":73.784},{"s":true,"z1":22.107,"a":false,"y1":39.602,"n":"Ala","y2":37.904,"z2":23.248,"x2":75.014,"h":false,"x1":73.739},{"s":true,"z1":23.745,"a":false,"y1":39.544,"n":"Val","y2":41.547,"z2":25.117,"x2":77.094,"h":false,"x1":77.181},{"s":true,"z1":26.931,"a":true,"y1":40.486,"n":"Ala","y2":39.389,"z2":26.764,"x2":81.221,"h":false,"x1":79.078},{"s":true,"z1":26.079,"a":false,"y1":41.797,"n":"Val","y2":43.383,"z2":27.888,"x2":82.965,"h":false,"x1":82.54},{"s":true,"z1":28.333,"a":true,"y1":42.406,"n":"Val","y2":42.191,"z2":26.472,"x2":87.045,"h":false,"x1":85.532},{"s":true,"z1":27.896,"a":false,"y1":43.2,"n":"Lys","y2":41.308,"z2":29.352,"x2":89.44,"h":false,"x1":89.252},{"s":false,"z1":27.777,"a":false,"y1":40.071,"n":"Lys","y2":39.211,"z2":29.832,"x2":92.35,"h":false,"x1":91.449},{"s":false,"z1":30.237,"a":false,"y1":41.634,"n":"Ala","y2":42.062,"z2":32.597,"x2":94.021,"h":false,"x1":93.913},{"s":false,"z1":33.144,"a":false,"y1":41.397,"n":"Asn","y2":39.751,"z2":33.261,"x2":89.781,"h":false,"x1":91.473},{"s":false,"z1":33.767,"a":false,"y1":37.698,"n":"Glu","y2":38.253,"z2":36.057,"x2":91.103,"h":false,"x1":91.681},{"s":false,"z1":36.312,"a":false,"y1":36.117,"n":"Gly","y2":36.819,"z2":37.193,"x2":87.242,"h":false,"x1":89.386},{"s":false,"z1":34.868,"a":false,"y1":37.958,"n":"Leu","y2":36.71,"z2":32.928,"x2":85.834,"h":false,"x1":86.479},{"s":false,"z1":34.227,"a":false,"y1":35.422,"n":"Thr","y2":37.094,"z2":35.052,"x2":82.287,"h":false,"x1":83.807},{"s":false,"z1":34.129,"a":false,"y1":35.704,"n":"Trp","y2":36.445,"z2":36.083,"x2":78.677,"h":false,"x1":79.97},{"s":false,"z1":37.786,"a":false,"y1":34.522,"n":"Asn","y2":36.09,"z2":39.597,"x2":79.869,"h":true,"x1":79.947},{"s":false,"z1":38.986,"a":true,"y1":37.226,"n":"Ser","y2":39.477,"z2":38.279,"x2":82.791,"h":true,"x1":82.332},{"s":false,"z1":37.624,"a":false,"y1":40.06,"n":"Leu","y2":42.268,"z2":38.216,"x2":79.512,"h":true,"x1":80.154},{"s":false,"z1":40.816,"a":false,"y1":41.632,"n":"Lys","y2":42.244,"z2":41.341,"x2":81.063,"h":false,"x1":78.827},{"s":false,"z1":41.798,"a":false,"y1":44.988,"n":"Asp","y2":46.095,"z2":41.247,"x2":82.353,"h":false,"x1":80.286},{"s":false,"z1":38.561,"a":false,"y1":45.494,"n":"Lys","y2":47.068,"z2":38.135,"x2":80.392,"h":false,"x1":82.128},{"s":true,"z1":36.235,"a":false,"y1":48.411,"n":"Lys","y2":47.067,"z2":34.266,"x2":81.6,"h":false,"x1":81.662},{"s":true,"z1":33.378,"a":false,"y1":47.981,"n":"Ser","y2":50.296,"z2":32.788,"x2":78.868,"h":false,"x1":79.215},{"s":true,"z1":30.045,"a":true,"y1":49.647,"n":"Cys","y2":47.87,"z2":28.893,"x2":77.334,"h":false,"x1":78.494},{"s":true,"z1":28.465,"a":false,"y1":49.345,"n":"His","y2":51.457,"z2":27.448,"x2":75.207,"h":false,"x1":75.061},{"s":false,"z1":25.112,"a":false,"y1":50.675,"n":"Thr","y2":52.955,"z2":24.996,"x2":72.998,"h":false,"x1":73.83},{"s":false,"z1":26.967,"a":false,"y1":52.262,"n":"Ala","y2":50.081,"z2":27.544,"x2":69.951,"h":false,"x1":70.818},{"s":false,"z1":29.272,"a":false,"y1":51.139,"n":"Val","y2":51.495,"z2":27.278,"x2":66.703,"h":false,"x1":68.007},{"s":false,"z1":27.755,"a":false,"y1":49.058,"n":"Asp","y2":48.209,"z2":25.618,"x2":64.729,"h":false,"x1":65.156},{"s":false,"z1":24.794,"a":false,"y1":48.067,"n":"Arg","y2":46.154,"z2":26.073,"x2":67.721,"h":false,"x1":67.251},{"s":false,"z1":23.846,"a":false,"y1":44.414,"n":"Thr","y2":43.282,"z2":25.448,"x2":69.075,"h":false,"x1":67.66},{"s":false,"z1":23.944,"a":false,"y1":43.836,"n":"Ala","y2":43.914,"z2":25.985,"x2":72.732,"h":false,"x1":71.447},{"s":false,"z1":26.373,"a":false,"y1":46.582,"n":"Gly","y2":46.839,"z2":28.705,"x2":72.063,"h":false,"x1":72.383},{"s":false,"z1":28.798,"a":false,"y1":46.076,"n":"Trp","y2":44.14,"z2":30.103,"x2":69.055,"h":false,"x1":69.544},{"s":false,"z1":28.521,"a":false,"y1":43.418,"n":"Asn","y2":41.296,"z2":29.62,"x2":66.876,"h":true,"x1":66.759},{"s":false,"z1":27.998,"a":false,"y1":40.334,"n":"Ile","y2":39.212,"z2":30.005,"x2":69.543,"h":true,"x1":68.952},{"s":false,"z1":30.679,"a":false,"y1":40.796,"n":"Pro","y2":40.326,"z2":32.948,"x2":71.202,"h":true,"x1":71.685},{"s":false,"z1":33.319,"a":false,"y1":42.541,"n":"Met","y2":41.317,"z2":34.827,"x2":68.183,"h":true,"x1":69.55},{"s":false,"z1":32.754,"a":false,"y1":40.063,"n":"Gly","y2":38.143,"z2":34.214,"x2":66.674,"h":true,"x1":66.707},{"s":false,"z1":33.197,"a":false,"y1":37.203,"n":"Leu","y2":36.372,"z2":35.429,"x2":69.725,"h":true,"x1":69.187},{"s":false,"z1":36.255,"a":false,"y1":38.827,"n":"Ile","y2":38.273,"z2":38.446,"x2":70.044,"h":true,"x1":70.831},{"s":false,"z1":37.996,"a":false,"y1":39.491,"n":"Val","y2":37.848,"z2":39.525,"x2":66.686,"h":true,"x1":67.511},{"s":false,"z1":37.448,"a":false,"y1":35.907,"n":"Asn","y2":34.161,"z2":38.935,"x2":67.097,"h":true,"x1":66.566},{"s":false,"z1":38.754,"a":true,"y1":34.614,"n":"Gln","y2":34.327,"z2":41.014,"x2":70.584,"h":true,"x1":69.817},{"s":false,"z1":41.724,"a":false,"y1":36.884,"n":"Thr","y2":36.195,"z2":43.628,"x2":68.761,"h":true,"x1":69.974},{"s":false,"z1":42.368,"a":false,"y1":36.346,"n":"Gly","y2":37.614,"z2":44.087,"x2":65.203,"h":false,"x1":66.32},{"s":false,"z1":43.077,"a":false,"y1":40.007,"n":"Ser","y2":40.626,"z2":40.805,"x2":65.916,"h":false,"x1":66.073},{"s":false,"z1":41.378,"a":false,"y1":43.15,"n":"Cys","y2":45.443,"z2":40.853,"x2":65.297,"h":false,"x1":64.802},{"s":false,"z1":42.556,"a":false,"y1":45.586,"n":"Ala","y2":45.427,"z2":42.104,"x2":69.854,"h":false,"x1":67.488},{"s":false,"z1":39.342,"a":false,"y1":45.873,"n":"Phe","y2":47.109,"z2":38.924,"x2":71.577,"h":true,"x1":69.533},{"s":false,"z1":40.459,"a":true,"y1":49.314,"n":"Asp","y2":49.609,"z2":41.335,"x2":72.762,"h":true,"x1":70.579},{"s":false,"z1":43.193,"a":false,"y1":47.698,"n":"Glu","y2":45.846,"z2":43.647,"x2":73.98,"h":true,"x1":72.555},{"s":false,"z1":41.098,"a":false,"y1":44.886,"n":"Phe","y2":44.635,"z2":41.47,"x2":76.433,"h":false,"x1":74.081},{"s":false,"z1":39.472,"a":false,"y1":46.514,"n":"Phe","y2":48.273,"z2":40.972,"x2":76.441,"h":false,"x1":77.066},{"s":false,"z1":41.442,"a":false,"y1":49.056,"n":"Ser","y2":51.375,"z2":41.518,"x2":78.421,"h":false,"x1":79.07},{"s":true,"z1":38.792,"a":false,"y1":51.76,"n":"Gln","y2":50.462,"z2":36.857,"x2":79.202,"h":false,"x1":78.744},{"s":true,"z1":35.299,"a":true,"y1":51.73,"n":"Ser","y2":54.09,"z2":35.074,"x2":77.234,"h":false,"x1":77.392},{"s":true,"z1":32.325,"a":false,"y1":53.808,"n":"Cys","y2":52.353,"z2":30.584,"x2":75.81,"h":false,"x1":76.635},{"s":false,"z1":31.149,"a":false,"y1":52.883,"n":"Ala","y2":54.465,"z2":31.833,"x2":71.627,"h":false,"x1":73.201},{"s":false,"z1":29.36,"a":false,"y1":55.962,"n":"Pro","y2":54.721,"z2":28.917,"x2":69.805,"h":false,"x1":71.788},{"s":false,"z1":30.35,"a":false,"y1":56.363,"n":"Gly","y2":56.177,"z2":32.142,"x2":66.59,"h":false,"x1":68.17},{"s":false,"z1":34.098,"a":false,"y1":55.746,"n":"Ala","y2":58.18,"z2":34.127,"x2":68.504,"h":false,"x1":68.476},{"s":false,"z1":36.92,"a":false,"y1":58.351,"n":"Asp","y2":57.97,"z2":37.37,"x2":70.65,"h":false,"x1":68.325},{"s":false,"z1":36.432,"a":false,"y1":60.633,"n":"Pro","y2":60.753,"z2":37.91,"x2":73.313,"h":false,"x1":71.418},{"s":false,"z1":40.14,"a":false,"y1":60.852,"n":"Lys","y2":59.301,"z2":41.831,"x2":72.398,"h":false,"x1":71.721},{"s":false,"z1":40.442,"a":false,"y1":57.071,"n":"Ser","y2":57.168,"z2":39.213,"x2":73.667,"h":false,"x1":71.614},{"s":false,"z1":40.156,"a":false,"y1":54.729,"n":"Arg","y2":53.638,"z2":38.328,"x2":75.827,"h":false,"x1":74.633},{"s":false,"z1":36.661,"a":false,"y1":53.504,"n":"Leu","y2":54.223,"z2":34.408,"x2":74.102,"h":false,"x1":73.556},{"s":false,"z1":35.225,"a":false,"y1":56.824,"n":"Cys","y2":58.023,"z2":34.698,"x2":76.45,"h":false,"x1":74.447},{"s":false,"z1":37.271,"a":false,"y1":57.139,"n":"Ala","y2":57.964,"z2":36.536,"x2":79.839,"h":false,"x1":77.687},{"s":false,"z1":34.362,"a":false,"y1":56.281,"n":"Leu","y2":56.813,"z2":32.059,"x2":80.454,"h":false,"x1":79.994},{"s":false,"z1":31.647,"a":false,"y1":58.215,"n":"Cys","y2":60.231,"z2":32.438,"x2":79.182,"h":false,"x1":78.196},{"s":false,"z1":29.941,"a":false,"y1":60.956,"n":"Ala","y2":63.357,"z2":30.065,"x2":79.974,"h":false,"x1":80.101},{"s":false,"z1":28.505,"a":false,"y1":63.585,"n":"Gly","y2":63.018,"z2":26.498,"x2":78.919,"h":false,"x1":77.742},{"s":false,"z1":25.5,"a":false,"y1":65.564,"n":"Asp","y2":65.4,"z2":26.685,"x2":81.095,"h":false,"x1":78.992},{"s":false,"z1":25.055,"a":false,"y1":67.074,"n":"Asp","y2":68.497,"z2":26.431,"x2":83.809,"h":false,"x1":82.429},{"s":false,"z1":27.589,"a":false,"y1":69.767,"n":"Gln","y2":69.555,"z2":29.943,"x2":81.008,"h":false,"x1":81.496},{"s":false,"z1":29.703,"a":false,"y1":66.937,"n":"Gly","y2":66.889,"z2":31.348,"x2":78.367,"h":false,"x1":80.118},{"s":false,"z1":29.776,"a":false,"y1":68.124,"n":"Leu","y2":66.438,"z2":28.179,"x2":76.09,"h":false,"x1":76.503},{"s":false,"z1":29.318,"a":false,"y1":65.875,"n":"Asp","y2":63.623,"z2":28.639,"x2":73.897,"h":false,"x1":73.432},{"s":false,"z1":31.06,"a":false,"y1":62.96,"n":"Lys","y2":62.434,"z2":31.9,"x2":73.016,"h":false,"x1":75.145},{"s":false,"z1":30.781,"a":false,"y1":59.691,"n":"Cys","y2":59.081,"z2":30.042,"x2":71.011,"h":false,"x1":73.213},{"s":false,"z1":28.036,"a":false,"y1":61.053,"n":"Val","y2":59.323,"z2":26.657,"x2":71.911,"h":false,"x1":70.948},{"s":false,"z1":25.649,"a":false,"y1":58.436,"n":"Pro","y2":58.533,"z2":23.481,"x2":68.678,"h":false,"x1":69.64},{"s":false,"z1":22.377,"a":false,"y1":59.769,"n":"Asn","y2":59.8,"z2":23.042,"x2":73.085,"h":false,"x1":70.822},{"s":false,"z1":20.294,"a":false,"y1":59.978,"n":"Ser","y2":60.979,"z2":20.676,"x2":76.132,"h":false,"x1":73.986},{"s":false,"z1":22.077,"a":false,"y1":63.124,"n":"Lys","y2":63.205,"z2":23.798,"x2":76.82,"h":false,"x1":75.169},{"s":false,"z1":25.136,"a":false,"y1":61.014,"n":"Glu","y2":59.219,"z2":23.782,"x2":76.774,"h":false,"x1":75.972},{"s":false,"z1":24.577,"a":false,"y1":59.661,"n":"Lys","y2":57.45,"z2":23.709,"x2":79.977,"h":false,"x1":79.533},{"s":false,"z1":25.772,"a":false,"y1":56.2,"n":"Tyr","y2":54.477,"z2":25.835,"x2":77.153,"h":false,"x1":78.816},{"s":false,"z1":24.279,"a":false,"y1":55.814,"n":"Tyr","y2":55.076,"z2":22.064,"x2":76.066,"h":false,"x1":75.346},{"s":false,"z1":21.976,"a":false,"y1":52.979,"n":"Gly","y2":51.659,"z2":22.965,"x2":76.061,"h":true,"x1":74.348},{"s":false,"z1":20.603,"a":false,"y1":50.083,"n":"Tyr","y2":49.893,"z2":21.18,"x2":78.607,"h":true,"x1":76.252},{"s":false,"z1":19.66,"a":false,"y1":52.221,"n":"Thr","y2":52.562,"z2":21.315,"x2":80.923,"h":true,"x1":79.201},{"s":false,"z1":22.908,"a":false,"y1":54.146,"n":"Gly","y2":53.524,"z2":24.872,"x2":80.457,"h":true,"x1":79.318},{"s":false,"z1":25.245,"a":false,"y1":51.174,"n":"Ala","y2":49.997,"z2":26.1,"x2":80.921,"h":true,"x1":79.011},{"s":false,"z1":23.535,"a":false,"y1":49.471,"n":"Phe","y2":49.927,"z2":24.432,"x2":84.145,"h":true,"x1":81.954},{"s":false,"z1":23.751,"a":false,"y1":52.748,"n":"Arg","y2":53.17,"z2":25.659,"x2":85.293,"h":true,"x1":83.866},{"s":false,"z1":27.452,"a":false,"y1":52.749,"n":"Cys","y2":51.781,"z2":28.966,"x2":84.752,"h":true,"x1":83.128},{"s":false,"z1":27.742,"a":true,"y1":49.307,"n":"Leu","y2":49.144,"z2":28.017,"x2":87.102,"h":true,"x1":84.711},{"s":false,"z1":25.367,"a":false,"y1":50.16,"n":"Ala","y2":51.061,"z2":26.103,"x2":89.68,"h":true,"x1":87.571},{"s":false,"z1":27.337,"a":false,"y1":53.245,"n":"Glu","y2":53.808,"z2":29.554,"x2":89.026,"h":false,"x1":88.497},{"s":false,"z1":30.475,"a":false,"y1":51.179,"n":"Asp","y2":51.951,"z2":32.734,"x2":88.007,"h":false,"x1":88.35},{"s":false,"z1":32.089,"a":false,"y1":53.207,"n":"Val","y2":52.362,"z2":33.942,"x2":84.315,"h":false,"x1":85.579},{"s":false,"z1":32.701,"a":false,"y1":49.997,"n":"Gly","y2":48.558,"z2":31.613,"x2":85.213,"h":false,"x1":83.637},{"s":false,"z1":33.096,"a":false,"y1":46.341,"n":"Asp","y2":44.479,"z2":31.599,"x2":84.47,"h":false,"x1":84.553},{"s":true,"z1":30.829,"a":false,"y1":44.896,"n":"Val","y2":46.822,"z2":30.422,"x2":80.51,"h":false,"x1":81.912},{"s":true,"z1":27.759,"a":false,"y1":45.997,"n":"Ala","y2":43.82,"z2":26.785,"x2":79.383,"h":false,"x1":79.972},{"s":true,"z1":26.799,"a":false,"y1":44.437,"n":"Phe","y2":46.034,"z2":25.419,"x2":75.512,"h":false,"x1":76.67},{"s":true,"z1":23.073,"a":true,"y1":44.932,"n":"Val","y2":42.634,"z2":22.656,"x2":75.887,"h":false,"x1":76.429},{"s":true,"z1":19.925,"a":false,"y1":42.849,"n":"Lys","y2":43.189,"z2":19.557,"x2":78.413,"h":false,"x1":76.064},{"s":false,"z1":18.085,"a":false,"y1":40.778,"n":"Asn","y2":41.981,"z2":17.223,"x2":80.612,"h":true,"x1":78.687},{"s":false,"z1":15.111,"a":false,"y1":43.169,"n":"Asp","y2":44.854,"z2":14.803,"x2":80.67,"h":true,"x1":79.05},{"s":false,"z1":17.261,"a":false,"y1":46.058,"n":"Thr","y2":46.823,"z2":17.274,"x2":82.375,"h":true,"x1":80.123},{"s":false,"z1":18.343,"a":false,"y1":44.364,"n":"Val","y2":44.704,"z2":17.063,"x2":85.239,"h":true,"x1":83.264},{"s":false,"z1":14.806,"a":true,"y1":43.497,"n":"Trp","y2":44.995,"z2":13.419,"x2":85.355,"h":true,"x1":84.141},{"s":false,"z1":13.422,"a":false,"y1":46.878,"n":"Glu","y2":48.988,"z2":13.415,"x2":84.359,"h":true,"x1":83.312},{"s":false,"z1":15.954,"a":false,"y1":48.749,"n":"Asn","y2":48.974,"z2":17.145,"x2":87.38,"h":false,"x1":85.305},{"s":false,"z1":15.962,"a":false,"y1":46.748,"n":"Thr","y2":46.425,"z2":13.583,"x2":88.338,"h":false,"x1":88.463},{"s":false,"z1":13.499,"a":false,"y1":45.917,"n":"Asn","y2":46.165,"z2":11.084,"x2":91.089,"h":false,"x1":91.221},{"s":false,"z1":11.227,"a":false,"y1":48.945,"n":"Gly","y2":49.816,"z2":9.495,"x2":89.716,"h":false,"x1":91.146},{"s":false,"z1":10.607,"a":false,"y1":48.742,"n":"Glu","y2":50.798,"z2":10.008,"x2":86.318,"h":false,"x1":87.399},{"s":false,"z1":12.549,"a":false,"y1":51.862,"n":"Ser","y2":52.398,"z2":12.648,"x2":88.968,"h":false,"x1":86.63},{"s":false,"z1":11.618,"a":false,"y1":54.916,"n":"Thr","y2":56.887,"z2":12.638,"x2":89.574,"h":false,"x1":88.644},{"s":false,"z1":14.795,"a":false,"y1":56.72,"n":"Ala","y2":55.362,"z2":15.945,"x2":89.286,"h":false,"x1":87.716},{"s":false,"z1":16.895,"a":false,"y1":57.667,"n":"Asp","y2":56.403,"z2":18.621,"x2":91.78,"h":false,"x1":90.714},{"s":false,"z1":20.014,"a":false,"y1":55.892,"n":"Trp","y2":53.591,"z2":20.46,"x2":90.066,"h":false,"x1":89.503},{"s":false,"z1":18.134,"a":false,"y1":52.646,"n":"Ala","y2":51.053,"z2":16.646,"x2":89.872,"h":false,"x1":88.891},{"s":false,"z1":15.533,"a":false,"y1":52.965,"n":"Lys","y2":51.293,"z2":15.038,"x2":93.334,"h":false,"x1":91.66},{"s":false,"z1":17.635,"a":false,"y1":51.228,"n":"Asn","y2":49.639,"z2":19.4,"x2":94.517,"h":false,"x1":94.323},{"s":false,"z1":18.763,"a":false,"y1":48.316,"n":"Leu","y2":46.699,"z2":17,"x2":91.874,"h":false,"x1":92.154},{"s":false,"z1":18.317,"a":false,"y1":44.796,"n":"Asn","y2":44.053,"z2":20.145,"x2":92.035,"h":false,"x1":93.359},{"s":false,"z1":18.47,"a":false,"y1":42.396,"n":"Arg","y2":40.599,"z2":20.019,"x2":89.934,"h":true,"x1":90.48},{"s":false,"z1":20.418,"a":true,"y1":39.871,"n":"Glu","y2":39.604,"z2":22.714,"x2":93.36,"h":true,"x1":92.639},{"s":false,"z1":23.406,"a":false,"y1":42.15,"n":"Asp","y2":42.544,"z2":25.306,"x2":91.149,"h":true,"x1":92.59},{"s":true,"z1":24.047,"a":false,"y1":41.277,"n":"Phe","y2":39.022,"z2":23.186,"x2":88.854,"h":false,"x1":88.921},{"s":true,"z1":25.143,"a":false,"y1":38.218,"n":"Arg","y2":39.385,"z2":25.451,"x2":84.896,"h":false,"x1":86.993},{"s":true,"z1":25.364,"a":true,"y1":37.059,"n":"Leu","y2":35.113,"z2":26.614,"x2":83.59,"h":false,"x1":83.39},{"s":true,"z1":28.556,"a":false,"y1":36.024,"n":"Leu","y2":35.552,"z2":27.374,"x2":79.877,"h":false,"x1":81.887},{"s":false,"z1":28.138,"a":false,"y1":32.903,"n":"Cys","y2":32.87,"z2":30.518,"x2":79.525,"h":false,"x1":79.848},{"s":false,"z1":30.293,"a":false,"y1":31.832,"n":"Leu","y2":30.244,"z2":32.038,"x2":76.559,"h":false,"x1":76.925},{"s":false,"z1":31.374,"a":false,"y1":28.686,"n":"Asp","y2":28.05,"z2":32.764,"x2":80.633,"h":false,"x1":78.79},{"s":false,"z1":33.224,"a":false,"y1":30.627,"n":"Gly","y2":30.796,"z2":33.14,"x2":83.825,"h":false,"x1":81.439},{"s":false,"z1":30.508,"a":false,"y1":30.535,"n":"Thr","y2":32.496,"z2":29.462,"x2":83.074,"h":false,"x1":84.005},{"s":true,"z1":28.373,"a":false,"y1":33.22,"n":"Arg","y2":31.466,"z2":26.964,"x2":86.231,"h":false,"x1":85.526},{"s":true,"z1":24.643,"a":true,"y1":32.949,"n":"Lys","y2":35.26,"z2":24.228,"x2":86.194,"h":false,"x1":85.928},{"s":true,"z1":21.844,"a":false,"y1":34.968,"n":"Pro","y2":34.546,"z2":20.812,"x2":85.355,"h":false,"x1":87.483},{"s":false,"z1":19.594,"a":false,"y1":37.141,"n":"Val","y2":36.776,"z2":17.651,"x2":84.037,"h":false,"x1":85.393},{"s":false,"z1":16.776,"a":false,"y1":34.585,"n":"Thr","y2":32.888,"z2":16.095,"x2":83.917,"h":false,"x1":85.509},{"s":false,"z1":18.617,"a":false,"y1":32.181,"n":"Glu","y2":32.279,"z2":20.484,"x2":81.695,"h":false,"x1":83.196},{"s":false,"z1":19.271,"a":false,"y1":34.3,"n":"Ala","y2":33.495,"z2":19.995,"x2":78.037,"h":false,"x1":80.165},{"s":false,"z1":17.893,"a":false,"y1":31.557,"n":"Gln","y2":29.961,"z2":19.227,"x2":76.775,"h":false,"x1":77.998},{"s":false,"z1":20.818,"a":false,"y1":29.308,"n":"Ser","y2":29.356,"z2":23.236,"x2":79.094,"h":false,"x1":78.949},{"s":false,"z1":23.341,"a":false,"y1":32.086,"n":"Cys","y2":34.531,"z2":23.206,"x2":79.042,"h":false,"x1":79.222},{"s":false,"z1":23.328,"a":false,"y1":34.613,"n":"His","y2":33.446,"z2":24.901,"x2":74.971,"h":false,"x1":76.328},{"s":false,"z1":25.652,"a":false,"y1":35.706,"n":"Leu","y2":34.57,"z2":25.788,"x2":71.457,"h":false,"x1":73.54},{"s":true,"z1":23.295,"a":false,"y1":35.494,"n":"Ala","y2":36.669,"z2":21.53,"x2":71.647,"h":false,"x1":70.6},{"s":true,"z1":19.756,"a":true,"y1":36.177,"n":"Val","y2":37.019,"z2":20.387,"x2":67.527,"h":false,"x1":69.676},{"s":true,"z1":19.377,"a":false,"y1":39.493,"n":"Ala","y2":39.291,"z2":17.055,"x2":67.914,"h":false,"x1":67.861},{"s":false,"z1":16.66,"a":false,"y1":40.34,"n":"Pro","y2":42.489,"z2":17.001,"x2":66.267,"h":false,"x1":65.353},{"s":false,"z1":14.275,"a":false,"y1":43.063,"n":"Asn","y2":44.207,"z2":14.959,"x2":64.455,"h":false,"x1":66.488},{"s":false,"z1":14.701,"a":false,"y1":46.716,"n":"His","y2":46.611,"z2":12.432,"x2":64.819,"h":false,"x1":65.66},{"s":true,"z1":12.927,"a":false,"y1":47.684,"n":"Ala","y2":49.735,"z2":13.968,"x2":61.825,"h":false,"x1":62.427},{"s":true,"z1":11.754,"a":false,"y1":50.59,"n":"Val","y2":49.501,"z2":11.833,"x2":58.29,"h":false,"x1":60.427},{"s":true,"z1":13.742,"a":true,"y1":51.125,"n":"Val","y2":53.284,"z2":12.776,"x2":57.074,"h":false,"x1":57.281},{"s":true,"z1":12.862,"a":false,"y1":53.247,"n":"Ser","y2":51.958,"z2":14.095,"x2":52.717,"h":false,"x1":54.283},{"s":false,"z1":13.559,"a":false,"y1":53.712,"n":"Arg","y2":53.021,"z2":11.292,"x2":50.405,"h":false,"x1":50.61},{"s":false,"z1":11.96,"a":false,"y1":51.171,"n":"Ser","y2":51.049,"z2":9.645,"x2":47.662,"h":false,"x1":48.176},{"s":false,"z1":9.534,"a":false,"y1":53.644,"n":"Asp","y2":54.772,"z2":7.58,"x2":47.477,"h":false,"x1":46.699},{"s":false,"z1":8.471,"a":false,"y1":55.062,"n":"Arg","y2":54.441,"z2":6.834,"x2":51.666,"h":false,"x1":50.034},{"s":false,"z1":8.104,"a":false,"y1":51.759,"n":"Ala","y2":51.258,"z2":6.225,"x2":53.249,"h":true,"x1":51.885},{"s":false,"z1":4.467,"a":false,"y1":51.065,"n":"Ala","y2":51.848,"z2":2.668,"x2":52.442,"h":true,"x1":51.069},{"s":false,"z1":3.337,"a":false,"y1":54.549,"n":"His","y2":54.947,"z2":2.641,"x2":54.166,"h":true,"x1":51.94},{"s":false,"z1":5.314,"a":false,"y1":54.592,"n":"Val","y2":53.857,"z2":4.216,"x2":57.072,"h":true,"x1":55.069},{"s":false,"z1":3.894,"a":false,"y1":51.227,"n":"Lys","y2":51.39,"z2":2.059,"x2":57.557,"h":true,"x1":56.043},{"s":false,"z1":0.274,"a":false,"y1":52.287,"n":"Gln","y2":53.207,"z2":-0.981,"x2":57.315,"h":true,"x1":55.471},{"s":false,"z1":0.758,"a":false,"y1":55.464,"n":"Val","y2":55.501,"z2":0.348,"x2":59.729,"h":true,"x1":57.372},{"s":false,"z1":2.502,"a":false,"y1":53.762,"n":"Leu","y2":52.82,"z2":1.471,"x2":62.189,"h":true,"x1":60.283},{"s":false,"z1":-0.321,"a":false,"y1":51.326,"n":"Leu","y2":51.837,"z2":-2.025,"x2":62.221,"h":true,"x1":60.643},{"s":false,"z1":-2.763,"a":false,"y1":54.208,"n":"His","y2":55.227,"z2":-3.276,"x2":62.942,"h":true,"x1":60.794},{"s":false,"z1":-0.614,"a":false,"y1":56.015,"n":"Gln","y2":55.715,"z2":-0.832,"x2":65.728,"h":true,"x1":63.368},{"s":false,"z1":-0.254,"a":false,"y1":52.911,"n":"Gln","y2":52.404,"z2":-1.662,"x2":67.408,"h":true,"x1":65.513},{"s":false,"z1":-4.001,"a":false,"y1":52.607,"n":"Ala","y2":53.591,"z2":-5.272,"x2":67.684,"h":true,"x1":65.916},{"s":false,"z1":-4.255,"a":true,"y1":56.12,"n":"Leu","y2":56.693,"z2":-3.899,"x2":69.506,"h":true,"x1":67.223},{"s":false,"z1":-1.201,"a":false,"y1":56.317,"n":"Phe","y2":55.403,"z2":0.473,"x2":70.77,"h":true,"x1":69.362},{"s":false,"z1":0.032,"a":false,"y1":52.792,"n":"Gly","y2":52.995,"z2":-1.084,"x2":72.165,"h":false,"x1":70.084},{"s":false,"z1":-0.386,"a":false,"y1":50.336,"n":"Lys","y2":50.448,"z2":-2.323,"x2":74.472,"h":false,"x1":73.026},{"s":false,"z1":-4.091,"a":false,"y1":50.039,"n":"Asn","y2":50.871,"z2":-5.482,"x2":70.678,"h":false,"x1":72.447},{"s":false,"z1":-4.13,"a":false,"y1":53.337,"n":"Gly","y2":53.991,"z2":-5.57,"x2":72.442,"h":false,"x1":70.666},{"s":false,"z1":-7.265,"a":false,"y1":55.468,"n":"Lys","y2":57.069,"z2":-7.553,"x2":72.567,"h":false,"x1":70.772},{"s":false,"z1":-5.331,"a":false,"y1":58.587,"n":"Asn","y2":59.174,"z2":-3.769,"x2":73.549,"h":false,"x1":71.78},{"s":false,"z1":-3.087,"a":false,"y1":56.644,"n":"Cys","y2":55.146,"z2":-4.891,"x2":74.784,"h":false,"x1":74.151},{"s":false,"z1":-2.836,"a":false,"y1":57.185,"n":"Pro","y2":59.312,"z2":-2.372,"x2":77.831,"h":false,"x1":76.888},{"s":false,"z1":-4.781,"a":false,"y1":60.438,"n":"Asp","y2":62.628,"z2":-3.873,"x2":76.803,"h":false,"x1":77.212},{"s":false,"z1":-3.451,"a":false,"y1":62.264,"n":"Lys","y2":62.861,"z2":-1.134,"x2":74.265,"h":false,"x1":74.125},{"s":false,"z1":-0.216,"a":false,"y1":60.597,"n":"Phe","y2":58.353,"z2":-0.751,"x2":72.164,"h":false,"x1":72.929},{"s":false,"z1":1.542,"a":false,"y1":57.278,"n":"Cys","y2":57.772,"z2":3.879,"x2":73.064,"h":false,"x1":73.255},{"s":false,"z1":4.06,"a":false,"y1":56.436,"n":"Leu","y2":55.779,"z2":6.335,"x2":70.918,"h":false,"x1":70.568},{"s":false,"z1":5.848,"a":false,"y1":53.743,"n":"Phe","y2":53.273,"z2":6.975,"x2":74.498,"h":false,"x1":72.506},{"s":false,"z1":6.3,"a":false,"y1":55.555,"n":"Lys","y2":57.75,"z2":6.963,"x2":75.08,"h":false,"x1":75.78},{"s":false,"z1":9.36,"a":false,"y1":57.683,"n":"Ser","y2":58.673,"z2":11.014,"x2":77.802,"h":false,"x1":76.419},{"s":false,"z1":9.93,"a":false,"y1":57.52,"n":"Glu","y2":57.283,"z2":12.306,"x2":80.785,"h":false,"x1":80.248},{"s":false,"z1":12.34,"a":false,"y1":54.491,"n":"Thr","y2":54.677,"z2":14.715,"x2":79.425,"h":false,"x1":79.871},{"s":false,"z1":14.374,"a":false,"y1":56.29,"n":"Lys","y2":55.637,"z2":15.759,"x2":75.469,"h":false,"x1":77.271},{"s":false,"z1":13.544,"a":false,"y1":54.236,"n":"Asn","y2":55.034,"z2":14.656,"x2":72.157,"h":false,"x1":74.129},{"s":false,"z1":13.131,"a":false,"y1":57.327,"n":"Leu","y2":56.631,"z2":11.028,"x2":71.112,"h":false,"x1":72.007},{"s":false,"z1":12.039,"a":false,"y1":56.554,"n":"Leu","y2":54.457,"z2":12.067,"x2":67.189,"h":false,"x1":68.412},{"s":false,"z1":11.014,"a":false,"y1":52.965,"n":"Phe","y2":53.499,"z2":11.413,"x2":71.687,"h":false,"x1":69.385},{"s":false,"z1":11.824,"a":false,"y1":50.805,"n":"Asn","y2":50.698,"z2":9.453,"x2":72.591,"h":false,"x1":72.411},{"s":false,"z1":9.496,"a":false,"y1":51.403,"n":"Asp","y2":50.165,"z2":7.493,"x2":75.912,"h":false,"x1":75.333},{"s":false,"z1":8.687,"a":false,"y1":47.673,"n":"Asn","y2":46.12,"z2":7.241,"x2":74.381,"h":false,"x1":75.509},{"s":true,"z1":7.294,"a":false,"y1":47.595,"n":"Thr","y2":48.508,"z2":5.178,"x2":72.531,"h":false,"x1":71.94},{"s":true,"z1":3.808,"a":false,"y1":46.21,"n":"Glu","y2":47.486,"z2":2.107,"x2":70.678,"h":false,"x1":71.833},{"s":true,"z1":3.374,"a":false,"y1":47.14,"n":"Cys","y2":46.279,"z2":5.484,"x2":67.406,"h":false,"x1":68.204},{"s":true,"z1":5.036,"a":false,"y1":47.369,"n":"Leu","y2":46.412,"z2":3.203,"x2":63.635,"h":false,"x1":64.847},{"s":true,"z1":4.583,"a":true,"y1":44.072,"n":"Ala","y2":44.684,"z2":6.029,"x2":61.199,"h":false,"x1":63.056},{"s":true,"z1":4.244,"a":false,"y1":43.428,"n":"Lys","y2":41.395,"z2":5.354,"x2":59.799,"h":false,"x1":59.294},{"s":false,"z1":7.023,"a":false,"y1":41.544,"n":"Leu","y2":41.017,"z2":5.289,"x2":56.063,"h":false,"x1":57.664},{"s":false,"z1":6.74,"a":false,"y1":38.982,"n":"Gly","y2":40.839,"z2":7.211,"x2":53.418,"h":false,"x1":54.921},{"s":false,"z1":6.864,"a":false,"y1":39.334,"n":"Gly","y2":38.491,"z2":9.077,"x2":50.762,"h":false,"x1":51.163},{"s":false,"z1":9.983,"a":false,"y1":41.121,"n":"Arg","y2":39.92,"z2":11.842,"x2":50.742,"h":false,"x1":49.839},{"s":false,"z1":12.385,"a":false,"y1":41.154,"n":"Pro","y2":43.406,"z2":13.212,"x2":52.351,"h":false,"x1":52.422},{"s":false,"z1":15.828,"a":false,"y1":42.591,"n":"Thr","y2":42.056,"z2":15.906,"x2":54.29,"h":false,"x1":51.963},{"s":false,"z1":18.194,"a":false,"y1":43.558,"n":"Tyr","y2":41.844,"z2":18.602,"x2":56.289,"h":true,"x1":54.696},{"s":false,"z1":19.877,"a":false,"y1":40.14,"n":"Glu","y2":38.177,"z2":19.209,"x2":55.504,"h":true,"x1":54.365},{"s":false,"z1":16.605,"a":false,"y1":38.325,"n":"Glu","y2":37.552,"z2":15.785,"x2":56.767,"h":true,"x1":54.662},{"s":false,"z1":15.51,"a":true,"y1":40.164,"n":"Tyr","y2":39.266,"z2":16.157,"x2":59.921,"h":true,"x1":57.776},{"s":false,"z1":18.847,"a":false,"y1":40.053,"n":"Leu","y2":38.025,"z2":19.379,"x2":60.715,"h":true,"x1":59.585},{"s":false,"z1":19.787,"a":false,"y1":36.577,"n":"Gly","y2":37.127,"z2":22.087,"x2":58.675,"h":false,"x1":58.431},{"s":false,"z1":22.795,"a":false,"y1":35.091,"n":"Thr","y2":35.569,"z2":25.071,"x2":57.271,"h":true,"x1":56.595},{"s":false,"z1":24.712,"a":false,"y1":34.093,"n":"Glu","y2":35.559,"z2":26.361,"x2":60.621,"h":true,"x1":59.736},{"s":false,"z1":24.464,"a":false,"y1":37.525,"n":"Tyr","y2":39.214,"z2":26.051,"x2":60.764,"h":true,"x1":61.381},{"s":false,"z1":25.179,"a":false,"y1":39.243,"n":"Val","y2":39.864,"z2":27.473,"x2":57.657,"h":true,"x1":58.048},{"s":false,"z1":28.318,"a":false,"y1":37.166,"n":"Thr","y2":37.702,"z2":30.379,"x2":58.674,"h":true,"x1":57.608},{"s":false,"z1":29.18,"a":false,"y1":37.821,"n":"Ala","y2":39.629,"z2":30.679,"x2":61.756,"h":true,"x1":61.22},{"s":false,"z1":28.89,"a":false,"y1":41.522,"n":"Ile","y2":42.548,"z2":30.965,"x2":60.013,"h":true,"x1":60.662},{"s":false,"z1":30.838,"a":false,"y1":41.136,"n":"Ala","y2":41.772,"z2":33.157,"x2":57.401,"h":true,"x1":57.413},{"s":false,"z1":33.916,"a":false,"y1":39.539,"n":"Asn","y2":40.821,"z2":35.686,"x2":59.964,"h":true,"x1":58.976},{"s":false,"z1":33.979,"a":false,"y1":42.127,"n":"Leu","y2":44.127,"z2":35.285,"x2":61.542,"h":true,"x1":61.792},{"s":false,"z1":33.732,"a":true,"y1":44.896,"n":"Lys","y2":46.006,"z2":35.393,"x2":57.926,"h":true,"x1":59.225},{"s":false,"z1":37.035,"a":false,"y1":43.819,"n":"Lys","y2":44.696,"z2":39.26,"x2":57.987,"h":true,"x1":57.691},{"s":false,"z1":38.868,"a":false,"y1":45.123,"n":"Cys","y2":47.18,"z2":40.015,"x2":60.929,"h":false,"x1":60.701},{"s":false,"z1":37.874,"a":false,"y1":48.711,"n":"Ser","y2":48.519,"z2":35.922,"x2":58.646,"h":false,"x1":60.067},{"s":false,"z1":36.539,"a":false,"y1":50.793,"n":"Thr","y2":52.87,"z2":36.058,"x2":58.28,"h":false,"x1":57.126},{"s":false,"z1":33.498,"a":false,"y1":53.089,"n":"Ser","y2":53.197,"z2":33.181,"x2":54.9,"h":false,"x1":57.248},{"s":false,"z1":33.443,"a":false,"y1":56.13,"n":"Pro","y2":56.312,"z2":31.94,"x2":53.102,"h":true,"x1":54.926},{"s":false,"z1":29.684,"a":false,"y1":55.814,"n":"Leu","y2":54.509,"z2":28.646,"x2":53.001,"h":true,"x1":54.73},{"s":false,"z1":30.087,"a":false,"y1":52.227,"n":"Leu","y2":51.613,"z2":30.389,"x2":51.393,"h":true,"x1":53.697},{"s":false,"z1":32.613,"a":false,"y1":53.326,"n":"Glu","y2":53.964,"z2":31.899,"x2":48.892,"h":true,"x1":51.082},{"s":false,"z1":30.232,"a":false,"y1":55.988,"n":"Ala","y2":55.614,"z2":28.643,"x2":48.22,"h":true,"x1":49.912},{"s":false,"z1":27.285,"a":false,"y1":53.593,"n":"Cys","y2":52.141,"z2":26.765,"x2":47.733,"h":true,"x1":49.565},{"s":false,"z1":29.496,"a":false,"y1":51.295,"n":"Ala","y2":51.284,"z2":29.097,"x2":45.263,"h":true,"x1":47.628},{"s":false,"z1":30.051,"a":true,"y1":54.005,"n":"Phe","y2":54.597,"z2":28.512,"x2":43.323,"h":true,"x1":45.071},{"s":false,"z1":26.337,"a":false,"y1":54.825,"n":"Leu","y2":53.864,"z2":24.603,"x2":43.658,"h":true,"x1":44.983},{"s":false,"z1":25.468,"a":false,"y1":51.209,"n":"Thr","y2":49.568,"z2":27.114,"x2":43.463,"h":false,"x1":44.187},{"s":false,"z1":27.971,"a":false,"y1":51.408,"n":"Arg","y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":41.275},{"s":false,"z1":27.788,"a":false,"y1":50.182,"y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":40.373},{"s":false,"z1":27.788,"a":false,"y1":50.182,"y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":40.373},{"s":false,"z1":27.788,"a":false,"y1":50.182,"y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":40.373},{"s":false,"z1":27.788,"a":false,"y1":50.182,"y2":49.251,"z2":28.614,"x2":40.481,"h":false,"x1":40.373}]]},"mol":{"b":[{"e":1,"b":0},{"e":11,"b":0},{"e":2,"b":1},{"e":8,"b":1},{"e":3,"b":2},{"e":9,"b":2},{"e":4,"b":3},{"e":10,"b":3},{"e":5,"b":4},{"e":11,"b":4},{"e":12,"b":5},{"e":7,"b":6},{"e":8,"b":6},{"e":13,"b":6},{"e":15,"b":14},{"e":25,"b":14},{"e":16,"b":15},{"e":22,"b":15},{"e":17,"b":16},{"e":23,"b":16},{"e":18,"b":17},{"e":24,"b":17},{"e":19,"b":18},{"e":25,"b":18},{"e":26,"b":19},{"e":21,"b":20},{"e":22,"b":20},{"e":27,"b":20},{"e":28,"b":24},{"e":29,"b":28},{"e":39,"b":28},{"e":30,"b":29},{"e":36,"b":29},{"e":31,"b":30},{"e":37,"b":30},{"e":32,"b":31},{"e":38,"b":31},{"e":33,"b":32},{"e":39,"b":32},{"e":40,"b":33},{"e":35,"b":34},{"e":36,"b":34},{"e":41,"b":34},{"e":42,"b":38},{"e":43,"b":42},{"e":51,"b":42},{"e":44,"b":43},{"e":48,"b":43},{"e":45,"b":44},{"e":49,"b":44},{"e":46,"b":45},{"e":50,"b":45},{"e":47,"b":46},{"e":51,"b":46},{"e":52,"b":47},{"e":54,"b":53},{"e":64,"b":53},{"e":55,"b":54},{"e":61,"b":54},{"e":56,"b":55},{"e":62,"b":55},{"e":57,"b":56},{"e":63,"b":56},{"e":58,"b":57},{"e":64,"b":57},{"e":65,"b":58},{"e":60,"b":59},{"e":61,"b":59},{"e":66,"b":59},{"e":67,"b":63},{"e":68,"b":67},{"e":78,"b":67},{"e":69,"b":68},{"e":75,"b":68},{"e":70,"b":69},{"e":76,"b":69},{"e":71,"b":70},{"e":77,"b":70},{"e":72,"b":71},{"e":78,"b":71},{"e":79,"b":72},{"e":74,"b":73},{"e":75,"b":73},{"e":80,"b":73},{"e":81,"b":77},{"e":82,"b":81},{"e":90,"b":81},{"e":83,"b":82},{"e":87,"b":82},{"e":84,"b":83},{"e":88,"b":83},{"e":85,"b":84},{"e":89,"b":84},{"e":86,"b":85},{"e":90,"b":85},{"e":91,"b":86},{"e":92,"b":91},{"e":93,"b":92},{"e":101,"b":92},{"e":94,"b":93},{"e":98,"b":93},{"e":95,"b":94},{"e":99,"b":94},{"e":96,"b":95},{"e":100,"b":95},{"e":97,"b":96},{"e":101,"b":96},{"e":102,"b":97},{"e":103,"b":99},{"e":114,"b":102},{"e":104,"b":103},{"e":112,"b":103},{"e":105,"b":104},{"e":109,"b":104},{"e":106,"b":105},{"e":110,"b":105},{"e":107,"b":106},{"e":111,"b":106},{"e":108,"b":107},{"e":112,"b":107},{"e":113,"b":108},{"e":115,"b":114},{"e":123,"b":114},{"e":116,"b":115},{"e":120,"b":115},{"e":117,"b":116},{"e":121,"b":116},{"e":118,"b":117},{"e":122,"b":117},{"e":119,"b":118},{"e":123,"b":118},{"e":124,"b":119},{"e":128,"b":125},{"e":129,"b":125},{"e":132,"b":126},{"e":133,"b":126},{"e":128,"b":127},{"e":129,"b":127},{"e":130,"b":127},{"e":132,"b":131},{"e":133,"b":131},{"e":134,"b":131}],"a":[{"p_h":true,"z":-3.918,"y":61.83,"x":58.832},{"p_h":true,"z":-4.86,"y":61.416,"x":59.973},{"p_h":true,"z":-6.305,"y":61.627,"x":59.529},{"p_h":true,"z":-6.551,"y":60.76,"x":58.284},{"p_h":true,"z":-5.542,"y":61.137,"x":57.193},{"p_h":true,"z":-5.701,"y":60.276,"x":55.951},{"p_h":true,"z":-3.857,"y":61.614,"x":62.19},{"p_h":true,"z":-3.97,"y":62.269,"x":63.537},{"p_h":true,"l":"N","z":-4.627,"y":62.123,"x":61.221},{"p_h":true,"l":"O","z":-7.199,"y":61.248,"x":60.568},{"p_h":true,"l":"O","z":-7.882,"y":60.94,"x":57.812},{"p_h":true,"l":"O","z":-4.194,"y":61.011,"x":57.693},{"p_h":true,"l":"O","z":-5.395,"y":58.927,"x":56.27},{"p_h":true,"l":"O","z":-3.149,"y":60.644,"x":62.024},{"p_h":true,"z":33.981,"y":34.753,"x":63.447},{"p_h":true,"z":32.478,"y":34.459,"x":63.502},{"p_h":true,"z":31.902,"y":34.367,"x":62.081},{"p_h":true,"z":32.74,"y":33.372,"x":61.247},{"p_h":true,"z":34.188,"y":33.861,"x":61.234},{"p_h":true,"z":35.109,"y":32.996,"x":60.386},{"p_h":true,"z":30.85,"y":35.35,"x":65.099},{"p_h":true,"z":30.323,"y":36.581,"x":65.782},{"p_h":true,"l":"N","z":31.81,"y":35.55,"x":64.195},{"p_h":true,"l":"O","z":30.536,"y":33.944,"x":62.125},{"p_h":true,"l":"O","z":32.254,"y":33.312,"x":59.91},{"p_h":true,"l":"O","z":34.66,"y":33.871,"x":62.566},{"p_h":true,"l":"O","z":35.09,"y":31.649,"x":60.864},{"p_h":true,"l":"O","z":30.429,"y":34.248,"x":65.386},{"p_h":true,"z":31.895,"y":32.033,"x":59.501},{"p_h":true,"z":32.097,"y":31.927,"x":57.988},{"p_h":true,"z":31.606,"y":30.581,"x":57.485},{"p_h":true,"z":30.144,"y":30.323,"x":57.923},{"p_h":true,"z":30.002,"y":30.569,"x":59.436},{"p_h":true,"z":28.558,"y":30.458,"x":59.915},{"p_h":true,"z":33.94,"y":33.032,"x":56.85},{"p_h":true,"z":35.421,"y":33.095,"x":56.647},{"p_h":true,"l":"N","z":33.497,"y":32.055,"x":57.635},{"p_h":true,"l":"O","z":31.681,"y":30.586,"x":56.066},{"p_h":true,"l":"O","z":29.867,"y":28.938,"x":57.679},{"p_h":true,"l":"O","z":30.508,"y":31.862,"x":59.803},{"p_h":true,"l":"O","z":27.999,"y":31.759,"x":60.083},{"p_h":true,"l":"O","z":33.214,"y":33.853,"x":56.339},{"p_h":true,"z":28.733,"y":28.678,"x":56.92},{"p_h":true,"z":28.068,"y":27.398,"x":57.455},{"p_h":true,"z":26.888,"y":27.011,"x":56.564},{"p_h":true,"z":27.379,"y":26.843,"x":55.134},{"p_h":true,"z":28.078,"y":28.133,"x":54.681},{"p_h":true,"z":28.6,"y":28.045,"x":53.249},{"p_h":true,"l":"O","z":28.977,"y":26.304,"x":57.531},{"p_h":true,"l":"O","z":26.309,"y":25.79,"x":57.013},{"p_h":true,"l":"O","z":26.267,"y":26.569,"x":54.295},{"p_h":true,"l":"O","z":29.162,"y":28.458,"x":55.575},{"p_h":true,"l":"O","z":29.864,"y":27.392,"x":53.233},{"p_h":true,"z":13.965,"y":38.992,"x":79.879},{"p_h":true,"z":12.997,"y":37.89,"x":79.468},{"p_h":true,"z":11.774,"y":37.91,"x":80.381},{"p_h":true,"z":11.154,"y":39.319,"x":80.436},{"p_h":true,"z":12.223,"y":40.359,"x":80.77},{"p_h":true,"z":11.702,"y":41.783,"x":80.647},{"p_h":true,"z":13.834,"y":35.826,"x":78.529},{"p_h":true,"z":14.607,"y":34.561,"x":78.768},{"p_h":true,"l":"N","z":13.63,"y":36.596,"x":79.59},{"p_h":true,"l":"O","z":10.811,"y":37.012,"x":79.852},{"p_h":true,"l":"O","z":10.173,"y":39.35,"x":81.465},{"p_h":true,"l":"O","z":13.29,"y":40.237,"x":79.871},{"p_h":true,"l":"O","z":11.461,"y":42.091,"x":79.277},{"p_h":true,"l":"O","z":13.454,"y":36.13,"x":77.416},{"p_h":true,"z":8.953,"y":39.797,"x":81.018},{"p_h":true,"z":8.17,"y":40.422,"x":82.182},{"p_h":true,"z":6.757,"y":40.764,"x":81.732},{"p_h":true,"z":6.101,"y":39.527,"x":81.098},{"p_h":true,"z":6.989,"y":39.022,"x":79.969},{"p_h":true,"z":6.37,"y":37.872,"x":79.192},{"p_h":true,"z":9.491,"y":41.782,"x":83.717},{"p_h":true,"z":10.028,"y":43.146,"x":84.027},{"p_h":true,"l":"N","z":8.779,"y":41.672,"x":82.604},{"p_h":true,"l":"O","z":6.003,"y":41.234,"x":82.848},{"p_h":true,"l":"O","z":4.849,"y":39.879,"x":80.55},{"p_h":true,"l":"O","z":8.268,"y":38.675,"x":80.486},{"p_h":true,"l":"O","z":7.355,"y":36.874,"x":78.936},{"p_h":true,"l":"O","z":9.693,"y":40.847,"x":84.452},{"p_h":true,"z":3.795,"y":39.438,"x":81.312},{"p_h":true,"z":2.679,"y":38.969,"x":80.382},{"p_h":true,"z":1.39,"y":38.716,"x":81.175},{"p_h":true,"z":1.054,"y":39.981,"x":81.953},{"p_h":true,"z":2.231,"y":40.312,"x":82.852},{"p_h":true,"z":1.988,"y":41.495,"x":83.742},{"p_h":true,"l":"O","z":2.424,"y":39.887,"x":79.322},{"p_h":true,"l":"O","z":0.32,"y":38.37,"x":80.292},{"p_h":true,"l":"O","z":-0.128,"y":39.814,"x":82.727},{"p_h":true,"l":"O","z":3.378,"y":40.564,"x":82.06},{"p_h":true,"l":"O","z":3.204,"y":41.785,"x":84.395},{"p_h":true,"z":3.01,"y":42.561,"x":85.532},{"p_h":true,"z":4.173,"y":42.336,"x":86.497},{"p_h":true,"z":5.492,"y":42.748,"x":85.837},{"p_h":true,"z":5.381,"y":44.176,"x":85.275},{"p_h":true,"z":4.095,"y":44.38,"x":84.45},{"p_h":true,"z":3.88,"y":45.85,"x":84.15},{"p_h":true,"l":"O","z":4.01,"y":43.031,"x":87.728},{"p_h":true,"l":"O","z":6.503,"y":42.75,"x":86.844},{"p_h":true,"l":"O","z":6.506,"y":44.429,"x":84.444},{"p_h":true,"l":"O","z":2.949,"y":43.924,"x":85.182},{"p_h":true,"l":"O","z":3.676,"y":46.526,"x":85.39},{"p_h":true,"z":7.409,"y":41.694,"x":86.727},{"p_h":true,"z":8.743,"y":42.125,"x":87.349},{"p_h":true,"z":8.549,"y":42.384,"x":88.837},{"p_h":true,"z":8.028,"y":41.103,"x":89.483},{"p_h":true,"z":6.722,"y":40.69,"x":88.791},{"p_h":true,"z":6.119,"y":39.421,"x":89.376},{"p_h":true,"l":"O","z":9.756,"y":41.15,"x":87.178},{"p_h":true,"l":"O","z":9.787,"y":42.764,"x":89.425},{"p_h":true,"l":"O","z":7.8,"y":41.31,"x":90.87},{"p_h":true,"l":"O","z":6.936,"y":40.522,"x":87.375},{"p_h":true,"l":"O","z":5.057,"y":38.974,"x":88.546},{"p_h":true,"z":3.454,"y":47.9,"x":85.255},{"p_h":true,"z":3.286,"y":48.544,"x":86.642},{"p_h":true,"z":4.629,"y":48.564,"x":87.377},{"p_h":true,"z":5.664,"y":49.286,"x":86.513},{"p_h":true,"z":5.768,"y":48.557,"x":85.176},{"p_h":true,"z":6.83,"y":49.145,"x":84.262},{"p_h":true,"l":"O","z":2.743,"y":49.859,"x":86.58},{"p_h":true,"l":"O","z":4.489,"y":49.23,"x":88.625},{"p_h":true,"l":"O","z":6.929,"y":49.297,"x":87.166},{"p_h":true,"l":"O","z":4.488,"y":48.557,"x":84.519},{"p_h":true,"l":"O","z":6.215,"y":49.916,"x":83.237},{"p_h":true,"l":"F","z":25.39,"y":68.008,"x":31.384},{"p_h":true,"l":"F","z":19.468,"y":46.274,"x":69.551},{"p_h":true,"z":23.766,"y":69.402,"x":30.416},{"p_h":true,"l":"O","z":23.601,"y":68.19,"x":30.857},{"p_h":true,"l":"O","z":24.94,"y":69.957,"x":30.444},{"p_h":true,"l":"O","z":22.747,"y":70.05,"x":29.936},{"p_h":true,"z":21.491,"y":47.009,"x":70.434},{"p_h":true,"l":"O","z":21.212,"y":45.777,"x":70.094},{"p_h":true,"l":"O","z":20.573,"y":47.926,"x":70.342},{"p_h":true,"l":"O","z":22.668,"y":47.327,"x":70.873},{"p_w":true,"p_h":true,"l":"O","z":18.584,"y":51.898,"x":67.095},{"p_w":true,"p_h":true,"l":"O","z":13.158,"y":56.518,"x":65.024},{"p_w":true,"p_h":true,"l":"O","z":28.112,"y":52.919,"x":77.743},{"p_w":true,"p_h":true,"l":"O","z":23.658,"y":65.393,"x":62.252},{"p_w":true,"p_h":true,"l":"O","z":5.5,"y":54.142,"x":49.24},{"p_w":true,"p_h":true,"l":"O","z":18.829,"y":55.374,"x":66.326},{"p_w":true,"p_h":true,"l":"O","z":17.479,"y":55.846,"x":72.451},{"p_w":true,"p_h":true,"l":"O","z":18.301,"y":53.183,"x":76.197},{"p_w":true,"p_h":true,"l":"O","z":19.332,"y":44.008,"x":66.507},{"p_w":true,"p_h":true,"l":"O","z":1.653,"y":73.7,"x":34.542},{"p_w":true,"p_h":true,"l":"O","z":16.104,"y":46.562,"x":71.477},{"p_w":true,"p_h":true,"l":"O","z":31.955,"y":68.412,"x":31.873},{"p_w":true,"p_h":true,"l":"O","z":36.57,"y":73.29,"x":34.364},{"p_w":true,"p_h":true,"l":"O","z":23.682,"y":70.2,"x":47.155},{"p_w":true,"p_h":true,"l":"O","z":15.472,"y":52.539,"x":48.628},{"p_w":true,"p_h":true,"l":"O","z":24.9,"y":66.856,"x":35.126},{"p_w":true,"p_h":true,"l":"O","z":33.127,"y":47.43,"x":64.066},{"p_w":true,"p_h":true,"l":"O","z":24.824,"y":77.686,"x":34.194},{"p_w":true,"p_h":true,"l":"O","z":26.225,"y":52.081,"x":61.131},{"p_w":true,"p_h":true,"l":"O","z":37.461,"y":68.839,"x":26.447},{"p_w":true,"p_h":true,"l":"O","z":28.428,"y":73.84,"x":34.587},{"p_w":true,"p_h":true,"l":"O","z":17.502,"y":63.138,"x":71.745},{"p_w":true,"p_h":true,"l":"O","z":26.714,"y":47.795,"x":61.492},{"p_w":true,"p_h":true,"l":"O","z":31.704,"y":33.386,"x":82.004},{"p_w":true,"p_h":true,"l":"O","z":14.38,"y":48.36,"x":75.409},{"p_w":true,"p_h":true,"l":"O","z":23.692,"y":78.274,"x":46.458},{"p_w":true,"p_h":true,"l":"O","z":29.715,"y":27.119,"x":88.288},{"p_w":true,"p_h":true,"l":"O","z":28.286,"y":65.423,"x":29.594},{"p_w":true,"p_h":true,"l":"O","z":18.663,"y":56.335,"x":75.52},{"p_w":true,"p_h":true,"l":"O","z":23.476,"y":56.46,"x":66.335},{"p_w":true,"p_h":true,"l":"O","z":26.694,"y":54.282,"x":66.833},{"p_w":true,"p_h":true,"l":"O","z":13.427,"y":44.096,"x":73.65},{"p_w":true,"p_h":true,"l":"O","z":38.777,"y":73.573,"x":46.5},{"p_w":true,"p_h":true,"l":"O","z":35.889,"y":76.683,"x":33.888},{"p_w":true,"p_h":true,"l":"O","z":32.587,"y":75.142,"x":33.743},{"p_w":true,"p_h":true,"l":"O","z":7.718,"y":51.937,"x":48.416},{"p_w":true,"p_h":true,"l":"O","z":14.397,"y":50.449,"x":89.417},{"p_w":true,"p_h":true,"l":"O","z":22.623,"y":64.846,"x":58.24},{"p_w":true,"p_h":true,"l":"O","z":34.128,"y":74.743,"x":51.791},{"p_w":true,"p_h":true,"l":"O","z":28.143,"y":70.802,"x":25.312},{"p_w":true,"p_h":true,"l":"O","z":11.989,"y":49.046,"x":76.425},{"p_w":true,"p_h":true,"l":"O","z":26,"y":31.953,"x":77.005},{"p_w":true,"p_h":true,"l":"O","z":33.752,"y":30.949,"x":75.035},{"p_w":true,"p_h":true,"l":"O","z":1.758,"y":54.023,"x":72.547},{"p_w":true,"p_h":true,"l":"O","z":9.699,"y":54.839,"x":73.615},{"p_w":true,"p_h":true,"l":"O","z":38.539,"y":36.219,"x":76.264},{"p_w":true,"p_h":true,"l":"O","z":34.202,"y":39.448,"x":64.22},{"p_w":true,"p_h":true,"l":"O","z":19.673,"y":55.651,"x":68.443},{"p_w":true,"p_h":true,"l":"O","z":14.67,"y":50.733,"x":68.41},{"p_w":true,"p_h":true,"l":"O","z":30.091,"y":30.401,"x":87.194}]}});
var mol_GLYCINE = 'Glycine\n  -ISIS-            3D\nd36 C2H5O2N NCC(O)=O\n 10  9  0  0  0  0  0  0  0  0  0\n    0.0000    0.0000    0.0000 N   0  0  0  0  0\n    1.4638    0.0000    0.0000 C   0  0  0  0  0\n    1.9497    1.4586    0.0000 C   0  0  0  0  0\n    1.9908    2.2067    0.9761 O   0  0  0  0  0\n    2.3831    1.9151   -1.2001 O   0  0  0  0  0\n   -0.3529    0.1725    0.9291 H   0  0  0  0  0\n   -0.3331   -0.9177   -0.2515 H   0  0  0  0  0\n    2.6573    2.8242   -1.2173 H   0  0  0  0  0\n    1.8326   -0.5442   -0.9027 H   0  0  0  0  0\n    1.9140   -0.5197    0.8843 H   0  0  0  0  0\n  1  2  1  0  0  0\n  1  6  1  0  0  0\n  1  7  1  0  0  0\n  2  3  1  0  0  0\n  2  9  1  0  0  0\n  2 10  1  0  0  0\n  3  4  2  0  0  0\n  3  5  1  0  0  0\n  5  8  1  0  0  0\nM  END';
(function() {


}).call(this);
// == menu click events ==
$(function() { // jQuery document ready

  // Display Modes
  $("#BS").click(function() {
    $(this).addClass("success");
    $("#SF").removeClass("success");
    $("#WF").removeClass("success");
    viewer.specs.set3DRepresentation('Ball and Stick');
    viewer.updateScene()
  });

  $("#SF").click(function() {
    $(this).addClass("success");
    $("#BS").removeClass("success");
    $("#WF").removeClass("success");
    viewer.specs.set3DRepresentation('van der Waals Spheres');
    viewer.updateScene()
  });

  $("#WF").click(function() {
    $(this).addClass("success");
    $("#BS").removeClass("success");
    $("#SF").removeClass("success");
    viewer.specs.set3DRepresentation('Wireframe');
    viewer.updateScene()
  });

  // Labels
  $("#Labs").click(function() {
    viewer.specs.atoms_displayLabels_3D =! viewer.specs.atoms_displayLabels_3D;
    viewer.updateScene()
  }); // End display modes.

  // // Count nitrogen atoms test.
  // $("#test").click(function() {
  //   alert(ChemDoodle.countNitrogens(file));
  // });

  // Load models
  var model;
  $("#PS").change(function() {
    model = $("#PS").val();
    switch(model) {
      case "4F5S":
        file = pdb_4F5S;
        viewer.loadMolecule(file);
        break;
      case "1BEB":
        file = pdb_1BEB;
        viewer.loadMolecule(file);
        break;
      case "1BLF":
        file = pdb_1BLF;
        viewer.loadMolecule(file);
        break;
      case "1B8E":
        file = pdb_1B8E;
        viewer.loadMolecule(file);
        break;
      case "1F6S":
        file = pdb_1F6S;
        viewer.loadMolecule(file);
        break;
      case "AS1CB":
        file = ChemDoodle.readPDB(pdb_AS1CB, 1);
        viewer.loadMolecule(file);
        break;
      case "AS2C":
        file = ChemDoodle.readPDB(pdb_AS2C, 1);
        viewer.loadMolecule(file);
        break;
      // case "BCA":
      //   file = ChemDoodle.readPDB(pdb_BCA, 1);
      //   viewer.loadMolecule(file);
      //   break;
      // case "KCB":
      //   file = ChemDoodle.readPDB(pdb_KCB, 1);
      //   viewer.loadMolecule(file);
      //   break;
    }
  });

  // Right click canvas popup.
  $("#viewer").bind('contextmenu', function(e) {
    $("#popup").css({
      top: e.pageY - 19,
      left: e.pageX + 6
    }).fadeIn('fast');
    popupViewer.startAnimation();
    return false;
  });

  // Close popup.
  // Click.
  $(".close").click(function() {
    $("#popup").fadeOut("fast");
    popupViewer.stopAnimation();
  });
  // Escape key
  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      $("#popup").fadeOut("fast");
      popupViewer.stopAnimation();
    };
  });

});
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//






// Available components
// require foundation/foundation
// require foundation/foundation.abide
// require foundation/foundation.alerts
// require foundation/foundation.clearing
// require foundation/foundation.cookie
// require foundation/foundation.dropdown
// require foundation/foundation.forms
// require foundation/foundation.magellan
// require foundation/foundation.orbit
// require foundation/foundation.reveal
// require foundation/foundation.section
// require foundation/foundation.tooltips
// require foundation/foundation.topbar
// require foundation/foundation.interchange
// require foundation/foundation.placeholder






$(function(){ $(document).foundation(); });