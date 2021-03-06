import * as React from 'react';
import {getSocket} from '../helpers/io-api';
import {Redirect} from 'react-router';
import Socket = SocketIOClient.Socket;

interface Player {
    id: number;
    pseudo: string;
}

interface Props {
}

interface State {
    readonly players: Player[];
    readonly goToPlay: boolean;
    readonly nbMaxPlayers: number;
}

class WaitingPlayers extends React.Component<Props, State> {
    socket: Socket;

    onUpdatePlayers(players: Player[]): void {
        this.setState({players});
    }

    enoughPlayers(players: Player[]): void {
        this.setState({players, goToPlay: true});
    }

    constructor(props: Props) {
        super(props);
        this.onUpdatePlayers = this.onUpdatePlayers.bind(this);
        this.enoughPlayers = this.enoughPlayers.bind(this);

        this.socket = getSocket();
        this.state = {players: [], goToPlay: false, nbMaxPlayers: 0};
        this.socket.on('updatePlayers', this.onUpdatePlayers);
        this.socket.on('players-list-full', this.enoughPlayers);
    }

    componentWillMount() {
        fetch('/api/players')
            .then(result => {
                return result.json();
            })
            .then((players: Player[]) => {
                const truePlayers: Player[] = players.map((res: any) => {
                    return {id: res.id, pseudo: res.pseudo};
                });
                this.onUpdatePlayers(truePlayers);
            })
            .catch(e => {
                console.error(e);
            });

        fetch('/api/nbMaxPlayers')
            .then(result => {
                return result.json();
            })
            .then((nbMaxPlayers: number) => {
                this.setState({nbMaxPlayers});
            })
            .catch(e => {
                console.error(e);
            });
    }

    render() {
        if (this.state.goToPlay) {
            return (<Redirect to="/playing"/>);
        } else {
            return (
                <div>
                    <div className="row">Waiting other players...</div>
                    <div className="row">
                        {this.state.players.length + '/' + this.state.nbMaxPlayers} players
                    </div>
                    {this.state.players.map(player => {
                        return (<div className="row" key={player.id}>{player.pseudo}</div>);
                    })}
                </div>
            );
        }
    }
}

export default WaitingPlayers;