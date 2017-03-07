/*
//http://www.rots.net/rogue/monsters.html
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

import {DungeonMapGenerator,MapTiles,Random,Tile,HealthPotion,Weapon,Monster} from './dungeon';
import {Component} from 'react';

/*
You start at level 1 and can reach a maximum level of 30.
*/

let experinceLevels = [
    0, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10000, 20000, 40000, 80000, 160000, 320000, 640000,
    1280000, 2560000, 5120000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000
];

// For each strength point below 7 they
// have, they have -1 to hit and damage. Rogues with a large amount of Strength
// get and increase to hitting and damage. With a strength of 17 or 18, a Rogue
// has +1 to hit. With 19 or 20 a Rogue has +2 to hit. From strength 21 to 30 a
// Rogue has +3 to hit, and the modifiers max out at 31 strength with +4

class UserInfo extends Component<any,any> {
    render() {
        return (
            <div>
            <div className="row">
                <div>Level:</div>
                <div>Health:</div>
                <div>Weapon:</div>
            </div>
            <div>
                <div>{this.props.player.level}</div>
                <div>{this.props.player.hp}</div>
                <div>{this.props.player.weapon.name}</div>
            </div>
        </div>
        );
    }
}
class DungeonGame extends Component<any,any> 
{   
    dungeon: DungeonMapGenerator;
    
    constructor() 
    {
        super();                
        this.dungeon = new DungeonMapGenerator();
        this.move = this.move.bind(this);
        this.state = {mapData: this.dungeon.mapData, player: this.dungeon.player};
    }
    move(e)
    {
        debugger;
        //can't move outside of room, won't move until monster is defeated, take when you go over a weapon or health potion
        let x = this.dungeon.player.location.x;
        let y = this.dungeon.player.location.y;

        let newX = x;
        let newY = y;

        switch(e.keyCode) {
            case 37: //up
                newY--;
                break;
            case 38: //left
                newX--;
                break;
            case 39: //down
                newY++;
                break;
            case 40: //right
                newX++;
                break;
        }
        
        let doMove = false;
        switch (this.dungeon.mapData[newX][newY].symbol)
        {
            case MapTiles.monster:
                //attack
                this.dungeon.player.attack(this.dungeon.mapData[newX][newY] as Monster);
                this.setState({player: this.dungeon.player});
                break;
                //is the monster dead? then allow move
            case MapTiles.stairs:
                this.dungeon = new DungeonMapGenerator();
                break;
            case MapTiles.health:
                let healthPotion= this.dungeon.mapData[newX][newY] as HealthPotion;
                this.dungeon.player.addHealth(healthPotion.hp);

                doMove = true;
            case MapTiles.weapon:                    
                let weapon = this.dungeon.mapData[newX][newY] as Weapon;
                this.dungeon.player.weapon = weapon;

                doMove = true;
                break;
            case MapTiles.corridor:
            case MapTiles.floor:
                doMove = true;
                break;
        }

        if (doMove) {
            this.dungeon.mapData[x][y] = new Tile("Floor", MapTiles.floor);

            this.dungeon.player.location.x = newX;
            this.dungeon.player.location.y = newY;
            
            this.dungeon.mapData[newX][newY] = this.dungeon.player;
        }

        this.setState({ mapData: this.dungeon.mapData, player: this.dungeon.player });        		
    }
    componentWillMount() {
        debugger;
        window.addEventListener("keydown", this.move);        
    }
    componentWillUnmount() {
        window.removeEventListener("keydown");
    }
    render() {
        ;
        return (
            <div>
            <UserInfo player={this.state.player}/>
            <Dungeon mapArea={this.state.mapData}/>
            </div>
        );
    }
}
class Dungeon extends Component<any,any> {
    render() {        
        let i = 0;
        let rows = this.props.mapArea.map(row => 
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
        let mapTileClass:string;
        //debugger;
        switch (this.props.tile.symbol) {
            case MapTiles.floor:
                mapTileClass = " floor";
                break;
            case MapTiles.monster:
                mapTileClass = " monster";
                break;
            case MapTiles.corridor:
                mapTileClass = " corridor";
                break;
            case MapTiles.monster:
                mapTileClass = " monster";
                break;
            case MapTiles.player:
                mapTileClass = " player";
                break;
            case MapTiles.weapon:
                mapTileClass = " weapon";
                break;
            case MapTiles.health:
                mapTileClass = " health";
                break;
            case MapTiles.stairs:
                mapTileClass = " stairs";
                break;
            default:
                mapTileClass = "";
                break;
        }     
        let title = this.props.tile.name + (this.props.tile.hp === undefined ? "" : "\nHP: " + this.props.tile.hp)
            + (this.props.tile.damageRoll === undefined ? "" : "\nDamage: " + this.props.tile.damageRoll);

        return <div className={"board-cell" + mapTileClass} 
            title={title}></div>
    }
    shouldComponentUpdate(nextProps, nextState) {        
        return this.props.tile != nextProps.tile;
    }
}
class MapRow extends Component<any,any> {
    render() {
        let j: number = 0;
        
        let cells = this.props.cells.map(cell =>  { 
            j++;
            return <MapCell key={this.props.rowNumber + "_" + j} tile={cell} />; 
        });
        return (
            <div className="board-row">
                {cells}
            </div>
        );
    }
}
ReactDOM.render(<DungeonGame/>, document.getElementById("map"));