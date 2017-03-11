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
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
require('./sass/styles.scss');
//import {DungeonMapGenerator,MapTiles,Random,Tile,HealthPotion,Weapon,Monster} from './dungeon';
var dungeon_1 = require("./dungeon");
var react_1 = require("react");
var UserInfo = (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo() {
        return _super.apply(this, arguments) || this;
    }
    UserInfo.prototype.render = function () {
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col col-xs-2" },
                    React.createElement("label", null, "Dungeon:")),
                React.createElement("div", { className: "col col-xs-2" },
                    React.createElement("label", null, "Level:")),
                React.createElement("div", { className: "col col-xs-2" }, "Health:"),
                React.createElement("div", { className: "col col-xs-3" }, "Weapon:"),
                React.createElement("div", { className: "col col-xs-3" }, "Damage Dealt:"),
                React.createElement("div", { className: "col col-xs-2" }, "Damage Taken:")),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col col-xs-2" }, this.props.dungeonLevel),
                React.createElement("div", { className: "col col-xs-2" }, this.props.player.level),
                React.createElement("div", { className: "col col-xs-2" }, this.props.player.hp),
                React.createElement("div", { className: "col col-xs-3" },
                    this.props.player.weapon.name,
                    "\u00A0" + " " + "(",
                    this.props.player.weapon.damageRoll,
                    ")"),
                React.createElement("div", { className: "col col-xs-3" }, this.props.player.weapon.damage),
                React.createElement("div", { className: "col col-xs-2" }, this.props.player.damageTaken))));
    };
    return UserInfo;
}(react_1.Component));
var DungeonGame = (function (_super) {
    __extends(DungeonGame, _super);
    function DungeonGame() {
        var _this;
        debugger;
        _this = _super.call(this) || this;
        _this.dungeonMap = new dungeon_1.Map(800, 800, document.getElementById("map"));
        _this.dungeonMap.paint();
        _this.move = _this.move.bind(_this);
        return _this;
        //this.state = {mapData: this.dungeon.mapData, player: this.dungeon.player};
    }
    DungeonGame.prototype.move = function (e) {
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
    };
    DungeonGame.prototype.componentWillMount = function () {
        //debugger;
        window.addEventListener("keydown", this.move);
    };
    DungeonGame.prototype.componentWillUnmount = function () {
        window.removeEventListener("keydown");
    };
    DungeonGame.prototype.render = function () {
        debugger;
        return (React.createElement("div", null));
    };
    return DungeonGame;
}(react_1.Component));
var Dungeon = (function (_super) {
    __extends(Dungeon, _super);
    function Dungeon() {
        return _super.apply(this, arguments) || this;
    }
    Dungeon.prototype.render = function () {
        var i = 0;
        var rows = this.props.mapArea.map(function (row) {
            i++;
            return React.createElement(MapRow, { key: i, rowNumber: i, cells: row });
        });
        return (React.createElement("div", null, rows));
    };
    return Dungeon;
}(react_1.Component));
var MapCell = (function (_super) {
    __extends(MapCell, _super);
    function MapCell() {
        return _super.apply(this, arguments) || this;
    }
    //is it a person, weapon, health item or enemy
    MapCell.prototype.render = function () {
        var mapTileClass;
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
        var title = this.props.tile.name + (this.props.tile.hp === undefined ? "" : "\nHP: " + this.props.tile.hp)
            + (this.props.tile.damageRoll === undefined ? "" : "\nDamage: " + this.props.tile.damageRoll);
        return React.createElement("div", { className: "board-cell" + mapTileClass, title: title });
    };
    MapCell.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props.tile != nextProps.tile;
    };
    return MapCell;
}(react_1.Component));
var MapRow = (function (_super) {
    __extends(MapRow, _super);
    function MapRow() {
        return _super.apply(this, arguments) || this;
    }
    MapRow.prototype.render = function () {
        var j = 0;
        var cells = this.props.cells.map(function (cell) {
            j++;
            //return <MapCell key={this.props.rowNumber + "_" + j} tile={cell} />; 
        });
        return (React.createElement("div", { className: "board-row" }, cells));
    };
    return MapRow;
}(react_1.Component));
ReactDOM.render(React.createElement(DungeonGame, null), document.getElementById("playerInfo"));
