// Ctxも切り出す
// browserify script/app/main.js -o script/app.js
;(function(global) {
    'use strict';

    var Osc = require('./../module/osc');

    var KeyboardApp = function() {
        return this._initialize.apply(this, arguments);
    };
    KeyboardApp.prototype = {
        constructor: KeyboardApp,
        _initialize: initialize,
        _buildUI:    buildUI,
        _bindEvents: bindEvents,
        handleEvent: handleEvent
    };

    function initialize(args) {
        this._buildUI()
            ._bindEvents();

        this.osc = new Osc();
        this._isHolding  = false;

        return this;
    }

    function buildUI() {
        this.ui = {
            keyBoard: $('#js-keyboard'),
            key:      $('.js-key'),
            muteCtrl: $('#js-mute-ctrl')
        };

        return this;
    }

    function bindEvents() {
        var that = this;

        this.ui.key.forEach(function(el) {
            el.addEventListener('mousedown', this, false);
            el.addEventListener('mouseover', this, false);
            el.addEventListener('mouseout',  this, false);
            el.addEventListener('mouseup',   this, false);
        }, this);

        // 人間に無理でもMouseならできちまう動きをセーブする
        this.ui.keyBoard[0].addEventListener('mouseleave', function() {
            that._isHolding = false;
        }, false);

        this.ui.muteCtrl[0].addEventListener('change', function(ev) {
            that.osc.setMute(ev.currentTarget.checked);
        }, false);

        return this;
    }

    function handleEvent(ev) {
        var noteNo = ev.currentTarget.getAttribute('data-noteNo')|0;

        switch (ev.type) {
        case 'mousedown':
            this._isHolding = true;
            this.osc.playByNoteNo(noteNo);
            break;
        case 'mouseup':
            this._isHolding = false;
            this.osc.stopByNoteNo(noteNo);
            break;
        case 'mouseover':
            this._isHolding && this.osc.playByNoteNo(noteNo);
            break;
        case 'mouseout':
            this.osc.stopByNoteNo(noteNo);
            break;
        }

        console.log('ev: %s / hold ? %s', ev.type, this._isHolding);
    }

    global.App = new KeyboardApp();

    function $(selector) {
        var elms = global.document.querySelectorAll(selector);
        return [].slice.call(elms);
    }

}(window));
