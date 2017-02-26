var Book = Backbone.Model.extend({
	defaults: {
		'author': null,
		'title': null,
		'description': null
	}
});

var inputView = Backbone.View.extend({
	el: '#input',
	events: {
		'click input[type=button]': 'openLink'
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