var BOSS_HP = [ 8000, 8000, 16000 ];

var createBoss = function(app, attackParam, explosion, stage, texture) {
    var Random = tm.util.Random;
    var WebAudioManager = tm.sound.WebAudioManager;
    var explode = explosion.explode;

    var boss = new Sprite(texture);
    boss.scale = (stage < 3) ? 8 : 16;
    boss.texScale = 8;
    boss.alpha = 1.0;
    boss.glow = 0.3;
    boss.maxHp = BOSS_HP[stage - 1];
    boss.damagePoint = 0;
    boss.damage = function(d) {
        this.damagePoint += d;
        var scene = this.parent;
        if (boss.maxHp*0.5 < this.damagePoint) {
            // 第2形態へ
            app.clearAllBullets(true);
            WebAudioManager.get("explode").play();
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            var t = scene.frame + 50;
            this.update = function() {
                this.x += Math.sin(scene.frame*0.3)*0.02;
                if (t < scene.frame && (scene.frame - t) % 5 === 0 && Math.random() < 0.5) {
                    WebAudioManager.get("explode").play();
                    explode(this.x+Random.randfloat(-3, 3), this.y+Random.randfloat(-3, 3), Random.randfloat(0.5, 1));
                }
                if (scene.frame === t+75) {
                    var dx = 0 - this.x;
                    var dy = 8 - this.y;
                    var sf = scene.frame;
                    this.update = function() {
                        this.x += dx / 120;
                        this.y += dy / 120;
                        if (sf + 120 === scene.frame) {
                            this.update = Patterns["boss" + stage + "2"].createTicker(attackParam);
                        }
                    };
                    this.damage = this.damage2;
                }
            };
            this.damage = function() {};
        }
    };
    boss.damage2 = function(d) {
        this.damagePoint += d;
        var scene = this.parent;

        if (boss.maxHp < this.damagePoint) {
            // 撃破
            app.player.disabled = true;
            app.clearAllBullets(true);
            WebAudioManager.get("explode").play();
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            var t = scene.frame + 50;
            var dy = 0 - this.y;
            this.update = function() {
                app.player.disabled = true;
                this.glow += 0.001;
                this.emission += 0.002;
                this.x += Math.sin(scene.frame*0.3)*0.02;
                this.y += dy / (250+60);
                this.scale -= 0.005;
                this.rotation -= 0.03;
                if (t < scene.frame && (scene.frame - t) % 5 === 0 && Math.random() < 0.5) {
                    WebAudioManager.get("explode").play();
                    explode(this.x+Random.randfloat(-3, 3), this.y+Random.randfloat(-3, 3), Random.randfloat(0.5, 1));
                }
                if (scene.frame === t + 250) {
                    var explodeL = explosion.getExplodeL(scene);
                    var self = this;
                    explodeL(function() {
                        self.killed();
                    });
                } else if (scene.frame === t + 250+60) {
                    this.update = function() {
                        this.x += Math.sin(scene.frame*0.3)*0.02;
                        this.y += dy / (250+60);
                        this.scale -= 0.003;
                        this.rotation -= 0.03;
                        this.alpha -= 0.01;
                        this.glow -= 0.01;
                        if (this.alpha <= 0) {
                            scene.remove(this);
                        }
                    };
                }
            };
            this.damage = function() {};
        }
    }

    return boss;
};
