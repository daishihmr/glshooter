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
