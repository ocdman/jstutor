var Book = Backbone.Model.extend({
	defaults: {
		'author': null,
		'title': null,
		'description': null
	}
});

var Books = Backbone.Collection.extend({
	model: Book,
	localStorage: new Backbone.LocalStorage('Books')
});

//此视图同时适用于index模式和edit模式
//区别在于是否在new此视图的时候，传入参数colletion
var inputView = Backbone.View.extend({
	events: {
		'click input[type=button]': 'save'
	},
	template: _.template($('#inputTemplate').html()),
	save: function(e){
		this.model.set({
			author: this.$el.find('input[name=author]').val(),
			title: this.$el.find('input[name=title]').val(),
			description: this.$el.find('input[name=description]').val()
		});
		if(this.collection){
			//index模式
			this.collection.add(this.model);
		}
		this.model.save();
		app.navigate('books/index', {trigger: true});
	},
	initialize: function(){
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var attrView = Backbone.View.extend({
	template: _.template($('#attrTemplate').html()),
	render: function(){
		this.$el.html(this.template({books: this.collection.toJSON()}));
		return this;
	}
});

var Router = Backbone.Router.extend({
	$input: $('#input'),
	$attr: $('#attr'),
	routes: {
		'books/index': 'index',
		'book/:id/edit': 'edit',
		'book/:id/delete': 'delete'
	},
	initialize: function(){
		var self = this;
		self.books = new Books;
		self.books.on('all', function(e){
			console.log(e);
			console.log(this);
			$('#output').text(JSON.stringify(self.books.toJSON(), null, 4));
		});
		Backbone.history.start();
	},
	index: function(){
		var input = new inputView({
			collection: this.books,
			model: new Book
		});
		var attr = new attrView({
			collection: this.books
		});
		this.$input.html(input.render().el);	
		this.$attr.html(attr.render().el);
		this.navigate('/', {trigger: false});
	},
	edit: function(id){
		var input = new inputView({
			model: this.books.get(id)
		});
		this.$input.html(input.render().el);
	},
	delete: function(id){
		var book = this.books.get(id);
		book.destroy();
		this.navigate('books/index', {trigger: true});
	}
});

var app = new Router;
app.navigate('books/index', {trigger: true});