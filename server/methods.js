import { Meteor } from "meteor/meteor";
import {
  Rounds,
  Questions,
  Players,
  Controller,
  Pushes
} from "../lib/collections";

Meteor.methods({
  "round.add": data => {
    data.number = parseInt(data.number);
    Rounds.insert(data);
  },
  "round.edit": (id, data) => {
    data.number = parseInt(data.number);
    Rounds.update(
      {
        _id: id
      },
      { $set: data }
    );
  },
  "round.delete": id => {
    Rounds.remove({ _id: id });
  },
  "question.add": data => {
    data.number = parseInt(data.number);
    Questions.insert(data);
  },
  "question.edit": (id, data) => {
    data.number = parseInt(data.number);
    Questions.update(
      {
        _id: id
      },
      { $set: data }
    );
  },
  "question.delete": id => {
    Questions.remove({ _id: id });
  },
  "controller.activateRound": id => {
    if (!Controller.findOne()) {
      Controller.insert({});
    }

    Controller.update(
      {},
      {
        $set: {
          roundId: id,
          questionId: null,
          finished: false
        }
      }
    );
    Pushes.remove({}, { multi: 1 });
  },
  "controller.activateQuestion": id => {
    if (!Controller.findOne()) {
      Controller.insert({});
    }
    Meteor.call("controller.play");
    Controller.update(
      {},
      {
        $set: {
          questionId: id,
          start: new Date(),
          finished: false,
          paused: false
        }
      }
    );
    Pushes.remove({}, { multi: 1 });
  },
  "controller.end": () => {
    if (!Controller.findOne()) {
      Controller.insert({});
    }

    Controller.update(
      {},
      {
        $set: {
          finished: true,
          questionId: null,
          roundId: null
        }
      }
    );
  },
  "controller.pause": () => {
    if (!Controller.findOne()) {
      Controller.insert({});
    }

    Controller.update(
      {},
      {
        $set: {
          paused: true
        }
      }
    );
  },
  "controller.play": () => {
    if (!Controller.findOne()) {
      Controller.insert({});
    }

    Controller.update(
      {},
      {
        $set: {
          paused: false
        }
      }
    );
  },
  "controller.next": () => {
    if (!Controller.findOne()) {
      Controller.insert({});
    }

    let controller = Controller.findOne({});

    if (controller.roundId) {
      if (controller.questionId) {
        // find next question
        let question = Questions.findOne({ _id: controller.questionId });
        let nextQuestion = Questions.findOne({
          roundId: controller.roundId,
          number: question.number + 1
        });
        if (nextQuestion) {
          Meteor.call("controller.activateQuestion", nextQuestion._id);
        } else {
          // find next round
          let round = Rounds.findOne({ _id: controller.roundId });
          let nextRound = Rounds.findOne({ number: round.number + 1 });
          if (nextRound) {
            Meteor.call("controller.activateRound", nextRound._id);
          } else {
            console.log("Set end");
            Meteor.call("controller.end");
          }
        }
      } else {
        // find question 1
        let question = Questions.findOne({
          roundId: controller.roundId,
          number: 1
        });
        Meteor.call("controller.activateQuestion", question._id);
      }
    } else {
      // find round 1
      let round = Rounds.findOne({ number: 1 });
      Meteor.call("controller.activateRound", round._id);
    }
  },

  "controller.delete": () => {
    Controller.remove({}, { multi: 1 });
    Pushes.remove({}, { multi: 1 });
  },
  "player.create": name => {
    if (Players.findOne({ name })) {
      return Players.findOne({ name })._id;
    } else {
      return Players.insert({ name, score: 0 });
    }
  },
  "player.delete": id => {
    Players.remove({ _id: id });
  },
  "player.increment": id => {
    Players.update(
      {
        _id: id
      },
      {
        $inc: {
          score: 1
        }
      }
    );
  },
  "player.decrement": id => {
    Players.update(
      {
        _id: id
      },
      {
        $inc: {
          score: -1
        }
      }
    );
  },
  push: (name, value) => {
    const controller = Controller.findOne();
    const question = Questions.findOne({ _id: controller.questionId });
    const d = new Date();
    let points = 0;
    question.options.forEach(option => {
      if (option.correct && option.value === value) {
        points = Math.round(
          20 - (d.getTime() - controller.start.getTime()) / 1000
        );
      }
    });

    console.log(
      d.getTime() - controller.start.getTime(),
      `Adding ${points} to ${name}`
    );

    const player = Players.findOne({ name });

    Players.update(
      {
        _id: player._id
      },
      {
        $inc: {
          score: points
        }
      }
    );
  }
});
