/**
 * @author daishihmr
 * @version 1.0
 *
 * The MIT License (MIT)
 * Copyright (c) 2012 dev7.jp
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

(function() {

var context = null;
if (tm.global.webkitAudioContext) {
    context = new webkitAudioContext();
} else if (tm.global.mozAudioContext) {
    context = new mozAudioContext();
} else if (tm.global.AudioContext) {
    context = new AudioContext();
}

tm.sound.WebAudio = tm.createClass({
    loaded: false,
    context: null,
    buffer: null,
    volume: 1.0,
    bufferSourcePool: [],
    init: function(src) {
        this.context = context;
        this._pool(10);
        if (src) {
            this._load(src);
        }
    },
    play: function() {
        var src = this.bufferSourcePool.pop();
        if (!src) {
            this._pool(10);
            src = this.bufferSourcePool.pop();
        }
        src.buffer = this.buffer;
        this.gainNode = this.context.createGain();

        src.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);

        this.gainNode.gain.value = this.volume;
        src.start(0);
    },
    clone: function() {
        var c = tm.sound.WebAudio();
        c.loaded = true;
        c.buffer = this.buffer;
        c.volume = this.volume;
        return c;
    },
    _load: function(src) {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    self.context.decodeAudioData(xhr.response, function(buffer) {
                        self.buffer = buffer;
                    });
                    self.loaded = true;
                } else {
                    self._error();
                }
            }
        };
        xhr.open("GET", src, true);
        xhr.responseType = "arraybuffer";
        xhr.send();
    },
    _pool: function(size) {
        for (var i = 0; i < size; i++) {
            var src = this.context.createBufferSource();
            this.bufferSourcePool.push(src);
        }
    },
    _error: function(xhr) {
        console.error(xhr);
    }
});

tm.sound.WebAudioManager = {
    sounds: {}
};

tm.sound.WebAudioManager.add = function(name, src) {
    this.sounds[name] = tm.sound.WebAudio(src);
    return this;
};

tm.sound.WebAudioManager.get = function(name) {
    return this.sounds[name];
};

tm.sound.WebAudioManager.isLoaded = function() {
    for (var key in this.sounds) {
        if (this.sounds[key].loaded === false) {
            return false;
        }
    }
    return true;
};

tm.addLoadCheckList(tm.sound.WebAudioManager);

})();
