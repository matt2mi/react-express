import * as React from 'react';
import './App.css';
import {Route, Switch} from 'react-router';
import Login from './components/Login';
import WaitingPlayers from './components/WaitingPlayers';
import Playing from './components/Playing';

class App extends React.Component {
    render() {
        return (
            <Switch>
                <div className="container">
                    <Route path="/" exact component={Login}/>
                    <Route path="/waiting" component={WaitingPlayers}/>
                    <Route path="/playing" component={Playing}/>
                </div>
            </Switch>
        );
    }
}

export default App;
