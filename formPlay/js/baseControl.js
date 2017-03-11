window.ControlList = {};

(function($, ControlList, mvcHelper, mvcHelperExtend){
	ControlList.list = (function(){
		return [
			{ name: '文本框', type: 'text' }
		];
	})();

	ControlList.groupList = (function(){
		return [];
	})();

	ControlList.setList = (function(){
		return [];
	})();

	ControlList.formCategorys = (function(){
		return [];
	})();

	ControlList.formValues = (function(){
		return [];
	})();

	ControlList.config = (function(){
		return {
			controlDefaultProperty: {
				canConfig: true, //可配置
                title: '',
                customClass: [''],//自定义class样式
                colCount: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
                colCountXS: 'col-xs-12',
                colCountSM: 'col-sm-12',
                colCountMD: 'col-md-12',
                colCountLG: 'col-lg-12',
                isVisible: true,
                float: 'fl', //fl/fr 左/右浮动
                htmlStyles: [], //样式
                showTitle: false, //显示/隐藏标题（默认不显示/以前默认显示。）
                defaultValue: '',                       //默认值
                events: [], //事件列表
                limits: null, //权限
                dataSource: []
			}	//控件的默认属性
		};
	})();

	ControlList.createControlModel = function(type, values, options){
		if(!options.appRouter){

		}
		if(!options.modelList){

		}
		if(type == 'commonEvent' || type == 'loopBindEvent'){

		}
		var control = eval('ControlList.' + type + 'Control.newObj(values)');
		control.options = options;
		var model = new mvcHelper.model(control);
		model.modelList.addWithCover(model, function(m){
			return m.get('id') == model.get('id');
		});
		return model;
	};

	ControlList.pubFun = (function(){
		return {
			getTemplate: function(id){
				var $target = $('#' + id);
				if($target.length === 0){
					console.log('模板"' + id + '"不存在');
					return;
				}else{
					return $target.html();
				}
			},	//获取嵌套模板
			getAllModelList: function(){

			}	//根据modelList获取全部model，包括model自身包含的所有分支
		};
	})();

	ControlList._control = (function(){
		return {
			name: '',
			type: '',
			property: {
				 canSelectDesignView: true
			},
			designMethod: {},
			viewTemplate: {},
			rebuild: function(values){
				if(!values){
					return;
				}
				if(typeof values === 'object'){
					this.property = $.extend(true, this.property, values);
					delete this.property.id;
					delete this.property.name;
					delete this.property.type;
					if(values.id){
						this.id = values.id;	//还原ID, 很重要, 对应保存时的ID
					}
				}
			},
			newObj: function(values){
				var obj = $.extend(true, {}, this, {id: guid()});	//生成一个唯一标记, 是一个重要的值, guid()是backbone-localstorage.js文件里定义的函数
				if(typeof values === 'object'){
					obj.rebuild(values);
				}
				return obj;
			}
		};
	})();

	ControlList.baseControl = (function(){
		return {
			name: '',
			type: 'base',
			property: ControlList.config.controlDefaultProperty,
			designBindings: {
                '[bind=title]': 'title',
                '.title': {
                    observe: 'title',
                    onGet: function (val, options) {
                        // //debugger;
                        if (this.model.get('type') == 'page') {
                            //var title = ControlList.pubFun.getParentPage(this.model).get('title');
                            //var ary = [{ id: guid(), text: title, value: '1', checked: false }];
                            //this.model.set('mapSiteItems', ary);
                        }


                        return val;
                    }
                },
                '[name=defaultValue]': 'defaultValue',
                '[bind=showTitle]': {
                    attributes: [{
                        name: 'style',
                        observe: 'showTitle',
                        onGet: function (value, options) {
                            return 'display:' + (value ? 'block' : 'none');
                        } //显示/隐藏title
                    }]
                },
                '.isRequired': {
                    observe: 'isRequired',
                    onGet: function (val, options) {
                        // //debugger;
                        return val ? '*' : '';
                    }
                },
                ':el': {
                    attributes: [{
                        name: 'class',
                        observe: 'customClass',
                        onGet: function (value, options) {
                            //debugger;
                            if (value && typeof value == 'object' && value.constructor == Array) {
                                return value.join(' ');
                            }
                            return value;
                        } //显示/隐藏title
                    },
                    {
                        name: 'class',
                        observe: 'isVisible',
                        onGet: function (value, options) {
                            //return toolBox.stringToBool(value) ? '' : 'isVisibleToHide'; //不显示时，半透明。
                            return toolBox.stringToBool(value) ? '' : 'hide'; //显示/隐藏
                        }
                    },
                    {
                        name: 'class',
                        observe: 'colCount',
                        onGet: function (value, options) {
                            if (this.model.get('type') == 'page') {
                                return '';
                            }
                            return value;
                        }
                    },
                    {
                        name: 'class',
                        observe: 'float',
                        onGet: function (value, options) {
                            return value;
                        },
                        onSet: function (value, options) {
                            return toolBox.stringToBool(value);
                        }
                    }
                    ,{
                        observe: 'htmlStyles',
                        name: 'style',
                        onGet: function (value, options) {
                            var styles = _.filter(value, function (a) {
                                return a.value;
                            });
                            var list = _.map(styles, function (style) {
                                return style.code + ':' + style.value;
                            });
                            return list.join(';');
                        }
                    }
                    ]
                }
            },
			viewTemplate: {
				design: function(){ return ''; }
			},
			newObj: function(values){
				var base = $.extend(true, {}, ControlList._control.newObj(values), this);
				base = $.extend(true, base, base.property);
				return base;
			}
		}
	})();

	ControlList.pageControl = (function(){
		return {
			name: '页面',
			type: 'page',
			designMethod: {
				$controlsArea: function(){
					return this.$('> .designAreaInterior');
				},
				renderOne: function(controlModel){
					var view = new mvcHelperExtend.controlDesignView({
						model: controlModel,
						className: 'controlDesign'
					});
					this.$controlsArea().append(view.render().el);
				},
				appendControl: function(model){
					this.renderOne(model);	//渲染
					model.view.select();	//选中
				}
			},	//这里的this指代页面控件视图
			viewTemplate: {
				design: function() { 
					return ControlList.pubFun.getTemplate('tpl-pageDesign'); 
				}
			},
			newObj: function(values){
				var base = $.extend(true, {}, ControlList.baseControl.newObj(values), this);
				base = $.extend(true, base, base.property);
				return base;
			}
		};
	})();
})($, ControlList, mvcHelper, mvcHelperExtend);
