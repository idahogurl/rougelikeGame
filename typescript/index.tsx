import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Map, GameStatus } from './dungeon';
import * as Entities from './entities';

import './sass/styles.scss';
import InfoPanel from './components/InfoPanel';
import Legend from './components/Legend';
import Dungeon from './components/Dungeon';
import UserInfo from './components/UserInfo';
import OpponentInfo from './components/OpponentInfo';

export default class DungeonGame extends React.Component<any, any> {
    dungeonMap: Map;

    constructor(props) {
        super(props);

        this.reset = this.reset.bind(this);
        this.reset(null);

        this.move = this.move.bind(this);
        this.state = { dungeon: this.dungeonMap };
    }
    reset(e) {
        this.dungeonMap = new Map();
        this.dungeonMap.generate();
        if (e !== null) this.setState({ dungeon: this.dungeonMap });
    }
    move(e) {
        let x = this.dungeonMap.player.location.x;
        let y = this.dungeonMap.player.location.y;

        let newX = x;
        let newY = y;

        switch (e.keyCode) {
            case 38:
                newY--;
                break;
            case 37:
                newX--;
                break;
            case 40:
                newY++;
                break;
            case 39:
                newX++;
                break;
        }

        let tile = this.dungeonMap.tileMap[newY][newX];
        let doMove = tile.interact(this.dungeonMap.player);

        if (tile instanceof Entities.Stairs) {
            this.dungeonMap.level++;

            let currentOpponentHp = this.dungeonMap.currentOpponentHp;
            //keep the previous battle information
            this.dungeonMap.generate();
            this.dungeonMap.currentOpponentHp = currentOpponentHp;
        }
        else if (this.dungeonMap.player.hp <= 0) //player died
        {
            this.dungeonMap.gameStatus = GameStatus.lost;
        }
        else if (tile instanceof Entities.Monster) {
            let monster = tile as Entities.Monster;
            this.dungeonMap.currentOpponentHp = monster.hp;

            if (doMove && monster.isBoss) //boss defeated
            {
                this.dungeonMap.gameStatus = GameStatus.won;
                doMove = false;
            }
        }

        if (doMove) {
            this.dungeonMap.tileMap[y][x] = new Entities.Floor();
            this.dungeonMap.tileMap[newY][newX] = this.dungeonMap.player;
            this.dungeonMap.player.location.x = newX;
            this.dungeonMap.player.location.y = newY;

            this.dungeonMap.hideVisibleArea();
            this.dungeonMap.setVisibleArea();
        }
        this.setState({ dungeon: this.dungeonMap });
    }
    componentWillMount() {
        window.addEventListener("keydown", this.move);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown");
    }
    render() {
        const instructions = (<ul>
            <li>Use arrow keys to move.</li>
            <li>To obtain an item or to attack a monster, move over the square.</li>
            <li>Hover over a square to see its properties.</li>
            <li>Defeat boss in level 20.</li>
        </ul>);

        const { dungeon } = this.state
        return (
            <div>
                <div className="table-row">
                    <div className="table-cell info-panels">
                        <InfoPanel header="Instructions" rows={instructions} />
                        <Legend />
                    </div>
                    <div className="table-cell map">

                        {dungeon.gameStatus === GameStatus.in_progress ?
                            <Dungeon tileMap={this.state.dungeon.tileMap} player={this.state.dungeon.player} />
                            : dungeon.gameStatus === GameStatus.won ?
                                <div id="won" className="gameResult" onClick={this.reset} />
                                : dungeon.gameStatus == GameStatus.lost ?
                                    <div id="lost" className="gameResult" onClick={this.reset}></div> : ""}

                    </div>
                    <div className="table-cell info-panels">
                        <UserInfo player={dungeon.player} dungeonLevel={dungeon.level} />
                        <OpponentInfo hp={dungeon.currentOpponentHp} player={dungeon.player} />
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<DungeonGame />, document.getElementById("dungeonGame"));