import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Rounds} from '../../../lib/collections';


import './style.css';



class RoundView extends Component {

    componentDidMount() {
      if(this.props.round) {
        this.introduceRound(this.props.round);
      }
    }

    introduceRound(round) {
      var msg = new SpeechSynthesisUtterance(round.name);
      window.speechSynthesis.speak(msg);
      var msg2 = new SpeechSynthesisUtterance(round.description);
      window.speechSynthesis.speak(msg2);

    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.round !== this.props.round) {
        this.introduceRound(nextProps.round);
      }
    }


  render() {
    const {loading, round} = this.props;

    let content;
    if (loading)
        return <div/>

    return <div className="roundView">
        <h1>{round.name}</h1>
        <p>{round.description}</p>
    </div>

  }
}

export default createContainer(({roundId}) => {
    const subsHandle = Meteor.subscribe('rounds.byId', roundId);

    return {
        round: Rounds.findOne({_id: roundId}),
        loading: !subsHandle.ready()
    }

}, RoundView)
