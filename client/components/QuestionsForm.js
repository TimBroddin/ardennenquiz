import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Questions } from "../../lib/collections";
import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  Modal,
  Row,
  Col,
  Checkbox
} from "antd";
import MediaViewer from "./MediaViewer";

const FormItem = Form.Item;

class QuestionsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaUrl: null,
      uploading: false,
      options: []
    };
  }

  componentWillReceiveProps(props) {
    if (props.question !== this.props.question) {
      if (props.question) {
        this.setState({
          mediaUrl: props.question.mediaUrl,
          options: props.question.options
        });
      } else {
        this.setState({ mediaUrl: null, options: [] });
      }
    }
  }

  save() {
    const { hide, form, editId, roundId } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.mediaUrl) {
          values.mediaUrl = this.state.mediaUrl;
        } else if (question) {
          values.mediaUrl = question.mediaUrl;
        }

        if (this.state.options) {
          values.options = this.state.options;
        } else if (question) {
          values.options = question.options;
        }

        values.roundId = roundId;

        if (editId) {
          Meteor.call("question.edit", editId, values, (err, res) => {
            hide();
          });
        } else {
          Meteor.call("question.add", values, (err, res) => {
            hide();
          });
        }
      }
    });
  }

  cancel() {}

  upload(e) {
    const file = this.refs.file.files[0];
    this.setState({ uploading: true });
    const uploader = new Slingshot.Upload("files");
    uploader.send(file, (err, mediaUrl) => {
      this.setState({ uploading: false });

      this.setState({ mediaUrl });
    });

    return false;
  }

  changeOptionField(idx, field, value) {
    this.setState(state => {
      const options = state.options.slice(0);
      options[idx][field] = value;

      return {
        ...state,
        options
      };
    });
  }

  changeCorrectOption(idx) {
    this.setState(state => {
      const options = state.options.slice(0);
      options.forEach((option, x) => {
        if (x === idx) {
          options[x].correct = true;
        } else {
          options[x].correct = false;
        }
      });

      return {
        ...state,
        options
      };
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, hide, editId, question } = this.props;
    const { options } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };

    console.log(this.state);

    return (
      <Modal
        visible={visible}
        title={question ? `${question.number} bewerken` : "Vraag aanmaken"}
        okText={question ? "Bewerken" : "Aanmaken"}
        cancelText="Annuleren"
        onCancel={hide}
        onOk={this.save.bind(this)}
      >
        <Form horizontal>
          <FormItem {...formItemLayout} label="Nummer" hasFeedback>
            {getFieldDecorator("number", {
              rules: [
                {
                  required: true,
                  message: "Gelieve een vraagnummer in te geven."
                }
              ]
            })(<Input autoFocus />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Vraag" hasFeedback>
            {getFieldDecorator("question", {
              rules: [
                {
                  required: true,
                  message: "Gelieve een vraag in te geven."
                }
              ]
            })(<Input autoFocus />)}
          </FormItem>

          {options.map((option, k) => (
            <Row key={`option-${k}`} gutter={12}>
              <Col span={4}>
                <Checkbox
                  checked={option.correct}
                  onChange={e => this.changeCorrectOption(k)}
                />
              </Col>

              <Col span={8}>
                <Input
                  value={option.value}
                  onChange={e =>
                    this.changeOptionField(k, "value", e.currentTarget.value)
                  }
                />
              </Col>
            </Row>
          ))}

          <div>
            <Button
              onClick={() =>
                this.setState(state => {
                  state.options.push({});

                  return {
                    ...state,
                    options
                  };
                })
              }
            >
              Optie toevoegen
            </Button>
          </div>

          <FormItem {...formItemLayout} label="Media" hasFeedback>
            {this.state.uploading ? (
              <p>Uploaden ...</p>
            ) : (
              <input type="file" ref="file" onChange={this.upload.bind(this)} />
            )}
          </FormItem>
          <MediaViewer
            mediaUrl={
              this.state.mediaUrl
                ? this.state.mediaUrl
                : this.props.question && this.props.question.mediaUrl
                  ? this.props.question.mediaUrl
                  : null
            }
          />
        </Form>
      </Modal>
    );
  }
}

const Decorated = Form.create({
  mapPropsToFields: props => {
    const { question } = props;
    if (question) {
      return {
        question: {
          value: question.question
        },
        answer: {
          value: question.answer
        },
        youtube: {
          value: question.youtube
        },
        number: {
          value: question.number
        }
      };
    } else {
      return false;
    }
  }
})(QuestionsForm);

export default createContainer(({ editId }) => {
  if (editId) {
    const questionsHandle = Meteor.subscribe("questions.byId", editId);
    const loading = !questionsHandle.ready();

    return {
      loading,
      question: Questions.findOne({ _id: editId })
    };
  } else {
    return { question: null };
  }
}, Decorated);
