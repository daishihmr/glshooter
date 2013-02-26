/**
 * @author daishihmr
 * @version 1.5
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

var setupPlayer = function(app, scene, weapons, mouse, texture) {
    var player = new glslib.Sprite(texture);
    player._draw = function(canvas, ctx) {
        if (this.visible) {
            var bkup = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = "source-over";

            var x = (this.x + 16) * ctx.scale;
            var y = (24 - this.y) * ctx.scale;
            var w = 2 * this.scaleX * ctx.scale;
            var h = 2 * this.scaleY * ctx.scale;

            if (this.texture != null) {
                ctx.save();
                ctx.globalAlpha = 1;
                ctx.translate(x, y);
                ctx.rotate(this.rotation*Math.DEG_TO_RAD);
                ctx.drawImage(this.texture,
                    this.texX*64, this.texY*64, 64*this.texScale, 64*this.texScale,
                    -w*0.5, -h*0.5, w, h);

                if (this.glow > 0) {
                    w *= 2;
                    h *= 2;
                    ctx.globalAlpha = this.glow * 0.5;
                    ctx.globalCompositeOperation = "lighter";
                    ctx.drawImage(glslib.Sprite.glowTexture, -w*0.5, -h*0.5, w, h);
                }
                ctx.restore();
            }

            ctx.globalCompositeOperation = bkup;
        }
    };
    
    player.scaleX = player.scaleY = PLAYER_SCALE;
    player.level = 1;
    player.reset = function() {
        this.x = 0;
        this.y = -16;
        this.texX = 3;
        this.glow = 0;
        this.roll = 0;
        this.speed = PLAYER_SPEED;
        this.rebirth = false;
        this.power = 1;
        this.muteki = false;
    };

    var kb = app.keyboard;
    var reactFrame = 0;
    player.update = function() {
        var lv = this.level;

        if (this.disabled || this.muteki) {
            this.visible = (~~(scene.frame/2)) % 2 === 0;
        } else {
            this.visible = true;
        }

        if (this.rebirth) {
            this.y += 0.1;
            if (-16 < this.y) {
                this.rebirth = false;
                this.disabled = false;
                this.visible = true;
                reactFrame = scene.frame;
            }
        }

        this.muteki = (scene.frame < reactFrame + MUTEKI_TIME);

        var zpos = 0.25 * (1-Math.abs(this.roll/3)) + 0.08;
        for (var i = 0; i < 2; i++) {
            var z = zanzoPool.pop();
            if (z) {
                z.x = this.x + Math.random()*0.1-0.05 - zpos;
                z.y = this.y - 1.0;
                z.alpha = 0.8;
                z.scaleX = z.scaleY = 0.8;
                scene.addChild(z);
            }
            z = zanzoPool.pop();
            if (z) {
                z.x = this.x + Math.random()*0.1-0.05 + zpos;
                z.y = this.y - 1.0;
                z.alpha = 0.8;
                z.scaleX = z.scaleY = 0.8;
                scene.addChild(z);
            }
        }


        var beforeRoll = this.roll;

        if (!this.disabled) {
            // キーボード操作
            var xPress = kb.getKey("x") || 
                (!kb.getKey("left") && !kb.getKey("right") && !kb.getKey("up") && !kb.getKey("down"));
            if (xPress) {
                this.speed = PLAYER_SPEED*0.5;
            } else {
                this.speed = PLAYER_SPEED;
            }
            if (kb.getKey("left")) {
                this.x -= this.speed;
                this.roll -= 0.2;
            } else if (kb.getKey("right")) {
                this.x += this.speed;
                this.roll += 0.2;
            }

            if (kb.getKey("down")) {
                this.y -= this.speed;
            } else if (kb.getKey("up")) {
                this.y += this.speed;
            }

            // マウス操作
            if (mouse.getPointing()) {
                xPress = false;
                var deltaX = mouse.deltaPosition.x;
                this.x += deltaX * 0.1;
                this.y += mouse.deltaPosition.y * -0.1;
                if (deltaX < 0) {
                    this.roll -= 0.5;
                } else if (0 < deltaX) {
                    this.roll += 0.5;
                }
            }

            if (this.x < -16) this.x = -16;
            if (16 < this.x) this.x = 16;
            if (this.y < -24) this.y = -24;
            if (24 < this.y) this.y = 24;
        }

        if (beforeRoll === this.roll) {
            this.roll *= 0.95;
        }

        if (this.roll < -3) this.roll =  -3;
        else if (3 < this.roll) this.roll = 3;
        this.texX = 3 + ~~(this.roll);

        if (!this.disabled && scene.frame % 3 === 0 && !kb.getKey("c")) {
            if (xPress) {
                fireWeapon(-0.05, 1.8, 0);
                fireWeapon( 0.00, 1.2, 0);
                fireWeapon( 0.05, 1.8, 0);
            }

            var sin = Math.sin(scene.frame*0.1);
            fireWeapon(-sin*0.75, 1.4, 0);
            fireWeapon(-sin*0.5, 1.4, 0);
            fireWeapon(+sin*0.5, 1.4, 0);
            fireWeapon(+sin*0.75, 1.4, 0);

            var sideBit = xPress ? 0 : 1;
            var angle = xPress ? 0 : 4;
            if (scene.frame % 6 === 0) {
                (lv < 2) || fireWeapon(+(sideBit + 1.2), 0, angle*+2.1);
                (lv < 1) || fireWeapon(+(sideBit + 0.8), 0, angle*+1.4);
                            fireWeapon(+(sideBit + 0.4), 0, angle*+0.7);
                            fireWeapon(-(sideBit + 0.4), 0, angle*-0.7);
                (lv < 1) || fireWeapon(-(sideBit + 0.8), 0, angle*-1.4);
                (lv < 2) || fireWeapon(-(sideBit + 1.2), 0, angle*-2.1);
            }
        }
    };
    player.damage = function() {
        this.miss();
    };
    player.miss = function() {
        app.missCount += 1;
        app.explode(this.x, this.y, 2);
        playSound("explode");

        app.zanki -= 1;
        if (app.zanki === 0) {
            scene.removeChild(this);
            this.visible = false;
            this.rebirth = false;
            app.confirmContinue();
            return;
        }

        return player.launch();
    };
    player.launch = function() {
        app.bomb = Math.max(3, app.bomb);
        if (this.level !== 2) this.level += 1;
        this.x = 0;
        this.y = -25;
        this.visible = true;
        this.disabled = true;
        this.rebirth = true;
        this.muteki = true;
        this.roll = 0;
        this.texX = 3;
    };
    scene.addChild(player);

    var centerMarker = new glslib.Sprite(texture);
    centerMarker.x = player.x;
    centerMarker.y = player.y;
    centerMarker.texX = 2; centerMarker.texY = 1;
    centerMarker.scaleX = centerMarker.scaleY = 0.5;
    centerMarker.update = function() {
        this.x = player.x;
        this.y = player.y;
        this.visible = player.visible && player.parent !== null;
        this.scaleX = this.scaleY = 0.3 + Math.sin(scene.frame * 0.2) * 0.2;
    };
    scene.addChild(centerMarker);

    var zanzos = [];
    var zanzoPool = [];
    for (var i = 0; i < 200; i++) {
        var z = new glslib.Sprite(texture);
        z.texX = 4;
        z.texY = 1;
        z.update = function() {
            this.y -= 0.15;
            this.scaleX -= 0.06;
            this.scaleY -= 0.06;
            this.alpha -= 0.06;
            if (this.scaleX < 0) {
                scene.removeChild(this);
                zanzoPool.push(this);
            }
        };
        zanzos.push(z);
        zanzoPool.push(z);
    }

    var weaponPool = [];
    for (var i = 0; i < 400; i++) {
        var w = new glslib.Sprite(texture);
        w.scaleX = w.scaleY = WEAPON_SCALE;
        w.isWeapon = true;
        w.texX = 7;
        w.texY = 1;
        w.power = 0;
        weapons.push(w);
        weaponPool.push(w);
        w.onremoved = function() {
            weaponPool.push(this);
        };
    }
    var fireWeapon = function(x, y, dir) {
        var w = weaponPool.pop();
        if (w === undefined) return;
        w.rotation = dir;
        var s = Math.sin((90 - dir)*Math.DEG_TO_RAD);
        var c = Math.cos((90 - dir)*Math.DEG_TO_RAD);
        w.update = function() {
            this.x += c * 1.3;
            this.y += s * 1.3;
            if (this.x < -16.2 || 16.2 < this.x || this.y < -24.2 || 24.2 < this.y) {
                scene.removeChild(this);
            }
        };
        w.x = player.x + x;
        w.y = player.y + y;
        w.power = player.power;
        scene.addChild(w);
    };
    player.clearAll = function() {
        for (var i = zanzos.length; i--; ) {
            zanzos[i].alpha = 0;
        }
        for (var i = weapons.length; i--; ) {
            weapons[i].y = 100;
        }
    };

    return player;
}
