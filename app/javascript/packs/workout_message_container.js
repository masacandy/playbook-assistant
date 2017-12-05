import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import WorkoutMessageList from './workout_message_list'
import WorkoutUserInput from './workout_user_input'
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

function sendReps(reps) {
  console.log(reps);
  return {
    type: 'UPDATE',
    reps
  }
}

function sendWeight(num) {
  postWeight(num) {
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
      const messages = json.workout_messages
      this.props.sendMessages(messages);
      return
    })
    .catch((err) => {
      console.error(err);
    });
  };

  return {
    type: 'SEND_WEIGHT',
  }
}

function sendMessages(messages) {
  return {
    type: 'INDEX',
    workoutMessages: messages,
    nextActionType: messages[messages.length - 1].next_action_type,
  }
}

function formReducer(state, action) {
  switch (action.type) {
    case 'INDEX':
      return Object.assign({}, state, {
        type: 'INDEX',
        workoutMessages: action.workoutMessages,
        nextActionType: action.nextActionType,
      });
    case 'UPDATE':
      return Object.assign({}, state, {
        type: 'UPDATE',
      });
    case 'SEND_WEIGHT':
      return Object.assign({}, state, {
        type: 'SEND_WEIGHT',
      });
    default:
      return state;
  }
}

const initialState = {
  type: "INDEX",
  workoutMessages: [],
  nextActionType: 'assistant_message',
};

const store = createStore(formReducer, initialState);

function mapStateToProps(state) {
  window.console.log(state);
  return {
    workoutMessages: state.workoutMessages,
    nextActionType: state.nextActionType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendMessages: (messages) => {
      dispatch(sendMessages(messages))
    },
    sendReps: (num) => {
      dispatch(sendReps(num))
    },
    sendWeight: (num) => {
      dispatch(sendWeight(num))
    },
  };
}

class WorkoutMessageContainer extends React.Component {
  constructor(props) {
    super(props)
  }

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
      const messages = json.workout_messages
      this.props.sendMessages(messages);
      return
    })
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    const nextActionType = this.props.nextActionType;
    const sendWeight = this.props.sendWeight;

    let userInput = null;

    if (nextActionType !== 'assistant_message') {
      userInput = <WorkoutUserInput nextActionType={nextActionType} sendWeight={sendWeight} />
    }

    return (
      <div>
        <WorkoutMessageList workoutMessages={this.props.workoutMessages} />
        {userInput}
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
