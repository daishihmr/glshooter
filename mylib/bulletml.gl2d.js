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

(function() {

    /** @constructor */
    bulletml.BulletSpec = function() {};

    /** @constructor */
    bulletml.AttackParam = function() {
        /** @type {function(bulletml.BulletSpec):glslib.Sprite} */
        this.bulletFactory = function(spec) {
            return null;
        };

        /** @type {function(glslib.Sprite):boolean} */
        this.isInsideOfWorld = function(sprite) {
            return true;
        };

        /** @type {function(glslib.Sprite)} */
        this.onFire = function(bullet) {
        };

        /** @type {number} */
        this.rank = 0.5;

        /** @type {boolean} */
        this.updateProperties = false;

        /** @type {number} */
        this.speedRate = 2.0;

        /** @type {?glslib.Sprite} */
        this.target = null;
    };

    /** 
     * @constructor
     * @param {bulletml.Root} bulletml
     */
    bulletml.AttackPattern = function(bulletml) {
        this._bulletml = bulletml;
    };

    /**
     *
     * @param {bulletml.AttackParam} config
     * @param {(string|bulletml.Bullet)=} action
     * @return {bulletml.Ticker}
     */
    bulletml.AttackPattern.prototype.createTicker = function(config, action) {
        var topLabels = this._bulletml.getTopActionLabels();
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
                if (parentTicker.compChildCount === tickers.length) {
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

    /**
     * @param {bulletml.AttackParam} config
     * @param {(string|bulletml.Bullet)=} action
     * @return {bulletml.Ticker}
     */
    bulletml.AttackPattern.prototype._createTicker = function(config, action) {
        /**
         * @type {bulletml.Ticker}
         * @this {glslib.Sprite}
         */
        var ticker = function() {
            if (!ticker._pattern) {
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
            this.x += Math.cos(ticker.direction) * ticker.speed * ticker.config.speedRate;
            this.y += Math.sin(ticker.direction) * ticker.speed * ticker.config.speedRate;
            this.x += ticker.speedH * ticker.config.speedRate;
            this.y += ticker.speedV * ticker.config.speedRate;

            // test out of world
            if (!ticker.config.isInsideOfWorld(this)) {
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
            if (ticker.config.updateProperties) {
                this.direction = (ticker.direction + Math.PI * 0.5) * RAD_TO_DEG;
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
                    ticker._pattern._fire.call(this, cmd, ticker.config, ticker, ticker._pattern);
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
                    ticker._pattern._changeDirection.call(this, cmd, ticker.config, ticker);
                    break;
                case "changeSpeed":
                    ticker._pattern._changeSpeed.call(this, cmd, ticker);
                    break;
                case "accel":
                    ticker._pattern._accel.call(this, cmd, ticker);
                    break;
                case "vanish":
                    if (this.parent) this.parent.removeChild(this);
                    break;
                case "notify":
                    ticker._pattern._notify.call(this, cmd);
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
            ticker.walker = this._bulletml.getWalker(action, config.rank);
        } else if (action instanceof bulletml.Bullet) {
            ticker.walker = action.getWalker(config.rank);
        } else {
            window.console.error(config, action);
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

    bulletml.AttackPattern.prototype._createSimpleTicker = function(config) {
        /**
         * @type {bulletml.Ticker}
         * @this {glslib.Sprite}
         */
        var ticker = function() {
            // move sprite
            this.x += ticker.deltaX;
            this.y += ticker.deltaY;

            // test out of world
            if (!config.isInsideOfWorld(this)) {
                if (this.parent) this.parent.removeChild(this);
                ticker.completed = true;
                if (ticker.parentTicker) {
                    ticker.parentTicker.completeChild();
                } else {
                    if (this.oncompleteattack) this.oncompleteattack();
                }
                return;
            }
        };

        ticker.config = config;
        ticker.direction = 0;
        ticker.speed = 0;
        ticker.deltaX = 0;
        ticker.deltaY = 0;

        ticker.isDanmaku = true;
        return ticker;
    };

    /**
     * @param {bulletml.Fire} cmd
     * @param {bulletml.AttackParam} config
     * @param {function} ticker
     * @param {bulletml.AttackPattern} pattern
     * @this {glslib.Sprite}
     */
    bulletml.AttackPattern.prototype._fire = function(cmd, config, ticker, pattern) {
        var spec = { label: cmd.bullet.label };
        for (var key in cmd.bullet.option) {
            spec[key] = cmd.bullet.option[key];
        }
        var b = config.bulletFactory(spec);
        if (b === void 0) {
            return;
        }

        // 等速直進弾?
        var uniformLinearBullet = cmd.bullet.actions.length === 0;

        var bt = uniformLinearBullet ? (
            pattern._createSimpleTicker(config)
        ) : (
            pattern.createTicker(config, cmd.bullet)
        );

        var attacker = this;
        var gunPosition = {
            x: this.x + cmd.option.offsetX,
            y: this.y + cmd.option.offsetY
        };

        var calcDirection = function(d) {
            var dv = eval(d.value) * DEG_TO_RAD;
            // console.debug(d.type);
            switch (d.type) {
            case "aim":
                if (cmd.option.autonomy) {
                    return angleAtoB(gunPosition, config.target) + dv;
                } else {
                    return angleAtoB(attacker, config.target) + dv;
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

        b.x = gunPosition.x;
        b.y = gunPosition.y;

        if (uniformLinearBullet) {
            bt.deltaX = Math.cos(bt.direction) * bt.speed * config.speedRate;
            bt.deltaY = Math.sin(bt.direction) * bt.speed * config.speedRate;
        }

        // set direction, speed to bullet
        if (config.updateProperties || b.updateProperties) {
            b.direction = (bt.direction + Math.PI * 0.5) * Math.RAD_TO_DEG;
            b.speed = bt.speed;
        }

        b.update = bt;
        if (this.parent !== null) this.parent.addChild(b);

        config.onFire(b);
    };

    /**
     * @param {bulletml.ChangeDirection} cmd
     * @param {bulletml.AttackParam} config
     * @param {function} ticker
     * @this {glslib.Sprite}
     */
    bulletml.AttackPattern.prototype._changeDirection = function(cmd, config, ticker) {
        var d = eval(cmd.direction.value) * DEG_TO_RAD;
        var t = eval(cmd.term);
        switch (cmd.direction.type) {
        case "aim":
            var tar = config.target;
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

    /**
     * @param {bulletml.ChangeSpeed} cmd
     * @param {function} ticker
     * @this {glslib.Sprite}
     */
    bulletml.AttackPattern.prototype._changeSpeed = function(cmd, ticker) {
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

    /**
     * @param {bulletml.Accel} cmd
     * @param {function} ticker
     * @this {glslib.Sprite}
     */
    bulletml.AttackPattern.prototype._accel = function(cmd, ticker) {
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
    };

    /**
     * @param {bulletml.Notify} cmd
     * @this {glslib.Sprite}
     */
    bulletml.AttackPattern.prototype._notify = function(cmd) {
        // var e = tm.event.Event(cmd.eventName);
        // if (cmd.params) {
        //     for (var key in cmd.params) {
        //         e[key] = cmd.params[key];
        //     }
        // }
        // this.dispatchEvent(e);
    };

    /** @const */
    var RAD_TO_DEG = 180 / Math.PI;
    /** @const */
    var DEG_TO_RAD = Math.PI / 180;

    /**
     * ラジアンを -π<= rad < π の範囲に正規化する.
     * @param {number} radian
     * @return {number}
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
     * @param {glslib.Sprite} a
     * @param {glslib.Sprite} b
     * @return {number}
     */
    function angleAtoB(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }

    /**
     * @constructor
     */
    bulletml.Ticker = function() {
        this._pattern = this;
        /** @type {?bulletml.AttackParam} */
        this.config = null;
        this.waitTo = -1;
        this.completed = false;
        this.direction = 0;
        this.lastDirection = 0;
        this.speed = 0;
        this.lastSpeed = 0;
        this.speedH = 0;
        this.speedV = 0;
        this.dirIncr = 0;
        this.dirFin = 0;
        this.chDirEnd = -1;
        this.spdIncr = 0;
        this.spdFin = 0;
        this.chSpdEnd = -1;
        this.aclIncrH = 0;
        this.aclFinH = 0;
        this.aclIncrV = 0;
        this.aclFinV = 0;
        this.aclEnd = -1;
        this.isDanmaku = true;
    };

})();
