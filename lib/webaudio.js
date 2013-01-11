tm.sound.WebAudio = tm.createClass({
    loaded: false,
    context: null,
    buffer: null,
    volume: 1.0,
    bufferSourcePool: [],
    init: function(src) {
        this.context = tm.sound.WebAudioManager.context;
        this._pool(10);
        this._load(src);
    },
    play: function() {
        var src = this.bufferSourcePool.pop();
        if (!src) {
            this._pool(10);
            src = this.bufferSourcePool.pop();
        }
        src.buffer = this.buffer;
        src.gain.value = this.volume;
        src.noteOn(0);
        console.log("pool size = " + this.bufferSourcePool.length);
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
            src.volume = this.context.createGainNode();
            src.connect(src.volume);
            src.volume.connect(this.context.destination);
            this.bufferSourcePool.push(src);
        }
    },
    _error: function(xhr) {
        console.error(xhr);
    }
});

tm.sound.WebAudioManager = {
    context: webkitAudioContext ? new webkitAudioContext() : null,
    sounds: {}
};

tm.sound.WebAudioManager.add = function(name, src) {
    this.sounds[name] = tm.sound.WebAudio(src);
    return this;
};

tm.sound.WebAudioManager.get = function(name) {
    if (this.context === null) {
        return {
            play: function() {}
        }
    }
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
