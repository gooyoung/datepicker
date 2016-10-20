var userAgentInfo = navigator.userAgent;
var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "MQQBrowser"];
var flag = true;
// 判断是否在手机端 是，则flag为true
for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
    }
}
if (flag == true) {
    /*! iScroll v5.2.0 ~ (c) 2008-2016 Matteo Spinelli ~ http://cubiq.org/license */
    (function (window, document, Math) {
        var rAF = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 1000 / 60); };

        var utils = (function () {
            var me = {};

            var _elementStyle = document.createElement('div').style;
            var _vendor = (function () {
                var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                    transform,
                    i = 0,
                    l = vendors.length;

                for (; i < l; i++) {
                    transform = vendors[i] + 'ransform';
                    if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
                }

                return false;
            })();

            function _prefixStyle(style) {
                if (_vendor === false) return false;
                if (_vendor === '') return style;
                return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
            }

            me.getTime = Date.now || function getTime() { return new Date().getTime(); };

            me.extend = function (target, obj) {
                for (var i in obj) {
                    target[i] = obj[i];
                }
            };

            me.addEvent = function (el, type, fn, capture) {
                el.addEventListener(type, fn, !!capture);
            };

            me.removeEvent = function (el, type, fn, capture) {
                el.removeEventListener(type, fn, !!capture);
            };

            me.prefixPointerEvent = function (pointerEvent) {
                return window.MSPointerEvent ?
                    'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8) :
                    pointerEvent;
            };

            me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
                var distance = current - start,
                    speed = Math.abs(distance) / time,
                    destination,
                    duration;

                deceleration = deceleration === undefined ? 0.0006 : deceleration;

                destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
                duration = speed / deceleration;

                if (destination < lowerMargin) {
                    destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                    distance = Math.abs(destination - current);
                    duration = distance / speed;
                } else if (destination > 0) {
                    destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                    distance = Math.abs(current) + destination;
                    duration = distance / speed;
                }

                return {
                    destination: Math.round(destination),
                    duration: duration
                };
            };

            var _transform = _prefixStyle('transform');

            me.extend(me, {
                hasTransform: _transform !== false,
                hasPerspective: _prefixStyle('perspective') in _elementStyle,
                hasTouch: 'ontouchstart' in window,
                hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
                hasTransition: _prefixStyle('transition') in _elementStyle
            });

            /*
            This should find all Android browsers lower than build 535.19 (both stock browser and webview)
            - galaxy S2 is ok
            - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
            - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
           - galaxy S3 is badAndroid (stock brower, webview)
             `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
           - galaxy S4 is badAndroid (stock brower, webview)
             `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
           - galaxy S5 is OK
             `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
           - galaxy S6 is OK
             `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
          */
            me.isBadAndroid = (function () {
                var appVersion = window.navigator.appVersion;
                // Android browser is not a chrome browser.
                if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
                    var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
                    if (safariVersion && typeof safariVersion === "object" && safariVersion.length >= 2) {
                        return parseFloat(safariVersion[1]) < 535.19;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            })();

            me.extend(me.style = {}, {
                transform: _transform,
                transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
                transitionDuration: _prefixStyle('transitionDuration'),
                transitionDelay: _prefixStyle('transitionDelay'),
                transformOrigin: _prefixStyle('transformOrigin')
            });

            me.hasClass = function (e, c) {
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
                return re.test(e.className);
            };

            me.addClass = function (e, c) {
                if (me.hasClass(e, c)) {
                    return;
                }

                var newclass = e.className.split(' ');
                newclass.push(c);
                e.className = newclass.join(' ');
            };

            me.removeClass = function (e, c) {
                if (!me.hasClass(e, c)) {
                    return;
                }

                var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
                e.className = e.className.replace(re, ' ');
            };

            me.offset = function (el) {
                var left = -el.offsetLeft,
                    top = -el.offsetTop;

                // jshint -W084
                while (el = el.offsetParent) {
                    left -= el.offsetLeft;
                    top -= el.offsetTop;
                }
                // jshint +W084

                return {
                    left: left,
                    top: top
                };
            };

            me.preventDefaultException = function (el, exceptions) {
                for (var i in exceptions) {
                    if (exceptions[i].test(el[i])) {
                        return true;
                    }
                }

                return false;
            };

            me.extend(me.eventType = {}, {
                touchstart: 1,
                touchmove: 1,
                touchend: 1,

                mousedown: 2,
                mousemove: 2,
                mouseup: 2,

                pointerdown: 3,
                pointermove: 3,
                pointerup: 3,

                MSPointerDown: 3,
                MSPointerMove: 3,
                MSPointerUp: 3
            });

            me.extend(me.ease = {}, {
                quadratic: {
                    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fn: function (k) {
                        return k * (2 - k);
                    }
                },
                circular: {
                    style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                    fn: function (k) {
                        return Math.sqrt(1 - (--k * k));
                    }
                },
                back: {
                    style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    fn: function (k) {
                        var b = 4;
                        return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                    }
                },
                bounce: {
                    style: '',
                    fn: function (k) {
                        if ((k /= 1) < (1 / 2.75)) {
                            return 7.5625 * k * k;
                        } else if (k < (2 / 2.75)) {
                            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                        } else if (k < (2.5 / 2.75)) {
                            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                        } else {
                            return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                        }
                    }
                },
                elastic: {
                    style: '',
                    fn: function (k) {
                        var f = 0.22,
                            e = 0.4;

                        if (k === 0) { return 0; }
                        if (k == 1) { return 1; }

                        return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
                    }
                }
            });

            me.tap = function (e, eventName) {
                var ev = document.createEvent('Event');
                ev.initEvent(eventName, true, true);
                ev.pageX = e.pageX;
                ev.pageY = e.pageY;
                e.target.dispatchEvent(ev);
            };

            me.click = function (e) {
                var target = e.target,
                    ev;

                if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
                    // initMouseEvent is deprecated.
                    ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event');
                    ev.initEvent('click', true, true);
                    ev.view = e.view || window;
                    ev.detail = 1;
                    ev.screenX = target.screenX || 0;
                    ev.screenY = target.screenY || 0;
                    ev.clientX = target.clientX || 0;
                    ev.clientY = target.clientY || 0;
                    ev.ctrlKey = !!e.ctrlKey;
                    ev.altKey = !!e.altKey;
                    ev.shiftKey = !!e.shiftKey;
                    ev.metaKey = !!e.metaKey;
                    ev.button = 0;
                    ev.relatedTarget = null;
                    ev._constructed = true;
                    target.dispatchEvent(ev);
                }
            };

            return me;
        })();
        function IScroll(el, options) {
            this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
            this.scroller = this.wrapper.children[0];
            this.scrollerStyle = this.scroller.style;		// cache style for better performance

            this.options = {

                resizeScrollbars: true,

                mouseWheelSpeed: 10,

                snapThreshold: 0.334,

                // INSERT POINT: OPTIONS
                disablePointer: !utils.hasPointer,
                disableTouch: utils.hasPointer || !utils.hasTouch,
                disableMouse: utils.hasPointer || utils.hasTouch,
                startX: 0,
                startY: 0,
                scrollY: true,
                directionLockThreshold: 5,
                momentum: true,

                bounce: true,
                bounceTime: 600,
                bounceEasing: '',

                preventDefault: true,
                preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

                HWCompositing: true,
                useTransition: true,
                useTransform: true,
                bindToWrapper: typeof window.onmousedown === "undefined"
            };

            for (var i in options) {
                this.options[i] = options[i];
            }

            // Normalize options
            this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

            this.options.useTransition = utils.hasTransition && this.options.useTransition;
            this.options.useTransform = utils.hasTransform && this.options.useTransform;

            this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
            this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

            // If you want eventPassthrough I have to lock one of the axes
            this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
            this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

            // With eventPassthrough we also need lockDirection mechanism
            this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
            this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

            this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

            this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

            if (this.options.tap === true) {
                this.options.tap = 'tap';
            }

            // https://github.com/cubiq/iscroll/issues/1029
            if (!this.options.useTransition && !this.options.useTransform) {
                if (!(/relative|absolute/i).test(this.scrollerStyle.position)) {
                    this.scrollerStyle.position = "relative";
                }
            }

            if (this.options.shrinkScrollbars == 'scale') {
                this.options.useTransition = false;
            }

            this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

            // INSERT POINT: NORMALIZATION

            // Some defaults
            this.x = 0;
            this.y = 0;
            this.directionX = 0;
            this.directionY = 0;
            this._events = {};

            // INSERT POINT: DEFAULTS

            this._init();
            this.refresh();

            this.scrollTo(this.options.startX, this.options.startY);
            this.enable();
        }

        IScroll.prototype = {
            version: '5.2.0',

            _init: function () {
                this._initEvents();

                if (this.options.scrollbars || this.options.indicators) {
                    this._initIndicators();
                }

                if (this.options.mouseWheel) {
                    this._initWheel();
                }

                if (this.options.snap) {
                    this._initSnap();
                }

                if (this.options.keyBindings) {
                    this._initKeys();
                }

                // INSERT POINT: _init

            },

            destroy: function () {
                this._initEvents(true);
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = null;
                this._execEvent('destroy');
            },

            _transitionEnd: function (e) {
                if (e.target != this.scroller || !this.isInTransition) {
                    return;
                }

                this._transitionTime();
                if (!this.resetPosition(this.options.bounceTime)) {
                    this.isInTransition = false;
                    this._execEvent('scrollEnd');
                }
            },

            _start: function (e) {
                // React to left mouse button only
                if (utils.eventType[e.type] != 1) {
                    // for button property
                    // http://unixpapa.com/js/mouse.html
                    var button;
                    if (!e.which) {
                        /* IE case */
                        button = (e.button < 2) ? 0 :
                                 ((e.button == 4) ? 1 : 2);
                    } else {
                        /* All others */
                        button = e.button;
                    }
                    if (button !== 0) {
                        return;
                    }
                }

                if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                    return;
                }

                if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault();
                }

                var point = e.touches ? e.touches[0] : e,
                    pos;

                this.initiated = utils.eventType[e.type];
                this.moved = false;
                this.distX = 0;
                this.distY = 0;
                this.directionX = 0;
                this.directionY = 0;
                this.directionLocked = 0;

                this.startTime = utils.getTime();

                if (this.options.useTransition && this.isInTransition) {
                    this._transitionTime();
                    this.isInTransition = false;
                    pos = this.getComputedPosition();
                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this._execEvent('scrollEnd');
                } else if (!this.options.useTransition && this.isAnimating) {
                    this.isAnimating = false;
                    this._execEvent('scrollEnd');
                }

                this.startX = this.x;
                this.startY = this.y;
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.pointX = point.pageX;
                this.pointY = point.pageY;

                this._execEvent('beforeScrollStart');
            },

            _move: function (e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return;
                }

                if (this.options.preventDefault) {	// increases performance on Android? TODO: check!
                    e.preventDefault();
                }

                var point = e.touches ? e.touches[0] : e,
                    deltaX = point.pageX - this.pointX,
                    deltaY = point.pageY - this.pointY,
                    timestamp = utils.getTime(),
                    newX, newY,
                    absDistX, absDistY;

                this.pointX = point.pageX;
                this.pointY = point.pageY;

                this.distX += deltaX;
                this.distY += deltaY;
                absDistX = Math.abs(this.distX);
                absDistY = Math.abs(this.distY);

                // We need to move at least 10 pixels for the scrolling to initiate
                if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                    return;
                }

                // If you are scrolling in one direction lock the other
                if (!this.directionLocked && !this.options.freeScroll) {
                    if (absDistX > absDistY + this.options.directionLockThreshold) {
                        this.directionLocked = 'h';		// lock horizontally
                    } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                        this.directionLocked = 'v';		// lock vertically
                    } else {
                        this.directionLocked = 'n';		// no lock
                    }
                }

                if (this.directionLocked == 'h') {
                    if (this.options.eventPassthrough == 'vertical') {
                        e.preventDefault();
                    } else if (this.options.eventPassthrough == 'horizontal') {
                        this.initiated = false;
                        return;
                    }

                    deltaY = 0;
                } else if (this.directionLocked == 'v') {
                    if (this.options.eventPassthrough == 'horizontal') {
                        e.preventDefault();
                    } else if (this.options.eventPassthrough == 'vertical') {
                        this.initiated = false;
                        return;
                    }

                    deltaX = 0;
                }

                deltaX = this.hasHorizontalScroll ? deltaX : 0;
                deltaY = this.hasVerticalScroll ? deltaY : 0;

                newX = this.x + deltaX;
                newY = this.y + deltaY;

                // Slow down if outside of the boundaries
                if (newX > 0 || newX < this.maxScrollX) {
                    newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
                }
                if (newY > 0 || newY < this.maxScrollY) {
                    newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
                }

                this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

                if (!this.moved) {
                    this._execEvent('scrollStart');
                }

                this.moved = true;

                this._translate(newX, newY);

                /* REPLACE START: _move */

                if (timestamp - this.startTime > 300) {
                    this.startTime = timestamp;
                    this.startX = this.x;
                    this.startY = this.y;
                }

                /* REPLACE END: _move */

            },

            _end: function (e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return;
                }

                if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault();
                }

                var point = e.changedTouches ? e.changedTouches[0] : e,
                    momentumX,
                    momentumY,
                    duration = utils.getTime() - this.startTime,
                    newX = Math.round(this.x),
                    newY = Math.round(this.y),
                    distanceX = Math.abs(newX - this.startX),
                    distanceY = Math.abs(newY - this.startY),
                    time = 0,
                    easing = '';

                this.isInTransition = 0;
                this.initiated = 0;
                this.endTime = utils.getTime();

                // reset if we are outside of the boundaries
                if (this.resetPosition(this.options.bounceTime)) {
                    return;
                }

                this.scrollTo(newX, newY);	// ensures that the last position is rounded

                // we scrolled less than 10 pixels
                if (!this.moved) {
                    if (this.options.tap) {
                        utils.tap(e, this.options.tap);
                    }

                    if (this.options.click) {
                        utils.click(e);
                    }

                    this._execEvent('scrollCancel');
                    return;
                }

                if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                    this._execEvent('flick');
                    return;
                }

                // start momentum animation if needed
                if (this.options.momentum && duration < 300) {
                    momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
                    momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
                    newX = momentumX.destination;
                    newY = momentumY.destination;
                    time = Math.max(momentumX.duration, momentumY.duration);
                    this.isInTransition = 1;
                }


                if (this.options.snap) {
                    var snap = this._nearestSnap(newX, newY);
                    this.currentPage = snap;
                    time = this.options.snapSpeed || Math.max(
                            Math.max(
                                Math.min(Math.abs(newX - snap.x), 1000),
                                Math.min(Math.abs(newY - snap.y), 1000)
                            ), 300);
                    newX = snap.x;
                    newY = snap.y;

                    this.directionX = 0;
                    this.directionY = 0;
                    easing = this.options.bounceEasing;
                }

                // INSERT POINT: _end

                if (newX != this.x || newY != this.y) {
                    // change easing function when scroller goes out of the boundaries
                    if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                        easing = utils.ease.quadratic;
                    }

                    this.scrollTo(newX, newY, time, easing);
                    return;
                }

                this._execEvent('scrollEnd');
            },

            _resize: function () {
                var that = this;

                clearTimeout(this.resizeTimeout);

                this.resizeTimeout = setTimeout(function () {
                    that.refresh();
                }, this.options.resizePolling);
            },

            resetPosition: function (time) {
                var x = this.x,
                    y = this.y;

                time = time || 0;

                if (!this.hasHorizontalScroll || this.x > 0) {
                    x = 0;
                } else if (this.x < this.maxScrollX) {
                    x = this.maxScrollX;
                }

                if (!this.hasVerticalScroll || this.y > 0) {
                    y = 0;
                } else if (this.y < this.maxScrollY) {
                    y = this.maxScrollY;
                }

                if (x == this.x && y == this.y) {
                    return false;
                }

                this.scrollTo(x, y, time, this.options.bounceEasing);

                return true;
            },

            disable: function () {
                this.enabled = false;
            },

            enable: function () {
                this.enabled = true;
            },

            refresh: function () {
                var rf = this.wrapper.offsetHeight;		// Force reflow

                this.wrapperWidth = this.wrapper.clientWidth;
                this.wrapperHeight = this.wrapper.clientHeight;

                /* REPLACE START: refresh */

                this.scrollerWidth = this.scroller.offsetWidth;
                this.scrollerHeight = this.scroller.offsetHeight;

                this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
                this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

                /* REPLACE END: refresh */

                this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
                this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

                if (!this.hasHorizontalScroll) {
                    this.maxScrollX = 0;
                    this.scrollerWidth = this.wrapperWidth;
                }

                if (!this.hasVerticalScroll) {
                    this.maxScrollY = 0;
                    this.scrollerHeight = this.wrapperHeight;
                }

                this.endTime = 0;
                this.directionX = 0;
                this.directionY = 0;

                this.wrapperOffset = utils.offset(this.wrapper);

                this._execEvent('refresh');

                this.resetPosition();

                // INSERT POINT: _refresh

            },

            on: function (type, fn) {
                if (!this._events[type]) {
                    this._events[type] = [];
                }

                this._events[type].push(fn);
            },

            off: function (type, fn) {
                if (!this._events[type]) {
                    return;
                }

                var index = this._events[type].indexOf(fn);

                if (index > -1) {
                    this._events[type].splice(index, 1);
                }
            },

            _execEvent: function (type) {
                if (!this._events[type]) {
                    return;
                }

                var i = 0,
                    l = this._events[type].length;

                if (!l) {
                    return;
                }

                for (; i < l; i++) {
                    this._events[type][i].apply(this, [].slice.call(arguments, 1));
                }
            },

            scrollBy: function (x, y, time, easing) {
                x = this.x + x;
                y = this.y + y;
                time = time || 0;

                this.scrollTo(x, y, time, easing);
            },

            scrollTo: function (x, y, time, easing) {
                easing = easing || utils.ease.circular;

                this.isInTransition = this.options.useTransition && time > 0;
                var transitionType = this.options.useTransition && easing.style;
                if (!time || transitionType) {
                    if (transitionType) {
                        this._transitionTimingFunction(easing.style);
                        this._transitionTime(time);
                    }
                    this._translate(x, y);
                } else {
                    this._animate(x, y, time, easing.fn);
                }
            },

            scrollToElement: function (el, time, offsetX, offsetY, easing) {
                el = el.nodeType ? el : this.scroller.querySelector(el);

                if (!el) {
                    return;
                }

                var pos = utils.offset(el);

                pos.left -= this.wrapperOffset.left;
                pos.top -= this.wrapperOffset.top;

                // if offsetX/Y are true we center the element to the screen
                if (offsetX === true) {
                    offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
                }
                if (offsetY === true) {
                    offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
                }

                pos.left -= offsetX || 0;
                pos.top -= offsetY || 0;

                pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
                pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

                time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

                this.scrollTo(pos.left, pos.top, time, easing);
            },

            _transitionTime: function (time) {
                if (!this.options.useTransition) {
                    return;
                }
                time = time || 0;
                var durationProp = utils.style.transitionDuration;
                if (!durationProp) {
                    return;
                }

                this.scrollerStyle[durationProp] = time + 'ms';

                if (!time && utils.isBadAndroid) {
                    this.scrollerStyle[durationProp] = '0.0001ms';
                    // remove 0.0001ms
                    var self = this;
                    rAF(function () {
                        if (self.scrollerStyle[durationProp] === '0.0001ms') {
                            self.scrollerStyle[durationProp] = '0s';
                        }
                    });
                }


                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].transitionTime(time);
                    }
                }


                // INSERT POINT: _transitionTime

            },

            _transitionTimingFunction: function (easing) {
                this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].transitionTimingFunction(easing);
                    }
                }


                // INSERT POINT: _transitionTimingFunction

            },

            _translate: function (x, y) {
                if (this.options.useTransform) {

                    /* REPLACE START: _translate */

                    this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

                    /* REPLACE END: _translate */

                } else {
                    x = Math.round(x);
                    y = Math.round(y);
                    this.scrollerStyle.left = x + 'px';
                    this.scrollerStyle.top = y + 'px';
                }

                this.x = x;
                this.y = y;


                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].updatePosition();
                    }
                }


                // INSERT POINT: _translate

            },

            _initEvents: function (remove) {
                var eventType = remove ? utils.removeEvent : utils.addEvent,
                    target = this.options.bindToWrapper ? this.wrapper : window;

                eventType(window, 'orientationchange', this);
                eventType(window, 'resize', this);

                if (this.options.click) {
                    eventType(this.wrapper, 'click', this, true);
                }

                if (!this.options.disableMouse) {
                    eventType(this.wrapper, 'mousedown', this);
                    eventType(target, 'mousemove', this);
                    eventType(target, 'mousecancel', this);
                    eventType(target, 'mouseup', this);
                }

                if (utils.hasPointer && !this.options.disablePointer) {
                    eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                    eventType(target, utils.prefixPointerEvent('pointermove'), this);
                    eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                    eventType(target, utils.prefixPointerEvent('pointerup'), this);
                }

                if (utils.hasTouch && !this.options.disableTouch) {
                    eventType(this.wrapper, 'touchstart', this);
                    eventType(target, 'touchmove', this);
                    eventType(target, 'touchcancel', this);
                    eventType(target, 'touchend', this);
                }

                eventType(this.scroller, 'transitionend', this);
                eventType(this.scroller, 'webkitTransitionEnd', this);
                eventType(this.scroller, 'oTransitionEnd', this);
                eventType(this.scroller, 'MSTransitionEnd', this);
            },

            getComputedPosition: function () {
                var matrix = window.getComputedStyle(this.scroller, null),
                    x, y;

                if (this.options.useTransform) {
                    matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                    x = +(matrix[12] || matrix[4]);
                    y = +(matrix[13] || matrix[5]);
                } else {
                    x = +matrix.left.replace(/[^-\d.]/g, '');
                    y = +matrix.top.replace(/[^-\d.]/g, '');
                }

                return { x: x, y: y };
            },
            _initIndicators: function () {
                var interactive = this.options.interactiveScrollbars,
                    customStyle = typeof this.options.scrollbars != 'string',
                    indicators = [],
                    indicator;

                var that = this;

                this.indicators = [];

                if (this.options.scrollbars) {
                    // Vertical scrollbar
                    if (this.options.scrollY) {
                        indicator = {
                            el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                            interactive: interactive,
                            defaultScrollbars: true,
                            customStyle: customStyle,
                            resize: this.options.resizeScrollbars,
                            shrink: this.options.shrinkScrollbars,
                            fade: this.options.fadeScrollbars,
                            listenX: false
                        };

                        this.wrapper.appendChild(indicator.el);
                        indicators.push(indicator);
                    }

                    // Horizontal scrollbar
                    if (this.options.scrollX) {
                        indicator = {
                            el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                            interactive: interactive,
                            defaultScrollbars: true,
                            customStyle: customStyle,
                            resize: this.options.resizeScrollbars,
                            shrink: this.options.shrinkScrollbars,
                            fade: this.options.fadeScrollbars,
                            listenY: false
                        };

                        this.wrapper.appendChild(indicator.el);
                        indicators.push(indicator);
                    }
                }

                if (this.options.indicators) {
                    // TODO: check concat compatibility
                    indicators = indicators.concat(this.options.indicators);
                }

                for (var i = indicators.length; i--;) {
                    this.indicators.push(new Indicator(this, indicators[i]));
                }

                // TODO: check if we can use array.map (wide compatibility and performance issues)
                function _indicatorsMap(fn) {
                    if (that.indicators) {
                        for (var i = that.indicators.length; i--;) {
                            fn.call(that.indicators[i]);
                        }
                    }
                }

                if (this.options.fadeScrollbars) {
                    this.on('scrollEnd', function () {
                        _indicatorsMap(function () {
                            this.fade();
                        });
                    });

                    this.on('scrollCancel', function () {
                        _indicatorsMap(function () {
                            this.fade();
                        });
                    });

                    this.on('scrollStart', function () {
                        _indicatorsMap(function () {
                            this.fade(1);
                        });
                    });

                    this.on('beforeScrollStart', function () {
                        _indicatorsMap(function () {
                            this.fade(1, true);
                        });
                    });
                }


                this.on('refresh', function () {
                    _indicatorsMap(function () {
                        this.refresh();
                    });
                });

                this.on('destroy', function () {
                    _indicatorsMap(function () {
                        this.destroy();
                    });

                    delete this.indicators;
                });
            },

            _initWheel: function () {
                utils.addEvent(this.wrapper, 'wheel', this);
                utils.addEvent(this.wrapper, 'mousewheel', this);
                utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

                this.on('destroy', function () {
                    clearTimeout(this.wheelTimeout);
                    this.wheelTimeout = null;
                    utils.removeEvent(this.wrapper, 'wheel', this);
                    utils.removeEvent(this.wrapper, 'mousewheel', this);
                    utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
                });
            },

            _wheel: function (e) {
                if (!this.enabled) {
                    return;
                }

                e.preventDefault();

                var wheelDeltaX, wheelDeltaY,
                    newX, newY,
                    that = this;

                if (this.wheelTimeout === undefined) {
                    that._execEvent('scrollStart');
                }

                // Execute the scrollEnd event after 400ms the wheel stopped scrolling
                clearTimeout(this.wheelTimeout);
                this.wheelTimeout = setTimeout(function () {
                    if (!that.options.snap) {
                        that._execEvent('scrollEnd');
                    }
                    that.wheelTimeout = undefined;
                }, 400);

                if ('wheelDeltaX' in e) {
                    wheelDeltaX = e.wheelDeltaX / 3;
                    wheelDeltaY = e.wheelDeltaY / 3;
                } else if ('wheelDelta' in e) {
                    wheelDeltaX = wheelDeltaY = e.wheelDelta / 3;
                } else if ('detail' in e) {
                    wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
                } else {
                    return;
                }

                wheelDeltaX *= this.options.invertWheelDirection;
                wheelDeltaY *= this.options.invertWheelDirection;

                if (!this.hasVerticalScroll) {
                    wheelDeltaX = wheelDeltaY;
                    wheelDeltaY = 0;
                }

                if (this.options.snap) {
                    newX = this.currentPage.pageX;
                    newY = this.currentPage.pageY;

                    if (wheelDeltaX > 0) {
                        newX--;
                    } else if (wheelDeltaX < 0) {
                        newX++;
                    }

                    if (wheelDeltaY > 0) {
                        newY--;
                    } else if (wheelDeltaY < 0) {
                        newY++;
                    }

                    this.goToPage(newX, newY);

                    return;
                }

                newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
                newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

                this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
                this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;

                if (newX > 0) {
                    newX = 0;
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX;
                }

                if (newY > 0) {
                    newY = 0;
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY;
                }

                this.scrollTo(newX, newY, 0);

                // INSERT POINT: _wheel
            },
            // _wheel: function (e) {
            // 	var that = this,
            // 		wheelDeltaX, wheelDeltaY,
            // 		deltaX, deltaY,
            // 		deltaScale;

            // 	if ('wheelDeltaX' in e) {
            // 		wheelDeltaX = e.wheelDeltaX / 3; //设置X轴鼠标滚轮速度
            // 		wheelDeltaY = e.wheelDeltaY / 3; //设置Y轴鼠标滚轮速度
            // 	} else if('wheelDelta' in e) {
            // 		wheelDeltaX = wheelDeltaY = e.wheelDelta / 3;
            // 	} else if ('detail' in e) {
            // 		wheelDeltaX = wheelDeltaY = -e.detail * 3;
            // 	} else {
            // 		return;
            // 	}

            // 	if (that.options.wheelAction == 'zoom') {
            // 		deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
            // 		if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
            // 		if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;

            // 		if (deltaScale != that.scale) {
            // 			if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
            // 			that.wheelZoomCount++;

            // 			that.zoom(e.pageX, e.pageY, deltaScale, 400);

            // 			setTimeout(function() {
            // 				that.wheelZoomCount--;
            // 				if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
            // 			}, 400);
            // 		}

            // 		return;
            // 	}

            // 	deltaX = that.x + wheelDeltaX;
            // 	deltaY = that.y + wheelDeltaY;

            // 	if (deltaX > 0) deltaX = 0;
            // 	else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

            // 	if (deltaY > that.minScrollY) deltaY = that.minScrollY;
            // 	else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

            // 	if (that.maxScrollY < 0) {
            // 		that.scrollTo(deltaX, deltaY, 0);
            // 	}
            // },
            _initSnap: function () {
                this.currentPage = {};

                if (typeof this.options.snap == 'string') {
                    this.options.snap = this.scroller.querySelectorAll(this.options.snap);
                }

                this.on('refresh', function () {
                    var i = 0, l,
                        m = 0, n,
                        cx, cy,
                        x = 0, y,
                        stepX = this.options.snapStepX || this.wrapperWidth,
                        stepY = this.options.snapStepY || this.wrapperHeight,
                        el;

                    this.pages = [];

                    if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                        return;
                    }

                    if (this.options.snap === true) {
                        cx = Math.round(stepX / 2);
                        cy = Math.round(stepY / 2);

                        while (x > -this.scrollerWidth) {
                            this.pages[i] = [];
                            l = 0;
                            y = 0;

                            while (y > -this.scrollerHeight) {
                                this.pages[i][l] = {
                                    x: Math.max(x, this.maxScrollX),
                                    y: Math.max(y, this.maxScrollY),
                                    width: stepX,
                                    height: stepY,
                                    cx: x - cx,
                                    cy: y - cy
                                };

                                y -= stepY;
                                l++;
                            }

                            x -= stepX;
                            i++;
                        }
                    } else {
                        el = this.options.snap;
                        l = el.length;
                        n = -1;

                        for (; i < l; i++) {
                            if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                                m = 0;
                                n++;
                            }

                            if (!this.pages[m]) {
                                this.pages[m] = [];
                            }

                            x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                            y = Math.max(-el[i].offsetTop, this.maxScrollY);
                            cx = x - Math.round(el[i].offsetWidth / 2);
                            cy = y - Math.round(el[i].offsetHeight / 2);

                            this.pages[m][n] = {
                                x: x,
                                y: y,
                                width: el[i].offsetWidth,
                                height: el[i].offsetHeight,
                                cx: cx,
                                cy: cy
                            };

                            if (x > this.maxScrollX) {
                                m++;
                            }
                        }
                    }

                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

                    // Update snap threshold if needed
                    if (this.options.snapThreshold % 1 === 0) {
                        this.snapThresholdX = this.options.snapThreshold;
                        this.snapThresholdY = this.options.snapThreshold;
                    } else {
                        this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                        this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
                    }
                });

                this.on('flick', function () {
                    var time = this.options.snapSpeed || Math.max(
                            Math.max(
                                Math.min(Math.abs(this.x - this.startX), 1000),
                                Math.min(Math.abs(this.y - this.startY), 1000)
                            ), 300);

                    this.goToPage(
                        this.currentPage.pageX + this.directionX,
                        this.currentPage.pageY + this.directionY,
                        time
                    );
                });
            },

            _nearestSnap: function (x, y) {
                if (!this.pages.length) {
                    return { x: 0, y: 0, pageX: 0, pageY: 0 };
                }

                var i = 0,
                    l = this.pages.length,
                    m = 0;

                // Check if we exceeded the snap threshold
                if (Math.abs(x - this.absStartX) < this.snapThresholdX &&
                    Math.abs(y - this.absStartY) < this.snapThresholdY) {
                    return this.currentPage;
                }

                if (x > 0) {
                    x = 0;
                } else if (x < this.maxScrollX) {
                    x = this.maxScrollX;
                }

                if (y > 0) {
                    y = 0;
                } else if (y < this.maxScrollY) {
                    y = this.maxScrollY;
                }

                for (; i < l; i++) {
                    if (x >= this.pages[i][0].cx) {
                        x = this.pages[i][0].x;
                        break;
                    }
                }

                l = this.pages[i].length;

                for (; m < l; m++) {
                    if (y >= this.pages[0][m].cy) {
                        y = this.pages[0][m].y;
                        break;
                    }
                }

                if (i == this.currentPage.pageX) {
                    i += this.directionX;

                    if (i < 0) {
                        i = 0;
                    } else if (i >= this.pages.length) {
                        i = this.pages.length - 1;
                    }

                    x = this.pages[i][0].x;
                }

                if (m == this.currentPage.pageY) {
                    m += this.directionY;

                    if (m < 0) {
                        m = 0;
                    } else if (m >= this.pages[0].length) {
                        m = this.pages[0].length - 1;
                    }

                    y = this.pages[0][m].y;
                }

                return {
                    x: x,
                    y: y,
                    pageX: i,
                    pageY: m
                };
            },

            goToPage: function (x, y, time, easing) {
                easing = easing || this.options.bounceEasing;

                if (x >= this.pages.length) {
                    x = this.pages.length - 1;
                } else if (x < 0) {
                    x = 0;
                }

                if (y >= this.pages[x].length) {
                    y = this.pages[x].length - 1;
                } else if (y < 0) {
                    y = 0;
                }

                var posX = this.pages[x][y].x,
                    posY = this.pages[x][y].y;

                time = time === undefined ? this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(posX - this.x), 1000),
                        Math.min(Math.abs(posY - this.y), 1000)
                    ), 300) : time;

                this.currentPage = {
                    x: posX,
                    y: posY,
                    pageX: x,
                    pageY: y
                };

                this.scrollTo(posX, posY, time, easing);
            },

            next: function (time, easing) {
                var x = this.currentPage.pageX,
                    y = this.currentPage.pageY;

                x++;

                if (x >= this.pages.length && this.hasVerticalScroll) {
                    x = 0;
                    y++;
                }

                this.goToPage(x, y, time, easing);
            },

            prev: function (time, easing) {
                var x = this.currentPage.pageX,
                    y = this.currentPage.pageY;

                x--;

                if (x < 0 && this.hasVerticalScroll) {
                    x = 0;
                    y--;
                }

                this.goToPage(x, y, time, easing);
            },

            _initKeys: function (e) {
                // default key bindings
                var keys = {
                    pageUp: 33,
                    pageDown: 34,
                    end: 35,
                    home: 36,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40
                };
                var i;

                // if you give me characters I give you keycode
                if (typeof this.options.keyBindings == 'object') {
                    for (i in this.options.keyBindings) {
                        if (typeof this.options.keyBindings[i] == 'string') {
                            this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
                        }
                    }
                } else {
                    this.options.keyBindings = {};
                }

                for (i in keys) {
                    this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
                }

                utils.addEvent(window, 'keydown', this);

                this.on('destroy', function () {
                    utils.removeEvent(window, 'keydown', this);
                });
            },

            _key: function (e) {
                if (!this.enabled) {
                    return;
                }

                var snap = this.options.snap,	// we are using this alot, better to cache it
                    newX = snap ? this.currentPage.pageX : this.x,
                    newY = snap ? this.currentPage.pageY : this.y,
                    now = utils.getTime(),
                    prevTime = this.keyTime || 0,
                    acceleration = 0.250,
                    pos;

                if (this.options.useTransition && this.isInTransition) {
                    pos = this.getComputedPosition();

                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this.isInTransition = false;
                }

                this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

                switch (e.keyCode) {
                    case this.options.keyBindings.pageUp:
                        if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                            newX += snap ? 1 : this.wrapperWidth;
                        } else {
                            newY += snap ? 1 : this.wrapperHeight;
                        }
                        break;
                    case this.options.keyBindings.pageDown:
                        if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                            newX -= snap ? 1 : this.wrapperWidth;
                        } else {
                            newY -= snap ? 1 : this.wrapperHeight;
                        }
                        break;
                    case this.options.keyBindings.end:
                        newX = snap ? this.pages.length - 1 : this.maxScrollX;
                        newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                        break;
                    case this.options.keyBindings.home:
                        newX = 0;
                        newY = 0;
                        break;
                    case this.options.keyBindings.left:
                        newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.up:
                        newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.right:
                        newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.down:
                        newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    default:
                        return;
                }

                if (snap) {
                    this.goToPage(newX, newY);
                    return;
                }

                if (newX > 0) {
                    newX = 0;
                    this.keyAcceleration = 0;
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX;
                    this.keyAcceleration = 0;
                }

                if (newY > 0) {
                    newY = 0;
                    this.keyAcceleration = 0;
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY;
                    this.keyAcceleration = 0;
                }

                this.scrollTo(newX, newY, 0);

                this.keyTime = now;
            },

            _animate: function (destX, destY, duration, easingFn) {
                var that = this,
                    startX = this.x,
                    startY = this.y,
                    startTime = utils.getTime(),
                    destTime = startTime + duration;

                function step() {
                    var now = utils.getTime(),
                        newX, newY,
                        easing;

                    if (now >= destTime) {
                        that.isAnimating = false;
                        that._translate(destX, destY);

                        if (!that.resetPosition(that.options.bounceTime)) {
                            that._execEvent('scrollEnd');
                        }

                        return;
                    }

                    now = (now - startTime) / duration;
                    easing = easingFn(now);
                    newX = (destX - startX) * easing + startX;
                    newY = (destY - startY) * easing + startY;
                    that._translate(newX, newY);

                    if (that.isAnimating) {
                        rAF(step);
                    }
                }

                this.isAnimating = true;
                step();
            },
            handleEvent: function (e) {
                switch (e.type) {
                    case 'touchstart':
                    case 'pointerdown':
                    case 'MSPointerDown':
                    case 'mousedown':
                        this._start(e);
                        break;
                    case 'touchmove':
                    case 'pointermove':
                    case 'MSPointerMove':
                    case 'mousemove':
                        this._move(e);
                        break;
                    case 'touchend':
                    case 'pointerup':
                    case 'MSPointerUp':
                    case 'mouseup':
                    case 'touchcancel':
                    case 'pointercancel':
                    case 'MSPointerCancel':
                    case 'mousecancel':
                        this._end(e);
                        break;
                    case 'orientationchange':
                    case 'resize':
                        this._resize();
                        break;
                    case 'transitionend':
                    case 'webkitTransitionEnd':
                    case 'oTransitionEnd':
                    case 'MSTransitionEnd':
                        this._transitionEnd(e);
                        break;
                    case 'wheel':
                    case 'DOMMouseScroll':
                    case 'mousewheel':
                        this._wheel(e);
                        break;
                    case 'keydown':
                        this._key(e);
                        break;
                    case 'click':
                        if (this.enabled && !e._constructed) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        break;
                }
            }
        };
        function createDefaultScrollbar(direction, interactive, type) {
            var scrollbar = document.createElement('div'),
                indicator = document.createElement('div');

            if (type === true) {
                scrollbar.style.cssText = 'position:absolute;z-index:9999';
                indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
            }

            indicator.className = 'iScrollIndicator';

            if (direction == 'h') {
                if (type === true) {
                    scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
                    indicator.style.height = '100%';
                }
                scrollbar.className = 'iScrollHorizontalScrollbar';
            } else {
                if (type === true) {
                    scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
                    indicator.style.width = '100%';
                }
                scrollbar.className = 'iScrollVerticalScrollbar';
            }

            scrollbar.style.cssText += ';overflow:hidden';

            if (!interactive) {
                scrollbar.style.pointerEvents = 'none';
            }

            scrollbar.appendChild(indicator);

            return scrollbar;
        }

        function Indicator(scroller, options) {
            this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
            this.wrapperStyle = this.wrapper.style;
            this.indicator = this.wrapper.children[0];
            this.indicatorStyle = this.indicator.style;
            this.scroller = scroller;

            this.options = {
                listenX: true,
                listenY: true,
                interactive: false,
                resize: true,
                defaultScrollbars: false,
                shrink: false,
                fade: false,
                speedRatioX: 0,
                speedRatioY: 0
            };

            for (var i in options) {
                this.options[i] = options[i];
            }

            this.sizeRatioX = 1;
            this.sizeRatioY = 1;
            this.maxPosX = 0;
            this.maxPosY = 0;

            if (this.options.interactive) {
                if (!this.options.disableTouch) {
                    utils.addEvent(this.indicator, 'touchstart', this);
                    utils.addEvent(window, 'touchend', this);
                }
                if (!this.options.disablePointer) {
                    utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                    utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
                }
                if (!this.options.disableMouse) {
                    utils.addEvent(this.indicator, 'mousedown', this);
                    utils.addEvent(window, 'mouseup', this);
                }
            }

            if (this.options.fade) {
                this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
                var durationProp = utils.style.transitionDuration;
                if (!durationProp) {
                    return;
                }
                this.wrapperStyle[durationProp] = utils.isBadAndroid ? '0.0001ms' : '0ms';
                // remove 0.0001ms
                var self = this;
                if (utils.isBadAndroid) {
                    rAF(function () {
                        if (self.wrapperStyle[durationProp] === '0.0001ms') {
                            self.wrapperStyle[durationProp] = '0s';
                        }
                    });
                }
                this.wrapperStyle.opacity = '0';
            }
        }

        Indicator.prototype = {
            handleEvent: function (e) {
                switch (e.type) {
                    case 'touchstart':
                    case 'pointerdown':
                    case 'MSPointerDown':
                    case 'mousedown':
                        this._start(e);
                        break;
                    case 'touchmove':
                    case 'pointermove':
                    case 'MSPointerMove':
                    case 'mousemove':
                        this._move(e);
                        break;
                    case 'touchend':
                    case 'pointerup':
                    case 'MSPointerUp':
                    case 'mouseup':
                    case 'touchcancel':
                    case 'pointercancel':
                    case 'MSPointerCancel':
                    case 'mousecancel':
                        this._end(e);
                        break;
                }
            },

            destroy: function () {
                if (this.options.fadeScrollbars) {
                    clearTimeout(this.fadeTimeout);
                    this.fadeTimeout = null;
                }
                if (this.options.interactive) {
                    utils.removeEvent(this.indicator, 'touchstart', this);
                    utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                    utils.removeEvent(this.indicator, 'mousedown', this);

                    utils.removeEvent(window, 'touchmove', this);
                    utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                    utils.removeEvent(window, 'mousemove', this);

                    utils.removeEvent(window, 'touchend', this);
                    utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
                    utils.removeEvent(window, 'mouseup', this);
                }

                if (this.options.defaultScrollbars) {
                    this.wrapper.parentNode.removeChild(this.wrapper);
                }
            },

            _start: function (e) {
                var point = e.touches ? e.touches[0] : e;

                e.preventDefault();
                e.stopPropagation();

                this.transitionTime();

                this.initiated = true;
                this.moved = false;
                this.lastPointX = point.pageX;
                this.lastPointY = point.pageY;

                this.startTime = utils.getTime();

                if (!this.options.disableTouch) {
                    utils.addEvent(window, 'touchmove', this);
                }
                if (!this.options.disablePointer) {
                    utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
                }
                if (!this.options.disableMouse) {
                    utils.addEvent(window, 'mousemove', this);
                }

                this.scroller._execEvent('beforeScrollStart');
            },

            _move: function (e) {
                var point = e.touches ? e.touches[0] : e,
                    deltaX, deltaY,
                    newX, newY,
                    timestamp = utils.getTime();

                if (!this.moved) {
                    this.scroller._execEvent('scrollStart');
                }

                this.moved = true;

                deltaX = point.pageX - this.lastPointX;
                this.lastPointX = point.pageX;

                deltaY = point.pageY - this.lastPointY;
                this.lastPointY = point.pageY;

                newX = this.x + deltaX;
                newY = this.y + deltaY;

                this._pos(newX, newY);

                // INSERT POINT: indicator._move

                e.preventDefault();
                e.stopPropagation();
            },

            _end: function (e) {
                if (!this.initiated) {
                    return;
                }

                this.initiated = false;

                e.preventDefault();
                e.stopPropagation();

                utils.removeEvent(window, 'touchmove', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                utils.removeEvent(window, 'mousemove', this);

                if (this.scroller.options.snap) {
                    var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

                    var time = this.options.snapSpeed || Math.max(
                            Math.max(
                                Math.min(Math.abs(this.scroller.x - snap.x), 1000),
                                Math.min(Math.abs(this.scroller.y - snap.y), 1000)
                            ), 300);

                    if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
                        this.scroller.directionX = 0;
                        this.scroller.directionY = 0;
                        this.scroller.currentPage = snap;
                        this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
                    }
                }

                if (this.moved) {
                    this.scroller._execEvent('scrollEnd');
                }
            },

            transitionTime: function (time) {
                time = time || 0;
                var durationProp = utils.style.transitionDuration;
                if (!durationProp) {
                    return;
                }

                this.indicatorStyle[durationProp] = time + 'ms';

                if (!time && utils.isBadAndroid) {
                    this.indicatorStyle[durationProp] = '0.0001ms';
                    // remove 0.0001ms
                    var self = this;
                    rAF(function () {
                        if (self.indicatorStyle[durationProp] === '0.0001ms') {
                            self.indicatorStyle[durationProp] = '0s';
                        }
                    });
                }
            },

            transitionTimingFunction: function (easing) {
                this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
            },

            refresh: function () {
                this.transitionTime();

                if (this.options.listenX && !this.options.listenY) {
                    this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
                } else if (this.options.listenY && !this.options.listenX) {
                    this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
                } else {
                    this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
                }

                if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                    utils.addClass(this.wrapper, 'iScrollBothScrollbars');
                    utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

                    if (this.options.defaultScrollbars && this.options.customStyle) {
                        if (this.options.listenX) {
                            this.wrapper.style.right = '8px';
                        } else {
                            this.wrapper.style.bottom = '8px';
                        }
                    }
                } else {
                    utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
                    utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

                    if (this.options.defaultScrollbars && this.options.customStyle) {
                        if (this.options.listenX) {
                            this.wrapper.style.right = '2px';
                        } else {
                            this.wrapper.style.bottom = '2px';
                        }
                    }
                }

                var r = this.wrapper.offsetHeight;	// force refresh

                if (this.options.listenX) {
                    this.wrapperWidth = this.wrapper.clientWidth;
                    if (this.options.resize) {
                        this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                        this.indicatorStyle.width = this.indicatorWidth + 'px';
                    } else {
                        this.indicatorWidth = this.indicator.clientWidth;
                    }

                    this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                    if (this.options.shrink == 'clip') {
                        this.minBoundaryX = -this.indicatorWidth + 8;
                        this.maxBoundaryX = this.wrapperWidth - 8;
                    } else {
                        this.minBoundaryX = 0;
                        this.maxBoundaryX = this.maxPosX;
                    }

                    this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
                }

                if (this.options.listenY) {
                    this.wrapperHeight = this.wrapper.clientHeight;
                    if (this.options.resize) {
                        this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                        this.indicatorStyle.height = this.indicatorHeight + 'px';
                    } else {
                        this.indicatorHeight = this.indicator.clientHeight;
                    }

                    this.maxPosY = this.wrapperHeight - this.indicatorHeight;

                    if (this.options.shrink == 'clip') {
                        this.minBoundaryY = -this.indicatorHeight + 8;
                        this.maxBoundaryY = this.wrapperHeight - 8;
                    } else {
                        this.minBoundaryY = 0;
                        this.maxBoundaryY = this.maxPosY;
                    }

                    this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                    this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
                }

                this.updatePosition();
            },

            updatePosition: function () {
                var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                    y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

                if (!this.options.ignoreBoundaries) {
                    if (x < this.minBoundaryX) {
                        if (this.options.shrink == 'scale') {
                            this.width = Math.max(this.indicatorWidth + x, 8);
                            this.indicatorStyle.width = this.width + 'px';
                        }
                        x = this.minBoundaryX;
                    } else if (x > this.maxBoundaryX) {
                        if (this.options.shrink == 'scale') {
                            this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                            this.indicatorStyle.width = this.width + 'px';
                            x = this.maxPosX + this.indicatorWidth - this.width;
                        } else {
                            x = this.maxBoundaryX;
                        }
                    } else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
                        this.width = this.indicatorWidth;
                        this.indicatorStyle.width = this.width + 'px';
                    }

                    if (y < this.minBoundaryY) {
                        if (this.options.shrink == 'scale') {
                            this.height = Math.max(this.indicatorHeight + y * 3, 8);
                            this.indicatorStyle.height = this.height + 'px';
                        }
                        y = this.minBoundaryY;
                    } else if (y > this.maxBoundaryY) {
                        if (this.options.shrink == 'scale') {
                            this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                            this.indicatorStyle.height = this.height + 'px';
                            y = this.maxPosY + this.indicatorHeight - this.height;
                        } else {
                            y = this.maxBoundaryY;
                        }
                    } else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
                        this.height = this.indicatorHeight;
                        this.indicatorStyle.height = this.height + 'px';
                    }
                }

                this.x = x;
                this.y = y;

                if (this.scroller.options.useTransform) {
                    this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
                } else {
                    this.indicatorStyle.left = x + 'px';
                    this.indicatorStyle.top = y + 'px';
                }
            },

            _pos: function (x, y) {
                if (x < 0) {
                    x = 0;
                } else if (x > this.maxPosX) {
                    x = this.maxPosX;
                }

                if (y < 0) {
                    y = 0;
                } else if (y > this.maxPosY) {
                    y = this.maxPosY;
                }

                x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
                y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

                this.scroller.scrollTo(x, y);
            },

            fade: function (val, hold) {
                if (hold && !this.visible) {
                    return;
                }

                clearTimeout(this.fadeTimeout);
                this.fadeTimeout = null;

                var time = val ? 250 : 500,
                    delay = val ? 0 : 300;

                val = val ? '1' : '0';

                this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

                this.fadeTimeout = setTimeout((function (val) {
                    this.wrapperStyle.opacity = val;
                    this.visible = +val;
                }).bind(this, val), delay);
            }
        };

        IScroll.utils = utils;

        if (typeof module != 'undefined' && module.exports) {
            module.exports = IScroll;
        } else if (typeof define == 'function' && define.amd) {
            define(function () { return IScroll; });
        } else {
            window.IScroll = IScroll;
        }

    })(window, document, Math);

}

else {
    /*!
     * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
     * Released under MIT license, http://cubiq.org/license
     */
    (function (window, doc) {
        var m = Math,
            dummyStyle = doc.createElement('div').style,
            vendor = (function () {
                var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                    t,
                    i = 0,
                    l = vendors.length;

                for (; i < l; i++) {
                    t = vendors[i] + 'ransform';
                    if (t in dummyStyle) {
                        return vendors[i].substr(0, vendors[i].length - 1);
                    }
                }

                return false;
            })(),
            cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

            // Style properties
            transform = prefixStyle('transform'),
            transitionProperty = prefixStyle('transitionProperty'),
            transitionDuration = prefixStyle('transitionDuration'),
            transformOrigin = prefixStyle('transformOrigin'),
            transitionTimingFunction = prefixStyle('transitionTimingFunction'),
            transitionDelay = prefixStyle('transitionDelay'),

            // Browser capabilities
            isAndroid = (/android/gi).test(navigator.appVersion),
            isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
            isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

            has3d = prefixStyle('perspective') in dummyStyle,
            hasTouch = 'ontouchstart' in window && !isTouchPad,
            hasTransform = vendor !== false,
            hasTransitionEnd = prefixStyle('transition') in dummyStyle,

            RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            START_EV = hasTouch ? 'touchstart' : 'mousedown',
            MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
            END_EV = hasTouch ? 'touchend' : 'mouseup',
            CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
            TRNEND_EV = (function () {
                if (vendor === false) return false;

                var transitionEnd = {
                    '': 'transitionend',
                    'webkit': 'webkitTransitionEnd',
                    'Moz': 'transitionend',
                    'O': 'otransitionend',
                    'ms': 'MSTransitionEnd'
                };

                return transitionEnd[vendor];
            })(),

            nextFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) { return setTimeout(callback, 1); };
            })(),
            cancelFrame = (function () {
                return window.cancelRequestAnimationFrame ||
                    window.webkitCancelAnimationFrame ||
                    window.webkitCancelRequestAnimationFrame ||
                    window.mozCancelRequestAnimationFrame ||
                    window.oCancelRequestAnimationFrame ||
                    window.msCancelRequestAnimationFrame ||
                    clearTimeout;
            })(),

            // Helpers
            translateZ = has3d ? ' translateZ(0)' : '',

            // Constructor
            iScroll = function (el, options) {
                var that = this,
                    i;

                that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
                that.wrapper.style.overflow = 'hidden';
                that.scroller = that.wrapper.children[0];

                // Default options
                that.options = {
                    hScroll: false,
                    vScroll: true,
                    x: 0,
                    y: 0,
                    bounce: true,
                    bounceLock: false,
                    momentum: true,
                    lockDirection: true,
                    useTransform: true,
                    useTransition: false,
                    topOffset: 0,
                    checkDOMChanges: false,		// Experimental
                    handleClick: true,

                    // Scrollbar
                    hScrollbar: true,
                    vScrollbar: true,
                    fixedScrollbar: isAndroid,
                    hideScrollbar: isIDevice,
                    fadeScrollbar: isIDevice && has3d,
                    scrollbarClass: '',

                    // Zoom
                    zoom: false,
                    zoomMin: 1,
                    zoomMax: 4,
                    doubleTapZoom: 2,
                    wheelAction: 'scroll',

                    // Snap
                    snap: false,
                    snapThreshold: 1,

                    // Events
                    onRefresh: null,
                    onBeforeScrollStart: function (e) { e.preventDefault(); },
                    onScrollStart: null,
                    onBeforeScrollMove: null,
                    onScrollMove: null,
                    onBeforeScrollEnd: null,
                    onScrollEnd: null,
                    onTouchEnd: null,
                    onDestroy: null,
                    onZoomStart: null,
                    onZoom: null,
                    onZoomEnd: null
                };

                // User defined options
                for (i in options) that.options[i] = options[i];

                // Set starting position
                that.x = that.options.x;
                that.y = that.options.y;

                // Normalize options
                that.options.useTransform = hasTransform && that.options.useTransform;
                that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
                that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
                that.options.zoom = that.options.useTransform && that.options.zoom;
                that.options.useTransition = hasTransitionEnd && that.options.useTransition;

                // Helpers FIX ANDROID BUG!
                // translate3d and scale doesn't work together!
                // Ignoring 3d ONLY WHEN YOU SET that.options.zoom
                if (that.options.zoom && isAndroid) {
                    translateZ = '';
                }

                // Set some default styles
                that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
                that.scroller.style[transitionDuration] = '0';
                that.scroller.style[transformOrigin] = '0 0';
                if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';

                if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
                else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

                if (that.options.useTransition) that.options.fixedScrollbar = true;

                that.refresh();

                that._bind(RESIZE_EV, window);
                that._bind(START_EV);
                if (!hasTouch) {
                    if (that.options.wheelAction != 'none') {
                        that._bind('DOMMouseScroll');
                        that._bind('mousewheel');
                    }
                }

                if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
                    that._checkDOMChanges();
                }, 500);
            };

        // Prototype
        iScroll.prototype = {
            enabled: true,
            x: 0,
            y: 0,
            steps: [],
            scale: 1,
            currPageX: 0, currPageY: 0,
            pagesX: [], pagesY: [],
            aniTime: null,
            wheelZoomCount: 0,

            handleEvent: function (e) {
                var that = this;
                switch (e.type) {
                    case START_EV:
                        if (!hasTouch && e.button !== 0) return;
                        that._start(e);
                        break;
                    case MOVE_EV: that._move(e); break;
                    case END_EV:
                    case CANCEL_EV: that._end(e); break;
                    case RESIZE_EV: that._resize(); break;
                    case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
                    case TRNEND_EV: that._transitionEnd(e); break;
                }
            },

            _checkDOMChanges: function () {
                if (this.moved || this.zoomed || this.animating ||
                    (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

                this.refresh();
            },

            _scrollbar: function (dir) {
                var that = this,
                    bar;

                if (!that[dir + 'Scrollbar']) {
                    if (that[dir + 'ScrollbarWrapper']) {
                        if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
                        that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
                        that[dir + 'ScrollbarWrapper'] = null;
                        that[dir + 'ScrollbarIndicator'] = null;
                    }

                    return;
                }

                if (!that[dir + 'ScrollbarWrapper']) {
                    // Create the scrollbar wrapper
                    bar = doc.createElement('div');

                    if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
                    else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

                    bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

                    that.wrapper.appendChild(bar);
                    that[dir + 'ScrollbarWrapper'] = bar;

                    // Create the scrollbar indicator
                    bar = doc.createElement('div');
                    if (!that.options.scrollbarClass) {
                        bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
                    }
                    bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
                    if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

                    that[dir + 'ScrollbarWrapper'].appendChild(bar);
                    that[dir + 'ScrollbarIndicator'] = bar;
                }

                if (dir == 'h') {
                    that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
                    that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
                    that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
                    that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
                    that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
                } else {
                    that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
                    that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
                    that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
                    that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
                    that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
                }

                // Reset position
                that._scrollbarPos(dir, true);
            },

            _resize: function () {
                var that = this;
                setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
            },

            _pos: function (x, y) {
                if (this.zoomed) return;

                x = this.hScroll ? x : 0;
                y = this.vScroll ? y : 0;

                if (this.options.useTransform) {
                    this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
                } else {
                    x = m.round(x);
                    y = m.round(y);
                    this.scroller.style.left = x + 'px';
                    this.scroller.style.top = y + 'px';
                }

                this.x = x;
                this.y = y;

                this._scrollbarPos('h');
                this._scrollbarPos('v');
            },

            _scrollbarPos: function (dir, hidden) {
                var that = this,
                    pos = dir == 'h' ? that.x : that.y,
                    size;

                if (!that[dir + 'Scrollbar']) return;

                pos = that[dir + 'ScrollbarProp'] * pos;

                if (pos < 0) {
                    if (!that.options.fixedScrollbar) {
                        size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
                        if (size < 8) size = 8;
                        that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                    }
                    pos = 0;
                } else if (pos > that[dir + 'ScrollbarMaxScroll']) {
                    if (!that.options.fixedScrollbar) {
                        size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
                        if (size < 8) size = 8;
                        that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                        pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
                    } else {
                        pos = that[dir + 'ScrollbarMaxScroll'];
                    }
                }

                that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
                that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
                that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
            },

            _start: function (e) {
                var that = this,
                    point = hasTouch ? e.touches[0] : e,
                    matrix, x, y,
                    c1, c2;

                if (!that.enabled) return;

                if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

                if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

                that.moved = false;
                that.animating = false;
                that.zoomed = false;
                that.distX = 0;
                that.distY = 0;
                that.absDistX = 0;
                that.absDistY = 0;
                that.dirX = 0;
                that.dirY = 0;

                // Gesture start
                if (that.options.zoom && hasTouch && e.touches.length > 1) {
                    c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
                    c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
                    that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

                    that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
                    that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

                    if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                }

                if (that.options.momentum) {
                    if (that.options.useTransform) {
                        // Very lame general purpose alternative to CSSMatrix
                        matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                        x = +(matrix[12] || matrix[4]);
                        y = +(matrix[13] || matrix[5]);
                    } else {
                        x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
                        y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
                    }

                    if (x != that.x || y != that.y) {
                        if (that.options.useTransition) that._unbind(TRNEND_EV);
                        else cancelFrame(that.aniTime);
                        that.steps = [];
                        that._pos(x, y);
                        if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
                    }
                }

                that.absStartX = that.x;	// Needed by snap threshold
                that.absStartY = that.y;

                that.startX = that.x;
                that.startY = that.y;
                that.pointX = point.pageX;
                that.pointY = point.pageY;

                that.startTime = e.timeStamp || Date.now();

                if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

                that._bind(MOVE_EV, window);
                that._bind(END_EV, window);
                that._bind(CANCEL_EV, window);
            },

            _move: function (e) {
                var that = this,
                    point = hasTouch ? e.touches[0] : e,
                    deltaX = point.pageX - that.pointX,
                    deltaY = point.pageY - that.pointY,
                    newX = that.x + deltaX,
                    newY = that.y + deltaY,
                    c1, c2, scale,
                    timestamp = e.timeStamp || Date.now();

                if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

                // Zoom
                if (that.options.zoom && hasTouch && e.touches.length > 1) {
                    c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
                    c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
                    that.touchesDist = m.sqrt(c1 * c1 + c2 * c2);

                    that.zoomed = true;

                    scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

                    if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
                    else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

                    that.lastScale = scale / this.scale;

                    newX = this.originX - this.originX * that.lastScale + this.x;
                    newY = this.originY - this.originY * that.lastScale + this.y;

                    this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

                    if (that.options.onZoom) that.options.onZoom.call(that, e);
                    return;
                }

                that.pointX = point.pageX;
                that.pointY = point.pageY;

                // Slow down if outside of the boundaries
                if (newX > 0 || newX < that.maxScrollX) {
                    newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
                }
                if (newY > that.minScrollY || newY < that.maxScrollY) {
                    newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
                }

                that.distX += deltaX;
                that.distY += deltaY;
                that.absDistX = m.abs(that.distX);
                that.absDistY = m.abs(that.distY);

                if (that.absDistX < 6 && that.absDistY < 6) {
                    return;
                }

                // Lock direction
                if (that.options.lockDirection) {
                    if (that.absDistX > that.absDistY + 5) {
                        newY = that.y;
                        deltaY = 0;
                    } else if (that.absDistY > that.absDistX + 5) {
                        newX = that.x;
                        deltaX = 0;
                    }
                }

                that.moved = true;
                that._pos(newX, newY);
                that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

                if (timestamp - that.startTime > 300) {
                    that.startTime = timestamp;
                    that.startX = that.x;
                    that.startY = that.y;
                }

                if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
            },

            _end: function (e) {
                if (hasTouch && e.touches.length !== 0) return;

                var that = this,
                    point = hasTouch ? e.changedTouches[0] : e,
                    target, ev,
                    momentumX = { dist: 0, time: 0 },
                    momentumY = { dist: 0, time: 0 },
                    duration = (e.timeStamp || Date.now()) - that.startTime,
                    newPosX = that.x,
                    newPosY = that.y,
                    distX, distY,
                    newDuration,
                    snap,
                    scale;

                that._unbind(MOVE_EV, window);
                that._unbind(END_EV, window);
                that._unbind(CANCEL_EV, window);

                if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

                if (that.zoomed) {
                    scale = that.scale * that.lastScale;
                    scale = Math.max(that.options.zoomMin, scale);
                    scale = Math.min(that.options.zoomMax, scale);
                    that.lastScale = scale / that.scale;
                    that.scale = scale;

                    that.x = that.originX - that.originX * that.lastScale + that.x;
                    that.y = that.originY - that.originY * that.lastScale + that.y;

                    that.scroller.style[transitionDuration] = '200ms';
                    that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;

                    that.zoomed = false;
                    that.refresh();

                    if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                    return;
                }

                if (!that.moved) {
                    if (hasTouch) {
                        if (that.doubleTapTimer && that.options.zoom) {
                            // Double tapped
                            clearTimeout(that.doubleTapTimer);
                            that.doubleTapTimer = null;
                            if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                            that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
                            if (that.options.onZoomEnd) {
                                setTimeout(function () {
                                    that.options.onZoomEnd.call(that, e);
                                }, 200); // 200 is default zoom duration
                            }
                        } else if (this.options.handleClick) {
                            that.doubleTapTimer = setTimeout(function () {
                                that.doubleTapTimer = null;

                                // Find the last touched element
                                target = point.target;
                                while (target.nodeType != 1) target = target.parentNode;

                                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                                    ev = doc.createEvent('MouseEvents');
                                    ev.initMouseEvent('click', true, true, e.view, 1,
                                        point.screenX, point.screenY, point.clientX, point.clientY,
                                        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                        0, null);
                                    ev._fake = true;
                                    target.dispatchEvent(ev);
                                }
                            }, that.options.zoom ? 250 : 0);
                        }
                    }

                    that._resetPos(400);

                    if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                    return;
                }

                if (duration < 300 && that.options.momentum) {
                    momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
                    momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

                    newPosX = that.x + momentumX.dist;
                    newPosY = that.y + momentumY.dist;

                    if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist: 0, time: 0 };
                    if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist: 0, time: 0 };
                }

                if (momentumX.dist || momentumY.dist) {
                    newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

                    // Do we need to snap?
                    if (that.options.snap) {
                        distX = newPosX - that.absStartX;
                        distY = newPosY - that.absStartY;
                        if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
                        else {
                            snap = that._snap(newPosX, newPosY);
                            newPosX = snap.x;
                            newPosY = snap.y;
                            newDuration = m.max(snap.time, newDuration);
                        }
                    }

                    that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

                    if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                    return;
                }

                // Do we need to snap?
                if (that.options.snap) {
                    distX = newPosX - that.absStartX;
                    distY = newPosY - that.absStartY;
                    if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
                    else {
                        snap = that._snap(that.x, that.y);
                        if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
                    }

                    if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                    return;
                }

                that._resetPos(200);
                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            },

            _resetPos: function (time) {
                var that = this,
                    resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
                    resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

                if (resetX == that.x && resetY == that.y) {
                    if (that.moved) {
                        that.moved = false;
                        if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
                    }

                    if (that.hScrollbar && that.options.hideScrollbar) {
                        if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
                        that.hScrollbarWrapper.style.opacity = '0';
                    }
                    if (that.vScrollbar && that.options.hideScrollbar) {
                        if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
                        that.vScrollbarWrapper.style.opacity = '0';
                    }

                    return;
                }

                that.scrollTo(resetX, resetY, time || 0);
            },

            _wheel: function (e) {
                var that = this,
                    wheelDeltaX, wheelDeltaY,
                    deltaX, deltaY,
                    deltaScale;

                if ('wheelDeltaX' in e) {
                    wheelDeltaX = e.wheelDeltaX / 3; //设置X轴鼠标滚轮速度
                    wheelDeltaY = e.wheelDeltaY / 3; //设置Y轴鼠标滚轮速度
                } else if ('wheelDelta' in e) {
                    wheelDeltaX = wheelDeltaY = e.wheelDelta / 3;
                } else if ('detail' in e) {
                    wheelDeltaX = wheelDeltaY = -e.detail * 3;
                } else {
                    return;
                }

                if (that.options.wheelAction == 'zoom') {
                    deltaScale = that.scale * Math.pow(2, 1 / 3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
                    if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
                    if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;

                    if (deltaScale != that.scale) {
                        if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                        that.wheelZoomCount++;

                        that.zoom(e.pageX, e.pageY, deltaScale, 400);

                        setTimeout(function () {
                            that.wheelZoomCount--;
                            if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                        }, 400);
                    }

                    return;
                }

                deltaX = that.x + wheelDeltaX;
                deltaY = that.y + wheelDeltaY;

                if (deltaX > 0) deltaX = 0;
                else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

                if (deltaY > that.minScrollY) deltaY = that.minScrollY;
                else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

                if (that.maxScrollY < 0) {
                    that.scrollTo(deltaX, deltaY, 0);
                }
            },

            _transitionEnd: function (e) {
                var that = this;

                if (e.target != that.scroller) return;

                that._unbind(TRNEND_EV);

                that._startAni();
            },


            /**
            *
            * Utilities
            *
            */
            _startAni: function () {
                var that = this,
                    startX = that.x, startY = that.y,
                    startTime = Date.now(),
                    step, easeOut,
                    animate;

                if (that.animating) return;

                if (!that.steps.length) {
                    that._resetPos(400);
                    return;
                }

                step = that.steps.shift();

                if (step.x == startX && step.y == startY) step.time = 0;

                that.animating = true;
                that.moved = true;

                if (that.options.useTransition) {
                    that._transitionTime(step.time);
                    that._pos(step.x, step.y);
                    that.animating = false;
                    if (step.time) that._bind(TRNEND_EV);
                    else that._resetPos(0);
                    return;
                }

                animate = function () {
                    var now = Date.now(),
                        newX, newY;

                    if (now >= startTime + step.time) {
                        that._pos(step.x, step.y);
                        that.animating = false;
                        if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
                        that._startAni();
                        return;
                    }

                    now = (now - startTime) / step.time - 1;
                    easeOut = m.sqrt(1 - now * now);
                    newX = (step.x - startX) * easeOut + startX;
                    newY = (step.y - startY) * easeOut + startY;
                    that._pos(newX, newY);
                    if (that.animating) that.aniTime = nextFrame(animate);
                };

                animate();
            },

            _transitionTime: function (time) {
                time += 'ms';
                this.scroller.style[transitionDuration] = time;
                if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
                if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
            },

            _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
                var deceleration = 0.0006,
                    speed = m.abs(dist) / time,
                    newDist = (speed * speed) / (2 * deceleration),
                    newTime = 0, outsideDist = 0;

                // Proportinally reduce speed if we are outside of the boundaries
                if (dist > 0 && newDist > maxDistUpper) {
                    outsideDist = size / (6 / (newDist / speed * deceleration));
                    maxDistUpper = maxDistUpper + outsideDist;
                    speed = speed * maxDistUpper / newDist;
                    newDist = maxDistUpper;
                } else if (dist < 0 && newDist > maxDistLower) {
                    outsideDist = size / (6 / (newDist / speed * deceleration));
                    maxDistLower = maxDistLower + outsideDist;
                    speed = speed * maxDistLower / newDist;
                    newDist = maxDistLower;
                }

                newDist = newDist * (dist < 0 ? -1 : 1);
                newTime = speed / deceleration;

                return { dist: newDist, time: m.round(newTime) };
            },

            _offset: function (el) {
                var left = -el.offsetLeft,
                    top = -el.offsetTop;

                while (el = el.offsetParent) {
                    left -= el.offsetLeft;
                    top -= el.offsetTop;
                }

                if (el != this.wrapper) {
                    left *= this.scale;
                    top *= this.scale;
                }

                return { left: left, top: top };
            },

            _snap: function (x, y) {
                var that = this,
                    i, l,
                    page, time,
                    sizeX, sizeY;

                // Check page X
                page = that.pagesX.length - 1;
                for (i = 0, l = that.pagesX.length; i < l; i++) {
                    if (x >= that.pagesX[i]) {
                        page = i;
                        break;
                    }
                }
                if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
                x = that.pagesX[page];
                sizeX = m.abs(x - that.pagesX[that.currPageX]);
                sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
                that.currPageX = page;

                // Check page Y
                page = that.pagesY.length - 1;
                for (i = 0; i < page; i++) {
                    if (y >= that.pagesY[i]) {
                        page = i;
                        break;
                    }
                }
                if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
                y = that.pagesY[page];
                sizeY = m.abs(y - that.pagesY[that.currPageY]);
                sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
                that.currPageY = page;

                // Snap with constant speed (proportional duration)
                time = m.round(m.max(sizeX, sizeY)) || 200;

                return { x: x, y: y, time: time };
            },

            _bind: function (type, el, bubble) {
                (el || this.scroller).addEventListener(type, this, !!bubble);
            },

            _unbind: function (type, el, bubble) {
                (el || this.scroller).removeEventListener(type, this, !!bubble);
            },


            /**
            *
            * Public methods
            *
            */
            destroy: function () {
                var that = this;

                that.scroller.style[transform] = '';

                // Remove the scrollbars
                that.hScrollbar = false;
                that.vScrollbar = false;
                that._scrollbar('h');
                that._scrollbar('v');

                // Remove the event listeners
                that._unbind(RESIZE_EV, window);
                that._unbind(START_EV);
                that._unbind(MOVE_EV, window);
                that._unbind(END_EV, window);
                that._unbind(CANCEL_EV, window);

                if (!that.options.hasTouch) {
                    that._unbind('DOMMouseScroll');
                    that._unbind('mousewheel');
                }

                if (that.options.useTransition) that._unbind(TRNEND_EV);

                if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);

                if (that.options.onDestroy) that.options.onDestroy.call(that);
            },

            refresh: function () {
                var that = this,
                    offset,
                    i, l,
                    els,
                    pos = 0,
                    page = 0;

                if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
                that.wrapperW = that.wrapper.clientWidth || 1;
                that.wrapperH = that.wrapper.clientHeight || 1;

                that.minScrollY = -that.options.topOffset || 0;
                that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
                that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
                that.maxScrollX = that.wrapperW - that.scrollerW;
                that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
                that.dirX = 0;
                that.dirY = 0;

                if (that.options.onRefresh) that.options.onRefresh.call(that);

                that.hScroll = that.options.hScroll && that.maxScrollX < 0;
                that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

                that.hScrollbar = that.hScroll && that.options.hScrollbar;
                that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

                offset = that._offset(that.wrapper);
                that.wrapperOffsetLeft = -offset.left;
                that.wrapperOffsetTop = -offset.top;

                // Prepare snap
                if (typeof that.options.snap == 'string') {
                    that.pagesX = [];
                    that.pagesY = [];
                    els = that.scroller.querySelectorAll(that.options.snap);
                    for (i = 0, l = els.length; i < l; i++) {
                        pos = that._offset(els[i]);
                        pos.left += that.wrapperOffsetLeft;
                        pos.top += that.wrapperOffsetTop;
                        that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
                        that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
                    }
                } else if (that.options.snap) {
                    that.pagesX = [];
                    while (pos >= that.maxScrollX) {
                        that.pagesX[page] = pos;
                        pos = pos - that.wrapperW;
                        page++;
                    }
                    if (that.maxScrollX % that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length - 1] + that.pagesX[that.pagesX.length - 1];

                    pos = 0;
                    page = 0;
                    that.pagesY = [];
                    while (pos >= that.maxScrollY) {
                        that.pagesY[page] = pos;
                        pos = pos - that.wrapperH;
                        page++;
                    }
                    if (that.maxScrollY % that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length - 1] + that.pagesY[that.pagesY.length - 1];
                }

                // Prepare the scrollbars
                that._scrollbar('h');
                that._scrollbar('v');

                if (!that.zoomed) {
                    that.scroller.style[transitionDuration] = '0';
                    that._resetPos(400);
                }
            },

            scrollTo: function (x, y, time, relative) {
                var that = this,
                    step = x,
                    i, l;

                that.stop();

                if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];

                for (i = 0, l = step.length; i < l; i++) {
                    if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
                    that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
                }

                that._startAni();
            },

            scrollToElement: function (el, time) {
                var that = this, pos;
                el = el.nodeType ? el : that.scroller.querySelector(el);
                if (!el) return;

                pos = that._offset(el);
                pos.left += that.wrapperOffsetLeft;
                pos.top += that.wrapperOffsetTop;

                pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
                pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
                time = time === undefined ? m.max(m.abs(pos.left) * 2, m.abs(pos.top) * 2) : time;

                that.scrollTo(pos.left, pos.top, time);
            },

            scrollToPage: function (pageX, pageY, time) {
                var that = this, x, y;

                time = time === undefined ? 400 : time;

                if (that.options.onScrollStart) that.options.onScrollStart.call(that);

                if (that.options.snap) {
                    pageX = pageX == 'next' ? that.currPageX + 1 : pageX == 'prev' ? that.currPageX - 1 : pageX;
                    pageY = pageY == 'next' ? that.currPageY + 1 : pageY == 'prev' ? that.currPageY - 1 : pageY;

                    pageX = pageX < 0 ? 0 : pageX > that.pagesX.length - 1 ? that.pagesX.length - 1 : pageX;
                    pageY = pageY < 0 ? 0 : pageY > that.pagesY.length - 1 ? that.pagesY.length - 1 : pageY;

                    that.currPageX = pageX;
                    that.currPageY = pageY;
                    x = that.pagesX[pageX];
                    y = that.pagesY[pageY];
                } else {
                    x = -that.wrapperW * pageX;
                    y = -that.wrapperH * pageY;
                    if (x < that.maxScrollX) x = that.maxScrollX;
                    if (y < that.maxScrollY) y = that.maxScrollY;
                }

                that.scrollTo(x, y, time);
            },

            disable: function () {
                this.stop();
                this._resetPos(0);
                this.enabled = false;

                // If disabled after touchstart we make sure that there are no left over events
                this._unbind(MOVE_EV, window);
                this._unbind(END_EV, window);
                this._unbind(CANCEL_EV, window);
            },

            enable: function () {
                this.enabled = true;
            },

            stop: function () {
                if (this.options.useTransition) this._unbind(TRNEND_EV);
                else cancelFrame(this.aniTime);
                this.steps = [];
                this.moved = false;
                this.animating = false;
            },

            zoom: function (x, y, scale, time) {
                var that = this,
                    relScale = scale / that.scale;

                if (!that.options.useTransform) return;

                that.zoomed = true;
                time = time === undefined ? 200 : time;
                x = x - that.wrapperOffsetLeft - that.x;
                y = y - that.wrapperOffsetTop - that.y;
                that.x = x - x * relScale + that.x;
                that.y = y - y * relScale + that.y;

                that.scale = scale;
                that.refresh();

                that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
                that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

                that.scroller.style[transitionDuration] = time + 'ms';
                that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
                that.zoomed = false;
            },

            isReady: function () {
                return !this.moved && !this.zoomed && !this.animating;
            }
        };

        function prefixStyle(style) {
            if (vendor === '') return style;

            style = style.charAt(0).toUpperCase() + style.substr(1);
            return vendor + style;
        }

        dummyStyle = null;	// for the sake of it

        if (typeof exports !== 'undefined') exports.iScroll = iScroll;
        else window.iScroll = iScroll;

    })(window, document);

}