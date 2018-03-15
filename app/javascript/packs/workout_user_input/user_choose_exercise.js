import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton';
import FinishWorkoutButton from './finish_workout_button';
import ExerciseDetailButton from './exercise_detail_button';
import Divider from 'material-ui/Divider';

class UserChooseExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    }

    this.yesClick = this.handleClick.bind(this, true);
    this.noClick = this.handleClick.bind(this, false);
  }

  handleClick(answer) {
    this.setState = { isLoading: true }

    const url = '/api/v1/workouts/messages/exercises/choose';
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
        "exercise_id": this.props.exerciseId,
        "menu_id": this.props.menuId,
        "answer": answer,
      })
    })
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.setState = { isLoading: false }

      return this.props.chooseExercise(json)
    })
    .catch((err) => {
      this.setState = { isLoading: false }
      console.error(err);
      return this.props.showErrorLog()
    });
  }

  render() {
    return (
      <div>
        <div className="UserChooseExercise row" style={{marginBottom: '0'}}>
          <ExerciseDetailButton exerciseId={this.props.exerciseId} />
          <Divider />
          <FlatButton
            label="はい"
            primary={true}
            onClick={this.yesClick}
            className="col s6"
            disabled={this.state.isLoading}
          />

          <FlatButton
            label="違う種目を選択"
            primary={false}
            onClick={this.noClick}
            className="col s6"
            disabled={this.state.isLoading}
          />
        </div>

        <FinishWorkoutButton disabled={this.state.isLoading} />
      </div>
    );
  }
}

export default UserChooseExercise
