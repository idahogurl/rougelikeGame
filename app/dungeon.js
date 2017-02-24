//Source: https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268
//Converted from ActionScript 3 to TypeScript
"use strict";
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
    //The sum of the x and width properties.
    Rectangle.prototype.left = function () {
        return this.x + this.width;
    };
    //The x coordinate of the top-left corner of the rectangle.
    Rectangle.prototype.right = function () {
        return this.x;
    };
    return Rectangle;
}());
var MapStructure = (function () {
    function MapStructure() {
    }
    return MapStructure;
}());
MapStructure.empty = "";
MapStructure.floor = "_";
MapStructure.wall = "|";
MapStructure.corridor = "#";
MapStructure.stairs = "S";
MapStructure.door = "D";
exports.MapStructure = MapStructure;
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
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Leaf = (function () {
    function Leaf(X, Y, Width, Height) {
        this.MINLEAFSIZE = 6; // minimum size for a leaf
        this.MAXLEAFSIZE = 20; // maximum size for a leaf
        // initialize our leaf
        this.x = X;
        this.y = Y;
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
    Leaf.prototype.createRooms = function () {
        // this generates all the rooms and hallways for this leaf and all it's children.
        if (this.leftChild != null || this.rightChild != null) {
            // this leaf has been split, so go into the children leafs
            if (this.leftChild != null) {
                this.leftChild.createRooms();
            }
            if (this.rightChild != null) {
                this.rightChild.createRooms();
            }
            // if there are both left and right children in this leaf, create a hallway between them
            if (this.leftChild != null && this.rightChild != null) {
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
            this.room = new Rectangle(this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y);
        }
    };
    Leaf.prototype.createHall = function (l, r) {
        // now we connect these 2 rooms together with hallways.
        // this looks pretty complicated, but it's just trying to figure out which  point is where and then either draw a straight line, or a pair of lines to make a right-angle to connect them.
        // you could do some extra logic to make your halls more bendy, or do some more advanced things if you wanted.
        var halls = new Array();
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
        this.height = 45;
        this.width = 45;
        this.generateMap();
    }
    DungeonMapGenerator.prototype.initialize = function () {
        this.mapData = new Array(this.height);
        for (var row = 0; row < this.height; row++) {
            this.mapData[row] = new Array(this.width);
            for (var col = 0; col < this.width; col++) {
                this.mapData[row][col] = MapStructure.empty;
            }
        }
    };
    DungeonMapGenerator.prototype.generateMap = function () {
        var _this = this;
        // reset our mapData
        this.initialize();
        //player.visible = false;
        // reset our Vectors
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
        root.createRooms();
        this.leafs.forEach(function (l) {
            // then we draw the room and hallway if it exists
            if (l.room !== undefined) {
                _this.drawRoom(l.room);
            }
            if (l.halls !== undefined && l.halls.length > 0) {
                _this.drawHalls(l.halls);
            }
        });
        // // randomly pick one of the rooms for the player to start in...
        // let startRoom:Rectangle = rooms[this.randomNumber(0, rooms.length - 1)];
        // // and pick a random tile in that room for them to start on.
        // let playerStart:Point = new Point(this.randomNumber(startRoom.x, startRoom.x + startRoom.width - 1), this.randomNumber(startRoom.y, startRoom.y + startRoom.height - 1));
        // // move the player sprite to the starting location (to get ready for the user to hit 'play')
        // player.x = playerStart.x * 16 + 1;
        // player.y = playerStart.y * 16 + 1;
    };
    DungeonMapGenerator.prototype.drawHalls = function (h) {
        var _this = this;
        debugger;
        // add each hall to the hall array, and draw the hall onto our mapData
        h.forEach(function (r) {
            _this.halls.push(r);
            _this.drawRectangle(r, MapStructure.corridor);
        });
    };
    DungeonMapGenerator.prototype.drawRoom = function (r) {
        // add this room to the room array, and draw the room onto our mapData
        this.rooms.push(r);
        this.drawRectangle(r, MapStructure.floor);
    };
    DungeonMapGenerator.prototype.drawRectangle = function (r, tile) {
        for (var x = r.x; x < r.left(); x++) {
            for (var y = r.y; y < r.bottom(); y++) {
                this.mapData[x][y] = tile;
            }
        }
    };
    return DungeonMapGenerator;
}());
exports.DungeonMapGenerator = DungeonMapGenerator;
