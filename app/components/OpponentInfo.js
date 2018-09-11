"use strict";
exports.__esModule = true;
var React = require("react");
var InfoPanel_1 = require("./InfoPanel");
function OpponentInfo(props) {
    var _a = props.player, weapon = _a.weapon, damageTaken = _a.damageTaken, hp = props.hp;
    var info = [];
    info.push({
        label: "Damage Dealt",
        val: weapon.damage === -1 ? "Not Started" : weapon.damage
    });
    info.push({
        label: "Damage Taken",
        val: damageTaken === -1 ? "Not Started" : damageTaken
    });
    info.push({
        label: "Monster Health",
        val: hp === -1 ? "Not Started" : hp < 0 ? 0 : hp
    });
    return (React.createElement(InfoPanel_1["default"], { header: "Battle", info: info }));
}
exports["default"] = OpponentInfo;
