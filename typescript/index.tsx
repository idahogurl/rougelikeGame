/*
//http://www.rots.net/rogue/monsters.html

x User Story: I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.

x User Story: All the items and enemies on the map are arranged at random.

x User Story: I can move throughout a map, discovering items.

x User Story: I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.

User Story: Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.

x User Story: When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.

x User Story: When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.

User Story: When I find and beat the boss, I win.

x User Story: The game should be challenging, but theoretically winnable.
*/

const React = require('react');
const ReactDOM = require('react-dom');

require('./sass/styles.scss');

//import {DungeonMapGenerator,MapTiles,Random,Tile,HealthPotion,Weapon,Monster} from './dungeon';
import {Map, GameResults} from './dungeon';
import * as Entities from './entities';
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
                <div className="col col-xs-2">Damage Dealt:</div>
                <div className="col col-xs-2">Damage Taken:</div>
                <div className="col col-xs-2">Monster Health:</div>
            </div>
            <div className="row">
                <div className="col col-xs-2">{this.props.dungeonLevel}</div>
                <div className="col col-xs-2">{this.props.player.level}</div>
                <div className="col col-xs-2">{this.props.player.hp}</div>
                <div className="col col-xs-3">{this.props.player.weapon.name}&nbsp;
                    ({this.props.player.weapon.damageRoll})</div>
                <div className="col col-xs-2">{this.props.player.weapon.damage}</div>
                <div className="col col-xs-2">{this.props.player.damageTaken}</div>
                <div className="col col-xs-2">{this.props.monster === undefined ? "" : this.props.monster.hp}</div>
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
        let doMove = tile.interact(this.dungeonMap.player);
        
        if (tile instanceof Entities.Stairs)
        {
            this.dungeonMap.level++;
            this.dungeonMap.generate();            
        }
        else
        {  
            if (this.dungeonMap.player.hp <= 0) 
            {
                this.dungeonMap.gameResults = GameResults.lost;
                doMove = false;
            }
            else if (doMove) {
                if (tile instanceof Entities.Monster && (tile as Entities.Monster).isBoss)
                {
                    this.dungeonMap.gameResults = GameResults.won;
                    doMove = false;                
                }
            } 
            else
            {
                if (tile instanceof Entities.Monster) 
                    this.dungeonMap.currentOpponent = tile as Entities.Monster;
            }
        }

        if (doMove)
        {
            this.dungeonMap.tileMap[y][x] = new Entities.Floor();            
            
            this.dungeonMap.tileMap[newY][newX] = this.dungeonMap.player;
            this.dungeonMap.player.location.x = newX;
            this.dungeonMap.player.location.y = newY;

            //hide all that is visible
            this.dungeonMap.visibleTiles.forEach(t => {
                let point = t.split(",");
                this.dungeonMap.tileMap[point[1]][point[0]].show = false;
            });

            this.dungeonMap.setVisibleArea();            
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
            <UserInfo player={this.state.player} dungeonLevel={this.dungeonMap.level} monster={this.dungeonMap.currentOpponent}/>
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

class MapCell extends Component<any,any> {
    //is it a person, weapon, health item or enemy
    render() {        
        if (this.props.tile.tooltip === null) {
            return <div className={"board-cell " + this.props.tile.className}></div>
        }
        
        return <div className={"board-cell " + (this.props.tile.show ? this.props.tile.className : "hidden")} 
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