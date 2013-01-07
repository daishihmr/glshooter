var Bomb = {};
Bomb.fireBomber = function(gl, scene, bombParticlePool) {
    var createBombParticle = function() {
        var p = new Sprite(gl, Sprite.mainTexture);
        p.texX = 4;
        p.texY = 1;
        p.radius = 0;
        p.radiusD = -0.01;
        p.angle = 0;
        p.update = function() {
            this.x = Math.cos(this.angle) * this.radius;
            this.y = Math.sin(this.angle) * this.radius;
            this.angle += 0.01;
            this.radius += this.radiusD;
            this.radiusD -= 0.002;
            this.scale = (17 - this.radius) * 0.6;
            this.alpha = (28 - this.scale) * 0.1;
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

    return function() {
        bombParticlePool.readyCount = 0;
        for (var i = bombParticlePool.length; i--; ) {
            var p = bombParticlePool[i];
            p.radius = tm.util.Random.randfloat(16, 22);
            p.angle = (i % 12) * Math.PI*2/12 - p.radius*0.3;
            p.radiusD = -0.01;
            p.alpha = 1;
            scene.add(p);
        }
        MUTE_SE || tm.sound.SoundManager.get("bomb").play();
    };
};
Bomb.clearBomb = function(scene, bombParticlePool) {
    for (var i = bombParticlePool.length; i--; ) {
        scene.remove(bombParticlePool[i]);
    }
    bombParticlePool.readyCount = bombParticlePool.length;
};