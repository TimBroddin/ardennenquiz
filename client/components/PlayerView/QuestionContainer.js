import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Controller } from "../../../lib/collections";
import { createContainer } from "meteor/react-meteor-data";
import Question from "./Question";
import Buttons from "./Buttons";

const QuestionContainer = ({ controller, loading }) => {
  if (loading) {
    return <p>Bezig met laden...</p>;
  } else {
    return (
      <div className="questionContainer">
        {controller.questionId ? (
          <div>
            <Question id={controller.questionId} />
            <Buttons controller={controller} />
          </div>
        ) : null}
      </div>
    );
  }
};

export default createContainer(() => {
  const subHandle = Meteor.subscribe("controller");

  return {
    loading: !subHandle.ready(),
    controller: Controller.findOne()
  };
}, QuestionContainer);
