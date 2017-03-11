export class Random
{
	static next(min:number, max:number) 
    {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}		
}

export class Point 
{
	x:number;
	y:number;
	constructor(x:number, y:number) 
    {
		this.x = x;
		this.y = y;
	}

	toString() {
		return this.x + "," + this.y;
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