(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/lib/const.js":[function(require,module,exports){
"use strict";

module.exports = {

    IS_SELECTED: "is-selected"

};

},{}],"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/lib/ctx.js":[function(require,module,exports){
"use strict";

module.exports = (function (global) {
    "use strict";

    var AudioContext = null;
    try {
        AudioContext = global.AudioContext || global.webkitAudioContext || global.mozAudioContext || global.oAudioContext || global.msAudioContext;
    } catch (e) {
        throw new Error("WebAudio is not supported...");
    }

    return new AudioContext();
})(window);

},{}],"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/lib/osc.js":[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

module.exports = (function () {
    "use strict";

    var instance = null;
    var ctx = require("./ctx");

    var Osc = (function () {
        function Osc() {
            _classCallCheck(this, Osc);

            if (instance === null) {
                instance = this._initialize.apply(this, arguments);
            }
            return instance;
        }

        _prototypeProperties(Osc, null, {
            _initialize: {
                value: function _initialize() {
                    this._oscNodePool = {};
                    this.masterGain = ctx.createGain();
                    this.masterGain.connect(ctx.destination);
                    return this;
                },
                writable: true,
                configurable: true
            },
            playByNoteNo: {
                value: function playByNoteNo(noteNo) {
                    var freq = _noteNoToFreq(noteNo);
                    var osc = this._oscNodePool[noteNo] = ctx.createOscillator();

                    osc.frequency.value = freq;
                    osc.connect(this.masterGain);
                    osc.start(ctx.currentTime);
                },
                writable: true,
                configurable: true
            },
            stopByNoteNo: {
                value: function stopByNoteNo(noteNo) {
                    var oscNode = this._oscNodePool[noteNo];
                    if (oscNode) {
                        oscNode.stop(0);
                        oscNode.disconnect(0);
                        oscNode = this._oscNodePool[noteNo] = null;
                    }
                },
                writable: true,
                configurable: true
            },
            setMute: {
                value: (function (_setMute) {
                    var _setMuteWrapper = function setMute(_x) {
                        return _setMute.apply(this, arguments);
                    };

                    _setMuteWrapper.toString = function () {
                        return _setMute.toString();
                    };

                    return _setMuteWrapper;
                })(function (setMute) {
                    var val = setMute ? 0 : 1;
                    this.masterGain.gain.value = val;
                }),
                writable: true,
                configurable: true
            },
            destroy: {
                value: function destroy() {
                    for (var noteNo in this._oscNodePool) {
                        this._oscNodePool[noteNo].stop(0);
                        this._oscNodePool[noteNo].disconnect(0);
                        this._oscNodePool[noteNo] = null;
                    }
                },
                writable: true,
                configurable: true
            }
        });

        return Osc;
    })();

    return Osc;

    function _noteNoToFreq(noteNo) {
        return 440 * Math.pow(2, (noteNo - 69) / 12);
    }
})();

},{"./ctx":"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/lib/ctx.js"}],"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/main.js":[function(require,module,exports){
"use strict";

;(function (global) {
    "use strict";

    var KeyboardApp = require("./ui/keyboard");

    global.App = new KeyboardApp();
})(window);

},{"./ui/keyboard":"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/ui/keyboard.js"}],"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/ui/keyboard.js":[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

module.exports = (function (global) {
    "use strict";

    var Osc = require("./../lib/osc");
    var Const = require("./../lib/const");

    var KeyboardApp = (function () {
        function KeyboardApp() {
            _classCallCheck(this, KeyboardApp);

            this._osc = new Osc();
            this._isHolding = false;

            this._buildUI()._bindEvents();

            return this;
        }

        _prototypeProperties(KeyboardApp, null, {
            _buildUI: {
                value: function _buildUI() {
                    this.ui = {
                        keyBoard: $("#js-keyboard"),
                        key: $(".js-key"),
                        muteCtrl: $("#js-mute-ctrl")
                    };

                    return this;
                },
                writable: true,
                configurable: true
            },
            _bindEvents: {
                value: function _bindEvents() {
                    var _this = this;

                    this.ui.key.forEach(function (el) {
                        el.addEventListener("mousedown", _this, false);
                        el.addEventListener("mouseover", _this, false);
                        el.addEventListener("mouseout", _this, false);
                        el.addEventListener("mouseup", _this, false);
                    }, this);

                    // 人間に無理でもMouseならできちまう動きをセーブする
                    this.ui.keyBoard[0].addEventListener("mouseleave", function () {
                        _this._isHolding = false;
                    }, false);

                    this.ui.muteCtrl[0].addEventListener("change", function (ev) {
                        _this._osc.setMute(ev.currentTarget.checked);
                    }, false);

                    return this;
                },
                writable: true,
                configurable: true
            },
            handleEvent: {
                value: function handleEvent(ev) {
                    var keyEl = ev.currentTarget;
                    var noteNo = keyEl.getAttribute("data-noteNo") | 0;

                    switch (ev.type) {
                        case "mousedown":
                            this._isHolding = true;
                            this._osc.playByNoteNo(noteNo);
                            keyEl.classList.add(Const.IS_SELECTED);
                            break;
                        case "mouseup":
                            this._isHolding = false;
                            this._osc.stopByNoteNo(noteNo);
                            keyEl.classList.remove(Const.IS_SELECTED);
                            break;
                        case "mouseover":
                            if (this._isHolding) {
                                this._osc.playByNoteNo(noteNo);
                                keyEl.classList.add(Const.IS_SELECTED);
                            }
                            break;
                        case "mouseout":
                            this._osc.stopByNoteNo(noteNo);
                            keyEl.classList.remove(Const.IS_SELECTED);
                            break;
                    }
                },
                writable: true,
                configurable: true
            }
        });

        return KeyboardApp;
    })();

    return KeyboardApp;

    function $(selector) {
        var parent = arguments[1] === undefined ? global.document : arguments[1];

        var elms = parent.querySelectorAll(selector);
        return [].slice.call(elms);
    }
})(window);

},{"./../lib/const":"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/lib/const.js","./../lib/osc":"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/lib/osc.js"}]},{},["/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/main.js"]);
