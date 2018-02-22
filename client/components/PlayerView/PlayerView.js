import React from 'react';
import {connect} from 'react-redux';
import NameEntry from './NameEntry';
import PlayerStats from './PlayerStats';
import QuestionContainer from './QuestionContainer';


const PlayerView = ({name, id}) => {
  if(!name) {
    return <NameEntry />
  }  else {
    return <div>
      <PlayerStats id={id} />
      <QuestionContainer />
    </div>
  }
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(PlayerView);
