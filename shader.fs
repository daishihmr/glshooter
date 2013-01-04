precision mediump float;

uniform sampler2D texture;
varying vec2 vTextureCoord;
varying float vAlpha;
varying float vEmission;

void main(void) {
    vec4 col = texture2D(texture, vTextureCoord);
    gl_FragColor = vec4(clamp(col.rgb + vEmission, 0.0, 1.0), clamp(col.a * vAlpha, 0.0, 5.0));
}
