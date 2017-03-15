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
var Entities = require("./entities");
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
                React.createElement("div", { className: "col col-xs-2" }, "Damage Dealt:"),
                React.createElement("div", { className: "col col-xs-2" }, "Damage Taken:"),
                React.createElement("div", { className: "col col-xs-2" }, "Monster Health:")),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col col-xs-2" }, this.props.dungeonLevel),
                React.createElement("div", { className: "col col-xs-2" }, this.props.player.level),
                React.createElement("div", { className: "col col-xs-2" }, this.props.player.hp),
                React.createElement("div", { className: "col col-xs-3" },
                    this.props.player.weapon.name,
                    "\u00A0" + " " + "(",
                    this.props.player.weapon.damageRoll,
                    ")"),
                React.createElement("div", { className: "col col-xs-2" }, this.props.player.weapon.damage),
                React.createElement("div", { className: "col col-xs-2" }, this.props.player.damageTaken),
                React.createElement("div", { className: "col col-xs-2" }, this.props.monster === undefined ? "" : this.props.monster.hp))));
    };
    return UserInfo;
}(react_1.Component));
var DungeonGame = (function (_super) {
    __extends(DungeonGame, _super);
    function DungeonGame() {
        var _this = _super.call(this) || this;
        _this.dungeonMap = new dungeon_1.Map();
        _this.dungeonMap.generate();
        _this.move = _this.move.bind(_this);
        _this.state = { tileMap: _this.dungeonMap.tileMap, player: _this.dungeonMap.player };
        return _this;
    }
    DungeonGame.prototype.move = function (e) {
        var _this = this;
        var x = this.dungeonMap.player.location.x;
        var y = this.dungeonMap.player.location.y;
        var newX = x;
        var newY = y;
        debugger;
        switch (e.key) {
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
        var tile = this.dungeonMap.tileMap[newY][newX];
        var doMove = tile.interact(this.dungeonMap.player);
        if (tile instanceof Entities.Stairs) {
            this.dungeonMap.level++;
            this.dungeonMap.generate();
        }
        else {
            if (this.dungeonMap.player.hp <= 0) {
                this.dungeonMap.gameResults = dungeon_1.GameResults.lost;
                doMove = false;
            }
            else if (doMove) {
                if (tile instanceof Entities.Monster && tile.isBoss) {
                    this.dungeonMap.gameResults = dungeon_1.GameResults.won;
                    doMove = false;
                }
            }
            else {
                if (tile instanceof Entities.Monster)
                    this.dungeonMap.currentOpponent = tile;
            }
        }
        if (doMove) {
            this.dungeonMap.tileMap[y][x] = new Entities.Floor();
            this.dungeonMap.tileMap[newY][newX] = this.dungeonMap.player;
            this.dungeonMap.player.location.x = newX;
            this.dungeonMap.player.location.y = newY;
            //hide all that is visible
            this.dungeonMap.visibleTiles.forEach(function (t) {
                var point = t.split(",");
                _this.dungeonMap.tileMap[point[1]][point[0]].show = false;
            });
            this.dungeonMap.setVisibleArea();
        }
        this.setState({ tileMap: this.dungeonMap.tileMap, player: this.dungeonMap.player });
    };
    DungeonGame.prototype.componentWillMount = function () {
        window.addEventListener("keydown", this.move);
    };
    DungeonGame.prototype.componentWillUnmount = function () {
        window.removeEventListener("keydown");
    };
    DungeonGame.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(UserInfo, { player: this.state.player, dungeonLevel: this.dungeonMap.level, monster: this.dungeonMap.currentOpponent }),
            React.createElement(Dungeon, { tileMap: this.state.tileMap })));
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
        var rows = this.props.tileMap.map(function (c) {
            i++;
            return React.createElement(MapRow, { key: i, rowNumber: i, cells: c });
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
        if (this.props.tile.tooltip === null) {
            return React.createElement("div", { className: "board-cell " + this.props.tile.className });
        }
        return React.createElement("div", { className: "board-cell " + (this.props.tile.show ? this.props.tile.className : "hidden"), title: this.props.tile.tooltip });
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
        //debugger;
        var cells = this.props.cells.map(function (cell) {
            j++;
            return React.createElement(MapCell, { key: _this.props.rowNumber + "_" + j, tile: cell });
        });
        return (React.createElement("div", { className: "board-row" }, cells));
    };
    return MapRow;
}(react_1.Component));
ReactDOM.render(React.createElement(DungeonGame, null), document.getElementById("playerInfo"));
