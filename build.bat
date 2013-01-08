@echo off

erase glshooter.min.js
erase glshooter.zip

call java -jar compiler.jar --js_output_file glshooter.min.js ^
    --language_in ECMASCRIPT5 ^
    --compilation_level ADVANCED_OPTIMIZATIONS ^
    --externs lib/tmlib.js ^
    --externs lib/gl-matrix.js ^
    --externs lib/bulletml.js ^
    --js mylib/bulletml.gl2d.js ^
    --js mylib/scene.js ^
    --js mylib/sprite.js ^
    --js mylib/util.js ^
    --js game/background.js ^
    --js game/bomb.js ^
    --js game/boss.js ^
    --js game/explosion.js ^
    --js game/labels.js ^
    --js game/player.js ^
    --js game/scenes.js ^
    --js game/patterns.js ^
    --js game/enemy-data.js ^
    --js game/stage-data.js ^
    --js game/main.js

copy /y index.html index-backup.html
copy /y index-deploy.html index.html

call zip glshooter.zip ^
    index.html ^
    shaders/shader.vs ^
    shaders/shader.fs ^
    sounds/se_maoudamashii_explosion05.mp3 ^
    sounds/voice_extend.mp3 ^
    sounds/voice_gen-bomb.mp3 ^
    sounds/effect0.mp3 ^
    sounds/nc17909.mp3 ^
    images/boss1.png ^
    images/texture0.png ^
    images/boss2.png ^
    images/boss3.png ^
    lib/gl-matrix-min.js ^
    lib/bulletml.js ^
    lib/tmlib.js ^
    glshooter.min.js

copy /y index-backup.html index.html
erase index-backup.html
