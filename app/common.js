"use strict";
var Random = (function () {
    function Random() {
    }
    Random.next = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return Random;
}());
exports.Random = Random;
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.toString = function () {
        return this.x + "," + this.y;
    };
    return Point;
}());
exports.Point = Point;