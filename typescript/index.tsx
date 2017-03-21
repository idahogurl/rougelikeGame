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
import {Map, GameStatus} from './dungeon';
import * as Entities from './entities';
import {Component} from 'react';

class InfoPanel extends Component<any,any>
{
    render()
    {
        let rows = this.props.rows;
        debugger;
        let i = 0;
        if (rows === undefined)
        {
            rows = this.props.info.map(c => 
            {
                i++;
                return (
                    <div className="table-row" key={i}>
                        <div className="table-cell"><label>{c.label}:</label></div>
                        <div className="table-cell">{c.val}</div>
                    </div>);
            });
        }
       
        return (<div className="info-panel">
                <div className="table-row">
                    <div className="scroll-top table-cell"></div>
                    <div className="scroll-body table-cell">
                        <div className="info">
                            <div className="info-header">{this.props.header}</div>
                        {rows}       
                        </div>
                    </div>
                    <div className="scroll-end table-cell"></div>
                </div>
                </div>);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.rows != nextProps.rows;
    }
}

class OpponentInfo extends Component<any,any>
{
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.player != nextProps.player;
    }
    render()
    {
        debugger;
        let info = [];
        info.push({ label: "Damage Dealt", val: !this.props.player.weapon.damage ? "Not Started" : this.props.player.weapon.damage });
        info.push({ label: "Damage Taken", val: !this.props.player.damageTaken ? "Not Started" :  this.props.player.damageTaken});
        info.push({ label: "Monster Health", val: !this.props.monster ? "Not Started" : this.props.monster.hp  < 0 ? 0 : this.props.monster.hp });
        return (
            <InfoPanel header="Battle" info={info}/>
                          
        );
    }    
}
class UserInfo extends Component<any,any> 
{
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.player != nextProps.player;
    }
    render() {
        let info = [];
        info.push({label: "Dungeon", val: this.props.dungeonLevel });
        info.push({label: "XP Level", val: this.props.player.level });
        info.push({label: "Health", val: this.props.player.hp });
        info.push({label: "Weapon", val: this.props.player.weapon.name + " (" + this.props.player.weapon.damageRoll +")" });
        
        return (
            <InfoPanel header="Player" info={info}/>
        );
    }
}

class Legend extends Component<any,any>
{
    render()
    {
        let rows = (
            <div>
                <div className="table-row">
                    <div className="table-cell">
                        <div className="legend-cell player"></div>
                        </div>
                        <div className="table-cell">
                            <label className="legend-label">You</label>
                        </div>
                </div>
                <div className="table-row">
                    <div className="table-cell"><div className="legend-cell monster"></div></div>
                    <div className="table-cell"><label className="legend-label">Monster</label></div></div>
                <div className="table-row">
                    <div className="table-cell"><div className="legend-cell weapon"></div>
                    </div><div className="table-cell"><label className="legend-label">Weapon</label></div>
                </div>
                <div className="table-row">
                    <div className="table-cell"><div className="legend-cell health"></div></div>
                    <div className="table-cell"><label className="legend-label">Health Potion</label></div></div>
                <div className="table-row">
                    <div className="table-cell">
                        <div className="legend-cell boss"></div></div>
                        <div className="table-cell"><label className="legend-label">Boss</label></div></div>
                <div className="table-row">
                    <div className="table-cell"><div className="legend-cell stairs"></div></div>
                    <div className="table-cell"><label  className="legend-label">Stairs</label></div></div>
            </div>);

        return (
            <InfoPanel header="Legend" rows={rows}/>
                          
        );
        
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
}
class DungeonGame extends Component<any,any> 
{   
    dungeonMap: Map;
    
    constructor() 
    {
        super();

        this.reset = this.reset.bind(this);
        this.reset(null);

        this.move = this.move.bind(this);
        this.state = { dungeon: this.dungeonMap };
    }
    reset(e) {
        
        this.dungeonMap = new Map();
        this.dungeonMap.generate();        
        if (e !== null) this.setState({dungeon: this.dungeonMap});
    }
    move(e)
    {
        let x = this.dungeonMap.player.location.x;
        let y = this.dungeonMap.player.location.y;

        let newX = x;
        let newY = y;
        debugger;
        switch(e.keyCode) {
            case 38:
                newY--;
                break;
            case 37:
                newX--;
                break;
            case 40:
                newY++;
                break;
            case 39:
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
                this.dungeonMap.gameStatus = GameStatus.lost;
                doMove = false;
            }
            else if (doMove) {
                
                if (tile instanceof Entities.Monster && (tile as Entities.Monster).isBoss)
                {
                    this.dungeonMap.gameStatus = GameStatus.won;
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
            
            this.dungeonMap.hideVisibleArea();
            this.dungeonMap.setVisibleArea();
        }
        this.setState({dungeon: this.dungeonMap});
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
        let instructions = (<ul>
            <li>Use arrow keys to move.</li>
            <li>To obtain an item or attack a monster, move over the square.</li>
            <li>Hover over squares to see their properties.</li>
            <li>Defeat boss in level 20.</li>
            </ul>);
        debugger;
        let playAgainButton = <button className="btn btn-default" onClick={this.reset}>Play again?</button>;
        return (
            <div>
                <div className="table-row">
                    <div className="table-cell info-panels">
                        <InfoPanel header="Instructions" rows={instructions}/>
                        <Legend />                        
                    </div>
                    <div className="table-cell map">
                       
                            {this.state.dungeon.gameStatus === GameStatus.in_progress ?
                                <Dungeon tileMap={this.state.dungeon.tileMap} player={this.state.dungeon.player}/>
                                : this.state.dungeon.gameStatus === GameStatus.won ? 
                                    <div><div id="won" className="gameResult"/>{playAgainButton}</div>
                                    :  this.state.dungeon.gameStatus == GameStatus.lost ?
                                       <div><div id="lost" className="gameResult"></div>{playAgainButton}</div> : ""}
                        
                    </div>
                    <div className="table-cell info-panels">
                            <UserInfo player={this.state.dungeon.player} dungeonLevel={this.state.dungeon.level} />
                            <OpponentInfo monster={this.state.dungeon.currentOpponent} player={this.state.dungeon.player}/>
                    </div>
                </div>                
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
ReactDOM.render(<DungeonGame/>, document.getElementById("dungeonGame"));