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
	monsters:any;

	constructor() 
	{
		this.monsters = { 
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
	}

	//get a monster at the specified index and specified level
	get(level:number, index:number) : Monster 
	{
		let monster: Monster;
		if (Array.isArray(this.monsters[level]))
		{
			monster = this.monsters[level][index];
		}
		else 
		{
			monster = this.monsters[level];
		}
		
		monster.calcHp();

		return monster;
	}
	random(level:number): Monster
	{
		let selectedMonsters:Monster[] = [];
		//get the monsters in levels 5 less than or equal to the current dungeon level
		for (let monster in this.monsters) 
		{
			let key = parseInt(monster);
			if (key >= level - 5) {
				if (Array.isArray(this.monsters[level])) 
				{
					this.monsters[level].forEach(m => 
					{
						selectedMonsters.push(m);
					});
				} 
				else 
				{
					selectedMonsters.push(this.monsters[level]);
				}
			}
		}
		
		//return a random monster from the list
		let monster = selectedMonsters[Random.next(0, selectedMonsters.length - 1)];
		monster.calcHp();

		return monster;
	}
}

export abstract class Entity
{
	name: string;
	location: Point;
	className:string;	
	tooltip: string;
	show: boolean;
	
	constructor(name:string) {
		this.name = name;
		this.show = false;
	}
	abstract interact(player:Player):boolean;
}

abstract class Creature extends Entity
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
	isBoss:boolean
	
	constructor(name:string, xp:number, level:number, hpRoll:string, damageRoll:string) {
		super(name, xp, level);
		
		this.hpRoll = hpRoll;
		this.damageRoll = damageRoll;
		this.className = "monster";		
	}
	calcHp() {		
		this.hp = Dice.roll(this.hpRoll);
		this.tooltip =  this.name + "\nHP: " + this.hp + "\nDamage: " + this.damageRoll;
	}
	interact(player:Player):boolean
	{
		player.attack(this);
		
		if (this.hp <= 0) return true;
		
		return false;
	}
}
export class Player extends Creature {
/*
You start at level 1 and can reach a maximum level of 30.
*/

	experinceLevels: number[];
	weapon:Weapon;
	location: Point;
	damageTaken: number;

	constructor() {
		super("You", 0, 1);		
		this.weapon = new Weapon("1d2", "Stick", 1);
        
		this.className = "player";
		this.hp = 12;		
		this.experinceLevels = [
			0, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10000, 20000, 40000, 80000, 160000, 320000, 640000,
			1280000, 2560000, 5120000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000
		];

		this.tooltip = this.name;
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

		if (opponent.hp <= 0) this.gainXp(opponent.xp);
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
	interact():boolean
	{
		return true;
	}
}
export class HealthPotion extends Entity
{
    hpRoll;
	hp: number;

	constructor() 
	{
		super("Health Potion");
		
		this.hpRoll = "8d4";
		this.className = "health";
		this.hp = Dice.roll(this.hpRoll);

		this.tooltip = this.name + "\nHP: " + this.hp;
	}	
	interact(player:Player):boolean
	{
		player.hp += this.hp;
		return true;
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
		this.className = "weapon";

		this.tooltip = this.name + "\nDamage: " + this.damageRoll;
    }
	interact(player:Player):boolean
	{
		player.weapon = this;
		return true;
	}
}
export class Stairs extends Entity
{
	constructor()
	{
		super(null);
		this.className = "stairs";
		this.tooltip = "Stairs";
	}
	interact():boolean
	{
		return true;
	}
}
export class Empty extends Entity
{
	constructor()
	{
		super(null);
		this.className = "empty"
	}
	interact():boolean
	{
		return false;
	}
}
export class Floor extends Entity
{
	constructor()
	{
		super(null);
		this.className = "floor";
	}
	interact():boolean
	{
		return true;
	}
}
class Dice {
    static roll(value):number {
		let total = 0;
		
		//some monsters have damage that uses multiple dice in addition to multiple rolls
		let rolls = value.split("/");
        rolls.forEach(r => {
			let temp = value.split("d");        	
        	let timesRoll = parseInt(temp[0]);
        	let dieSides = parseInt(temp[1]);

			for (let i = 0; i < timesRoll; i++) {
            	total += Random.next(1, dieSides);
        	}        	
		});
		
        return total;
    }
}