precision mediump float;

uniform sampler2D texture;
varying vec2 vTextureCoord;
varying float vAlpha;

void main(void) {
    vec4 col = texture2D(texture, vTextureCoord);
    gl_FragColor = vec4(col.r, col.g, col.b, clamp(col.a * vAlpha, 0.0, 5.0));
}
