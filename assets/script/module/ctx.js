module.exports = (function(global) {
    'use strict';

    let AudioContext = null;
    try {
        AudioContext = global.AudioContext       ||
                       global.webkitAudioContext ||
                       global.mozAudioContext    ||
                       global.oAudioContext      ||
                       global.msAudioContext;
    } catch(e) {
        throw new Error('WebAudio is not supported...');
    }

    return AudioContext;
}(window));
