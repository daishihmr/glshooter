/*
ステージステップが先に進む条件。
 1. scene.frameが規定値に達する
 2. 特定の敵を倒す
*/

var setupStageData = function(app, stage) {

    var delay20 = [ { frame: 20, enemies: [] } ];
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

    var bigger = [
        {
            frame: 100,
            enemies: [
                [ 0, 17.0, "bigger", "bigger", "flag1" ],
            ]
        },
    ];
    var biggerKilled = [ { flag: "flag1", enemies: [] }] ;

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

    var czako4 = function(c) {
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
    var zako40 = czako4(0);
    var zako4M12 = czako4(-12);
    var zako412 = czako4(12);

    var czako5 = function(c) {
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
    var zako50 = czako5(0);
    var zako5M12 = czako5(-12);
    var zako512 = czako5(12);

    var czako5K = function(c) {
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
    var zako5K0 = czako5K(0);
    var zako5KM12 = czako5K(-12);
    var zako5K12 = czako5K(12);

    var czako6 = function(c) {
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
    var zako60 = czako6(0);
    var zako6M8 = czako6(-8);
    var zako68 = czako6(8);

    var czako6K = function(c) {
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
    var zako6K0 = czako6K(0);
    var zako6KM8 = czako6K(-8);
    var zako6K8 = czako6K(8);

    var czako7 = function(c) {
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
    var zako70 = czako7(0);
    var zako7M8 = czako7(-8);
    var zako78 = czako7(8);

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

    var channon2 = [
        {
            frame: 10,
            enemies: [
                [ -7, 19, "cannon", "cannon2" ],
                [  7, 19, "cannon", "cannon2" ],
            ]
        }
    ];
    var channon22 = [
        {
            frame: 10,
            enemies: [
                [ -12, 19, "cannon", "cannon2" ],
                [  12, 19, "cannon", "cannon2" ],
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
            .concat(zako412)
            .concat(delay60)
            .concat(cannonRight)
            .concat(delay60)
            .concat(zako412)
            .concat(delay60)
            .concat(delay60)
            .concat(zako40)
            .concat(delay60)
            .concat(cannonRight)
            .concat(zako5M12)
            .concat(delay60)
            .concat(delay60)
            .concat(zako5M12)
            .concat(delay60)
            .concat(delay60)
            .concat(zako5M12)
            .concat(delay60)
            .concat(delay60)
            .concat(delay60)
            .concat(cannonCenter)
            .concat(cannonCenter2)
            .concat(tankRight)
            .concat(tankLeft)
            .concat(zako68)
            .concat(delay60)
            .concat(delay60)
            .concat(zako6M8)
            .concat(delay60)
            .concat(delay60)
            .concat(zako68)
            .concat(delay60)
            .concat(delay60)
            .concat(zako6M8)
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

            .concat(zako78)
            .concat(delay60).concat(delay60)

            .concat(zako7M8)
            .concat(delay60).concat(delay60)

            .concat(zako78)
            .concat(delay60).concat(delay60)

            .concat(zako7M8)
            .concat(delay60).concat(delay60)

            .concat(delay60)

            .concat(zako78).concat(delay60)
            .concat(zako78).concat(delay60)
            .concat(zako78).concat(delay60)
            .concat(zako78).concat(delay60)
            .concat(zako78).concat(delay60)

            .concat(zako7M8).concat(delay60)
            .concat(zako7M8).concat(delay60)
            .concat(zako7M8).concat(delay60)
            .concat(zako7M8).concat(delay60)
            .concat(zako7M8).concat(delay60)

            .concat(delay60)

            .concat(zako5KM12).concat(delay60)
            .concat(zako5KM12).concat(delay60)
            .concat(zako5KM12)

            .concat(middleKRight).concat(delay60)

            .concat(delay60)

            .concat(zako5KM12).concat(delay60)
            .concat(zako5KM12).concat(delay60)

            .concat(delay60)

            .concat(zako6KM8).concat(delay20)
            .concat(zako6K8).concat(delay20)
            .concat(zako6KM8).concat(delay20)

            .concat(middleKLeft).concat(delay60)

            .concat(delay60)

            .concat(zako5K12).concat(delay60)
            .concat(zako5K12).concat(delay60)
            .concat(zako5K12).concat(delay60)

            .concat(channon2)
            .concat(tankBoth)

            .concat(delay60).concat(delay60)

            .concat(channon22)

            .concat(zako40).concat(delay20)
            .concat(zako40).concat(delay20)
            .concat(zako40).concat(delay20)

            .concat(zako512).concat(delay20)
            .concat(zako512).concat(delay20)
            .concat(zako512).concat(delay20)

            .concat(zako4M12).concat(delay20)
            .concat(zako4M12).concat(delay20)
            .concat(zako4M12).concat(delay20)

            .concat(delay60)
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
                        [0, 21.9, "boss", "boss21"]
                    ]
                }
            ]);

            // StageData = [
            //     {
            //         frame: 20,
            //         enemies: [
            //             [ -12, -21.9, "boss", "boss21"]
            //         ]
            //     }
            // ];
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
