import React from 'react';
import {Players} from '../../../lib/collections';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';

const PlayerStats = ({player, loading}) => {
  if(loading) return <div />

  return <div className="stats">
    <div className="name">{player.name}</div>
    <div className="score">{player.score} punten</div>
  </div>
}


export default createContainer(({id}) => {
  const subHandle = Meteor.subscribe('players.byId', id);
  return {
    loading: !subHandle.ready(),
    player: Players.findOne({ _id: id })
  }

}, PlayerStats);
