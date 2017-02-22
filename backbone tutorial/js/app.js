var Navi = Backbone.Model.extend({
	defaults: {

	}
});

var navView = Backbone.View.extend({
	el: '#navigate',
	events: {
		'click li': 'openLink'
	},
	openLink: function(e){
		this.article.$el.html(e.target.innerHTML);
	},
	initialize: function(){
		this.article = new articleView;
	}
});

var articleView = Backbone.View.extend({
	el: '#article'
});

var app = new navView;