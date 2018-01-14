import * as React from 'react';
import './App.css';
import {Route, Switch} from 'react-router';
import Login from './components/Login';
import WaitingPlayers from './components/WaitingPlayers';
import Playing from './components/Playing';
import Results from './components/Results';

class App extends React.Component {
    constructor(props: any) {
        super(props);

    }

    render() {
        return (
            <Switch>
                <div className="container">
                    <Route path="/" exact component={Login}/>
                    <Route path="/waiting" component={WaitingPlayers}/>
                    <Route path="/playing" component={Playing}/>
                    <Route path="/results" component={Results}/>
                </div>
            </Switch>
        );
    }
}

export default App;
