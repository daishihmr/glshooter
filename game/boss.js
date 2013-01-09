var BOSS_HP = [ 16000, 16000, 16000 ];

var createBoss = function(app, explosion, stage, texture) {
    var Random = tm.util.Random;
    var SoundManager = tm.sound.SoundManager;
    var explode = explosion.explode;

    var boss = new Sprite(texture);
    boss.scale = 8;
    boss.texScale = 8;
    boss.alpha = 1.0;
    boss.glow = 0.5;
    boss.maxHp = BOSS_HP[stage - 1];
    boss.damagePoint = 0;
    boss.damage = function(d) {
        this.damagePoint += d;
        var scene = this.parent;
        if (boss.maxHp*0.5 < this.damagePoint) {
            // 第2形態へ
            app.clearAllBullets(true);
            SoundManager.get("explode").play();
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            var t = scene.frame + 50;
            this.update = function() {
                this.x = Math.sin(scene.frame*0.3)*0.1;
                if (t < scene.frame && (scene.frame - t) % 5 === 0 && Math.random() < 0.5) {
                    SoundManager.get("explode").play();
                    explode(this.x+Random.randfloat(-3, 3), this.y+Random.randfloat(-3, 3), Random.randfloat(0.5, 1));
                }
                if (scene.frame === t+75) {
                    this.update = Patterns["boss" + stage + "2"].createTicker(app.attackParam);
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
            SoundManager.get("explode").play();
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            explode(this.x+Random.randfloat(-2, 2), this.y+Random.randfloat(-2, 2), Random.randfloat(1, 2));
            var t = scene.frame + 50;
            this.update = function() {
                app.player.disabled = true;
                this.alpha -= 0.002;
                this.glow += 0.001;
                this.emission += 0.002;
                this.x = Math.sin(scene.frame*0.3)*0.1;
                this.y += -0.025;
                this.scale -= 0.001;
                this.rotation -= 0.03;
                if (t < scene.frame && (scene.frame - t) % 5 === 0 && Math.random() < 0.5) {
                    SoundManager.get("explode").play();
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
                        this.alpha -= 0.001;
                        this.glow -= 0.003;
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
