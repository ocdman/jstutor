(function($){

	var appRouter = new mvcHelperExtend.AppRouter();

	var _appView = new mvcHelperExtend.AppView({
		className: 'bodyDiv',
		appRouter: appRouter
	});

	var appView = new _appView({
		toolbox: {
			tools: ControlList.list,
			toolkits: [],
			sets: []
		},
		model: new mvcHelper.model()
	});

	appRouter.appView = appView; 

	Backbone.history.start();

	$('body').append(appView.render().el);

})($);