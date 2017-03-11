(function($, ControlList){
	ControlList.textControl = (function(){
		return {
			name: '文本框',
			type: 'text',
			designBindings: {
                '[name="defaultValue"]': 'defaultValue',
                '[name="defaultValue"]': {
                    attributes: [{
                        name: 'type',
                        observe: 'passwordStyle',
                        onGet: function (value, options) {
                            if (value) {
                                return 'password';
                            } else {
                                return 'text';
                            }
                        }
                    }]
                }
            },
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