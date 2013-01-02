function createBackground(app, player, stage) {
    stage = 2;
    return [
        function() {
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
        },
        function() {
            var grad = tm.graphics.RadialGradient(160, 80, 0, 160, 160, 160*1.5);
            grad.addColorStopList([
                { offset: 0, color: "rgba(0,0,255,0.20)" },
                { offset: 1, color: "rgba(0,0,255,0.10)" }
            ]);
            var grad2 = tm.graphics.RadialGradient(160, 80, 0, 160, 160, 160*1.5);
            grad2.addColorStopList([
                { offset: 0, color: "rgba(255,255,255,0)" },
                { offset: 1, color: "rgba(255,255,255,0.1)" }
            ]);

            var polygons = [];
            for (var i = 0; i < 7; i++) {
                polygons.push({
                    x: Math.random() * 20 - 10,
                    y: Math.random() * 20 - 10,
                    z: Math.random() * -10
                });
            }

            var bg = tm.app.RectangleShape(320, 320, {
                fillStyle: grad.toStyle(),
                strokeStyle: "none"
            });
            bg.x = app.width/2;
            bg.y = app.height/2;
            // bg.canvas.strokeStyle = grad2.toStyle();
            bg.update = function(app) {
                var c = this.canvas;
                c.clear();
                this.renderer(this._shapeParam);
                for (var i = polygons.length; i--; ) {
                    var p = polygons[i];
                    p.z += 1;


                    var modelMat = mat4.identity(mat4.create());
                    var viewMat = mat4.identity(mat4.create());
                    var projMat = mat4.identity(mat4.create());
                    var mvpMat = mat4.identity(mat4.create());
                    mat4.lookAt([0,1,3], [0,0,0], [0,1,0], viewMat)
                    mat4.perspective(90, 1/1, 0.1, 100, projMat);

                    mat4.translate(modelMat, [0, 0, p.z], modelMat);

                    mat4.multiply(projMat, viewMat, mvpMat);
                    mat4.multiply(mvpMat, modelMat, mvpMat);

                    var result = vec4.create([p.x, p.y, 0, 1]);
                    mat4.multiplyVec4(mvpMat, result, result);



                    c.strokePolygon(result[0]+160, result[1]+160, 10, 8);
                }
            };

            return bg;
        }
    ][stage-1]();
}
