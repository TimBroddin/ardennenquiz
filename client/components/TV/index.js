import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Controller } from "../../../lib/collections";
import RoundView from "./RoundView";
import QuestionView from "./QuestionView";
import PlayerView from "./PlayerView";
import Ranking from "./Ranking";

import "./style.css";

const TV = ({ loading, controller }) => {
  let content;
  if (loading) return <div />;

  if (controller && controller.roundId && !controller.questionId) {
    content = <RoundView roundId={controller.roundId} />;
  } else if (controller && controller.questionId) {
    content = (
      <QuestionView
        questionId={controller.questionId}
        controller={controller}
      />
    );
  } else if (controller && controller.finished) {
    content = <Ranking />;
  } else {
    content = (
      <div className="intro">
        <h1>De grote ardennenquiz</h1>
        <p>
          Neem je GSM en surf naar:<br />ardennenquiz.be
        </p>
      </div>
    );
  }

  return (
    <div className="tvView">
      <PlayerView controller={controller} />

      <div className="inner">{content}</div>
    </div>
  );
};

export default createContainer(() => {
  const subsHandle = Meteor.subscribe("controller");

  return {
    controller: Controller.findOne(),
    loading: !subsHandle.ready()
  };
}, TV);
