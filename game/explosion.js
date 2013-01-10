var Explosion = function(scene, texture) {
    var Random = tm.util.Random;

    var particles = [];
    var explodePool = [];
    for (var i = 0; i < 600; i++) {
        var e = new Sprite(texture);
        e.texX = 5;
        e.texY = 1;
        e.incrScale = 0.2;
        e.update = function() {
            this.scale += this.incrScale;
            this.alpha *= 0.9;
            if (this.alpha < 0.001) {
                scene.remove(this);
                explodePool.push(this);
            }
        }
        particles.push(e);
        explodePool.push(e);
    }

    this.explode = function(x, y, scale) {
        for (var i = Random.randint(1, 3); i--; ) {
            var e = explodePool.pop();
            if (e === void 0) return;
            e.scale = 0;
            e.alpha = 1;
            e.x = x + Random.randfloat(-0.2, 0.2);
            e.y = y + Random.randfloat(-0.2, 0.2);
            e.incrScale = scale * 0.2;
            scene.add(e);
        }
    };

    this.explodeS = function(x, y, scale) {
        var e = explodePool.pop();
        if (e === void 0) return;
        e.scale = 0;
        e.alpha = 0.6;
        e.x = x + Random.randfloat(-0.2, 0.2);
        e.y = y + Random.randfloat(-0.2, 0.2);
        e.incrScale = scale * 0.2;
        scene.add(e);
    };

    this.clearAll = function() {
        for (var i = particles.length; i--; ) {
            particles[i].alpha = 0;
        }
    };

    this.getExplodeL = function(scene) {
        var createParticle = function() {
            var p = new Sprite(texture);
            p.texX = 4;
            p.texY = 1;
            p.radius = 0;
            p.angle = 0;
            p.update = function() {
                this.age += 1;
                if (this.age < 60) {
                    this.visible = false;
                    return;
                } else {
                    this.visible = true;
                }
                this.x = Math.cos(this.angle) * this.radius;
                this.y = Math.sin(this.angle) * this.radius;
                this.radius += this.radiusD;
                if (this.scale < 18) {
                    this.scale += 0.08;
                } else {
                    this.radiusD += 0.002;
                    this.alpha -= 0.006;
                }
                if (this.alpha < 0) {
                    scene.remove(this);
                }
            };
            return p;
        }

        var pool = [];
        for (var i = 0; i < 50; i++) {
            pool.push(createParticle());
        }

        return function(callback) {
            var readyCount = 0;
            for (var i = pool.length; i--; ) {
                var p = pool[i];
                p.radius = tm.util.Random.randfloat(0.0, 0.5);
                p.angle = (Math.PI*2/12) * (i%12);
                p.radiusD = tm.util.Random.randfloat(0.02, 0.05);
                p.alpha = 1;
                p.scale = 0.5;
                p.age = 0;
                p.x = Math.cos(p.angle) * p.radius;
                p.y = Math.sin(p.angle) * p.radius;
                p.visible = false;
                p.onremoved = function() {
                    readyCount += 1;
                };
                scene.add(p);
            }
            MUTE_SE || tm.sound.SoundManager.get("bomb").play();
            var check = function() {
                if (readyCount === pool.length) {
                    callback();
                } else {
                    setTimeout(check, 5);
                }
            };
            check();
        };
    };
};
