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

		window.mvcHelper = mvcHelper;

	})();


	(function(){

		var mvcHelperExtend = {};

		mvcHelperExtend.AppRouter = Backbone.Router.extend({
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

		//程序入口视图
		mvcHelperExtend.AppView = (function(){
			var create = function(options){
				var formTypeCName = {0: '表单', 1: '元件', 2: '表单组'};
				var appRouter = options.appRouter;
				var pageModel;
				var modelList = [];

				var viewExtend = Backbone.View.extend({
					className: options.className,
					saveTemplate: function(){
						return $('#tpl-designArea-saveBar').html()
					},
					bindings: {
						'.saveBar': {
							observe: ['Id', 'FormType'],
							updateMethod: 'html',
							onGet: function(value, options){
								// var json = this.model.toJSON();
								// json.formTypeCName = formTypeCName[json.FormType];
								// return Handlebars.compile(this.saveTemplate())(json);
								return Handlebars.compile(this.saveTemplate())();
							}
						}
					},
					initialize: function(options){
						this.modelList = modelList
						this.tools = options.toolbox.tools;
						this.toolkits = options.toolbox.toolkits;
						this.sets = options.toolbox.sets;

						this.controlsArea = new mvcHelperExtend.controlBoxView({
							className: 'controlsArea',
							toolbox: {
								tools: this.tools,
								toolkits: this.toolkits,
								sets: this.sets
							},
							appRouter: appRouter
						});

						this.attrArea = new mvcHelperExtend.controlAttrView({
							className: 'attrArea',
							appRouter: appRouter
						});

						var structureJson = this.model.get('structureJson');
						structureJson = (Array.isArray(structureJson) && structureJson.length > 0) ? structureJson[0] : null;

						pageModel = ControlList.createControlModel('page', structureJson, {
							appRouter: appRouter,
							modelList: modelList
						});

						this.designArea = new mvcHelperExtend.controlDesignView({
							className: 'designArea',
							model: pageModel
						});
					},
					render: function(){
						this.dragSort = {};
						this.$el.append('<div class="saveBar"></div>');
						this.$el.append(this.controlsArea.render().el);
						this.dragSort.$drag = this.controlsArea.$drag();
						this.$el.append(this.designArea.render().el);
						this.$el.append(this.attrArea.render().el);
						this.stickit();
						return this;
					},
					_createModel: function(type){
						var model = null;
						if(type.indexOf('group') === 0){

						}else if(type.indexOf('set') === 0){

						}else{
							model = ControlList.createControlModel(type, null, {
								appRouter: appRouter,
								modelList: modelList
							});
						}
						return model;
					},
					appendControl: function(type){
						var model = this._createModel(type);
						this.designArea.appendControl(model);
					}
				});
				return new viewExtend(options);
			};
			return create;
		})();

		//控件设计视图
		mvcHelperExtend.controlDesignView = (function(){
			var create = function(options){
				var viewExtend = Backbone.View.extend({
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
					},
					select: function(e){
						if(this.model.get)
					}
				});
				return new viewExtend(options);
			};
			return create;
		})();
		

		//控件集合视图
		mvcHelperExtend.controlBoxView = (function(){
			var create = function(options){
				var appRouter = options.appRouter;
				var viewExtend = Backbone.View.extend({
					className: options.className,
					template: $('#tpl-controlsArea').html(),
					events: {
						'click .controlFace': 'select'
					},
					initialize: function(){
					},
					render: function(){
						this.$el.html(Handlebars.compile(this.template)(options.toolbox));
						this.drag();
						this.$el.find('[bind=accordion]').accordion({collapsible: true, active: false});
						this.$el.find('.ui-accordion-content').css({ height: 'auto' });
						return this;
					},
					drag: function(){
						this.$drag().draggable({
							helper: 'clone',
							revert: 'invalid',
							cursor: 'move'
						});
					},
					$drag: function(){
						return this.$controls();
					},
					$controls: function(){
						return this.$('.controlList').find('.controlFace');
					},
					select: function(e){
					   	appRouter.navigate($(e.target).attr('controltype') + '/append', { trigger: true })
						appRouter.navigate('', {trigger: true});
					}
				});
				return new viewExtend(options);
			};
			return create;
		})();

				

		//控件属性视图
		mvcHelperExtend.controlAttrView = (function(){
			var create = function(options){
				var appRouter = options.appRouter;
				var viewExtend = Backbone.View.extend({
					className: options.className,
					initialize: function(){

					},
					render: function(){
						this.$el.empty();
						return this;
					}
				});
				return new viewExtend(options);
			};
			return create;
		})();

		window.mvcHelperExtend = mvcHelperExtend;

	})();

})();


