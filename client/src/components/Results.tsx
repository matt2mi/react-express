import * as React from 'react';

interface Result {
    id: number;
    answer: {
        lieValue: string;
        liePseudo: string;
    };
    playerPseudos: string[];
}

interface Score {
    id: number;
    pseudo: string;
    value: number;
}

interface Props {
}

interface State {
    readonly results: Result[];
    readonly scores: Score[];
}

export default class Results extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            results: [],
            scores: []
        }
    }

    componentWillMount() {
        fetch('/api/results')
            .then(results => {
                return results.json();
            })
            .then((results: any[]) => {
                console.log('results', results);
                const trueResults: Result[] = results.map((res: any, id: number): Result => {
                    return {
                        id,
                        playerPseudos: res.pseudos,
                        answer: {
                            lieValue: res.answer.lieValue,
                            liePseudo: res.answer.liePseudo
                        }
                    };
                });
                return this.setState({results: trueResults});
            })
            .catch(e => {
                console.error(e);
                return null;
            });

        fetch('/api/scores')
            .then(scores => {
                return scores.json();
            })
            .then((scores: any[]) => {
                console.log('scores', scores);
                const trueScores: Score[] = scores.map((score: any, id: number): Score => {
                    return {
                        id,
                        pseudo: score.pseudo,
                        value: score.value
                    };
                });
                return this.setState({scores: trueScores});
            })
            .catch(e => {
                console.error(e);
                return null;
            });
    }

    render() {
        return (
            <div>
                <div className="row">Results page !</div>
                <div className="row">
                    {this.state.results.map(res => (
                        <div>
                            <div className="col red-border" key={res.id}>
                                {res.playerPseudos[0] + ' a choisi ' + res.answer.lieValue + ' (mito de ' + res.answer.liePseudo + ')'}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">Scores !</div>
                <div className="row">
                    {this.state.scores.map(score => (
                        <div>
                            <div className="col-1 red-border" key={score.id}>
                                {score.pseudo}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    {this.state.scores.map(score => (
                        <div>
                            <div className="col-1 red-border" key={score.id}>
                                {score.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}