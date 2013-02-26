#!/bin/sh

rm glshooter.min.js

java -jar compiler.jar --js_output_file glshooter.min.js \
    --language_in ECMASCRIPT5 \
    --warning_level QUIET \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --formatting pretty_print \
    --externs lib/tmlib.min.js \
    --externs lib/webaudio.js \
    --js game/header.js \
    --js lib/bulletml.js \
    --js lib/bulletml.dsl.js \
    --js lib/bulletml.walker.js \
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
