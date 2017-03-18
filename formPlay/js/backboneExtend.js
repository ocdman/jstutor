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
		return this;
	};	// 被设计和属性视图共用的方法。拷贝model相对应区域的属性到视图，然后渲染视图。这里的this是指  视图，需要用call来调用这个方法，如：render.call(mvc视图,viewPlace)。

	(function(){

		var mvcHelper = {};

		mvcHelper.model = (function(){
			var create = function(args){
				var modelExtend = Backbone.Model.extend({
					initialize: function(args){
						var options = this.get('options');
						delete this.options;
						for(var key in options){
							this[key] = options[key];	//将options的属性(modelList和appRouter)直接拷贝到模型属性中
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
				':cid/:sort/linkSort': 'linkSort',	//允许工具箱控件拖拽到设计视图,并排序
				':cid/select': 'selectControl',	//选中控件
				':cid/remove': 'removeControl',	//移除控件
				':type/append': 'appendControl',	//单击工具箱控件后
				':type/insert': 'insertControl'	//拖拽工具箱控件后
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
				var modelList = [];	 //控件模型数组

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
						this.modelList = modelList;
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
						});	//这里的this.designArea指的是页面控件视图
					},
					render: function(){
						this.dragSort = {};	//管理工具箱控件的拖拽和设计视图的排序对象
						this.$el.append('<div class="saveBar"></div>');
						this.$el.append(this.controlsArea.render().el);	//渲染工具箱区域
						this.dragSort.$drag = this.controlsArea.$drag();	//保存初始化好的拖拽对象
						this.$el.append(this.designArea.render().el);	//渲染设计区域
						this.$el.append(this.attrArea.render().el);	//渲染属性区域
						this.stickit();	//backbone stickit插件，执行了this.bindings对象里的方法
						return this;
					},	//该渲染方法随着程序的进入只会调用一次
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
					linkSort: function(cid, sort){
						var model = _.find(modelList, function(model){
							return model.cid === cid;
						});
						if(!model){
							return;
						}
						var view = model.designView;
						var $sort = view[sort].call(view);
						if(!this.dragSort.$sort){
							this.dragSort.$sort = $sort;
						}else{
							this.dragSort.$sort = this.dragSort.$sort.add($sort);	//添加新的排序元素
						}
						this.dragSort.$sort = this.dragSort.$sort.filter('.ui-sortable');	//过滤失效的排序元素
						this.dragSort.$sort.sortable('option', 'connectWith', this.dragSort.$sort);	//关联 排序与排序
						this.dragSort.$drag.draggable('option', 'connectToSortable', this.dragSort.$sort);	//关联 拖拉与排序
					},
					appendControl: function(type){
						var model = this._createModel(type);
						this.designArea.appendControl(model);
					},
					insertControl: function(type){
						var model = this._createModel(type);
						var view = new mvcHelperExtend.controlDesignView({
							model: model,
							className: 'controlDesign'
						});
						this.designArea.$el.find('#insertplaceholder').replaceWith(view.render().el);	//用控件设计视图替换 占位符
						view.select();
					},
					selectControl: function(cid){
						var model = _.find(modelList, function(model){
							return model.cid === cid;
						});
						if(!model) {
							model = this.designArea.model;	//找不到cid的情况下，使用页面控件模型
						}
						if(this.activeModel){
							this.activeModel.view.deactive();	//取消原来的选中
						}
						this.activeModel = model;
						if(this.activeModel){
							this.activeModel.view.active();	//选中当前的
						}
						this.attrArea.render(this.activeModel);	//更新属性区域
					}
				});
				return new viewExtend(options);
			};
			return create;
		})();	// 整个页面的视图，管理controlBoxView, controlAreaView和controlDesignView三个子视图

		//控件设计视图
		mvcHelperExtend.controlDesignView = (function(){
			var create = function(options){
				var viewExtend = Backbone.View.extend({
					className: options.className,
					events: {
						'click': 'select'
					},
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
							if(!this.model.get('cannotRemove')){
								this.$el.append('<div class="wrapper_btn additions"><a href="#" class="add_btn"><i class="icon-plus"></i></a><a href="#" class="remove_btn"><i class="icon-minus"></i></a></div>');	//关闭按钮与复制按钮
							}
						}else{
							this.$el.empty();
						}
						return this;
					},
					select: function(e){
						if(this.model.get('canSelectDesignView')){
							this.model.appRouter.navigate(this.model.cid + '/select', {trigger: true});
							this.model.appRouter.navigate('', {trigger: true});
							if(e){
								e.stopPropagation();
							}
						}
					},
					active: function(){
						this.$el.addClass('active');
					},
					deactive: function(){
						this.$el.removeClass('active');
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
					template: $('#tpl-controlsArea').html(),	//使用模板
					events: {
						'click .controlFace': 'select'
					},
					initialize: function(){
					},
					render: function(){
						this.$el.html(Handlebars.compile(this.template)(options.toolbox));
						this.drag();	//初始化工具箱控件拖拽功能
						this.$el.find('[bind=accordion]').accordion({collapsible: true, active: false});
						this.$el.find('.ui-accordion-content').css({ height: 'auto' });
						return this;
					},	//该渲染工具箱视图的方法只会被调用一次
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
					   	appRouter.navigate($(e.target).attr('controltype') + '/append', { trigger: true });
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
					render: function(model){
						this.model = model;
						if(this.model){
							render.call(this, 'attr');
						}else{
							this.$el.empty();
						}
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


