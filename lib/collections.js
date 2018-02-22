import {Meteor} from 'meteor/meteor';

const Rounds = new Meteor.Collection('rounds');
const Questions = new Meteor.Collection('questions');
const Players = new Meteor.Collection('players');
const Controller = new Meteor.Collection('controller');
const Pushes = new Meteor.Collection('pushes');

export {Rounds, Questions, Players, Controller, Pushes};
