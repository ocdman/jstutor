(function(){
	var model = new Model();
	var d1 = document.getElementById('d1');
	var d2 = document.getElementById('d2');

	// model.watch(function(value){
	// 	d1.innerHTML = value;
	// });

	// model.bind(d1);
	// model.bind(d2);
	// model.set('瞧吧,d1和d2被我改变了');

	//在controller中完成业务逻辑并对model进行修改，model的变化触发view的自动更新
	new Controller(function(models){
		var m1 = models.m1;
		var m2 = models.m2;
		m1.set('d1被我m1改变了');
		m2.set('哈哈，d2被我m2改变了');
	});
})();