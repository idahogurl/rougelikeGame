/*
//http://pcg.wikidot.com/
//http://donjon.bin.sh/code/dungeon/
//http://gamedev.stackexchange.com/questions/2663/what-are-some-ideal-algorithms-for-rogue-like-2d-dungeon-generation
//http://www.roguebasin.com/index.php?title=Dungeon-Building_Algorithm
//http://bigbadwofl.me/random-dungeon-generator/


//http://ondras.github.io/rot.js/manual/#map/dungeon
//https://www.npmjs.com/package/dungeon-factory

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
Name	Damage
Bat	1d2
Centaur	1d2/1d5/1d5
Dragon	1d8/1d8/3d10
Emu	1d2
Griffin	4d3/3d5
Hobgoblin	1d8
Jabberwock	2d12/2d4
Kestrel	1d4
Leprechaun	1d1
Medusa	3d4/3d4/2d5
Orc	1d8
Phantom	4d4
Quagga	1d5/1d5
Rattlesnake	1d6
Snake	1d3
Troll	1d8/1d8/2d6
Ur-vile	1d9/1d9/2d9
Vampire	1d10
Wraith	1d6
Xeroc	4d4
Yeti	1d6/1d6
Zombie	1d8
    
    
    
    
start with dagger
weapon	total damage
Crossbow 	16
Dart 	15.0
ElvenDagger 	12.5
ElvenShort+ElvenBroad 	12.5
OrcishDagger 	10
Dagger 	11.25
ElvenDagger+ElvenBroad 	11
ElvenShortx2 	11
Katana x2 	11
Crossbow 	10.5
DwarfShortx2 	10
Dart 	9.75
ElvenDagger+LongSword 	9.5
LongSword x2 	9
Dagger 	7
Crossbow 	6
Broadsword 	6
Dart 	5.5
Longsword 	5.5
Halberd 	5.5
Spetum 	4.5
Dagger(wielded) 	4.5
Dagger 	3.75
*/
/*
Potions
Heals 8d4
*/
/*
You start at level 1 and can reach a maximum level of 30.
1	0	0	0
2	20	40	20
3	40	80	50
4	80	160	100
5	160	320	200
6	320	640	400
7	640	1280	800
8	1280	2560	1600
9	2560	5120	3200
10	5120	10000	6400
11	10000	20000	10000
12	20000	40000	14000
13	40000	80000	19000
14	80000	150000	25000
15	160000	250000	32000
16	320000	300000	41000
17	640000	350000	52000
18	1280000	400000	65000
19	2560000	450000	80000
20	5120000	500000	97000
21	10000000	550000	117000
22	20000000	600000	140000
23	30000000	650000	166000
24	40000000	700000	195000
25	50000000	750000	227000
26	60000000	800000	263000
27	70000000	850000	303000
28	80000000	900000	347000
29	90000000	950000	395000
30	100000000	1000000
*/
var Character = (function () {
    function Character(hp, weapon, xp) {
        this.hp = hp;
        this.weapon = weapon;
        this.xp = xp;
    }
    Character.prototype.attack = function (opponent) {
        opponent.hp -= this.weapon.damage;
        this.hp -= opponent.weapon.damage;
    };
    Character.prototype.move = function () {
        //keycodes are:
        // left = 37
        // up = 38
        // right = 39
        // down = 40
    };
    return Character;
}());
var HealthPotion = (function () {
    function HealthPotion() {
    }
    return HealthPotion;
}());
var Weapon = (function () {
    function Weapon(name, damage) {
        this.name = name;
        this.damage = damage;
    }
    return Weapon;
}());
var DungeonGame = (function (_super) {
    __extends(DungeonGame, _super);
    function DungeonGame() {
        var _this = _super.call(this) || this;
        _this.player = new Character(100, new Weapon("hands", 4), 0);
        _this.createDungeon();
        return _this;
    }
    DungeonGame.prototype.engage = function (e) {
        //who are you engaging?
        //player.attack(dungeon.rooms[0].enemies[0]);
    };
    DungeonGame.prototype.createDungeon = function () {
        // Add the up and down staircases at random points in map
        // Finally, sprinkle some monsters and items liberally over dungeo
        this.dungeon = new dungeon_1.DungeonMapGenerator();
    };
    DungeonGame.prototype.render = function () {
        ;
        return (React.createElement("div", null,
            React.createElement(Dungeon, { mapArea: this.dungeon.mapData })));
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
        var status = this.props.val === dungeon_1.MapStructure.floor ? " floor" :
            this.props.val === dungeon_1.MapStructure.wall ? " wall" :
                this.props.val === dungeon_1.MapStructure.door ? " door" :
                    this.props.val === dungeon_1.MapStructure.corridor ? " corridor" :
                        "";
        return React.createElement("div", { className: "board-cell" + status }, this.props.cellInfo);
    };
    MapCell.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props.val != nextProps.val;
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
            return React.createElement(MapCell, { key: _this.props.rowNumber + "_" + j, val: cell, cellInfo: j + "," + _this.props.rowNumber });
        });
        return (React.createElement("div", { className: "board-row" }, cells));
    };
    return MapRow;
}(react_1.Component));
ReactDOM.render(React.createElement(DungeonGame, null), document.getElementById("map"));
