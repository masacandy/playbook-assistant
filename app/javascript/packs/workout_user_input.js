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
import UserSelectExercise from './workout_user_input/user_select_exercise';
import Divider from 'material-ui/Divider';

class WorkoutUserInput extends React.Component {
  constructor(props) { super(props);
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
