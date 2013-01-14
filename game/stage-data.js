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

// ステージステップが先に進む条件。
//  1. scene.frameが規定値に達する
//  2. 特定の敵を倒す

var setupStageData = function(app, stage) {

    var delay20 = [ { frame: 20, enemies: [] } ];
    var delay40 = [ { frame: 40, enemies: [] } ];
    var delay60 = [ { frame: 60, enemies: [] } ];
    var delay120 = [ { frame: 120, enemies: [] } ];
    var delay180 = [ { frame: 180, enemies: [] } ];

    var zako1Left = [
        {
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
        },
    ];
    var zako1Right = [
        {
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
        },
    ];
    var zako1FastLeft = [
        {
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
        },
    ];
    var zako1FastRight = [
        {
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
        },
    ];
    var zako1FastBoth = [
        {
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
        },
    ];
    var zako3Left = [
        {
            frame: 5,
            enemies: [
                [ -8+Math.random()*4-2, 17.0, "zako", "zako3" ],
            ]
        },
    ];
    var zako3Right = [
        {
            frame: 5,
            enemies: [
                [  8+Math.random()*4-2, 17.0, "zako", "zako3" ],
            ]
        },
    ];
    var zako3Both = [
        {
            frame: 5,
            enemies: [
                [ -8+Math.random()*4-2, 17.0, "zako", "zako3" ],
                [  8+Math.random()*4-2, 17.0, "zako", "zako3" ],
            ]
        },
    ];

    var pZako4 = function(c) {
        return [
            {
                frame: 10,
                enemies: [
                    [ c+-3  , 17.5, "zako", "zako4" ],
                    [ c+-1.5, 17.5, "zako", "zako4" ],
                    [ c+ 0  , 17.5, "zako", "zako4" ],
                    [ c+ 1.5, 17.5, "zako", "zako4" ],
                    [ c+ 3  , 17.5, "zako", "zako4" ],
                ]
            },
        ];
    };

    var pZako4K = function(c) {
        return [
            {
                frame: 10,
                enemies: [
                    [ c+-3  , 17.5, "zako", "zako4K" ],
                    [ c+-1.5, 17.5, "zako", "zako4K" ],
                    [ c+ 0  , 17.5, "zako", "zako4K" ],
                    [ c+ 1.5, 17.5, "zako", "zako4K" ],
                    [ c+ 3  , 17.5, "zako", "zako4K" ],
                ]
            },
        ];
    };

    var pZako5 = function(c) {
        return [
            {
                frame: 10,
                enemies: [
                    [ c+-3  , 17.5, "zako", "zako5" ],
                    [ c+-1.5, 17.5, "zako", "zako5" ],
                    [ c+ 0  , 17.5, "zako", "zako5" ],
                    [ c+ 1.5, 17.5, "zako", "zako5" ],
                    [ c+ 3  , 17.5, "zako", "zako5" ],
                ]
            },
        ];
    };

    var pZako5K = function(c) {
        return [
            {
                frame: 10,
                enemies: [
                    [ c+-3  , 17.5, "zako", "zako5K" ],
                    [ c+-1.5, 17.5, "zako", "zako5K" ],
                    [ c+ 0  , 17.5, "zako", "zako5K" ],
                    [ c+ 1.5, 17.5, "zako", "zako5K" ],
                    [ c+ 3  , 17.5, "zako", "zako5K" ],
                ]
            },
        ];
    };

    var pZako6 = function(c) {
        return [
            {
                frame: 10,
                enemies: [
                    [ c+-3  , 17.5, "ship", "zako6" ],
                    [ c+-1.5, 17.5, "ship", "zako6" ],
                    [ c+ 0  , 17.5, "ship", "zako6" ],
                    [ c+ 1.5, 17.5, "ship", "zako6" ],
                    [ c+ 3  , 17.5, "ship", "zako6" ],
                ]
            },
        ];
    };

    var pZako6K = function(c) {
        return [
            {
                frame: 10,
                enemies: [
                    [ c+-3  , 17.5, "ship", "zako6K" ],
                    [ c+-1.5, 17.5, "ship", "zako6K" ],
                    [ c+ 0  , 17.5, "ship", "zako6K" ],
                    [ c+ 1.5, 17.5, "ship", "zako6K" ],
                    [ c+ 3  , 17.5, "ship", "zako6K" ],
                ]
            },
        ];
    };

    var pZako7 = function(c) {
        return [
            {
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
            }
        ]
    };

    var pZako7f = function(c) {
        return [
            {
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
            }
        ]
    };

    var pZako8 = function(c) {
        return [
            {
                frame: 10,
                enemies: [
                    [  c, 18, "ship", "zako8" ],
                    [ -c, 18, "ship", "zako8" ],
                ]
            }
        ];
    };

    var zakoG = function(x, type, height) { // height = H or M or L
        return [
            {
                frame: 10,
                enemies: [
                    [x-3.0, 20, "zakoL", "zakoG" + type + height],
                    [x-1.5, 20, "zakoL", "zakoG" + type + height],
                    [x    , 20, "zakoL", "zakoG" + type + height],
                    [x+1.5, 20, "zakoL", "zakoG" + type + height],
                    [x+3.0, 20, "zakoL", "zakoG" + type + height],
                ]
            }
        ];
    };

    var tankLeft = [
        {
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
        },
    ];
    var tankRight = [
        {
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
        },
    ];
    var tankBoth = [
        {
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
        },
    ];

    var tankG = function(y, type, side) { // type = 0 or 1, side = L or R
        var type = type + 3;
        var x = (side === "L") ? -20 : 20;
        return [
            {
                frame: 10,
                enemies: [
                    [ x, y, "tankEx", "tank" + type + side + 0 ],
                    [ x, y, "tankEx", "tank" + type + side + 1 ],
                    [ x, y, "tankEx", "tank" + type + side + 2 ],
                    [ x, y, "tankEx", "tank" + type + side + 3 ],
                    [ x, y, "tankEx", "tank" + type + side + 4 ],
                ]
            }
        ];
    };

    var middle0 = [
        {
            frame: 10,
            enemies: [
                [ 0, 18, "middle", "middle"],
            ]
        },
    ];
    var middle5 = [
        {
            frame: 10,
            enemies: [
                [ 5, 18, "middle", "middle"],
            ]
        },
    ];
    var middleM5 = [
        {
            frame: 10,
            enemies: [
                [ -5, 18, "middle", "middle"],
            ]
        },
    ];

    var middleKRight = [
        {
            frame: 10,
            enemies: [
                [ 20, 10, "middleK", "middleKR" ],
            ]
        }
    ];

    var middle2 = [
        {
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
        }
    ];

    var middle3L = [
        {
            frame: 10,
            enemies: [
                [ -20, 20, "bigship", "middle3L0" ],
            ]
        }
    ];

    var middle3R = [
        {
            frame: 10,
            enemies: [
                [  20, 20, "bigship", "middle3R0" ],
            ]
        }
    ];

    var bigger = [
        {
            frame: 100,
            enemies: [
                [ 0, 17.0, "bigger", "bigger", "flag1" ],
            ]
        },
    ];
    var biggerKilled = [ { flag: "flag1", enemies: [] }] ;

    var bigger2 = [
        {
            frame: 100,
            enemies: [
                [ 0, 17.0, "bigger2", "bigger2", "flag2" ],
            ]
        },
    ];
    var bigger2Killed = [ { flag: "flag2", enemies: [] }] ;

    var cannonLeft = [
        {
            frame: 10,
            enemies: [
                [ -7, 19, "cannon", "cannon" ],
            ]
        }
    ];
    var cannonCenter = [
        {
            frame: 10,
            enemies: [
                [ -2, 19, "cannon", "cannon" ],
            ]
        }
    ];
    var cannonCenter2 = [
        {
            frame: 10,
            enemies: [
                [  3, 19, "cannon", "cannon" ],
            ]
        }
    ];
    var cannonRight = [
        {
            frame: 10,
            enemies: [
                [  7, 19, "cannon", "cannon" ],
            ]
        }
    ];

    var cannon2 = [
        {
            frame: 10,
            enemies: [
                [ -5, 19, "cannon", "cannon2" ],
                [  5, 19, "cannon", "cannon2" ],
            ]
        }
    ];
    var cannon3 = [
        {
            frame: 10,
            enemies: [
                [ -8, 19, "cannon", "cannon2" ],
                [  8, 19, "cannon", "cannon2" ],
            ]
        }
    ];
    var cannon22 = [
        {
            frame: 10,
            enemies: [
                [ -12, 19, "cannon2", "cannon3" ],
                [  12, 19, "cannon2", "cannon3" ],
            ]
        }
    ];

    var StageData = [];
    if (stage === 1) {
        StageData = StageData
            .concat(delay60)
            .concat(delay60)
            .concat(zako1Left)
            .concat(zako1Right)
            .concat(delay60)
            .concat(delay60)
            .concat(zako1FastLeft)
            .concat(delay60)
            .concat(zako1FastRight)
            .concat(delay60)
            .concat(zako1FastBoth)
            .concat(delay60)
            .concat(delay60)
            .concat(zako3Left)
            .concat(zako3Left)
            .concat(zako3Left)
            .concat(zako3Left)
            .concat(zako3Left)
            .concat(delay60)
            .concat(zako3Right)
            .concat(zako3Right)
            .concat(zako3Right)
            .concat(zako3Right)
            .concat(zako3Right)
            .concat(delay60)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(delay60)
            .concat(bigger)
            .concat(biggerKilled)
            .concat(tankRight)
            .concat(tankLeft)
            .concat(delay60)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(delay60)
            .concat(cannonLeft)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(zako3Both)
            .concat(delay20)
            .concat(middle0)
            .concat(middle5)
            .concat(middleM5)
            .concat(delay60)
            .concat(delay60)
            .concat(cannonLeft)
            .concat(delay60)
            .concat(delay60)
            .concat(pZako4(12))
            .concat(delay60)
            .concat(cannonRight)
            .concat(delay60)
            .concat(pZako4(12))
            .concat(delay60)
            .concat(delay60)
            .concat(pZako4(0))
            .concat(delay60)
            .concat(cannonRight)
            .concat(pZako5(-12))
            .concat(delay60)
            .concat(delay60)
            .concat(pZako5(-12))
            .concat(delay60)
            .concat(delay60)
            .concat(pZako5(-12))
            .concat(delay60)
            .concat(delay60)
            .concat(delay60)
            .concat(cannonCenter)
            .concat(cannonCenter2)
            .concat(tankRight)
            .concat(tankLeft)
            .concat(pZako6(8))
            .concat(delay60)
            .concat(delay60)
            .concat(pZako6(-8))
            .concat(delay60)
            .concat(delay60)
            .concat(pZako6(8))
            .concat(delay60)
            .concat(delay60)
            .concat(pZako6(-8))
            .concat(delay60)
            .concat(delay60)
            .concat([
                {
                    frame: 10,
                    enemies: [],
                    message: {
                        color: "red",
                        text: "WARNING!!",
                        visible: true
                    }
                }
            ])
            .concat(delay60)
            .concat(delay60)
            .concat(delay60)
            .concat(delay60)
            .concat(delay60)
            .concat([
                {
                    frame: 10,
                    enemies: [],
                    message: {
                        color: "white",
                        text: "",
                        visible: false
                    }
                }
            ])
            .concat([
                {
                    frame: 20,
                    enemies: [
                        [0, 21.9, "boss", "boss11"]
                    ]
                }
            ]);

            // StageData = [
            //     {
            //         frame: 20,
            //         enemies: [
            //             [ 0, 21.9, "boss", "boss11"]
            //         ]
            //     }
            // ];

    } else if (stage === 2) {
        StageData = StageData
            .concat(delay120)
            .concat(delay120)

            .concat(pZako7(8))
            .concat(delay120)

            .concat(pZako7(-8))
            .concat(delay120)

            .concat(pZako7(8))
            .concat(delay120)

            .concat(pZako7(-8))
            .concat(delay120)

            .concat(delay60)

            .concat(pZako7(8)).concat(delay60)
            .concat(pZako7(8)).concat(delay60)
            .concat(pZako7(8)).concat(delay60)
            .concat(pZako7(8)).concat(delay60)
            .concat(pZako7(8)).concat(delay60)
            .concat(pZako7(8)).concat(delay60)
            .concat(pZako7(8)).concat(delay60)

            .concat(delay60)

            .concat(pZako8( 4)).concat(delay60)
            .concat(pZako8( 8)).concat(delay60)
            .concat(pZako8(12)).concat(delay60)

            .concat(delay60).concat(delay120)

            .concat(pZako5K(-12)).concat(delay60)
            .concat(pZako5K(-12)).concat(delay60)
            .concat(pZako5K(-12))

            .concat(middleKRight).concat(delay60)

            .concat(delay60)

            .concat(pZako5K(-12)).concat(delay60)
            .concat(pZako5K(-12)).concat(delay60)

            .concat(delay60)

            .concat(pZako6K(8)).concat(delay20)
            .concat(pZako6K(-8)).concat(delay20)

            .concat(pZako5K(12)).concat(delay60)
            .concat(pZako5K(12)).concat(delay60)

            .concat(cannon2)
            .concat(tankBoth)

            .concat(delay60).concat(delay60)

            .concat(cannon22)

            .concat(pZako4K(12)).concat(delay40)
            .concat(pZako4K(12)).concat(delay40)

            .concat(pZako5(12)).concat(delay40)
            .concat(pZako5(12)).concat(delay40)

            .concat(pZako4K(-12)).concat(delay40)
            .concat(pZako4K(-12)).concat(delay40)

            .concat(delay60).concat(delay60)
            .concat(delay60).concat(delay60)
            .concat(delay60).concat(delay60)

            .concat(pZako7(0)).concat(delay60)
            .concat(pZako7(1)).concat(delay60)
            .concat(pZako7(2)).concat(delay60)
            .concat(pZako7(3)).concat(delay60)

            .concat(pZako6(-11)).concat(delay20)
            .concat(pZako6(-13)).concat(delay20)
            .concat(pZako5(9)).concat(delay60)
            .concat(pZako5(12)).concat(delay60)

            .concat(delay60)
            .concat(delay60)

            .concat([
                {
                    frame: 10,
                    enemies: [],
                    message: {
                        color: "red",
                        text: "WARNING!!",
                        visible: true
                    }
                }
            ])
            .concat(delay60)
            .concat(delay60)
            .concat(delay60)
            .concat(delay60)
            .concat(delay60)
            .concat([
                {
                    frame: 10,
                    enemies: [],
                    message: {
                        color: "white",
                        text: "",
                        visible: false
                    }
                }
            ])
            .concat([
                {
                    frame: 20,
                    enemies: [
                        [ -12, -21.9, "boss", "boss21"]
                    ]
                }
            ]);

            // StageData = [
            //     {
            //         frame: 20,
            //         enemies: [
            //             [ -12, -21.9, "boss", "boss21"]
            //             // [ 0, 10, "boss", "boss22"]
            //         ]
            //     }
            // ];

    }  else if (stage === 3) {
        StageData = StageData
            .concat(delay120)
            .concat(delay120)

            // 第一波
            .concat(zakoG( 7, 2, "M")).concat(delay20)
            .concat(zakoG(-7, 2, "M")).concat(delay20)
            .concat(delay20)
            .concat(zakoG( 7, 2, "H")).concat(delay20)
            .concat(zakoG(-7, 2, "H")).concat(delay20)
            .concat(tankG(7, 0, "R"))
            .concat(tankG(0, 1, "R"))
            .concat(delay20)
            .concat(tankG(12, 0, "L"))
            .concat(tankG(-5, 1, "L"))
            .concat(zakoG( 3, 2, "H")).concat(delay20)
            .concat(delay20)
            .concat(zakoG(-3, 2, "H")).concat(delay20)
            .concat(delay40)
            .concat(tankG(7, 0, "R"))
            .concat(tankG(0, 1, "R"))
            .concat(tankG(12, 0, "L"))
            .concat(tankG(-5, 1, "L"))
            .concat(zakoG(-7, 2, "H")).concat(delay20)
            .concat(zakoG(-2, 2, "H")).concat(delay20)
            .concat(zakoG( 7, 2, "M")).concat(delay20)
            .concat(zakoG(10, 2, "H")).concat(delay20)
            .concat(zakoG(-7, 2, "M")).concat(delay20)

            .concat(delay180)

            // 第二波
            .concat(cannon3).concat(delay40)
            .concat(tankBoth)
            .concat(zakoG( 0, 3, "H"))
            .concat(zakoG( 0, 3, "H")).concat(delay20)
            .concat(delay60)
            .concat(zakoG( -7, 3, "H"))
            .concat(zakoG( -7, 3, "H")).concat(delay20)
            .concat(delay60)
            .concat(zakoG(  7, 3, "H"))
            .concat(zakoG(  7, 3, "H")).concat(delay20)
            .concat(delay60)
            .concat(zakoG( 0, 3, "M"))
            .concat(zakoG( 0, 3, "M"))
            .concat(tankG(0, 1, "R"))
            .concat(tankG(0, 0, "L"))
            .concat(zakoG(-7, 3, "H"))
            .concat(zakoG( 7, 3, "H"))
            .concat(tankG(0, 0, "R"))
            .concat(tankG(0, 1, "L"))

            .concat(delay180)

            // 第三波
            .concat(cannon2).concat(delay60)
            .concat(zakoG( 7, 2, "M")).concat(delay20)
            .concat(zakoG(-7, 2, "M")).concat(delay20)
            .concat(delay20)
            .concat(zakoG( 7, 2, "H")).concat(delay20)
            .concat(zakoG(-7, 2, "H")).concat(delay20)
            .concat(tankG(7, 0, "R"))
            .concat(tankG(0, 1, "R"))
            .concat(delay20)
            .concat(tankG(12, 0, "L"))
            .concat(tankG(-5, 1, "L"))
            .concat(zakoG( 3, 2, "H")).concat(delay20)
            .concat(delay20)
            .concat(zakoG(-3, 2, "H")).concat(delay20)
            .concat(delay40)
            .concat(tankG(7, 0, "R"))
            .concat(tankG(0, 1, "R"))
            .concat(tankG(12, 0, "L"))
            .concat(tankG(-5, 1, "L"))
            .concat(zakoG(-7, 2, "H")).concat(delay20)
            .concat(zakoG(-2, 2, "H")).concat(delay20)
            .concat(zakoG( 7, 3, "M")).concat(delay20)
            .concat(zakoG(10, 3, "H")).concat(delay20)
            .concat(zakoG(-7, 3, "M")).concat(delay20)

            .concat(delay180)

            // 第四波
            .concat(middle2).concat(delay120)
            .concat(zakoG(-10, 3, "H")).concat(zakoG(10, 3, "H")).concat(delay120)
            .concat(zakoG(-10, 3, "H")).concat(zakoG(10, 3, "H")).concat(delay120)
            .concat(zakoG(-10, 3, "H")).concat(zakoG(10, 3, "H")).concat(delay120)
            
            // 第五波（中ボス）
            .concat(bigger2).concat(delay180)
            .concat(zakoG(-7, 1, "H")).concat(delay180)
            .concat(zakoG( 7, 1, "H")).concat(delay180)
            .concat(zakoG(-7, 1, "H")).concat(delay180)
            .concat(bigger2Killed)

            // 第六波
            .concat(pZako7f( 12)).concat(delay60)
            .concat(pZako7f(  4)).concat(delay60)
            .concat(pZako7f(  0)).concat(delay60)
            .concat(pZako7f( -4)).concat(delay60)
            .concat(pZako7f(-12)).concat(delay60)
            .concat(pZako7f( 12)).concat(delay60)
            .concat(tankG( 1, 1, "R"))
            .concat(tankG(-1, 0, "R"))
            .concat(pZako7f(-12)).concat(delay60)
            .concat(tankG(-1, 1, "L"))
            .concat(tankG( 1, 0, "L"))
            .concat(pZako7f( 12)).concat(delay60)
            .concat(pZako7f(-12)).concat(delay60)
            .concat(pZako7f( 12)).concat(delay60)

            .concat(delay120)

            // 第七波
            .concat(middle3L).concat(delay120)
            .concat(middle3R).concat(delay120)
            .concat(tankG(13, 1, "L"))
            .concat(tankG(13, 0, "R"))
            .concat(zakoG(0, 3, "H"))
            .concat(delay60)
            .concat(zakoG(-7, 2, "H"))
            .concat(zakoG( 7, 2, "H"))
            .concat(zakoG( 0, 3, "M"))
            .concat(delay60)
            .concat(zakoG( -7, 2, "M"))
            .concat(zakoG(-10, 2, "M"))
            .concat(zakoG(  7, 2, "M"))
            .concat(zakoG( 10, 2, "M"))
            .concat(zakoG( -3, 3, "L"))
            .concat(zakoG(  3, 3, "L"))

            .concat(delay180)
            .concat(delay180)

            .concat([
                {
                    frame: 10,
                    enemies: [],
                    message: {
                        color: "red",
                        text: "WARNING!!",
                        visible: true
                    }
                }
            ])
            .concat(delay180).concat(delay120)
            .concat([
                {
                    frame: 10,
                    enemies: [],
                    message: {
                        color: "white",
                        text: "",
                        visible: false
                    }
                }
            ])
            .concat([
                {
                    frame: 20,
                    enemies: [
                        [ 0, 21.9, "boss", "boss31", "boss3" ]
                    ]
                }
            ]);

            // StageData = [
            //     {
            //         frame: 220,
            //         enemies: [
            //             [ 0, 8, "boss", "boss32", "boss3" ]
            //         ]
            //     }
            // ];
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
