var Bomb = {};
Bomb.createBomber = function(scene, bombParticlePool, texture) {
    var createBombParticle = function() {
        var p = new Sprite(texture);
        p.npr = true;
        p.centerX = 0;
        p.centerY = 0;
        p.texX = 4;
        p.texY = 1;
        p.radius = 0;
        p.radiusD = -0.01;
        p.angle = 0;
        p.size = 0.6;
        p.update = function() {
            this.x = this.centerX + Math.cos(this.angle) * this.radius;
            this.y = this.centerY + Math.sin(this.angle) * this.radius;
            this.angle += 0.03;
            this.radius += this.radiusD;
            this.radiusD -= 0.002;
            this.scale = (17 - this.radius) * this.size;
            this.alpha += (0 < this.radius) ? 0 : -0.01;
            if (this.alpha < 0) {
                scene.remove(this);
                bombParticlePool.readyCount+=1;
            }
        };
        return p;
    }
    for (var i = 0; i < 50; i++) {
        bombParticlePool.push(createBombParticle());
    }
    bombParticlePool.readyCount = bombParticlePool.length;

    return {
        normal: function(x, y) {
            bombParticlePool.readyCount = 0;
            for (var i = bombParticlePool.length; i--; ) {
                var p = bombParticlePool[i];
                p.centerX = x;
                p.centerY = y;
                p.radius = tm.util.Random.randfloat(16, 22);
                p.angle = (Math.PI*2/12) * (i%12);
                p.radiusD = -0.01;
                p.alpha = 1;
                p.size = 0.6;
                scene.add(p);
            }
            MUTE_SE || tm.sound.WebAudioManager.get("bomb").play();
        },
        mini: function(x, y) {
            bombParticlePool.readyCount = 0;
            for (var i = bombParticlePool.length; i--; ) {
                var p = bombParticlePool[i];
                p.centerX = x;
                p.centerY = y;
                p.radius = tm.util.Random.randfloat(6, 12);
                p.angle = (Math.PI*2/12) * (i%12);
                p.radiusD = -0.16;
                p.alpha = 0.5;
                p.size = 0.3;
                scene.add(p);
            }
            MUTE_SE || tm.sound.WebAudioManager.get("explode").play();
        }
    };
};
Bomb.clearBomb = function(scene, bombParticlePool) {
    for (var i = bombParticlePool.length; i--; ) {
        scene.remove(bombParticlePool[i]);
    }
    bombParticlePool.readyCount = bombParticlePool.length;
};