import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class UserInputWeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: 0,
    }

    this.changeWeight = this.changeWeight.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  changeWeight(event) {
    this.setState({
      weight: event.target.value,
    })
  }

  handleSubmit(event) {
    const url = '/api/v1/workouts/messages/weights'

    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "workout_id": gon.workout_id,
        "menu_id": this.props.menuId,
        "exercise_id": this.props.exerciseId,
        "weight": this.state.weight,
      })
    })
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      return this.props.sendWeight(json)
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleEnter(event) {
    if (event.key === "Enter") {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div className="UserInputWeight">
        <input type='number' value={this.state.weight} onChange={this.changeWeight} onKeyPress={this.handleEnter} />
        kg
        <button onClick={this.handleSubmit}>
          Submit
        </button>
      </div>
    );
  }
}

const RepsButtons = (props) => {
  const repsButtons = [...Array(props.exerciseReps)].map(function(_, rep) {
    return (
      <input type="button" value={rep + 1} onClick={props.handleClick} />
    )
  });

  return (
    <div className="RepsButtons">
      {repsButtons}
    </div>
  );
};


class UserInputReps extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const url = '/api/v1/workouts/messages/reps'

    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "workout_id": gon.workout_id,
        "menu_id": this.props.menuId,
        "exercise_id": this.props.exerciseId,
        "reps": event.target.value,
        "weight": this.props.weight,
      })
    })
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      return this.props.sendReps(json)
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="UserInputReps">
        <RepsButtons exerciseReps={this.props.exerciseReps} handleClick={this.handleClick} />
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
      userInput = <UserInputWeight sendWeight={this.props.sendWeight} menuId={this.props.menuId} exerciseId={this.props.exerciseId} />
    } else if (nextActionType === 'user_input_reps') {
      userInput = <UserInputReps sendReps={this.props.sendReps} menuId={this.props.menuId} exerciseId={this.props.exerciseId} exerciseReps={this.props.exerciseReps} weight={this.props.weight} />
    }

    return (
      <div className="WorkoutUserInput">
        {userInput}
      </div>
    );
  }
};

export default WorkoutUserInput
