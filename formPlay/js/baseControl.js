window.ControlList = {};

(function($){
	var common = '通用';
	ControlList.list = (function(){
		return [
			{ name: '文本框', type: 'text', category: common}
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
})($);