$(function () {
	Waterfall("#waterfall1", ".waterfall-item");
});

var Waterfall = function Waterfall(parent, item, data) {
	if (!(this instanceof Waterfall)) return new Waterfall(parent, item, data);
	this.elem = typeof parent === "string" ? document.querySelector(parent) : parent;
	this.item = item;
	this.parentWidth = parseInt(getStyle(this.elem, "width"));
	this.heightArray = [];

	this._init();
}

Waterfall.prototype = {
	constructor: Waterfall,
	// 定位项目item
	_init: function () {
		this._setContaine();
		this.resetSize();
		// this.generateElem();
		this.timer = null;
		var self = this;

		// 滚动事件
		addEvent(window, "scroll", function () {
			clearTimeout(self.timer);
			self.timer = setTimeout(function () {
				if (self.checkLoad()) {
					self.generateElem();
				}
			},2000);
		});
	},

	_getItem: function () {
		return this.elem.querySelectorAll(this.item);
	},
	_getLength: function () {
		return this._getItem().length;
	},
	_getItemWidth: function () {
		// 获取尺寸
		return parseInt(getStyle(this._getItem()[0], "width"));
	},
	_getcolumns: function () {
		// 计算一行能显示几个
		return Math.floor(this.parentWidth / this._getItemWidth());
	},
	_setContaine: function () {
		// 设置父元素宽度
		this.elem.style.position = "relative";
		
		this.elem.style.width = this._getcolumns() * this._getItemWidth() + "px";
	},
	_getIndex: function (h,a) {
		for (var i in a) {
			if (h === a[i]) return i;
		}
	},
	resetSize: function () {
		for (var i = 0; i < this._getLength(); i += 1) {
			if (i < this._getcolumns()) {
				this.heightArray[i] =  parseInt(getStyle(this._getItem()[i], "height"));
			} else {
				var minHeight = Math.min.apply(null, this.heightArray);
				var minHeightIndex = this._getIndex(minHeight, this.heightArray);

				// 设置位置
				this._getItem()[i].style.position = "absolute";
				this._getItem()[i].style.top = minHeight + "px";
				this._getItem()[i].style.left = minHeightIndex * this._getItemWidth() + "px";
			}
			// 刷新数组数据
			this.heightArray[minHeightIndex] += parseInt(getStyle(this._getItem()[i], "height"));
		}

		this.elem.style.height = Math.max.apply(null, this.heightArray) + "px";
	},
	generateElem: function () {
		var length = this.dataSource().dataImg.length;
		var timer = null, self = this;
		for (var i = 0; i < length; i += 1) {
			var newItem = document.createElement("div");
			newItem.className = "waterfall-item";
			var newImgBox = document.createElement("div");
			newImgBox.className = "waterfall-img";
			var newImg = document.createElement("img");
			newImg.src = "images/" + this.dataSource().dataImg[i].src;
			newImgBox.appendChild(newImg);
			newItem.appendChild(newImgBox);
			this.elem.appendChild(newItem);
			clearTimeout(timer);
			timer = setTimeout(function () {
				self.resetSize();
			}, 100);
		}
	},
	dataSource: function () {
		var data = {
			dataImg: [
				{src: "21.jpg"},
				{src: "22.jpg"},
				{src: "23.jpg"},
				{src: "24.jpg"},
				{src: "25.jpg"},
				{src: "26.jpg"},
				{src: "27.jpg"},
				{src: "28.jpg"},
				{src: "29.jpg"},
				{src: "30.jpg"},
				{src: "31.jpg"},
				{src: "32.jpg"},
				{src: "33.jpg"},
				{src: "34.jpg"},
			]
		}
		return data;
	},
	checkLoad: function () {
		var lastItem = this._getItem()[this._getLength() - 1];
		var lastItemTop = parseInt(getStyle(lastItem, "height")) + lastItem.offsetTop;
		return (lastItemTop <= getSize("height") + getScroll("top")) ? true : false;
	},
}


// var waterfall = function (parent, item, data) {
// 	waterfall = Waterfall(parent, item, data);
// 	return waterfall;
// }

function addEvent(el, ev, fn) {
	if (el.addEventListener) {
		el.addEventListener(ev, fn, false);
	} else if (el.attachEvent) {
		el.attachEvent("on" + ev, fn);
	}
}
function $(fn) {
	// addEvent(document, "DOMContentLoaded", fn);
	addEvent(window, "load", fn);
};


function getStyle(el, attr) {
	var value = el.currentStyle ? el.currentStyle[attr] : window.getComputedStyle(el, null)[attr];
	return value;
}
function getSize(name) {
	if (name === "width") {
		return window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
	} else if (name === "height") {
		return window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
	}
}
function getScroll(name) {
	if (name === "top") {
		return document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
	} else if (name === "left") {
		return document.body.scrollLeft ? document.body.scrollLeft : document.documentElement.scrollLeft;
	}
}