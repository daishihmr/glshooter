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

var GLOW_DOWN_TIME = 60;
var GLOW_UP_PER_HIT = 1;
var GLOW_DOWN = 2;
var GLOW_MAX = 1100;
var GLOW_BONUS_RATE = 0.004;

var SHOW_FPS = true;
var MUTEKI = false;
var INITIAL_RANK = 0.5;
var COLLISION_RADUIS = 0.2*0.2;

var START_STAGE = 1;
var NUM_OF_STAGE = 3;

var CLEAR_BONUS_ZANKI = 100000;
var CLEAR_BONUS_BOMB = 10000;

var textures = {};

tm.preload(function() {
    tm.util.FileManager.load("vs", { url: "shader.vs", type: "GET" });
    tm.util.FileManager.load("fs", { url: "shader.fs", type: "GET" });

    tm.graphics.TextureManager.add("texture0", "texture0.png");
    tm.graphics.TextureManager.add("boss1", "boss1.png");
    tm.graphics.TextureManager.add("boss2", "boss2.png");
    tm.graphics.TextureManager.add("boss3", "boss3.png");

    tm.sound.SoundManager.add("bgm1", "nc28689.mp3", 1);
    tm.sound.SoundManager.add("bgm2", "nc784.mp3", 1);
    tm.sound.SoundManager.add("bgm3", "nc790.mp3", 1);

    tm.sound.SoundManager.add("explode", "se_maoudamashii_explosion05.mp3", 20);
    tm.sound.SoundManager.add("effect0", "effect0.mp3", 1);
    tm.sound.SoundManager.add("bomb", "nc17909.mp3");
    tm.sound.SoundManager.add("v-genBomb", "voice_gen-bomb.mp3", 1);
    tm.sound.SoundManager.add("v-extend", "voice_extend.mp3", 1);
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
    app.volumeSe = settings.se;
    app.resetGameStatus();

    app.currentStage = START_STAGE;

    var setVolumeSe = function() {
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
    var mouse = tm.input.Mouse(glCanvas);
    mouse.lastLeftUp = -1;

    var titleScene = TitleScene(mouse);
    var pauseScene = PauseScene();
    var settingScene = SettingScene(app);
    var confirmScene = ConfirmScene();
    var continueScene = ContinueScene();

    app.replaceScene(titleScene);

    // main 3D scene
    var vs = tm.util.FileManager.get("vs").data;
    var fs = tm.util.FileManager.get("fs").data;
    var scene = new Scene(glCanvas, vs, fs);
    var gl = scene.gl;

    // GL Textures
    if (gl) {
        for (var name in tm.graphics.TextureManager.textures) {
            textures[name] = createTexture(gl, tm.graphics.TextureManager.get(name).element);
        }
    }
    var texture0 = Sprite.mainTexture = textures["texture0"];

    // explosion
    var explosion = new Explosion(scene);
    var explode = app.explode = explosion.explode;
    var explodeS = app.explodeS = explosion.explodeS;
    var explodeL = explosion.getExplodeL(gl, scene);
    var clearAllExplosion = app.clearAllExplosion = explosion.clearAll;

    // player
    var weapons = [];
    var player = app.player = setupPlayer(app, scene, weapons, mouse);
    var clearAllPlayerEffect = app.clearAllPlayerEffect = player.clearAll;

    // GLOW-LV
    var glowLevel = 0;
    var glowBonus = 1;

    // bomb
    var bombParticlePool = [];
    app.fireBomber = Bomb.fireBomber(scene, bombParticlePool);
    app.clearBomb = function () {
        Bomb.clearBomb(scene, bombParticlePool);
    };

    // enemy bullet
    var bullets = [];
    var bulletPool = [];
    for (var i = 0; i < 2000; i++) {
        var b = new Sprite(texture0);
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

    // enemy bullet setting
    attackParam = app.attackParam = {
        target: player,
        rank: INITIAL_RANK,
        bulletFactory: function(spec) {
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
        isInsideOfWorld: function(b) {
            return -22 < b.x && b.x < 22 && -22 < b.y && b.y < 22;
        },
        updateProperties: false,
        speedRate: BULLET_SPEED
    };

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
        var e = new Sprite(texture0);
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
                var timer = new Sprite(texture0);
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

    // labels =================================================================
    // score
    var score = tm.app.Label("SCORE:" + app.score, 30);
    score.update = function() {
        var a = Math.sin(scene.frame * 0.1)*0.25 + 0.75;
        if (player.y < 0 && !player.disabled) {
            this.alpha = ((player.y + 17) / 30)*a;
        } else {
            this.alpha = a;
        }
        this.text= "SCORE:" + ~~(app.score);
    };
    score.setFontFamily("Orbitron");
    score.setBaseline("bottom");
    score.x = 2;
    score.y = 320;
    score.width = 320;
    gameScene.addChild(score);

    // highScore
    var highScore = tm.app.Label("high score:" + app.highScore, 10);
    highScore.setFontFamily("Orbitron");
    highScore.setBaseline("bottom");
    highScore.width = 320;
    highScore.x = 4;
    highScore.y = 320 - 32;
    highScore.update = function() {
        var a = Math.sin(scene.frame * 0.1)*0.25 + 0.75;
        if (player.y < 0) {
            this.alpha = ((player.y + 17) / 30)*a;
        } else {
            this.alpha = a;
        }
        app.highScore = Math.max(app.score, app.highScore);
        this.text = "high score:" + ~~(app.highScore);
        // this.text = glowLevel;
    };
    gameScene.addChild(highScore);

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
    fps.y = 24;
    (function() {
        var frameCount = -1;
        var lastUpdate = Date.now();
        fps.update = function() {
            this.alpha = Math.sin(scene.frame * 0.1)*0.25 + 0.75;
            frameCount += 1;
            var ms = Date.now();
            if (ms - lastUpdate >= 1000) {
                this.text = "fps:" + frameCount;
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

    // game main loop
    var glowUp = false;
    var noGlowUpTime = 0;
    gameScene.update = function() {
        glowUp = false;

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

        // control sound effect
        expSoundPlaying--;

        var px = player.x;
        var py = player.y;

        // player vs bullet
        if (player.parent !== null && !player.muteki && !player.disabled) {
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

        // player vs enemy
        if (player.parent !== null && !player.muteki && !player.disabled) {
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent === null) continue;
                var dist = (e.x-px)*(e.x-px)+(e.y-py)*(e.y-py);
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
                    glowLevel += GLOW_UP_PER_HIT; glowUp = true;
                    e.damage(player.power);
                    app.incrScore(0.01, true); // hit
                    w.update(); explodeS(w.x, w.y, 0.3);
                }
            }
        }

        var bombing = bombParticlePool.readyCount !== bombParticlePool.length;

        // bombing or rebirthing
        if (app.isBulletDisable || bombing) {
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

            app.fireBomber();
        }
        // damage by bomb
        if (bombing === true) {
            for (var i = enemies.length; i--; ) {
                var e = enemies[i];
                if (e.parent === null) continue;
                e.damage(BOMB_DAMAGE2);
            }
        }

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
    };

    app.update = function() {
        mouse.update();

        if (keyboard.getKeyDown("space")) {
            if (app.currentScene === titleScene) {
                if (!titleScene.startFlag) {
                    switch (titleScene.selection) {
                    case 0: // game start
                        titleScene.startFlag = true;
                        SoundManager.get("effect0").play();
                        break;
                    case 1: // setting
                        app.pushScene(settingScene);
                        break;
                    case 2: // exit
                        app.gameOver();
                        break;
                    }
                }
            } else if (app.currentScene === pauseScene) {
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
                        app.continueCount += 1;
                        app.resetGameStatus();
                        app.stageStart();
                        app.popScene();
                        app.popScene();
                    } else if (pauseScene.selection === 3) { // back to title
                        app.continueCount = 0;
                        app.currentStage = 1;
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
            } else if (app.currentScene === continueScene) {
                app.popScene();
                switch(continueScene.selection) {
                case 0:
                    app.resetGameStatus();
                    app.continueCount += 1;
                    player.level = -1;
                    scene.frame = scene.returnFrame;
                    scene.add(player);
                    return player.launch();
                case 1:
                    return app.gameOver();
                }
            } else if (app.currentScene === gameScene) {
                if (player.disabled) return;
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
        boss = createBoss(app, explosion, stage);
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
        app.isBulletDisable = false;
        scene.returnFrame = scene.frame;
        setTimeout(function() {
            app.pushScene(continueScene);
        }, 1000);
    };

    // game over
    app.gameOver = function() {
        if (app.bgm) app.bgm.stop();
        app.replaceScene(GameOverScene());
    };

    app.run();
});
