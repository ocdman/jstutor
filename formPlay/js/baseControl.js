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
			idsCache: {},	//记录各类型控件添加时的个数:相应类型的值加1。
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
		var control = eval('ControlList.' + type + 'Control.newObj(values)');	//创建控件对象
		control.options = options;	//将options参数给到控件对象的options属性,新建backbone模型的时候需要
		var model = new mvcHelper.model(control);	//新建backbone模型，将控件对象的属性复制到backbone模型的attributes里
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
				}
				var tpl = $target.html();
				var matches = tpl.match(/\[\[\[(.+?)\]\]\]/gm);
				if(matches){
					for(var i = 0; i < matches.length; i++){
						var id = matches[i].replace('[[[','').replace(']]]','');
						var childTpl = ControlList.pubFun.getTemplate(id);
						tpl = tpl.replace(matches[i], childTpl);
					}
				}
				return tpl;
			},	//获取嵌套模板
			getAllModelList: function(){

			},	//根据modelList获取全部model，包括model自身包含的所有分支
			htmlStyles: (function () {
                var list = {
                    'opt_labels': ['文本选项', '宽高选项', '边框与背景', '边距', '定位', '其它'],
                    '文本选项': [
                    { code: '', name: '选择要添加的样式' },
                    { code: 'color', name: '文字颜色', valueMode: 'colorPicker' },
                    { code: 'font-size', name: '字体大小', valueMode: 'input' },
                    {
                        code: 'white-space', name: '换行控制', valueMode: 'select', valueSet: [
                            { name: '请选择', value: '' }, { name: '不允许', value: 'nowrap' },
                            { name: '允许', value: 'normal' }
                        ]
                    },
                    { code: 'line-height', name: '行高', valueMode: 'input' },
                    { code: 'word-spacing', name: '字间距', valueMode: 'input' },
                    {
                        code: 'font-weight', name: '文字加粗', valueMode: 'select', valueSet: [
                              { name: '请选择', value: '' }, { name: '不加粗', value: 'normal' }, { name: '加粗', value: 'bold' }
                        ]
                    },
                    {
                        code: 'text-align', name: '文字对齐', valueMode: 'select', valueSet: [
                            { name: '请选择', value: '' }, { name: '左对齐', value: 'left' }, { name: '居中', value: 'center' }, { name: '右对齐', value: 'right' }
                        ]
                    }],
                    '宽高选项': [
                            { code: 'height', name: '高度', valueMode: 'input' },
                            { code: 'width', name: '宽度', valueMode: 'input' },
                            { code: 'min-height', name: '最小高度', valueMode: 'input' },
                            { code: 'min-width', name: '最小宽度', valueMode: 'input' },
                            {
                                code: 'overflow', name: '超出宽高时', valueMode: 'select', valueSet: [
                                { name: '请选择', value: '' }, { name: '自动', value: 'auto' }, { name: '隐藏', value: 'hidden' }, { name: '滚动', value: 'scroll' }
                                ]
                            },
                            {
                                code: 'overflow-y', name: '超出高度时', valueMode: 'select', valueSet: [
                                { name: '请选择', value: '' }, { name: '自动', value: 'auto' }, { name: '隐藏', value: 'hidden' }, { name: '滚动', value: 'scroll' }
                                ]
                            },
                            {
                                code: 'overflow-x', name: '超出宽度时', valueMode: 'select', valueSet: [
                                { name: '请选择', value: '' }, { name: '自动', value: 'auto' }, { name: '隐藏', value: 'hidden' }, { name: '滚动', value: 'scroll' }
                                ]
                            }
                    ],

                    '边框与背景': [
                            { code: 'border', name: '边框', valueMode: 'input' },
                            { code: 'border-top', name: '上边框', valueMode: 'input' },
                            { code: 'border-bottom', name: '下边框', valueMode: 'input' },
                            { code: 'border-left', name: '左边框', valueMode: 'input' },
                            { code: 'border-right', name: '右边框', valueMode: 'input' },
                            { code: 'background', name: '背景', valueMode: 'colorPicker' }],
                    '边距': [
                            { code: 'padding', name: '内边距(上 右 下 左)', valueMode: 'input' },
                            { code: 'padding-left', name: '左内边距', valueMode: 'input' },
                            { code: 'padding-right', name: '右内边距', valueMode: 'input' },
                            { code: 'padding-top', name: '上内边距', valueMode: 'input' },
                            { code: 'padding-bottom', name: '下内边距', valueMode: 'input' },

                            { code: 'margin', name: '外边距(上 右 下 左)', valueMode: 'input' },
                            { code: 'margin-left', name: '左外边距', valueMode: 'input' },
                            { code: 'margin-right', name: '右外边距', valueMode: 'input' },
                            { code: 'margin-top', name: '上外边距', valueMode: 'input' },
                            { code: 'margin-bottom', name: '下外边距', valueMode: 'input' }],
                    '定位': [
                            {
                                code: 'position', name: '定位方式', valueMode: 'select', valueSet: [
                                        { name: '请选择', value: '' }, { name: '绝对', value: 'absolute' }, //                                
                                          { name: '相对', value: 'relative' },
                                          { name: '固定', value: 'fixed' },
                                          { name: '静止', value: 'static' }
                                ]
                            },
                            { code: 'z-index', name: '层次', valueMode: 'input' },
                            { code: 'top', name: '上距离', valueMode: 'input' },
                            { code: 'left', name: '左距离', valueMode: 'input' },
                            { code: 'bottom', name: '下距离', valueMode: 'input' },
                            { code: 'right', name: '右距离', valueMode: 'input' },
                    ],

                    '其它': [
                            {
                                code: 'cursor', name: '光标样式', valueMode: 'select', valueSet: [
                                        { name: '请选择', value: '' }, { name: '抓手', value: 'pointer' }, //                                
                                          { name: '帮助', value: 'help' },
                                          { name: '移动', value: 'move' },
                                          { name: '等待', value: 'wait' },
                                          { name: '文字选择', value: 'text' },
                                          { name: '没有', value: 'none' },
                                ]
                            }
                            //, {
                            //    code: 'float', name: '浮动', valueMode: 'select', valueSet: [
                            //        { name: '靠左', value: 'left' }, { name: '靠右', value: 'right' }
                            //    ]
                            //}
                    ]
                };
                return list;
            })(),
            getHtmlStyle: function(code){
            	for(var key in ControlList.pubFun.htmlStyles){
            		if(key === 'opt_labels'){
            			continue;
            		}
            		var style = ControlList.pubFun.htmlStyles[key].firstOrNull(function(item){
            			return item.code === code;
            		});
            		if(style){
            			return toolBox.clone(style);
            		}
            	}
            	return null;
            }
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
			attrBindings: {
				'.name': 'name',
				'[name=title]': 'title',
				'[name=defaultValue]': 'defaultValue',
				'input[name=isVisible]': 'isVisible',
				'[name=float_xx_w242342342342123123rewwer]': 'float',
				'[bind=htmlStyle]': {
					observe: 'temp_sxad',
					selectOptions: {
						collection: function () {
                            var list = ControlList.pubFun.htmlStyles;
                            return list;
                        },
                        labelPath: 'name',
                        valuePath: 'code'
					},
					onSet: function(value, options){
						var htmlStyles = this.model.get('htmlStyles');
						var style = ControlList.pubFun.getHtmlStyle(value);
						var bool = htmlStyles.addByFun(style, function(s, hsItem){
							return s.code !== hsItem.code;
						});
						if(bool){
							this.model.trigger('change:htmlStyles', this.model);
						}
						$(options.selector).val('');	//设置成默认值
					}
				},
				'[bind=htmlStyleList]': {
					observe: 'htmlStyles',
					updateMethod: 'html',
					onGet: function(value, options){
						var self = this;
						var index = 0;
						return _.map(value, function(item){
							item = toolBox.clone(item);
							item.index = index++;
							return Handlebars.compile(self.model.get('viewTemplate').attrHtmlStyle())(item);
						});
					}
				},
                'select[name=colCount-xs]': {//bootstrap布局
                    observe: 'colCountXS',
                    selectOptions: {
                        collection: function () {
                            var arr = [0, 8, 16, 25, 33, 41, 50, 58, 66, 75, 83, 91, 100];
                            var ret = [{ name: '无', value: '' }];
                            for (var i = 1; i < 13; i++) {
                                ret.push({ name: arr[i] + '%', value: 'col-xs-' + i });
                            }
                            return ret;
                        },
                        labelPath: 'name',
                        valuePath: 'value'
                    },
                    defaultOption: {
                        label: '100',
                        value: 'col-xs-12'
                    },
                    onGet: function (val) {
                        return val;
                    },
                    onSet: function (val) {
                        this.model.set('colCount', val + ' ' + this.model.get('colCountSM') + ' ' + this.model.get('colCountMD') + ' ' + this.model.get('colCountLG'));
                        return val;
                    }
                },
                'select[name=colCount-sm]': {//bootstrap布局
                    observe: 'colCountSM',
                    selectOptions: {
                        collection: function () {
                            //{ name: '', value: '' }
                            var arr = [0, 8, 16, 25, 33, 41, 50, 58, 66, 75, 83, 91, 100];
                            var ret = [{ name: '无', value: '' }];
                            for (var i = 1; i < 13; i++) {
                                ret.push({ name: arr[i] + '%', value: 'col-sm-' + i });
                            }
                            return ret;
                        },
                        labelPath: 'name',
                        valuePath: 'value'
                    },
                    defaultOption: {
                        label: '100',
                        value: 'col-sm-12'
                    },
                    onGet: function (val) {
                        return val;
                    },
                    onSet: function (val) {
                        this.model.set('colCount', this.model.get('colCountXS') + ' ' + val + ' ' + this.model.get('colCountMD') + ' ' + this.model.get('colCountLG'));
                        return val;
                    }
                },
                'select[name=colCount-md]': {//bootstrap布局
                    observe: 'colCountMD',
                    selectOptions: {
                        collection: function () {
                            var arr = [0, 8, 16, 25, 33, 41, 50, 58, 66, 75, 83, 91, 100];
                            var ret = [{ name: '无', value: '' }];
                            for (var i = 1; i < 13; i++) {
                                ret.push({ name: arr[i] + '%', value: 'col-md-' + i });
                            }
                            return ret;
                        },
                        labelPath: 'name',
                        valuePath: 'value'
                    },
                    defaultOption: {
                        label: '100',
                        value: 'col-md-12'
                    },
                    onGet: function (val) {
                        return val;
                    },
                    onSet: function (val) {
                        this.model.set('colCount', this.model.get('colCountXS') + ' ' + this.model.get('colCountSM') + ' ' + val + ' ' + this.model.get('colCountLG'));
                        return val;
                    }
                },
                'select[name=colCount-lg]': {//bootstrap布局
                    observe: 'colCountLG',
                    selectOptions: {
                        collection: function () {
                            var arr = [0, 8, 16, 25, 33, 41, 50, 58, 66, 75, 83, 91, 100];
                            var ret = [{ name: '无', value: '' }];
                            for (var i = 1; i < 13; i++) {
                                ret.push({ name: arr[i] + '%', value: 'col-lg-' + i });
                            }
                            return ret;
                        },
                        labelPath: 'name',
                        valuePath: 'value'
                    },
                    defaultOption: {
                        label: '100',
                        value: 'col-lg-12'
                    },
                    onGet: function (val) {
                        return val;
                    },
                    onSet: function (val) {
                        this.model.set('colCount', this.model.get('colCountXS') + ' ' + this.model.get('colCountSM') + ' ' + this.model.get('colCountMD') + ' ' + val);
                        return val;
                    },
                }
			},
			designBindings: {
				'[name=defaultValue]': 'defaultValue',
				':el': {
					attributes: [{
						name: 'class',	
						observe: 'isVisible',
						onGet: function(value, options){
							return toolBox.stringToBool(value) ? '' : 'hidden-xs-up';	//显示/隐藏
						}
					},{
						name: 'class',
						observe: 'float',
						onGet: function(value, options){
							return value;
						}

					},{
						name: 'class',
						observe: 'colCount',
						onGet: function(value, options){
							if(this.model.get('type') === 'page'){
								return '';
							}
							return value;
						}
					}]
				}
			},
			afterCreate: function(){
				var self = this;
				(function(){
					if(self.get('title') === '' || self.get('title') === this.get('name')){
						if(!ControlList.config.idsCache[self.get('type')]){
							ControlList.config.idsCache[self.get('type')] = 0;
						}
						ControlList.config.idsCache[self.get('type')]++;
						self.set({title: self.get('name') + '_' +  ControlList.config.idsCache[self.get('type')]});
					}
				})();	//设置控件名称
			},	//这里的this指的是backbone控件模型
			viewTemplate: {
				design: function(){ return ''; },
				attrHtmlStyle: function() { return ControlList.getTemplate('tpl-attrHtmlStyle'); }
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
			designRender: {
				before: function(){},
				after: function(){
					this.sort();
				}
			},
			designMethod: {
				$sort: function(){
					return this.$designAreaInterior();
				},
				$designAreaInterior: function(){
					return this.$('> .designAreaInterior');
				},
				sort: function(){
					var self = this;
					this.$sort().sortable({
						items: '> .controlDesign',	//只允许直系子元素排序
						revert: true,
						placeholder: 'ui_placeholder',
						distance: 15,
						start: function(e, ui){
							console.log(e);
						},
						update: function(e, ui){
							if(ui.item.is('.controlFace')){	//如果是从"工具箱"拖拽过来的
								var controlType = ui.item.attr('controltype');
								ui.item.replaceWith('<div id="insertplaceholder">占位符</div>');
								self.model.appRouter.navigate(controlType + '/insert', { trigger: true});
								self.model.appRouter.navigate('', { trigger: true});
							}
						}
						// change: function(evt, ui){
						// 	if(ui.placeholder){
						// 		ui.placeholder.addClass('ui_placeholder');
						// 	}
						// }
					});
					this.model.appRouter.navigate(this.model.cid + '/$sort/linkSort', {trigger: true});	//让设计区域控件排序功能 与工具箱控件的拖拉关联
					this.model.appRouter.navigate('', {trigger: true});
				},	//设计区域控件排序
				renderOne: function(controlModel){
					var view = new mvcHelperExtend.controlDesignView({
						model: controlModel,
						className: 'controlDesign'
					});
					this.$designAreaInterior().append(view.render().el);
				},
				appendControl: function(model){
					this.renderOne(model);	//渲染
					model.view.select();	//选中
				}
			},	//这里的this指代页面控件视图
			viewTemplate: {
				design: function() { 
					return ControlList.pubFun.getTemplate('tpl-pageDesign'); 
				},
				attr: function(){
					return ControlList.pubFun.getTemplate('tpl-pageAttr'); 	
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
