import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Pushes, Questions } from "../../../lib/collections";
import { createContainer } from "meteor/react-meteor-data";
import { connect } from "react-redux";

class Buttons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timePassed: 0,
      pushed: false
    };
  }

  componentDidMount() {
    this.int = setInterval(() => {
      this.calculateTime();
    }, 10);
  }

  componentWillUnmount() {
    clearInterval(this.int);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.controller &&
      this.props.controller.questionId !== nextProps.controller.questionId
    ) {
      this.setState({
        pushed: false,
        timePassed: 0
      });
    }
  }

  calculateTime() {
    const { controller } = this.props;
    if (controller && !this.state.pushed) {
      const { start } = controller;
      let diff = new Date().getTime() - start.getTime();
      const timePassed = Math.max(20 - Math.round(diff / 10) / 100, 0);
      this.setState({
        timePassed: parseFloat(timePassed).toFixed(2),
        pushed: !timePassed
      });
    }
  }

  push(value) {
    this.setState({
      pushed: true
    });
    Meteor.call("push", this.props.name, value);
  }

  render() {
    const style = this.state.pushed ? { backgroundColor: "#CCC" } : {};
    const { question } = this.props;

    if (!question) return null;

    return (
      <div>
        {question.options.map(option => (
          <div>
            <input
              type="button"
              value={option.value}
              style={style}
              disabled={this.state.pushed}
              onClick={() => this.push(option.value)}
            />
          </div>
        ))}

        <p>{this.state.timePassed}s</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    name: state.name
  };
};

export default createContainer(({ controller }) => {
  console.log(controller);

  Meteor.subscribe("questions.byId", controller.questionId);

  return {
    controller,
    question: Questions.findOne({ _id: controller.questionId })
  };
}, connect(mapStateToProps)(Buttons));
