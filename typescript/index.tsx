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
import {Player,Monster,Weapon,HealthPotion,Stairs,Floor,Empty} from './entities';
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
        super();

        this.dungeonMap = new Map();
        this.dungeonMap.generate();

        this.move = this.move.bind(this);
        this.state = { tileMap: this.dungeonMap.tileMap, player: this.dungeonMap.player };
    }
    // animate()
    // {
    //     requestAnimationFrame(this.animate);
    // }
    move(e)
    {
        let x = this.dungeonMap.player.location.x;
        let y = this.dungeonMap.player.location.y;

        let newX = x;
        let newY = y;
        debugger;
        switch(e.key) {
            case "ArrowUp":
                newY--;
                break;
            case "ArrowLeft":
                newX--;
                break;
            case "ArrowDown":
                newY++;
                break;
            case "ArrowRight":
                newX++;
                break;
        }
        
        let tile = this.dungeonMap.tileMap[newY][newX];
        
        if (tile instanceof Stairs)
        {
            this.dungeonMap.level++;
            this.dungeonMap.generate();
        }
        else
        {
            let doMove = tile.interact(this.dungeonMap.player);

            if (doMove) {
                this.dungeonMap.tileMap[y][x] = new Floor();

                this.dungeonMap.player.location.x = newX;
                this.dungeonMap.player.location.y = newY;
                
                this.dungeonMap.tileMap[newY][newX] = this.dungeonMap.player;
            }
        }
        

        this.setState({ tileMap: this.dungeonMap.tileMap, player: this.dungeonMap.player });        		
    }
    componentWillMount() 
    {
        window.addEventListener("keydown", this.move);        
    }
    componentWillUnmount() 
    {
        window.removeEventListener("keydown");
    }
    render() 
    {
        return (
            <div>
            <UserInfo player={this.state.player} dungeonLevel={this.dungeonMap.level}/>
            <Dungeon tileMap={this.state.tileMap}/>
            </div>
        );
    }
}
class Dungeon extends Component<any,any> {
    render() { 
        let i = 0;
        let rows = this.props.tileMap.map(c => 
        {
            i++;
            return <MapRow key={i} rowNumber={i} cells={c} />
        });
        return (
            <div>
                {rows}
            </div>
        );
    }
}

//let title = this.props.tile.name + (this.props.tile.hp === undefined ? "" : "\nHP: " + this.props.tile.hp)
//    + (this.props.tile.damageRoll === undefined ? "" : "\nDamage: " + this.props.tile.damageRoll);
class MapCell extends Component<any,any> {
    //is it a person, weapon, health item or enemy
    render() {        
        //debugger;
        if (this.props.tile.tooltip === null) {
            return <div className={"board-cell " + this.props.tile.className}></div>
        }
        
        return <div className={"board-cell " + this.props.tile.className} 
            title={this.props.tile.tooltip}></div>
    }
    shouldComponentUpdate(nextProps, nextState) {        
        return this.props.tile != nextProps.tile;
    }
}
class MapRow extends Component<any,any> {
    render() {
        let j: number = 0;
        //debugger;
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
ReactDOM.render(<DungeonGame/>, document.getElementById("playerInfo"));