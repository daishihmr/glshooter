// config
var MUTE_SE =  false; // if true, not play sounds.
var MUTE_BGM = false; // if true, not play bgm.
var FPS = 60;
var BULLET_SPEED = 0.10;
var DBL_CLICK_INTERVAL = 200;
var EXTEND_SCORE = 500000;
var GLOW_LEVEL_DOWN = 1.5;
var SHOW_FPS = true;
var MUTEKI = false;
var START_STAGE = 1;

var NUM_OF_STAGE = 1;

var textures = {};
var scripts = {};

tm.preload(function() {
    tm.graphics.TextureManager.add("texture0", "texture0.png");
    tm.graphics.TextureManager.add("boss1", "boss1.png");
    tm.addLoadCheckList(loadScript("vs", "shader.vs"));
    tm.addLoadCheckList(loadScript("fs", "shader.fs"));
    tm.sound.SoundManager.add("explode", "se_maoudamashii_explosion05.mp3", 30);
    tm.sound.SoundManager.add("bgm1", "nc28689.mp3", 1);
    tm.sound.SoundManager.add("effect0", "effect0.mp3", 1);
    tm.sound.SoundManager.add("bomb", "nc17909.mp3");
});

tm.main(function() {
    var SoundManager = tm.sound.SoundManager;
    var Random = tm.util.Random;
    var settings = JSON.parse(localStorage.getItem("jp.dev7.glshooter.settings") || "{\"bgm\":1.0,\"se\":0.8}");

    var app = tm.app.CanvasApp("#tm");
    app.resize(320, 320);
    app.fitWindow(false);
    app.background = "rgba(0,0,0,1)"
    app.fps = FPS;
    app.isGameover = false;
    app.resetGameStatus = function () {
        app.score = 0;
        app.zanki = 3;
        app.bomb = 3;
    };
    app.bgm = null;

    app.volumeSe = settings.se;
    app.resetGameStatus();

    app.currentStage = START_STAGE;

    var setVolumeSe = function() {
        ["explode", "effect0", "bomb"].forEach(function(s) {
            for (var i = SoundManager.sounds[s].length; i--; ) {
                SoundManager.sounds[s][i].volume = app.volumeSe;
            }
        });
    };
    setVolumeSe();

    var gameScene = app.gameScene = tm.app.Scene();
    
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

    // explosion
    var explosion = new Explosion(gl, scene);
    var explode = app.explode = explosion.explode;
    var explodeS = app.explodeS = explosion.explodeS;
    var explodeL = explosion.getExplodeL(gl, scene);
    var clearAllExplosion = app.clearAllExplosion = explosion.clearAll;

    // player
    var weapons = [];
    var player = app.player = setupPlayer(app, gl, scene, weapons, mouse);
    var clearAllPlayerEffect = app.clearAllPlayerEffect = player.clearAll;

    // bomb
    var bombParticlePool = [];
    app.fireBomber = Bomb.fireBomber(gl, scene, bombParticlePool);
    app.clearBomb = function () {
        Bomb.clearBomb(scene, bombParticlePool);
    };

    // enemy bullet setting
    var param = app.attackParam = {
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
    for (var i = 0; i < 2000; i++) {
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

    // clear all bullets
    app.isBulletDisable = false;
    var clearAllBullets = app.clearAllBullets = function(a) {
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
    for (var i = 0; i < 1000; i++) {
        var e = createEnemy();
        enemies.push(e);
        enemyPool.push(e);
    }
    var launchEnemy = function(x, y, enemyName, pattern, flag) {
        var data = enemyData[enemyName];
        var e;
        if (enemyName === "boss") {
            e = boss;
            gameScene.addChild(bossHp);
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
        e.update = Patterns[pattern].createTicker(param);
        scene.add(e);
    };
    var clearAllEnemies = app.clearAllEnemies = function(a) {
        for (var i = enemies.length; i--; ) {
            var e = enemies[i];
            if (e.parent !== null) {
                scene.remove(e);
            }
        }
    };

    // score
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

    // zanki
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

    // message
    var message = app.message = tm.app.Label("stage " + app.currentStage, 50);
    message.setFontFamily("Orbitron");
    message.setAlign("center");
    message.setBaseline("middle");
    message.x = 160;
    message.y = 160;
    message.width = 320;
    message.update = function() {
        this.alpha = 0.1 + Math.sin(scene.frame*0.12) * 0.1;
    };

    // bomb
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
    SHOW_FPS && gameScene.addChild(fps);

    // boss hp
    var bossHp = tm.app.RectangleShape(300, 5, {
        fillStyle: "white",
        strokeStyle: "none"
    });
    bossHp.x = 300*0.5 + 5;
    bossHp.y = 5;
    bossHp.update = function() {
        this.alpha = Math.sin(scene.frame * 0.1)*0.25 + 0.75;
        this.width = 300 * Math.max(1, boss.maxHp-boss.damagePoint) / boss.maxHp;
        if (this.width <= 1) this.remove();
        this.x = this.width*0.5 + 5;
    }

    // GLOW-LV
    var glowLevel = 0;

    // game main loop
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
                    if (msg.visible) {
                        gameScene.addChild(am);
                    } else {
                        am.remove();
                    }
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
                var dist = (b.x - player.x)*(b.x - player.x)+(b.y - player.y)*(b.y - player.y);
                if (dist < 0.1) {
                    scene.remove(b);
                    MUTEKI || player.damage();
                    glowLevel = 0;
                    break;
                } else if (dist < 1.0) {
                    // console.log("GRAZE", 10 * (1 + player.glow*10));
                    app.score += 10 * (1 + player.glow*10); // graze
                }
            }
        }

        // player vs enemy
        if (player.parent !== null && player.rebirth === false && player.disabled === false) {
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent === null) continue;
                var dx = e.x - player.x;
                var dy = e.y - player.y;
                if (dx*dx+dy*dy < e.scale*2) {
                    MUTEKI || player.damage();
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
                    app.score += player.glow*0.1; // 撃ち込み点
                    w.update(); explodeS(w.x, w.y, 0.3);
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
            app.bomb -= 1;
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
    var settingScene = SettingScene(app);
    var confirmScene = ConfirmScene();

    app.update = function() {
        mouse.update();

        if (keyboard.getKeyDown("space")) {
            if (app.currentScene === pauseScene) {
                switch (pauseScene.selection) {
                case 0: // resume
                    app.popScene();
                    break;
                case 1: // restart
                    app.pushScene(confirmScene);
                    break;
                case 2: // setting
                    app.pushScene(settingScene);
                    break;
                case 3: // back to title
                    app.pushScene(confirmScene);
                    break;
                }
            } else if (app.currentScene === confirmScene) {
                switch (confirmScene.selection) {
                case 0:
                    if (pauseScene.selection === 1) { // restart
                        app.resetGameStatus();
                        app.stageStart();
                        app.popScene();
                        app.popScene();
                    } else if (pauseScene.selection === 3) { // back to title
                        app.resetGameStatus();
                        app.popScene();
                        app.popScene();
                        app.popScene();
                        app.bgm.stop();
                    }
                    break;
                case 1:
                    app.popScene();
                }
            } else if (app.currentScene === settingScene) {
                setVolumeSe();
                app.popScene();
            } else if (app.currentScene === gameScene) {
                if (app.isGameover) return;
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

    // boss
    var boss;

    // background
    var background;

    // stage data
    var stageData;

    // stage start
    app.stageStart = function() {
        scene.frame = 0;

        var stage = app.currentStage;

        // bgm
        var vol = settings.bgm;
        if (app.bgm) {
            app.bgm.stop();
            vol = app.bgm.volume;
        }
        app.bgm = SoundManager.get("bgm" + stage);
        if (app.bgm) {
            app.bgm.loop = true;
            app.bgm.volume = vol;
            MUTE_BGM || app.bgm.play();
        }
        
        // boss
        if (boss !== void 0) {
            var index = enemies.indexOf(boss);
            if (index !== -1) enemies.splice(index, 1);
        }
        boss = createBoss(app, gl, textures["boss" + stage], explosion, stage);
        enemies.push(boss);
        boss.killed = function() {
            app.stageClear();
        };

        // background
        if (background) background.remove();
        background = createBackground(app, player, stage);
        gameScene.addChild(background);

        // stage data
        stageData = setupStageData(app, stage);

        // reset player
        player.reset();
        player.rebirth = true;
        player.disabled = true;
        player.y = -17;

        // clear sprites
        app.clearAllBullets();
        app.clearAllEnemies();
        app.clearBomb();
        app.clearAllExplosion();
        app.clearAllPlayerEffect();

        // message
        message.text = "stage " + stage;
        var t = scene.frame;
        message.addEventListener("enterframe", function() {
            if (scene.frame === t + 240) {
                message.remove();
            }
        });
        gameScene.addChild(message);
    };

    // stage clear
    app.stageClear = function() {
        if (app.currentStage === NUM_OF_STAGE) {
            return app.gameClear();
        }
        message.fillStyle = "white";
        message.setFontSize(30);
        message.text = "stage clear";
        message.visible = true;
        var t = scene.frame;
        var bonus = ~~(app.zanki * 100000 + app.bomb * 30000);
        message.addEventListener("enterframe", function() {
            if (scene.frame === t + 180*1) {
                message.text = "bonus " + bonus;
                app.score += bonus;
            } else if (scene.frame === t + 180*2) {
                setTimeout(function() {
                    app.currentStage += 1;
                    app.stageStart();
                }, 10);
            }
        });
        gameScene.addChild(message);
    };

    // game clear
    app.gameClear = function() {
        message.fillStyle = "white";
        message.setFontSize(30);
        message.text = "all stage clear";
        message.visible = true;
        var t = scene.frame;
        var bonus = ~~(app.zanki * 100000 + app.bomb * 30000);
        message.addEventListener("enterframe", function() {
            if (scene.frame === t + 180*1) {
                message.text = "bonus " + bonus;
                app.score += bonus;
            } else if (scene.frame === t + 180*2) {
                message.fillStyle = "yellow";
                message.text = "THANK YOU!!";
            } else if (scene.frame === t + 180*3) {
                return app.gameOver();
            }
        });
        gameScene.addChild(message);
    };

    // game over
    app.gameOver = function() {
        app.isBulletDisable = false;
        app.isGameover = true;
        setTimeout(function() {
            if (app.bgm) app.bgm.stop();
            app.replaceScene(GameOverScene());
        }, 3000);
    };

    app.run();
});
