module.exports = (function(global) {
    'use strict';

    let Osc     = require('./../lib/osc');
    const Const = require('./../lib/const');

    class KeyboardApp {
        constructor() {
            this._osc        = new Osc();
            this._isHolding = false;

            this._buildUI()
                ._bindEvents();

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
                this._osc.setMute(ev.currentTarget.checked);
            }, false);

            return this;
        }

        handleEvent(ev) {
            let keyEl  = ev.currentTarget;
            let noteNo = keyEl.getAttribute('data-noteNo')|0;

            switch (ev.type) {
            case 'mousedown':
                this._isHolding = true;
                this._osc.playByNoteNo(noteNo);
                keyEl.classList.add(Const.IS_SELECTED);
                break;
            case 'mouseup':
                this._isHolding = false;
                this._osc.stopByNoteNo(noteNo);
                keyEl.classList.remove(Const.IS_SELECTED);
                break;
            case 'mouseover':
                if (this._isHolding) {
                    this._osc.playByNoteNo(noteNo);
                    keyEl.classList.add(Const.IS_SELECTED);
                }
                break;
            case 'mouseout':
                this._osc.stopByNoteNo(noteNo);
                keyEl.classList.remove(Const.IS_SELECTED);
                break;
            }
        }
    }

    return KeyboardApp;

    function $(selector, parent = global.document) {
        let elms = parent.querySelectorAll(selector);
        return [].slice.call(elms);
    }

}(window));
