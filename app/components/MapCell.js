"use strict";
exports.__esModule = true;
var React = require("react");
function MapCell(props) {
    //is it a person, weapon, health item or enemy
    var _a = props.tile, tooltip = _a.tooltip, show = _a.show, className = _a.className;
    if (tooltip === null) {
        return React.createElement("div", { className: "board-cell " + className });
    }
    return React.createElement("div", { className: "board-cell " + (show ? className : "hidden"), title: tooltip });
}
exports["default"] = MapCell;
