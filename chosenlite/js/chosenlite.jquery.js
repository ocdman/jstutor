var __hasProp = {}.hasOwnProperty,
__extends = function(child, parent){
  for(var key in parent){
    if(__hasProp.call(parent, key)){
      child[key] = parent[key];
    }
  }
  function ctor(){
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};

SelectParser = (function(){
  function SelectParser(){
    this.options_index = 0;
    this.parsed = [];
  }

  SelectParser.prototype.add_node = function(child){
    return this.add_option(child);
  };

  //解析select，添加选项
  SelectParser.prototype.add_option = function(option, group_position, group_disabled){
    if(option.nodeName.toUpperCase() === 'OPTION'){
      if(option.text !== ''){
        if(group_position != null){
          this.parsed[group_position].children += 1;
        }
        this.parsed.push({
          array_index: this.parsed.length,
          options_index: this.options_index,
          value: option.value,
          text: option.text,
          html: option.innerHTML,
          title: option.title ? option.title : void 0,
          selected: option.selected,
          disabled: group_disabled === true ? group_disabled : option.disabled,
          group_array_index: group_position,
          group_label: group_position != null ? this.parsed[group_position].label : null,
          classes: option.className,
          style: option.style.cssText
        });
      }
    }
  };
  return SelectParser;
})();

  //将select选项转换成数组
  SelectParser.select_to_array = function(select){
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for(_i = 0, _len = _ref.length; _i < _len; _i++){
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };


AbstractChosen = (function(){
  function AbstractChosen(form_field, options){
    this.form_field = form_field;
    this.options = options != null ? options : {};
    this.is_multiple = this.form_field.multiple;
    this.set_default_text();
    this.set_default_values();
    this.setup();
    this.set_up_html();
    this.register_observers();
    this.on_ready();
  }
  
  AbstractChosen.prototype.set_default_text = function(){
    if(this.form_field.getAttribute('data-placeholder')){
      this.default_text = this.form_field.getAttribute('data-placeholder');
    }else if(this.is_multiple){
      this.default_text = AbstractChosen.default_multiple_text;
    }
  };
  
  AbstractChosen.prototype.set_default_values = function(){
    this.results_showing = false;
    this.max_selected_options = this.options.max_selected_options || Infinity;  //最多选择项的个数
    this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY;  //下拉框最多显式的个数
  };
  
  AbstractChosen.prototype.setup = function(){
    this.form_field_jq = $(this.form_field);
    this.current_selectedIndex = this.form_field.selectedIndex;
    return this.is_rtl = this.form_field_jq.hasClass('chosen-rtl');
  };
  
  AbstractChosen.prototype.set_up_html = function(){
    var container_classes, container_props;
    container_classes = ['chosen-container'];
    container_classes.push('chosen-container-' + (this.is_multiple ? 'multi' : 'single'));
    if(this.inherit_select_classes && this.form_field.className){
      container_classes.push(this.form_field.className);
    }
    if(this.is_rtl){
      container_classes.push('chosen-rtl');
    }
    container_props = {
      'class': container_classes.join(' '),
      'style': 'width: ' + this.container_width() + ';',
      'title': this.form_field.title
    };
    if(this.form_field.id.length){
      container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + '_chosen';
    }
    this.container = $('<div />', container_props);
    if(this.is_multiple){
      this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width: 25px;" /> </li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
    }
    this.form_field_jq.hide().after(this.container);  //隐藏原来的select元素，使用新的容器来替代
    this.dropdown = this.container.find('div.chosen-drop').first(); //下拉框
    this.search_field = this.container.find('input').first(); //类似于h5的占位符
    this.search_results = this.container.find('ul.chosen-results').first(); //下拉框选项
    this.search_field_scale();  //给占位符设置宽度
    if(this.is_multiple){
      this.search_choices = this.container.find('ul.chosen-choices').first(); //选择的项
      this.search_container = this.container.find('li.search-field').first(); //占位符选项
    }
    this.results_build();
  };
  
  //注册事件观察者
  AbstractChosen.prototype.register_observers = function(){
    var _this = this;

    this.search_results.bind('mouseover.chosen', function(evt){
      _this.search_results_mouseover(evt);
    });

    this.search_results.bind('mouseout.chosen', function(evt) {
      _this.search_results_mouseout(evt);
    });

    this.search_results.bind('mouseup.chosen', function(evt){
      _this.search_results_mouseup(evt);
    });

    if(this.is_multiple){
      //绑定选择的项的单击事件
      return this.search_choices.bind('click.chosen', function(evt){
        _this.choices_click(evt);
      });
    }
  };
  
  AbstractChosen.prototype.on_ready = function(){
    
  };

  AbstractChosen.prototype.container_width = function() {
    if(this.options.width != null){
      return this.options.width;
    } else {
      return '' + this.form_field.offsetWidth + 'px';
    }
  };

  //单击选择项
  AbstractChosen.prototype.choices_click = function(evt){
    evt.preventDefault();
    if(!(this.results_showing || this.is_disable)){
      return this.results_show();
    }
  };

  AbstractChosen.prototype.choices_count = function(){
    var option, _i, _len, _ref;
    if(this.selected_option_count != null){
      return this.selected_option_count;
    }
    this.selected_option_count = 0;
    _ref = this.form_field.options;
    for(_i = 0, _len = _ref.length; _i < _len; _i++){
      option = _ref[_i];
      if(option.selected){
        this.selected_option_count += 1;
      }
    }
    return this.selected_option_count;
  };

  //生成下拉框选项值
  AbstractChosen.prototype.results_option_build = function(options){
    var content, data, data_content, shown_results, _i, _len, _ref;
    content = '';
    shown_results = 0;
    _ref = this.results_data;
    for(_i = 0, _len = _ref.length; _i < _len; _i++){
      data = _ref[_i];
      data_content = '';
      if(data.group){
        data_content = this.result_add_group(data);
      }else{
        data_content = this.result_add_option(data);
      }
      if(data_content !== ''){
        shown_results++;
        content += data_content;
      }
      if(options != null ? options.first : void 0){
        if(data.selected && this.is_multiple){
          //this.choice_build(data);
        }
      }
      if(shown_results >= this.max_shown_results){
        break;
      }
    }
    return content;
  };

  //新添加下拉框选项
  AbstractChosen.prototype.result_add_option = function(option){
    var classes, option_el;
    if(!option.search_match){
      return '';
    }
    if(!this.include_option_in_results(option)){
      return '';
    }
    classes = [];
    if(!option.disabled && !(option.selected && this.is_multiple)){
      classes.push('active-result');
    }
    if(option.disabled && !(option.selected && this.is_multiple)){
      classes.push('disabled-result');
    }
    if(option.selected){
      classes.push('result-selected');
    }
    if(option.classes !== ''){
      classes.push(option.classes);
    }
    option_el = document.createElement('li');
    option_el.className = classes.join(' ');
    option_el.style.cssText = option.style;
    option_el.setAttribute('data-option-array-index', option.array_index);
    option_el.innerHTML = option.search_text;
    if(option.title){
      option_el.title = option.title;
    }
    return this.outerHTML(option_el);
  };

  AbstractChosen.prototype.include_option_in_results = function(option){
    if(this.is_multiple && (!this.display_selected_options && option.selected)){
      return false;
    }
    if(this.display_disabled_options && option.disabled){
      return false;
    }
    if(option.empty){
      return false;
    }
    return true;
  };

  AbstractChosen.prototype.winnow_results = function(){
    var option, _i, _len, _ref;
    _ref = this.results_data;
    for(_i = 0, _len = _ref.length; _i < _len; _i++){
      option = _ref[_i];
      // option.search_match = false;
      option.search_match = true;
      option.search_text = option.group ? option.label : option.html;
    }
    this.update_results_content(this.results_option_build());
  };

  AbstractChosen.prototype.outerHTML = function(el){
    var tmp;
    if(el.outerHTML){
      return el.outerHTML;
    }
    tmp = document.createElement('div');
    tmp.appendChild(el);
    return tmp.innerHTML;
  }
  
  AbstractChosen.default_multiple_text = "Select some options";
  
  return AbstractChosen;
  
})();

$ = jQuery;

$.fn.extend({
  chosen: function(options){
    return this.each(function(input_field){
      var $this, chosen;
      $this = $(this);
      chosen = $this.data('chosen');
      if(!(chosen instanceof Chosen)){
        $this.data('chosen', new Chosen(this, options));
      }
    });
  }
});

Chosen = (function(_super){
  __extends(Chosen, _super);
  
  function Chosen(){
    _ref = Chosen.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Chosen.prototype.search_field_scale = function(){
    var div, f_width, h, style, style_block, styles, w, _i, _len;
    if(this.is_multiple) {
      h = 0;
      w = 0;
      style_block = 'position:absolute; left: -1000px; top: -1000px; display:none;';
      styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
      for(_i = 0, _len = styles.length; _i < _len; _i++){
        style = styles[_i];
        style_block += style + ':' + this.search_field.css(style) + ';';
      }
      div = $('<div />', {
        'style': style_block
      });
      div.text(this.search_field.val());
      $('body').append(div);
      w = div.width() + 25;
      div.remove();
      f_width = this.container.outerWidth();      
      if(w > f_width - 10){
        w = f_width - 10;
      }
      return this.search_field.css({
        'width': w + 'px'
      });
    }
  };

  Chosen.prototype.results_show = function(){
    if(this.is_multiple && this.max_selected_options <= this.choices_count()){
      this.form_field_jq.trigger('chosen:maxselected', {
        chosen: this
      });
      return false;
    }
    this.container.addClass('chosen-with-drop');
    this.results_showing = true;
    this.search_field.focus();
    this.search_field.val(this.search_field.val());
    this.winnow_results();
    return this.form_field_jq.trigger('chosen: showing_dropdown',{
      chosen: this
    });
  };

    Chosen.prototype.results_build = function(){
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);  //select选项值的数组
      if(this.is_multiple){
        this.search_choices.find('li.search-choice').remove();  //清空选择项的值
      }
      this.results_option_build({first: true});
      // this.update_results_content(this.results_option_build({
      //   first: true
      // }));
      // this.search_field_disabled();
      // this.show_search_field_default();
      // this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.update_results_content = function(content){
      return this.search_results.html(content);
    };

    Chosen.prototype.choice_build = function(item){
      var choice, close_link,
        _this = this;
      choice = $('<li />', {
        'class': 'search-choice'
      }).html('<span>' + (this.choice_label(item)) + '</span>');
      if(item.disabled){
        choice.addClass('search-choice-disabled');
      }else{
        close_link = $('<a />', {
          'class': 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.bind('click.chosen', function(evt){
          return _this.choice_destory_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt){
      evt.preventDefault();
      evt.stopPropagation();
      if(!this.is_disable){
        return this.choice_destory($(evt.target));
      }
    };

    Chosen.prototype.choice_destory = function(link){
      if(this.result_deselect(link[0].getAttribute('data-option-array-index'))){
        this.show_search_field_default();
        if(this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1){
          this.result_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt){
      var target;
      target = $(evt.target).hasClass('active-result') ? $(evt.target) : $(evt.target).parents('.active-result').first();
      if(target){
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.result_do_highlight = function(el){
      if(el.length){
        this.result_highlight = el; //下拉框选项高亮元素
        this.result_highlight.addClass('highlighted');
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt){
      if($(evt.target).hasClass('active-result')){
        return this.result_clear_highlight();
      }
    }

    Chosen.prototype.result_clear_highlight = function(){
      if(this.result_highlight){
        this.result_highlight.removeClass('highlighted');
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.search_results_mouseup = function(evt){
      
    };

  return Chosen;

})(AbstractChosen);

(function($){
  
  
  // $.ready(function(){
    var config = {
      '.chosenlite': {}
    };
    for(var selector in  config){
      $(selector).chosen(config[selector]);
    }
  // });
})(jQuery);