tm.main(function() {
    setTimeout(main, 500);
});

function main(){
    var e = tm.dom.Element("#c");
    var c = tm.app.CanvasApp("#c");
    c.resize(128, 32)
    c.background = "rgba(0, 12, 145, 0.1)";

    var score = tm.app.Label("warning!!", 20);
    score.fillStyle = "rgba(237, 133, 230, 0.1)";
    score.setFontFamily("Orbitron");
    score.setAlign("center");
    score.setBaseline("middle");
    score.x = 64;
    score.y = 16;
    score.width = 128;

    score.shadowColor = "#ffffff";
    score.shadowOffetX = 0;
    score.shadowOffetY = 0;
    score.shadowBlur = 10;

    c.currentScene.addChild(score);

    e.event.click(function() {
        c.canvas.saveAsImage();
    });

    c.run();
}