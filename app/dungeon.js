"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//https://www.goose.ninja/tutorials/pixi-js/keyboard-events/
//https://eskerda.com/bsp-dungeon-generation/
var MAP_SIZE = 50;
var SQUARE = 800 / MAP_SIZE;
var W_RATIO = 0.45;
var H_RATIO = 0.45;
var DISCARD_BY_RATIO = true;
var PIXI = require("pixi.js");
var Dungeon = require("./entities");
var common_1 = require("./common");
var Room = (function () {
    //stairs:Tile;
    function Room(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.center = new common_1.Point(this.x + this.w / 2, this.y + this.h / 2);
        this.usedPoints = [];
    }
    Room.prototype.addMonster = function (level) {
        if (Math.random() < 0.5) {
            this.monster = Dungeon.MonsterFactory.random(level);
            var point = this.unusedPoint();
            this.usedPoints.push(point.toString());
            this.monster.location = point;
            return true;
        }
    };
    Room.prototype.addHealthPotion = function () {
        if (Math.random() < 0.25) {
            this.healthPotion = new Dungeon.HealthPotion();
            var point = this.unusedPoint();
            this.usedPoints.push(point.toString());
            this.healthPotion.location = point;
            return true;
        }
        return false;
    };
    Room.prototype.unusedPoint = function () {
        //random x and y
        var x = common_1.Random.next(this.x + 1, this.x + this.w - 1);
        var y = common_1.Random.next(this.y + 1, this.y + this.h - 1);
        var found = false;
        while (!found) {
            //is it empty?
            var point = x + "," + y;
            if (this.usedPoints.indexOf(point) === -1) {
                found = true;
            }
        }
        return new common_1.Point(x, y);
    };
    Room.prototype.paint = function (graphics) {
        graphics.beginFill(0x9C640C); // Brown
        graphics.drawRect(this.x * SQUARE, this.y * SQUARE, this.w * SQUARE, this.h * SQUARE);
        graphics.endFill();
    };
    Room.prototype.drawPath = function (graphics, point) {
        graphics.beginFill(0x9C640C);
        graphics.lineStyle(SQUARE, 0x9C640C);
        graphics.moveTo(this.center.x * SQUARE, this.center.y * SQUARE);
        graphics.lineTo(point.x * SQUARE, point.y * SQUARE);
        graphics.endFill();
    };
    Room.prototype.drawEntities = function (graphics) {
        if (this.monster !== undefined)
            this.monster.paint(graphics, SQUARE);
        if (this.healthPotion !== undefined)
            this.healthPotion.paint(graphics, SQUARE);
    };
    return Room;
}());
var RoomContainer = (function (_super) {
    __extends(RoomContainer, _super);
    function RoomContainer(x, y, w, h) {
        return _super.call(this, x, y, w, h) || this;
    }
    RoomContainer.prototype.growRoom = function () {
        //debugger;
        var x, y, w, h;
        x = this.x + common_1.Random.next(0, Math.floor(this.w / 3));
        y = this.y + common_1.Random.next(0, Math.floor(this.h / 3));
        w = this.w - (x - this.x);
        h = this.h - (y - this.y);
        w -= common_1.Random.next(0, w / 3);
        h -= common_1.Random.next(0, h / 3);
        this.room = new Room(x, y, w, h);
    };
    return RoomContainer;
}(Room));
var Tree = (function () {
    function Tree(leaf) {
        this.leaf = leaf;
    }
    Tree.prototype.getLeafs = function () {
        if (this.lchild === undefined && this.rchild === undefined)
            return [this.leaf];
        else
            return [].concat(this.lchild.getLeafs(), this.rchild.getLeafs());
    };
    Tree.prototype.paint = function (graphics) {
        this.leaf.paint(graphics);
        if (this.lchild !== undefined)
            this.lchild.paint(graphics);
        if (this.rchild !== undefined)
            this.rchild.paint(graphics);
    };
    return Tree;
}());
var Map = (function () {
    function Map(width, height, mapElement) {
        this.N_ITERATIONS = 4;
        this.mapElement = mapElement;
        this.width = width;
        this.height = height;
        this.rooms = [];
        this.entities = [];
        this.init();
    }
    Map.prototype.init = function () {
        this.level = 1;
        this.pixiApp = new PIXI.Application(this.width, this.height, { backgroundColor: 0x000000 });
        this.graphics = new PIXI.Graphics();
        this.entityGraphics = new PIXI.Graphics();
        var main_room = new RoomContainer(0, 0, MAP_SIZE, MAP_SIZE);
        this.roomTree = this.split_room(main_room, this.N_ITERATIONS);
        this.growRooms();
        this.addEntities();
    };
    Map.prototype.random_split = function (room) {
        var r1, r2;
        if (common_1.Random.next(0, 1) == 0) {
            // Vertical
            r1 = new RoomContainer(room.x, room.y, // r1.x, r1.y
            common_1.Random.next(1, room.w), room.h // r1.w, r1.h
            );
            r2 = new RoomContainer(room.x + r1.w, room.y, // r2.x, r2.y
            room.w - r1.w, room.h // r2.w, r2.h
            );
            if (DISCARD_BY_RATIO) {
                var r1_w_ratio = r1.w / r1.h;
                var r2_w_ratio = r2.w / r2.h;
                if (r1_w_ratio < W_RATIO || r2_w_ratio < W_RATIO) {
                    return this.random_split(room);
                }
            }
        }
        else {
            // Horizontal
            r1 = new RoomContainer(room.x, room.y, // r1.x, r1.y
            room.w, common_1.Random.next(1, room.h) // r1.w, r1.h
            );
            r2 = new RoomContainer(room.x, room.y + r1.h, // r2.x, r2.y
            room.w, room.h - r1.h // r2.w, r2.h
            );
            if (DISCARD_BY_RATIO) {
                var r1_h_ratio = r1.h / r1.w;
                var r2_h_ratio = r2.h / r2.w;
                if (r1_h_ratio < H_RATIO || r2_h_ratio < H_RATIO) {
                    return this.random_split(room);
                }
            }
        }
        return [r1, r2];
    };
    Map.prototype.split_room = function (room, iter) {
        var root = new Tree(room);
        //room.paint(this.graphics);
        if (iter != 0) {
            var sr = this.random_split(room);
            root.lchild = this.split_room(sr[0], iter - 1);
            root.rchild = this.split_room(sr[1], iter - 1);
        }
        return root;
    };
    Map.prototype.growRooms = function () {
        var leafs = this.roomTree.getLeafs();
        for (var i = 0; i < leafs.length; i++) {
            leafs[i].growRoom();
            this.rooms.push(leafs[i].room);
        }
    };
    Map.prototype.addEntities = function () {
        debugger;
        for (var i = 0; i < this.rooms.length; i++) {
            var room = this.rooms[i];
            if (room.addMonster(this.level))
                this.entities[room.monster.location.toString()] = room.monster;
            if (room.addHealthPotion())
                this.entities[room.healthPotion.location.toString()] = room.healthPotion;
        }
    };
    Map.prototype.clear = function () {
        this.graphics.beginFill(0x000000, 0); // black
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();
        this.entityGraphics.beginFill(0x000000, 0); // black
        this.entityGraphics.drawRect(0, 0, this.width, this.height);
        this.entityGraphics.endFill();
    };
    Map.prototype.drawPaths = function (tree) {
        if (tree.lchild !== undefined && tree.rchild !== undefined) {
            tree.lchild.leaf.drawPath(this.graphics, tree.rchild.leaf.center);
            this.drawPaths(tree.lchild);
            this.drawPaths(tree.rchild);
        }
    };
    Map.prototype.drawEntities = function () {
        //debugger;
        var leafs = this.roomTree.getLeafs();
        for (var i = 0; i < leafs.length; i++)
            leafs[i].room.drawEntities(this.entityGraphics);
    };
    Map.prototype.drawContainers = function () {
        this.roomTree.paint(this.graphics);
    };
    Map.prototype.drawRooms = function () {
        //debugger;
        for (var i = 0; i < this.rooms.length; i++)
            this.rooms[i].paint(this.graphics);
    };
    Map.prototype.paint = function () {
        this.clear();
        //this.drawGrid();
        //this.drawContainers();
        this.drawRooms();
        this.drawPaths(this.roomTree);
        this.drawEntities();
        this.pixiApp.stage.addChild(this.graphics);
        this.pixiApp.stage.addChild(this.entityGraphics);
        this.mapElement.appendChild(this.pixiApp.view);
    };
    return Map;
}());
exports.Map = Map;
