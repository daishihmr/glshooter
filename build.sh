#!/bin/sh

rm glshooter.min.js
rm glshooter.zip

java -jar compiler.jar --js_output_file glshooter.min.js \
    --warning_level QUIET \
    --language_in ECMASCRIPT5 \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --externs lib/tmlib.min.js \
    --externs lib/gl-matrix-min.js \
    --externs lib/bulletml.min.js \
    --externs lib/webaudio.js \
    --js mylib/gls2d.js \
    --js mylib/bulletml.gl2d.js \
    --js game/background.js \
    --js game/bomb.js \
    --js game/boss.js \
    --js game/explosion.js \
    --js game/labels.js \
    --js game/player.js \
    --js game/scenes.js \
    --js game/patterns.js \
    --js game/enemy-data.js \
    --js game/stage-data.js \
    --js game/main.js

cp index.html index-backup.html
cp index-deploy.html index.html

zip glshooter.zip \
    index.html \
    shaders/shader.vs \
    shaders/shader.fs \
    sounds/se_maoudamashii_explosion05.mp3 \
    sounds/voice_extend.mp3 \
    sounds/voice_gen-bomb.mp3 \
    sounds/effect0.mp3 \
    sounds/nc17909.mp3 \
    images/boss1.png \
    images/texture0.png \
    images/boss2.png \
    images/boss3.png \
    lib/gl-matrix-min.js \
    lib/bulletml.min.js \
    lib/tmlib.min.js \
    lib/webaudio.js \
    glshooter.min.js

cp index-backup.html index.html
rm index-backup.html
