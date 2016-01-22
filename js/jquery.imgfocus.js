/*
auto:1, //是否自动播放
timer:4000, //自动轮播间隔时间
showPrevAndNext:1, //是否显示前后一个
showDotControl:1, //是否显示序号按钮
item:'li.img_item', //每一项对应的选择器
width: undefined, //指定项的宽度
height: undefined, //指定项的高度
dotType:'number', //点类型：数字，和•符号
controlClass:'banner_control', //序号控制按钮的父级类名
prevHTML: '', //上一个按钮内部的html
nextHTML: '', //下一个按钮内部的html
eventType:'click', //序号控制按钮控制切换的事件：click，mouseenter
effect:'fade' //效果fade, slideUp, slideLeft
*/
$.fn.imgFocus = function(opts) {
    var set = $.extend({
        auto: 1,
        timer: 4000,
        showPrevAndNext: 1,
        showDotControl: 1,
        item: 'li.img_item',
        dotType: 'number',
        controlClass: 'banner_control',
        prevHTML: '',
        nextHTML: '',
        eventType: 'click',
        effect: 'fade' //fade, slideUp,slideLeft
    }, opts || {});

    this.each(function() {
        var _this = $(this), $items = _this.find(set.item), len = $items.length, index = 0, PrevAndNextHtml = '', DotControlHtml = '';
        if (len === 0) return;
        var $dot, $prev, $next, play, timer, effect = {},
	    	$prevnextWrap = _this.data('banner_prev_next'),
	    	$dotwrap = _this.data('banner_dotwrap');
        var dot = new Array(len + 1).join('t,').replace(/t/g, function() { return set.dotType === 'number' ? ++index : '•'; }).split(',');
        var width = $items.outerWidth(true) || set.width || 0,
	    	height = $items.outerHeight(true) || set.height || 0;
        dot.pop();
        index = 0;
        $prevnextWrap && $prevnextWrap.remove();
        $dotwrap && $dotwrap.remove();
        PrevAndNextHtml = '<div class="banner_prev_next"><a href="javascript:void(0)" class="banner_prev">' + set.prevHTML + '</a><a href="javascript:void(0)" class="banner_next">' + set.nextHTML + '</a></div>';
        DotControlHtml = '<ol class="' + set.controlClass + '"><li>' + dot.join('</li><li>') + '</li></ol>';

        if (set.showPrevAndNext && len>1) {
            _this.append(PrevAndNextHtml);
            _this.data('banner_prev_next', _this.find('div.banner_prev_next'));
            $prev = _this.find('.banner_prev');
            $next = _this.find('.banner_next');
        }
        if (set.showDotControl) {
            _this.append(DotControlHtml);
            _this.data('banner_dotwrap', _this.find('ol.' + set.controlClass));
            $dot = _this.find('ol').find('li');
        }

        effect = {
            'fade': {
                init: function() {
                    $items.css('opacity', 0).hide().eq(index).css('opacity', 1).show();
                    $dot && $dot.eq(index).addClass('active');
                },
                go: function(p, c) {
                    $items.eq(p).stop(true, true).animate({ 'opacity': 0 }, function() { $(this).hide() });
                    $items.eq(c).stop(true, true).show().animate({ 'opacity': 1 });
                    $dot && $dot.removeClass('active').eq(c).addClass('active');
                    index = c;
                }
            },
            'slideUp': {
                init: function() {
                    $items.css('top', height).eq(0).css('top', 0).addClass('active');
                    $dot && $dot.eq(index).addClass('active');
                },
                go: function(p, c) {
                    var d = p < c ? -1 : 1;
                    $items.eq(p).stop(true, true).animate({ 'top': d * height });
                    $items.eq(c).stop(true, true).css('top', -1 * d * height).animate({ 'top': 0 });
                    $dot && $dot.removeClass('active').eq(c).addClass('active');
                    index = c;
                }
            },
            'slideLeft': {
                init: function() {
                    $items.css('left', width).eq(0).css('left', 0).addClass('active');
                    $dot && $dot.eq(index).addClass('active');
                },
                go: function(p, c) {
                    var d = p < c ? -1 : 1;
                    $items.eq(p).stop(true, true).animate({ 'left': d * width });
                    $items.eq(c).stop(true, true).css('left', -1 * d * width).animate({ 'left': 0 });
                    $dot && $dot.removeClass('active').eq(c).addClass('active');
                    index = c;
                }
            }
        };

        effect[set.effect].init();

        play = function() {
            timer = setInterval(function() {
                index = index++ % len;
                effect[set.effect].go(index, (index + 1) % len);
            }, set.timer);
        };

        set.auto && play();

        if (set.showPrevAndNext && len>1) {
            $prev.off('click.imgfocus').on('click.imgfocus', function() {
                effect[set.effect].go(index, --index % len);
            });
            $next.off('click.imgfocus').on('click.imgfocus', function() {
                effect[set.effect].go(index, ++index % len);
            });
        };

        if (set.showDotControl) {
            $dot.each(function(i) {
                $(this).off(set.eventType + '.imgfocus').on(set.eventType + '.imgfocus', function() {
                    if (index === i) return;
                    effect[set.effect].go(index, i);
                });
            });
        };

        _this.off('mouseenter.imgfocus').off('mouseleave.imgfocus');
        _this.on('mouseenter.imgfocus', set.item, function() {
            if (timer) clearInterval(timer);
        }).on('mouseleave.imgfocus', set.item, function() {
            set.auto && play();
        });
    });
    return this;
};