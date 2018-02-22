import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {Questions} from '../../../lib/collections';
import {createContainer} from 'meteor/react-meteor-data';

const Question = ({question, loading}) => {
  if(loading) return <p>Bezig met laden</p>;

  return <div className="question">
    <strong>Vraag {question.number}:</strong> {question.question}
  </div>

}

export default createContainer(({id}) => {
  const subHandle = Meteor.subscribe('questions.byId', id);

  return {
    question: Questions.findOne({ _id: id }),
    loading: !subHandle.ready()
  }
}, Question);
