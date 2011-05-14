!window.__stext_loaded__ && (function() {
window.__stext_loaded__ = true;
//TS = TextSelector

/**********************/
/*SETTINGS BLOCK BEGIN*/
/**********************/
if (!window.TS_CONFIG) window.TS_CONFIG = {};
window.TS_CONFIG.HIGHTLIGHT_TYPES = [//used by transport and menu
	{"type": 0, "css": "TSGood",    "text": "Good"},
	{"type": 1, "css": "TSNeutral", "text": "Neutral"},
	{"type": 2, "css": "TSBad",     "text": "Bad"},
	{"type": 3, "css": "TSMistake", "text": "Mistake"}
];

/********************/
/*SETTINGS BLOCK END*/
/********************/



/*******************/
/*UTILS BLOCK BEGIN*/
/*******************/

//что бы при разработке не париться об отсутствии firebug
!window.console && (function() {
	window.console = {};
	var fn_list = ['log', 'warn', 'info', 'error'],
		i = 0, li = fn_list.length, c = window.console;
		
	for(; i < li; i++) {
		c[fn_list[i]] = function() {};
	}
})();


/*
парсер для JSON данных
Вообще все неущербные браузеры имеют собственную реализацию объекта JSON
но некоторые особоодаренные (напрмер на хабре!!!!)
заменяют эту реализацию своей, причем без поддержи обратной совместимости.
Поэтому чтобы и json обрабатывать и работу сайта не нарушить
пришлось вынести объект JSON в TS_JSON.
IE не имеет собственной реализации объекта JSON, поэтому для него все равно
нужно писать свой парсер.
*/

window.TS_JSON = {}
var j = TS_JSON;



j.arrayToJSONString = function (obj) {
	var a = ['['], b, i, l = obj.length, v;
	function p(s) {
		if (b) {
			a.push(',');
		}
		a.push(s);
		b = true;
	}
	for (i = 0; i < l; i += 1) {
		v = obj[i];
		switch (typeof v) {
			case 'undefined':
			case 'function':
			case 'unknown':
				break;
			case 'object':
				if (v) {
					p(TS_JSON.stringify(v));
				} else {
					p("null");
				}
				break;
			default:
				p(TS_JSON.stringify(v));
		}
	}
	a.push(']');
	return a.join('');

}

j.dateToJSONString = function (obj) {
	function f(n) {
		return n < 10 ? '0' + n : n;
	}

	return '"' + obj.getFullYear() + '-' +
			f(obj.getMonth() + 1) + '-' +
			f(obj.getDate()) + 'T' +
			f(obj.getHours()) + ':' +
			f(obj.getMinutes()) + ':' +
			f(obj.getSeconds()) + '"';
}
	
j.booleanToJSONString = function (obj) {
	return String(obj);
}
	
j.numberToJSONString = function (obj) {
	return isFinite(obj) ? String(obj) : "null";
}
	
j.objectToJSONString = function (obj) {
	var a = ['{'], b, i, v;

	if (obj === null) return "null";
	function p(s) {
		if (b) {
			a.push(',');
		}
		a.push(TS_JSON.stringify(i), ':', s);
		b = true;
	}

	for (i in obj) {
		if (obj.hasOwnProperty(i)) {
			v = obj[i];
			switch (typeof v) {
			case 'undefined':
				p("null");
				break;
			case 'function':
			case 'unknown':
				break;
			case 'object':
				if (v) {
					p(TS_JSON.stringify(v));
				} else {
					p("null");
				}
				break;
			default:
				p(TS_JSON.stringify(v));
			}
		}
	}
	a.push('}');
	return a.join('');
}

j.stringToJSONString = function (obj) {
	var getAlt = function(ch) {
		switch (ch) {
			case '\b':
				return '\\b';
			case '\t':
				return '\\t';
			case '\n':
				return '\\n';
			case '\f':
				return '\\f';
			case '\r':
				return '\\r';
			case '"':
				return '\\"';
			case '\\':
				return '\\\\';
		}
		return ch;
	}
	var retstr = new String(obj);
	//retstr = obj;
	if (/["\\\/\b\f\n\r\t]/.test(obj)) {
		retstr = obj.replace(/(["\\\/\b\f\n\r\t])/g, function(a, b) {
			return getAlt(b);
		});
	}
	return '"' + retstr + '"';
}


j.stringify = function(object) {
	if (JSON && JSON.stringify) return JSON.stringify(object);
	
	var objType = typeof object;
	
	if (Object.prototype.toString.apply(object) === '[object Array]')
		objType = 'array';
	switch(objType) {
		case 'array':
			return j.arrayToJSONString(object);
		case 'boolean':
			return j.booleanToJSONString(object);
		case 'number':
			return j.numberToJSONString(object);
		case 'string':
			return j.stringToJSONString(object);
		case 'object':
			return j.objectToJSONString(object);
		case 'date':
			return j.dateToJSONString(object);
		default:
			return null;
	}
}

j.parse = function(str) {
	if (JSON && JSON.parse) return JSON.parse(str);
	
	try {
		return eval("("+str+")")
	} catch (e) {
		alert("JSON.parse exception, input=", str);
		return {}
	}
}





function defined(arg) {
	return window.___asdasdf !== arg;
}

function isFunc(arg) {
	return defined(arg) && arg.constructor === Function
}

function getCoords(event) {
	var body = document.body,
		docElem = document.documentElement,
		scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
		scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		
	return {
		x: event.clientX + scrollLeft,
		y: event.clientY + scrollTop
	}
}

Function.prototype.NEW = function() {
	var c = new this();
	c.__init__.apply(c, arguments);
	return c;
}

//замыкание на объект для функции
function callback(obj, f) {
	return function() {
		return f.apply(obj, arguments)
	}
}

Function.prototype.bind = function(obj) {
	return callback(obj, this);
}


/*******************/
/* UTILS BLOCK END */
/*******************/


/*********************/
/*CLASSES BLOCK BEGIN*/
/*********************/

/*
примитивная реализация передачи данных с/на сервер
используя тэг script
*/
ScriptTransport = function(){};
(function() {
	/*
	when get data = {
		url: string
		callback: string
	}
	
	when save data = {
		url: string
		hl_type: number
		text: string
	}
	*/
	this.__init__ = function(data) {
		this.data = data;
		this.script = document.createElement('script');
		this.script.type = "text/javascript";
		this.script.language = "JavaScript";
		document.getElementsByTagName('head')[0].appendChild(this.script);
	}
	
	this.get = function() {
		this.script.src = TS_CONFIG.SELECTION_GET + "?params=" + encodeURIComponent(TS_JSON.stringify(this.data));
	}
	
	this.save = function() {
		this.script.src = TS_CONFIG.SELECTION_SAVE + "?data=" + encodeURIComponent(TS_JSON.stringify(this.data));
	}
}).apply(ScriptTransport.prototype, []);

/*
TSRange класс, который эмулирует Range для ИЕ,
а также служит клоном оригинального Range.
Клонирование оригинального Range нужно потому что оригинальный
Range схлапывается (collapsed==true) во время клика по
всплывающему меню и во время обработки клика информация о границах
выделенного текста уже недоступна.
*/
TSRange = function(){};
(function(){
		
	this.__init__ = function(range, adjust) {
		this._adjust = adjust;
		(range.constructor === Range || range.constructor === TSRange) && this._cloneRange(range);
		range.constructor === Object && this._cloneRange(this._createRange(range));
		
		if (!this.range) throw new Error("TSRange: can't create range");
		this.textContent = this.range.toString();
	}
	
	this._cloneRange = function(range) {
		var prop_list = ['commonAncestorContainer', 'startContainer', 'endContainer', 'startOffset', 'endOffset'],
			i = 0, li = prop_list.length, prop;
			
		for (; i < li; i++) {
			prop = prop_list[i];
			this[prop] = range[prop];
		}
		
		this.range = range;
		this._adjust && this._adjustToWord();
	}
	
	this._createRange = function(range) {
		var r = document.createRange();
		r.setStart(range.startContainer, range.startOffset);
		r.setEnd(range.endContainer, range.endOffset);
		
		return r;
	}
	
	this._adjustToWord = function() {
		if (!this.range) return;
		
		var s_cont = this.startContainer,
			e_cont = this.endContainer,
			s_offset = this.startOffset,
			e_offset = this.endOffset,
			e_len = e_cont.textContent.length, i,
			stop_chars = {
				" ":1, "\n":1, "\r":1, "\n\r":1, ".":1,  ",":1, ':':1, ";":1,
				"!":1,  "?":1,  "'":1,    '"':1, "/":1, "\\":1, "<":1, ">":1,
				"%":1,  "`":1,  "~":1,    "#":1, "^":1,  "&":1
			};
			
		if (!(this._isTextNode(e_cont) && this._isTextNode(s_cont))) {
			console.warn("Can't adjust selection to word");
			return;
		}
		
		for (i = s_offset; i > -1 && !(s_cont.textContent.charAt(i) in stop_chars); i--) {}
		
		this.startOffset = i ? i + 1 : 0;
		this.range.setStart(s_cont, this.startOffset);
		
		for (i = e_offset; i < e_len && !(e_cont.textContent.charAt(i) in stop_chars); i++) {}
		
		this.endOffset = i == e_len ? i - 1 : i;
		this.range.setEnd(e_cont, this.endOffset);
	}
	
	this.toString = function() {
		return this.textContent;
	}
	
	this._isTextNode = function(node) {
		return node.constructor === Text;
	}

}).apply(TSRange.prototype, []);


/*
класс, который по тексту выделения создает Range объект
*/
RangeFactory = function(){};
(function(){
		
	this.__init__ = function() {
		this.root = document.body.parentNode;
		this._cache = {};
	}
	
	/*
	тут-то мы и ищем по куску текста элементы, в которых он содержится
	Функция рекурсивная, на вход идут ДОМ-узлы,
	текст который ищем получаем из this.text
	*/
	this._findBounds = function(elem) {
		var childs = elem.childNodes, node,
			i = 0, li = childs.length, tContent, pos, t_len;
			
	
		for (; i < li; i++) {
			if (this._cache.endContainer) return;
			node = childs[i];
			
			//если это не TextNode, углубляемся дальше в структуру дерева
			if (!this._isTextNode(node)) {
				arguments.callee.apply(this, [node]);
				continue;
			}
			
			tContent = node.textContent;
			if (!tContent) continue; //если нет текста, идем на следующую итерацию
			
			pos = tContent.indexOf(this.text);
			
			//if (!this._cache.startContainer && pos == -1) continue;
			
			if(pos != -1 && !this._cache.startContainer) {
				this._cache.startContainer = this._cache.endContainer = node;
				this._cache.startOffset = pos;
				this._cache.endOffset = pos + this.text.length;
				continue;
			}
			
			if (!this._cache.startContainer) {
				var j = 1, lj = tContent.length, pos, part;
				//этот цикл можно (и нужно) заменить бинарным поиском
				for (; j <= lj; j++) {
					part = this.text.substr(0, j);
					pos = tContent.indexOf(part);
					if (pos != -1 && pos + j == lj) {//нашли начало!
						this._cache.startContainer = node;
						this._cache.startOffset = pos;
						this.text = this.text.substr(j);
						break;
					}
				}
				continue;
			}
			
			
			//вроде как последний клочек текста
			if (!pos) {
				this._cache.endContainer = node;
				this._cache.endOffset = this.text.length;
				this.text = "";
				return
			}
			
			
			pos = this.text.indexOf(tContent);
			if (pos != 0) {
				console.warn("странная ситуация, что-то пошло не так, pos = ", pos);
				console.log("root = %o, node = %o, text = %s tContent = %s", this.curRoot, node, this.text, tContent);
				continue;
			}
			
			this.text = this.text.substr(tContent.length);
		}
	}
	
	//находим контейнер который содержит весь текст выделения.
	this._findCommonAncestorContainer = function(elem) {
		var childs = elem.children, node,
			i = 0, li = childs.length;
		
		for (; i < li; i++) {
			node = childs[i];
			if(node.textContent.replace(/\s/g, "").indexOf(this.text.replace(/\s/g, "")) != -1) {
				return arguments.callee.apply(this, [node]);
			}
		}
		
		return elem;
	}
	
	this._isTextNode = function(node) {
		return node.constructor === Text;
	}
	
	
	/*
	Пытаемся создать Range для куска текста
	в качестве результата отдаем либо ничего, либо TSRange
	*/
	this.getRange = function(text, adjust) {
		this.text = text;
		
		var root = this._findCommonAncestorContainer(this.root);
		if (!root || root === document.body.parentNode || root === document) {
			console.warn("RangeFactory::getRange - can't create range for text [%s]", text);
			return;
		}
		
		this.curRoot = root;
		
		this._findBounds(root);
		
		var range = TSRange.NEW(this._cache, adjust);
		this._cache = {};
		
		
		return range;
	}

}).apply(RangeFactory.prototype, []);




/*
Higthlighter класс, который подсвечивает выделенный текст.
range - Range,
tsStyle - string, css класс, который определяет стиль подсветки
*/
Higthlighter = function(){};
Higthlighter.unique = 1;
(function(){
	
	this.__init__ = function(range, tsStyle) {
		this.tsStyle = tsStyle;
		this.range = range;
		this._recursion_count = 1000; //железобетонная защита от бесконечной рекурсии
		this.unique = Higthlighter.unique++; //для механизма обнаружения "своих" конейнеров подсветки
		
		this.hightLight();
	}
	
	this.hightLight = function() {
		var range = this.range,
			root = range.commonAncestorContainer,
			startContainer = range.startContainer,
			endContainer = range.endContainer;
			
		/*
		рекурсивно обходим DOM дерево, начиная с узла root
		ищем все TextNode между startContainer и endContainer
		*/
		(function(node) {
			var isStart = node === startContainer,
				isEnd = node === endContainer,
				i = 0, c_node, res = false;
				
			/*
			уже нашли endContainer, значит дальше просматривать дерево не нужно
			это проверку можно внести в условие for, но мне почему-то не хочется этого делать
			*/
			if (this._end_found) return
			
			/*
			после вызова this._hightlightNode в DOM дерево добавляется новый узел
			node.childNodes изменяется, причем новый узел приходится на то место,
			где сейчас находится рекурсия.
			Следующим шагом рекурсия опрашивает текущий узел (который был текстовым, а теперь это контейнер)
			есть ли у него childNodes, они у него есть, причем 1, причем это тот текст 
			что мы уже обработали. Цепочка замкнулась.
			Что бы этого избежать, нам нужно иключить из обхода дерева вновь добавленные узлы.
			Для этого вновь добавленные узлы нужно пометить, что и делается в this._createContainer
			*/
			
			res = (function() {
				if (isStart && isEnd) {
					this._start_found = true;
					this._end_found = true;
					this._isTextNode(node) && node.textContent && this._hightlightNode(node, range.startOffset, range.endOffset);
				}
				
				if (isStart) {
					this._start_found = true;
					this._isTextNode(node) && node.textContent && this._hightlightNode(node, range.startOffset);
					return;
				}
				
				if (isEnd) {
					this._end_found = true;
					this._isTextNode(node) && node.textContent && this._hightlightNode(node, 0, range.endOffset);
					return;
				}
				
				/*
				текущий элемент не начальный, не конечный, если он еще и не текстовый,
				то он нам не нужен
				*/
				if (!(this._isTextNode(node) && node.textContent)) return
				
				this._start_found && this._hightlightNode(node);
				
				return;
			}).apply(this, []);
			
			/*
			нельзя использовать i = 0, li = node.childNodes.length
			потому что при подсвечивании выделенного фрагмента текста добавляется
			новый элемент, а значит childNodes изменяется
			*/
			for(; i < node.childNodes.length; i++, this._recursion_count--) {
				if(!this._recursion_count) {
					console.warn('too much recusrion');
					return;
				}
				c_node = node.childNodes[i];
				
				c_node._unique != this.unique && arguments.callee.apply(this, [c_node]);
			}
		}).apply(this, [root]);
	}
	
	
	/*
	подсвечиваем TextNode
	
	elem - DOM TextElem
	startOffset - Number
	endOffset - Number
	*/
	this._hightlightNode = function(elem, startOffset, endOffset) {
		if (!this._isTextNode(elem)) {
			console.warn('_hightlightNode(): elem is not TextNode', elem);
			return;
		}
		
		startOffset = startOffset || 0;
		endOffset = endOffset || elem.textContent.length;
		
		var range = document.createRange();
		range.setStart(elem, startOffset);
		range.setEnd(elem, endOffset);
		range.surroundContents(this._createContainer());
	}
	
	/*
	Создаем контейнер в который будет помещен выделенный текст
	*/
	this._createContainer = function() {
		var s = document.createElement('span');
		s.className = this.tsStyle;
		s._unique = this.unique;
		return s;
	}
	
	this._isTextNode = function(node) {
		return node.constructor === Text;
	}

}).apply(Higthlighter.prototype, []);


TSMarkMenu = function(){};
(function(){
	this.__init__ = function() {
		var cDiv = function(cName) {
				var e = document.createElement('div');
				e.className = cName;
				return e;
			},
			elem = cDiv('TSMarkMenu'),
			config = window.TS_CONFIG.HIGHTLIGHT_TYPES,
			i = 0, li = config.length, div, cfg;
			
		for (; i < li; i++) {
			cfg = config[i];
			div = cDiv(cfg.css + ' TSMBlock');
			div.innerHTML = cfg.text;
			elem.appendChild(div);
		}
		
		elem.onclick = this._onclick.bind(this);
		document.body.appendChild(elem);
		
		this.config = config;
		this.elem = elem;
		this.hide();
	}
	
	this._onclick = function(event) {
		if (event.target.className.indexOf('TSMBlock') == -1) return;
		
		var i = 0, li = this.config.length,
			e = event.target, cfg;
			
		for (; i < li; i++) {
			cfg = this.config[i];
			if(e.className.indexOf(cfg.css) == -1) continue;
			isFunc(this._callback) && this._callback(cfg.type, cfg.css);
			delete this._callback;
			break;
		}
		this.hide();
	}
	
	this.setVisible = function(val, fn, x, y) {
		this.elem.style.display = val ? 'block' : 'none';
		this._callback = isFunc(fn) ? fn : this._callback;
		this._visible = val;
		this.elem.style.left = x+'px';
		this.elem.style.top = y+'px';
	}
	
	this.show = function(fn, x, y) {
		this.setVisible(1, fn, x, y);
	}
	
	this.hide = function(fn) {
		this.setVisible(0, fn)
	}

}).apply(TSMarkMenu.prototype, []);



/******************/
/*MAIN BLOCK BEGIN*/
/******************/


function mouseUp(e) {
	window.setTimeout(function() {
		var s = window.getSelection(),
			coords = getCoords(e);
			
		if (!(s.rangeCount && s.toString())) {
			TSMenu.hide();
			return;
		}
		
		var r = range_factory.getRange(s.getRangeAt(0).toString(), true);
		
		TSMenu.show(
			function(val, style){
				Higthlighter.NEW(r, style);
				ScriptTransport.NEW({
					"url": window.location.href,
					"hl_type": val,
					"text": r.toString()
				}).save();
			},
			coords.x + 5,
			coords.y + 5
		);
	}, 200);
}

document.body.addEventListener('mouseup', mouseUp, false);

TSMenu = TSMarkMenu.NEW();
range_factory = RangeFactory.NEW();

restoreHightlight = function(sel_list) {
	var i = 0, li = sel_list.length,
		sel, cfg, config = TS_CONFIG.HIGHTLIGHT_TYPES,
		j = 0, lj = config.length, range;
		
	window._ts_selections = sel_list;
		
	for (; i < li; i++) {
		sel = sel_list[i];
		for (j = 0; j < lj; j++) {
			cfg = config[j];
			if (sel.hl_type != cfg.type) continue;
			range = range_factory.getRange(sel.text);
			range && Higthlighter.NEW(range, cfg.css);
			break;
		}
	}
}

ScriptTransport.NEW({"url": window.location.href, 'callback': 'restoreHightlight'}).get();


/****************/
/*MAIN BLOCK END*/
/****************/

console.log('text selection loaded!');
})();
