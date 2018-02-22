import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Players, Questions, Rounds, Controller as CC, Pushes} from '../../lib/collections';
import {
    Table,
    Icon,
    Button,
    Popconfirm,
    Row,
    Col
} from 'antd';

class Controller extends Component {
    activateRound(roundId, e) {
        e.preventDefault();
        Meteor.call('controller.activateRound', roundId);
    }

    activateQuestion(questionId, e) {
        e.preventDefault();
        Meteor.call('controller.activateQuestion', questionId);
    }

    increment(id, e) {
        e.preventDefault();
        Meteor.call('player.increment', id);
    }

    decrement(id, e) {
        e.preventDefault();
        Meteor.call('player.decrement', id);
    }

    delete(id) {
        Meteor.call('player.delete', id);
    }

    render() {
        const {rounds, controller, loading, pushes, players} = this.props;
        if (loading) {
            return <p>Laden ...</p>
        }

        let questions = [];
        if (controller && controller.roundId) {
            questions = Questions.find({
                roundId: controller.roundId
            }, {
                sort: {
                    number: 1
                }
            }).fetch();

        }

        const roundsColumns = [
            {
                title: 'Nummer',
                dataIndex: 'number'
            }, {
                title: 'Naam',
                dataIndex: 'name'
            }, {
                title: 'Acties',
                key: 'action',
                render: (text, record) => (
                    <span>
                        {((controller && controller.roundId !== record._id) || !controller)
                            ? <a href="#" onClick={this.activateRound.bind(this, record._id)}>Activeer</a>
                            : null}
                    </span>

                )
            }
        ];

        const questionsColumns = [
            {
                title: 'Nummer',
                dataIndex: 'number'
            }, {
                title: 'Vraag',
                dataIndex: 'question'
            }, {
                title: 'Antwoord',
                dataIndex: 'answer'

            }, {
                title: 'Acties',
                key: 'action',
                render: (text, record) => (
                    <span>
                        {(controller.questionId !== record._id )
                            ? <a href="#" onClick={this.activateQuestion.bind(this, record._id)}>Activeer</a>
                            : null}
                    </span>

                )
            }
        ];

        const playersColumns = [
            {
                title: 'Naam',
                dataIndex: 'name'
            }, {
                title: 'Score',
                dataIndex: 'score'
            }, {
                title: 'Acties',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.increment.bind(this, record._id)}>+</a>
                        <span className="ant-divider"/>
                        <a href="#" onClick={this.decrement.bind(this, record._id)}>-</a>
                        <span className="ant-divider"/>

                        <Popconfirm title={`Ben je zeker dat je ${record.name} wil verwijderen?`} okText="Ja" cancelText="Nee" onConfirm={this.delete.bind(this, record._id)}>
                            <a href="#">Verwijderen</a>
                        </Popconfirm>
                    </span>

                )
            }
        ];

        const pushesColumns = [
          {
            title: 'Naam',
            dataIndex: 'name'
          },
          {
            title: 'Snelheid',
            key: 'date',
            render: (text, record) => {
              if(controller.questionId && controller.start && record.date) {
                return ((record.date.getTime() - controller.start.getTime() )/1000).toFixed(2) + 's'
              }
            }
          }
        ]

        return <div>
            <p>
              <Button type="ghost" onClick={() => Meteor.call('controller.delete')}>Herstart</Button>
            </p>
            <Row>
                <Col span={12} style={{
                    paddingRight: '1em'
                }}>
                    <h2>Ronden</h2>
                    <Table dataSource={rounds} columns={roundsColumns} pagination={false}/>

                    <h2 style={{
                        marginTop: '1em'
                    }}>Vragen</h2>
                    <Table dataSource={questions} columns={questionsColumns} pagination={false}/>

                </Col>
                <Col span={12}>

                    <h2>Punten</h2>
                    <Table dataSource={players} columns={playersColumns} pagination={false}/>

                    <h2 style={{
                        marginTop: '1em'
                    }}>Afdrukken</h2>
                    <Table dataSource={pushes} columns={pushesColumns} pagination={false}/>

                </Col>
            </Row>
        </div>
    }
}

export default createContainer(() => {
    const roundHandle = Meteor.subscribe('rounds.list');
    const questionHandle = Meteor.subscribe('questions.list');
    const controllerHandle = Meteor.subscribe('controller');
    const playersHandle = Meteor.subscribe('players.list');
    const pushesHandle = Meteor.subscribe('pushes.list');

    const loading = !roundHandle.ready() || !questionHandle.ready() || !controllerHandle.ready() || !playersHandle.ready() || !pushesHandle.ready();

    return {loading, rounds: Rounds.find({}, {
            sort: {
                number: 1
            }
        }).fetch(), controller: CC.findOne(), players: Players.find({}, {
            sort: {
                name: 1
            }
        }).fetch(), pushes: Pushes.find({}, {
            sort: {
                date: 1
            }
        }).fetch()}

}, Controller);
