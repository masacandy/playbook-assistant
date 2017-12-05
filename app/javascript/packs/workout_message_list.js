import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const WorkoutMessageList = (props) => {
  const workoutMessages = props.workoutMessages.map(function(workoutMessage) {
    return (
      <div>
        {workoutMessage.message}
        {workoutMessage.message_type}
      </div>
    )
  });

  return (
    <div className="MessageList">
      {workoutMessages}
    </div>
  );
};

export default WorkoutMessageList
