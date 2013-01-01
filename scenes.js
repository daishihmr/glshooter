
var TitleScene = tm.createClass({
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
                this.title.visible = false;
                this.version.visible = false;
                this.start.visible = false;
                this.bg.visible = false;
                app.pushScene(app.gameScene);
                this.startFlag = false;
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

var PauseScene = tm.createClass({
    superClass: tm.app.Scene,
    init: function() {
        this.superInit();

        var label = this.label = tm.app.Label("pause", 35);
        label.fillStyle = "#ffffff";
        label.setFontFamily("Orbitron");
        label.setAlign("center");
        label.setBaseline("middle");
        label.width = 320;
        label.x = 160;
        label.y = 160;
        this.addChild(label);
    },
    update: function(app) {
        this.label.alpha = Math.sin(app.frame*0.1) * 0.25 + 0.75;
    }
});

var GameOverScene = tm.createClass({
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
            this.start = e.app.frame;
        });
    },
    update: function(app) {
        this.gameover.alpha += 0.01;
        if (this.start + 220 === app.frame) {
            tm.social.Nineleap.postRanking(app.score, "SCORE:" + app.score);
        }
    }
});
