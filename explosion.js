var Explosion = function(gl, scene, texture0) {
    var Random = tm.util.Random;

    var explodePool = [];
    for (var i = 0; i < 600; i++) {
        var e = new Sprite(gl, texture0);
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
};
