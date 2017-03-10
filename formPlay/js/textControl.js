(function($, ControlList){
	ControlList.textControl = (function(){
		return {
			name: '文本框',
			type: 'text',
			viewTemplate: {
				design: function(){
					return ControlList.pubFun.getTemplate('tpl-textDesign');
				}
			},
			newObj: function(values){
				var base = $.extend(true, {}, ControlList.baseControl.newObj(values), this);
				base = $.extend(true, base, base.property);
				return base;
			}
		};
	})();
})($, ControlList);