// config
var MUTE_SE =  false; // if true, not play sounds.
var MUTE_BGM = true; // if true, not play bgm.
var FPS = 60;
var BULLET_SPEED = 0.10;
var DBL_CLICK_INTERVAL = 200;
var EXTEND_SCORE = 500000;
var GLOW_LEVEL_DOWN = 1.5;

var textures = {};
var scripts = {};

tm.preload(function() {
    tm.graphics.TextureManager.add("texture0", "texture0.png");
    tm.graphics.TextureManager.add("boss1", "boss1.png");
    tm.addLoadCheckList(loadScript("vs", "shader.vs"));
    tm.addLoadCheckList(loadScript("fs", "shader.fs"));
    tm.sound.SoundManager.add("explode", "se_maoudamashii_explosion05.mp3", 30);
    tm.sound.SoundManager.add("bgm", "nc28689.mp3", 1);
    tm.sound.SoundManager.add("effect0", "effect0.mp3", 1);
    tm.sound.SoundManager.add("bomb", "nc17909.mp3");
});

tm.main(function() {
    var SoundManager = tm.sound.SoundManager;
    var Random = tm.util.Random;

    var app = tm.app.CanvasApp("#tm");
    app.resize(320, 320);
    app.fitWindow(false);
    app.fps = FPS;
    app.isGameover = false;

    var bgm = SoundManager.get("bgm");

    // 爆発音の音量を少し下げておく
    for (var i = SoundManager.sounds["explode"].length; i--; ) {
        SoundManager.sounds["explode"][i].volume = 0.8;
    }

    var gameScene = app.gameScene = tm.app.Scene();
    gameScene.addEventListener("enter", function() {
        bgm.loop = true;
        MUTE_BGM || bgm.play();
    });
    
    // webgl canvas
    var canvas = document.getElementById("world");
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    fitWindow(canvas);
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        alert("could not initialized WebGL");
        return;
    }

    // input
    var keyboard = app.keyboard;
    var mouse = tm.input.Mouse(canvas);
    mouse.lastLeftUp = -1;

    var titleScene = TitleScene(mouse);
    app.replaceScene(titleScene);

    // main 3D scene
    var scene = new Scene(gl, scripts["vs"], scripts["fs"]);

    // GL Textures
    for (var name in tm.graphics.TextureManager.textures) {
        textures[name] = createTexture(gl, tm.graphics.TextureManager.get(name).element);
    }
    var texture0 = Sprite.mainTexture = textures["texture0"];

    // player
    var weapons = [];
    var weaponPool = [];
    var player = setupPlayer(app, gl, scene, weapons, weaponPool, mouse);

    // bomb
    var bombParticlePool = [];
    app.fireBomber = fireBomber(gl, scene, texture0, bombParticlePool);

    // enemy bullet setting
    var param = app.AttackParam = {
        target: player,
        rank: 0.5,
        bulletFactory: function(spec) {
            var b = bulletPool.pop();
            if (b === void 0) return;
            b.alive = false;
            if (spec.label === null || spec.label === void 0) {
                b.texX = 3;
                b.texY = 1;
            } else if (spec.label === "b") {
                b.texX = 1;
                b.texY = 1;
            } else if (spec.label === "g") {
                b.texX = 2;
                b.texY = 1;
            } else if (spec.label.indexOf("bit") === 0) {
                b.alive = true;
                b.texX = 7;
                b.texY = 7;
            } else {
                b.texX = 3;
                b.texY = 1;
            }
            return b;
        },
        isInsideOfWorld: function(b) {
            return -22 < b.x && b.x < 22 && -22 < b.y && b.y < 22;
        },
        updateProperties: false,
        speedRate: BULLET_SPEED
    };

    // enemy bullet
    var bullets = [];
    var bulletPool = [];
    for (var i = 0; i < 1000; i++) {
        var b = new Sprite(gl, texture0);
        b.texX = 3;
        b.texY = 1;
        b.scale = 0.5;
        b.isBullet = true;
        bullets.push(b);
        bulletPool.push(b);
        b.onremoved = function() {
            bulletPool.push(this);
        };
    }

    // clear bullets
    app.isBulletDisable = false;
    var clearAllBullets = function(a) {
        for (var i = bullets.length; i--; ) {
            var b = bullets[i];
            if (b.parent !== null && (!b.alive || a)) {
                explode(b.x, b.y, 0.2);
                scene.remove(b);
            }
        }
    };

    // enemy
    var enemyFlags = {};
    var enemies = [];
    var enemyPool = [];
    var expSoundPlaying = -1;
    var createEnemy = function() {
        var e = new Sprite(gl, texture0);
        e.alpha = 0.5;
        e.glow = 1;
        e.onremoved = function() {
            this.update = function() {};
            enemyPool.push(this);
        };
        e.damage = function(dmg) {
            this.hp -= dmg;
            if (0 < this.hp) return;
            scene.remove(this);
            this.onkilled();
        }
        e.onkilled = function() {
            if (this.flag !== void 0) {
                enemyFlags[this.flag] = true;
            }

            // extend
            var before = ~~(app.score / EXTEND_SCORE);
            app.score += this.score * (1 + player.glow*10);
            if (before !== ~~(app.score / EXTEND_SCORE)) {
                app.zanki += 1;
            }

            explode(this.x, this.y, this.scale);
            if (0 < expSoundPlaying) return;
            MUTE_SE || SoundManager.get("explode").play();
            expSoundPlaying = 5;
        };
        return e;
    };
    for (var i = 0; i < 500; i++) {
        var e = createEnemy();
        enemies.push(e);
        enemyPool.push(e);
    }
    var launchEnemy = function(x, y, enemyName, pattern, flag) {
        var data = enemyData[enemyName];
        var e;
        if (enemyName === "boss") {
            e = boss;
        } else {
            e = enemyPool.pop();
            if (e === void 0) {
                e = createEnemy();
                enemies.push(e);
            }
            e.texX = data.frameIndex % 8;
            e.texY = ~~(data.frameIndex / 8);
        }
        e.x = x;
        e.y = y;
        e.hp = data.hp;
        e.scale = data.scale;
        e.score = data.score;
        enemyFlags[flag] = false;
        e.flag = flag;
        e.update = patterns[pattern].createTicker(param);
        scene.add(e);
    };

    // boss
    var boss = new Sprite(gl, textures["boss1"]);
    boss.scale = 8;
    boss.alpha = 0.5;
    boss.texScale = 8;
    boss.glow = 0.4;
    boss.maxHp = 16000;
    boss.damagePoint = 0;
    boss.damage = function(d) {
        this.damagePoint += d;
        if (8000 < this.damagePoint) {
            // 第2形態へ
            clearAllBullets(true);
            this.glow = 0.2;
            SoundManager.get("explode").play();
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            var t = scene.frame + 50;
            this.update = function() {
                if (scene.frame === t || scene.frame === t+10 || scene.frame === t+15) {
                    SoundManager.get("explode").play();
                    explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 3));
                } else if (scene.frame === t+75) {
                    this.update = patterns.boss12.createTicker(param);
                    this.damage = this.damage2;
                }
            };
            this.damage = function() {};
        }
    };
    boss.damage2 = function(d) {
        this.damagePoint += d;
    }
    enemies.push(boss);

    // explosion
    var explosion = new Explosion(gl, scene, texture0);
    var explode = app.explode = explosion.explode;
    var explodeS = app.explodeS = explosion.explodeS;

    // background
    app.background = "rgba(0,0,0,1)"
    gameScene.addChild(createBackground(app, scene, player));

    // score
    app.score = 0;
    var score = tm.app.Label("SCORE:" + app.score);
    score.update = function() {
        var a = Math.sin(scene.frame * 0.1)*0.25 + 0.75;
        if (player.y < 0) {
            this.fillStyle = "rgba(255,255,255," + ((player.y + 17) / 17)*a + ")";
        } else {
            this.fillStyle = "rgba(255,255,255," + a + ")";
        }
        this.text= "SCORE:" + ~~(app.score);
    };
    score.setFontFamily("Orbitron");
    score.setBaseline("bottom");
    score.x = 2;
    score.y = 320;
    score.width = 320;
    gameScene.addChild(score);

    // for 2d
    var canvasTexture = tm.graphics.TextureManager.get("texture0");

    // zanki
    app.zanki = 3;
    var life = tm.app.Label("LIFE:" + app.zanki, 12);
    life.update = function() {
        this.alpha = Math.sin(scene.frame * 0.1)*0.25 + 0.75;
        this.text= "LIFE:" + app.zanki;
    };
    life.setFontFamily("Orbitron");
    life.setBaseline("top");
    life.x = 2;
    life.y = 12;
    life.width = 320;
    gameScene.addChild(life);

    // stage
    var message = app.message = tm.app.Label("stage 1", 50);
    message.setFontFamily("Orbitron");
    message.setAlign("center");
    message.setBaseline("middle");
    message.x = 160;
    message.y = 160;
    message.width = 320;
    message.update = function() {
        this.alpha = 0.1 + Math.sin(scene.frame*0.12) * 0.1;
        if (scene.frame === 240) {
            this.visible = false;
        }
    };
    gameScene.addChild(message);

    // bomb
    app.bomb = 3;
    var bomb = tm.app.Label("BOMB:" + app.bomb, 12);
    bomb.update = function() {
        this.alpha = Math.sin(scene.frame * 0.1)*0.25 + 0.75;
        this.text= "BOMB:" + app.bomb;
    };
    bomb.setFontFamily("Orbitron");
    bomb.setBaseline("top");
    bomb.x = 2;
    bomb.y = 26;
    bomb.width = 320;
    gameScene.addChild(bomb);

    // fps
    var fps = tm.app.Label("fps:", 10);
    fps.setFontFamily("Orbitron");
    fps.setBaseline("top");
    fps.width = 50;
    fps.x = 320 - fps.width;
    fps.y = 12;
    gameScene.addChild(fps);
    (function() {
        var frameCount = -1;
        var lastUpdate = Date.now();
        fps.update = function() {
            this.alpha = Math.sin(scene.frame * 0.1)*0.25 + 0.75;
            frameCount += 1;
            var ms = Date.now();
            if (ms - lastUpdate >= 1000) {
                fps.text = "fps:" + frameCount;
                lastUpdate = ms;
                frameCount = 0;
            }
        };
    })();

    // boss hp
    var bossHp = tm.app.RectangleShape(300, 5, {
        fillStyle: "white",
        strokeStyle: "none"
    });
    bossHp.x = 300/2 + 5;
    bossHp.y = 5;
    bossHp.alpha = 0.5;
    bossHp.update = function() {
        this.visible = (boss.parent !== null);
        var hp = boss.maxHp - boss.damagePoint;
        this.width = 300 * hp/boss.maxHp;
        this.x = this.width/2 + 5;
    }
    gameScene.addChild(bossHp);

    var stageData = setupStageData(app);

    // game main loop
    var glowLevel = 0;
    gameScene.update = function() {
        // launch enemy
        if (app.isGameover === false) {
            var data = stageData.next(scene.frame, enemyFlags);
            if (data !== void 0) {
                var elist = data.enemies;
                for (var i = elist.length; i--; ) {
                    var e = elist[i];
                    launchEnemy(e[0], e[1], e[2], e[3], e[4]);
                }
                var msg = data.message;
                if (msg !== void 0) {
                    var am = app.message;
                    am.text = msg.text;
                    am.fillStyle = msg.color;
                    am.visible = msg.visible;
                }
            }
        }

        // control sound effect
        expSoundPlaying--;

        // player vs bullet
        if (player.parent !== null && player.rebirth === false) {
            for (var i = bullets.length; i--; ) {
                var b = bullets[i];
                if (b.parent === null) continue;
                var dx = b.x - player.x;
                var dy = b.y - player.y;
                if (dx*dx+dy*dy < 0.1) {
                    scene.remove(b);
                    player.damage();
                    glowLevel = 0;
                    break;
                }
            }
        }

        // player vs enemy
        if (player.parent !== null && player.rebirth === false) {
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent === null) continue;
                var dx = e.x - player.x;
                var dy = e.y - player.y;
                if (dx*dx+dy*dy < e.scale*2) {
                    player.damage();
                    glowLevel = 0;
                }
            }
        }

        // weapon vs enemy
        for (var i = weapons.length; i--; ) {
            var w = weapons[i];
            if (w.parent === null) continue;
            for (var j = enemies.length; j--; ) {
                var e  = enemies[j];
                if (e.parent === null) continue;
                var dx = w.x - e.x;
                var dy = w.y - e.y;
                if (dx*dx+dy*dy < e.scale*2) {
                    scene.remove(w);
                    glowLevel += 3;
                    e.damage(player.power);
                    w.update();
                    explodeS(w.x, w.y, 0.3);
                }
            }
        }

        var bombing = bombParticlePool.readyCount !== bombParticlePool.length;

        // bombing or rebirthing
        if (app.isBulletDisable || bombing) {
            clearAllBullets();
        }

        // bomb
        if ((keyboard.getKeyDown("z")||mouse.doubleClick) && player.parent !== null && 0 < app.bomb && bombing === false) {
            app.bomb--;
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent !== null) e.damage(20);
            }
            clearAllBullets();

            app.fireBomber();
        }
        // damage by bomb
        if (bombing === true) {
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent === null) continue;
                e.damage(1);
            }
        }

        glowLevel -= GLOW_LEVEL_DOWN;
        if (glowLevel<0) glowLevel=0;
        else if (1200 < glowLevel) glowLevel = 1200;
        player.glow = glowLevel * 0.001;
    };

    var pauseScene = PauseScene();

    app.update = function() {
        mouse.update();

        if (keyboard.getKeyDown("space")) {
            if (app.currentScene === pauseScene) {
                app.popScene();
            } else if (app.currentScene === gameScene) {
                app.pushScene(pauseScene);
            }
        }

        mouse.doubleClick = false;
        if (mouse.getPointingEnd()) {
            if ((Date.now() - mouse.lastLeftUp) < DBL_CLICK_INTERVAL) {
                mouse.doubleClick = true;
            } else {
                mouse.lastLeftUp = Date.now();
            }
        } 

        if (app.currentScene === gameScene) {
            scene.update();
            scene.draw();
        } else {
            scene.clear();
        }
    };

    // gameover
    app.gameover = function() {
        app.isBulletDisable = false;
        app.isGameover = true;
        setTimeout(function() {
            bgm.stop();
            app.replaceScene(GameOverScene());
        }, 3000);
    };

    app.run();
});
