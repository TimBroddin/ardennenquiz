import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {Rounds} from '../../lib/collections';
import { Form, Icon, Input, Button, Select, Modal } from 'antd';
const FormItem = Form.Item;

class RoundsForm extends Component {
	save() {
		const {hide, form, editId} = this.props;

		form.validateFieldsAndScroll((err, values) => {
      		if (!err) {
				if(editId) {
					Meteor.call('round.edit', editId, values, (err, res) => {
						hide();
					});
				} else {
					Meteor.call('round.add', values, (err, res) => {
						hide();
					});
				}
      		}
    	});
	}

	cancel() {

	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { visible, hide, editId, round } = this.props;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};


		return (
			<Modal
			visible={visible}
			title={ (round) ? `${round.name} bewerken` : "Ronde aanmaken"}
			okText={ (round) ? "Bewerken" : "Aanmaken"}
			cancelText="Annuleren"
			onCancel={hide}
			onOk={this.save.bind(this)}
		>

			<Form horizontal>
        		<FormItem
              {...formItemLayout}
              label="Nummer"
                    hasFeedback
              >
                    {getFieldDecorator('number', {
                rules: [ {
                required: true, message: 'Gelieve een rondenummer in te geven.',
                }],
              })(
                      <Input autoFocus />
                    )}
                </FormItem>
                <FormItem

          {...formItemLayout}
					label="Naam"
          			hasFeedback
				>
          			{getFieldDecorator('name', {
						rules: [ {
						required: true, message: 'Gelieve een naam in te geven.',
						}],
					})(
            			<Input autoFocus />
          			)}
		        </FormItem>

            <FormItem
          {...formItemLayout}
          label="Omschrijving"
                hasFeedback
        >
                {getFieldDecorator('description', {
            rules: [ {
            required: true, message: 'Gelieve een omschrijving in te geven.',
            }],
          })(
                  <Input type="textarea" autoFocus />
                )}
            </FormItem>
			</Form>
	  </Modal>);
	}
}


const Decorated = Form.create({
	mapPropsToFields: (props) => {
		const {round} = props;
		if(round) {
			return {
        number: { value: round.number },
				name: { value: round.name },
        description: { value: round.description }
			}
		} else {
			return false;
		}
	}

})(RoundsForm);



export default createContainer(({ editId }) => {
	if(editId) {
		const roundsHandle = Meteor.subscribe('rounds.byId', editId);
		const loading = !roundsHandle.ready();

		return {
			loading,
			round: Rounds.findOne({ _id: editId })
		};
	} else {
		return {
			round: null
		}
	}
}, Decorated);
