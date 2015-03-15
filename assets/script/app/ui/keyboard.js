module.exports = (function(global) {
    'use strict';

    let Osc = require('./../lib/osc');

    class KeyboardApp {
        constructor() {
            this._buildUI()
                ._bindEvents();

            this.osc        = new Osc();
            this._isHolding = false;

            return this;
        }

        _buildUI() {
            this.ui = {
                keyBoard: $('#js-keyboard'),
                key:      $('.js-key'),
                muteCtrl: $('#js-mute-ctrl')
            };

            return this;
        }

        _bindEvents() {
            this.ui.key.forEach(el => {
                el.addEventListener('mousedown', this, false);
                el.addEventListener('mouseover', this, false);
                el.addEventListener('mouseout',  this, false);
                el.addEventListener('mouseup',   this, false);
            }, this);

            // 人間に無理でもMouseならできちまう動きをセーブする
            this.ui.keyBoard[0].addEventListener('mouseleave', () => {
                this._isHolding = false;
            }, false);

            this.ui.muteCtrl[0].addEventListener('change', ev => {
                this.osc.setMute(ev.currentTarget.checked);
            }, false);

            return this;
        }

        handleEvent(ev) {
            let noteNo = ev.currentTarget.getAttribute('data-noteNo')|0;

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
                if (this._isHolding) { this.osc.playByNoteNo(noteNo); }
                break;
            case 'mouseout':
                this.osc.stopByNoteNo(noteNo);
                break;
            }

            console.log('ev: %s / hold ? %s', ev.type, this._isHolding);
        }
    }

    return KeyboardApp;

    function $(selector, parent = global.document) {
        let elms = parent.querySelectorAll(selector);
        return [].slice.call(elms);
    }

}(window));
