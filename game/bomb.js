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

var Bomb = {};
Bomb.createBomber = function(scene, bombParticlePool, texture) {
    var createBombParticle = function() {
        var p = new glslib.Sprite(texture);
        p.npr = true;
        p.centerX = 0;
        p.centerY = 0;
        p.texX = 4;
        p.texY = 1;
        p.radius = 0;
        p.radiusD = -0.01;
        p.angle = 0;
        p.size = 0.6;
        p.update = function() {
            this.x = this.centerX + Math.cos(this.angle) * this.radius;
            this.y = this.centerY + Math.sin(this.angle) * this.radius;
            this.angle += 0.03;
            this.radius += this.radiusD;
            this.radiusD -= 0.002;
            this.scale = (17 - this.radius) * this.size;
            this.alpha += (0 < this.radius) ? 0 : -0.01;
            if (this.alpha < 0.1) {
                scene.removeChild(this);
                bombParticlePool.readyCount+=1;
            }
        };
        return p;
    }
    for (var i = 0; i < 50; i++) {
        bombParticlePool.push(createBombParticle());
    }
    bombParticlePool.readyCount = bombParticlePool.length;

    return {
        normal: function(x, y) {
            bombParticlePool.readyCount = 0;
            for (var i = bombParticlePool.length; i--; ) {
                var p = bombParticlePool[i];
                p.centerX = x;
                p.centerY = y;
                p.radius = tm.util.Random.randfloat(16, 22);
                p.angle = (Math.PI*2/12) * (i%12);
                p.radiusD = -0.01;
                p.alpha = 1;
                p.size = 0.6;
                scene.addChild(p);
            }
            MUTE_SE || tm.sound.WebAudioManager.get("bomb").play();
        },
        mini: function(x, y) {
            bombParticlePool.readyCount = 0;
            for (var i = bombParticlePool.length; i--; ) {
                var p = bombParticlePool[i];
                p.centerX = x;
                p.centerY = y;
                p.radius = tm.util.Random.randfloat(6, 12);
                p.angle = (Math.PI*2/12) * (i%12);
                p.radiusD = -0.16;
                p.alpha = 0.3;
                p.size = 0.3;
                scene.addChild(p);
            }
            MUTE_SE || tm.sound.WebAudioManager.get("explode").play();
        }
    };
};
Bomb.clearBomb = function(scene, bombParticlePool) {
    for (var i = bombParticlePool.length; i--; ) {
        scene.removeChild(bombParticlePool[i]);
    }
    bombParticlePool.readyCount = bombParticlePool.length;
};