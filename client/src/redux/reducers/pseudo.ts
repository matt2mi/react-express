// on part de 0
import {Action, State} from "../Store";

const initialState = {pseudo: ''};

export const PseudoReducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        // selon l'action …
        case "NEW_PSEUDO":
            // … on retourne un nouvel état incrémenté
            return {pseudo: action.payload};
        default:
            // ou l'état actuel, si l'on n'y touche pas
            return state;
    }
};