import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import WorkoutMessageList from './workout_message_list'
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

function sendReps(reps) {
  return {
    type: 'UPDATE',
    reps
  }
}

function sendMessages(messages) {
  return {
    type: 'INDEX',
    workout_messages: messages,
  }
}

function formReducer(state, action) {
  switch (action.type) {
    case 'INDEX':
      return Object.assign({}, state, {
        type: 'index',
        workout_messages: action.workout_messages
      });
    case 'UPDATE':
      return Object.assign({}, state, {
        type: 'update',
      });
    default:
      return state;
  }
}

const initialState = {
  type: 'index',
  workout_messages: [],
};

const store = createStore(formReducer, initialState);

function mapStateToProps(state) {
  window.console.log(state);
  return {
    workout_messages: state.workout_messages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendMessages(messages) {
      dispatch(sendMessages(messages))
    },
    sendReps(num) {
      dispatch(sendReps(num))
    },
  };
}

class WorkoutMessageContainer extends React.Component {
  componentDidMount() {
    this.fetchMessages(gon.workout_id);
  }

  fetchMessages(id, sendMessages) {
    const params = { workout_id: id };
    const urlParams = new URLSearchParams(Object.entries(params));
    const url = '/api/v1/workout_messages?' + urlParams;

    return fetch(url, { credentials: 'same-origin' }
    )
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.props.sendMessages(json.workout_messages);
    })
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    return (
      <div>
        <WorkoutMessageList workout_messages={this.props.workout_messages} />
      </div>
    )
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkoutMessageContainer);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer />
    </Provider>,
    document.body.appendChild(document.createElement('div')),
  )
})
