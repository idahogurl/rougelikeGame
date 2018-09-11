"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var ReactDOM = require("react-dom");
var dungeon_1 = require("./dungeon");
var Entities = require("./entities");
require("./sass/styles.scss");
var InfoPanel_1 = require("./components/InfoPanel");
var Legend_1 = require("./components/Legend");
var Dungeon_1 = require("./components/Dungeon");
var UserInfo_1 = require("./components/UserInfo");
var OpponentInfo_1 = require("./components/OpponentInfo");
var DungeonGame = /** @class */ (function (_super) {
    __extends(DungeonGame, _super);
    function DungeonGame(props) {
        var _this = _super.call(this, props) || this;
        _this.reset = _this.reset.bind(_this);
        _this.reset(null);
        _this.move = _this.move.bind(_this);
        _this.state = { dungeon: _this.dungeonMap };
        return _this;
    }
    DungeonGame.prototype.reset = function (e) {
        this.dungeonMap = new dungeon_1.Map();
        this.dungeonMap.generate();
        if (e !== null)
            this.setState({ dungeon: this.dungeonMap });
    };
    DungeonGame.prototype.move = function (e) {
        var x = this.dungeonMap.player.location.x;
        var y = this.dungeonMap.player.location.y;
        var newX = x;
        var newY = y;
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
            var currentOpponentHp = this.dungeonMap.currentOpponentHp;
            //keep the previous battle information
            this.dungeonMap.generate();
            this.dungeonMap.currentOpponentHp = currentOpponentHp;
        }
        else if (this.dungeonMap.player.hp <= 0) //player died
         {
            this.dungeonMap.gameStatus = dungeon_1.GameStatus.lost;
        }
        else if (tile instanceof Entities.Monster) {
            var monster = tile;
            this.dungeonMap.currentOpponentHp = monster.hp;
            if (doMove && monster.isBoss) //boss defeated
             {
                this.dungeonMap.gameStatus = dungeon_1.GameStatus.won;
                doMove = false;
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
            React.createElement("li", null, "To obtain an item or to attack a monster, move over the square."),
            React.createElement("li", null, "Hover over a square to see its properties."),
            React.createElement("li", null, "Defeat boss in level 20.")));
        var dungeon = this.state.dungeon;
        return (React.createElement("div", null,
            React.createElement("div", { className: "table-row" },
                React.createElement("div", { className: "table-cell info-panels" },
                    React.createElement(InfoPanel_1["default"], { header: "Instructions", rows: instructions }),
                    React.createElement(Legend_1["default"], null)),
                React.createElement("div", { className: "table-cell map" }, dungeon.gameStatus === dungeon_1.GameStatus.in_progress ?
                    React.createElement(Dungeon_1["default"], { tileMap: this.state.dungeon.tileMap, player: this.state.dungeon.player })
                    : dungeon.gameStatus === dungeon_1.GameStatus.won ?
                        React.createElement("div", { id: "won", className: "gameResult", onClick: this.reset })
                        : dungeon.gameStatus == dungeon_1.GameStatus.lost ?
                            React.createElement("div", { id: "lost", className: "gameResult", onClick: this.reset }) : ""),
                React.createElement("div", { className: "table-cell info-panels" },
                    React.createElement(UserInfo_1["default"], { player: dungeon.player, dungeonLevel: dungeon.level }),
                    React.createElement(OpponentInfo_1["default"], { hp: dungeon.currentOpponentHp, player: dungeon.player })))));
    };
    return DungeonGame;
}(React.Component));
exports["default"] = DungeonGame;
ReactDOM.render(React.createElement(DungeonGame, null), document.getElementById("dungeonGame"));
