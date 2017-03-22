"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var common_1 = require("./common");
var WeaponFactory = (function () {
    function WeaponFactory() {
    }
    WeaponFactory.get = function (level) {
        var weapons = {
            3: new Weapon("2d4", "Mace", 3),
            4: new Weapon("3d4", "Long sword", 4),
            1: new Weapon("1d6", "Dagger", 1),
            5: new Weapon("4d4", "Two handed sword", 5),
            2: new Weapon("2d3", "Spear", 2)
        };
        return weapons[level];
    };
    return WeaponFactory;
}());
exports.WeaponFactory = WeaponFactory;
var MonsterFactory = (function () {
    function MonsterFactory() {
        this.monsters = {
            1: [
                new Monster("Bat", 1, 1, "1d8", "1d2"),
                new Monster("Emu", 2, 1, "1d8", "1d2"),
                new Monster("Hobgoblin", 3, 1, "1d8", "1d8"),
                new Monster("Orc", 5, 1, "1d8", "1d8"),
            ],
            2: [
                new Monster("Rattlesnake", 9, 2, "2d8", "1d6"),
                new Monster("Snake", 1, 2, "1d8", "1d3"),
                new Monster("Zombie", 6, 2, "2d8", "1d8")
            ],
            3: new Monster("Quagga", 32, 3, "3d8", "1d2/1d2/1d4"),
            4: [
                new Monster("Centaur", 25, 4, "4d8", "1d2/1d5/1d5"),
                new Monster("Yeti", 50, 4, "4d8", "1d6/1d6")
            ],
            5: new Monster("Wraith", 55, 5, "5d8", "1d6"),
            6: new Monster("Troll", 120, 6, "6d8", "1d8/1d8/2d6"),
            7: [
                new Monster("Kestral", 1, 7, "1d8", "1d4"),
                new Monster("Ur-vile", 190, 7, "7d8", "1d3/1d3/1d3/4d6"),
                new Monster("Xeroc", 100, 7, "7d8", "3d4")
            ],
            8: [
                new Monster("Medusa", 200, 8, "8d8", "3d4/3d4/2d5"),
                new Monster("Phantom", 120, 8, "8d8", "4d4"),
                new Monster("Vampire", 350, 8, "8d8", "1d10")
            ],
            10: [
                new Monster("Dragon", 6800, 10, "10d8", "1d8/1d8/3d10"),
                new Monster("Leprechaun", 10, 3, "3d8", "1d2")
            ],
            15: new Monster("Jabberwock", 3000, 15, "15d8", "2d12/2d4"),
            20: new Monster("Griffin", 2000, 20, "13d8", "4d3/3d5/4d3")
        };
    }
    //get a monster at the specified index and specified level
    MonsterFactory.prototype.get = function (level, index) {
        var monster;
        if (Array.isArray(this.monsters[level])) {
            monster = this.monsters[level][index];
        }
        else {
            monster = this.monsters[level];
        }
        monster.calcHp();
        return monster;
    };
    MonsterFactory.prototype.random = function (level) {
        var selectedMonsters = [];
        //get the monsters in levels 5 less than or equal to the current dungeon level
        for (var monster_1 in this.monsters) {
            var key = parseInt(monster_1);
            if (key >= level - 5) {
                if (Array.isArray(this.monsters[level])) {
                    this.monsters[level].forEach(function (m) {
                        selectedMonsters.push(m);
                    });
                }
                else {
                    selectedMonsters.push(this.monsters[level]);
                }
            }
        }
        //return a random monster from the list
        var monster = selectedMonsters[common_1.Random.next(0, selectedMonsters.length - 1)];
        monster.calcHp();
        return monster;
    };
    return MonsterFactory;
}());
exports.MonsterFactory = MonsterFactory;
var Entity = (function () {
    function Entity(name) {
        this.name = name;
        this.show = false;
    }
    return Entity;
}());
exports.Entity = Entity;
var Creature = (function (_super) {
    __extends(Creature, _super);
    function Creature(name, xp, level) {
        var _this = _super.call(this, name) || this;
        _this.xp = xp;
        _this.level = level;
        return _this;
    }
    return Creature;
}(Entity));
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(name, xp, level, hpRoll, damageRoll) {
        var _this = _super.call(this, name, xp, level) || this;
        _this.hpRoll = hpRoll;
        _this.damageRoll = damageRoll;
        _this.className = "monster";
        return _this;
    }
    Monster.prototype.calcHp = function () {
        this.hp = Dice.roll(this.hpRoll);
        this.tooltip = this.name + "\nHP: " + this.hp + "\nDamage: " + this.damageRoll;
    };
    Monster.prototype.interact = function (player) {
        return player.attack(this);
    };
    return Monster;
}(Creature));
exports.Monster = Monster;
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, "You", 0, 1) || this;
        _this.weapon = new Weapon("1d2", "Stick", 1);
        _this.className = "player";
        _this.hp = 12;
        _this.experienceLevels = [
            0, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10000, 20000, 40000, 80000, 160000, 320000, 640000,
            1280000, 2560000, 5120000, 10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000
        ];
        _this.damageTaken = -1;
        _this.tooltip = _this.name;
        return _this;
    }
    Player.prototype.addHealth = function (increase) {
        this.hp += increase;
    };
    Player.prototype.getAttackBonus = function () {
        if (this.level < 5) {
            return 0;
        }
        else if (this.level < 10) {
            return 1;
        }
        else if (this.level < 15) {
            return 2;
        }
        else if (this.level < 20) {
            return 3;
        }
        return 4;
    };
    Player.prototype.attack = function (opponent) {
        //roll the dice
        this.weapon.damage = Dice.roll(this.weapon.damageRoll) + this.getAttackBonus();
        opponent.hp -= this.weapon.damage;
        opponent.damage = Dice.roll(opponent.damageRoll);
        this.damageTaken = opponent.damage;
        this.hp -= opponent.damage;
        if (this.hp <= 0) {
            this.hp = 0; //do not want to display a negative number
            return false;
        }
        if (opponent.hp <= 0) {
            opponent.hp = 0; //do not want to display a negative number
            this.gainXp(opponent.xp);
            return true;
        }
        return false;
    };
    Player.prototype.gainXp = function (xp) {
        var _this = this;
        this.xp += xp;
        //increase level while level's xp is less than or equal to the player's xp
        var level = 0;
        this.experienceLevels.forEach(function (l) {
            if (l <= _this.xp) {
                level++;
            }
        });
        this.level = level;
    };
    Player.prototype.interact = function () {
        return true;
    };
    return Player;
}(Creature));
exports.Player = Player;
var HealthPotion = (function (_super) {
    __extends(HealthPotion, _super);
    function HealthPotion() {
        var _this = _super.call(this, "Health Potion") || this;
        _this.hpRoll = "8d4";
        _this.className = "health";
        _this.hp = Dice.roll(_this.hpRoll);
        _this.tooltip = _this.name + "\nHP: " + _this.hp;
        return _this;
    }
    HealthPotion.prototype.interact = function (player) {
        player.hp += this.hp;
        return true;
    };
    return HealthPotion;
}(Entity));
exports.HealthPotion = HealthPotion;
var Weapon = (function (_super) {
    __extends(Weapon, _super);
    function Weapon(damageRoll, name, level) {
        var _this = _super.call(this, name) || this;
        _this.damageRoll = damageRoll;
        _this.level = level;
        _this.className = "weapon";
        _this.damage = -1;
        _this.tooltip = _this.name + "\nDamage: " + _this.damageRoll;
        return _this;
    }
    Weapon.prototype.interact = function (player) {
        this.damage = player.weapon.damage; //keep damage from previous battle
        player.weapon = this;
        return true;
    };
    return Weapon;
}(Entity));
exports.Weapon = Weapon;
var Stairs = (function (_super) {
    __extends(Stairs, _super);
    function Stairs() {
        var _this = _super.call(this, null) || this;
        _this.className = "stairs";
        _this.tooltip = "Stairs";
        return _this;
    }
    Stairs.prototype.interact = function () {
        return false;
    };
    return Stairs;
}(Entity));
exports.Stairs = Stairs;
var Empty = (function (_super) {
    __extends(Empty, _super);
    function Empty() {
        var _this = _super.call(this, null) || this;
        _this.className = "empty";
        return _this;
    }
    Empty.prototype.interact = function () {
        return false;
    };
    return Empty;
}(Entity));
exports.Empty = Empty;
var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor() {
        var _this = _super.call(this, null) || this;
        _this.className = "floor";
        return _this;
    }
    Floor.prototype.interact = function () {
        return true;
    };
    return Floor;
}(Entity));
exports.Floor = Floor;
var Dice = (function () {
    function Dice() {
    }
    Dice.roll = function (value) {
        var total = 0;
        //some monsters have damage that uses multiple dice in addition to multiple rolls
        var rolls = value.split("/");
        rolls.forEach(function (r) {
            var temp = value.split("d");
            var timesRoll = parseInt(temp[0]);
            var dieSides = parseInt(temp[1]);
            for (var i = 0; i < timesRoll; i++) {
                total += common_1.Random.next(1, dieSides);
            }
        });
        return total;
    };
    return Dice;
}());
