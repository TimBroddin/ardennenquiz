import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Players, Pushes } from "../../../lib/collections";
import FlipMove from "react-flip-move";

class Player extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      this.props.name === nextProps.name &&
      this.props.hasPushed !== nextProps.hasPushed &&
      this.props.controller === nextProps.controller
    ) {
      const audio = new Audio("/druk.mp3");
      audio.play();
    }

    if (this.props.name !== nextProps.name) {
      this.sayWelcome(nextProps.name);
    }

    if (nextProps.score > this.props.score) {
      const audio = new Audio("/win.mp3");
      audio.play();
    }
  }

  componentDidMount() {
    if (this.props.name) {
      this.sayWelcome(this.props.name);
    }
  }

  sayWelcome(name) {
    var msg = new SpeechSynthesisUtterance(`Welkom bij de quiz ${name}!`);
    msg.lang = "nl-BE";

    window.speechSynthesis.speak(msg);
  }

  render() {
    const { name, score, hasPushed, time, pushIndex, amount } = this.props;

    let style = {
      //    maxWidth: `${ 100 / amount}%`
    };

    if (hasPushed) {
      let opacity = 1 - pushIndex / amount;
      style.backgroundColor = `rgba(0, 222, 0, ${opacity})`;
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
    let hasPushed = false;
    let time = false;
    pushes.forEach((push, k) => {
      if (push.name === player.name) {
        pushIndex = k;
        hasPushed = true;
        if (controller && controller.start) {
          time = (
            (push.date.getTime() - controller.start.getTime()) /
            1000
          ).toFixed(2);
        }
      }
    });
    playerList.push(
      <Player
        key={`player-${player.name}`}
        controller={controller}
        amount={players.length}
        name={player.name}
        score={player.score}
        hasPushed={hasPushed}
        time={time}
        pushIndex={pushIndex}
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
