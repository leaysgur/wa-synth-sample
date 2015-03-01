module.exports = (function() {
    'use strict';

    var instance = null;
    var Osc = function() {
        if (instance === null) {
            instance = this._initialize.apply(this, arguments);
        }
        return instance;
    };
    Osc.prototype = {
        constructor:  Osc,
        _initialize:  initialize,
        playByNoteNo: playByNoteNo,
        stopByNoteNo: stopByNoteNo,
        setMute:      setMute,
        destroy:      destroy
    };

    function initialize(args) {
        var Ctx = global.AudioContext || global.webkitAudioContext;
        this._oscNodePool = {};
        this.ctx = new Ctx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        return this;
    }

    function playByNoteNo(noteNo) {
        var freq = _noteNoToFreq(noteNo);
        var osc = this._oscNodePool[noteNo] = this.ctx.createOscillator();

        osc.frequency.value = freq;
        osc.connect(this.masterGain);
        osc.start(this.ctx.currentTime);
    }

    function stopByNoteNo(noteNo) {
        var oscNode = this._oscNodePool[noteNo];
        if (oscNode) {
            this._oscNodePool[noteNo].stop(0);
            this._oscNodePool[noteNo].disconnect(0);
            oscNode = this._oscNodePool[noteNo] = null;
        }
    }

    function setMute(setMute) {
        var val = (setMute) ? 0 : 1;
        this.masterGain.gain.value = val;
    }

    function destroy() {
        for (var noteNo in this._oscNodePool) {
            this._oscNodePool[noteNo].stop(0);
            this._oscNodePool[noteNo].disconnect(0);
            this._oscNodePool[noteNo] = null;
        }
    }

    return Osc;

    function _noteNoToFreq(noteNo) {
        return 440.0 * Math.pow(2.0, (noteNo - 69.0) / 12.0);
    }
}());
