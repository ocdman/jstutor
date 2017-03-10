(function($, ControlList, mvcHelper, mvcHelperExtend){

	var appRouter = new mvcHelperExtend.AppRouter();

	var appView = new mvcHelperExtend.AppView({
		className: 'bodyDiv',
		appRouter: appRouter,
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

})($, ControlList, mvcHelper, mvcHelperExtend);