import * as React from 'react';
import {getSocket} from '../helpers/io-api';
import Socket = SocketIOClient.Socket;

interface Player {
    id: number;
    pseudo: string;
}

interface Props {
}

interface State {
    readonly players: Player[];
}

export default class WaitingPlayers extends React.Component<Props, State> {
    socket: Socket;

    onUpdatePlayers(players: Player[]) {
        this.setState({players});
    }

    constructor(props: Props) {
        super(props);
        this.onUpdatePlayers = this.onUpdatePlayers.bind(this);

        this.socket = getSocket();
        this.state = {players: []};
        this.socket.on('updatePlayers', this.onUpdatePlayers);
    }

    componentWillMount() {
        fetch('/players')
            .then(result => {
                return result.json();
            })
            .then((players: Player[]) => {
                const truePlayers: Player[] = players.map((res: any) => {
                    return {id: res.id, pseudo: res.pseudo}
                });
                this.onUpdatePlayers(truePlayers);
            })
            .catch(e => {
                console.error(e);
            });
    }

    render() {
        return (
            <div>
                <div className="row">Waiting other players...</div>
                <div className="row">
                    {this.state.players.length}/8 players
                </div>
                {this.state.players.map(player => {
                    return (<div className="row" key={player.id}>{player.pseudo}</div>);
                })}
            </div>
        );
    }
}
