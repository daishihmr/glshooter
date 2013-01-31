tm.main(function() {
    var e = tm.dom.Element("#c");
    var c = tm.app.CanvasApp("#c");
    c.resize(64, 64);

    var shape = tm.app.CircleShape(64, 64, {
        fillStyle: "none",
        strokeStyle: "rgba(0,0,255,1)"
    });
    shape.x = 32;
    shape.y = 32;
    c.currentScene.addChild(shape);

    e.event.click(function() {
        c.canvas.saveAsImage();
    });

    c.run();
});
