import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton';
import FinishWorkoutButton from './finish_workout_button';

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

export default UserSelectExercise
