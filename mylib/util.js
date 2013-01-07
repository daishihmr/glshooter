function fitWindow(domElement) {
    domElement.style.position = "absolute";
    domElement.style.top = 0;
    domElement.style.left = 0;
    if (window.innerHeight < window.innerWidth) {
        domElement.width = window.innerHeight;
        domElement.height = window.innerHeight;
    } else {
        domElement.width = window.innerWidth;
        domElement.height = window.innerWidth;
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
