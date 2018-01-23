import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const assistantStyle = {
  backgroundColor: '#e9ebee',
  borderRadius: '10px',
  WebkitBorderRadius: '10px',
  MozBorderRadius: '10px',
  padding: '8px',
  marginBottom: '8px',
  display: 'inline-block',
}

const userStyle = {
  float: 'right',
  backgroundColor: '#4080ff',
  color: 'white',
  borderRadius: '10px',
  WebkitBorderRadius: '10px',
  MozBorderRadius: '10px',
  padding: '8px',
  marginBottom: '8px',
  display: 'inline-block',
}

const userWidthStyle = {
  width: '100%',
  padding: '0',
}

const WorkoutMessageList = (props) => {
  const workoutMessages = props.workoutMessages.map(function(workoutMessage) {
    let style;
    let grid;
    let userBubbleContainerStyle;

    if (workoutMessage.message_type == "assistant") {
      style = assistantStyle;
      grid = "col s9"
      userBubbleContainerStyle = {padding: '0'};
    } else {
      style = userStyle;
      grid = "col";
      userBubbleContainerStyle = userWidthStyle;;
    }

    return (
      <div className={grid} style={userBubbleContainerStyle}>
        <div className={"message-" + workoutMessage.message_type} style={style}>
          {workoutMessage.message}
        </div>
      </div>
    )
  });

  return (
    <div className="MessageList row">
      {workoutMessages}
    </div>
  );
};

export default WorkoutMessageList
