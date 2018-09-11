"use strict";
exports.__esModule = true;
var React = require("react");
var InfoPanel_1 = require("./InfoPanel");
function Legend() {
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
    return React.createElement(InfoPanel_1["default"], { header: "Legend", rows: rows });
}
exports["default"] = Legend;
