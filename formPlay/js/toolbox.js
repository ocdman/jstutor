var toolBox = {
    eachObj: function (json,forEach) {
        if (sObj == null) return;
        if (sObj == undefined) return;

        if (typeof sObj !== "object") {
            return;
        }
        var s = {};
        if (sObj.constructor == Array) {
            s = [];
        }
        for (var i in sObj) {
            s[i] = toolBox.clone(sObj[i]);
        }
        return s;
    },
    clone: function (sObj) {
        //if (!(constructor in sObj))
        //    return sObj;
        if (sObj == null) return sObj;
        if (sObj == undefined) return sObj;

        if (typeof sObj !== "object") {
            return sObj;
        }
        var s = {};
        if (sObj.constructor == Array) {
            s = [];
        }
        for (var i in sObj) {
            s[i] = toolBox.clone(sObj[i]);
        }
        return s;
    }, //深复制
    deepExtend: function (obj) {
        //if (arguments.length < 2) return obj;

        //for (var i = 1; i < arguments.length; i++) //
        //{
        //    var _obj = arguments[i];
        //    if (typeof (obj) != 'object' || (obj != 0 && !obj)) //
        //    {
        //        obj = toolBox.clone(arguments[i]);
        //    }else if (obj.constructor == Array && _obj.constructor == Array) {
        //        for (var j = 0; j < _obj.length; j++)//
        //        {
        //            obj.push(toolBox.clone(_obj[j]));
        //        }
        //    }else {
        //        for (var key in _obj) //
        //        {
        //            if (obj.hasOwnProperty(key)) //
        //            {
        //                obj[key] = toolBox.deepExtend(obj[key], _obj[key]);
        //            } else {
        //                obj[key] = toolBox.clone(_obj[key]);
        //            }
        //        }
        //    }
        //}

        //return obj;
    }, //深度扩展对象
    stringToBool: function (str) {
        if (typeof str == 'string' && str.constructor == String) {
            var reg = new RegExp('\s*(true|是|1)\s*', 'i');
            if (reg.test(str))
                return true;
            else
                return false;
        }
        return !!str;
    }, //字符串转bool值

    addWindowLoadEvent:function (func){
        var oldonload=window.onload;
        if(typeof window.onload!="function"){
            window.onload=func;
        }
        else{
            window.onload=function(){
                oldonload();
                func();
            }
        }
    },//追加window.onload事件

    delay: function (options)
    {
        var time = options.time; //判断的间隔时间
        var condition = options.condition; //条件函数，当返回真时，执行callback
        var callback = options.callback; //要执行的函数
        var j = function () {
            if (condition())
            {
                clearInterval(set);
                callback(true);
            }       
        };
        var set;
        if (condition()) {
            callback(false);
            return false;//未延迟
        }
        else {
            set = setInterval(j, time);
            return true;//延迟
        }
    }, //延迟执行函数，返回true表示延迟执行，返回false表示未延迟。
    
    formatDate : function(datetime,format){ 
        var o = { 
            "M+": datetime.getMonth() + 1, //month 
            "d+": datetime.getDate(), //day 
            "h+": datetime.getHours(), //hour 
            "m+": datetime.getMinutes(), //minute 
            "s+": datetime.getSeconds(), //second 
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //quarter 
            "S": datetime.getMilliseconds() //millisecond 
        } 

        if(/(y+)/.test(format)) { 
            format = format.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        } 

        for(var k in o) { 
            if(new RegExp("("+ k +")").test(format)) { 
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
            } 
        } 
        return format; 
    }, //日期时间格式化

    stringToKeyValList: function (string)
    {
        if (!string) return [];
        var list = [];
        var ary=string.split('#');
        for(var i=0;i<ary.length;i++)
        {
            var ary2 = ary[i].split('|');
            list.push({value:ary2[0],text:ary2[1]});
        }
        return list;
    }, //分裂字符串为键值对数组：1|aaa#2|ddd#3|ssss 转换为：[{value:1,text:'aaa'},{value:2,text:'ddd'},{value:3,text:'ssss'}]

    keyValListToString: function (list)
    {
        if (typeof list == 'string')
            return list;

        var ary = [];
        for (var i = 0; i < list.length; i++)
        {
            ary.push(list[i].value+'|'+list[i].text);
        }
        return ary.join('#');
    }
};

Array.prototype.removeByFun = function (fun) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if (fun(this[i])) {
            this.splice(i, 1);
            i--;
            len--;
        }
    }
    return this;
}; //根据fun的返回值为true，移除项
Array.prototype.remove = function (m) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
        if(this[i]==m)
        {
            this.splice(i, 1);
            i--;
            len--;
        }
    }
    return this;
}; //移除项
Array.prototype.add = function (m) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == m)
            return false;
    }
    this.push(m);
    return true;
};//添加，已存在则不添加；返回true,表示添加；返回false，表示未已存在，未添加
Array.prototype.addByFun = function (m, fun) {
    for (var i = 0; i < this.length; i++) {
        if (!fun(m, this[i]))
            return false;
    }
    this.push(m);
    return true;
};//添加，已存在则不添加；返回true,表示添加；返回false，表示未已存在，未添加
Array.prototype.copyByFun = function (list, fun) {
    for (var i = 0; i < list.length; i++) {
        var b = true;
        for (var j = 0; j < this.length; j++) {
            if(!fun(list[i],this[j]))
            {
                b = false;
                continue;
            }
        }
        if (b)
            this.push(list[i]);
    }
    return this;
};
Array.prototype.joint = function (ary, compare, fun) {
    var list = [];
    //debugger;
    for (var i = 0; i < this.length; i++)
    {
        for (var j = 0; j < ary.length; j++)
        {
            if (compare(this[i], ary[j]))
            {
                list.push(fun(this[i],ary[j]));
            }
        }
    }
    return list;
};//添加，已存在则不添加
Array.prototype.clear = function () {
    while (this.length > 0) {
        this.shift();
    }
    return this;
};
Array.prototype.select = function (fun) {
    var ary = [];
    for (var i = 0; i < this.length; i++) {
        ary.push(fun(this[i]));
    }
    return ary;
};
Array.prototype.each = function (fun) {
    for (var i = 0; i < this.length; i++) {
        fun(this[i]);
    }
};
Array.prototype.filter = function (fun) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        if (fun(this[i]))
            result.push(this[i]);
    }
    return result;
};
Array.prototype.tree = function (getId, getPid, rootId) {
    var result = this.filter(function (a) {
        var pid=getPid(a);
        return pid == rootId || (!rootId && !pid);
    });
    for (var i = 0; i < result.length; i++)
    {
        result[i].children = this.tree(getId, getPid, getId(result[i]));
    }
    return result;
};
Array.prototype.foreaTree = function (fun) {
    for(var i=0;i<this.length;i++)
    {
        fun(this[i]);
        if (this[i].children && this[i].children.constructor === Array)
            this[i].children.foreaTree(fun);
    }
}; //应该叫foreachTrea，之前写错了方法名。
Array.prototype.exist = function (fun) {
    for(var i=0;i<this.length;i++)
    {
        if (fun(this[i]))
            return true;
    }
    return false;
};
Array.prototype.firstOrNull = function (fun) {
    for (var i = 0; i < this.length; i++) {
        if (fun(this[i]))
            return this[i];
    }
    return null;
};
Array.prototype.pairing = function (ary,compare) {
    var result = [];
    for (var i = 0; i < this.length; i++)
    {
        var b = true;
        for (var j = 0; j < ary.length; j++)
        {
            if(compare(this[i],ary[j]))
            {
                b = false;
                result.push({self:this[i],side:ary[j]});
            }
        }
        if(b)
        {
            result.push({ self: this[i], side: null});
        }

    }

    for (var i = 0; i < ary.length; i++)
    {
        var b = true;
        for (var j = 0; j < this.length; j++)
        {
            if (compare(this[j], ary[i])) {
                b = false;
            }
        }
        if (b) {
            result.push({ self: null, side: ary[i] });
        }
    }
    return result;
    //下面是使用例子
    //var ary1 = [1, 2, 3];
    //var ary2 = [2, 3, 4];
    //var pairingResult = ary1.pairing(ary2, function (self, side) {
    //    return self == side;
    //});
    //结果pairingResult=[{self:1,side:null},{self:2,side:2},{self:3,side:3},{self:null,side:4}];
}; //配对函数，方便。具体展开方法体看使用例子.类似SQL的full json
Array.prototype.group = function (fun) {
    var obj = {};
    var sign;
    for (var i = 0; i < this.length; i++) {
        sign = fun(this[i]);
        if (!obj.hasOwnProperty(sign)) {  
            obj[sign] = [];
        }
        obj[sign].push(this[i]);
    }
    return obj;
};
Array.prototype.count = function (fun) {
    var c = 0;
    for (var i = 0; i < this.length; i++) {
        if (fun(this[i]))
            c++;
    }
    return c;
};
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Array.prototype.addWithCover = function (item,fun) {
    for (var i = 0; i < this.length; i++) {
        if (fun(this[i]))
        {
            this.splice(i, 1, item);
            return;
        }
    }
    this.push(item);
}; //添加时，如果已存在(fun返回真)则覆盖原来
