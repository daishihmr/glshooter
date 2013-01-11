// 通常ショットと収束ショットとマウス・キーボード操作
//  -> 通常ショットは広範囲に弾をばらまく
//  -> 収束ショットは自機正面に低威力の弾をたくさん撃つ
//  -> GLOWは敵に弾がヒットすることによって上昇するため、収束ショットの方が有利になる
//  -> マウス操作の場合、回避に圧倒的なアドバンテージがある分、収束ショットを撃つことができないデメリットがある

var setupPlayer = function(app, scene, weapons, mouse, texture) {
    var player = new Sprite(texture);
    player.scale = PLAYER_SCALE;
    player.level = 0;
    player.reset = function() {
        this.x = 0;
        this.y = -10;
        this.texX = 3;
        this.glow = 0;
        this.roll = 0;
        this.speed = PLAYER_SPEED;
        this.rebirth = false;
        this.disabled = false;
        this.power = 1;
        this.muteki = false;
    };

    var kb = app.keyboard;
    var reactFrame = 0;
    player.update = function() {
        if (this.disabled || this.muteki) {
            this.visible = (~~(scene.frame/2)) % 2 === 0;
        } else {
            this.visible = true;
        }

        if (this.rebirth) {
            this.y += 0.1;
            if (-10 < this.y) {
                this.rebirth = false;
                this.disabled = false;
                this.visible = true;
                reactFrame = scene.frame;
            }
        }

        this.muteki = (scene.frame < reactFrame + MUTEKI_TIME);

        var zpos = 0.25 * (1-Math.abs(this.roll/3)) + 0.20;
        var firePower = (this.rebirth) ? 8 : 2;
        for (var i = 0; i < firePower; i++) {
            var z = zanzoPool.pop();
            if (z) {
                z.x = this.x + Math.random()*0.1-0.05 - zpos;
                z.y = this.y - 1.2;
                z.alpha = 0.8;
                z.scale = 0.6;
                scene.add(z);
            }
            z = zanzoPool.pop();
            if (z) {
                z.x = this.x + Math.random()*0.1-0.05 + zpos;
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
            if (this.y < -16) this.y = -16;
            if (16 < this.y) this.y = 16;
        }

        if (beforeRoll === this.roll) {
            this.roll *= 0.95;
        }

        if (this.roll < -3) this.roll =  -3;
        else if (3 < this.roll) this.roll = 3;
        this.texX = 3 + ~~(this.roll);

        this.power = xPress ? 0.6 : 1;
        if (!this.disabled && scene.frame % 3 === 0 && !kb.getKey("c")) {
            if (xPress) {
                (this.level < 2) || fireWeapon(-0.19, 1.2, 0);
                (this.level < 2) || fireWeapon(-0.18, 1.3, 0);
                (this.level < 1) || fireWeapon(-0.17, 1.4, 0);
                (this.level < 1) || fireWeapon(-0.16, 1.5, 0);
                fireWeapon(-0.15, 1.6, 0);
                fireWeapon(-0.10, 1.7, 0);
                fireWeapon(-0.05, 1.8, 0);
                fireWeapon( 0.00, 1.9, 0);
                fireWeapon( 0.05, 1.8, 0);
                fireWeapon( 0.10, 1.7, 0);
                fireWeapon( 0.15, 1.6, 0);
                (this.level < 1) || fireWeapon( 0.16, 1.5, 0);
                (this.level < 1) || fireWeapon( 0.17, 1.4, 0);
                (this.level < 2) || fireWeapon( 0.18, 1.3, 0);
                (this.level < 2) || fireWeapon( 0.19, 1.2, 0);
            }

            (this.level < 2) || fireWeapon(-Math.sin(scene.frame*0.1)*0.75, 1.4, 0);
            (this.level < 1) || fireWeapon(-Math.sin(scene.frame*0.1)*0.5, 1.4, 0);
            fireWeapon(+Math.sin(scene.frame*0.1)*0.25, 1.4, 0);
            fireWeapon(-Math.sin(scene.frame*0.1)*0.25, 1.4, 0);
            (this.level < 1) || fireWeapon(+Math.sin(scene.frame*0.1)*0.5, 1.4, 0);
            (this.level < 2) || fireWeapon(+Math.sin(scene.frame*0.1)*0.75, 1.4, 0);

            var angle = xPress ? 0 : 4;
            (this.level < 1) || fireWeapon(+1.5, 0, angle*+3);
            fireWeapon(+1.0, 0, angle*+2);
            (this.level < 2) || fireWeapon(+0.5, 0, angle*+1);
            (this.level < 2) || fireWeapon(-0.5, 0, angle*-1);
            fireWeapon(-1.0, 0, angle*-2);
            (this.level < 1) || fireWeapon(-1.5, 0, angle*-3);
        }
    };
    player.damage = function() {
        this.miss();
    };
    player.miss = function() {
        app.explode(this.x, this.y, 2);
        var sound = tm.sound.WebAudioManager.get("explode");
        if (sound !== void 0) MUTE_SE || sound.play();

        app.zanki -= 1;
        if (app.zanki === 0) {
            scene.remove(this);
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
        this.y = -17;
        this.visible = true;
        this.disabled = true;
        this.rebirth = true;
        this.muteki = true;
        this.roll = 0;
        this.texX = 3;
    };
    scene.add(player);

    var centerMarker = new Sprite(texture);
    centerMarker.x = player.x;
    centerMarker.y = player.y;
    centerMarker.texX = 2; centerMarker.texY = 1;
    centerMarker.scale = 0.5;
    centerMarker.update = function() {
        this.x = player.x;
        this.y = player.y;
        this.visible = player.visible && player.parent !== null;
        this.scale = 0.3 + Math.sin(scene.frame * 0.2) * 0.2;
    };
    scene.add(centerMarker);

    var zanzos = [];
    var zanzoPool = [];
    for (var i = 0; i < 200; i++) {
        var z = new Sprite(texture);
        z.texX = 4;
        z.texY = 1;
        z.update = function() {
            this.visible = player.visible;
            this.y -= 0.2;
            this.scale -= 0.08;
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
        var w = new Sprite(texture);
        w.scale = WEAPON_SCALE;
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
        w.power = player.power;
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
