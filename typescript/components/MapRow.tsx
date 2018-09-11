import * as React from 'react';
import MapCell from './MapCell';

export default function MapRow(props) {
    const { cells, rowNumber } = props;
    const mapCells = cells.map((cell, idx) => {
        if (cell.className == "stairs") console.log("Stairs: " + rowNumber + "," + idx);
        return <MapCell key={rowNumber + "_" + idx} tile={cell} />;
    });
    return (
        <div className="board-row">
            {mapCells}
        </div>
    );
}