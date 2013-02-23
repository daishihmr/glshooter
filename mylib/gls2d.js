/** @namespace */
var glslib = {};

(function(undefined) {

/**
 * @constructor
 * @param {HTMLCanvasElement} canvas
 */
glslib.Scene = function(canvas) {
    this.canvas = canvas;
    var ctx = this.ctx = canvas.getContext("2d");

    this.children = [];
    this._removedChildren = [];

    this.frame = 0;

    this.update = function() {};

    this.createGlowTexture();
};

/**
 * 
 */
glslib.Scene.prototype._update = function() {
    this.update();

    var children = this.children;
    var removedChildren = this._removedChildren;

    for (var i = 0, len = children.length; i < len; i++) {
        var c = children[i];
        c._update();
    }

    for (var i = 0, len = removedChildren.length; i < len; i++) {
        var index = this.children.indexOf(removedChildren[i]);
        if (index != -1) children.splice(index, 1);
    }
    this._removedChildren = [];

    this.frame++;
};

/**
 * 
 */
glslib.Scene.prototype._draw = function() {
    var children = this.children;
    var ctx = this.ctx;
    var program = this.program;
    this.clear();

    ctx.scale = this.canvas.width/32;

    ctx.globalCompositeOperation = "lighter";
    for (var i = 0, len = children.length; i < len; i++) {
        children[i]._draw(this.canvas, ctx);
    }
};

/**
 * 
 */
glslib.Scene.prototype.clear = function() {
    this.ctx.globalCompositeOperation = "copy";
    this.ctx.fillStyle = "rgba(0,0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * @param {glslib.Sprite} sprite
 */
glslib.Scene.prototype.addChild = function(sprite) {
    var c = this.children;
    c[c.length] = sprite;
    sprite.parent = this;
    sprite.uniforms = this.uniformLocationsForSprite;
};

/**
 * @param {glslib.Sprite} sprite
 */
glslib.Scene.prototype.removeChild = function(sprite) {
    if (sprite.parent !== this) return;
    sprite.parent = null;
    this._removedChildren[this._removedChildren.length] = sprite;
    sprite.onremoved();
};

glslib.Scene.prototype.createGlowTexture = function() {
    glslib.Sprite.glowTexture = new Image();
    glslib.Sprite.glowTexture.src = GLOW_TEXTURE_IMAGE;
};

/**
 * @constructor
 * @param {Image=} texture
 */
glslib.Sprite = function(texture) {
    this.age = 0;
    this.parent = null;

    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;

    this.texX = 0;
    this.texY = 0;
    this.texScale = 1;

    this.visible = true;

    this.alpha = 1;
    this.glow = 0;

    this.texture = null;
    if (texture) {
        this.texture = texture;
    }

    this.update = function() {};
    this.onremoved = function() {};
};

/**
 *
 */
glslib.Sprite.prototype._update = function() {
    this.update();
    this.age += 1;
};

/**
 */
glslib.Sprite.prototype._draw = function(canvas, ctx) {
    if (!this.visible) return;

    var x = (this.x + 16) * ctx.scale;
    var y = (16 - this.y) * ctx.scale;
    var w = 2 * this.scaleX * ctx.scale;
    var h = 2 * this.scaleY * ctx.scale;

    if (this.texture != null) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(x, y);
        ctx.rotate(this.rotation*Math.DEG_TO_RAD);
        ctx.drawImage(this.texture, 
            this.texX*64, this.texY*64, 64*this.texScale, 64*this.texScale, 
            -w*0.5, -h*0.5, w, h);

        if (this.glow > 0) {
            w *= 2;
            h *= 2;
            ctx.globalAlpha = this.glow * 0.5;
            ctx.drawImage(glslib.Sprite.glowTexture, -w*0.5, -h*0.5, w, h);
        }
        ctx.restore();
    }
};

/**
 * @param {HTMLElement} domElement
 */
glslib.fitWindow = function(domElement) {
    domElement.style.position = "absolute";
    domElement.style.top = 0;
    domElement.style.left = 0;
    if (window.innerWidth / window.innerHeight < 3/4) {
        domElement.width = window.innerWidth;
        domElement.height = window.innerWidth*4/3;
    } else {
        domElement.height = window.innerHeight;
        domElement.width = window.innerHeight*3/4;
    }
};

/**
 * @param {Image} image
 */
glslib.createTexture = function(ctx, image) {
    var canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, 512, 512);
    return canvas;
};

/**
 * @param {Object.<string,Image>} images
 */
glslib.createTextures = function(ctx, images) {
    var result = {};
    for (var key in images) {
        result[key] = glslib.createTexture(null, images[key]);
    }
    return result;
};

/**
 * @constructor
 * @param {function():*} generatingFunction
 * @param {number=} initialSize
 * @param {number=} incremental
 */
glslib.Pool = function(generatingFunction, initialSize, incremental) {
    this.generatingFunction = generatingFunction;
    this.incremental = incremental || 100;

    this._pool = [];
    for (var i = 0, len = initialSize || 100; i < len; i++) {
        this._pool[this._pool.length] = generatingFunction();
    }
};

/**
 * @return {*}
 */
glslib.Pool.prototype.get = function() {
    var p = this._pool.pop();
    if (p) {
        return p;
    } else {
        for (var i = 0; i < this.incremental; i++) {
            this._pool[this._pool.length] = this.generatingFunction();
        }
        return this._pool.pop();
    }
};

/**
 * param {*} obj
 */
glslib.Pool.prototype.dispose = function(obj) {
    this._pool[this._pool.length] = obj;
};

var GLOW_TEXTURE_IMAGE = "data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFa0lEQVR4Xu2biXLbMAxE697//7VJerhcBat\
ZrQGSvtLGqmY0suW09j4uAF46fHjD43g8HtrX8cy++dhuHg+HA65vcuDH3O1ogj+2/1zPKQCA0M7fPBsQvL\
7LcXMAIfpT+7U4XTzeDx0QwjcQ2r1fOG8N42YAmnAI/hzCKV4h4LsuBQDxcMECoZ0/Gwhcrz6uBmDCFYA7g\
G6YdcAaAiZ+AXArEBcDiIT2JVodwl38KAyy1qPtU/uLAwgBIHD+uDRxXgQgWh3iMwCzYTAL4MT+bP0QvwAI\
CGeHxdkAmngKp3iF4HnAXcA8APH+3Sx9sL46gHG/xr8BgHiFgPfTxzQAsbwCmIEwWwqXPoCJZx6YEk8nnBM\
SUwBC/NewvANwCJkLZvoCFQB1wJr8Quza8io+Xr/M5IUhABNPCAoDMa8QFAA+g3gvh1klyAAw/lU47qntFc\
ILxc9CmAEAsXpCbOYGVgK9ag4ghKo36ACy5Mesv2Z/a3kFgNdwAa7l0QUQCc8BZC7IKkKvT9BzgNZ/t78CW\
DK/nCfiASAglImxBBCl7pu0Pl/TAVVOcCdU/YGsClT1f9TyELiIlRB4lnvPVc8xBRBxD8EZAA8HDQnNB1nn\
qNcb9ApQtb7GPwUrAILYAGhaAOFklFkBgEiK9+tMTshcoMlwFAIa/73WL20PweGA9ZrlgxMAYn11wAjCKCl\
WYaDJacb+WdyzxfV6Ij6AnIRCBoDC9UpHVCExqgwE4OWwApDZf5T0TiwvDsBny9lcgOt6bABI63+PEOhBUB\
gMi14+yLrFIwBa7ljvK9trq/trAngKCOuYwQFkra8w3AkZBA+HKhlmVUDH/Dri83Lntu+JX0TrqS5Yf0TM5\
KjYzAVVeGjSzMJBIWi3WB3g9T/r7JRlzkUm7xXEE2eWFAB+eAZgBoQC0HDwkaOHQQZABz69pFfZfNPa7Qso\
3AEsnSMFQKHVFa3fg5FBYDiwf8BxAl2QAWC/3+t9leVdMN5vxIYbNiCaA/D+FYDYPxPv92ZAEIaHg3aPtS/\
ATlDW+rR9luWr1lYIEOouWO4hDAgAPwxCVay/V+EZlKxiZOGgYUAHsg9AAFnS61k+E5hB0L8DgJ8EgB86Au\
Bw3AkeHh4SPmDiDPFiwnYiCXri826ttnhl841Isb87AQBeCCBr+XOAZO7wsQTdoBVBHaBlLytzm1pe2bonO\
P7NCgJ54BADH4qtROvnFJv9beUKL5OEoAC09QFALT/b2t76FHvS+oQBALCiA+gJHsFSQFW/gTNI+G4ctD9H\
dVVmzwQy1l1sKVqdAABIShUAb+0eqFHIeJIEBHw3Dk5zseUzu08JMpsP/80IwIzgc92jIBAKOGB/T3DaoqN\
Wrlp/eP/eAEYAAQPH3QQWjljB/AcwyAGjFhx9nuWQdxUCu0iCuy+D6IyMavvjdoSQglse2G9XOADsfjC0++\
GwJkIf2T3+hEiSB6rh7WNOiQWA3U+KMgzYU+u1to/s3v+0eLhgvwsjAQDj82rWd2ZV6H0vjXVcsI/FUXOBT\
mpyDbBaC3yc5XHpGbro3kJotSDqa4K+USrmQ5aL7hD5exskAgAGSD6tnQHgXL8vgWU7xbKtchWAapWYS+S+\
VH7bLTIWCpzPJ4DH3yTFZtn1NjmBMLMpyneN+6aIbINUtU1O1wk3D0nE7PFZewWv2igp+cA3R2rSe+ytsgm\
EfW2WllCAZUfiuf7vD01cs1vcw8D3DqU7xmd2ikPbcLO01ikZNepS9z4emNgU7Nf1xH0+MpOERNXpedyHph\
I3ZLH/2I/NJblhnw9OJiDY6dnXo7MOIirG7BNja2qxUeGye/TWzwvrbz27DGZCZ+/9i4/P/wHZcraVmgBTv\
QAAAABJRU5ErkJggg==";

})();
