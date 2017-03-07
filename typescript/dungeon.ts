//Source: https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268
//Converted from ActionScript 3 to TypeScript
class Rectangle
{
	//Reference: http://help.adobe.com/enUS/FlashPlatform/reference/actionscript/3/flash/geom/Rectangle.html
	x:number; //The x coordinate of the top-left corner of the rectangle.
	y:number; //The y coordinate of the top-left corner of the rectangle.
	width:number;
	height:number;

	constructor(x:number, y:number, width:number, height:number)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	//The y coordinate of the top-left corner of the rectangle.
	top()
	{
		return this.y;
	}
	//The sum of the y and height properties.
	bottom()
	{
		return this.y + this.height;
	}
	//The sum of the x and width properties.
	left()
	{
		return this.x + this.width;
	}
	//The x coordinate of the top-left corner of the rectangle.
	right():number
	{
		return this.x;
	}		
}
class Room extends Rectangle
{
	monster:Monster;
	healthPotion:HealthPotion;
	weapon:Weapon;
	stairs:Tile;

	addMonster()
	{
		if (Math.random() < 0.5) {
			this.monster = MonsterFactory.random();
		}
	}
	addHealthPotion()
	{
		if (Math.random() < 0.5) {
			this.healthPotion = new HealthPotion();			
		}
	}
}
class WeaponFactory
{
	static get(level: number) {
		let weapons = {
			3: new Weapon("2d4", "Mace", 3),
			4: new Weapon("3d4", "Long sword", 4),	
			1: new Weapon("1d6", "Dagger", 1),
			5: new Weapon("4d4", "Two handed sword", 5),
			2: new Weapon("2d3", "Spear", 2)
		};

		return weapons[level];
	}

	constructor() {

	}
}
class MonsterFactory 
{
	static random() : Monster 
	{
		let monsters = [ 
			new Monster("Bat", 1, 1, "1d8", "1d2"),				
			new Monster("Centaur", 25, 4, "4d8", "1d2/1d5/1d5"),
			new Monster("Dragon", 6800, 10, "10d8", "1d8/1d8/3d10"),
			new Monster("Emu", 2, 1, "1d8", "1d2"),
			new Monster("Griffin", 2000, 20,"13d8", "4d3/3d5/4d3"),
			new Monster("Hobgoblin", 3, 1, "1d8", "1d8"),
			new Monster("Jabberwock",3000, 15,  "15d8", "2d12/2d4"),
			new Monster("Kestral", 1, 7, "1d8", "1d4"),
			new Monster("Leprechaun", 10, 3, "3d8", "1d2"),
			new Monster("Medusa", 200, 8, "8d8", "3d4/3d4/2d5"),
			new Monster("Orc", 5, 1, "1d8", "1d8"),
			new Monster("Phantom", 120, 8, "8d8", "4d4"),
			new Monster("Quagga", 32, 3, "3d8", "1d2/1d2/1d4"),
			new Monster("Rattlesnake", 9, 2, "2d8", "1d6"),
			new Monster("Snake", 1, 2, "1d8", "1d3"),
			new Monster("Troll", 120, 6, "6d8", "1d8/1d8/2d6"),
			new Monster("Ur-vile", 190, 7, "7d8", "1d3/1d3/1d3/4d6"),
			new Monster("Vampire", 350, 8, "8d8", "1d10"),
			new Monster("Wraith", 55, 5, "5d8", "1d6"),
			new Monster("Xeroc", 100, 7, "7d8", "3d4"),
			new Monster("Yeti", 50,	4, "4d8", "1d6/1d6"),
			new Monster("Zombie", 6, 2, "2d8", "1d")
		];
		let monster = monsters[Random.next(0, monsters.length - 1)];
		monster.calcHp();
		return monsters[Random.next(0, monsters.length - 1)];
	}
}
export class MapTiles
{
	static empty: string = "";
	static floor: string = "_";
	static wall: string = "|";
	static corridor: string = "#";
	static stairs: string = "S";
	static door: string = "D";
	static health: string = "H";
	static weapon: string = "W";
	static monster: string = "M";
	static player: string = "P";
}
class Dice {
    static roll(value):number {
        let temp = value.split("d");
        debugger;
        let timesRoll = parseInt(temp[0]);
        let dieSides = parseInt(temp[1]);
        let total = 0;
            
        for (let i = 0; i < timesRoll; i++) {
            total += Random.next(1, dieSides);
        }
        return total;
    }
}
export class Random 
{
	static next(min:number, max:number) {
		if (min !== undefined) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		return Math.floor((Math.random() * max) + 1);
	}		
}	
class Point 
{
	x:number;
	y:number;
	constructor(x:number, y:number) {
		this.x = x;
		this.y = y;
	}
}
class Leaf
{
	MINLEAFSIZE = 6;	// minimum size for a leaf
	MAXLEAFSIZE = 20;	// maximum size for a leaf

	y:number;
	x:number;
	width:number;
	height:number;		// the position and size of this leaf

	leftChild:Leaf;				// the leaf's left child leaf
	rightChild:Leaf;				// the leaf's right child leaf
	room:Room;				// the room that is inside this leaf
	halls:Rectangle[];	// hallways to connect this leaf to other leafs

	constructor(X:number, Y:number, Width:number, Height:number)
	{
		// initialize our leaf
		this.x = X;
		this.y = Y;
		this.width = Width;
		this.height = Height;
	}
	split():boolean
	{
		// begin splitting the leaf into 2 children

		if (this.leftChild != null || this.rightChild != null)
			return false; // we're already split! Abort!

		// determine direction of split
		// if the width is >25% larger than height, we split vertically
		// if the height is >25% larger than the width, we split horizontally
		// otherwise we split randomly

		let splitH:boolean = Math.random() > 0.5;

		if (this.width > this.height && this.width / this.height >= 1.25)
			splitH = false;
		else if (this.height > this.width && this.height / this.width >= 1.25)
			splitH = true;

		let max:number = (splitH ? this.height : this.width) - this.MINLEAFSIZE; // determine the maximum height or this.width
		if (max <= this.MINLEAFSIZE)
			return false; // the area is too small to split any more...

		let split:number = Random.next(this.MINLEAFSIZE, max); // determine where we're going to split

		// create our left and right children based on the direction of the split
		if (splitH)
		{
			this.leftChild = new Leaf(this.x, this.y, this.width, split);
			this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split);
		}
		else
		{
			this.leftChild = new Leaf(this.x, this.y, split, this.height);
			this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height);
		}
		return true; // split successful!
	}
	getRoom():Rectangle
	{
		// iterate all the way down these leafs to find a room, if one exists.
		if (this.room != null)
			return this.room;
		else
		{
			let lRoom:Rectangle;
			let rRoom:Rectangle;
			if (this.leftChild != null)
			{
				lRoom = this.leftChild.getRoom();
			}
			if (this.rightChild != null)
			{
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
	}
	createRooms()
	{
		// this generates all the rooms and hallways for this leaf and all it's children.
		if (this.leftChild != null || this.rightChild != null)
		{
			// this leaf has been split, so go into the children leafs
			if (this.leftChild != null)
			{
				this.leftChild.createRooms();
			}
			if (this.rightChild != null)
			{
				this.rightChild.createRooms();
			}

			// if there are both left and right children in this leaf, create a hallway between them
			if (this.leftChild != null && this.rightChild != null)
			{
				this.halls = this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom());
			}

		}
		else
		{
			// this leaf is the ready to make a room
			let roomSize:Point;
			let roomPos:Point;
			// the room can be between 3 x 3 tiles to the size of the leaf - 2.
			roomSize = new Point(Random.next(3, this.width - 2), Random.next(3, this.height - 2));
			// place the room within the leaf don't put it right against the side of the leaf (that would merge rooms together)
			roomPos = new Point(Random.next(1, this.width - roomSize.x - 1), Random.next(1, this.height - roomSize.y - 1));
			this.room = new Room(this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y);				
			this.room.addMonster();
			this.room.addHealthPotion();
		}
	}
	createHall(l:Rectangle, r:Rectangle):Rectangle[]
	{
		// now we connect these 2 rooms together with hallways.
		// this looks pretty complicated, but it's just trying to figure out which  point is where and then either draw a straight line, or a pair of lines to make a right-angle to connect them.
		// you could do some extra logic to make your halls more bendy, or do some more advanced things if you wanted.
		let halls = new Array<Rectangle>();

		let point1:Point = new Point(Random.next(l.left() + 1, l.right() - 2), Random.next(l.top() + 1, l.bottom() - 2));
		let point2:Point = new Point(Random.next(r.left() + 1, r.right() - 2), Random.next(r.top() + 1, r.bottom() - 2));

		let w:number = point2.x - point1.x;
		let h:number = point2.y - point1.y;

		if (w < 0)
		{
			if (h < 0)
			{
				if (Math.random() < 0.5)
				{
					halls.push(new Rectangle(point2.x, point1.y, Math.abs(w), 1));
					halls.push(new Rectangle(point2.x, point2.y, 1, Math.abs(h)));
				}
				else
				{
					halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), 1));
					halls.push(new Rectangle(point1.x, point2.y, 1, Math.abs(h)));
				}
			}
			else if (h > 0)
			{

				if (Math.random() < 0.5)
				{
					halls.push(new Rectangle(point2.x, point1.y, Math.abs(w), 1));
					halls.push(new Rectangle(point2.x, point1.y, 1, Math.abs(h)));
				}
				else
				{
					halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), 1));
					halls.push(new Rectangle(point1.x, point1.y, 1, Math.abs(h)));
				}
			}
			else // if (h == 0)
			{
				halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), 1));
			}
		}
		else if (w > 0)
		{
			if (h < 0)
			{
				if (Math.random() < 0.5)
				{
					halls.push(new Rectangle(point1.x, point2.y, Math.abs(w), 1));
					halls.push(new Rectangle(point1.x, point2.y, 1, Math.abs(h)));
				}
				else
				{
					halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), 1));
					halls.push(new Rectangle(point2.x, point2.y, 1, Math.abs(h)));
				}
			}
			else if (h > 0)
			{
				if (Math.random() < 0.5)
				{
					halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), 1));
					halls.push(new Rectangle(point2.x, point1.y, 1, Math.abs(h)));
				}
				else
				{
					halls.push(new Rectangle(point1.x, point2.y, Math.abs(w), 1));
					halls.push(new Rectangle(point1.x, point1.y, 1, Math.abs(h)));
				}
			}
			else // if (h == 0)
			{
				halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), 1));
			}
		}
		else // if (w == 0)
		{
			if (h < 0)
			{
				halls.push(new Rectangle(point2.x, point2.y, 1, Math.abs(h)));
			}
			else if (h > 0)
			{
				halls.push(new Rectangle(point1.x, point1.y, 1, Math.abs(h)));
			}
		}

		return halls;
	}
}
export class DungeonMapGenerator
{
	height = 45;
	width = 45;
	
	mapData:MapObj[][];	// our map Data - we draw our map here to be turned into a tilemap later
	player: Player;
	rooms:Room[];	// an array that holds all our rooms
	halls:Rectangle[];	// an array that holds all our halls
	leafs:Leaf[];		// an array that holds all our leafs
	level:number;

	constructor(level = 1)
	{
		this.level = level;
		this.generateMap();
	}
	initialize()
	{
		this.mapData = new Array(this.height);
		for (let row = 0; row < this.height; row++) {
			this.mapData[row] = new Array(this.width);
			for (let col = 0; col < this.width; col++) {
				this.mapData[row][col] = new Tile("Empty", MapTiles.empty);
			}
		}
	}
	generateMap()
	{
		debugger;
		// reset our mapData
		this.initialize();

		// reset our arrays
		this.rooms = new Array<Room>();
		this.halls = new Array<Rectangle>();
		this.leafs = new Array<Leaf>();

		// first, create a leaf to be the 'root' of all leaves.
		let root = new Leaf(0, 0, this.width, this.height);
		this.leafs.push(root);

		let didSplit = true;
		// we loop through every leaf in our Vector over and over again, until no more leafs can be split.
		while (didSplit)
		{
			didSplit = false;
			this.leafs.forEach(l =>
			{
				if (l.leftChild === undefined && l.rightChild === undefined) // if this leaf is not already split...
				{
					// if this leaf is too big, or 75% chance...
					if (l.width > l.MAXLEAFSIZE || l.height > l.MAXLEAFSIZE || Math.random() > 0.25)
					{
						if (l.split()) // split the leaf!
						{
							// if we did split, push the child leafs to the Vector so we can loop into them next
							this.leafs.push(l.leftChild);
							this.leafs.push(l.rightChild);
							didSplit = true;
						}
					}
				}
			});
		}

		// next, iterate through each leaf and create a room in each one.
		root.createRooms();

		this.leafs.forEach(l =>
		{
			// then we draw the room and hallway if it exists
			if (l.room !== undefined)
			{
				this.drawRoom(l.room);					
				this.setRandomRoomTile(l.room, l.room.monster);				
				this.setRandomRoomTile(l.room, l.room.healthPotion);
			}

			if (l.halls !== undefined && l.halls.length > 0)
			{
				this.drawHalls(l.halls);
			}
		});
		debugger;
		let weaponPt = this.getRandomRoomPt();
		this.mapData[weaponPt.x][weaponPt.y] = WeaponFactory.get(1);
		
		let stairsPt = this.getRandomRoomPt();
		this.mapData[stairsPt.x][stairsPt.y] = new Tile("Stairs", MapTiles.stairs);

		if (this.player === undefined) {
			this.player = new Player("Rebecca", 0, 1, new Weapon("1d1", "Stick", 0));
		}
		this.startPlayer();					
		
		//monsters (pick based on current level, boss is last level)
	}
	getRandomRoomPt(): Point 
	{
		let startRoom:Rectangle = this.rooms[Random.next(0, this.rooms.length)];
		// and pick a random tile in that room for them to start on.			
		let foundEmpty = false;
		let tile:Point;
		while (!foundEmpty)
		{ //continue trying to find open floor
			tile = new Point(Random.next(startRoom.x, startRoom.x + startRoom.width - 1),
				Random.next(startRoom.y, startRoom.y + startRoom.height - 1));
			if (this.mapData[tile.x][tile.y].symbol == MapTiles.floor)
			{
				foundEmpty = true;
			}
		}
		return tile;
	}
	startPlayer()
	{
		let playerStart = this.getRandomRoomPt();
		this.player.location = playerStart;
		this.mapData[playerStart.x][playerStart.y] = this.player;
	}
	setRandomRoomTile(room:Room, mapObj:MapObj)
	{
		if (mapObj !== undefined)
		{
			let isSet = false;
			
			while (!isSet) 
			{
				let y = Random.next(room.top(), room.bottom())
				let x = Random.next(room.left(), room.right());
				if (this.mapData[x][y].symbol === MapTiles.floor) {
					this.mapData[x][y] = mapObj;
					isSet = true;
				}
			}
		}
	}
	drawHalls(h:Rectangle[])
	{			
		//debugger;
		// add each hall to the hall array, and draw the hall onto our mapData
		h.forEach(r =>
		{
			this.halls.push(r);
			this.drawRectangle(r, new Tile("Corridor", MapTiles.corridor));
		});
	}
	drawRoom(r:Room)
	{
		// add this room to the room array, and draw the room onto our mapData
		this.rooms.push(r);			
		this.drawRectangle(r, new Tile("Floor", MapTiles.floor));
	}
	drawRectangle(r:Rectangle, tile:Tile)
	{			
		for (let x = r.x; x < r.left(); x++) {
			for (let y = r.y; y < r.bottom(); y++) {
				this.mapData[x][y] = tile;
			}
		}
	}		
}
interface MapObj
{
	name: string;
    symbol: string;
}
export class Tile implements MapObj 
{
	name: string;
	symbol: string;

	constructor(name:string, symbol: string) {
		this.name = name;
		this.symbol = symbol;
	}
}
class Entity implements MapObj
{
	symbol: string;
    hp: number;
	xp: number;    
    level: number;
	name: string;

    constructor(name:string, xp:number, level:number)
    {
        this.name = name;
        this.xp = xp;
		this.level = level;
    }
}
export class Monster extends Entity {	

	private hpRoll: string;
	damageRoll: string;

	constructor(name:string, xp:number, level:number, hpRoll:string, damageRoll:string) {
		super(name, xp, level);
		this.symbol = MapTiles.monster;
		this.hpRoll = hpRoll;
		this.damageRoll = damageRoll;	
	}
	calcHp() {
		this.hp = Dice.roll(this.hpRoll);
	}
}
class Player extends Entity {
	weapon:Weapon;
	location: Point;

	constructor(name:string, xp:number, level:number, weapon:Weapon) {
		super(name, xp, level);
		this.symbol = MapTiles.player;
		this.weapon = weapon;		
		this.hp = 12;		
	}
	addHealth(increase: number) {
		this.hp += increase;		
	}
	attack(opponent: Monster) 
    {
        //roll the dice
        let opponentDamage = 0;
        let playerDamage = 0;
		if (opponent.hp === 0) {
			//dead
		}
        opponent.hp -= playerDamage;
        this.hp -= opponentDamage;        
    }
}
export class HealthPotion implements MapObj
{
    private hpRoll = "8d4";
	symbol = MapTiles.health;
	name = "Health Potion";
	hp: number;

	constructor() {
		this.hp = Dice.roll(this.hpRoll);
	}
}
export class Weapon implements MapObj
{
    symbol = MapTiles.weapon;
	
	name: string;
    damageRoll: string;
	damage: number;
	level: number;
	    
	constructor(damageRoll:string, name:string, level:number)
    {
        this.damageRoll = damageRoll;
		this.name = name;
		this.level = level;
    }
}