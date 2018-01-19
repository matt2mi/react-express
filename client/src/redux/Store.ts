import {PseudoReducer} from './reducers/pseudo';

export interface Action {
    type: string;
    payload?: string;
}

export interface State {
    pseudo?: string;
}

const createStore = (reducer: (state: State, action: Action) => {}) => {
    let state: State = reducer({}, {type: '@@INIT'});
    // on crée un `Set` où l'on va stocker les listeners
    const subscribers = new Set();
    return {
        dispatch: (action: Action) => {
            state = reducer(state, action);
            // à chaque dispatch, on appelle les subscribers
            subscribers.forEach(func => func());
        },
        subscribe: (func: () => {}) => {
            // on ajoute `func` à la liste de subscribers
            subscribers.add(func);
            // et on retourne une fonction permettant d'unsubscribe
            return () => {
                subscribers.delete(func);
            };
        },
        getState: () => state
    };
};

/*const combineReducers = (reducers: any[]) => {
    const reducersKeys = Object.keys(reducers);
    return (state = {}, action: Action) => {
        return reducersKeys.reduce((acc, key) => {
            acc[key] = reducers[key](state[key], action);
            return acc;
        }, {});
    };
};*/

// const reducer = combineReducers([{PseudoReducer}]);

// export const store = createStore(reducer);
export const Store = createStore(PseudoReducer);