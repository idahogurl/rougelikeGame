import {Random,Point} from './common';
export class WeaponFactory
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
}
export class MonsterFactory 
{
	static random(level:number) : Monster 
	{
		let monsters = { 
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
					new Monster("Yeti", 50,	4, "4d8", "1d6/1d6")
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
			15: new Monster("Jabberwock",3000, 15,  "15d8", "2d12/2d4"),
			20: new Monster("Griffin", 2000, 20,"13d8", "4d3/3d5/4d3")
		};
		
		let selectedMonsters:Monster[] = [];
		//get the monsters less than or equal to the dungeon level
		for (let monster in monsters) 
		{
			let key = parseInt(monster);
			if (key <= level) {
				if (Array.isArray(monsters[key])) 
				{
					monsters[key].forEach(m => 
					{
						selectedMonsters.push(m);
					});
				} 
				else 
				{
					selectedMonsters.push(monsters[key]);
				}
			}
		}
		
		//return a random monster from the list
		let monster = selectedMonsters[Random.next(0, selectedMonsters.length - 1)];
		monster.calcHp();

		return monster;
	}
}

export class Entity
{
	name: string;
	location: Point;
	color:number;	
	//title: string; ???
	
	constructor(name:string) {
		this.name = name;
	}
	paint(graphics:PIXI.Graphics, square:number) {
		graphics.beginFill(this.color); // Red
		graphics.lineStyle(0);
		graphics.drawRect(this.location.x * square, this.location.y * square,
                1 * square, 1 * square);
		graphics.endFill();
	}
}
// export class Tile implements MapObj 
// {
// 	name: string;
// 	symbol: string;

// 	constructor(name:string, symbol: string) {
// 		this.name = name;
// 		this.symbol = symbol;
// 	}
// }
class Creature extends Entity
{
	hp: number;
	xp: number;    
    level: number;	

    constructor(name:string, xp:number, level:number)
    {
		super(name);       
        this.xp = xp;
		this.level = level;
    }
}
export class Monster extends Creature {	
	hpRoll: string;
	damageRoll: string;
	damage: number;	
	
	constructor(name:string, xp:number, level:number, hpRoll:string, damageRoll:string) {
		super(name, xp, level);
		
		this.hpRoll = hpRoll;
		this.damageRoll = damageRoll;
		this.color = 0xFF0000;
	}
	calcHp() {
		this.hp = Dice.roll(this.hpRoll);
	}
}
class Player extends Creature {
/*
You start at level 1 and can reach a maximum level of 30.
*/

	experinceLevels: number[];
	weapon:Weapon;
	location: Point;
	damageTaken: number;	

	constructor(name:string, xp:number, level:number, weapon:Weapon) {
		super(name, xp, level);		

		this.weapon = weapon;
		this.color = 0x00FF00;
		this.hp = 12;		
		this.experinceLevels = [
			0, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10000, 20000, 40000, 80000, 160000, 320000, 640000,
			1280000, 2560000, 5120000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000
		];
	}
	addHealth(increase: number) {
		this.hp += increase;		
	}
	getAttackBonus():number {
		if (this.level < 5) {
			return 0;
		} else if (this.level < 10) {
			return 1;
		} else if (this.level < 15) {
			return 2;
		} else if (this.level < 20) {
			return 3;
		}
		return 4;
	}
	attack(opponent: Monster) 
    {
        //roll the dice
        opponent.damage = Dice.roll(opponent.damageRoll);
        
		this.weapon.damage = Dice.roll(this.weapon.damageRoll) + this.getAttackBonus();
		//add bonus points based on player's level

        opponent.hp -= this.weapon.damage;
		this.damageTaken = opponent.damage;
        this.hp -= opponent.damage;

		this.gainXp(opponent.xp);
    }
	gainXp(xp:number) {
		this.xp += xp;

		//increase level while level's xp is less than or equal to the player's xp
		let level = 0;
		this.experinceLevels.forEach(l => {
			if (l <= this.xp) {
				level++;
			}
		});

		this.level = level;	
	}
}
export class HealthPotion extends Entity
{
    hpRoll;
	hp: number;

	constructor() {
		super("Health Potion");
		
		this.hpRoll = "8d4";
		this.color = 0x00FF00;
		this.hp = Dice.roll(this.hpRoll);
	}	
}
export class Weapon extends Entity
{
    damageRoll: string;
	damage: number;
	level: number;

	constructor(damageRoll:string, name:string, level:number)
    {
		super(name);
        this.damageRoll = damageRoll;		
		this.level = level;
		this.color = 0xF39C12;
    }
}
class Dice {
    static roll(value):number {
		let total = 0;
		
		//some monsters have damage that uses multiple dice in addition to multiple rolls
		let rolls = value.split("/");
        rolls.forEach(r => {
			let temp = value.split("d");
        	//debugger;
        	let timesRoll = parseInt(temp[0]);
        	let dieSides = parseInt(temp[1]);

			for (let i = 0; i < timesRoll; i++) {
            	total += Random.next(1, dieSides);
        	}        	
		});
		
        return total;
    }
}