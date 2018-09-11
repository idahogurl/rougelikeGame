import InfoPanel from "./InfoPanel";
import * as React from "react";

export default function UserInfo(props) {
    const { dungeonLevel, player, weapon } = props
    const info = [];
    info.push({ label: "Dungeon", val: dungeonLevel });
    info.push({ label: "XP Level", val: player.level });
    info.push({ label: "Health", val: player.hp < 0 ? 0 : player.hp });
    info.push({ label: "Weapon", val: player.weapon.name + " (" + player.weapon.damageRoll + ")" });

    return (
        <InfoPanel header="Player" info={info} />
    );
}