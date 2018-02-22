import React, {Component} from 'react';
import {Players} from '../../../lib/collections';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';

const Ranking = ({loading, players}) => {
    if (loading)
        return <p>Bezig met laden ...</p>

    return <div className="ranking">
        <h1>De eindstand</h1>
        <ol>
            {players.map((player, k) => {
                return <li key={`rank-${player._id}`}>{k + 1}. {player.name}{" "}
                    - {player.score}{" "}
                    punten</li>
            })}
        </ol>
    </div>
}
export default createContainer(() => {
    const handle = Meteor.subscribe('players.list');

    return {
        loading: !handle.ready(),
        players: Players.find({}, {
            sort: {
                score: -1
            }
        }).fetch()
    }
}, Ranking)
