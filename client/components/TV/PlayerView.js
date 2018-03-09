import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Players, Pushes } from "../../../lib/collections";
import FlipMove from "react-flip-move";

class Player extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.sayWelcome(nextProps.name);
    }
  }

  componentDidMount() {
    if (this.props.name) {
      this.sayWelcome(this.props.name);
    }
  }

  sayWelcome(name) {
    var msg = new SpeechSynthesisUtterance(`Hallo ${name}!`);
    msg.lang = "nl-BE";

    window.speechSynthesis.speak(msg);
  }

  render() {
    const {
      name,
      score,
      hasPushed,
      time,
      pushIndex,
      amount,
      correct
    } = this.props;

    let style = {
      //    maxWidth: `${ 100 / amount}%`
    };

    if (hasPushed) {
      let opacity = 1 - pushIndex / amount;
      if (correct) {
        style.backgroundColor = `rgba(0, 255, 0, ${opacity})`;
      } else {
        style.backgroundColor = `rgba(255, 0, 0, ${opacity})`;
      }
    }

    return (
      <div className="player" style={style}>
        <h1>{name}</h1>
        <h2>{score} punten</h2>
        {time ? <small>{time}s</small> : <small>&nbsp;</small>}
      </div>
    );
  }
}

const PlayerView = ({ loading, players, pushes, controller }) => {
  let content;
  if (loading) return <div />;

  let playerList = [];
  players.forEach(player => {
    let pushIndex = -1;
    let hasPushed = Pushes.findOne({ name: player.name }) ? true : false;
    let time = false;

    playerList.push(
      <Player
        key={`player-${player.name}`}
        controller={controller}
        amount={players.length}
        name={player.name}
        score={player.score}
        hasPushed={hasPushed}
        pushIndex={pushIndex}
        isCorrect={player.isCorrect}
      />
    );
  });

  return (
    <div className="players">
      <FlipMove>{playerList}</FlipMove>
    </div>
  );
};

export default createContainer(({ controller }) => {
  const playersHandle = Meteor.subscribe("players.list");
  const pushesHandle = Meteor.subscribe("pushes.list");
  const loading = !playersHandle.ready() || !pushesHandle.ready();

  return {
    players: Players.find(
      {},
      {
        sort: {
          score: -1
        }
      }
    ).fetch(),
    pushes: Pushes.find(
      {},
      {
        sort: {
          date: 1
        }
      }
    ).fetch(),
    loading,
    controller
  };
}, PlayerView);
