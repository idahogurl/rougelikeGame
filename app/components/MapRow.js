"use strict";
exports.__esModule = true;
var React = require("react");
var MapCell_1 = require("./MapCell");
function MapRow(props) {
    var cells = props.cells, rowNumber = props.rowNumber;
    var mapCells = cells.map(function (cell, idx) {
        if (cell.className == "stairs")
            console.log("Stairs: " + rowNumber + "," + idx);
        return React.createElement(MapCell_1["default"], { key: rowNumber + "_" + idx, tile: cell });
    });
    return (React.createElement("div", { className: "board-row" }, mapCells));
}
exports["default"] = MapRow;
