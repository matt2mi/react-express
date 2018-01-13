import * as React from 'react';
import {getSocket} from "../helpers/io-api";
import Socket = SocketIOClient.Socket;
import {SyntheticEvent} from 'react';

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
}

export default class Playing extends React.Component<Props, State> {
    socket: Socket;

    changeValue = (event: React.FormEvent<HTMLInputElement>) => {
        console.log(event.currentTarget.value);
        this.setState({
            lieAnswered: event.currentTarget.value
        });
    }

    sendLie(event: SyntheticEvent<HTMLButtonElement>) {
        event.preventDefault();
        // this.socket.on('displayLies', (lies: string[]) => this.displayLies(lies));
        // this.socket.emit('lieAnswered', this.state.lieAnswered);
        console.log('lie', this.state.lieAnswered);
    }

    // displayLies(lies: string[]) {}

    constructor(props: Props) {
        super(props);

        this.changeValue = this.changeValue.bind(this);
        this.sendLie = this.sendLie.bind(this);
        // this.displayLies = this.displayLies.bind(this);

        this.state = {
            question: {text: '', answers: [''], lies: ['']},
            lieAnswered: ''
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
        return (<div className="card">
                <div className="row justify-content-center">
                    <div className="col">Playing...</div>
                </div>
                <div className="row">
                    <div className="col">{this.state.question.text}</div>
                </div>
                <div className="row">
                    <div className="col">
                        <form>
                            <div className="form-group">
                                <label>Mensonge</label>
                                <input type="text" className="form-control" onChange={this.changeValue}/>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={(e) => this.sendLie(e)}>Envoyer</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}