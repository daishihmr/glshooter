var TitleScene;
var PauseScene;
var ConfirmScene;
var SettingScene;
var GameOverScene;
var ContinueScene;

(function() {

    var createLabel = function(text, size, x, y) {
        var label = this.label = tm.app.Label(text, size);
        label.fillStyle = "#333";
        label.setFontFamily("Orbitron");
        label.setAlign("center");
        label.setBaseline("middle");
        label.width = 320;
        label.x = x;
        label.y = y;
        label.addEventListener("enterframe", function(e) {
            this.alpha = Math.sin(e.app.frame*0.1) * 0.25 + 0.75;
        });
        return label;
    };

    TitleScene = tm.createClass({
        superClass: tm.app.Scene,
        init: function(mouse) {
            this.superInit();

            this.mouse = mouse;

            this.startFlag = false;

            var bgGrad = tm.graphics.LinearGradient(0, 0, 0, 320);
            bgGrad.addColorStopList([
                { offset: 0, color: "rgba(0,0,255,0.3)" },
                { offset: 1, color: "rgba(0,0,255,0.0)" }
            ]);
            var bg = this.bg = tm.app.RectangleShape(320, 320, {
                fillStyle: bgGrad.toStyle(),
                strokeStyle: "none"
            });
            bg.x = 160;
            bg.y = 160;
            bg.blendMode = "lighter";
            this.addChild(bg);

            var titleGrad = tm.graphics.LinearGradient(0, 0, 20, 30);
            titleGrad.addColorStopList([
                {offset:0.0, color:"rgba(255,255,255,1.0)"},
                {offset:0.5, color:"rgba(120,120,255,1.0)"},
                {offset:1.0, color:"rgba(255,255,255,1.0)"},
            ]);

            var title = this.title = tm.app.Label("GL-Shooter", 35);
            title.fillStyle = titleGrad.toStyle();
            title.setFontFamily("Orbitron");
            title.setAlign("center");
            title.setBaseline("middle");
            title.width = 320;
            title.x = 160;
            title.y = 100;
            title.alpha = 0;
            this.addChild(title);

            var version = this.version = tm.app.Label("version 1.0 beta", 10);
            version.setFontFamily("Orbitron");
            version.setAlign("end");
            version.setBaseline("middle");
            version.width = 320;
            version.x = 270;
            version.y = 120;
            version.alpha = 0;
            this.addChild(version);

            var start = this.start = tm.app.Label("PRESS (Z) KEY FOR START", 15);
            start.setFontFamily("Orbitron");
            start.setAlign("center");
            start.setBaseline("middle");
            start.width = 320;
            start.x = 160;
            start.y = 240;
            start.alpha = 0;
            this.addChild(start);

            this.addEventListener("enter", function() {
                this.title.visible = true;
                this.version.visible = true;
                this.start.visible = true;
                this.bg.visible = true;
                this.title.alpha = 0;
                this.version.alpha = 0;
            });
        },
        update: function(app) {
            this.start.alpha = Math.sin(app.frame*0.1) * 0.25 + 0.75;
            if (app.keyboard.getKeyDown("z") || this.mouse.getPointing()) {
                this.startFlag = true;
                MUTE_SE || tm.sound.SoundManager.get("effect0").play();
            }

            if (this.startFlag) {
                this.title.alpha -= 0.01;
                this.version.alpha -= 0.01;
                this.start.visible = false;

                if (this.title.alpha < 0) {
                    this.startFlag = false;
                    this.title.visible = false;
                    this.version.visible = false;
                    this.start.visible = false;
                    this.bg.visible = false;
                    app.pushScene(app.gameScene);
                    app.stageStart();
                }
            } else {
                this.title.alpha += 0.01;
                this.version.alpha += 0.01;
                if (1 < this.title.alpha) this.title.alpha = 1;
                if (1 < this.version.alpha) this.version.alpha = 1;
            }

            var p = tm.app.Sprite(32, 32, tm.graphics.TextureManager.get("texture0"));
            p.setFrameIndex(12, 64, 64);
            p.dir = Math.random() * Math.PI * 2;
            p.x = Math.cos(p.dir) * 160;
            p.y = Math.sin(p.dir) * 160;
            p.alpha = 0;
            p.update = function() {
                this.alpha += 0.01;
                this.x -= Math.cos(this.dir);
                this.y -= Math.sin(this.dir);
                this.scale.x += 0.01;
                this.scale.y += 0.01;
                if (this.x*this.x+this.y*this.y < 2) this.remove();
            };
            this.bg.addChild(p);
        }
    });

    PauseScene = tm.createClass({
        superClass: tm.app.Scene,
        init: function() {
            this.superInit();

            var bg = tm.app.RectangleShape(320, 320, {
                fillStyle: "rgba(0,0,0,0.7)",
                strokeStyle: "none"
            });
            bg.x = 160;
            bg.y = 160;
            this.addChild(bg);

            var title = createLabel("pause", 35, 160, 60);
            title.fillStyle = "#ffffff";
            this.addChild(title);

            this.menuItem = [];
            this.menuItem[0] = createLabel("resume", 20, 160, 130);
            this.menuItem[1] = createLabel("restart", 20, 160, 180);
            this.menuItem[2] = createLabel("setting", 20, 160, 230);
            this.menuItem[3] = createLabel("back to title", 20, 160, 280);
            for (var i = this.menuItem.length; i--; ) {
                this.addChild(this.menuItem[i]);
            }

            this.selection = 0;
            this.addEventListener("enter", function() {
                this.selection = 0;
            });
        },
        update: function(app) {
            if (app.keyboard.getKeyDown("down")) {
                this.selection += 1;
                if (this.selection === this.menuItem.length) this.selection = 0;
            } else if (app.keyboard.getKeyDown("up")) {
                this.selection -= 1;
                if (this.selection === -1) this.selection = this.menuItem.length - 1;
            }

            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"
        }
    });

    ConfirmScene = tm.createClass({
        superClass: tm.app.Scene,
        init: function() {
            this.superInit();

            var bg = tm.app.RectangleShape(320, 320, {
                fillStyle: "rgba(0,0,0,0.9)",
                strokeStyle: "none"
            });
            bg.x = 160;
            bg.y = 160;
            this.addChild(bg);

            var title = createLabel("really?", 35, 160, 60);
            title.fillStyle = "#ffffff";
            this.addChild(title);

            this.menuItem = [];
            this.menuItem[0] = createLabel("ok", 20, 80, 160);
            this.menuItem[1] = createLabel("no", 20, 240, 160);
            for (var i = this.menuItem.length; i--; ) {
                this.addChild(this.menuItem[i]);
            }

            this.selection = 1;
            this.addEventListener("enter", function() {
                this.selection = 1;
            });
        },
        update: function(app) {
            if (app.keyboard.getKeyDown("right")) {
                this.selection += 1;
                if (this.selection === this.menuItem.length) this.selection = 0;
            } else if (app.keyboard.getKeyDown("left")) {
                this.selection -= 1;
                if (this.selection === -1) this.selection = this.menuItem.length - 1;
            }

            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"
        }
    });

    SettingScene = tm.createClass({
        superClass: tm.app.Scene,
        init: function(app) {
            this.superInit();

            var bg = tm.app.RectangleShape(320, 320, {
                fillStyle: "rgba(0,0,0,0.9)",
                strokeStyle: "none"
            });
            bg.x = 160;
            bg.y = 160;
            this.addChild(bg);

            var title = createLabel("setting", 35, 160, 60);
            title.fillStyle = "#ffffff";
            this.addChild(title);

            this.menuItem = [];
            this.menuItem[0] = createLabel("bgm", 20, 100, 130);
            this.menuItem[1] = createLabel("sound", 20, 100, 180);
            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].setAlign("left");
                this.addChild(this.menuItem[i]);
            }

            var settings = this.settings = {
                bgm: 0,
                se: 0
            };
            this.selection = 0;
            this.addEventListener("enter", function() {
                if (app.bgm) settings.bgm = app.bgm.volume;
                settings.se = app.volumeSe;
                this.selection = 0;
            });
            this.doSetting = function(selection, updown) {
                switch(selection) {
                case 0:
                    settings.bgm += 0.01*updown;
                    if (settings.bgm < 0) settings.bgm = 0;
                    else if (1 < settings.bgm) settings.bgm = 1;
                    app.bgm.volume = settings.bgm;
                    break;
                case 1:
                    settings.se += 0.01*updown;
                    if (settings.se < 0) settings.se = 0;
                    else if (1 < settings.se) settings.se = 1;
                    app.volumeSe = settings.se;
                    break;
                }
            };

            this.addEventListener("exit", function() {
                var s = JSON.parse(localStorage.getItem("jp.dev7.glshooter.settings"));
                s.bgm = settings.bgm;
                s.se = settings.se;
                localStorage.setItem("jp.dev7.glshooter.settings", JSON.stringify(s));
            });
        },
        update: function(app) {
            if (app.keyboard.getKeyDown("down")) {
                this.selection += 1;
                if (this.selection === this.menuItem.length) this.selection = 0;
            } else if (app.keyboard.getKeyDown("up")) {
                this.selection -= 1;
                if (this.selection === -1) this.selection = this.menuItem.length - 1;
            }
            if (app.keyboard.getKey("right")) {
                this.doSetting(this.selection, 1);
            } else if (app.keyboard.getKey("left")) {
                this.doSetting(this.selection, -1);
            }

            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"

            this.menuItem[0].text = "bgm          " + ~~(this.settings.bgm*100);
            this.menuItem[1].text = "sound      " + ~~(this.settings.se*100);
        }
    });

    GameOverScene = tm.createClass({
        superClass: tm.app.Scene,
        init: function() {
            this.superInit();

            var gameover = this.gameover = tm.app.Label("Game Over", 35);
            gameover.fillStyle = "rgba(0,0,255,0.6)";
            gameover.setFontFamily("Orbitron");
            gameover.setAlign("center");
            gameover.setBaseline("middle");
            gameover.width = 320;
            gameover.x = 160;
            gameover.y = 160;
            gameover.alpha = 0;
            this.addChild(gameover);

            this.addEventListener("enter", function(e) {
                var app = e.app;
                this.start = app.frame;
            });
        },
        update: function(app) {
            this.gameover.alpha += 0.01;
            if (this.start + 220 === app.frame) {
                app.highScore = Math.max(app.score, app.highScore);
                console.log("entry 9leap", ~~(app.highScore), "SCORE:" + ~~(app.highScore));
                tm.social.Nineleap.postRanking(~~(app.highScore), "SCORE:" + ~~(app.highScore));
            }
        }
    });

    ContinueScene = tm.createClass({
        superClass: tm.app.Scene,
        init: function() {
            this.superInit();

            var bg = tm.app.RectangleShape(320, 320, {
                fillStyle: "rgba(0,0,0,0.3)",
                strokeStyle: "none"
            });
            bg.x = 160;
            bg.y = 160;
            this.addChild(bg);

            var title = createLabel("continue?", 35, 160, 60);
            title.fillStyle = "#ffffff";
            this.addChild(title);

            this.menuItem = [];
            this.menuItem[0] = createLabel("yes", 20, 80, 160);
            this.menuItem[1] = createLabel("no", 20, 240, 160);
            for (var i = this.menuItem.length; i--; ) {
                this.addChild(this.menuItem[i]);
            }

            this.selection = 0;
            this.addEventListener("enter", function() {
                this.selection = 0;
            });
        },
        update: function(app) {
            if (app.keyboard.getKeyDown("right")) {
                this.selection += 1;
                if (this.selection === this.menuItem.length) this.selection = 0;
            } else if (app.keyboard.getKeyDown("left")) {
                this.selection -= 1;
                if (this.selection === -1) this.selection = this.menuItem.length - 1;
            }

            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"
        }
    });

})();
