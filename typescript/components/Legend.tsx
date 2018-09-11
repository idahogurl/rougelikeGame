import * as React from "react";
import InfoPanel from './InfoPanel';

export default function Legend() {
    const rows = (
        <div>
            <div className="table-row">
                <div className="table-cell">
                    <div className="legend-cell player"></div>
                </div>
                <div className="table-cell">
                    <label className="legend-label">You</label>
                </div>
            </div>
            <div className="table-row">
                <div className="table-cell"><div className="legend-cell monster"></div></div>
                <div className="table-cell"><label className="legend-label">Monster</label></div></div>
            <div className="table-row">
                <div className="table-cell"><div className="legend-cell weapon"></div>
                </div><div className="table-cell"><label className="legend-label">Weapon</label></div>
            </div>
            <div className="table-row">
                <div className="table-cell"><div className="legend-cell health"></div></div>
                <div className="table-cell"><label className="legend-label">Health Potion</label></div></div>
            <div className="table-row">
                <div className="table-cell">
                    <div className="legend-cell boss"></div></div>
                <div className="table-cell"><label className="legend-label">Boss</label></div></div>
            <div className="table-row">
                <div className="table-cell"><div className="legend-cell stairs"></div></div>
                <div className="table-cell"><label className="legend-label">Stairs</label></div></div>
        </div>);

    return <InfoPanel header="Legend" rows={rows} />;
}