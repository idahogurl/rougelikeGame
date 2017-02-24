	//Source: https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268
	//Converted from ActionScript 3 to TypeScript

	class Rectangle {
		//Reference: http://help.adobe.com/enUS/FlashPlatform/reference/actionscript/3/flash/geom/Rectangle.html
		x:number; //The x coordinate of the top-left corner of the rectangle.
		y:number; //The y coordinate of the top-left corner of the rectangle.
		width:number;
		height:number;

		constructor(x:number, y:number, width:number, height:number) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}

		//The y coordinate of the top-left corner of the rectangle.
		top() {
			return this.y;
		}
		//The sum of the y and height properties.
		bottom() {
			return this.y + this.height;
		}
		//The sum of the x and width properties.
		left() {
			return this.x + this.width;
		}
		//The x coordinate of the top-left corner of the rectangle.
		right():number {
			return this.x;
		}
		
	}
	export class MapStructure
	{
		static empty: string = "";
		static floor: string = "_";
		static wall: string = "|";
		static corridor: string = "#";
		static stairs: string = "S";
		static door: string = "D";
	}
	class Random {
		static next(min:number, max:number) {
			if (min !== undefined) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
			return Math.floor((Math.random() * max) + 1);
		}
	}
	class Point {
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
		room:Rectangle;				// the room that is inside this leaf
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
				this.room = new Rectangle(this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y);
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
		mapData:string[][];		// our map Data - we draw our map here to be turned into a tilemap later
		rooms:Rectangle[];	// an array that holds all our rooms
		halls:Rectangle[];	// an array that holds all our halls
		leafs:Leaf[];		// an array that holds all our leafs
		height = 45;
		width = 45;

		constructor()
		{
			this.generateMap();
		}
		initialize()
		{
			this.mapData = new Array(this.height);
			for (let row = 0; row < this.height; row++) {
				this.mapData[row] = new Array(this.width);
				for (let col = 0; col < this.width; col++) {
					this.mapData[row][col] = MapStructure.empty;
				}
			}
		}
		generateMap()
		{
			// reset our mapData
			this.initialize();

			//player.visible = false;

			// reset our Vectors
			this.rooms = new Array<Rectangle>();
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
				}

				if (l.halls !== undefined && l.halls.length > 0)
				{
					this.drawHalls(l.halls);
				}
			});

			// // randomly pick one of the rooms for the player to start in...
			// let startRoom:Rectangle = rooms[this.randomNumber(0, rooms.length - 1)];
			// // and pick a random tile in that room for them to start on.
			// let playerStart:Point = new Point(this.randomNumber(startRoom.x, startRoom.x + startRoom.width - 1), this.randomNumber(startRoom.y, startRoom.y + startRoom.height - 1));

			// // move the player sprite to the starting location (to get ready for the user to hit 'play')
			// player.x = playerStart.x * 16 + 1;
			// player.y = playerStart.y * 16 + 1;
		}

		drawHalls(h:Rectangle[])
		{
			debugger;
			// add each hall to the hall array, and draw the hall onto our mapData
			h.forEach(r =>
			{
				this.halls.push(r);
				this.drawRectangle(r, MapStructure.corridor);
			});
		}
		drawRoom(r:Rectangle)
		{
			// add this room to the room array, and draw the room onto our mapData
			this.rooms.push(r);			
			this.drawRectangle(r, MapStructure.floor);
		}
		drawRectangle(r:Rectangle, tile:string){			
			for (let x = r.x; x < r.left(); x++) {
				for (let y = r.y; y < r.bottom(); y++) {
					this.mapData[x][y] = tile;
				}
			}
		}
		// override public function update()
		// {
		// 	super.update();

		// 	if (grpTestMap.visible)
		// 	{

		// 		// if we're in 'play' mode, arrow keys move the player

		// 		if (FlxG.keys.LEFT)
		// 		{
		// 			player.velocity.x = -100;
		// 		}
		// 		else if (FlxG.keys.RIGHT)
		// 		{
		// 			player.velocity.x = 100;
		// 		}
		// 		else
		// 		{
		// 			player.velocity.x = 0;
		// 		}

		// 		if (FlxG.keys.UP)
		// 		{
		// 			player.velocity.y = -100;
		// 		}
		// 		else if (FlxG.keys.DOWN)
		// 		{
		// 			player.velocity.y = 100;
		// 		}
		// 		else
		// 		{
		// 			player.velocity.y = 0;
		// 		}

		// 		// check collison with the wall tiles in the map
		// 		FlxG.collide(player, map);
		// 	}
	}