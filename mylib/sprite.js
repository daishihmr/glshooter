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

var Sprite;
(function() {

    Sprite = function(texture) {
        this.age = 0;
        this.parent = null;

        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.scaleY = 0;
        this.rotation = 0;

        this.texX = 0;
        this.texY = 0;
        this.texScale = 1;

        this.visible = true;

        this.alpha = 1;
        this.glow = 0;
        this.emission = 0;

        this.texture = texture;

        this.uniforms = {};

        this.update = function() {};
        this.onremoved = function() {};

        this.isEnemy = false;
        this.isBullet = false;
        this.isWeapon = false;
    };

    Sprite.prototype.draw = function(gl) {
        if (!this.visible) return;
        if (this.texture === null) this.texture = Sprite.mainTexture;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        var uni = this.uniforms;
        gl.uniform1f(uni["x"], this.x);
        gl.uniform1f(uni["y"], this.y);
        gl.uniform1f(uni["scale"], this.scale);
        gl.uniform1f(uni["scaleY"], this.scaleY || this.scale);
        gl.uniform1f(uni["rotation"], this.rotation);
        gl.uniform1f(uni["texX"], this.texX);
        gl.uniform1f(uni["texY"], this.texY);
        gl.uniform1f(uni["texScale"], this.texScale);
        gl.uniform1f(uni["alpha"], this.alpha);
        gl.uniform1f(uni["emission"], this.emission);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        if (0 < this.glow) {
            gl.bindTexture(gl.TEXTURE_2D, Sprite.mainTexture);
            gl.uniform1f(uni["texX"], 4);
            gl.uniform1f(uni["texY"], 1);
            gl.uniform1f(uni["texScale"], 1);
            gl.uniform1f(uni["alpha"], this.glow);
            gl.uniform1f(uni["scale"], this.scale*2);
            gl.uniform1f(uni["scaleY"], this.scale*2);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        this.age++;
    };

    Sprite.mainTexture = null;

})();
