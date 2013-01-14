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

var Labels = {};
(function() {

    Labels.createScore = function(player) {
        var score = tm.app.Label("", 30);

        score.update = function(app) {
            var a = Math.sin(app.frame * 0.1)*0.25 + 0.75;
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

        return score;
    };

    Labels.createHighScore = function(player) {
        var highScore = tm.app.Label("", 10);
        highScore.setFontFamily("Orbitron");
        highScore.setBaseline("bottom");
        highScore.width = 320;
        highScore.x = 4;
        highScore.y = 320 - 32;
        highScore.update = function(app) {
            var a = Math.sin(app.frame * 0.1)*0.25 + 0.75;
            if (player.y < 0) {
                this.alpha = ((player.y + 17) / 30)*a;
            } else {
                this.alpha = a;
            }
            app.highScore = Math.max(app.score, app.highScore);
            this.text = "high score:" + ~~(app.highScore);
        };

        return highScore;
    };

    Labels.createLife = function() {
        var life = tm.app.Label("", 12);
        life.update = function(app) {
            this.alpha = Math.sin(app.frame * 0.1)*0.25 + 0.75;
            this.text= "LIFE:" + app.zanki;
        };
        life.setFontFamily("Orbitron");
        life.setBaseline("top");
        life.x = 2;
        life.y = 12;
        life.width = 320;

        return life;
    };

    Labels.createMessage = function() {
        var message = tm.app.Label("", 50);
        message.setFontFamily("Orbitron");
        message.setAlign("center");
        message.setBaseline("middle");
        message.x = 160;
        message.y = 160;
        message.width = 320;
        message.update = function(app) {
            this.alpha = 0.1 + Math.sin(app.frame*0.12) * 0.1;
        };

        return message;
    };

    Labels.createBomb = function() {
        var bomb = tm.app.Label("", 12);
        bomb.update = function(app) {
            this.alpha = Math.sin(app.frame * 0.1)*0.25 + 0.75;
            this.text= "BOMB:" + app.bomb;
        };
        bomb.setFontFamily("Orbitron");
        bomb.setBaseline("top");
        bomb.x = 2;
        bomb.y = 26;
        bomb.width = 320;

        return bomb;
    };

    Labels.createFps = function() {
        var fps = tm.app.Label("fps:", 10);
        fps.setFontFamily("Orbitron");
        fps.setBaseline("top");
        fps.width = 50;
        fps.x = 320 - fps.width;
        fps.y = 24;
        (function() {
            var frameCount = -1;
            var lastUpdate = Date.now();
            fps.update = function(app) {
                this.alpha = Math.sin(app.frame * 0.1)*0.25 + 0.75;
                frameCount += 1;
                var ms = Date.now();
                if (ms - lastUpdate >= 1000) {
                    this.text = "fps:" + frameCount;
                    lastUpdate = ms;
                    frameCount = 0;
                }
            };
        })();

        return fps;
    };

    Labels.createBossHp = function(boss) {
        var bossHp = tm.app.RectangleShape(300, 5, {
            fillStyle: "white",
            strokeStyle: "none"
        });
        bossHp.x = 300*0.5 + 5;
        bossHp.y = 5;
        bossHp.update = function(app) {
            this.visible = (boss.parent !== null);
            this.alpha = Math.sin(app.frame * 0.1)*0.25 + 0.75;
            this.width = 300 * Math.max(1, boss.maxHp-boss.damagePoint) / boss.maxHp;
            if (this.width <= 1) this.remove();
            this.x = this.width*0.5 + 5;
        };

        return bossHp;
    };
    
})();
