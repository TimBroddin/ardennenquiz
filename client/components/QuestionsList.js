import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router";

import { Questions, Rounds } from "../../lib/collections";

import QuestionsForm from "./QuestionsForm";

import { Table, Icon, Button, Popconfirm } from "antd";

class QuestionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      editId: null
    };
  }

  showAddForm(e) {
    e.preventDefault();
    this.setState({ modalVisible: true, editId: null });
  }

  showEditForm(editId) {
    this.setState({ modalVisible: true, editId });
  }

  hideModal(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({ modalVisible: false, editId: null });
  }

  delete(id) {
    Meteor.call("question.delete", id);
  }

  render() {
    const dataSource = this.props.questions;
    const columns = [
      {
        title: "Nummer",
        dataIndex: "number"
      },
      {
        title: "Vraag",
        dataIndex: "question"
      },
      {
        title: "Antwoord",
        dataIndex: "answer"
      },
      {
        title: "Acties",
        key: "action",
        render: (text, record) => (
          <span>
            <a href="#" onClick={this.showEditForm.bind(this, record._id)}>
              Bewerken
            </a>
            <span className="ant-divider" />
            <Popconfirm
              title={`Ben je zeker dat je ${record.name} wil verwijderen?`}
              okText="Ja"
              cancelText="Nee"
              onConfirm={this.delete.bind(this, record._id)}
            >
              <a href="#">Verwijderen</a>
            </Popconfirm>
          </span>
        )
      }
    ];

    if (this.props.loading) {
      return <p>Bezig met laden...</p>;
    }

    return (
      <div>
        <h1>Vragen voor {this.props.round.name}</h1>
        <div
          style={{
            margin: "2em"
          }}
        >
          <Button type="primary" onClick={this.showAddForm.bind(this)}>
            Vraag toevoegen
          </Button>
        </div>

        <Table dataSource={dataSource} columns={columns} />

        <QuestionsForm
          roundId={this.props.roundId}
          visible={this.state.modalVisible}
          ref="modal"
          hide={this.hideModal.bind(this)}
          editId={this.state.editId}
        />
      </div>
    );
  }
}

export default createContainer(({ params }) => {
  console.log(params);
  const questionsHandle = Meteor.subscribe("questions.list", params.id);
  const roundHandle = Meteor.subscribe("rounds.byId", params.id);

  const loading = !questionsHandle.ready() || !roundHandle.ready();

  return {
    loading,
    roundId: params.id,
    round: Rounds.findOne({ _id: params.id }),
    questions: Questions.find(
      {
        roundId: params.id
      },
      {
        sort: {
          number: 1
        }
      }
    ).fetch()
  };
}, QuestionsList);
