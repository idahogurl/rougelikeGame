import * as React from 'react';
import MapRow from './MapRow';

export default function Dungeon(props) {
    const rows = props.tileMap.map((c, idx) => {
        return <MapRow key={idx} rowNumber={idx} cells={c} />
    });
    return (
        <div>
            {rows}
        </div>
    );
}