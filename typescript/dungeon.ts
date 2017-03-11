//https://www.goose.ninja/tutorials/pixi-js/keyboard-events/
//https://eskerda.com/bsp-dungeon-generation/
let MAP_SIZE = 50;
let SQUARE = 800 / MAP_SIZE;
let W_RATIO = 0.45;
let H_RATIO = 0.45;
let DISCARD_BY_RATIO = true;

import * as PIXI from 'pixi.js';
import * as Dungeon from './entities';
import {Random,Point} from './common';

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
    //stairs:Tile;
    
    constructor(x, y, w, h) 
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.center = new Point(this.x + this.w/2, this.y + this.h/2);
        this.usedPoints = [];
    }
    addMonster(level: number):boolean
	{
		if (Math.random() < 0.5) 
        {
			this.monster = Dungeon.MonsterFactory.random(level);
            
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
    paint(graphics:PIXI.Graphics) 
    {
        graphics.beginFill(0x9C640C); // Brown
		graphics.drawRect(this.x * SQUARE, this.y * SQUARE,
                this.w * SQUARE, this.h * SQUARE);
		graphics.endFill();       
    }
    drawPath(graphics:PIXI.Graphics, point:Point)
    {
        graphics.beginFill(0x9C640C);
        graphics.lineStyle(SQUARE, 0x9C640C);
        graphics.moveTo(this.center.x * SQUARE, this.center.y * SQUARE);
        graphics.lineTo(point.x * SQUARE, point.y * SQUARE);
        graphics.endFill();       
    }
    drawEntities(graphics:PIXI.Graphics) {
        if (this.monster !== undefined) this.monster.paint(graphics, SQUARE);
        
        if (this.healthPotion !== undefined) this.healthPotion.paint(graphics, SQUARE);
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
        //debugger;
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
    paint(graphics:PIXI.Graphics) 
    {
        this.leaf.paint(graphics);
        if (this.lchild !== undefined)
            this.lchild.paint(graphics);
        if (this.rchild !== undefined)
            this.rchild.paint(graphics);
    }
}

export class Map {
    private N_ITERATIONS = 4;
    
    pixiApp: PIXI.Application;
	graphics: PIXI.Graphics;
    entityGraphics: PIXI.Graphics;
    mapElement: HTMLElement;

    width:number;
    height:number;
    rooms:Room[];
    roomTree:Tree;
    level: number;
    entities: Dungeon.Entity[];

    constructor(width:number, height:number, mapElement:HTMLElement) 
    {
        this.mapElement = mapElement;
        this.width = width;
        this.height = height;
        this.rooms = [];
        this.entities = [];
        
        this.init();
    }
    init() 
    {
        this.level = 1;

        this.pixiApp = new PIXI.Application(this.width, this.height, {backgroundColor : 0x000000});
        this.graphics = new PIXI.Graphics();
        this.entityGraphics = new PIXI.Graphics();
                
        let main_room = new RoomContainer(0, 0, MAP_SIZE, MAP_SIZE);
        this.roomTree = this.split_room(main_room, this.N_ITERATIONS);
        this.growRooms();
        this.addEntities();
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
        //room.paint(this.graphics);

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
        }
    }
    addEntities() {
        debugger;
        for (let i = 0; i < this.rooms.length; i++) 
        {
            let room = this.rooms[i];
            if (room.addMonster(this.level)) this.entities[room.monster.location.toString()] = room.monster;
                
            if (room.addHealthPotion()) this.entities[room.healthPotion.location.toString()] = room.healthPotion;

            //add one weapon
            //add one set of stairs
            //add player
        }        
    }
    clear() 
    {
        this.graphics.beginFill(0x000000, 0); // black
        this.graphics.drawRect(0, 0, this.width, this.height);
        this.graphics.endFill();

        this.entityGraphics.beginFill(0x000000, 0); // black
        this.entityGraphics.drawRect(0, 0, this.width, this.height);
        this.entityGraphics.endFill();      
    }
    drawPaths(tree) 
    {
        if (tree.lchild !== undefined && tree.rchild !== undefined) {
            tree.lchild.leaf.drawPath(this.graphics, tree.rchild.leaf.center)
            this.drawPaths(tree.lchild);
            this.drawPaths(tree.rchild);
        }
    }
    drawEntities() {
        //debugger;
        let leafs = this.roomTree.getLeafs();
         for (let i = 0; i < leafs.length; i++)
           leafs[i].room.drawEntities(this.entityGraphics);
    }
    drawContainers()
    {
        this.roomTree.paint(this.graphics);
    }
    drawRooms()
    {
        //debugger;
        for (let i = 0; i < this.rooms.length; i++)
            this.rooms[i].paint(this.graphics);
    }    
    paint()
    {
        this.clear()
        //this.drawGrid();
        //this.drawContainers();
        this.drawRooms();
        this.drawPaths(this.roomTree);
        this.drawEntities();    
        
        
        this.pixiApp.stage.addChild(this.graphics);
        this.pixiApp.stage.addChild(this.entityGraphics);

        this.mapElement.appendChild(this.pixiApp.view);
    }
}