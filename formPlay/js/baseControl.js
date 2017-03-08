window.ControlList = {};

(function($){
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

	ControlList._control = (function(){
		return {
			name: '',
			type: '',
			property: {},
			designMethod: {},
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
			newObj: function(values){
				var base = $.extend(true, {}, ControlList._control.newObj(values), this);
				if(typeof values === 'object'){
					base.rebuild(values);
				}
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
				appendControl: function(){

				}
			},
			newObj: function(values, options){
				var base = $.extend(true, {}, ControlList.baseControl.newObj(), this);
				if(typeof values === 'object'){
					base.rebuild(values);
				}
				base = $.extend(true, base, base.property);
				return base;
			}
		};
	})();
})($);