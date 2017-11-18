import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import WorkoutMessageList from './workout_message_list'

class WorkoutMessageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workout_messages: [],
    }

    const params = { workout_id: gon.workout_id }
    const urlParams = new URLSearchParams(Object.entries(params));
    const url = '/api/v1/workout_messages?' + urlParams

    fetch(url, { credentials: 'same-origin' }
    )
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((result) => {
      this.setState({ workout_messages: result.workout_messages });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        <WorkoutMessageList workout_messages={this.state.workout_messages} />
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <WorkoutMessageContainer />,
    document.body.appendChild(document.createElement('div')),
  )
})
