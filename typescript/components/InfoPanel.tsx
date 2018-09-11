import * as React from "react";

export default function InfoPanel(props) {
    let rows = props.rows;
    let i = 0;
    if (rows === undefined) {
        rows = props.info.map(c => {
            i++;
            return (
                <div className="table-row" key={i}>
                    <div className="table-cell"><label>{c.label}:</label></div>
                    <div className="table-cell">{c.val}</div>
                </div>);
        });
    }

    return (<div className="info-panel">
        <div className="table-row">
            <div className="scroll-top table-cell"></div>
            <div className="scroll-body table-cell">
                <div className="info">
                    <div className="info-header">{props.header}</div>
                    {rows}
                </div>
            </div>
            <div className="scroll-end table-cell"></div>
        </div>
    </div>);
}