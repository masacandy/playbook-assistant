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
    return(
      <div className="UserInputReps">
        <RepsButtons exerciseReps={this.props.exerciseReps} handleClick={this.handleClick} />
      </div>
    );
  }
}

class UserSelectExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unfinishedExercises: [],
      exerciseId: null,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.fetchUndoneExercises(gon.workout_id);
  }

  fetchUndoneExercises(id) {
    const params = { workout_id: id, menu_id: this.props.menuId };
    const urlParams = new URLSearchParams(Object.entries(params));

    const url = '/api/v1/workouts/messages/exercises/unfinished?' + urlParams

    return fetch(url, { credentials: 'same-origin' }
    )
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
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    const url = '/api/v1/workouts/messages/exercises/select'

    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type':'application/json'},
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
      return this.props.selectExercise(json)
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    const options = this.state.unfinishedExercises.map(function(exercise) {
      return <option value={exercise.id} key={exercise.id}>{exercise.name}</option>
    });

    return (
      <div className="UserInputExercise">
        <form onSubmit={this.handleSubmit}>
          <select value={this.state.exerciseId} onChange={this.handleChange}>
            {options}
          </select>
          <input type="submit" value="決定" />
        </form>
      </div>
    );
  }
}

class UserChooseExercise extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const url = '/api/v1/workouts/messages/exercises/choose'
    const answer = event.target.value === "はい" ? true : false

    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type':'application/json'},
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
      return this.props.chooseExercise(json)
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="UserChooseExercise">
        <input type="button" value="はい" onClick={this.handleClick} />
        <input type="button" value="いえ、違う種目にします" onClick={this.handleClick} />
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
    } else if (nextActionType === 'user_select_exercise') {
      userInput = <UserSelectExercise menuId={this.props.menuId} selectExercise={this.props.selectExercise} />
    } else if (nextActionType === 'user_choose_exercise') {
      userInput = <UserChooseExercise exerciseId={this.props.exerciseId} menuId={this.props.menuId} chooseExercise={this.props.chooseExercise} />
    }

    return (
      <div className="WorkoutUserInput">
        {userInput}
      </div>
    );
  }
};

export default WorkoutUserInput
