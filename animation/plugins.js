/*
 * Behave.js
 *
 * Copyright 2013, Jacob Kelley - http://jakiestfu.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/jakiestfu/Behave.js/
 * Version: 1.5
 */

(function(u) {
	var r = r || function() {
			var h = {};
			return {
				add: function(e, l) {
					if ("object" == typeof e) {
						var m;
						for (m = 0; m < e.length; m++) {
							var f = e[m];
							h[f] || (h[f] = []);
							h[f].push(l)
						}
					} else h[e] || (h[e] = []), h[e].push(l)
				},
				get: function(e) {
					if (h[e]) return h[e]
				}
			}
		}(),
		n = n || function(h) {
			"function" !== typeof String.prototype.repeat && (String.prototype.repeat = function(a) {
				if (1 > a) return "";
				if (a % 2) return this.repeat(a - 1) + this;
				a = this.repeat(a / 2);
				return a + a
			});
			"function" !== typeof Array.prototype.filter && (Array.prototype.filter = function(a, c) {
				if (null === this) throw new TypeError;
				var b = Object(this),
					d = b.length >>> 0;
				if ("function" != typeof a) throw new TypeError;
				for (var e = [], k = 0; k < d; k++)
					if (k in b) {
						var f = b[k];
						a.call(c, f, k, b) && e.push(f)
					}
				return e
			});
			var e = {
					textarea: null,
					replaceTab: !0,
					softTabs: !0,
					tabSize: 4,
					autoOpen: !0,
					overwrite: !0,
					autoStrip: !0,
					autoIndent: !0,
					fence: !1
				},
				l, m, f = [{
					open: '"',
					close: '"',
					canBreak: !1
				}, {
					open: "'",
					close: "'",
					canBreak: !1
				}, {
					open: "(",
					close: ")",
					canBreak: !1
				}, {
					open: "[",
					close: "]",
					canBreak: !0
				}, {
					open: "{",
					close: "}",
					canBreak: !0
				}],
				d = {
					_callHook: function(a, c) {
						var b = r.get(a);
						if (b)
							if ("boolean" != typeof c || !1 !== c) {
								var g = e.textarea,
									p = g.value,
									k = d.cursor.get(),
									f;
								for (f = 0; f < b.length; f++) b[f].call(u, {
									editor: {
										element: g,
										text: p,
										levelsDeep: d.levelsDeep()
									},
									caret: {
										pos: k
									},
									lines: {
										current: d.cursor.getLine(p, k),
										total: d.editor.getLines(p)
									}
								})
							} else
								for (f = 0; f < b.length; f++) b[f].call(u)
					},
					defineNewLine: function() {
						var a = document.createElement("textarea");
						a.value = "\n";
						m = 2 == a.value.length ? "\r\n" : "\n"
					},
					defineTabSize: function(a) {
						"undefined" != typeof e.textarea.style.OTabSize ? e.textarea.style.OTabSize = a : "undefined" != typeof e.textarea.style.MozTabSize ? e.textarea.style.MozTabSize = a : "undefined" != typeof e.textarea.style.tabSize && (e.textarea.style.tabSize = a)
					},
					cursor: {
						getLine: function(a, c) {
							return a.substring(0, c).split("\n").length
						},
						get: function() {
							if ("number" === typeof document.createElement("textarea").selectionStart) return e.textarea.selectionStart;
							if (document.selection) {
								var a = 0,
									c = e.textarea.createTextRange(),
									b = document.selection.createRange().duplicate().getBookmark();
								for (c.moveToBookmark(b); 0 !== c.moveStart("character", -1);) a++;
								return a
							}
						},
						set: function(a, c) {
							c || (c = a);
							if (e.textarea.setSelectionRange) e.textarea.focus(), e.textarea.setSelectionRange(a, c);
							else if (e.textarea.createTextRange) {
								var b = e.textarea.createTextRange();
								b.collapse(!0);
								b.moveEnd("character", c);
								b.moveStart("character", a);
								b.select()
							}
						},
						selection: function() {
							var a = e.textarea,
								c = 0,
								b = 0,
								g, f, k;
							"number" == typeof a.selectionStart && "number" == typeof a.selectionEnd ? (c = a.selectionStart, b = a.selectionEnd) : (f = document.selection.createRange()) && f.parentElement() == a && (g = d.editor.get(), k = g.length, b = a.createTextRange(), b.moveToBookmark(f.getBookmark()), a = a.createTextRange(), a.collapse(!1), -1 < b.compareEndPoints("StartToEnd", a) ? c = b = k : (c = -b.moveStart("character", -k), c += g.slice(0, c).split(m).length - 1, -1 < b.compareEndPoints("EndToEnd", a) ? b = k : (b = -b.moveEnd("character", -k), b += g.slice(0, b).split(m).length - 1)));
							return c == b ? !1 : {
								start: c,
								end: b
							}
						}
					},
					editor: {
						getLines: function(a) {
							return a.split("\n").length
						},
						get: function() {
							return e.textarea.value.replace(/\r/g, "")
						},
						set: function(a) {
							e.textarea.value = a
						}
					},
					fenceRange: function() {
						if ("string" == typeof e.fence) {
							for (var a = d.editor.get(), c = d.cursor.get(), b = 0, g = a.indexOf(e.fence), f = 0; 0 <= g;) {
								f++;
								if (c < g + b) break;
								b += g + e.fence.length;
								a = a.substring(g + e.fence.length);
								g = a.indexOf(e.fence)
							}
							return b < c && g + b > c && 0 === f % 2 ? !0 : !1
						}
						return !0
					},
					isEven: function(a, c) {
						return c % 2
					},
					levelsDeep: function() {
						var a = d.cursor.get(),
							a = d.editor.get().substring(0, a),
							c = 0,
							b, g;
						for (b = 0; b < a.length; b++)
							for (g = 0; g < f.length; g++) f[g].canBreak && (f[g].open == a.charAt(b) && c++, f[g].close == a.charAt(b) && c--);
						var e = 0,
							k = ["'", '"'];
						for (b = 0; b < f.length; b++)
							if (f[b].canBreak)
								for (g in k) e += a.split(k[g]).filter(d.isEven).join("").split(f[b].open).length - 1;
						g = c - e;
						return 0 <= g ? g : 0
					},
					deepExtend: function(a, c) {
						for (var b in c) c[b] && c[b].constructor && c[b].constructor === Object ? (a[b] = a[b] || {}, d.deepExtend(a[b], c[b])) : a[b] = c[b];
						return a
					},
					addEvent: function(a, c, b) {
						a.addEventListener ? a.addEventListener(c, b, !1) : a.attachEvent && a.attachEvent("on" + c, b)
					},
					removeEvent: function(a, c, b) {
						a.addEventListener ? a.removeEventListener(c, b, !1) : a.attachEvent && a.detachEvent("on" + c, b)
					},
					preventDefaultEvent: function(a) {
						a.preventDefault ? a.preventDefault() : a.returnValue = !1
					}
				},
				n = function(a) {
					if (d.fenceRange()) {
						if (9 == a.keyCode) {
							d.preventDefaultEvent(a);
							var c = !0;
							d._callHook("tab:before");
							var b = d.cursor.selection(),
								g = d.cursor.get(),
								e = d.editor.get();
							if (b) {
								for (g = b.start; g--;)
									if ("\n" == e.charAt(g)) {
										b.start = g + 1;
										break
									}
								var g = e.substring(b.start, b.end),
									g = g.split("\n"),
									f;
								if (a.shiftKey)
									for (f = 0; f < g.length; f++) g[f].substring(0, l.length) == l && (g[f] = g[f].substring(l.length));
								else
									for (f in g) g[f] = l + g[f];
								g = g.join("\n");
								d.editor.set(e.substring(0, b.start) + g + e.substring(b.end));
								d.cursor.set(b.start, b.start + g.length)
							} else f = e.substring(0, g), b = e.substring(g), f = f + l + b, a.shiftKey ? e.substring(g - l.length, g) == l && (f = e.substring(0, g - l.length) + b, d.editor.set(f), d.cursor.set(g - l.length)) : (d.editor.set(f), d.cursor.set(g + l.length), c = !1);
							d._callHook("tab:after")
						}
						return c
					}
				},
				v = function(a) {
					if (d.fenceRange() && 13 == a.keyCode) {
						d.preventDefaultEvent(a);
						d._callHook("enter:before");
						a = d.cursor.get();
						var c = d.editor.get(),
							b = c.substring(0, a),
							c = c.substring(a),
							e = b.charAt(b.length - 1),
							p = c.charAt(0),
							k = d.levelsDeep(),
							h = "",
							n = "",
							q;
						if (k) {
							for (; k--;) h += l;
							k = h.length + 1;
							for (q = 0; q < f.length; q++) f[q].open == e && f[q].close == p && (n = m)
						} else k = 1;
						b = b + m + h + n + h.substring(0, h.length - l.length) + c;
						d.editor.set(b);
						d.cursor.set(a + k);
						d._callHook("enter:after")
					}
				},
				w = function(a) {
					if (d.fenceRange() && 8 == a.keyCode) {
						d.preventDefaultEvent(a);
						d._callHook("delete:before");
						a = d.cursor.get();
						var c = d.editor.get(),
							b = c.substring(0, a),
							e = c.substring(a),
							b = b.charAt(b.length - 1),
							e = e.charAt(0),
							h;
						if (!1 === d.cursor.selection()) {
							for (h = 0; h < f.length; h++)
								if (f[h].open == b && f[h].close == e) {
									c = c.substring(0, a - 1) + c.substring(a + 1);
									d.editor.set(c);
									d.cursor.set(a - 1);
									return
								}
							c = c.substring(0, a - 1) + c.substring(a);
							d.editor.set(c);
							d.cursor.set(a - 1)
						} else b = d.cursor.selection(), c = c.substring(0, b.start) + c.substring(b.end), d.editor.set(c), d.cursor.set(a);
						d._callHook("delete:after")
					}
				},
				s = {
					openedChar: function(a, c) {
						d.preventDefaultEvent(c);
						d._callHook("openChar:before");
						var b = d.cursor.get(),
							f = d.editor.get(),
							h = f.substring(0, b),
							f = f.substring(b);
						e.textarea.value = h + a.open + a.close + f;
						d.cursor.set(b + 1);
						d._callHook("openChar:after")
					},
					closedChar: function(a, c) {
						var b = d.cursor.get();
						return d.editor.get().substring(b, b + 1) == a.close ? (d.preventDefaultEvent(c), d._callHook("closeChar:before"), d.cursor.set(d.cursor.get() + 1), d._callHook("closeChar:after"), !0) : !1
					}
				},
				t = {
					filter: function(a) {
						if (d.fenceRange()) {
							var c = a.which || a.keyCode;
							if (39 != c && (40 != c || 0 !== a.which)) {
								var c = String.fromCharCode(c),
									b;
								for (b = 0; b < f.length; b++) f[b].close == c ? e.overwrite && s.closedChar(f[b], a) || f[b].open != c || !e.autoOpen || s.openedChar(f[b], a) : f[b].open == c && e.autoOpen && s.openedChar(f[b], a)
							}
						}
					},
					listen: function() {
						e.replaceTab && d.addEvent(e.textarea, "keydown", n);
						e.autoIndent && d.addEvent(e.textarea, "keydown", v);
						e.autoStrip && d.addEvent(e.textarea, "keydown", w);
						d.addEvent(e.textarea, "keypress", t.filter);
						d.addEvent(e.textarea, "keydown", function() {
							d._callHook("keydown")
						});
						d.addEvent(e.textarea, "keyup", function() {
							d._callHook("keyup")
						})
					}
				};
			this.destroy = function() {
				d.removeEvent(e.textarea, "keydown", n);
				d.removeEvent(e.textarea, "keydown", v);
				d.removeEvent(e.textarea, "keydown", w);
				d.removeEvent(e.textarea, "keypress", t.filter)
			};
			(function(a) {
				a.textarea && (d._callHook("init:before", !1), d.deepExtend(e, a), d.defineNewLine(), e.softTabs ? l = " ".repeat(e.tabSize) : (l = "\t", d.defineTabSize(e.tabSize)), t.listen(), d._callHook("init:after", !1))
			})(h)
		};
	"undefined" !== typeof module && module.exports && (module.exports = n);
	"undefined" === typeof ender && (this.Behave = n, this.BehaveHooks = r);
	"function" === typeof define && define.amd && define("behave", [], function() {
		return n
	})
}).call(this);

//colResizable - by Alvaro Prieto Lauroba - MIT & GPL
(function(a) {
	function h(b) {
		var c = a(this).data(q),
			d = m[c.t],
			e = d.g[c.i];
		e.ox = b.pageX;
		e.l = e[I]()[H];
		i[D](E + q, f)[D](F + q, g);
		P[z](x + "*{cursor:" + d.opt.dragCursor + K + J);
		e[B](d.opt.draggingClass);
		l = e;
		if (d.c[c.i].l)
			for (b = 0; b < d.ln; b++) c = d.c[b], c.l = j, c.w = c[u]();
		return j
	}

	function g(b) {
		i.unbind(E + q).unbind(F + q);
		a("head :last-child").remove();
		if (l) {
			l[A](l.t.opt.draggingClass);
			var f = l.t,
				g = f.opt.onResize;
			l.x && (e(f, l.i, 1), d(f), g && (b[G] = f[0], g(b)));
			f.p && O && c(f);
			l = k
		}
	}

	function f(a) {
		if (l) {
			var b = l.t,
				c = a.pageX - l.ox + l.l,
				f = b.opt.minWidth,
				g = l.i,
				h = 1.5 * b.cs + f + b.b,
				i = g == b.ln - 1 ? b.w - h : b.g[g + 1][I]()[H] - b.cs - f,
				f = g ? b.g[g - 1][I]()[H] + b.cs + f : h,
				c = s.max(f, s.min(i, c));
			l.x = c;
			l.css(H, c + p);
			if (b.opt.liveDrag && (e(b, g), d(b), c = b.opt.onDrag)) a[G] = b[0], c(a)
		}
		return j
	}

	function e(a, b, c) {
		var d = l.x - l.l,
			e = a.c[b],
			f = a.c[b + 1],
			g = e.w + d,
			d = f.w - d;
		e[u](g + p);
		f[u](d + p);
		a.cg.eq(b)[u](g + p);
		a.cg.eq(b + 1)[u](d + p);
		if (c) e.w = g, f.w = d
	}

	function d(a) {
		a.gc[u](a.w);
		for (var b = 0; b < a.ln; b++) {
			var c = a.c[b];
			a.g[b].css({
				left: c.offset().left - a.offset()[H] + c.outerWidth() + a.cs / 2 + p,
				height: a.opt.headerOnly ? a.c[0].outerHeight() : a.outerHeight()
			})
		}
	}

	function c(a, b) {
		var c, d = 0,
			e = 0,
			f = [];
		if (b)
			if (a.cg[C](u), a.opt.flush) O[a.id] = "";
			else {
				for (c = O[a.id].split(";"); e < a.ln; e++) f[y](100 * c[e] / c[a.ln] + "%"), b.eq(e).css(u, f[e]);
				for (e = 0; e < a.ln; e++) a.cg.eq(e).css(u, f[e])
			} else {
			O[a.id] = "";
			for (e in a.c) c = a.c[e][u](), O[a.id] += c + ";", d += c;
			O[a.id] += d
		}
	}

	function b(b) {
		var e = ">thead>tr>",
			f = '"></div>',
			g = ">tbody>tr:first>",
			i = ">tr:first>",
			j = "td",
			k = "th",
			l = b.find(e + k + "," + e + j);
		l.length || (l = b.find(g + k + "," + i + k + "," + g + j + "," + i + j));
		b.cg = b.find("col");
		b.ln = l.length;
		b.p && O && O[b.id] && c(b, l);
		l.each(function(c) {
			var d = a(this),
				e = a(b.gc[z](w + "CRG" + f)[0].lastChild);
			e.t = b;
			e.i = c;
			e.c = d;
			d.w = d[u]();
			b.g[y](e);
			b.c[y](d);
			d[u](d.w)[C](u);
			if (c < b.ln - 1) e.mousedown(h)[z](b.opt.gripInnerHtml)[z](w + q + '" style="cursor:' + b.opt.hoverCursor + f);
			else e[B]("CRL")[A]("CRG");
			e.data(q, {
				i: c,
				t: b[v](o)
			})
		});
		b.cg[C](u);
		d(b);
		b.find("td, th").not(l).not(N + "th, table td").each(function() {
			a(this)[C](u)
		})
	}
	var i = a(document),
		j = !1,
		k = null,
		l = k,
		m = [],
		n = 0,
		o = "id",
		p = "px",
		q = "CRZ",
		r = parseInt,
		s = Math,
		t = a.browser.msie,
		u = "width",
		v = "attr",
		w = '<div class="',
		x = "<style type='text/css'>",
		y = "push",
		z = "append",
		A = "removeClass",
		B = "addClass",
		C = "removeAttr",
		D = "bind",
		E = "mousemove.",
		F = "mouseup.",
		G = "currentTarget",
		H = "left",
		I = "position",
		J = "}</style>",
		K = "!important;",
		L = ":0px" + K,
		M = "resize",
		N = "table",
		O, P = a("head")[z](x + ".CRZ{table-layout:fixed;}.CRZ td,.CRZ th{padding-" + H + L + "padding-right" + L + "overflow:hidden}.CRC{height:0px;" + I + ":relative;}.CRG{margin-left:-5px;" + I + ":absolute;z-index:5;}.CRG .CRZ{" + I + ":absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;top:0px}.CRL{" + I + ":absolute;width:1px}.CRD{ border-left:1px dotted black" + J);
	try {
		O = sessionStorage
	} catch (Q) {}
	a(window)[D](M + "." + q, function() {
		for (a in m) {
			var a = m[a],
				b, c = 0;
			a[A](q);
			if (a.w != a[u]()) {
				a.w = a[u]();
				for (b = 0; b < a.ln; b++) c += a.c[b].w;
				for (b = 0; b < a.ln; b++) a.c[b].css(u, s.round(1e3 * a.c[b].w / c) / 10 + "%").l = 1
			}
			d(a[B](q))
		}
	});
	a.fn.extend({
		colResizable: function(c) {
			c = a.extend({
				draggingClass: "CRD",
				gripInnerHtml: "",
				liveDrag: j,
				minWidth: 15,
				headerOnly: j,
				hoverCursor: "e-" + M,
				dragCursor: "e-" + M,
				postbackSafe: j,
				flush: j,
				marginLeft: k,
				marginRight: k,
				disable: j,
				onDrag: k,
				onResize: k
			}, c);
			return this.each(function() {
				var d = c,
					e = a(this);
				if (d.disable) {
					if (e = e[v](o), (d = m[e]) && d.is(N)) d[A](q).gc.remove(), delete m[e]
				} else {
					var f = e.id = e[v](o) || q + n++;
					e.p = d.postbackSafe;
					if (e.is(N) && !m[f]) e[B](q)[v](o, f).before(w + 'CRC"/>'), e.opt = d, e.g = [], e.c = [], e.w = e[u](), e.gc = e.prev(), d.marginLeft && e.gc.css("marginLeft", d.marginLeft), d.marginRight && e.gc.css("marginRight", d.marginRight), e.cs = r(t ? this.cellSpacing || this.currentStyle.borderSpacing : e.css("border-spacing")) || 2, e.b = r(t ? this.border || this.currentStyle.borderLeftWidth : e.css("border-" + H + "-" + u)) || 1, m[f] = e, b(e)
				}
			})
		}
	})
})(jQuery)