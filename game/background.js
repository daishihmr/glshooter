/**
 * @author daishihmr
 * @version 1.5
 *
 * The MIT License (MIT)
 * Copyright (c) 2012 dev7.jp
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

function createBackground(app, player, stage) {
    if (stage === 1) {
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
    } else if (stage === 2) {
        var grad = tm.graphics.RadialGradient(160, 160, 0, 160, 160, 160*1.5);
        grad.addColorStopList([
            { offset: 0, color: "rgba(0,0,255,0.15)" },
            { offset: 1, color: "rgba(0,0,255,0.10)" }
        ]);
        var grad2 = tm.graphics.RadialGradient(160, 160, 0, 160, 160, 160*1.5);
        grad2.addColorStopList([
            { offset: 0.0, color: "rgba(255,255,255,0.0)" },
            { offset: 0.1, color: "rgba(255,255,255,0.2)" },
            { offset: 1.0, color: "rgba(255,255,255,0.6)" },
        ]);

        var polygons = [];
        for (var i = -16; i < 16; i++) {
            polygons.push({
                z: i
            });
        }

        var bg = tm.app.RectangleShape(320, 320, {
            fillStyle: grad.toStyle(),
            strokeStyle: "none"
        });
        bg.x = app.width/2;
        bg.y = app.height/2;

        var viewMat = mat4.identity(mat4.create());
        var projMat = mat4.identity(mat4.create());
        var mvpMat = mat4.identity(mat4.create());
        mat4.lookAt([0,0,0], [0,0,-1], [0,1,0], viewMat)
        mat4.perspective(90, 1/1, 0.1, 32, projMat);
        mat4.multiply(projMat, viewMat, mvpMat);

        var canvas = bg.canvas;
        canvas.strokeStyle = grad2.toStyle();
        bg.update = function(app) {
            var px = player.x * -4;
            var py = player.y *  4;
            var x = Math.cos(app.frame*0.02)*30 + px;
            var y = Math.sin(app.frame*0.02)*30 + py;
            canvas.clear();
            this.renderer(this._shapeParam);
            for (var i = polygons.length; i--; ) {
                var p = polygons[i];
                p.z += 0.04;

                var result = vec4.create([x, y, p.z, 1]);
                mat4.multiplyVec4(mvpMat, result);

                if (16 < p.z) {
                    p.z -= 32;
                } else if (0 < result[3]) {
                    canvas.strokePolygon(
                        result[0] / result[3] + 160,
                        result[1] / result[3] + 160,
                        50 / result[3],
                        8,
                        app.frame);
                }
            }
        };

        return bg;
    } else if (stage === 3) {
        var grad = tm.graphics.LinearGradient(0, 0, 0, 320);
        grad.addColorStopList([
            { offset: 0.0, color: "rgba(0,0,255,0.00)" },
            { offset: 0.5, color: "rgba(0,0,255,0.20)" },
            { offset: 1.0, color: "rgba(0,0,255,0.00)" }
        ]);
        var grad2 = tm.graphics.LinearGradient(0, 0, 320, 0);
        grad2.addColorStopList([
            { offset: 0.0, color: "rgba(255,255,255,0.30)" },
            { offset: 0.5, color: "rgba(255,255,255,0.00)" },
            { offset: 1.0, color: "rgba(255,255,255,0.30)" }
        ]);

        var bg = tm.app.RectangleShape(320, 320, {
            fillStyle: grad.toStyle(),
            strokeStyle: "none"
        });
        bg.x = app.width/2;
        bg.y = app.height/2;

        var polygons = [];
        for (var i = -5; i < 16; i++) {
            polygons.push({
                z: i
            });
        }

        var viewMat = mat4.identity(mat4.create());
        var projMat = mat4.identity(mat4.create());
        var mvpMat = mat4.identity(mat4.create());
        mat4.lookAt([0,0,0], [0,0,-1], [0,1,0], viewMat)
        mat4.perspective(90, 1/1, 0.1, 32, projMat);
        mat4.multiply(projMat, viewMat, mvpMat);

        var canvas = bg.canvas;
        canvas.strokeStyle = grad2.toStyle();
        bg.update = function(app) {
            canvas.clear();
            this.renderer(this._shapeParam);
            for (var i = polygons.length; i--; ) {
                var p = polygons[i];
                p.z += 0.05;

                var result = vec4.create([50, 0, p.z, 1]);
                mat4.multiplyVec4(mvpMat, result);

                if (16 < p.z) {
                    p.z -= 21;
                } else if (0 < result[3]) {
                    var c = result[0] / result[3];
                    canvas.drawLine(
                        c + 160,
                        0,
                        c + 160,
                        320);
                    canvas.drawLine(
                        -c + 160,
                        0,
                        -c + 160,
                        320);
                }
            }
        };

        return bg;
    }
}
