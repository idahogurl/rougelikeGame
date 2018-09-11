import * as React from 'react';
import InfoPanel from './InfoPanel';

export default function OpponentInfo(props) {
    const { player: { weapon, damageTaken }, hp} = props;
    const info = [];
    info.push({
        label: "Damage Dealt",
        val: weapon.damage === -1 ? "Not Started" : weapon.damage
    });
    info.push({
        label: "Damage Taken",
        val: damageTaken === -1 ? "Not Started" : damageTaken
    });
    info.push({
        label: "Monster Health",
        val: hp === -1 ? "Not Started" : hp < 0 ? 0 : hp
    });
    return (
        <InfoPanel header="Battle" info={info} />
    );
} 