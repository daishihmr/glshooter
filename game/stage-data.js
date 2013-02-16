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

// ステージステップが先に進む条件。
//  1. scene.frameが規定値に達する
//  2. 特定の敵を倒す

// フレームオブジェクト
// {
//     frame: {number} 前回からの経過フレーム数
//     flag: {string} フラグ名.特定の敵を倒した時に実行
//     enemies: {Array} 敵の情報と出現位置データ
//         [
//             [
//                 出現位置x {number},
//                 出現位置y {number},
//                 敵名 {string},
//                 攻撃パターン名 {string},
//                 フラグ名 {string},
//             ], ...
//         ]
//     message: {Object} 表示するメッセージ
//         color: 色 {string},
//         text: テキスト {string},
//         visible: 可視属性 {boolean}
// }

var setupStageData = function(app, stage) {

    var delay = function(d) {
        return { frame: d, enemies: [] };
    };

    var zako1Left = {
        frame: 120,
        enemies: [
            [ -17, 16.0, "zako", "zako1" ],
            [ -15, 16.5, "zako", "zako1" ],
            [ -13, 17.0, "zako", "zako1" ],
            [ -11, 17.0, "zako", "zako1" ],
            [  -9, 17.0, "zako", "zako1" ],
            [ -17, 16.0, "zako", "zako1d" ],
            [ -15, 16.5, "zako", "zako1d" ],
            [ -13, 17.0, "zako", "zako1d" ],
            [ -11, 17.0, "zako", "zako1d" ],
            [  -9, 17.0, "zako", "zako1d" ],
        ]
    };
    var zako1Right = {
        frame: 120,
        enemies: [
            [  17, 16.0, "zako", "zako2" ],
            [  15, 16.5, "zako", "zako2" ],
            [  13, 17.0, "zako", "zako2" ],
            [  11, 17.0, "zako", "zako2" ],
            [   9, 17.0, "zako", "zako2" ],
            [  17, 16.0, "zako", "zako2d" ],
            [  15, 16.5, "zako", "zako2d" ],
            [  13, 17.0, "zako", "zako2d" ],
            [  11, 17.0, "zako", "zako2d" ],
            [   9, 17.0, "zako", "zako2d" ],
        ]
    };
    var zako1FastLeft = {
        frame: 60,
        enemies: [
            [ -17, 16.0, "zako", "zako1" ],
            [ -15, 16.5, "zako", "zako1" ],
            [ -13, 17.0, "zako", "zako1" ],
            [ -11, 17.0, "zako", "zako1" ],
            [  -9, 17.0, "zako", "zako1" ],
            [ -17, 16.0, "zako", "zako1d" ],
            [ -15, 16.5, "zako", "zako1d" ],
            [ -13, 17.0, "zako", "zako1d" ],
            [ -11, 17.0, "zako", "zako1d" ],
            [  -9, 17.0, "zako", "zako1d" ],
        ]
    };
    var zako1FastRight = {
        frame: 60,
        enemies: [
            [  17, 16.0, "zako", "zako2" ],
            [  15, 16.5, "zako", "zako2" ],
            [  13, 17.0, "zako", "zako2" ],
            [  11, 17.0, "zako", "zako2" ],
            [   9, 17.0, "zako", "zako2" ],
            [  17, 16.0, "zako", "zako2d" ],
            [  15, 16.5, "zako", "zako2d" ],
            [  13, 17.0, "zako", "zako2d" ],
            [  11, 17.0, "zako", "zako2d" ],
            [   9, 17.0, "zako", "zako2d" ],
        ]
    };
    var zako1FastBoth = {
        frame: 60,
        enemies: [
            [ -17, 16.0, "zako", "zako1" ],
            [ -15, 16.5, "zako", "zako1" ],
            [ -13, 17.0, "zako", "zako1" ],
            [ -11, 17.0, "zako", "zako1" ],
            [  -9, 17.0, "zako", "zako1" ],
            [ -17, 16.0, "zako", "zako1d" ],
            [ -15, 16.5, "zako", "zako1d" ],
            [ -13, 17.0, "zako", "zako1d" ],
            [ -11, 17.0, "zako", "zako1d" ],
            [  -9, 17.0, "zako", "zako1d" ],
            [  17, 16.0, "zako", "zako2" ],
            [  15, 16.5, "zako", "zako2" ],
            [  13, 17.0, "zako", "zako2" ],
            [  11, 17.0, "zako", "zako2" ],
            [   9, 17.0, "zako", "zako2" ],
            [  17, 16.0, "zako", "zako2d" ],
            [  15, 16.5, "zako", "zako2d" ],
            [  13, 17.0, "zako", "zako2d" ],
            [  11, 17.0, "zako", "zako2d" ],
            [   9, 17.0, "zako", "zako2d" ],
        ]
    };
    var zako3Left = {
        frame: 5,
        enemies: [
            [ -8+Math.random()*4-2, 17.0, "zako", "zako3" ],
        ]
    };
    var zako3Right = {
        frame: 5,
        enemies: [
            [  8+Math.random()*4-2, 17.0, "zako", "zako3" ],
        ]
    };
    var zako3Both = {
        frame: 5,
        enemies: [
            [ -8+Math.random()*4-2, 17.0, "zako", "zako3" ],
            [  8+Math.random()*4-2, 17.0, "zako", "zako3" ],
        ]
    };

    var pZako4 = function(c) {
        return {
            frame: 10,
            enemies: [
                [ c+-3  , 17.5, "zako", "zako4" ],
                [ c+-1.5, 17.5, "zako", "zako4" ],
                [ c+ 0  , 17.5, "zako", "zako4" ],
                [ c+ 1.5, 17.5, "zako", "zako4" ],
                [ c+ 3  , 17.5, "zako", "zako4" ],
            ]
        };
    };

    var pZako4K = function(c) {
        return {
            frame: 10,
            enemies: [
                [ c+-3  , 17.5, "zako", "zako4K" ],
                [ c+-1.5, 17.5, "zako", "zako4K" ],
                [ c+ 0  , 17.5, "zako", "zako4K" ],
                [ c+ 1.5, 17.5, "zako", "zako4K" ],
                [ c+ 3  , 17.5, "zako", "zako4K" ],
            ]
        };
    };

    var pZako5 = function(c) {
        return {
            frame: 10,
            enemies: [
                [ c+-3  , 17.5, "zako", "zako5" ],
                [ c+-1.5, 17.5, "zako", "zako5" ],
                [ c+ 0  , 17.5, "zako", "zako5" ],
                [ c+ 1.5, 17.5, "zako", "zako5" ],
                [ c+ 3  , 17.5, "zako", "zako5" ],
            ]
        };
    };

    var pZako5K = function(c) {
        return {
            frame: 10,
            enemies: [
                [ c+-3  , 17.5, "zako", "zako5K" ],
                [ c+-1.5, 17.5, "zako", "zako5K" ],
                [ c+ 0  , 17.5, "zako", "zako5K" ],
                [ c+ 1.5, 17.5, "zako", "zako5K" ],
                [ c+ 3  , 17.5, "zako", "zako5K" ],
            ]
        };
    };

    var pZako6 = function(c) {
        return {
            frame: 10,
            enemies: [
                [ c+-3  , 17.5, "ship", "zako6" ],
                [ c+-1.5, 17.5, "ship", "zako6" ],
                [ c+ 0  , 17.5, "ship", "zako6" ],
                [ c+ 1.5, 17.5, "ship", "zako6" ],
                [ c+ 3  , 17.5, "ship", "zako6" ],
            ]
        };
    };

    var pZako6K = function(c) {
        return {
            frame: 10,
            enemies: [
                [ c+-3  , 17.5, "ship", "zako6K" ],
                [ c+-1.5, 17.5, "ship", "zako6K" ],
                [ c+ 0  , 17.5, "ship", "zako6K" ],
                [ c+ 1.5, 17.5, "ship", "zako6K" ],
                [ c+ 3  , 17.5, "ship", "zako6K" ],
            ]
        };
    };

    var pZako7 = function(c) {
        return {
            frame: 10,
            enemies: [
                [ c+ -3.0, 19.5, "zakoS", "zako7" ],
                [ c+ -1.5, 19.5, "zakoS", "zako7" ],
                [ c+  0.0, 19.5, "zakoS", "zako7" ],
                [ c+  1.5, 19.5, "zakoS", "zako7" ],
                [ c+  3.0, 19.5, "zakoS", "zako7" ],
                [ c+ -3.0, 18.5, "zakoS", "zako7" ],
                [ c+ -1.5, 18.5, "zakoS", "zako7" ],
                [ c+  0.0, 18.5, "zakoS", "zako7" ],
                [ c+  1.5, 18.5, "zakoS", "zako7" ],
                [ c+  3.0, 18.5, "zakoS", "zako7" ],
                [ c+ -3.0, 17.5, "zakoS", "zako7" ],
                [ c+ -1.5, 17.5, "zakoS", "zako7" ],
                [ c+  0.0, 17.5, "zakoS", "zako7" ],
                [ c+  1.5, 17.5, "zakoS", "zako7" ],
                [ c+  3.0, 17.5, "zakoS", "zako7" ],
            ]
        };
    };

    var pZako7f = function(c) {
        return {
            frame: 10,
            enemies: [
                [ c+ -3.0, 19.5, "zako", "zako7f" ],
                [ c+ -1.5, 19.5, "zako", "zako7f" ],
                [ c+  0.0, 19.5, "zako", "zako7f" ],
                [ c+  1.5, 19.5, "zako", "zako7f" ],
                [ c+  3.0, 19.5, "zako", "zako7f" ],
                [ c+ -3.0, 18.5, "zako", "zako7f" ],
                [ c+ -1.5, 18.5, "zako", "zako7f" ],
                [ c+  0.0, 18.5, "zako", "zako7f" ],
                [ c+  1.5, 18.5, "zako", "zako7f" ],
                [ c+  3.0, 18.5, "zako", "zako7f" ],
                [ c+ -3.0, 17.5, "zako", "zako7f" ],
                [ c+ -1.5, 17.5, "zako", "zako7f" ],
                [ c+  0.0, 17.5, "zako", "zako7f" ],
                [ c+  1.5, 17.5, "zako", "zako7f" ],
                [ c+  3.0, 17.5, "zako", "zako7f" ],
            ]
        };
    };

    var pZako8 = function(c) {
        return {
            frame: 10,
            enemies: [
                [  c, 18, "ship", "zako8" ],
                [ -c, 18, "ship", "zako8" ],
            ]
        };
    };

    var zakoG = function(x, type, height) { // height = H or M or L
        return {
            frame: 10,
            enemies: [
                [x-3.0, 20, "zakoL", "zakoG" + type + height],
                [x-1.5, 20, "zakoL", "zakoG" + type + height],
                [x    , 20, "zakoL", "zakoG" + type + height],
                [x+1.5, 20, "zakoL", "zakoG" + type + height],
                [x+3.0, 20, "zakoL", "zakoG" + type + height],
            ]
        };
    };

    var tankLeft = {
        frame: 5,
        enemies: [
            [ -16.5, 10, "tank", "tank1" ],
            [ -16.5,  8, "tank", "tank1" ],
            [ -16.5,  6, "tank", "tank1" ],
            [ -16.5,  4, "tank", "tank1" ],
            [ -16.5,  2, "tank", "tank1" ],
            [ -16.5, 10, "tank", "tank1d" ],
            [ -16.5,  8, "tank", "tank1d" ],
            [ -16.5,  6, "tank", "tank1d" ],
            [ -16.5,  4, "tank", "tank1d" ],
            [ -16.5,  2, "tank", "tank1d" ],
        ],
    };
    var tankRight = {
        frame: 5,
        enemies: [
            [ 16.5, 10, "tank", "tank2" ],
            [ 16.5,  8, "tank", "tank2" ],
            [ 16.5,  6, "tank", "tank2" ],
            [ 16.5,  4, "tank", "tank2" ],
            [ 16.5,  2, "tank", "tank2" ],
            [ 16.5, 10, "tank", "tank2d" ],
            [ 16.5,  8, "tank", "tank2d" ],
            [ 16.5,  6, "tank", "tank2d" ],
            [ 16.5,  4, "tank", "tank2d" ],
            [ 16.5,  2, "tank", "tank2d" ],
        ],
    };
    var tankBoth = {
        frame: 5,
        enemies: [
            [ -16.5, 10, "tank", "tank1" ],
            [ -16.5,  8, "tank", "tank1" ],
            [ -16.5,  6, "tank", "tank1" ],
            [ -16.5,  4, "tank", "tank1" ],
            [ -16.5,  2, "tank", "tank1" ],
            [ -16.5, 10, "tank", "tank1d" ],
            [ -16.5,  8, "tank", "tank1d" ],
            [ -16.5,  6, "tank", "tank1d" ],
            [ -16.5,  4, "tank", "tank1d" ],
            [ -16.5,  2, "tank", "tank1d" ],
            [ 16.5, 10, "tank", "tank2" ],
            [ 16.5,  8, "tank", "tank2" ],
            [ 16.5,  6, "tank", "tank2" ],
            [ 16.5,  4, "tank", "tank2" ],
            [ 16.5,  2, "tank", "tank2" ],
            [ 16.5, 10, "tank", "tank2d" ],
            [ 16.5,  8, "tank", "tank2d" ],
            [ 16.5,  6, "tank", "tank2d" ],
            [ 16.5,  4, "tank", "tank2d" ],
            [ 16.5,  2, "tank", "tank2d" ],
        ],
    };

    var tankG = function(y, type, side) { // type = 0 or 1, side = L or R
        var type = type + 3;
        var x = (side === "L") ? -20 : 20;
        return {
            frame: 10,
            enemies: [
                [ x, y, "tankEx", "tank" + type + side + 0 ],
                [ x, y, "tankEx", "tank" + type + side + 1 ],
                [ x, y, "tankEx", "tank" + type + side + 2 ],
                [ x, y, "tankEx", "tank" + type + side + 3 ],
                [ x, y, "tankEx", "tank" + type + side + 4 ],
            ]
        };
    };

    var middle0 = {
        frame: 10,
        enemies: [
            [ 0, 18, "middle", "middle"],
        ]
    };
    var middle5 = {
        frame: 10,
        enemies: [
            [ 5, 18, "middle", "middle"],
        ]
    };
    var middleM5 = {
        frame: 10,
        enemies: [
            [ -5, 18, "middle", "middle"],
        ]
    };

    var middleKRight = {
        frame: 10,
        enemies: [
            [ 20, 10, "middleK", "middleKR" ],
        ]
    };

    var middle2 = {
        frame: 10,
        enemies: [
            [ -7, 20, "middle", "middle2L0" ],
            [ -7, 20, "middle", "middle2L1" ],
            [ -7, 20, "middle", "middle2L2" ],
            [ -7, 20, "middle", "middle2L3" ],
            [ -7, 20, "middle", "middle2L4" ],
            [  7, 20, "middle", "middle2R0" ],
            [  7, 20, "middle", "middle2R1" ],
            [  7, 20, "middle", "middle2R2" ],
            [  7, 20, "middle", "middle2R3" ],
            [  7, 20, "middle", "middle2R4" ],
        ]
    };

    var middle3L = {
        frame: 10,
        enemies: [
            [ -20, 20, "bigship", "middle3L0" ],
        ]
    };

    var middle3R = {
        frame: 10,
        enemies: [
            [  20, 20, "bigship", "middle3R0" ],
        ]
    };

    var bigger = {
        frame: 100,
        enemies: [
            [ 0, 17.0, "bigger", "bigger", "flag1" ],
        ]
    };
    var biggerKilled = { flag: "flag1", enemies: [] }

    var bigger2 = {
        frame: 100,
        enemies: [
            [ 0, 17.0, "bigger2", "bigger2", "flag2" ],
        ]
    };
    var bigger2Killed =  { flag: "flag2", enemies: [] };

    var cannonLeft = {
        frame: 10,
        enemies: [
            [ -7, 19, "cannon", "cannon" ],
        ]
    };
    var cannonCenter = {
        frame: 10,
        enemies: [
            [ -2, 19, "cannon", "cannon" ],
        ]
    };
    var cannonCenter2 = {
        frame: 10,
        enemies: [
            [  3, 19, "cannon", "cannon" ],
        ]
    };
    var cannonRight = {
        frame: 10,
        enemies: [
            [  7, 19, "cannon", "cannon" ],
        ]
    };

    var cannon2 = {
        frame: 10,
        enemies: [
            [ -5, 19, "cannon", "cannon2" ],
            [  5, 19, "cannon", "cannon2" ],
        ]
    };
    var cannon3 = {
        frame: 10,
        enemies: [
            [ -8, 19, "cannon", "cannon2" ],
            [  8, 19, "cannon", "cannon2" ],
        ]
    };
    var cannon22 = {
        frame: 10,
        enemies: [
            [ -12, 19, "cannon2", "cannon3" ],
            [  12, 19, "cannon2", "cannon3" ],
        ]
    };

    var StageData;

    if (stage === 1) {
        StageData = [
            delay(120),

            zako1Left,
            zako1Right,
            delay(120),

            zako1FastLeft,
            delay(60),

            zako1FastRight,
            delay(60),

            zako1FastBoth,
            delay(120),

            zako3Left,
            zako3Left,
            zako3Left,
            zako3Left,
            zako3Left,
            delay(60),

            zako3Right,
            zako3Right,
            zako3Right,
            zako3Right,
            zako3Right,
            delay(60),

            zako3Both,
            zako3Both,
            zako3Both,
            zako3Both,
            zako3Both,
            delay(60),

            bigger,
            biggerKilled,

            tankRight,
            tankLeft,
            delay(60),

            zako3Both,
            zako3Both,
            zako3Both,
            zako3Both,
            zako3Both,
            delay(60),

            cannonLeft,
            zako3Both,
            zako3Both,
            zako3Both,
            zako3Both,
            zako3Both,
            delay(20),

            middle0,
            middle5,
            middleM5,
            delay(120),

            cannonLeft,
            delay(120),

            pZako4(12),
            delay(60),

            cannonRight,
            delay(60),

            pZako4(12),
            delay(120),

            pZako4(0),
            delay(60),

            cannonRight,
            pZako5(-12),
            delay(120),

            pZako5(-12),
            delay(120),

            pZako5(-12),
            delay(180),

            cannonCenter,
            cannonCenter2,
            tankRight,
            tankLeft,
            pZako6(8),
            delay(120),

            pZako6(-8),
            delay(120),

            pZako6(8),
            delay(120),

            pZako6(-8),
            delay(120),

            {
                frame: 10,
                enemies: [],
                message: {
                    color: "red",
                    text: "WARNING!!",
                    visible: true
                }
            },
            delay(300),
            {
                frame: 10,
                enemies: [],
                message: {
                    color: "white",
                    text: "",
                    visible: false
                }
            },
            {
                frame: 20,
                enemies: [
                    [0, 21.9, "boss", "boss11"]
                ]
            }
        ];

    } else if (stage === 2) {
        StageData = [
            delay(240),

            pZako7( 8), delay(120),
            pZako7(-8), delay(120),
            pZako7( 8), delay(120),
            pZako7(-8), delay(120),

            delay(60),

            pZako7( 8), delay(60),
            pZako7( 8), delay(60),
            pZako7( 8), delay(60),
            pZako7( 8), delay(60),
            pZako7( 8), delay(60),
            pZako7( 8), delay(60),
            pZako7( 8), delay(60),

            delay(60),

            pZako8( 4), delay(60),
            pZako8( 8), delay(60),
            pZako8(12), delay(60),

            delay(180),

            pZako5K(-12), delay(60),
            pZako5K(-12), delay(60),
            pZako5K(-12),
            middleKRight, delay(60),

            delay(60),

            pZako5K(-12), delay(60),
            pZako5K(-12), delay(60),

            delay(60),

            pZako6K(  8), delay(20),
            pZako6K( -8), delay(20),
            pZako5K( 12), delay(60),
            pZako5K( 12), delay(60),
            cannon2,
            tankBoth,

            delay(120),

            cannon22,
            pZako4K(12), delay(40),
            pZako4K(12), delay(40),
            pZako5(12), delay(40),
            pZako5(12), delay(40),
            pZako4K(-12), delay(40),
            pZako4K(-12), delay(40),

            delay(360),

            pZako7(  0), delay(60),
            pZako7(  1), delay(60),
            pZako7(  2), delay(60),
            pZako7(  3), delay(60),
            pZako6(-11), delay(20),
            pZako6(-13), delay(20),
            pZako5(  9), delay(60),
            pZako5( 12), delay(60),

            delay(120),

            {
                frame: 10,
                enemies: [],
                message: {
                    color: "red",
                    text: "WARNING!!",
                    visible: true
                }
            },
            delay(300),
            {
                frame: 10,
                enemies: [],
                message: {
                    color: "white",
                    text: "",
                    visible: false
                }
            },
            {
                frame: 20,
                enemies: [
                    [ -12, -21.9, "boss", "boss21"]
                ]
            }
        ];

    }  else if (stage === 3) {
        StageData = [
            delay(240),

            // 第一波
            zakoG( 7, 2, "M"), delay(20),
            zakoG(-7, 2, "M"), delay(20),
            delay(20),
            zakoG( 7, 2, "H"), delay(20),
            zakoG(-7, 2, "H"), delay(20),
            tankG( 7, 0, "R"),
            tankG( 0, 1, "R"),
            delay(20),
            tankG(12, 0, "L"),
            tankG(-5, 1, "L"),
            zakoG( 3, 2, "H"), delay(20),
            delay(20),
            zakoG(-3, 2, "H"), delay(20),
            delay(40),
            tankG( 7, 0, "R"),
            tankG( 0, 1, "R"),
            tankG(12, 0, "L"),
            tankG(-5, 1, "L"),
            zakoG(-7, 2, "H"), delay(20),
            zakoG(-2, 2, "H"), delay(20),
            zakoG( 7, 2, "M"), delay(20),
            zakoG(10, 2, "H"), delay(20),
            zakoG(-7, 2, "M"), delay(20),

            delay(180),

            // 第二波
            cannon3, delay(40),
            tankBoth,
            zakoG( 0, 3, "H"),
            zakoG( 0, 3, "H"), delay(20),
            delay(60),
            zakoG(-7, 3, "H"),
            zakoG(-7, 3, "H"), delay(20),
            delay(60),
            zakoG( 7, 3, "H"),
            zakoG( 7, 3, "H"), delay(20),
            delay(60),
            zakoG( 0, 3, "M"),
            zakoG( 0, 3, "M"),
            tankG( 0, 1, "R"),
            tankG( 0, 0, "L"),
            zakoG(-7, 3, "H"),
            zakoG( 7, 3, "H"),
            tankG( 0, 0, "R"),
            tankG( 0, 1, "L"),

            delay(180),

            // 第三波
            cannon2, delay(60),
            zakoG( 7, 2, "M"), delay(20),
            zakoG(-7, 2, "M"), delay(20),
            delay(20),
            zakoG( 7, 2, "H"), delay(20),
            zakoG(-7, 2, "H"), delay(20),
            tankG( 7, 0, "R"),
            tankG( 0, 1, "R"),
            delay(20),
            tankG(12, 0, "L"),
            tankG(-5, 1, "L"),
            zakoG( 3, 2, "H"), delay(20),
            delay(20),
            zakoG(-3, 2, "H"), delay(20),
            delay(40),
            tankG( 7, 0, "R"),
            tankG( 0, 1, "R"),
            tankG(12, 0, "L"),
            tankG(-5, 1, "L"),
            zakoG(-7, 2, "H"), delay(20),
            zakoG(-2, 2, "H"), delay(20),
            zakoG( 7, 3, "M"), delay(20),
            zakoG(10, 3, "H"), delay(20),
            zakoG(-7, 3, "M"), delay(20),

            delay(180),

            // 第四波
            middle2, delay(120),
            zakoG(-10, 3, "H"), zakoG(10, 3, "H"), delay(120),
            zakoG(-10, 3, "H"), zakoG(10, 3, "H"), delay(120),
            zakoG(-10, 3, "H"), zakoG(10, 3, "H"), delay(120),
            
            // 第五波（中ボス）
            bigger2, delay(180),
            zakoG(-7, 1, "H"), delay(180),
            zakoG( 7, 1, "H"), delay(180),
            zakoG(-7, 1, "H"), delay(180),
            bigger2Killed,

            // 第六波
            pZako7f( 12), delay(60),
            pZako7f(  4), delay(60),
            pZako7f(  0), delay(60),
            pZako7f( -4), delay(60),
            pZako7f(-12), delay(60),
            pZako7f( 12), delay(60),
            tankG( 1, 1, "R"),
            tankG(-1, 0, "R"),
            pZako7f(-12), delay(60),
            tankG(-1, 1, "L"),
            tankG( 1, 0, "L"),
            pZako7f( 12), delay(60),
            pZako7f(-12), delay(60),
            pZako7f( 12), delay(60),
            
            delay(120),

            // 第七波
            middle3L, delay(120),
            middle3R, delay(120),
            tankG( 13, 1, "L"),
            tankG( 13, 0, "R"),
            zakoG(  0, 3, "H"),
            delay(60),
            zakoG( -7, 2, "H"),
            zakoG(  7, 2, "H"),
            zakoG(  0, 3, "M"),
            delay(60),
            zakoG( -7, 2, "M"),
            zakoG(-10, 2, "M"),
            zakoG(  7, 2, "M"),
            zakoG( 10, 2, "M"),
            zakoG( -3, 3, "L"),
            zakoG(  3, 3, "L"),

            delay(360),

            {
                frame: 10,
                enemies: [],
                message: {
                    color: "red",
                    text: "WARNING!!",
                    visible: true
                }
            },
            delay(300),
            {
                frame: 10,
                enemies: [],
                message: {
                    color: "white",
                    text: "",
                    visible: false
                }
            },

            {
                frame: 20,
                enemies: [
                    [ 0, 21.9, "boss", "boss31", "boss3" ]
                ]
            }
        ];
    }

    var cursor = 0;
    var lastLaunchFrame = 0;
    StageData.next = function(frame, flags) {
        var result;
        if (this[cursor] === void 0) {
            return;
        } else if (lastLaunchFrame + this[cursor].frame === frame) {
            result = this[cursor];
        } else if (flags[this[cursor].flag] === true) {
            result = this[cursor];
        } else {
            return;
        }
        cursor++;
        lastLaunchFrame = frame;
        return result;
    };

    return StageData;
};
