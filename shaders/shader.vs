/**
 * @author daishihmr
 * @version 1.0
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

attribute vec3 position;
attribute vec2 texCoord;
uniform mat4 vMat;
uniform mat4 pMat;
uniform float x;
uniform float y;
uniform float scale;
uniform float scaleY;
uniform float rotation;
uniform float texX;
uniform float texY;
uniform float alpha;
uniform float texScale;
uniform float emission;
varying vec2 vTextureCoord;
varying float vAlpha;
varying float vEmission;

mat4 model(vec2 xy, float scale, float scaleY, float rot) {
    mat4 result = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    result = result * mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        xy.x, xy.y, 0.0, 1.0
    );
    result = result * mat4(
        scale, 0.0, 0.0, 0.0,
        0.0, scaleY, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    result = result * mat4(
        cos(radians(rot)), -sin(radians(rot)), 0.0, 0.0,
        sin(radians(rot)), cos(radians(rot)), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    return result;
}

void main(void) {
    vAlpha = alpha;
    vEmission = emission;
    vTextureCoord = (texCoord * texScale) + vec2(texX*64.0/512.0, texY*64.0/512.0);
    gl_Position = pMat * vMat * model(vec2(x, y), scale, scaleY, rotation) * vec4(position, 1.0);
}
