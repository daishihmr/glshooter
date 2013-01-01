tm.main(function() {
    setTimeout(main, 5);
});

function main(){
    var e = tm.dom.Element("#c");
    var c = tm.graphics.Canvas("#c");
    // c.resize(64, 64);
    c.resize(64,64)
    c.globalCompositeOperation = "lighter";

    var g = tm.graphics.RadialGradient(32,32,0,32,32,32);
    g.addColorStopList([
        {offset:0.0 ,color:"rgba(180,180,255,1.0)"},
        {offset:0.8 ,color:"rgba(0,0,255,0.5)"},
        {offset:1.0 ,color:"rgba(0,0,255,0.2)"}
    ]);
    c.fillStyle = g.toStyle();
    c.strokeStyle = "#88f";

    c.fillStar(32, 32, 30, 6, 0.8);

    // c.globalCompositeOperation = "source-over";
    c.fillStyle = "white";
    c.strokeStyle = "white";
    c.setText("40px Silom", "center", "middle");
    // c.fillText("B", 32, 32+4);
    c.setShadow("white", 0, 0, 3);
    c.strokeText("B", 32, 32+3);
    c.setLineStyle(2);
    c.setShadow("blue", 0, 0, 10);
    c.strokeStar(32, 32, 28, 6, 0.8);

    e.event.click(function() {
        c.saveAsImage();
    });
}