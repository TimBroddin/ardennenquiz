import { Meteor } from "meteor/meteor";

import {
  Rounds,
  Questions,
  Players,
  Controller,
  Pushes
} from "../lib/collections";

Meteor.publish("rounds.list", () => {
  return Rounds.find();
});

Meteor.publish("rounds.byId", id => {
  return Rounds.find({ _id: id });
});

Meteor.publish("questions.list", id => {
  if (id) {
    return Questions.find({ roundId: id });
  }

  return Questions.find();
});

Meteor.publish("questions.byId", id => {
  console.log(Questions.find({ _id: id }).fetch());
  return Questions.find({ _id: id });
});

Meteor.publish("controller", () => {
  return Controller.find();
});

Meteor.publish("players.list", () => {
  return Players.find();
});

Meteor.publish("players.byId", id => {
  return Players.find({ _id: id });
});

Meteor.publish("pushes.list", () => {
  return Pushes.find();
});
