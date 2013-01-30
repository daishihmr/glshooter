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

var AttackPattern;
(function() {

    AttackPattern = function(bulletml) {
        this._bulletml = bulletml;
    };

    AttackPattern.prototype.createTicker = function(config, action) {
        var topLabels = this._bulletml.getTopActionLabels()
        if (action === void 0 && topLabels.length > 0) {
            // top***対応.
            // actionラベルtop***が定義されていた場合、それらを同時に動かす.
            var tickers = [];
            for ( var i = 0, end = topLabels.length; i < end; i++) {
                tickers[tickers.length] = this._createTicker(config, topLabels[i]);
            }
            var parentTicker = function() {
                for ( var i = tickers.length; i--;) {
                    tickers[i].call(this);
                }
                if (parentTicker.compChildCount == tickers.length) {
                    parentTicker.complete = true;
                    if (this.oncompleteattack) this.oncompleteattack();
                }
            };
            for ( var i = tickers.length; i--;) {
                tickers[i].parentTicker = parentTicker;
            }

            parentTicker.compChildCount = 0;
            parentTicker.completeChild = function() {
                this.compChildCount++;
            };

            parentTicker.compChildCount = 0;
            parentTicker.complete = false;
            parentTicker.isDanmaku = true;

            return parentTicker;
        } else {
            return this._createTicker(config, action);
        }
    };
    AttackPattern.prototype._createTicker = function(config, action) {
        var ticker = function() {
            var conf = ticker.config;
            var ptn = ticker._pattern;

            if (!ptn) {
                return;
            }

            // update direction
            if (this.age < ticker.chDirEnd) {
                ticker.direction += ticker.dirIncr;
            } else if (this.age === ticker.chDirEnd) {
                ticker.direction = ticker.dirFin;
            }

            // update speed
            if (this.age < ticker.chSpdEnd) {
                ticker.speed += ticker.spdIncr;
            } else if (this.age === ticker.chSpdEnd) {
                ticker.speed = ticker.spdFin;
            }

            // update accel
            if (this.age < ticker.aclEnd) {
                ticker.speedH += ticker.aclIncrH;
                ticker.speedV += ticker.aclIncrV;
            } else if (this.age === ticker.aclEnd) {
                ticker.speedH = ticker.aclFinH;
                ticker.speedV = ticker.aclFinV;
            }

            // move sprite
            this.x += Math.cos(ticker.direction) * ticker.speed * conf["speedRate"];
            this.y += Math.sin(ticker.direction) * ticker.speed * conf["speedRate"];
            this.x += ticker.speedH * conf["speedRate"];
            this.y += ticker.speedV * conf["speedRate"];

            // test out of world
            if (!conf["isInsideOfWorld"](this)) {
                if (this.parent) this.parent.removeChild(this);
                ticker.completed = true;
                if (ticker.parentTicker) {
                    ticker.parentTicker.completeChild();
                } else {
                    if (this.oncompleteattack) this.oncompleteattack();
                }
                return;
            }

            // set direction, speed to bullet
            if (conf["updateProperties"]) {
                this.direction = (ticker.direction + Math.PI / 2) * RAD_TO_DEG;
                this.speed = ticker.speed;
            }

            // proccess walker
            if (this.age < ticker.waitTo || ticker.completed) {
                return;
            }
            var cmd;
            while (cmd = ticker.walker.next()) {
                switch (cmd.commandName) {
                case "fire":
                    ptn._fire.call(this, cmd, conf, ticker, ptn);
                    break;
                case "wait":
                    var v = 0;
                    if (typeof(cmd.value) === 'number') {
                        ticker.waitTo = this.age + cmd.value;
                    } else if ((v = ~~(cmd.value)) !== 0) {
                        ticker.waitTo = this.age + v;
                    } else {
                        ticker.waitTo = this.age + eval(cmd.value);
                    }
                    return;
                case "changeDirection":
                    ptn._changeDirection.call(this, cmd, conf, ticker);
                    break;
                case "changeSpeed":
                    ptn._changeSpeed.call(this, cmd, ticker);
                    break;
                case "accel":
                    ptn._accel.call(this, cmd, ticker);
                    break;
                case "vanish":
                    if (this.parent) this.parent.removeChild(this);
                    break;
                }
            }

            // complete
            ticker.completed = true;
            if (ticker.parentTicker) {
                ticker.parentTicker.completeChild();
            } else {
                if (this.oncompleteattack) this.oncompleteattack();
            }
        };

        action = action || "top";
        if (typeof (action) === "string") {
            ticker.walker = this._bulletml.getWalker(action, config["rank"]);
        } else if (action instanceof BulletML.Bullet) {
            ticker.walker = action.getWalker(config["rank"]);
        } else {
            console.error(config, action);
            throw new Error("引数が不正");
        }

        ticker._pattern = this;
        ticker.config = config;
        ticker.waitTo = -1;
        ticker.completed = false;
        ticker.direction = 0;
        ticker.lastDirection = 0;
        ticker.speed = 0;
        ticker.lastSpeed = 0;
        ticker.speedH = 0;
        ticker.speedV = 0;
        ticker.dirIncr = 0;
        ticker.dirFin = 0;
        ticker.chDirEnd = -1;
        ticker.spdIncr = 0;
        ticker.spdFin = 0;
        ticker.chSpdEnd = -1;
        ticker.aclIncrH = 0;
        ticker.aclFinH = 0;
        ticker.aclIncrV = 0;
        ticker.aclFinV = 0;
        ticker.aclEnd = -1;

        ticker.isDanmaku = true;
        return ticker;
    };
    AttackPattern.prototype._fire = function(cmd, config, ticker, pattern) {
        var b = config["bulletFactory"]({
            label : cmd.bullet.label
        });
        if (b === void 0) {
            return;
        }

        var bt = pattern.createTicker(config, cmd.bullet);

        var attacker = this;
        var calcDirection = function(d) {
            var dv = eval(d.value) * DEG_TO_RAD;
            // console.debug(d.type);
            switch (d.type) {
            case "aim":
                if (config["target"]) {
                    return angleAtoB(attacker, config["target"]) + dv;
                } else {
                    return dv - Math.PI / 2;
                }
            case "absolute":
                return dv - Math.PI / 2; // 真上が0度
            case "relative":
                return ticker.direction + dv;
            case "sequence":
            default:
                // console.debug(ticker.lastDirection, dv);
                return ticker.lastDirection + dv;
            }
        };
        ticker.lastDirection = bt.direction = calcDirection(cmd.direction || cmd.bullet.direction);
        // console.debug(bt.direction);

        var calcSpeed = function(s) {
            var sv = eval(s.value);
            switch (s.type) {
            case "relative":
            case "sequence":
                return ticker.lastSpeed + sv;
            case "absolute":
            default:
                return sv;
            }
        };
        ticker.lastSpeed = bt.speed = calcSpeed(cmd.speed || cmd.bullet.speed);

        b.x = this.x + ((this.width || 0) - (b.width || 0)) / 2;
        b.y = this.y + ((this.height || 0) - (b.height || 0)) / 2;

        b.update = bt;
        if (this.parent !== null) this.parent.addChild(b);
    };
    AttackPattern.prototype._changeDirection = function(cmd, config, ticker) {
        var d = eval(cmd.direction.value) * DEG_TO_RAD;
        var t = eval(cmd.term);
        switch (cmd.direction.type) {
        case "aim":
            var tar = config["target"];
            if (!tar) {
                return;
            }
            ticker.dirFin = angleAtoB(this, tar) + d;
            ticker.dirIncr = normalizeRadian(ticker.dirFin - ticker.direction) / t;
            break;
        case "absolute":
            ticker.dirFin = d - Math.PI / 2;
            ticker.dirIncr = normalizeRadian(ticker.dirFin - ticker.direction) / t;
            break;
        case "relative":
            ticker.dirFin = ticker.direction + d;
            ticker.dirIncr = normalizeRadian(ticker.dirFin - ticker.direction) / t;
            break;
        case "sequence":
            ticker.dirIncr = d;
            ticker.dirFin = ticker.direction + ticker.dirIncr * t;
            break;
        }
        ticker.chDirEnd = this.age + t;
    };
    AttackPattern.prototype._changeSpeed = function(cmd, ticker) {
        var s = eval(cmd.speed.value);
        var t = eval(cmd.term);
        switch (cmd.speed.type) {
        case "absolute":
            ticker.spdFin = s;
            ticker.spdIncr = (ticker.spdFin - ticker.speed) / t;
            break;
        case "relative":
            ticker.spdFin = s + ticker.speed;
            ticker.spdIncr = (ticker.spdFin - ticker.speed) / t;
            break;
        case "sequence":
            ticker.spdIncr = s;
            ticker.spdFin = ticker.speed + ticker.spdIncr * t;
            break;
        }
        ticker.chSpdEnd = this.age + t;
    };
    AttackPattern.prototype._accel = function(cmd, ticker) {
        var t = eval(cmd.term);
        ticker.aclEnd = this.age + t;

        if (cmd.horizontal) {
            var h = eval(cmd.horizontal.value);
            switch (cmd.horizontal.type) {
            case "absolute":
            case "sequence":
                ticker.aclIncrH = (h - ticker.speedH) / t;
                ticker.aclFinH = h;
                break;
            case "relative":
                ticker.aclIncrH = h;
                ticker.aclFinH = (h - ticker.speedH) * t;
                break;
            }
        } else {
            ticker.aclIncrH = 0;
            ticker.aclFinH = ticker.speedH;
        }

        if (cmd.vertical) {
            var v = eval(cmd.vertical.value);
            switch (cmd.vertical.type) {
            case "absolute":
            case "sequence":
                ticker.aclIncrV = (v - ticker.speedV) / t;
                ticker.aclFinV = v;
                break;
            case "relative":
                ticker.aclIncrV = v;
                ticker.aclFinV = (v - ticker.speedV) * t;
                break;
            }
        } else {
            ticker.aclIncrV = 0;
            ticker.aclFinV = ticker.speedV;
        }
    }

    var RAD_TO_DEG = 180 / Math.PI;
    var DEG_TO_RAD = Math.PI / 180;

    /**
     * ラジアンを -π<= rad < π の範囲に正規化する.
     */
    function normalizeRadian(radian) {
        while (radian <= -Math.PI) {
            radian += Math.PI * 2;
        }
        while (Math.PI < radian) {
            radian -= Math.PI * 2;
        }
        return radian;
    }
    /**
     * スプライトAから見たスプライトBの方向をラジアンで返す.
     */
    function angleAtoB(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }

})();
