import * as React from 'react';
import {SyntheticEvent} from 'react';
import {getCurrentPseudo, getSocket} from '../helpers/io-api';
import {Redirect} from 'react-router';
import {Store} from "../redux/Store";
import Socket = SocketIOClient.Socket;

interface Lie {
    pseudo: string;
    lieValue: string;
}

interface Question {
    text: string;
    answers: string[];
    lies: string[];
}

interface Props {
}

interface State {
    readonly question: Question;
    readonly lieAnswered: string;
    readonly lies: Lie[];
    readonly lieSent: boolean;
    readonly displayLies: boolean;
    readonly goToResults: boolean;
    readonly currentPseudo?: string;
}

export default class Playing extends React.Component<Props, State> {
    socket: Socket;

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            lieAnswered: event.currentTarget.value
        });
    }

    constructor(props: Props) {
        super(props);

        this.changeValue = this.changeValue.bind(this);
        this.sendLie = this.sendLie.bind(this);
        this.loadLies = this.loadLies.bind(this);
        this.chooseLie = this.chooseLie.bind(this);

        this.state = {
            question: {text: '', answers: [], lies: []},
            lieAnswered: '',
            lies: [],
            lieSent: false,
            displayLies: false,
            goToResults: false,
            currentPseudo: Store.getState().pseudo
        };

        this.socket = getSocket();
    }

    loadLies(lies: Lie[]) {
        console.log('loadlies', lies);
        this.setState({lies, displayLies: true});
    }

    sendLie() {
        this.setState({lieSent: true});
        this.socket.on('loadLies', (lies: Lie[]) => this.loadLies(lies));
        this.socket.emit('lieAnswered', {
            lieValue: this.state.lieAnswered,
            pseudo: getCurrentPseudo()
        });
    }

    chooseLie(e: SyntheticEvent<HTMLButtonElement>, lie: Lie) {
        this.setState({displayLies: false});
        e.preventDefault();
        console.log('lie', lie);
        this.socket.on('goToResults', () => {
            this.setState({goToResults: true});
        });
        this.socket.emit('lieChoosen', {lie: lie, pseudo: getCurrentPseudo()});
    }

    componentWillMount() {
        fetch('/api/question')
            .then(result => {
                return result.json();
            })
            .then((question: Question) => {
                const trueQuestion = {text: question.text, answers: question.answers, lies: question.lies};
                this.setState({question: trueQuestion});
            })
            .catch(e => {
                console.error(e);
            });
    }

    render() {
        if (this.state.goToResults) {
            return (<Redirect to="/results"/>);
        }
        return (
            <div className="card">
                <div className="row">
                    <div className="col">{this.state.question.text}</div>
                </div>
                <br/>
                <div className="row">
                    {
                        !this.state.lieSent ?
                            <div className="col">
                                <form onSubmit={this.sendLie}>
                                    <div className="form-group">
                                        <label>Mensonge</label>
                                        <input type="text" className="form-control" onChange={this.changeValue}/>
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Envoyer
                                    </button>
                                </form>
                            </div>
                            : null
                    }
                    {
                        this.state.displayLies ?
                            <div>
                                {this.state.lies.map(lie => {
                                    if (lie.pseudo !== this.state.currentPseudo) {
                                        return (<div className="col" key={lie.pseudo}>
                                            <button type="button" className="btn btn-primary"
                                                    onClick={(e) => this.chooseLie(e, lie)}>
                                                {lie.lieValue}
                                            </button>
                                        </div>);
                                    }
                                    return null;
                                })}
                            </div>
                            : null
                    }
                </div>
            </div>
        );
    }
}