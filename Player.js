var setupPlayer = function(app, gl, scene, weapons, mouse) {
    var player = new Sprite(gl, Sprite.mainTexture);
    player.scale = 1.5;

    var kb = app.keyboard;
    player.update = function() {
        if (this.disabled) {
            this.alpha = 0.5;
        } else {
            this.alpha = 1.0;
        }

        if (this.rebirth) {
            this.y += 0.1;
            if (-10 < this.y) {
                this.rebirth = false;
                this.disabled = false;
                this.visible = true;
                app.isBulletDisable = false;
            }
        }

        for (var i = 0; i < 3; i++) {
            var z = zanzoPool.pop();
            if (z) {
                z.x = this.x + Math.random()*0.4-0.2 - 0.5;
                z.y = this.y - 1.2;
                z.alpha = 0.8;
                z.scale = 0.6;
                scene.add(z);
            }
            z = zanzoPool.pop();
            if (z) {
                z.x = this.x + Math.random()*0.4-0.2 + 0.5;
                z.y = this.y - 1.2;
                z.alpha = 0.8;
                z.scale = 0.6;
                scene.add(z);
            }
        }


        var beforeRoll = this.roll;

        if (!this.disabled) {
            // キーボード操作
            var xPress = kb.getKey("x");
            if (xPress) {
                this.speed = 0.1;
            } else {
                this.speed = 0.2;
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
                var deltaX = mouse.deltaPosition.x;
                this.x += deltaX * 0.1;
                this.y += mouse.deltaPosition.y * -0.1;
                if (deltaX < 0) {
                    this.roll -= 0.5;
                } else if (0 < deltaX) {
                    this.roll += 0.5;
                }
            }
        }

        if (beforeRoll === this.roll) {
            this.roll *= 0.95;
        }

        if (this.x < -16) this.x = -16;
        if (16 < this.x) this.x = 16;
        if (this.y < -16) this.y = -16;
        if (16 < this.y) this.y = 16;

        if (this.roll < -3) this.roll =  -3;
        else if (3 < this.roll) this.roll = 3;
        this.texX = 3 + ~~(this.roll);

        if (!this.disabled && scene.frame % 3 === 0) {
            if (xPress) {
                (this.level < 2) || fireWeapon(-0.25, 1.4, 0);
                (this.level < 1) || fireWeapon(-0.20, 1.5, 0);
                fireWeapon(-0.15, 1.6, 0);
                fireWeapon(-0.10, 1.7, 0);
                fireWeapon(-0.05, 1.8, 0);
                fireWeapon( 0.00, 1.9, 0);
                fireWeapon( 0.05, 1.8, 0);
                fireWeapon( 0.10, 1.7, 0);
                fireWeapon( 0.15, 1.6, 0);
                (this.level < 1) || fireWeapon( 0.20, 1.5, 0);
                (this.level < 2) || fireWeapon( 0.25, 1.4, 0);
            }
            fireWeapon(+Math.sin(scene.frame*0.1)*0.25, 1.4, 0);
            fireWeapon(-Math.sin(scene.frame*0.1)*0.25, 1.4, 0);
            (this.level < 1) || fireWeapon(+Math.sin(scene.frame*0.1)*0.5, 1.4, 0);
            (this.level < 1) || fireWeapon(-Math.sin(scene.frame*0.1)*0.5, 1.4, 0);
            (this.level < 2) || fireWeapon(+Math.sin(scene.frame*0.1)*0.75, 1.4, 0);
            (this.level < 2) || fireWeapon(-Math.sin(scene.frame*0.1)*0.75, 1.4, 0);

            var a = xPress ? 0 : 4;
            (this.level < 2) || fireWeapon(+1.5, 0, a*+3);
            (this.level < 1) || fireWeapon(+1.0, 0, a*+2);
            fireWeapon(+0.5, 0, a*+1);
            fireWeapon(-0.5, 0, a*-1);
            (this.level < 1) || fireWeapon(-1.0, 0, a*-2);
            (this.level < 2) || fireWeapon(-1.5, 0, a*-3);

            if (xPress) this.power = 0.6;
            else this.power = 1;
        }
    };
    player.damage = function() {
        this.miss();
    };
    player.miss = function() {
        app.explode(this.x, this.y, 2);
        var sound = tm.sound.SoundManager.get("explode");
        if (sound !== void 0) MUTE_SE || sound.play();

        app.zanki -= 1;
        if (app.zanki === 0) {
            this.visible = false;
            this.rebirth = false;
            scene.remove(this);
            app.gameover();
            return;
        }

        app.bomb = 3;
        if (this.level !== 2) this.level += 1;
        this.x = 0;
        this.y = -17;
        this.disabled = true;
        this.rebirth = true;
        this.roll = 0;
        this.texX = 3;
        app.isBulletDisable = true;
    };
    scene.add(player);

    var centerMarker = new Sprite(gl, textures["texture0"]);
    centerMarker.x = player.x;
    centerMarker.y = player.y;
    centerMarker.texX = 2; centerMarker.texY = 1;
    centerMarker.scale = 0.5;
    centerMarker.update = function() {
        this.x = player.x;
        this.y = player.y;
        this.visible = player.visible;
        this.scale = 0.3 + Math.sin(scene.frame * 0.2) * 0.2;
    };
    scene.add(centerMarker);

    var zanzos = [];
    var zanzoPool = [];
    for (var i = 0; i < 200; i++) {
        var z = new Sprite(gl, textures["texture0"]);
        z.texX = 4;
        z.texY = 1;
        z.update = function() {
            this.y -= 0.3;
            this.scale -= 0.08;
            this.visible = player.visible;
            this.alpha -= 0.08;
            if (this.alpha < 0) {
                scene.remove(this);
            }
        };
        z.onremoved = function() {
            zanzoPool.push(this);
        };
        zanzos.push(z);
        zanzoPool.push(z);
    }

    var weaponPool = [];
    for (var i = 0; i < 400; i++) {
        var w = new Sprite(gl, textures["texture0"]);
        w.texX = 7;
        w.texY = 1;
        weapons.push(w);
        weaponPool.push(w);
        w.onremoved = function() {
            weaponPool.push(this);
        };
    }
    var fireWeapon = function(x, y, dir) {
        var w = weaponPool.pop();
        if (w === void 0) return;
        w.rotation = dir;
        var s = Math.sin((90 - dir)*Math.DEG_TO_RAD);
        var c = Math.cos((90 - dir)*Math.DEG_TO_RAD);
        w.update = function() {
            this.x += c * 1.3;
            this.y += s * 1.3;
            if (this.x < -16.2 || 16.2 < this.x || this.y < -16.2 || 16.2 < this.y) {
                scene.remove(this);
            }
        };
        w.x = player.x + x;
        w.y = player.y + y;
        scene.add(w);
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
