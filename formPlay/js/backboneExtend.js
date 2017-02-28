(function(){

	var render = function(viewPlace, $parent, callback){
		this.model[viewPlace + 'View'] = this;
		if(viewPlace !== 'attr'){
			this.model.view = this;
		}
		if($parent){
			$parent.append(this.$el);
		}
		$.extend(true, this, this.model.get(viewPlace + 'Method'));

		var renderFunc = this.model.get(viewPlace + 'Render');
		if(renderFunc && renderFunc.before){
			renderFunc.before.call(this);
		}
		this.$el.attr({
			modelCid: this.model.cid,
			modelId: this.model.get('id'),
			modelType: this.model.get('type')
		});
		if(viewPlace){
			this.$el.attr({ originalClass: 'controlDesign class_' + viewPlace + '_' + this.model.get('type')});
		}
		this.$el.addClass('class_' + viewPlace + '_' + this.model.get('type'));
		this.$el.html(Handlebars.compile(this.model.get('viewTemplate')[viewPlace]())(this.model.attributes));
		this.stickit(this.model, $.extend(true, {}, this.model.get(viewPlace + 'Bindings'), this.bindings));

		if(renderFunc && renderFunc.after){
			renderFunc.after.call(this, callback);
		}else{
			if(typeof callback == 'function'){
				callback();
			}
		}
	};

	(function(){

		var mvcHelper = {};

		mvcHelper.model = (function(){
			var create = function(args){
				var modelExtend = Backbone.Model.extend({
					initialize: function(args){
						var options = this.get('options');
						delete this.options;
						for(var key in options){
							this[key] = options[key];
						}
						var afterCreate = this.get('afterCreate');
						if(afterCreate && typeof afterCreate == 'function'){
							afterCreate.call(this);
						}
					}
				});
				return new modelExtend(args);
			};	
			return create;
		})();

	})();


	(function(){

		var mvcHelperExtend = {};

		mvcHelperExtend.AppRouter = Backbone.Route.extend({
			appView: null,
			routes: {
				':cid/:sort/linkSort': 'linkSort',
				':cid/select': 'selectControl',
				':cid/remove': 'removeControl',
				':type/append': 'appendControl',
				':type/insert': 'insertControl'
			},
			linkSort: function(cid, sort){
				this.appView.linkSort(cid, sort);
			},
			selectControl: function(cid){
				this.appView.selectControl(cid);
			},
			removeControl: function(cid){
				this.appView.removeControl(cid);
			},
			appendControl: function(type){
				this.appView.appendControl(type);
			},
			insertControl: function(type){
				this.appView.insertControl(type);
			}
		});

		mvcHelperExtend.AppView = function(options){
			var formTypeCName = {0: '表单'};
			var appRouter = options.appRouter;
			var pageModel;
			var modelList = [];

			return Backbone.View.extend({
				className: options.className,
				saveTemplate: function(){
					return $('#tpl-designArea-savebar').html()
				},
				initialize: function(options){
					this.modelList = modelList
					this.tools = options.toolbox.tools;
					this.toolkits = options.toolbox.toolkits;
					this.sets = options.toolbox.sets;

					this.toolboxArea = new mvcHelperExtend.controlBoxView({
						className: 'toolboxArea',
						toolbox: {
							tools: this.tools,
							toolkits: this.toolkits,
							sets: this.sets
						},
						appRouter: appRouter
					})();

					this.attrArea = new mvcHelperExtend.controlAttrView({
						className: 'attrArea',
						appRouter: appRouter
					})();

					var structureJson = this.model.get('structureJson');
					structureJson = (Array.isArray(structureJson) && structureJson.length > 0) ? structureJson[0] : null;

					pageModel = ControlList.createControlModel('page', structureJson, {
						appRouter: appRouter,
						modelList: modelList
					});

					this.designArea = new mvcHelperExtend.controlDesignView({
						model: pageModel,
						className: 'designArea'
					});
				},
				render: function(){
					this.dragSort = {};
					this.$el.append(this.toolboxArea.render().el);
					this.dragSort.$drag = this.toolboxArea.$drag();
					this.$el.append(this.designArea.render().el);
					this.$el.append(this.attrArea.render().el);
					return this;
				}
			});
		};

		mvcHelperExtend.controlDesignView = function(options){
			return Backbone.View.extend({
				className: options.className,
				initialize: function(){
					if(this.model){
						if(this.model.view){
							this.model.view.remove();
						}
						this.model.view = this;
					}
				},
				render: function(){
					if(this.model){
						render.call(this, 'design');
						if(this.model.get('cannotRemove')){

						}
					}else{
						this.$el.empty();
					}
					return this;
				}
			});
		};

		mvcHelperExtend.controlBoxView = function(options){
			var appRouter = options.appRouter;
			return Backbone.View.extend({
				className: options.className,
				template: $('#tpl-toolboxArea').html(),
				initialize: {

				},
				render: function(){
					var tools = options.toolbox.tools.group(function(tool){
						return tool.category ? tool.category : null;
					});
					options.toolbox.tools = [];
					for(var name in tools){
						options.toolbox.tools.push({
							name: name, 
							tools: tools[name]
						});
					}
					var toolkits = options.toolbox.toolkits.group(function(toolkit){
						return toolkit.category ? toolkit.category.Name : null;
					});
					options.toolbox.toolkits = [];
					for(var name in toolkits){
						options.toolbox.toolkits.push({
							name: name,
							toolkits: toolkits[name]
						});
					}
					var sets = options.toolbox.sets.group(function(set){
						return set.category ? set.category.Name : null;
					});
					options.toolbox.sets = [];
					for(var name in sets){
						options.toolbox.sets.push({
							name: name, 
							sets: sets[name]
						});
					}
					this.$el.html(Handlebars.compile(this.template)(options.toolbox));
					this.drag();
					return this;
				}
			});
		};

		mvcHelperExtend.controlAttrView = function(options){
			var appRouter = options.appRouter;
			return Backbone.View.extend({
				className: options.className,
				initialize: function(){

				},
				render: function(){
					this.$el.empty();
					return;
				}
			});
		};
	})();

})();


