"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//https://eskerda.com/bsp-dungeon-generation/
var MAP_SIZE = 50;
var W_RATIO = 0.45;
var H_RATIO = 0.45;
var DISCARD_BY_RATIO = true;
var Dungeon = require("./entities");
var common_1 = require("./common");
var Room = (function () {
    function Room(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.center = new common_1.Point(this.x + Math.floor(this.w / 2), Math.floor(this.y + this.h / 2));
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
    Room.prototype.addRoom = function (mapTiles) {
        for (var x = this.x; x <= this.w; x++)
            for (var y = this.y; x <= this.h; y++)
                mapTiles[x][y] = new Dungeon.Floor();
    };
    Room.prototype.addPath = function (mapTiles, point) {
        for (var y = this.center.y; y <= point.y; y++)
            for (var x = this.center.x; x <= point.x; x++)
                mapTiles[y][x] = new Dungeon.Floor();
    };
    return Room;
}());
var RoomContainer = (function (_super) {
    __extends(RoomContainer, _super);
    function RoomContainer(x, y, w, h) {
        return _super.call(this, x, y, w, h) || this;
    }
    RoomContainer.prototype.growRoom = function () {
        //
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
    Tree.prototype.add = function (mapTiles) {
        this.leaf.addRoom(mapTiles);
        if (this.lchild !== undefined)
            this.lchild.add(mapTiles);
        if (this.rchild !== undefined)
            this.rchild.add(mapTiles);
    };
    return Tree;
}());
var Map = (function () {
    function Map() {
        this.N_ITERATIONS = 4;
        this.level = 1;
    }
    Map.prototype.generate = function () {
        this.rooms = [];
        this.tileMap = new Array(MAP_SIZE);
        this.initTileMap();
        var main_room = new RoomContainer(0, 0, MAP_SIZE, MAP_SIZE);
        this.roomTree = this.split_room(main_room, this.N_ITERATIONS);
        this.growRooms();
        this.addPaths(this.roomTree);
        this.addEntities();
    };
    Map.prototype.initTileMap = function () {
        for (var y = 0; y <= MAP_SIZE; y++) {
            this.tileMap[y] = new Array(MAP_SIZE);
            for (var x = 0; x <= MAP_SIZE; x++)
                this.tileMap[y][x] = new Dungeon.Empty();
        }
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
            this.addRoom(leafs[i].room);
        }
    };
    Map.prototype.addRoom = function (room) {
        for (var y = room.y; y < room.y + room.h; y++)
            for (var x = room.x; x < room.x + room.w; x++)
                this.tileMap[y][x] = new Dungeon.Floor();
    };
    Map.prototype.addEntities = function () {
        for (var i = 0; i < this.rooms.length; i++) {
            var room = this.rooms[i];
            if (room.addMonster(this.level))
                this.tileMap[room.monster.location.y][room.monster.location.x] = room.monster;
            if (room.addHealthPotion())
                this.tileMap[room.healthPotion.location.y][room.healthPotion.location.x] = room.healthPotion;
        }
        //add one weapon
        //TODO: stop adding weapons after the player collects the best weapon
        this.weapon = Dungeon.WeaponFactory.get(this.level);
        this.weapon.location = this.getRandomPoint();
        this.tileMap[this.weapon.location.y][this.weapon.location.x] = this.weapon;
        //add one set of stairs
        this.stairs = new Dungeon.Stairs();
        this.stairs.location = this.getRandomPoint();
        this.tileMap[this.stairs.location.y][this.stairs.location.x] = this.stairs;
        if (this.level === 1) {
            this.player = new Dungeon.Player();
        }
        var startPoint = this.getRandomPoint();
        this.player.location = startPoint;
        this.tileMap[startPoint.y][startPoint.x] = this.player;
    };
    Map.prototype.getRandomPoint = function () {
        var room = this.rooms[common_1.Random.next(0, this.rooms.length - 1)];
        return room.unusedPoint();
    };
    Map.prototype.addPaths = function (tree) {
        if (tree.lchild !== undefined && tree.rchild !== undefined) {
            tree.lchild.leaf.addPath(this.tileMap, tree.rchild.leaf.center);
            this.addPaths(tree.lchild);
            this.addPaths(tree.rchild);
        }
    };
    Map.prototype.addRooms = function () {
        //
        for (var i = 0; i < this.rooms.length; i++)
            this.rooms[i].addRoom(this.tileMap);
    };
    return Map;
}());
exports.Map = Map;
