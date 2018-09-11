"use strict";
exports.__esModule = true;
var React = require("react");
var MapRow_1 = require("./MapRow");
function Dungeon(props) {
    var rows = props.tileMap.map(function (c, idx) {
        return React.createElement(MapRow_1["default"], { key: idx, rowNumber: idx, cells: c });
    });
    return (React.createElement("div", null, rows));
}
exports["default"] = Dungeon;
