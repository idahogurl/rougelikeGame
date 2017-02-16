/*
//http://pcg.wikidot.com/
//http://donjon.bin.sh/code/dungeon/
//http://gamedev.stackexchange.com/questions/2663/what-are-some-ideal-algorithms-for-rogue-like-2d-dungeon-generation
//http://www.roguebasin.com/index.php?title=Dungeon-Building_Algorithm
//http://bigbadwofl.me/random-dungeon-generator/



User Story: I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.

User Story: All the items and enemies on the map are arranged at random.

User Story: I can move throughout a map, discovering items.

User Story: I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.

User Story: Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.

User Story: When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.

User Story: When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.

User Story: When I find and beat the boss, I win.

User Story: The game should be challenging, but theoretically winnable.
*/

const React = require('react');
const ReactDOM = require('react-dom');

require('./sass/styles.scss');

import {Component} from 'react';

class Character {
    hp: number;
    weapon: Weapon;
    xp: number;
    x_position: number;
    y_position: number;

    constructor(hp, weapon, xp) {
        this.hp = hp;
        this.weapon = weapon;
        this.xp = xp;
    }

    attack(opponent: Character) {
        opponent.hp -= this.weapon.damage;
        this.hp -= opponent.weapon.damage;        
    }

    move() {
        //keycodes are:

        // left = 37
        // up = 38
        // right = 39
        // down = 40
    }
}

class HealthItem {
    value: number;
}

class Weapon {
    name: string;
    damage: number;

    constructor(name:string, damage:number){
        this.name = name;
        this.damage = damage;
    }
}

class DungeonGame extends Component<any,any> {   
    player: Character;
    dungeon: Dungeon;
    constructor() {
        super();
        this.player = new Character(100, new Weapon("hands", 4), 0);
        this.dungeon = new Dungeon();
    }
    engage(e) {
        //who are you engaging?
        //this.player.attack(this.dungeon.rooms[0].enemies[0]);
    }

    render() {
        return (
            <div>
            <Dungeon/>
            </div>
        );
    }
}

class Dungeon extends Component<any,any> {
    width: 10;
    height: 10;
    
    map: number[][];

    generateMap() {  
        this.map = new Array(this.height);
        for (let row = 0; row < this.height; row++) {
            this.map[row] = new Array(this.width);
            for (let col = 0; col < this.width; col++) {
                this.map[row][col] = 1;
            }
        }
    }

    placeEnemiesAndItems(){

    }

    render() {        
        let i = 1;
        let rows = this.props.board.map(row => 
            { 
               i++;
              
               return <MapRow key={i} rowNumber={i} cells={row} />
            });
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class MapCell extends Component<any,any> {
    
    //is it a person, weapon, health item or enemy
    render() {
        let status = this.props.val === "A" ? "alive" : this.props.val === "D" ? "dead" : "edge";
        return <div className={"board-cell " + status}>&nbsp;</div>
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.val != nextProps.val;
    }
}

class MapRow extends Component<any,any> {
    render() {
        let j: number = 1;
        
        let cells = this.props.cells.map(cell =>  { 
            j++;
            return <MapCell key={this.props.rowNumber + "_" + j} val={cell}/>; 
        });
        return (
            <div className="board-row">
                {cells}
            </div>
        );
    }
}

ReactDOM.render(<DungeonGame/>, document.getElementById("map"));