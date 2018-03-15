import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

const WorkoutImageMessage = (props) => {
  return (
    <div className="workoutImageMessage row" style={{marginTop: '-20px', marginBottom: '20px'}} >
      <div className="col s9">
        <img src={props.imageUrl} style={{maxWidth: '100%'}} />
      </div>
    </div>
  );
};

export default WorkoutImageMessage
