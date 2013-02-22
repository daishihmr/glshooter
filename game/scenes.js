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

var TitleScene;
var PauseScene;
var ConfirmScene;
var PracticeScene;
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
        init: function() {
            this.superInit();

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

            var version = this.version = tm.app.Label("version 1.0", 10);
            version.setFontFamily("Orbitron");
            version.setAlign("end");
            version.setBaseline("middle");
            version.width = 320;
            version.x = 270;
            version.y = 120;
            version.alpha = 0;
            this.addChild(version);

            this.menuItem = [];
            var start = this.menuItem[0] = createLabel("game start", 20, 160, 170);
            this.addChild(start);
            var practice = this.menuItem[1] = createLabel("practice", 20, 160, 210);
            this.addChild(practice);
            var settings = this.menuItem[2] = createLabel("setting", 20, 160, 250);
            this.addChild(settings);
            var exit = this.menuItem[3] = createLabel("exit", 20, 160, 290);
            this.addChild(exit);

            this.selection = 0;

            this.addEventListener("enter", function() {
                this.startFlag = false;

                this.title.visible = true;
                this.version.visible = true;
                this.bg.visible = true;
                this.title.alpha = 0;
                this.version.alpha = 0;

                this.menuItem.forEach(function(l) {
                    l.visible = true;
                });
            });
        },
        update: function(app) {
            if (!this.startFlag) {
                // keyboard
                if (app.keyboard.getKeyDown("down")) {
                    this.selection += 1;
                    if (this.selection === this.menuItem.length) this.selection = 0;
                } else if (app.keyboard.getKeyDown("up")) {
                    this.selection -= 1;
                    if (this.selection === -1) this.selection = this.menuItem.length - 1;
                } else if (1 < app.pointing.deltaPosition.length()) {
                    // mouse
                    var px = app.pointing.x * 320 / parseInt(app.element.style.width);
                    var py = app.pointing.y * 320 / parseInt(app.element.style.height);
                    for (var i = this.menuItem.length; i--; ) {
                        if (this.menuItem[i].isHitPointRect(px, py)) {
                            this.selection = i;
                        }
                    }
                }

                if (app.keyboard.getKeyDown("space") || app.pointing.getPointingEnd()) {
                    switch (this.selection) {
                    case 0: // game start
                        this.startFlag = true;
                        START_STAGE = 1;
                        NUM_OF_STAGE = 3;
                        app.practiceMode = false;
                        MUTE_SE || tm.sound.WebAudioManager.get("effect0").play();
                        break;
                    case 1: // practice
                        app.pointing.button = 0; app.pointing.update();
                        app.pushScene(app.practiceScene);
                        break;
                    case 2: // setting
                        app.pointing.button = 0; app.pointing.update();
                        app.pushScene(app.settingScene);
                        break;
                    case 3: // exit
                        app.allStageClear = false;
                        app.gameOver();
                        break;
                    }
                }
            }

            // menu item color
            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"

            if (this.startFlag) { // game start (fade out)
                this.title.alpha -= 0.01;
                this.version.alpha -= 0.01;
                if (this.title.alpha <= 0) {
                    this.title.visible = false;
                    this.version.visible = false;
                    this.bg.visible = false;
                    this.menuItem.forEach(function(l) {
                        l.visible = false;
                    });
                    app.pushScene(app.gameScene);
                    app.gameStart();
                }
            } else { // fade in
                this.title.alpha += 0.01;
                this.version.alpha += 0.01;
                if (1 < this.title.alpha) this.title.alpha = 1;
                if (1 < this.version.alpha) this.version.alpha = 1;
            }

            // background
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
            this.menuItem[1] = createLabel("restart stage", 20, 160, 180);
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
            } else if (1 < app.pointing.deltaPosition.length()) {
                var px = app.pointing.x * 320 / parseInt(app.element.style.width);
                var py = app.pointing.y * 320 / parseInt(app.element.style.height);
                for (var i = this.menuItem.length; i--; ) {
                    if (this.menuItem[i].isHitPointRect(px, py)) {
                        this.selection = i;
                    }
                }
            }

            if (app.keyboard.getKeyDown("space") || app.pointing.getPointingEnd()) {
                switch (this.selection) {
                case 0: // resume
                    app.popScene();
                    break;
                case 1: // restart
                    app.pushScene(app.confirmScene);
                    break;
                case 2: // setting
                    app.pointing.button = 0; app.pointing.update();
                    app.pushScene(app.settingScene);
                    break;
                case 3: // back to title
                    app.pointing.button = 0; app.pointing.update();
                    app.pushScene(app.confirmScene);
                    break;
                }
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
            } else if (1 < app.pointing.deltaPosition.length()) {
                var px = app.pointing.x * 320 / parseInt(app.element.style.width);
                var py = app.pointing.y * 320 / parseInt(app.element.style.height);
                for (var i = this.menuItem.length; i--; ) {
                    if (this.menuItem[i].isHitPointRect(px, py)) {
                        this.selection = i;
                    }
                }
            }

            if (app.keyboard.getKeyDown("space") || app.pointing.getPointingEnd()) {
                switch (this.selection) {
                case 0:
                    if (app.pauseScene.selection === 1) { // restart
                        app.continueCount += 1;
                        app.resetGameStatus();
                        app.stageStart();
                        app.popScene(); // pop this
                        app.popScene(); // pop pauseScene
                    } else if (app.pauseScene.selection === 3) { // back to title
                        app.popScene(); // pop this
                        app.popScene(); // pop pauseScene
                        app.popScene(); // pop gameScene
                        app.pointing.button = 0; app.pointing.update();
                        if (app.bgm) app.bgm.stop();
                    }
                    break;
                case 1:
                    app.popScene();
                    break;
                }
            }

            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"
        }
    });

    PracticeScene = tm.createClass({
        superClass: tm.app.Scene,
        init: function(app) {
            this.superInit();

            var bg = tm.app.RectangleShape(320, 320, {
                fillStyle: "rgba(0,0,0,0.97)",
                strokeStyle: "none"
            });
            bg.x = 160;
            bg.y = 160;
            this.addChild(bg);

            var title = createLabel("stage select", 35, 160, 60);
            title.fillStyle = "#ffffff";
            this.addChild(title);

            this.menuItem = [];
            this.menuItem[0] = createLabel("stage 1", 20, 160, 130);
            this.menuItem[1] = createLabel("stage 2", 20, 160, 180);
            this.menuItem[2] = createLabel("stage 3", 20, 160, 230);
            this.menuItem[3] = createLabel("back", 20, 160, 280);
            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].setAlign("center");
                this.addChild(this.menuItem[i]);
            }

            this.selection = 0;
            this.addEventListener("enter", function() {
            });

            this.addEventListener("exit", function() {
            });
        },
        update: function(app) {
            var px = app.pointing.x * 320 / parseInt(app.element.style.width);
            var py = app.pointing.y * 320 / parseInt(app.element.style.height);

            if (app.keyboard.getKeyDown("down")) {
                this.selection += 1;
                if (this.selection === this.menuItem.length) this.selection = 0;
            } else if (app.keyboard.getKeyDown("up")) {
                this.selection -= 1;
                if (this.selection === -1) this.selection = this.menuItem.length - 1;
            } else if (1 < app.pointing.deltaPosition.length()) {
                for (var i = this.menuItem.length; i--; ) {
                    if (this.menuItem[i].isHitPointRect(px, py)) {
                        this.selection = i;
                    }
                }
            }
            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"

            if (app.keyboard.getKeyDown("space") || app.pointing.getPointing()) {
                switch (this.selection) {
                case 0: // stage 1
                    START_STAGE = 1;
                    NUM_OF_STAGE = 1;
                    app.pointing.button = 0; app.pointing.update();
                    app.popScene();
                    app.titleScene.startFlag = true;
                    app.practiceMode = true;
                    break;
                case 1: // stage 2
                    START_STAGE = 2;
                    NUM_OF_STAGE = 2;
                    app.pointing.button = 0; app.pointing.update();
                    app.popScene();
                    app.titleScene.startFlag = true;
                    app.practiceMode = true;
                    break;
                case 2: // stage 3
                    START_STAGE = 3;
                    NUM_OF_STAGE = 3;
                    app.pointing.button = 0; app.pointing.update();
                    app.popScene();
                    app.titleScene.startFlag = true;
                    app.practiceMode = true;
                    break;
                case 3: // back
                    app.pointing.button = 0; app.pointing.update();
                    app.popScene();
                    break;
                }
            }
        }
    });

    SettingScene = tm.createClass({
        superClass: tm.app.Scene,
        init: function(app) {
            this.superInit();

            var bg = tm.app.RectangleShape(320, 320, {
                fillStyle: "rgba(0,0,0,0.97)",
                strokeStyle: "none"
            });
            bg.x = 160;
            bg.y = 160;
            this.addChild(bg);

            var title = createLabel("setting", 35, 160, 60);
            title.fillStyle = "#ffffff";
            this.addChild(title);

            this.menuItem = [];
            this.menuItem[0] = createLabel("bgm", 20, 60, 130);
            this.menuItem[1] = createLabel("sound", 20, 60, 180);
            this.menuItem[2] = createLabel("auto bomb", 20, 60, 230);
            this.menuItem[3] = createLabel("back", 20, 60, 280);
            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].setAlign("left");
                this.addChild(this.menuItem[i]);
            }

            this.addEventListener("enter", function() {
                this.selection = 0;
            });
            this.doSetting = function(selection, updown) {
                switch(selection) {
                case 0:
                    app.settings["bgm"] += 0.01*updown;
                    app.settings["bgm"] = Math.clamp(app.settings["bgm"]+0.01*updown, 0, 1);
                    if (app.bgm) app.bgm.volume = app.settings["bgm"];
                    break;
                case 1:
                    app.settings["se"] = Math.clamp(app.settings["se"]+0.01*updown, 0, 1);
                    break;
                }
            };

            this.addEventListener("exit", function() {
                localStorage.setItem("jp.dev7.glshooter.settings", JSON.stringify(app.settings));
                app.setVolumeSe();
            });
        },
        update: function(app) {
            var px = app.pointing.x * 320 / parseInt(app.element.style.width);
            var py = app.pointing.y * 320 / parseInt(app.element.style.height);

            if (app.keyboard.getKeyDown("down")) {
                this.selection += 1;
                if (this.selection === this.menuItem.length) this.selection = 0;
            } else if (app.keyboard.getKeyDown("up")) {
                this.selection -= 1;
                if (this.selection === -1) this.selection = this.menuItem.length - 1;
            } else if (1 < app.pointing.deltaPosition.length()) {
                for (var i = this.menuItem.length; i--; ) {
                    if (this.menuItem[i].isHitPointRect(px, py)) {
                        this.selection = i;
                    }
                }
            }

            if (app.keyboard.getKey("right")) {
                this.doSetting(this.selection, 1);
            } else if (app.keyboard.getKey("left")) {
                this.doSetting(this.selection, -1);
            }
            if (app.keyboard.getKeyDown("right") || app.keyboard.getKeyDown("left")) {
                switch (this.selection) {
                case 2: // autoBomb
                    app.settings["autoBomb"] = !app.settings["autoBomb"];
                    break;
                }
            }

            if (this.selection === 1) {
                if (!MUTE_SE && (app.keyboard.getKeyUp("right") || app.keyboard.getKeyUp("left") || app.pointing.getPointingEnd())) {
                    var s = tm.sound.WebAudioManager.get("explode");
                    s.volume = app.settings["se"];
                    s.play();
                }
            }

            if (app.keyboard.getKeyDown("space") || app.pointing.getPointing()) {
                switch (this.selection) {
                case 0: // bgm
                case 1: // se
                    if (px < 160) this.doSetting(this.selection, -1);
                    else this.doSetting(this.selection, 1);
                    break;
                case 3: // back
                    app.popScene();
                    app.pointing.button = 0; app.pointing.update();
                    break;
                }
            }
            if (app.pointing.getPointingEnd()) {
                switch (this.selection) {
                case 2: // autoBomb
                    app.settings["autoBomb"] = !app.settings["autoBomb"];
                    break;
                }
            }

            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"

            this.menuItem[0].text = "bgm          " + ~~(app.settings["bgm"]*100);
            this.menuItem[1].text = "sound      " + ~~(app.settings["se"]*100);
            this.menuItem[2].text = "auto bomb  " + (app.settings["autoBomb"] ? "ON": "OFF");
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
            if (0.5 < this.gameover.alpha) {
                this.update = function() {};
                app.highScore = Math.max(app.score, app.highScore);
                var status = [];
                if (app.allStageClear) {
                    status[status.length] = "ALL STAGE CLEAR!"
                    var star = 0;
                    if (app.useBombCount === 0) {
                        status[status.length] = "no bomb";
                        star += 1;
                    }
                    if (app.missCount === 0) {
                        status[status.length] = "no miss";
                        star += 1;
                    }
                    if (app.continueCount === 0) {
                        status[status.length] = "no continue"
                        star += 1;
                    }
                    status[status.length] = "☆".repeat(star);
                } else {
                    status[status.length] = "stage: " + app.currentStage;
                    status[status.length] = "continue: " + app.continueCount;
                }
                var message = "SCORE: {score} ({status})".format({
                    score: ~~(app.highScore),
                    status: status.join(" ")
                });
                console.log("entry 9leap", ~~(app.highScore), message);
                tm.social.Nineleap.postRanking(~~(app.highScore), message);
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
            } else if (1 < app.pointing.deltaPosition.length()) {
                var px = app.pointing.x * 320 / parseInt(app.element.style.width);
                var py = app.pointing.y * 320 / parseInt(app.element.style.height);
                for (var i = this.menuItem.length; i--; ) {
                    if (this.menuItem[i].isHitPointRect(px, py)) {
                        this.selection = i;
                    }
                }
            }

            if (app.keyboard.getKeyDown("space") || app.pointing.getPointingEnd()) {
                app.popScene();
                switch(this.selection) {
                case 0:
                    app.gameContinue();
                    return;
                case 1:
                    app.gameOver();
                    return;
                }
            }

            for (var i = this.menuItem.length; i--; ) {
                this.menuItem[i].fillStyle = "#333";
            }
            this.menuItem[this.selection].fillStyle = "#fff"
        }
    });

})();
