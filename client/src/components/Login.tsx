import * as React from 'react';
import {SyntheticEvent} from 'react';
import {subscribeToApp} from '../helpers/io-api';
import MyButton from './MyLinkButton';
import {History} from 'history';
import {Store} from '../redux/Store';

interface Props {
}

interface State {
    readonly pseudo: string;
    readonly connected: boolean;
}

export default class Login extends React.Component<Props, State> {

    changeValue(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            pseudo: event.currentTarget.value
        });
    }

    login(event: SyntheticEvent<HTMLButtonElement>, history: History) {
        console.log('pseudo', this.state.pseudo);
        event.preventDefault();
        subscribeToApp(
            (error: string) => {
                if (error.length > 0) {
                    console.error(error);
                } else {
                    Store.dispatch({type: 'NEW_PSEUDO', payload: this.state.pseudo});
                    history.push('/waiting');
                }
            },
            this.state.pseudo
        );
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            pseudo: '',
            connected: false,
        };

        this.login = this.login.bind(this);
        this.changeValue = this.changeValue.bind(this);
    }

    render() {
        return (
            <div className="row mt-3 justify-content-center">
                <div className="card">
                    <div className="card-header">
                        Login
                    </div>
                    <div className="card-block p-3">
                        <form>
                            <div className="form-group">
                                <label>Pseudo</label>
                                <input type="text" className="form-control" onChange={this.changeValue}/>
                            </div>
                            <MyButton cb={this.login} type={'submit'}>Login</MyButton>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}