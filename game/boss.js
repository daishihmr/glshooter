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

var BOSS_HP = [ 8000, 8000, 16000 ];

var createBoss = function(app, attackParam, explosion, stage, texture) {
    var Random = tm.util.Random;
    var WebAudioManager = tm.sound.WebAudioManager;
    var explode = explosion.explode;

    var boss = new glslib.Sprite(texture);
    boss.scaleX = boss.scaleY = (stage < 3) ? 8 : 16;
    boss.texScale = 8;
    boss.alpha = 1.0;
    boss.glow = 0.3;
    boss.maxHp = BOSS_HP[stage - 1];
    boss.damagePoint = 0;
    boss.damage = function(d) {
        this.damagePoint += d;
        var scene = this.parent;
        if (boss.maxHp*0.5 < this.damagePoint) {
            // 第2形態へ
            app.clearAllBullets(true);
            WebAudioManager.get("explode").play();
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            var t = scene.frame + 50;
            this.update = function() {
                this.x += Math.sin(scene.frame*0.3)*0.02;
                if (t < scene.frame && (scene.frame - t) % 5 === 0 && Math.random() < 0.5) {
                    WebAudioManager.get("explode").play();
                    explode(this.x+Random.randfloat(-3, 3), this.y+Random.randfloat(-3, 3), Random.randfloat(0.5, 1));
                }
                if (scene.frame === t+75) {
                    var dx = 0 - this.x;
                    var dy = 8 - this.y;
                    var sf = scene.frame;
                    this.update = function() {
                        this.x += dx / 120;
                        this.y += dy / 120;
                        if (sf + 120 === scene.frame) {
                            this.update = Patterns["boss" + stage + "2"].createTicker(attackParam);
                        }
                    };
                    this.damage = this.damage2;
                }
            };
            this.damage = function() {};
        }
    };
    boss.damage2 = function(d) {
        this.damagePoint += d;
        var scene = this.parent;

        if (boss.maxHp < this.damagePoint) {
            // 撃破
            app.player.disabled = true;
            app.clearAllBullets(true);
            WebAudioManager.get("explode").play();
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            var t = scene.frame + 50;
            var dy = 0 - this.y;
            this.update = function() {
                app.player.disabled = true;
                this.glow += 0.001;
                this.emission += 0.002;
                this.x += Math.sin(scene.frame*0.3)*0.02;
                this.y += dy / (250+60);
                this.scaleX -= 0.005;
                this.scaleY -= 0.005;
                this.rotation -= 0.03;
                if (t < scene.frame && (scene.frame - t) % 5 === 0 && Math.random() < 0.5) {
                    WebAudioManager.get("explode").play();
                    explode(this.x+Random.randfloat(-3, 3), this.y+Random.randfloat(-3, 3), Random.randfloat(0.5, 1));
                }
                if (scene.frame === t + 250) {
                    var explodeL = explosion.getExplodeL(scene);
                    var self = this;
                    explodeL(function() {
                        self.killed();
                    });
                } else if (scene.frame === t + 250+60) {
                    this.update = function() {
                        this.x += Math.sin(scene.frame*0.3)*0.02;
                        this.y += dy / (250+60);
                        this.scaleX -= 0.003;
                        this.scaleY -= 0.003;
                        this.rotation -= 0.03;
                        this.alpha -= 0.01;
                        this.glow -= 0.01;
                        if (this.alpha <= 0) {
                            scene.removeChild(this);
                        }
                    };
                }
            };
            this.damage = function() {};
        }
    }

    return boss;
};
