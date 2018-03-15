import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import FinishWorkoutButton from './workout_user_input/finish_workout_button';
import UserInputWeight from './workout_user_input/user_input_weight';
import UserChooseExercise from './workout_user_input/user_choose_exercise';
import UserInputReps from './workout_user_input/user_input_reps';
import Divider from 'material-ui/Divider';

class UserSelectExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unfinishedExercises: [],
      exerciseId: null,
      isLoading: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.fetchUndoneExercises(gon.workout_id);
  }

  fetchUndoneExercises(id) {
    var params = {
      workout_id: id,
      menu_id: this.props.menuId,
    };

    var esc = encodeURIComponent;
    var query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

    const url = '/api/v1/workouts/messages/exercises/unfinished?' + query

    return fetch(url, {
      credentials: 'same-origin',
    })
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.setState({
        unfinishedExercises: json.unfinished_exercises,
        exerciseId: json.unfinished_exercises[0].id,
      })
      return
    })
    .catch((err) => {
      console.error(err);
      return this.props.showErrorLog()
    });
  };

  handleSubmit(event) {
    this.setState = { isLoading: true }

    event.preventDefault();
    const url = '/api/v1/workouts/messages/exercises/select';
    const csrfToken = document.getElementsByName('csrf-token').item(0).content;

    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type':'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        "workout_id": gon.workout_id,
        "exercise_id": this.state.exerciseId,
        "menu_id": this.props.menuId,
      })
    })
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.setState = { isLoading: false }

      return this.props.selectExercise(json)
    })
    .catch((err) => {
      this.setState = { isLoading: false }
      console.error(err);
      return this.props.showErrorLog()
    });
  }

  handleChange(event) {
    this.setState({exerciseId: event.target.value});
  }

  render() {
    const options = this.state.unfinishedExercises.map(function(exercise) {
      return <option value={exercise.id} key={exercise.id}>{exercise.name}</option>
    });

    return (
      <div className="UserInputExercise row" style={{marginBottom: '0'}}>
        <div className="col s12" style={{ marginBottom: '8px'}}>
          次に行う種目を選択
        </div>

        <select value={this.state.exerciseId} onChange={this.handleChange} style={{display: 'initial', marginBottom: '8px'}}>
          {options}
        </select>

        <RaisedButton label="決定" primary={true} onClick={this.handleSubmit} fullWidth={true} disabled={this.state.isLoading} disabledBackgroundColor='gray' />

        <FinishWorkoutButton disabled={this.state.isLoading} />
      </div>
    );
  }
}

class WorkoutUserInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const nextActionType = this.props.nextActionType
    let userInput = null;

    if (nextActionType === 'user_input_weight') {
      userInput = <UserInputWeight sendWeight={this.props.sendWeight} menuId={this.props.menuId} exerciseId={this.props.exerciseId} showErrorLog={this.props.showErrorLog} />
    } else if (nextActionType === 'user_input_reps') {
      userInput = <UserInputReps sendReps={this.props.sendReps} menuId={this.props.menuId} exerciseId={this.props.exerciseId} exerciseReps={this.props.exerciseReps} weight={this.props.weight} skipExercise={this.props.skipExercise} showErrorLog={this.props.showErrorLog} />
    } else if (nextActionType === 'user_select_exercise') {
      userInput = <UserSelectExercise menuId={this.props.menuId} selectExercise={this.props.selectExercise} showErrorLog={this.props.showErrorLog} />
    } else if (nextActionType === 'user_choose_exercise') {
      userInput = <UserChooseExercise exerciseId={this.props.exerciseId} menuId={this.props.menuId} chooseExercise={this.props.chooseExercise} showErrorLog={this.props.showErrorLog} />
    }

    if (userInput) {
      return (
        <div className="WorkoutUserInput">
          <MuiThemeProvider>
            <Divider />
            {userInput}
          </MuiThemeProvider>
        </div>
      );
    } else {
      return (
        <div></div>
      )
    }
  }
};

export default WorkoutUserInput
