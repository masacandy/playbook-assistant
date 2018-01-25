import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types'
import WorkoutMessageList from './workout_message_list';
import WorkoutUserInput from './workout_user_input';
import { applyMiddleware, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { ChatFeed, Message } from 'react-chat-ui'

function skipExercise(json) {
  const messages = json.workout_messages
  const chatMessages = json.workout_messages;

  return {
    type: 'SKIP_EXERCISE',
    workoutMessages: chatMessages,
    nextActionType: messages[messages.length - 1].next_action_type,
    currentExerciseId: json.current_exercise.id,
    currentExerciseReps: json.current_exercise.rep,
    currentExerciseWeight: json.current_exercise.weight,
  }
}

function createMessages(messages) {
  return messages.map(function(message) {
    return new Message({
      id: message.message_type == 'user' ? 0 : 1,
      message: message.message,
    })
  })
}

function selectExercise(json) {
  const messages = json.workout_messages
  const chatMessages = json.workout_messages;

  return {
    type: 'SELECT_EXERCISE',
    workoutMessages: chatMessages,
    nextActionType: messages[messages.length - 1].next_action_type,
    currentExerciseId: json.current_exercise.id,
    currentExerciseReps: json.current_exercise.rep,
    currentExerciseWeight: json.current_exercise.latest_weight,
  }
}


function chooseExercise(json) {
  const messages = json.workout_messages
  const chatMessages = json.workout_messages;

  return {
    type: 'CHOOSE_EXERCISE',
    workoutMessages: chatMessages,
    nextActionType: messages[messages.length - 1].next_action_type,
    currentExerciseId: json.current_exercise.id,
    currentExerciseReps: json.current_exercise.rep,
    currentExerciseWeight: json.current_exercise.latest_weight,
  }
}

function sendReps(json) {
  const messages = json.workout_messages
  const chatMessages = json.workout_messages;

  return {
    type: 'SEND_REPS',
    workoutMessages: chatMessages,
    nextActionType: messages[messages.length - 1].next_action_type,
    currentExerciseWeight: json.weight,
    currentMenuId: json.current_menu.id,
    currentExerciseId: json.current_exercise.id,
    currentExerciseReps: json.current_exercise.rep,
  }
}

function sendWeight(json) {
  const messages = json.workout_messages
  const chatMessages = json.workout_messages;

  return {
    type: 'SEND_WEIGHT',
    workoutMessages: chatMessages,
    nextActionType: messages[messages.length - 1].next_action_type,
    currentExerciseWeight: json.weight,
  }
}

function setWorkouts(json) {
  const messages = json.workout_messages
  const chatMessages = json.workout_messages;

  return {
    type: 'INDEX',
    workoutMessages: chatMessages,
    nextActionType: messages[messages.length - 1].next_action_type,
    currentMenuId: json.current_menu_id,
    currentExerciseId: json.current_exercise.id,
    currentExerciseReps: json.current_exercise.rep,
    currentExerciseWeight: json.current_exercise.latest_weight,
  }
}

function formReducer(state, action) {
  switch (action.type) {
    case 'INDEX':
      return Object.assign({}, state, {
        type: 'INDEX',
        workoutMessages: action.workoutMessages,
        nextActionType: action.nextActionType,
        currentMenuId: action.currentMenuId,
        currentExerciseId: action.currentExerciseId,
        currentExerciseReps: action.currentExerciseReps,
        currentExerciseWeight: action.currentExerciseWeight,
      });
    case 'SEND_WEIGHT':
      return Object.assign({}, state, {
        type: 'SEND_WEIGHT',
        workoutMessages: action.workoutMessages,
        nextActionType: action.nextActionType,
        currentExerciseWeight: action.currentExerciseWeight,
      });
    case 'SEND_REPS':
      return Object.assign({}, state, {
        type: 'SEND_REPS',
        workoutMessages: action.workoutMessages,
        nextActionType: action.nextActionType,
        currentExerciseWeight: action.currentExerciseWeight,
        currentExerciseId: action.currentExerciseId,
        currentExerciseReps: action.currentExerciseReps,
      });
    case 'CHOOSE_EXERCISE':
      return Object.assign({}, state, {
        type: 'CHOOSE_EXERCISE',
        workoutMessages: action.workoutMessages,
        nextActionType: action.nextActionType,
        currentExerciseWeight: action.currentExerciseWeight,
        currentExerciseId: action.currentExerciseId,
        currentExerciseReps: action.currentExerciseReps,
      });
    case 'SELECT_EXERCISE':
      return Object.assign({}, state, {
        type: 'SELECT_EXERCISE',
        workoutMessages: action.workoutMessages,
        nextActionType: action.nextActionType,
        currentExerciseWeight: action.currentExerciseWeight,
        currentExerciseId: action.currentExerciseId,
        currentExerciseReps: action.currentExerciseReps,
      });
    case 'SKIP_EXERCISE':
      return Object.assign({}, state, {
        type: 'SKIP_EXERCISE',
        workoutMessages: action.workoutMessages,
        nextActionType: action.nextActionType,
        currentExerciseWeight: action.currentExerciseWeight,
        currentExerciseId: action.currentExerciseId,
        currentExerciseReps: action.currentExerciseReps,
      });

    default:
      return state;
  }
}

const initialState = {
  type: "INDEX",
  workoutMessages: [],
  nextActionType: 'assistant_message',
  currentMenuId: null,
  currentExerciseId: null,
};

const store = createStore(formReducer, initialState);

function mapStateToProps(state) {
  window.console.log(state);

  return {
    workoutMessages: state.workoutMessages,
    nextActionType: state.nextActionType,
    currentExerciseId: state.currentExerciseId,
    currentMenuId: state.currentMenuId,
    currentExerciseReps: state.currentExerciseReps,
    currentExerciseWeight: state.currentExerciseWeight,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setWorkouts: (json) => {
      dispatch(setWorkouts(json))
    },
    sendReps: (num) => {
      dispatch(sendReps(num))
    },
    sendWeight: (num) => {
      dispatch(sendWeight(num))
    },
    chooseExercise: (json) => {
      dispatch(chooseExercise(json))
    },
    selectExercise: (json) => {
      dispatch(selectExercise(json))
    },
    skipExercise: (json) => {
      dispatch(skipExercise(json))
    },
  };
}

const FinishWorkoutButton = () => {
  const click = (e) => {
    e.preventDefault();
    location.href="/";
  }

  return (
    <div className="FinishWorkoutButton">
      <a href="" onClick={e => click(e)}>Finish</a>
    </div>
  );
};

class WorkoutMessageContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.fetchMessages(gon.workout_id);
    this.scrollToBottom();
  }

  fetchMessages(id, setWorkouts) {
//    const params = { workout_id: id };
//    const urlParams = new URLSearchParams(Object.entries(params));
    const url = '/api/v1/workouts/' + id;

    return fetch(url, { credentials: 'same-origin' }
    )
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.props.setWorkouts(json);
      return
    })
    .catch((err) => {
      console.error(err);
    });
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    let userInput = null;

    if (this.props.nextActionType !== 'assistant_message') {
      userInput = <WorkoutUserInput nextActionType={this.props.nextActionType} sendWeight={this.props.sendWeight} sendReps={this.props.sendReps} menuId={this.props.currentMenuId} exerciseId={this.props.currentExerciseId} exerciseReps={this.props.currentExerciseReps} weight={this.props.currentExerciseWeight} chooseExercise={this.props.chooseExercise} selectExercise={this.props.selectExercise} skipExercise={this.props.skipExercise} />
    }

    let finishWorkoutButton = null;

    if (this.props.nextActionType === 'finish_workout') {
      finishWorkoutButton = <FinishWorkoutButton />
    }

    return (
      <div style={{
        paddingTop: '16px',
      }}
      >
        <div className="container">
          <WorkoutMessageList workoutMessages={this.props.workoutMessages} />
        </div>
        <div>
          {userInput}
        </div>
        {finishWorkoutButton}
        <div ref={(el) => { this.messagesEnd = el; }}>
        </div>
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

    document.getElementById('workout-container')
  )
})
