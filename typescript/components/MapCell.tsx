import * as React from 'react';

export default function MapCell(props) {
    //is it a person, weapon, health item or enemy
    const { tile: { tooltip, show, className } } = props;

    if (tooltip === null) {
        return <div className={"board-cell " + className}></div>
    }

    return <div className={"board-cell " + (show ? className : "hidden")}
        title={tooltip}></div>
}