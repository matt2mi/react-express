import * as React from 'react';
import './App.css';
import {Route, Switch} from 'react-router';
import Login from './components/Login';
import WaitingPlayers from './components/WaitingPlayers';

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <Switch>
                    <Route path="/" exact component={Login}/>
                    <Route path="/waiting" component={WaitingPlayers}/>
                </Switch>
            </div>
        );
    }
}

export default App;
