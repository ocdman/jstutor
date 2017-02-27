(function(){

	var mvcHelperExtend = {};

	mvcHelperExtend.AppRouter = function(){
		var router = Backbone.Route.extend({
			appView: null,
			routes: {
				':cid/:sort/linkSort': 'linkSort',
				':cid/select': 'selectControl',
				':cid/remove': 'removeControl',
				':type/append': 'appendControl',
				':type/insert': 'inertControl'
			}
		});
	};
})();