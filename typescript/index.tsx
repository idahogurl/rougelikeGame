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

//import {DungeonMapGenerator,MapTiles,Random,Tile,HealthPotion,Weapon,Monster} from './dungeon';
import {Map} from './dungeon';
import {Component} from 'react';

class UserInfo extends Component<any,any> {
    render() {
        return (
            <div className="container">
            <div className="row">
                <div className="col col-xs-2"><label>Dungeon:</label></div>
                <div className="col col-xs-2"><label>Level:</label></div>
                <div className="col col-xs-2">Health:</div>
                <div className="col col-xs-3">Weapon:</div>
                <div className="col col-xs-3">Damage Dealt:</div>
                <div className="col col-xs-2">Damage Taken:</div>
            </div>
            <div className="row">
                <div className="col col-xs-2">{this.props.dungeonLevel}</div>
                <div className="col col-xs-2">{this.props.player.level}</div>
                <div className="col col-xs-2">{this.props.player.hp}</div>
                <div className="col col-xs-3">{this.props.player.weapon.name}&nbsp;
                    ({this.props.player.weapon.damageRoll})</div>
                <div className="col col-xs-3">{this.props.player.weapon.damage}</div>
                <div className="col col-xs-2">{this.props.player.damageTaken}</div>
            </div>
        </div>
        );
    }
}
class DungeonGame extends Component<any,any> 
{   
    dungeonMap: Map;
    
    constructor() 
    {
        debugger;
        super();                
        this.dungeonMap = new Map(800, 800, document.getElementById("map"));
        this.dungeonMap.paint();

        this.move = this.move.bind(this);
        //this.state = {mapData: this.dungeon.mapData, player: this.dungeon.player};
    }
    move(e)
    {
        //debugger;
        //can't move outside of room, won't move until monster is defeated, take when you go over a weapon or health potion
        //let x = this.dungeon.player.location.x;
        //let y = this.dungeon.player.location.y;

        //let newX = x;
        //let newY = y;

        // switch(e.keyCode) {
        //     case 37: //up
        //         newY--;
        //         break;
        //     case 38: //left
        //         newX--;
        //         break;
        //     case 39: //down
        //         newY++;
        //         break;
        //     case 40: //right
        //         newX++;
        //         break;
        // }
        
        // let doMove = false;
        // switch (this.dungeon.mapData[newX][newY].symbol)
        // {
        //     case MapTiles.monster:
        //         //attack
        //         let monster = this.dungeon.mapData[newX][newY] as Monster;
        //         this.dungeon.player.attack(monster);
        //         this.setState({player: this.dungeon.player});
                
        //         doMove = monster.hp <= 0;
               
        //         break;
        //     case MapTiles.stairs:
        //         this.dungeon.level += 1;
        //         this.dungeon.generateMap();
        //         break;
        //     case MapTiles.health:
        //     //debugger;
        //         let healthPotion= this.dungeon.mapData[newX][newY] as HealthPotion;
        //         this.dungeon.player.addHealth(healthPotion.hp);

        //         doMove = true;
        //         break;
        //     case MapTiles.weapon:
        //     //debugger;                    
        //         let weapon = this.dungeon.mapData[newX][newY] as Weapon;
        //         this.dungeon.player.weapon = weapon;

        //         doMove = true;
        //         break;
        //     case MapTiles.corridor:
        //     case MapTiles.floor:
        //         doMove = true;
        //         break;
        // }

        // if (doMove) {
        //     this.dungeon.mapData[x][y] = new Tile("Floor", MapTiles.floor);

        //     this.dungeon.player.location.x = newX;
        //     this.dungeon.player.location.y = newY;
            
        //     this.dungeon.mapData[newX][newY] = this.dungeon.player;
        // }

        // this.setState({ mapData: this.dungeon.mapData, player: this.dungeon.player });        		
    }
    componentWillMount() 
    {
        //debugger;
        window.addEventListener("keydown", this.move);        
    }
    componentWillUnmount() 
    {
        window.removeEventListener("keydown");
    }
    render() 
    {
        debugger;
        return (
            <div>
            {/*<UserInfo player={this.state.player} dungeonLevel={this.dungeon.level}/>*/}
            {/*<Dungeon mapArea={this.state.mapData}/>*/}
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
        // //debugger;
        // switch (this.props.tile.symbol) {
        //     case MapTiles.floor:
        //         mapTileClass = " floor";
        //         break;
        //     case MapTiles.monster:
        //         mapTileClass = " monster";
        //         break;
        //     case MapTiles.corridor:
        //         mapTileClass = " corridor";
        //         break;
        //     case MapTiles.monster:
        //         mapTileClass = " monster";
        //         break;
        //     case MapTiles.player:
        //         mapTileClass = " player";
        //         break;
        //     case MapTiles.weapon:
        //         mapTileClass = " weapon";
        //         break;
        //     case MapTiles.health:
        //         mapTileClass = " health";
        //         break;
        //     case MapTiles.stairs:
        //         mapTileClass = " stairs";
        //         break;
        //     default:
        //         mapTileClass = "";
        //         break;
        // }     
        // if (this.props.tile.name === null) {
        //     return <div className={"board-cell" + mapTileClass}></div>
        // }
        
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
            //return <MapCell key={this.props.rowNumber + "_" + j} tile={cell} />; 
        });
        return (
            <div className="board-row">
                {cells}
            </div>
        );
    }
}
ReactDOM.render(<DungeonGame/>, document.getElementById("playerInfo"));