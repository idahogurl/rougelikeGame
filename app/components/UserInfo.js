"use strict";
exports.__esModule = true;
var InfoPanel_1 = require("./InfoPanel");
var React = require("react");
function UserInfo(props) {
    var dungeonLevel = props.dungeonLevel, player = props.player, weapon = props.weapon;
    var info = [];
    info.push({ label: "Dungeon", val: dungeonLevel });
    info.push({ label: "XP Level", val: player.level });
    info.push({ label: "Health", val: player.hp < 0 ? 0 : player.hp });
    info.push({ label: "Weapon", val: player.weapon.name + " (" + player.weapon.damageRoll + ")" });
    return (React.createElement(InfoPanel_1["default"], { header: "Player", info: info }));
}
exports["default"] = UserInfo;
