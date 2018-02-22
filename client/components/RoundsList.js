import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router";

import { Rounds } from "../../lib/collections";

import RoundsForm from "./RoundsForm";

import { Table, Icon, Button, Popconfirm } from "antd";

class RoundsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      editId: null
    };
  }

  showAddForm(e) {
    alert("add");
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
    Meteor.call("round.delete", id);
  }

  render() {
    const dataSource = this.props.rounds;
    const columns = [
      {
        title: "Nummer",
        dataIndex: "number"
      },
      {
        title: "Naam",
        dataIndex: "name"
      },
      {
        title: "Acties",
        key: "action",
        render: (text, record) => (
          <span>
            <Link to={`/admin/questions/${record._id}`}>Vragen</Link>
            <span className="ant-divider" />
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

    return (
      <div>
        <h1>Rondes</h1>
        <div
          style={{
            margin: "2em"
          }}
        >
          <Button type="primary" onClick={this.showAddForm.bind(this)}>
            Ronde toevoegen
          </Button>
        </div>

        <Table dataSource={dataSource} columns={columns} />

        <RoundsForm
          visible={this.state.modalVisible}
          ref="modal"
          hide={this.hideModal.bind(this)}
          editId={this.state.editId}
        />
      </div>
    );
  }
}

export default createContainer(() => {
  const roundsHandle = Meteor.subscribe("rounds.list");
  const loading = !roundsHandle.ready();

  return {
    loading,
    rounds: Rounds.find(
      {},
      {
        sort: {
          number: 1
        }
      }
    ).fetch()
  };
}, RoundsList);
