import * as React from 'react';
import {getCurrentPseudo, getSocket} from '../helpers/io-api';
import Socket = SocketIOClient.Socket;
import {SyntheticEvent} from 'react';
import MyButton from './MyLinkButton';
import {History} from 'history';

interface Lie {
    key: string;
    value: string;
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
}

export default class Playing extends React.Component<Props, State> {
    socket: Socket;

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            lieAnswered: event.currentTarget.value
        });
    }

    sendLie(event: SyntheticEvent<HTMLButtonElement>) {
        this.setState({lieSent: true});
        event.preventDefault();
        this.socket.on('loadLies', (lies: Lie[]) => this.loadLies(lies));
        this.socket.emit('lieAnswered', {
            lieValue: this.state.lieAnswered,
            pseudo: getCurrentPseudo()
        });
    }

    loadLies(lies: Lie[]) {
        this.setState({displayLies: true});
        this.setState({lies});
    }

    chooseLie(e: SyntheticEvent<HTMLButtonElement>, history: History) {
        e.preventDefault();
        history.push('/results')
    }

    constructor(props: Props) {
        super(props);

        this.changeValue = this.changeValue.bind(this);
        this.sendLie = this.sendLie.bind(this);
        this.loadLies = this.loadLies.bind(this);
        this.chooseLie = this.chooseLie.bind(this);

        this.state = {
            question: {text: '', answers: [''], lies: ['']},
            lieAnswered: '',
            lies: [{
                key: 'key1',
                value: 'value1'
            }, {
                key: 'key2',
                value: 'value2'
            }],
            lieSent: false,
            displayLies: false
        };

        this.socket = getSocket();
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
                                <form>
                                    <div className="form-group">
                                        <label>Mensonge</label>
                                        <input type="text" className="form-control" onChange={this.changeValue}/>
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={(e) => this.sendLie(e)}>
                                        Envoyer
                                    </button>
                                </form>
                            </div>
                            : null
                    }
                    {
                        this.state.displayLies ?
                            <div>
                                {this.state.lies.map(lie => (
                                    <div className="col" key={lie.key}>
                                        <MyButton cb={this.chooseLie} type={'button'}>{lie.value}</MyButton>
                                    </div>))}
                            </div>
                            : null
                    }
                </div>
            </div>
        );
    }
}