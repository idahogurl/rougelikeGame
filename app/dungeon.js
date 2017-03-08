"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//Source: https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268
//Converted from ActionScript 3 to TypeScript
var Rectangle = (function () {
    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    //The y coordinate of the top-left corner of the rectangle.
    Rectangle.prototype.top = function () {
        return this.y;
    };
    //The sum of the y and height properties.
    Rectangle.prototype.bottom = function () {
        return this.y + this.height;
    };
    //The x coordinate of the top-left corner of the rectangle.
    Rectangle.prototype.left = function () {
        return this.x;
    };
    //The sum of the x and width properties.
    Rectangle.prototype.right = function () {
        return this.x + this.width;
    };
    return Rectangle;
}());
var Room = (function (_super) {
    __extends(Room, _super);
    function Room() {
        return _super.apply(this, arguments) || this;
    }
    Room.prototype.addMonsters = function (level) {
        if (Math.random() < 0.5) {
            this.monster = MonsterFactory.random(level);
        }
    };
    Room.prototype.addHealthPotions = function () {
        if (Math.random() < 0.25) {
            this.healthPotion = new HealthPotion();
        }
    };
    return Room;
}(Rectangle));
var WeaponFactory = (function () {
    function WeaponFactory() {
    }
    WeaponFactory.get = function (level) {
        var weapons = {
            3: new Weapon("2d4", "Mace", 3),
            4: new Weapon("3d4", "Long sword", 4),
            1: new Weapon("1d6", "Dagger", 1),
            5: new Weapon("4d4", "Two handed sword", 5),
            2: new Weapon("2d3", "Spear", 2)
        };
        return weapons[level];
    };
    return WeaponFactory;
}());
var MonsterFactory = (function () {
    function MonsterFactory() {
    }
    MonsterFactory.random = function (level) {
        var monsters = {
            1: [
                new Monster("Bat", 1, 1, "1d8", "1d2"),
                new Monster("Emu", 2, 1, "1d8", "1d2"),
                new Monster("Hobgoblin", 3, 1, "1d8", "1d8"),
                new Monster("Orc", 5, 1, "1d8", "1d8"),
            ],
            2: [
                new Monster("Rattlesnake", 9, 2, "2d8", "1d6"),
                new Monster("Snake", 1, 2, "1d8", "1d3"),
                new Monster("Zombie", 6, 2, "2d8", "1d8")
            ],
            3: new Monster("Quagga", 32, 3, "3d8", "1d2/1d2/1d4"),
            4: [
                new Monster("Centaur", 25, 4, "4d8", "1d2/1d5/1d5"),
                new Monster("Yeti", 50, 4, "4d8", "1d6/1d6")
            ],
            5: new Monster("Wraith", 55, 5, "5d8", "1d6"),
            6: new Monster("Troll", 120, 6, "6d8", "1d8/1d8/2d6"),
            7: [
                new Monster("Kestral", 1, 7, "1d8", "1d4"),
                new Monster("Ur-vile", 190, 7, "7d8", "1d3/1d3/1d3/4d6"),
                new Monster("Xeroc", 100, 7, "7d8", "3d4")
            ],
            8: [
                new Monster("Medusa", 200, 8, "8d8", "3d4/3d4/2d5"),
                new Monster("Phantom", 120, 8, "8d8", "4d4"),
                new Monster("Vampire", 350, 8, "8d8", "1d10")
            ],
            10: [
                new Monster("Dragon", 6800, 10, "10d8", "1d8/1d8/3d10"),
                new Monster("Leprechaun", 10, 3, "3d8", "1d2")
            ],
            15: new Monster("Jabberwock", 3000, 15, "15d8", "2d12/2d4"),
            20: new Monster("Griffin", 2000, 20, "13d8", "4d3/3d5/4d3")
        };
        var selectedMonsters = [];
        //get the monsters less than or equal to the dungeon level
        for (var monster_1 in monsters) {
            var key = parseInt(monster_1);
            if (key <= level) {
                if (Array.isArray(monsters[key])) {
                    monsters[key].forEach(function (m) {
                        selectedMonsters.push(m);
                    });
                }
                else {
                    selectedMonsters.push(monsters[key]);
                }
            }
        }
        //return a random monster from the list
        var monster = selectedMonsters[Random.next(0, selectedMonsters.length - 1)];
        monster.calcHp();
        return monster;
    };
    return MonsterFactory;
}());
var MapTiles = (function () {
    function MapTiles() {
    }
    return MapTiles;
}());
MapTiles.empty = "";
MapTiles.floor = "_";
MapTiles.wall = "|";
MapTiles.corridor = "#";
MapTiles.stairs = "S";
MapTiles.door = "D";
MapTiles.health = "H";
MapTiles.weapon = "W";
MapTiles.monster = "M";
MapTiles.player = "P";
exports.MapTiles = MapTiles;
var Dice = (function () {
    function Dice() {
    }
    Dice.roll = function (value) {
        var total = 0;
        //some monsters have damage that uses multiple dice in addition to multiple rolls
        var rolls = value.split("/");
        rolls.forEach(function (r) {
            var temp = value.split("d");
            //debugger;
            var timesRoll = parseInt(temp[0]);
            var dieSides = parseInt(temp[1]);
            for (var i = 0; i < timesRoll; i++) {
                total += Random.next(1, dieSides);
            }
        });
        return total;
    };
    return Dice;
}());
var Random = (function () {
    function Random() {
    }
    Random.next = function (min, max) {
        if (min !== undefined) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Math.floor((Math.random() * max) + 1);
    };
    return Random;
}());
exports.Random = Random;
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Leaf = (function () {
    function Leaf(x, y, Width, Height) {
        this.MINLEAFSIZE = 6; // minimum size for a leaf
        this.MAXLEAFSIZE = 20; // maximum size for a leaf
        // initialize our leaf
        this.x = x;
        this.y = y;
        this.width = Width;
        this.height = Height;
    }
    Leaf.prototype.split = function () {
        // begin splitting the leaf into 2 children
        if (this.leftChild != null || this.rightChild != null)
            return false; // we're already split! Abort!
        // determine direction of split
        // if the width is >25% larger than height, we split vertically
        // if the height is >25% larger than the width, we split horizontally
        // otherwise we split randomly
        var splitH = Math.random() > 0.5;
        if (this.width > this.height && this.width / this.height >= 1.25)
            splitH = false;
        else if (this.height > this.width && this.height / this.width >= 1.25)
            splitH = true;
        var max = (splitH ? this.height : this.width) - this.MINLEAFSIZE; // determine the maximum height or this.width
        if (max <= this.MINLEAFSIZE)
            return false; // the area is too small to split any more...
        var split = Random.next(this.MINLEAFSIZE, max); // determine where we're going to split
        // create our left and right children based on the direction of the split
        if (splitH) {
            this.leftChild = new Leaf(this.x, this.y, this.width, split);
            this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split);
        }
        else {
            this.leftChild = new Leaf(this.x, this.y, split, this.height);
            this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height);
        }
        return true; // split successful!
    };
    Leaf.prototype.getRoom = function () {
        // iterate all the way down these leafs to find a room, if one exists.
        if (this.room != null)
            return this.room;
        else {
            var lRoom = void 0;
            var rRoom = void 0;
            if (this.leftChild != null) {
                lRoom = this.leftChild.getRoom();
            }
            if (this.rightChild != null) {
                rRoom = this.rightChild.getRoom();
            }
            if (lRoom === undefined && rRoom === undefined)
                return null;
            else if (rRoom === undefined)
                return lRoom;
            else if (lRoom === undefined)
                return rRoom;
            else if (Math.random() > .5)
                return lRoom;
            else
                return rRoom;
        }
    };
    Leaf.prototype.createRooms = function (level) {
        // this generates all the rooms and hallways for this leaf and all it's children.
        if (this.leftChild != null || this.rightChild != null) {
            // this leaf has been split, so go into the children leafs
            if (this.leftChild != null) {
                this.leftChild.createRooms(level);
            }
            if (this.rightChild != null) {
                this.rightChild.createRooms(level);
            }
            // if there are both left and right children in this leaf, create a hallway between them
            if (this.leftChild != null && this.rightChild != null) {
                //debugger;
                this.halls = this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom());
            }
        }
        else {
            // this leaf is the ready to make a room
            var roomSize = void 0;
            var roomPos = void 0;
            // the room can be between 3 x 3 tiles to the size of the leaf - 2.
            roomSize = new Point(Random.next(3, this.width - 2), Random.next(3, this.height - 2));
            // place the room within the leaf don't put it right against the side of the leaf (that would merge rooms together)
            roomPos = new Point(Random.next(1, this.width - roomSize.x - 1), Random.next(1, this.height - roomSize.y - 1));
            this.room = new Room(this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y);
            this.room.addMonsters(level);
            this.room.addHealthPotions();
        }
    };
    Leaf.prototype.createHall = function (l, r) {
        // now we connect these 2 rooms together with hallways.
        // this looks pretty complicated, but it's just trying to figure out which  point is where and then either draw a straight line, or a pair of lines to make a right-angle to connect them.
        // you could do some extra logic to make your halls more bendy, or do some more advanced things if you wanted.
        var halls = new Array();
        //debugger;
        var point1 = new Point(Random.next(l.left() + 1, l.right() - 2), Random.next(l.top() + 1, l.bottom() - 2));
        var point2 = new Point(Random.next(r.left() + 1, r.right() - 2), Random.next(r.top() + 1, r.bottom() - 2));
        var w = point2.x - point1.x;
        var h = point2.y - point1.y;
        if (w < 0) {
            if (h < 0) {
                if (Math.random() < 0.5) {
                    halls.push(new Rectangle(point2.x, point1.y, Math.abs(w), 1));
                    halls.push(new Rectangle(point2.x, point2.y, 1, Math.abs(h)));
                }
                else {
                    halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), 1));
                    halls.push(new Rectangle(point1.x, point2.y, 1, Math.abs(h)));
                }
            }
            else if (h > 0) {
                if (Math.random() < 0.5) {
                    halls.push(new Rectangle(point2.x, point1.y, Math.abs(w), 1));
                    halls.push(new Rectangle(point2.x, point1.y, 1, Math.abs(h)));
                }
                else {
                    halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), 1));
                    halls.push(new Rectangle(point1.x, point1.y, 1, Math.abs(h)));
                }
            }
            else {
                halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), 1));
            }
        }
        else if (w > 0) {
            if (h < 0) {
                if (Math.random() < 0.5) {
                    halls.push(new Rectangle(point1.x, point2.y, Math.abs(w), 1));
                    halls.push(new Rectangle(point1.x, point2.y, 1, Math.abs(h)));
                }
                else {
                    halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), 1));
                    halls.push(new Rectangle(point2.x, point2.y, 1, Math.abs(h)));
                }
            }
            else if (h > 0) {
                if (Math.random() < 0.5) {
                    halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), 1));
                    halls.push(new Rectangle(point2.x, point1.y, 1, Math.abs(h)));
                }
                else {
                    halls.push(new Rectangle(point1.x, point2.y, Math.abs(w), 1));
                    halls.push(new Rectangle(point1.x, point1.y, 1, Math.abs(h)));
                }
            }
            else {
                halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), 1));
            }
        }
        else {
            if (h < 0) {
                halls.push(new Rectangle(point2.x, point2.y, 1, Math.abs(h)));
            }
            else if (h > 0) {
                halls.push(new Rectangle(point1.x, point1.y, 1, Math.abs(h)));
            }
        }
        return halls;
    };
    return Leaf;
}());
var DungeonMapGenerator = (function () {
    function DungeonMapGenerator() {
        this.height = 30;
        this.width = 40;
        this.level = 1;
        this.generateMap();
    }
    DungeonMapGenerator.prototype.initialize = function () {
        this.mapData = new Array(this.height);
        for (var row = 0; row < this.height; row++) {
            this.mapData[row] = new Array(this.width);
            for (var col = 0; col < this.width; col++) {
                this.mapData[row][col] = new Tile(null, MapTiles.empty);
            }
        }
        //debugger;
    };
    DungeonMapGenerator.prototype.generateMap = function () {
        var _this = this;
        //debugger;
        // reset our mapData
        this.initialize();
        // reset our arrays
        this.rooms = new Array();
        this.halls = new Array();
        this.leafs = new Array();
        // first, create a leaf to be the 'root' of all leaves.
        var root = new Leaf(0, 0, this.width, this.height);
        this.leafs.push(root);
        var didSplit = true;
        // we loop through every leaf in our Vector over and over again, until no more leafs can be split.
        while (didSplit) {
            didSplit = false;
            this.leafs.forEach(function (l) {
                if (l.leftChild === undefined && l.rightChild === undefined) {
                    // if this leaf is too big, or 75% chance...
                    if (l.width > l.MAXLEAFSIZE || l.height > l.MAXLEAFSIZE || Math.random() > 0.25) {
                        if (l.split()) {
                            // if we did split, push the child leafs to the Vector so we can loop into them next
                            _this.leafs.push(l.leftChild);
                            _this.leafs.push(l.rightChild);
                            didSplit = true;
                        }
                    }
                }
            });
        }
        // next, iterate through each leaf and create a room in each one.
        root.createRooms(this.level);
        this.leafs.forEach(function (l) {
            // then we draw the room and hallway if it exists
            if (l.room !== undefined) {
                debugger;
                _this.drawRoom(l.room);
                _this.setRandomRoomTile(l.room, l.room.monster);
                _this.setRandomRoomTile(l.room, l.room.healthPotion);
            }
            if (l.halls !== undefined && l.halls.length > 0) {
                _this.drawHalls(l.halls);
            }
        });
        //let weaponPt = this.getRandomRoomPt();
        //if (weaponPt.x === undefined) debugger;
        //this.mapData[weaponPt.x][weaponPt.y] = WeaponFactory.get(this.level);
        //let stairsPt = this.getRandomRoomPt();
        //if (stairsPt.x === undefined) debugger;
        //this.mapData[stairsPt.x][stairsPt.y] = new Tile("Stairs", MapTiles.stairs);
        if (this.player === undefined) {
            this.player = new Player("You", 0, 1, new Weapon("1d2", "Stick", 0));
        }
        this.startPlayer();
        //monsters (pick based on current level, boss is last level)
    };
    DungeonMapGenerator.prototype.getRandomRoomPt = function () {
        var startRoom = this.rooms[Random.next(0, this.rooms.length - 1)];
        // and pick a random tile in that room for them to start on.			
        var foundEmpty = false;
        var tile;
        while (!foundEmpty) {
            tile = new Point(Random.next(startRoom.left(), startRoom.right()), Random.next(startRoom.top(), startRoom.bottom()));
            debugger;
            if (this.mapData[tile.y][tile.x].symbol == MapTiles.floor) {
                //debugger;
                foundEmpty = true;
            }
        }
        return tile;
    };
    DungeonMapGenerator.prototype.startPlayer = function () {
        //let playerStart = this.getRandomRoomPt();
        //this.player.location = playerStart;
        //this.mapData[playerStart.x][playerStart.y] = this.player;
    };
    DungeonMapGenerator.prototype.setRandomRoomTile = function (room, mapObj) {
        if (mapObj !== undefined) {
            var isSet = false;
            while (!isSet) {
                debugger;
                var y = Random.next(room.top(), room.bottom());
                var x = Random.next(room.left(), room.right());
                if (this.mapData[y][x].symbol === MapTiles.floor) {
                    this.mapData[y][x] = mapObj;
                    isSet = true;
                }
            }
        }
    };
    DungeonMapGenerator.prototype.drawHalls = function (h) {
        var _this = this;
        //debugger;
        // add each hall to the hall array, and draw the hall onto our mapData
        h.forEach(function (r) {
            _this.halls.push(r);
            _this.drawRectangle(r, new Tile(null, MapTiles.corridor));
        });
    };
    DungeonMapGenerator.prototype.drawRoom = function (r) {
        // add this room to the room array, and draw the room onto our mapData
        this.rooms.push(r);
        this.drawRectangle(r, new Tile(null, MapTiles.floor));
    };
    DungeonMapGenerator.prototype.drawRectangle = function (r, tile) {
        //debugger;
        for (var y = r.y; y < r.bottom(); y++) {
            for (var x = r.x; x < r.right(); x++) {
                this.mapData[y][x] = tile;
            }
        }
    };
    return DungeonMapGenerator;
}());
exports.DungeonMapGenerator = DungeonMapGenerator;
var Tile = (function () {
    function Tile(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }
    return Tile;
}());
exports.Tile = Tile;
var Entity = (function () {
    function Entity(name, xp, level) {
        this.name = name;
        this.xp = xp;
        this.level = level;
    }
    return Entity;
}());
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(name, xp, level, hpRoll, damageRoll) {
        var _this = _super.call(this, name, xp, level) || this;
        _this.symbol = MapTiles.monster;
        _this.hpRoll = hpRoll;
        _this.damageRoll = damageRoll;
        return _this;
    }
    Monster.prototype.calcHp = function () {
        this.hp = Dice.roll(this.hpRoll);
    };
    return Monster;
}(Entity));
exports.Monster = Monster;
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(name, xp, level, weapon) {
        var _this = _super.call(this, name, xp, level) || this;
        /*
        You start at level 1 and can reach a maximum level of 30.
        */
        _this.experinceLevels = [
            0, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10000, 20000, 40000, 80000, 160000, 320000, 640000,
            1280000, 2560000, 5120000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000
        ];
        _this.symbol = MapTiles.player;
        _this.weapon = weapon;
        _this.hp = 12;
        return _this;
    }
    Player.prototype.addHealth = function (increase) {
        this.hp += increase;
    };
    Player.prototype.getAttackBonus = function () {
        if (this.level < 5) {
            return 0;
        }
        else if (this.level < 10) {
            return 1;
        }
        else if (this.level < 15) {
            return 2;
        }
        else if (this.level < 20) {
            return 3;
        }
        return 4;
    };
    Player.prototype.attack = function (opponent) {
        //roll the dice
        opponent.damage = Dice.roll(opponent.damageRoll);
        this.weapon.damage = Dice.roll(this.weapon.damageRoll) + this.getAttackBonus();
        //add bonus points based on player's level
        opponent.hp -= this.weapon.damage;
        this.damageTaken = opponent.damage;
        this.hp -= opponent.damage;
        this.gainXp(opponent.xp);
    };
    Player.prototype.gainXp = function (xp) {
        var _this = this;
        this.xp += xp;
        //increase level while level's xp is less than or equal to the player's xp
        var level = 0;
        this.experinceLevels.forEach(function (l) {
            if (l <= _this.xp) {
                level++;
            }
        });
        this.level = level;
    };
    return Player;
}(Entity));
var HealthPotion = (function () {
    function HealthPotion() {
        this.hpRoll = "8d4";
        this.symbol = MapTiles.health;
        this.name = "Health Potion";
        this.hp = Dice.roll(this.hpRoll);
    }
    return HealthPotion;
}());
exports.HealthPotion = HealthPotion;
var Weapon = (function () {
    function Weapon(damageRoll, name, level) {
        this.symbol = MapTiles.weapon;
        this.damageRoll = damageRoll;
        this.name = name;
        this.level = level;
    }
    return Weapon;
}());
exports.Weapon = Weapon;
