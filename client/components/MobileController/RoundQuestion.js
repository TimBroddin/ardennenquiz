import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Questions, Rounds } from "../../../lib/collections";
import { createContainer } from "meteor/react-meteor-data";
import { Icon, Button } from "antd";

const RoundQuestion = ({ round, question, loading }) => {
  if (loading) return <p>Bezig met laden</p>;

  return (
    <div className="roundQuestion">
      <p>
        Ronde:{" "}
        {round ? (
          <span>
            {round.number}. {round.name}
          </span>
        ) : null}
      </p>
      <p>
        Vraag:{" "}
        {question ? (
          <span>
            {question.number}. {question.question}
          </span>
        ) : null}
      </p>
      {question ? (
        <p>
          {question.options.map(
            o => (o.correct ? <span>{o.value}</span> : null)
          )}
        </p>
      ) : null}

      <p>
        <Button
          type="primary"
          icon="caret-right"
          onClick={() => Meteor.call("controller.next")}
        >
          Volgende
        </Button>{" "}
        <Button
          type="primary"
          icon="close-circle"
          onClick={() => {
            if (confirm("Zeker?")) {
              Meteor.call("controller.delete");
            }
          }}
        >
          Reset
        </Button>{" "}
        <Button
          type="primary"
          icon="play-circle"
          onClick={() => Meteor.call("controller.play")}
        >
          Afspelen
        </Button>{" "}
        <Button
          type="primary"
          icon="pause-circle"
          onClick={() => Meteor.call("controller.pause")}
        >
          Pauze
        </Button>
      </p>
    </div>
  );
};

export default createContainer(({ controller }) => {
  if (!controller) {
    return {};
  }
  const questionHandle = Meteor.subscribe(
    "questions.byId",
    controller.questionId
  );
  const roundHandle = Meteor.subscribe("rounds.byId", controller.roundId);

  return {
    question: Questions.findOne({ _id: controller.questionId }),
    round: Rounds.findOne({ _id: controller.roundId }),
    loading: !questionHandle.ready() || !roundHandle.ready()
  };
}, RoundQuestion);
