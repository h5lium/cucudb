/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
(function() {
	var initializing = false;

	// The base Class implementation (does nothing)
	this.Class = function(){};
	Class.static = {};

	// Create a new Class that inherits from this class
	Class.extend = function(_prop, _statics){
		// factory allowed
		var prop = typeof _prop === 'function' ?
			_prop.apply(this, [this]) : _prop,
			statics = typeof _statics === 'function' ?
			_statics.apply(this, [this]) : _statics;
		
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var key in prop) {
			// Check if we're overwriting an existing function
			prototype[key] = ensuper(prop[key], _super[key]);
		}

		// The dummy class constructor
		function Class(){
			// All construction is actually done in the init method
			if (! initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		// class, super
		Class.prototype.class = Class;
		Class.super = this;
		// static
		Class.static = {};
		for (var key in this.static) {
			Class.static[key] = this.static[key];
		}
		for (var key in statics || {}) {
			Class.static[key] = statics[key];
		}
		for (var key in Class.static) {
			Class[key] = ensuper(Class.static[key], this.static[key]);
		}

		return Class;
	};
	
	// ensuper
	function ensuper(theFunc, superFunc){
		return typeof theFunc === 'function'
		&& typeof superFunc === 'function' ? function(){
			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = superFunc;
			
			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = theFunc.apply(this, arguments);
			
			delete this._super;
			return ret;
		} : theFunc;
	}
	
	
	if (typeof module.exports === 'object') {
		// in Node
		module.exports = Class;
	}
})(); 