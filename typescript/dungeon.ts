//https://eskerda.com/bsp-dungeon-generation/
let MAP_SIZE = 50;
let W_RATIO = 0.45;
let H_RATIO = 0.45;
let DISCARD_BY_RATIO = true;
let TOTAL_MAP_SIZE = 50; //to avoid boundary checks

import * as Dungeon from './entities';
import {Random,Point} from './common';
import * as Update from 'immutability-helper';

class Room
{
    x:number;
    y:number;
    w:number;
    h:number;
    center:Point;
    monster:Dungeon.Monster;
	healthPotion:Dungeon.HealthPotion;
	weapon:Dungeon.Weapon;
	usedPoints:string[];

    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.center = new Point(this.x + Math.floor(this.w/2), Math.floor(this.y + this.h/2));
        this.usedPoints = [];
    }
    addMonster(level: number):boolean
	{
		if (Math.random() < 0.5)
        {
			this.monster = new Dungeon.MonsterFactory().random(level);

            let point = this.unusedPoint();
            this.usedPoints.push(point.toString());
            this.monster.location = point;
            return true;
		}
	}
	addHealthPotion():boolean
	{
		if (Math.random() < 0.25) {
			this.healthPotion = new Dungeon.HealthPotion();

            let point = this.unusedPoint();
            this.usedPoints.push(point.toString());
            this.healthPotion.location = point;
            return true;
		}
        return false;
	}
    unusedPoint():Point
    {
        //random x and y
        let x = Random.next(this.x + 1, this.x + this.w - 1);
        let y = Random.next(this.y + 1, this.y + this.h - 1);
        let found = false;

        while (!found)
        {
            //is it empty?
            let point = x + "," + y;
            if (this.usedPoints.indexOf(point) === -1) {
                found = true;
            }
        }
        return new Point(x,y);
    }
    addRoom(mapTiles:Dungeon.Entity[][])
    {

        for (let x = this.x; x <= this.w; x++)
           for (let y = this.y; x <= this.h; y++)
                mapTiles[x][y] = new Dungeon.Floor();
    }
    addPath(mapTiles:Dungeon.Entity[][], point:Point)
    {
        for (let y = this.center.y; y <= point.y; y++)
            for (let x = this.center.x; x <= point.x; x++)
                mapTiles[y][x] = new Dungeon.Floor();
    }
}

class RoomContainer extends Room {
    room: Room;
    constructor(x, y, w, h)
    {
        super(x, y, w, h);
    }
    growRoom()
    {
        //
        let x, y, w, h;
        x = this.x + Random.next(0, Math.floor(this.w/3));
        y = this.y + Random.next(0, Math.floor(this.h/3));
        w = this.w - (x - this.x);
        h = this.h - (y - this.y);
        w -= Random.next(0, w/3);
        h -= Random.next(0, h/3);
        this.room = new Room(x, y, w, h);
    }
}

class Tree {
    leaf: RoomContainer;
    lchild: Tree;
    rchild: Tree;
    constructor(leaf)
    {
        this.leaf = leaf;
    }
    getLeafs()
    {
        if (this.lchild === undefined && this.rchild === undefined)
            return [this.leaf];
        else
            return [].concat(this.lchild.getLeafs(), this.rchild.getLeafs());
    }
    add(mapTiles:Dungeon.Entity[][])
    {
        this.leaf.addRoom(mapTiles);
        if (this.lchild !== undefined)
            this.lchild.add(mapTiles);
        if (this.rchild !== undefined)
            this.rchild.add(mapTiles);
    }
}

export enum GameResults
{
    won, lost
}

export class Map
{
    private N_ITERATIONS = 3;

    rooms:Room[];
    roomTree:Tree;
    level: number = 20;
    gameResults: GameResults;

    weapon:Dungeon.Weapon;
    stairs:Dungeon.Entity;
    player:Dungeon.Player;
    tileMap:Dungeon.Entity[][];
    currentOpponent: Dungeon.Monster;
    visibleTiles:string[];

    generate()
    {
        this.rooms = [];
        this.tileMap = new Array(TOTAL_MAP_SIZE);

        this.initTileMap();

        let main_room = new RoomContainer(0, 0, MAP_SIZE, MAP_SIZE);
        this.roomTree = this.split_room(main_room, this.N_ITERATIONS);

        this.growRooms();

        this.addPaths(this.roomTree);
        this.addEntities();
    }
    initTileMap()
    {
        for (let y = 0; y <= TOTAL_MAP_SIZE; y++)
        {
            this.tileMap[y] = new Array<Dungeon.Empty>(TOTAL_MAP_SIZE);

            for (let x = 0; x <= TOTAL_MAP_SIZE; x++)
                this.tileMap[y][x] = new Dungeon.Empty();
        }

    }
    random_split(room): RoomContainer[]
    {
        let r1, r2;
        if (Random.next(0, 1) == 0)
        {
            // Vertical
            r1 = new RoomContainer(
                room.x, room.y,             // r1.x, r1.y
                Random.next(1, room.w), room.h   // r1.w, r1.h
            );
            r2 = new RoomContainer(
                room.x + r1.w, room.y,      // r2.x, r2.y
                room.w - r1.w, room.h       // r2.w, r2.h
            );
            if (DISCARD_BY_RATIO) {
                let r1_w_ratio = r1.w / r1.h
                let r2_w_ratio = r2.w / r2.h
                if (r1_w_ratio < W_RATIO || r2_w_ratio < W_RATIO) {
                    return this.random_split(room)
                }
            }
        }
        else
        {
            // Horizontal
            r1 = new RoomContainer(
                room.x, room.y,             // r1.x, r1.y
                room.w, Random.next(1, room.h)   // r1.w, r1.h
            );
            r2 = new RoomContainer(
                room.x, room.y + r1.h,      // r2.x, r2.y
                room.w, room.h - r1.h       // r2.w, r2.h
            );
            if (DISCARD_BY_RATIO)
            {
                let r1_h_ratio = r1.h / r1.w;
                let r2_h_ratio = r2.h / r2.w;
                if (r1_h_ratio < H_RATIO || r2_h_ratio < H_RATIO) {
                    return this.random_split(room);
                }
            }
        }
        return [r1, r2];
    }
    split_room(room: RoomContainer, iter:number):Tree
    {
        let root = new Tree(room)

        if (iter != 0)
        {
            let sr: RoomContainer[] = this.random_split(room);
            root.lchild = this.split_room(sr[0], iter-1);
            root.rchild = this.split_room(sr[1], iter-1);
        }
        return root;
    }
    growRooms()
    {
        let leafs = this.roomTree.getLeafs();
        for (let i = 0; i < leafs.length; i++) {
            leafs[i].growRoom();
            this.rooms.push(leafs[i].room);

            this.addRoom(leafs[i].room);
        }
    }
    addRoom(room: Room)
    {
        for (let y = room.y; y < room.y + room.h; y++)
            for (let x = room.x; x < room.x + room.w; x++)
                this.tileMap[y][x] = new Dungeon.Floor();
    }
    addEntities() {
        for (let i = 0; i < this.rooms.length; i++)
        {
            let room = this.rooms[i];
            if (room.addMonster(this.level)) this.addToMap(room.monster, false);

            if (room.addHealthPotion()) this.addToMap(room.healthPotion, false);
        }

        //add boss monster for final level
        if (this.level == 20)
        {
            let bossMonster = new Dungeon.MonsterFactory().get(20, 0);
            bossMonster.isBoss = true;
            bossMonster.className = "boss";
            this.addToMap(bossMonster, true);
        }

        //add one set of stairs
        if (this.level < 20)
            this.addToMap(new Dungeon.Stairs(), true);

        if (this.player === undefined) this.player = new Dungeon.Player();

        //add one weapon unless the player already has the best weapon
        if (this.player.weapon.level < 5)
            this.addToMap(Dungeon.WeaponFactory.get(this.level), true);

        this.addToMap(this.player, true);

        this.setVisibleArea();
    }
    addToMap(entity:Dungeon.Entity, setRandomLocation:boolean)
    {
        if (setRandomLocation) entity.location = this.getRandomPoint();
        this.tileMap[entity.location.y][entity.location.x] = entity;
    }
    hideVisibleArea(){
        //hide all that is visible
        this.visibleTiles.forEach(t => {
            let point = t.split(",");
            let x = point[0];
            let y = point[1];
            
            this.tileMap[y][x] = Update(this.tileMap[y][x], {show: { $set: false }});
        });
    }
    isInBounds(x:number, y:number)
    {
        return !(y < 0 || y > MAP_SIZE || x < 0 || x > MAP_SIZE);
    }
    setVisibleArea() {
        this.visibleTiles = [];
        let playerX = this.player.location.x;
        let playerY = this.player.location.y;

        let newX = playerX - 5;
        let newY = playerY - 2;
        let h = 5;
        let w = 13;

        for (let y = newY; y < newY + h; y++)
        {
            for (let x = newX; x < newX + w; x++)
            {
                if (this.isInBounds(x, y))
                {
                    this.tileMap[y][x] = Update(this.tileMap[y][x], {show: { $set: true }});
                    this.visibleTiles.push(x + "," + y);
                }
            }
        }

        let y1 = newY;
        let y2 = newY + h - 1;
        let x1 = newX;
        for (let i = 0; i < 3; i++) {
            x1++;
            y1--; //over one, up one, width less 2
            y2++; //over one, down one, width less 2

            w -= 2;
            for (let x = x1; x < x1 + w; x++) {
                if (this.isInBounds(x, y1))
                {
                    this.tileMap[y1][x] = Update(this.tileMap[y1][x], {show: { $set: true }});
                    this.visibleTiles.push(x + "," + y1);
                }
            }
            for (let x = x1; x < x1 + w; x++) {
                if (this.isInBounds(x, y2))
                {
                    this.tileMap[y2][x] = Update(this.tileMap[y2][x], {show: { $set: true }});
                    this.visibleTiles.push(x + "," + y2);
                }
            }
        }
    }
    getRandomPoint():Point
    {
        return this.getRandomRoom().unusedPoint();
    }
    getRandomRoom()
    {
        return this.rooms[Random.next(0, this.rooms.length - 1)];
    }
    addPaths(tree)
    {
        if (tree.lchild !== undefined && tree.rchild !== undefined) {

            tree.lchild.leaf.addPath(this.tileMap, tree.rchild.leaf.center)
            this.addPaths(tree.lchild);
            this.addPaths(tree.rchild);
        }
    }
    addRooms()
    {
        //
        for (let i = 0; i < this.rooms.length; i++)
            this.rooms[i].addRoom(this.tileMap);
    }
}