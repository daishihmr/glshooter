function loadScript(name, url) {
    var result = {
        loaded: false,
        isLoaded: function() {
            return this.loaded;
        }
    };
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                scripts[name] = xhr.responseText;
                result.loaded = true;
            }
        }
    };
    xhr.open("GET", url);
    xhr.send(null);
    return result;
}

function loadTexture(name, url) {
    var image = new Image();
    image.src = url;
    var result = {
        loaded: false,
        isLoaded: function() {
            return this.loaded;
        }
    };
    image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);
        images[name] = new Image();
        images[name].src = canvas.toDataURL();
        images[name].onload = function() {
            result.loaded = true;
        };

    };
    return result;
}

function fitWindow(canvas) {
    if (window.innerHeight < window.innerWidth) {
        canvas.width = window.innerHeight;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth;
    }
}

function createTexture(gl, image) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
}
