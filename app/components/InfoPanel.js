"use strict";
exports.__esModule = true;
var React = require("react");
function InfoPanel(props) {
    var rows = props.rows;
    var i = 0;
    if (rows === undefined) {
        rows = props.info.map(function (c) {
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
                    React.createElement("div", { className: "info-header" }, props.header),
                    rows)),
            React.createElement("div", { className: "scroll-end table-cell" }))));
}
exports["default"] = InfoPanel;
