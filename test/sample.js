tm.preload(function() {
    tm.util.FileManager.load("vs", { url: "../shaders/shader.vs", type: "GET" });
    tm.util.FileManager.load("fs", { url: "../shaders/shader.fs", type: "GET" });
    tm.graphics.TextureManager.add("main", "../images/texture0.png");
});

tm.main(function() {

    // canvas
    var glCanvas = document.getElementById("canvas3d");
    var scene = new Scene(
        glCanvas, 
        tm.util.FileManager.get("vs").data, 
        tm.util.FileManager.get("fs").data
    );
    scene.gl.clearColor(0, 0, 0, 1.0);

    // テクスチャ
    var textures = {};
    for (var name in tm.graphics.TextureManager.textures) {
        textures[name] = createTexture(scene.gl, tm.graphics.TextureManager.get(name).element);
    }
    Sprite.mainTexture = textures["main"];

    // 自機
    var player = new Sprite(Sprite.mainTexture);
    player.glow = 1.0;
    player.texX = 3;
    player.texY = 0;
    player.scale = 1.5;
    player.x = 0;
    player.y = -7;
    scene.add(player);

    // 敵
    for (var i = 0; i < 5; i++) {

        var enemy = new Sprite(Sprite.mainTexture);
        enemy.glow = 1.0;
        enemy.texX = 4;
        enemy.texY = 2;
        enemy.x = 5 + i*1.5;
        enemy.y = 20;
        scene.add(enemy);

        // 攻撃パターン(game/patterns.jsを参照)
        enemy.update = Patterns["zakoG1L"].createTicker(attackParam(player));

    }

    // キーボード
    var keyboard = tm.input.Keyboard();

    // FPS表示
    var fps = document.getElementById("fps");

    // メインループ
    var frameCount = -1;
    var lastUpdate = Date.now();
    var tick = function() {
        keyboard.update();

        scene.update();
        scene.draw();

        if (keyboard.getKey("up"))          player.y += 0.2;
        else if (keyboard.getKey("down"))   player.y -= 0.2;
        if (keyboard.getKey("right"))       player.x += 0.2;
        else if (keyboard.getKey("left"))   player.x -= 0.2;

        frameCount += 1;
        var now = Date.now();
        if (now - lastUpdate >= 1000) {
            fps.textContent = "fps = " + frameCount;
            lastUpdate = now;
            frameCount = 0;
        }
    };
    tm.setLoop(tick, 1000/60);
});

// 攻撃パターン用パラメータ
var attackParam = function(target) {
    return {
        target: target,
        rank: 0.5,
        bulletFactory: function(spec) {
            var b = new Sprite(Sprite.mainTexture);
            b.texX = 3;
            b.texY = 1;
            b.scale = 0.6;
            if (spec.label === null || spec.label === void 0) {
                b.texX = 3;
                b.texY = 1;
            } else if (spec.label === "g" || spec.label.indexOf("green") === 0) {
                b.texX = 2;
                b.texY = 1;
            } else if (spec.label === "b" || spec.label.indexOf("blue") === 0) {
                b.texX = 1;
                b.texY = 1;
            } else if (spec.label.indexOf("bit") !== -1) {
                b.alive = true;
                b.texX = 7;
                b.texY = 7;
            } else {
                b.texX = 3;
                b.texY = 1;
            }

            if (spec.label && spec.label.indexOf("alive") !== -1) {
                b.alive =  true;
            }

            if (spec.label === "s") {
                b.scale = 0.4;
            } else if (spec.label === "sg") {
                b.scale = 0.4;
                b.texX = 2;
                b.texY = 1;
            } else if (spec.label === "sb") {
                b.scale = 0.4;
                b.texX = 1;
                b.texY = 1;
            }
            return b;
        },
        isInsideOfWorld: function(b) {
            return -22 < b.x && b.x < 22 && -22 < b.y && b.y < 22;
        },
        updateProperties: false,
        speedRate: 0.1
    };
};
