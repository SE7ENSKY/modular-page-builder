var Module           = require('models/module');
var ModuleAtts       = require('collections/module-attributes');
var editViews        = require('utils/edit-views');
var $                = require('jquery');

var ModuleFactory = {

	availableModules: [],

	init: function() {
		if ( modularPageBuilderData && 'available_modules' in modularPageBuilderData ) {
			_.each( modularPageBuilderData.available_modules, function( module ) {
				this.registerModule( module );
			}.bind( this ) );
		}
	},

	registerModule: function( module ) {
		this.availableModules.push( module );
	},

	getModule: function( moduleName ) {
		return $.extend( true, {}, _.findWhere( this.availableModules, { name: moduleName } ) );
	},

	/**
	 * Create Module Model.
	 * Use data from config, plus saved data.
	 *
	 * @param  string moduleName
	 * @param  object Saved attribute data.
	 * @param  object moduleProps. Module properties.
	 * @return Module
	 */
	create: function( moduleName, attrData, moduleProps ) {
		var data      = this.getModule( moduleName );
		var attributes = new ModuleAtts();

		if ( ! data ) {
			return null;
		}

		for ( var prop in moduleProps ) {
			data[ prop ] = moduleProps[ prop ];
		}

		/**
		 * Add all the module attributes.
		 * Whitelisted to attributes documented in schema
		 * Sets only value from attrData.
		 */
		_.each( data.attr, function( attr ) {
			var cloneAttr = $.extend( true, {}, attr  );
			var savedAttr = _.findWhere( attrData, { name: attr.name } );

			// Add saved attribute values.
			if ( savedAttr && 'value' in savedAttr ) {
				cloneAttr.value = savedAttr.value;
			}

			attributes.add( cloneAttr );
		} );

		data.attr = attributes;

		return new Module( data );
	},

	createEditView: function( model ) {

		var editView, moduleName;

		moduleName = model.get('name');
		editView   = ( name in editViews ) ? editViews[ moduleName ] : editViews['default'];

		return new editView( { model: model } );

	},

};

module.exports = ModuleFactory;
