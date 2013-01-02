function createBackground(app, player, stage) {
    var grad = tm.graphics.LinearGradient(0, 0, 0, 320);
    grad.addColorStopList([
        { offset: 0, color: "rgba(0,0,255,0.3)" },
        { offset: 1, color: "rgba(0,0,255,0.0)" }
    ]);
    var bg = tm.app.RectangleShape(320, 320, {
        fillStyle: grad.toStyle(),
        strokeStyle: "none"
    });
    bg.x = app.width/2;
    bg.y = app.height/2;
    bg.update = function(app) {
        var c = this.canvas;
        c.clear();
        this.renderer(this._shapeParam);
        c.strokeStyle = "rgba(255,255,255,0.3)";
        var px = 1 - player.x * 0.02;
        for (var i = 0; i < 20; i++) {
            var s = app.frame % 15 * 0.2;
            var y = (i+s)*(i+s);
            c.drawLine(0, y/px, 320, y*px);
        }
    };

    return bg;
}
