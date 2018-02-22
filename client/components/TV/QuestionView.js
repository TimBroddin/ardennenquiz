import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Questions } from "../../../lib/collections";

import "./style.css";

class MediaViewer extends Component {
  componentDidMount() {
    this.playPause(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.playPause(nextProps);
  }

  playPause(props) {
    const { controller } = props;
    if (controller && this.refs.media) {
      if (controller.paused) {
        this.refs.media.pause();
      } else {
        this.refs.media.play();
      }
    }
  }

  render() {
    const { mediaUrl } = this.props;

    if (mediaUrl.indexOf(".mp3") !== -1) {
      return <audio ref="media" src={mediaUrl} autoPlay="true" loop="true" />;
    } else if (
      mediaUrl.indexOf(".jpg") !== -1 ||
      mediaUrl.indexOf(".gif") !== -1 ||
      mediaUrl.indexOf(".png") !== -1
    ) {
      return (
        <img src={mediaUrl} style={{ maxWidth: "100%", maxHeight: "100%" }} />
      );
    } else if (mediaUrl.indexOf(".mp4") !== -1) {
      return (
        <video
          ref="media"
          autoPlay="true"
          loop="true"
          src={mediaUrl}
          style={{ maxWidth: "100%" }}
        />
      );
    } else {
      return null;
    }
  }
}

class QuestionView extends Component {
  componentDidMount() {
    if (this.props.question) {
      this.askQuestion(this.props.question);
    }
  }

  askQuestion(question) {
    var msg = new SpeechSynthesisUtterance(question.question);
    msg.lang = "nl-BE";

    window.speechSynthesis.speak(msg);
    question.options.map(option => {
      var msg = new SpeechSynthesisUtterance(option.value);
      msg.lang = "nl-BE";
      window.speechSynthesis.speak(msg);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question !== this.props.question && nextProps.question) {
      if (
        !this.props.question ||
        nextProps.question.question !== this.props.question.question
      ) {
        this.askQuestion(nextProps.question);
      }
    }
  }

  render() {
    const { loading, question, controller } = this.props;
    let content;
    if (loading) return <div />;

    return (
      <div className="questionView">
        <h1>{question.question}</h1>
        {question.mediaUrl ? (
          <MediaViewer controller={controller} mediaUrl={question.mediaUrl} />
        ) : null}
        <ul>
          {question.options.map((option, k) => (
            <li key={`answer-${option.value}-${k}`}>{option.value}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default createContainer(({ questionId }) => {
  const subsHandle = Meteor.subscribe("questions.byId", questionId);

  return {
    question: Questions.findOne({ _id: questionId }),
    loading: !subsHandle.ready()
  };
}, QuestionView);
