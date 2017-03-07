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
var dungeon_1 = require("./dungeon");
var react_1 = require("react");
/*
You start at level 1 and can reach a maximum level of 30.
*/
var experinceLevels = [
    0, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10000, 20000, 40000, 80000, 160000, 320000, 640000,
    1280000, 2560000, 5120000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000
];
// For each strength point below 7 they
// have, they have -1 to hit and damage. Rogues with a large amount of Strength
// get and increase to hitting and damage. With a strength of 17 or 18, a Rogue
// has +1 to hit. With 19 or 20 a Rogue has +2 to hit. From strength 21 to 30 a
// Rogue has +3 to hit, and the modifiers max out at 31 strength with +4
var UserInfo = (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo() {
        return _super.apply(this, arguments) || this;
    }
    UserInfo.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", { className: "row" },
                React.createElement("div", null, "Level:"),
                React.createElement("div", null, "Health:"),
                React.createElement("div", null, "Weapon:")),
            React.createElement("div", null,
                React.createElement("div", null, this.props.player.level),
                React.createElement("div", null, this.props.player.hp),
                React.createElement("div", null, this.props.player.weapon.name))));
    };
    return UserInfo;
}(react_1.Component));
var DungeonGame = (function (_super) {
    __extends(DungeonGame, _super);
    function DungeonGame() {
        var _this = _super.call(this) || this;
        _this.dungeon = new dungeon_1.DungeonMapGenerator();
        _this.move = _this.move.bind(_this);
        _this.state = { mapData: _this.dungeon.mapData, player: _this.dungeon.player };
        return _this;
    }
    DungeonGame.prototype.move = function (e) {
        debugger;
        //can't move outside of room, won't move until monster is defeated, take when you go over a weapon or health potion
        var x = this.dungeon.player.location.x;
        var y = this.dungeon.player.location.y;
        var newX = x;
        var newY = y;
        switch (e.keyCode) {
            case 37:
                newY--;
                break;
            case 38:
                newX--;
                break;
            case 39:
                newY++;
                break;
            case 40:
                newX++;
                break;
        }
        var doMove = false;
        switch (this.dungeon.mapData[newX][newY].symbol) {
            case dungeon_1.MapTiles.monster:
                //attack
                this.dungeon.player.attack(this.dungeon.mapData[newX][newY]);
                this.setState({ player: this.dungeon.player });
                break;
            //is the monster dead? then allow move
            case dungeon_1.MapTiles.stairs:
                this.dungeon = new dungeon_1.DungeonMapGenerator();
                break;
            case dungeon_1.MapTiles.health:
                var healthPotion = this.dungeon.mapData[newX][newY];
                this.dungeon.player.addHealth(healthPotion.hp);
                doMove = true;
            case dungeon_1.MapTiles.weapon:
                var weapon = this.dungeon.mapData[newX][newY];
                this.dungeon.player.weapon = weapon;
                doMove = true;
                break;
            case dungeon_1.MapTiles.corridor:
            case dungeon_1.MapTiles.floor:
                doMove = true;
                break;
        }
        if (doMove) {
            this.dungeon.mapData[x][y] = new dungeon_1.Tile("Floor", dungeon_1.MapTiles.floor);
            this.dungeon.player.location.x = newX;
            this.dungeon.player.location.y = newY;
            this.dungeon.mapData[newX][newY] = this.dungeon.player;
        }
        this.setState({ mapData: this.dungeon.mapData, player: this.dungeon.player });
    };
    DungeonGame.prototype.componentWillMount = function () {
        debugger;
        window.addEventListener("keydown", this.move);
    };
    DungeonGame.prototype.componentWillUnmount = function () {
        window.removeEventListener("keydown");
    };
    DungeonGame.prototype.render = function () {
        ;
        return (React.createElement("div", null,
            React.createElement(UserInfo, { player: this.state.player }),
            React.createElement(Dungeon, { mapArea: this.state.mapData })));
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
        //debugger;
        switch (this.props.tile.symbol) {
            case dungeon_1.MapTiles.floor:
                mapTileClass = " floor";
                break;
            case dungeon_1.MapTiles.monster:
                mapTileClass = " monster";
                break;
            case dungeon_1.MapTiles.corridor:
                mapTileClass = " corridor";
                break;
            case dungeon_1.MapTiles.monster:
                mapTileClass = " monster";
                break;
            case dungeon_1.MapTiles.player:
                mapTileClass = " player";
                break;
            case dungeon_1.MapTiles.weapon:
                mapTileClass = " weapon";
                break;
            case dungeon_1.MapTiles.health:
                mapTileClass = " health";
                break;
            case dungeon_1.MapTiles.stairs:
                mapTileClass = " stairs";
                break;
            default:
                mapTileClass = "";
                break;
        }
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
        var _this = this;
        var j = 0;
        var cells = this.props.cells.map(function (cell) {
            j++;
            return React.createElement(MapCell, { key: _this.props.rowNumber + "_" + j, tile: cell });
        });
        return (React.createElement("div", { className: "board-row" }, cells));
    };
    return MapRow;
}(react_1.Component));
ReactDOM.render(React.createElement(DungeonGame, null), document.getElementById("map"));
