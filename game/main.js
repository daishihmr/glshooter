// config
var MUTE_SE =  false; // if true, not play sounds.
var MUTE_BGM = false; // if true, not play bgm.
var FPS = 60;
var BULLET_SPEED = 0.10;
var DBL_CLICK_INTERVAL = 200;

var BOMB_DAMAGE1 = 20;
var BOMB_DAMAGE2 = 1;

var EXTEND_SCORE_LIFE = 1000000;
var EXTEND_SCORE_BOMB =  600000;

var GLOW_DOWN_TIME = 120;
var GLOW_UP_PER_HIT = 1;
var GLOW_DOWN = 5;
var GLOW_MAX = 1100;
var GLOW_BONUS_RATE = 0.004;

var SHOW_FPS = true;
var MUTEKI = false;
var INITIAL_RANK = 0.5;
var COLLISION_RADUIS = 0.2*0.2;

var START_STAGE = 3;
var NUM_OF_STAGE = 3;

var CLEAR_BONUS_ZANKI = 100000;
var CLEAR_BONUS_BOMB = 10000;

var LOAD_BGM_FROM_EXTERNAL_SITE = false;

tm.preload(function() {
    tm.util.FileManager.load("vs", { url: "shaders/shader.vs", type: "GET" });
    tm.util.FileManager.load("fs", { url: "shaders/shader.fs", type: "GET" });

    tm.graphics.TextureManager.add("texture0", "images/texture0.png");
    tm.graphics.TextureManager.add("boss1", "images/boss1.png");
    tm.graphics.TextureManager.add("boss2", "images/boss2.png");
    tm.graphics.TextureManager.add("boss3", "images/boss3.png");

    if (LOAD_BGM_FROM_EXTERNAL_SITE) {
        tm.sound.SoundManager.add("bgm1", "http://static.dev7.jp/glshooter/sounds/nc28689.mp3", 1);
        tm.sound.SoundManager.add("bgm2", "http://static.dev7.jp/glshooter/sounds/nc784.mp3", 1);
        tm.sound.SoundManager.add("bgm3", "http://static.dev7.jp/glshooter/sounds/nc790.mp3", 1);
    } else {
        tm.sound.SoundManager.add("bgm1", "sounds/nc28689.mp3", 1);
        tm.sound.SoundManager.add("bgm2", "sounds/nc784.mp3", 1);
        tm.sound.SoundManager.add("bgm3", "sounds/nc790.mp3", 1);
    }

    tm.sound.SoundManager.add("explode",   "sounds/se_maoudamashii_explosion05.mp3", 20);
    tm.sound.SoundManager.add("effect0",   "sounds/effect0.mp3", 1);
    tm.sound.SoundManager.add("bomb",      "sounds/nc17909.mp3");
    tm.sound.SoundManager.add("v-genBomb", "sounds/voice_gen-bomb.mp3", 1);
    tm.sound.SoundManager.add("v-extend",  "sounds/voice_extend.mp3", 1);
});

tm.main(function() {
    var SoundManager = tm.sound.SoundManager;
    var Random = tm.util.Random;
    if (!localStorage.getItem("jp.dev7.glshooter.settings")) {
        var s = {
            bgm: 1.0,
            se: 0.8
        }
        localStorage.setItem("jp.dev7.glshooter.settings", JSON.stringify(s));
    }
    var settings = JSON.parse(localStorage.getItem("jp.dev7.glshooter.settings"));

    var app = tm.app.CanvasApp("#tm");
    app.resize(320, 320);
    app.fitWindow(false);
    app.background = "rgba(0,0,0,1)"
    app.fps = FPS;
    app.continueCount = 0;
    app.highScore = 0;
    app.score = 0;
    app.incrScore = function(delta, calcGlow) {
        var beforeExtBomb = ~~(app.score / EXTEND_SCORE_BOMB);
        var beforeExtZanki = ~~(app.score / EXTEND_SCORE_LIFE);

        this.score += delta * (calcGlow ? glowBonus : 1);

        if (0 < delta) {
            if (beforeExtBomb !== ~~(app.score / EXTEND_SCORE_BOMB)) {
                app.bomb += 1;
                MUTE_SE || SoundManager.get("v-genBomb").play();
            }
            if (beforeExtZanki !== ~~(app.score / EXTEND_SCORE_LIFE)) {
                app.zanki += 1;
                MUTE_SE || SoundManager.get("v-extend").play();
            }
        }
    };

    app.resetGameStatus = function () {
        app.score = 0;
        app.zanki = 3;
        app.bomb = 3;
        if (player) player.level = 0;
    };
    app.bgm = null;
    app.volumeBgm = settings.bgm;
    app.volumeSe = settings.se;
    app.resetGameStatus();

    app.currentStage = START_STAGE;

    var setVolumeSe = app.setVolumeSe = function() {
        ["bgm1", "bgm2", "bgm3"].forEach(function(s) {
            for (var i = SoundManager.sounds[s].length; i--; ) {
                SoundManager.sounds[s][i].volume = app.volumeBgm;
            }
        });
        ["explode", "effect0", "bomb", "v-genBomb", "v-extend"].forEach(function(s) {
            for (var i = SoundManager.sounds[s].length; i--; ) {
                SoundManager.sounds[s][i].volume = app.volumeSe;
            }
        });
    };
    setVolumeSe();

    var gameScene = app.gameScene = tm.app.Scene();

    // webgl canvas
    var glCanvas = document.getElementById("world");
    fitWindow(glCanvas);

    // input
    var keyboard = app.keyboard;
    var mouse = app.pointing = app.mouse = tm.input.Mouse(glCanvas);
    mouse.lastLeftUp = -1;

    var titleScene = app.titleScene = TitleScene();
    var pauseScene = app.pauseScene = PauseScene();
    var settingScene = app.settingScene = SettingScene(app);
    var confirmScene = app.confirmScene = ConfirmScene();
    var continueScene = app.continueScene = ContinueScene();
    var gameOverScene = app.gameOverScene = GameOverScene();

    app.replaceScene(titleScene);

    // main 3D scene
    var vs = tm.util.FileManager.get("vs").data;
    var fs = tm.util.FileManager.get("fs").data;
    var scene = new Scene(glCanvas, vs, fs);
    var gl = scene.gl;

    // GL Textures
    var textures = {};
    for (var name in tm.graphics.TextureManager.textures) {
        textures[name] = createTexture(gl, tm.graphics.TextureManager.get(name).element);
    }
    var mainTexture = Sprite.mainTexture = textures["texture0"];

    // explosion
    var explosion = new Explosion(scene, mainTexture);
    var explode = app.explode = explosion.explode;
    var explodeS = app.explodeS = explosion.explodeS;
    var explodeL = explosion.getExplodeL(gl, scene);
    var clearAllExplosion = app.clearAllExplosion = explosion.clearAll;

    // player
    var weapons = [];
    var player = app.player = setupPlayer(app, scene, weapons, mouse, mainTexture);
    var clearAllPlayerEffect = app.clearAllPlayerEffect = player.clearAll;

    // GLOW-LV
    var glowLevel = 0;
    var glowBonus = 1;

    // bomb
    var bombParticlePool = [];
    var bomber = Bomb.createBomber(scene, bombParticlePool, mainTexture);
    app.fireBomber = bomber.normal;
    // app.autoBomber = bomber.mini;
    app.clearBomb = function () {
        Bomb.clearBomb(scene, bombParticlePool);
    };

    // enemy bullet
    var bullets = [];
    var bulletPool = [];
    for (var i = 0; i < 2000; i++) {
        var b = new Sprite(mainTexture);
        b.texX = 3;
        b.texY = 1;
        b.scale = 0.6;
        b.isBullet = true;
        bullets.push(b);
        bulletPool.push(b);
        b.onremoved = function() {
            bulletPool.push(this);
        };
    }

    // enemy bullet setting
    attackParam = app.attackParam = {
        "target": player,
        "rank": INITIAL_RANK,
        "bulletFactory": function(spec) {
            var b = bulletPool.pop();
            if (b === void 0) return;
            b.alive = false;
            b.scale = 0.6;
            if (spec.label === null || spec.label === void 0) {
                b.texX = 3;
                b.texY = 1;
            } else if (spec.label === "g" || spec.label.indexOf("green") === 0) {
                b.texX = 2;
                b.texY = 1;
            } else if (spec.label === "b" || spec.label.indexOf("blue") === 0) {
                b.texX = 1;
                b.texY = 1;
            } else if (spec.label.indexOf("bit") !== -1) {
                b.alive = true;
                b.texX = 7;
                b.texY = 7;
            } else {
                b.texX = 3;
                b.texY = 1;
            }

            if (spec.label && spec.label.indexOf("alive") !== -1) {
                b.alive =  true;
            }

            if (spec.label === "s") {
                b.scale = 0.4;
            } else if (spec.label === "sg") {
                b.scale = 0.4;
                b.texX = 2;
                b.texY = 1;
            } else if (spec.label === "sb") {
                b.scale = 0.4;
                b.texX = 1;
                b.texY = 1;
            }

            return b;
        },
        "isInsideOfWorld": function(b) {
            if (b.isBullet) {
                return -16.5 < b.x && b.x < 16.5 && -16.5 < b.y && b.y < 16.5;
            } else {
                return -22 < b.x && b.x < 22 && -22 < b.y && b.y < 22;
            }
        },
        "updateProperties": false,
        "speedRate": BULLET_SPEED
    };

    // clear all bullets
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
        var e = new Sprite(mainTexture);
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

            if (this.clear === true) {
                clearAllBullets(false);
            }

            var d = (player.x-this.x)*(player.x-this.x)+(player.y-this.y)*(player.y-this.y)-(player.scale+this.scale);
            var K = 5*5;
            d = Math.clamp(d, 0, K);
            var rate = Math.max(1, ((K-d)/K)*4);
            // if (1<rate) console.log("RATE " + rate*rate);
            app.incrScore(this.score*rate*rate, true); // mega rate

            if (this.clear !== true) {
                explode(this.x, this.y, this.scale);
                if (0 < expSoundPlaying) return;
                MUTE_SE || SoundManager.get("explode").play();
                expSoundPlaying = 5;
            } else {
                var timer = new Sprite(mainTexture);
                timer.texX = 7;
                timer.texY = 7;
                timer.x = this.x;
                timer.y = this.y;
                var t = scene.frame;
                timer.update = function() {
                    clearAllBullets(false);
                    if (scene.frame % 5 === 0 && Math.random() < 0.7) {
                        if (expSoundPlaying <= 0) {
                            MUTE_SE || SoundManager.get("explode").play();
                            expSoundPlaying = 5;
                        }
                        explode(this.x+Math.random()*6-3, this.y+Math.random()*6-3, 2);
                    } else if (scene.frame > t+60) {
                        scene.remove(this);
                    }
                };
                scene.add(timer);
            }
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
            e.alpha = 0.5;
            e.emission = 0;
            e.glow = 0.4;
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
        e.clear = data.clear;
        enemyFlags[flag] = false;
        e.flag = flag;
        e.update = Patterns[pattern].createTicker(attackParam);
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

    // labels
    var score = Labels.createScore(player);         gameScene.addChild(score);
    var highScore = Labels.createHighScore(player); gameScene.addChild(highScore);
    var life = Labels.createLife();                 gameScene.addChild(life);
    var message = app.message = Labels.createMessage();
    var bomb = Labels.createBomb();                 gameScene.addChild(bomb);
    var fps = Labels.createFps();                   SHOW_FPS && gameScene.addChild(fps);
    var bossHp;

    // game main loop
    var glowUp = false;
    var noGlowUpTime = 0;
    gameScene.update = function() {
        if (keyboard.getKeyDown("space") && !player.disabled) app.pushScene(app.pauseScene);

        glowUp = false;

        // control sound effect
        expSoundPlaying--;

        // launch enemy
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

        var bombing = bombParticlePool.readyCount !== bombParticlePool.length;

        // bombing or rebirthing
        if (player.rebirth || bombing) {
            clearAllBullets(false);
        }

        // bomb
        if ((keyboard.getKeyDown("z")||mouse.doubleClick) && player.parent !== null && 0 < app.bomb && bombing === false) {
            app.bomb -= 1;
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent !== null) e.damage(BOMB_DAMAGE1);
            }
            clearAllBullets(false);

            app.fireBomber(player.x, player.y);
        }
        // damage by bomb
        if (bombing === true) {
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent === null) continue;
                e.damage(BOMB_DAMAGE2);
            }
        }

        // collision
        var px = player.x;
        var py = player.y;
        // collision player vs bullet
        if (player.parent !== null && !player.muteki && !bombing && !player.disabled) {
            for (var i = bullets.length; i--; ) {
                var b = bullets[i];
                if (b.parent === null) continue;
                var dist = (b.x-px)*(b.x-px)+(b.y-py)*(b.y-py);
                if (dist < COLLISION_RADUIS) {
                    scene.remove(b);
                    MUTEKI || player.damage();
                    glowLevel = 0;
                    break;
                } else if (dist < 1.5) {
                    // console.log("GRAZE");
                    app.incrScore(1, true); // graze
                }
            }
        }
        // collision player vs enemy
        if (player.parent !== null && !player.muteki && !bombing && !player.disabled) {
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent === null) continue;
                var dist = (e.x-px)*(e.x-px)+(e.y-py)*(e.y-py);
                if (dist < e.scale) {
                    MUTEKI || player.damage();
                    glowLevel = 0;
                }
            }
        }
        // collision weapon vs enemy
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
                    glowLevel += GLOW_UP_PER_HIT; glowUp = true;
                    e.damage(player.power);
                    app.incrScore(0.01, true); // hit
                    w.update(); explodeS(w.x, w.y, 0.3);
                }
            }
        }

        // GLOW-UP
        if (glowUp) {
            noGlowUpTime = 0;
        } else {
            noGlowUpTime += 1;
            if (GLOW_DOWN_TIME < noGlowUpTime) {
                glowLevel -= GLOW_DOWN;
            }
        }
        glowLevel = Math.clamp(glowLevel, 0, GLOW_MAX);
        glowBonus = (1+glowLevel*GLOW_BONUS_RATE)*(1+glowLevel*GLOW_BONUS_RATE);
        player.glow = glowLevel * 0.001;

        scene.update();
        scene.draw();
    };

    app.update = function() {
        mouse.doubleClick = false;
        if (mouse.getPointingEnd()) {
            if ((Date.now() - mouse.lastLeftUp) < DBL_CLICK_INTERVAL) {
                mouse.doubleClick = true;
            } else {
                mouse.lastLeftUp = Date.now();
            }
        }

        if (app.currentScene !== gameScene) {
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
        }
        app.bgm = SoundManager.get("bgm" + stage);
        if (app.bgm) {
            app.bgm.loop = true;
            setTimeout(function() {
                MUTE_BGM || app.bgm.play();
            }, 100);
        }

        // boss
        if (boss !== void 0) {
            scene.remove(boss);
            var index = enemies.indexOf(boss);
            if (index !== -1) enemies.splice(index, 1);
        }
        boss = createBoss(app, explosion, stage, textures["boss" + stage]);
        enemies.push(boss);
        boss.killed = function() {
            app.stageClear();
        };
        bossHp = Labels.createBossHp(boss);

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
        app.clearAllBullets(true);
        app.clearAllEnemies();
        app.clearBomb();
        app.clearAllExplosion();
        app.clearAllPlayerEffect();

        // message
        message.text = "stage " + stage;
        message.setFontSize(50);
        message.fillStyle = "white";
        message.alpha = 0.1;
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
        message.alpha = 0.1;
        message.text = "stage clear";
        message.visible = true;
        var t = scene.frame;
        var bonus = ~~(app.zanki * 100000 + app.bomb * 30000);
        message.addEventListener("enterframe", function() {
            if (scene.frame === t + 180*1) {
                message.text = "bonus " + bonus;
                app.incrScore(bonus, false);
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
        var bonus = ~~(app.zanki * CLEAR_BONUS_ZANKI + app.bomb * CLEAR_BONUS_BOMB);
        message.addEventListener("enterframe", function() {
            if (scene.frame === t + 180*1) {
                message.text = "bonus " + bonus;
                app.incrScore(bonus, false);
            } else if (scene.frame === t + 180*2) {
                message.fillStyle = "yellow";
                message.text = "THANK YOU!!";
            } else if (scene.frame === t + 180*3) {
                return app.gameOver();
            }
        });
        gameScene.addChild(message);
    };

    // confirm continue
    app.confirmContinue = function() {
        scene.returnFrame = scene.frame;
        setTimeout(function() {
            app.pushScene(continueScene);
        }, 1000);
    };

    // continue
    app.gameContinue = function() {
        app.resetGameStatus();
        app.continueCount += 1;
        player.level = -1;
        scene.frame = scene.returnFrame;
        scene.add(player);
        player.launch();
    };

    // game over
    app.gameOver = function() {
        if (app.bgm) app.bgm.stop();
        app.replaceScene(gameOverScene);
    };

    app.run();
});
