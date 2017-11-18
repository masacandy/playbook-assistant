import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const WorkoutMessageList = (props) => {
  const workout_messages = props.workout_messages.map(function(workout_message) {
    return (
      <div>
        {workout_message.message}
        {workout_message.message_type}
      </div>
    )
  });
  return (
    <div className="MessageList">
      {workout_messages}
    </div>
  );
};

export default WorkoutMessageList
