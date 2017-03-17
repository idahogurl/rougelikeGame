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
var InfoPanel = (function (_super) {
    __extends(InfoPanel, _super);
    function InfoPanel() {
        return _super.apply(this, arguments) || this;
    }
    InfoPanel.prototype.render = function () {
        var rows = this.props.rows;
        debugger;
        var i = 0;
        if (rows === undefined) {
            rows = this.props.info.map(function (c) {
                i++;
                return (React.createElement("div", { className: "table-row", key: i },
                    React.createElement("div", { className: "table-cell" },
                        React.createElement("label", null,
                            c.label,
                            ":")),
                    React.createElement("div", { className: "table-cell" }, c.val)));
            });
        }
        return (React.createElement("div", { className: "info-panel" },
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "scroll-top table-cell" }),
                React.createElement("div", { className: "scroll-body table-cell" },
                    React.createElement("div", { className: "info" },
                        React.createElement("div", { className: "info-header" }, this.props.header),
                        rows)),
                React.createElement("div", { className: "scroll-end table-cell" }))));
    };
    InfoPanel.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props.rows != nextProps.rows;
    };
    return InfoPanel;
}(react_1.Component));
var OpponentInfo = (function (_super) {
    __extends(OpponentInfo, _super);
    function OpponentInfo() {
        return _super.apply(this, arguments) || this;
    }
    OpponentInfo.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props.player != nextProps.player;
    };
    OpponentInfo.prototype.render = function () {
        debugger;
        var info = [];
        info.push({ label: "Damage Dealt", val: !this.props.player.weapon.damage ? "Not Started" : this.props.player.weapon.damage });
        info.push({ label: "Damage Taken", val: !this.props.player.damageTaken ? "Not Started" : this.props.player.damageTaken });
        info.push({ label: "Monster Health", val: !this.props.monster ? "Not Started" : this.props.monster.hp < 0 ? 0 : this.props.monster.hp });
        return (React.createElement(InfoPanel, { header: "Battle", info: info }));
    };
    return OpponentInfo;
}(react_1.Component));
var UserInfo = (function (_super) {
    __extends(UserInfo, _super);
    function UserInfo() {
        return _super.apply(this, arguments) || this;
    }
    UserInfo.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props.player != nextProps.player;
    };
    UserInfo.prototype.render = function () {
        var info = [];
        info.push({ label: "Dungeon", val: this.props.dungeonLevel });
        info.push({ label: "XP Level", val: this.props.player.level });
        info.push({ label: "Health", val: this.props.player.hp });
        info.push({ label: "Weapon", val: this.props.player.weapon.name + " (" + this.props.player.weapon.damageRoll + ")" });
        return (React.createElement(InfoPanel, { header: "Player", info: info }));
    };
    return UserInfo;
}(react_1.Component));
var Legend = (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        return _super.apply(this, arguments) || this;
    }
    Legend.prototype.render = function () {
        var rows = (React.createElement("div", null,
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "table-cell" },
                    React.createElement("div", { className: "legend-cell player" })),
                React.createElement("div", { className: "table-cell" },
                    React.createElement("label", { className: "legend-label" }, "You"))),
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "table-cell" },
                    React.createElement("div", { className: "legend-cell monster" })),
                React.createElement("div", { className: "table-cell" },
                    React.createElement("label", { className: "legend-label" }, "Monster"))),
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "table-cell" },
                    React.createElement("div", { className: "legend-cell weapon" })),
                React.createElement("div", { className: "table-cell" },
                    React.createElement("label", { className: "legend-label" }, "Weapon"))),
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "table-cell" },
                    React.createElement("div", { className: "legend-cell health" })),
                React.createElement("div", { className: "table-cell" },
                    React.createElement("label", { className: "legend-label" }, "Health Potion"))),
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "table-cell" },
                    React.createElement("div", { className: "legend-cell boss" })),
                React.createElement("div", { className: "table-cell" },
                    React.createElement("label", { className: "legend-label" }, "Boss"))),
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "table-cell" },
                    React.createElement("div", { className: "legend-cell stairs" })),
                React.createElement("div", { className: "table-cell" },
                    React.createElement("label", { className: "legend-label" }, "Stairs")))));
        return (React.createElement(InfoPanel, { header: "Legend", rows: rows }));
    };
    Legend.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return false;
    };
    return Legend;
}(react_1.Component));
var DungeonGame = (function (_super) {
    __extends(DungeonGame, _super);
    function DungeonGame() {
        var _this = _super.call(this) || this;
        _this.reset = _this.reset.bind(_this);
        _this.reset();
        _this.move = _this.move.bind(_this);
        _this.state = { dungeon: _this.dungeonMap };
        return _this;
    }
    DungeonGame.prototype.reset = function () {
        this.dungeonMap = new dungeon_1.Map();
        this.dungeonMap.generate();
    };
    DungeonGame.prototype.move = function (e) {
        var x = this.dungeonMap.player.location.x;
        var y = this.dungeonMap.player.location.y;
        var newX = x;
        var newY = y;
        debugger;
        switch (e.keyCode) {
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
        var tile = this.dungeonMap.tileMap[newY][newX];
        var doMove = tile.interact(this.dungeonMap.player);
        if (tile instanceof Entities.Stairs) {
            this.dungeonMap.level++;
            this.dungeonMap.generate();
        }
        else {
            if (this.dungeonMap.player.hp <= 0) {
                this.dungeonMap.gameStatus = dungeon_1.GameStatus.lost;
                doMove = false;
            }
            else if (doMove) {
                this.dungeonMap.gameStatus = dungeon_1.GameStatus.won;
                if (tile instanceof Entities.Monster && tile.isBoss) {
                    this.dungeonMap.gameStatus = dungeon_1.GameStatus.won;
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
            this.dungeonMap.hideVisibleArea();
            this.dungeonMap.setVisibleArea();
        }
        this.setState({ dungeon: this.dungeonMap });
    };
    DungeonGame.prototype.componentWillMount = function () {
        window.addEventListener("keydown", this.move);
    };
    DungeonGame.prototype.componentWillUnmount = function () {
        window.removeEventListener("keydown");
    };
    DungeonGame.prototype.render = function () {
        var instructions = (React.createElement("ul", null,
            React.createElement("li", null, "Use arrow keys to move."),
            React.createElement("li", null, "To obtain an item or attack a monster, move over the square."),
            React.createElement("li", null, "Hover over squares to see their properties."),
            React.createElement("li", null, "Defeat boss in level 20.")));
        debugger;
        var playAgainButton = React.createElement("button", { className: "btn btn-default", onClick: this.reset }, "Play again?");
        return (React.createElement("div", null,
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "table-cell info-panels" },
                    React.createElement(InfoPanel, { header: "Instructions", rows: instructions }),
                    React.createElement(Legend, null)),
                React.createElement("div", { className: "table-cell map" }, this.state.dungeon.gameStatus === dungeon_1.GameStatus.in_progress ?
                    React.createElement(Dungeon, { tileMap: this.state.dungeon.tileMap, player: this.state.dungeon.player })
                    : this.state.dungeon.gameStatus === dungeon_1.GameStatus.won ?
                        React.createElement("div", null,
                            React.createElement("div", { id: "won", className: "gameResult" }),
                            playAgainButton)
                        : this.state.dungeon.gameStatus == dungeon_1.GameStatus.lost ?
                            React.createElement("div", null,
                                React.createElement("div", { id: "lost", className: "gameResult" }),
                                playAgainButton) : ""),
                React.createElement("div", { className: "table-cell info-panels" },
                    React.createElement(UserInfo, { player: this.state.dungeon.player, dungeonLevel: this.state.dungeon.level }),
                    React.createElement(OpponentInfo, { monster: this.state.dungeon.currentOpponent, player: this.state.dungeon.player })))));
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
ReactDOM.render(React.createElement(DungeonGame, null), document.getElementById("dungeonGame"));
