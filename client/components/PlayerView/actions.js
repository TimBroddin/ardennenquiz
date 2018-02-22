import {Meteor} from 'meteor/meteor';

const setName = (name) => {
  return (dispatch) => {
    Meteor.call('player.create', name, (err, id) => {
      if(!err) {
        dispatch({
          type: 'SET_NAME',
          name
        });
        dispatch({
          type: 'SET_ID',
          id
        });

      }

    });

  }

}

export {setName}
