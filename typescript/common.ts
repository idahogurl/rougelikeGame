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