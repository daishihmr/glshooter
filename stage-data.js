/*
ステージステップが先に進む条件。
 1. scene.frameが規定値に達する
 2. 特定の敵を倒す
*/

var setupStageData = function(app, stage) {

    var delay20 = [ { frame: 20, enemies: [] } ];
    var delay40 = [ { frame: 40, enemies: [] } ];
    var delay60 = [ { frame: 60, enemies: [] } ];

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
    var middleKLeft = [
        {
            frame: 10,
            enemies: [
                [ -20, 10, "middleK", "middleKL" ],
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
    } else if (stage === 2) {
        StageData = StageData
            .concat(delay60).concat(delay60)
            .concat(delay60).concat(delay60)

            .concat(pZako7(8))
            .concat(delay60).concat(delay60)

            .concat(pZako7(-8))
            .concat(delay60).concat(delay60)

            .concat(pZako7(8))
            .concat(delay60).concat(delay60)

            .concat(pZako7(-8))
            .concat(delay60).concat(delay60)

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

            .concat(delay60).concat(delay60).concat(delay60)

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

            StageData = [
                {
                    frame: 20,
                    enemies: [
                        [ -12, -21.9, "boss", "boss21"]
                    ]
                }
            ];
    }

    var cursor = 0;
    var last = 0;
    StageData.next = function(frame, flags) {
        var result;
        if (this[cursor] === void 0) {
            return;
        } else if (last + this[cursor].frame === frame) {
            result = this[cursor];
        } else if (flags[this[cursor].flag] === true) {
            result = this[cursor];
        } else {
            return;
        }
        cursor++;
        last = frame;
        return result;
    };

    return StageData;
};
