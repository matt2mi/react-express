import * as React from 'react';

interface Result {
    answer: {
        lieValue: string;
        liePseudo: string;
    };
    playerPseudos: string[];
}

interface Score {
    pseudo: string;
    scoreValue: number;
}

interface Props {
}

interface State {
    results: Result[];
    scores: Score[];
}

export default class Results extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
        this.getResults();
        this.getScores();
    }

    private getResults() {
        fetch('/api/results')
            .then(results => {
                return results.json();
            })
            .then((results: any[]) => {
                console.log('results', results);
                const trueResults: Result[] = results.map((res: any): Result => {
                    return {
                        playerPseudos: res.pseudos,
                        answer: {
                            lieValue: res.answer.lieValue,
                            liePseudo: res.answer.liePseudo
                        }
                    };
                });
                this.setState({results: trueResults});
            })
            .catch(e => {
                console.error(e);
            });
    }

    private getScores() {
        fetch('/api/scores')
            .then(scores => {
                return scores.json();
            })
            .then((scores: any[]) => {
                console.log('scores', scores);
                const trueScores: Score[] = scores.map((score: any): Score => {
                    return {
                        pseudo: score.pseudo,
                        scoreValue: score.scoreValue
                    };
                });
                this.setState({scores: trueScores});
            })
            .catch(e => {
                console.error(e);
            });
    }

    render() {
        return (
            <div>Results page !</div>
        );
    }
}