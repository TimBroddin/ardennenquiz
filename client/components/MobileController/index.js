import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Players, Controller, Pushes} from '../../../lib/collections';
import {Button, Icon} from 'antd';
import moment from 'moment';

import RoundQuestion from './RoundQuestion';

class MobileController extends Component {
  increment() {

  }

  decrement() {

  }


  render() {
    const {controller, players, pushes} = this.props;

    return <div className="mobileController">


      <RoundQuestion controller={controller} />

      <div className="pushesList">
        <table>
          <tbody>
      {pushes.map((push) => {
        return <tr key={`player-${push._id}`}>
            <td>{push.name}</td>
            <td>{new moment(push.date).format('hh:mm:ss')}</td>
        </tr>

      })}
      </tbody>
      </table>

      </div>

      <div className="playerList">
        <table>
          <tbody>
      {players.map((player) => {
        return <tr key={`player-${player._id}`}>
            <td>{player.name}</td>
            <td>{player.score}</td>
            <td><Button type="primary" icon="plus" onClick={() => Meteor.call('player.increment', player._id)}></Button>{" "}
              <Button type="primary" icon="minus" onClick={() => Meteor.call('player.decrement', player._id)}></Button>
            </td>
        </tr>

      })}
    </tbody>
      </table>
      </div>

    </div>


  }

}

export default createContainer(() => {
  const controllerHandle = Meteor.subscribe('controller');
  const playersHandle = Meteor.subscribe('players.list')
  const pushesHandle = Meteor.subscribe('pushes.list');

  return {
    controller: Controller.findOne(),
    players: Players.find({}, { sort: { name: 1 }}).fetch(),
    pushes: Pushes.find({}, { sort: { date: 1 }}).fetch(),
    loading: !controllerHandle.ready() || !playersHandle.ready() || !pushesHandle.ready()

  }
}, MobileController);
