//MVC的基础是观察者模式，这是实现model和view同步的关键

//简单起见，每个model实例只包含一个原始值
function Model(value){
	this._value = typeof value === 'undefined' ? '' : value;
	this._listeners = [];
}

Model.prototype.set = function(value) {
	var self = this;
	self._value = value;
	//model中的值改变时，通知注册过的回调函数
	//按照js的事件处理的一般机制，异步调用回调函数
	setTimeout(function(){
		self._listeners.forEach(function(listener){
			listener.call(self, value);
		});
	});
};

Model.prototype.watch = function(listener){
	//注册监听的回调函数
	this._listeners.push(listener);
};

//实现bind方法，绑定model和view
Model.prototype.bind = function(node){
	this.watch(function(value){
		node.innerHTML = value;
	});
};

//由于绑定需要手动完成，导致业务逻辑耦合度变高，实现Controller，将绑定从逻辑代码中解耦
//也就是说，绑定不在业务代码里出现，通过html的标签属性来完成绑定
function Controller(callback){
	var models = {};
	//找到所有bind属性的元素
	var views = document.querySelectorAll('[bind]');
	//将views作为普通数组
	views = Array.prototype.slice.call(views, 0);
	views.forEach(function(view){
		var modelName = view.getAttribute('bind');
		//取出或新建该元素所绑定的model
		models[modelName] = models[modelName] || new Model();
		//完成该元素和指定model的绑定
		models[modelName].bind(view);
	});
	//调用controller具体逻辑，将models传入，方便业务处理
	callback.call(this, models);
}