(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/main.js":[function(require,module,exports){
"use strict";

// Ctxも切り出す
;(function (global) {
    "use strict";

    var Osc = require("./../module/osc");

    var KeyboardApp = function KeyboardApp() {
        return this._initialize.apply(this, arguments);
    };
    KeyboardApp.prototype = {
        constructor: KeyboardApp,
        _initialize: initialize,
        _buildUI: buildUI,
        _bindEvents: bindEvents,
        handleEvent: handleEvent
    };

    function initialize() {
        this._buildUI()._bindEvents();

        this.osc = new Osc();
        this._isHolding = false;

        return this;
    }

    function buildUI() {
        this.ui = {
            keyBoard: $("#js-keyboard"),
            key: $(".js-key"),
            muteCtrl: $("#js-mute-ctrl")
        };

        return this;
    }

    function bindEvents() {
        var that = this;

        this.ui.key.forEach(function (el) {
            el.addEventListener("mousedown", this, false);
            el.addEventListener("mouseover", this, false);
            el.addEventListener("mouseout", this, false);
            el.addEventListener("mouseup", this, false);
        }, this);

        // 人間に無理でもMouseならできちまう動きをセーブする
        this.ui.keyBoard[0].addEventListener("mouseleave", function () {
            that._isHolding = false;
        }, false);

        this.ui.muteCtrl[0].addEventListener("change", function (ev) {
            that.osc.setMute(ev.currentTarget.checked);
        }, false);

        return this;
    }

    function handleEvent(ev) {
        var noteNo = ev.currentTarget.getAttribute("data-noteNo") | 0;

        switch (ev.type) {
            case "mousedown":
                this._isHolding = true;
                this.osc.playByNoteNo(noteNo);
                break;
            case "mouseup":
                this._isHolding = false;
                this.osc.stopByNoteNo(noteNo);
                break;
            case "mouseover":
                if (this._isHolding) {
                    this.osc.playByNoteNo(noteNo);
                }
                break;
            case "mouseout":
                this.osc.stopByNoteNo(noteNo);
                break;
        }

        console.log("ev: %s / hold ? %s", ev.type, this._isHolding);
    }

    global.App = new KeyboardApp();

    function $(selector) {
        var elms = global.document.querySelectorAll(selector);
        return [].slice.call(elms);
    }
})(window);

},{"./../module/osc":"/Users/Yuji/Desktop/wa-synth-sample/assets/script/module/osc.js"}],"/Users/Yuji/Desktop/wa-synth-sample/assets/script/module/osc.js":[function(require,module,exports){
(function (global){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

module.exports = (function () {
    "use strict";

    var instance = null;

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
                    var Ctx = global.AudioContext || global.webkitAudioContext;
                    this._oscNodePool = {};
                    this.ctx = new Ctx();
                    this.masterGain = this.ctx.createGain();
                    this.masterGain.connect(this.ctx.destination);
                    return this;
                },
                writable: true,
                configurable: true
            },
            playByNoteNo: {
                value: function playByNoteNo(noteNo) {
                    var freq = _noteNoToFreq(noteNo);
                    var osc = this._oscNodePool[noteNo] = this.ctx.createOscillator();

                    osc.frequency.value = freq;
                    osc.connect(this.masterGain);
                    osc.start(this.ctx.currentTime);
                },
                writable: true,
                configurable: true
            },
            stopByNoteNo: {
                value: function stopByNoteNo(noteNo) {
                    var oscNode = this._oscNodePool[noteNo];
                    if (oscNode) {
                        this._oscNodePool[noteNo].stop(0);
                        this._oscNodePool[noteNo].disconnect(0);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},["/Users/Yuji/Desktop/wa-synth-sample/assets/script/app/main.js"]);
