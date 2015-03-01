module.exports = (function() {
    'use strict';

    let instance = null;
    let Ctx = require('./ctx');

    class Osc {
        constructor() {
            if (instance === null) {
                instance = this._initialize.apply(this, arguments);
            }
            return instance;
        }

        _initialize() {
            this._oscNodePool = {};
            this.ctx = new Ctx();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            return this;
        }

        playByNoteNo(noteNo) {
            let freq = _noteNoToFreq(noteNo);
            let osc = this._oscNodePool[noteNo] = this.ctx.createOscillator();

            osc.frequency.value = freq;
            osc.connect(this.masterGain);
            osc.start(this.ctx.currentTime);
        }

        stopByNoteNo(noteNo) {
            let oscNode = this._oscNodePool[noteNo];
            if (oscNode) {
                oscNode.stop(0);
                oscNode.disconnect(0);
                oscNode = this._oscNodePool[noteNo] = null;
            }
        }

        setMute(setMute) {
            let val = (setMute) ? 0 : 1;
            this.masterGain.gain.value = val;
        }

        destroy() {
            for (let noteNo in this._oscNodePool) {
                this._oscNodePool[noteNo].stop(0);
                this._oscNodePool[noteNo].disconnect(0);
                this._oscNodePool[noteNo] = null;
            }
        }
    }

    return Osc;

    function _noteNoToFreq(noteNo) {
        return 440.0 * Math.pow(2.0, (noteNo - 69.0) / 12.0);
    }
}());
