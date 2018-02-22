import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Questions, Pushes, Players } from "../../../lib/collections";

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
        <img
          src={mediaUrl}
          style={{ maxWidth: "70%", maxHeight: "100%", marginBottom: "30px" }}
        />
      );
    } else if (mediaUrl.indexOf(".mp4") !== -1) {
      return (
        <video
          ref="media"
          autoPlay="true"
          loop="true"
          src={mediaUrl}
          style={{ maxWidth: "70%", marginBottom: "30px" }}
        />
      );
    } else {
      return null;
    }
  }
}

class QuestionView extends Component {
  constructor(props) {
    super(props);
    this.int = null;
    this.state = {
      timePassed: 0
    };
  }

  componentDidMount() {
    if (this.props.question) {
      this.askQuestion(this.props.question);
    }
    this.int = setInterval(() => {
      this.calculateTime();
    }, 10);
  }

  componentWillUnmount() {
    clearInterval(this.int);
  }

  askQuestion(question) {
    var msg = new SpeechSynthesisUtterance(question.question);
    msg.lang = "nl-BE";

    window.speechSynthesis.speak(msg);
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

  calculateTime() {
    const { controller } = this.props;
    if (controller) {
      const { start } = controller;
      let diff = new Date().getTime() - start.getTime();
      const timePassed = Math.max(20 - Math.round(diff / 10) / 100, 0);
      this.setState({
        timePassed: parseFloat(timePassed).toFixed(1)
      });
    }
  }

  render() {
    const {
      loading,
      question,
      controller,
      pushesCount,
      playersCount
    } = this.props;
    const { timePassed } = this.state;
    let content;
    if (loading) return <div />;

    return (
      <div className="questionView">
        <div className="top">
          <h1>{question.question}</h1>
          <div className="timer">
            {playersCount !== pushesCount ? `${timePassed}s` : ""}
          </div>
        </div>

        {question.mediaUrl ? (
          <MediaViewer controller={controller} mediaUrl={question.mediaUrl} />
        ) : null}
        <div className="options">
          {question.options.map((option, k) => {
            const style = {
              backgroundColor:
                (new Date().getTime() - controller.start.getTime() > 20000 &&
                  option.correct) ||
                (playersCount === pushesCount && option.correct)
                  ? "green"
                  : "transprant"
            };
            return (
              <div key={`answer-${option.value}-${k}`} style={style}>
                {option.value}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default createContainer(({ questionId }) => {
  const subsHandle = Meteor.subscribe("questions.byId", questionId);
  const pushesHandle = Meteor.subscribe("pushes.list");
  const playersHandle = Meteor.subscribe("players.list");

  return {
    question: Questions.findOne({ _id: questionId }),
    loading: !subsHandle.ready(),
    pushesCount: Pushes.find().count(),
    playersCount: Players.find().count()
  };
}, QuestionView);
