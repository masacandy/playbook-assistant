import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

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
    const url = '/api/v1/workouts/messages/weights';
    const csrfToken = document.getElementsByName('csrf-token').item(0).content;

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'same-origin',
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
        <div className="col s12">
          <div className="input-field inline">
            <input type='number' value={this.state.weight} onChange={this.changeWeight} onKeyPress={this.handleEnter} />
          </div>
          kg
        </div>
        <button onClick={this.handleSubmit}>
          Submit
        </button>
      </div>
    );
  }
}

const repsButtonStyle = {
  border: '1px solid #039be5',
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '80%',
  height: '100%',
  color: '#039be5',
  fontSize: '1.8rem',
  borderWidth: '2px',
}

const RepsButtons = (props) => {
  const colNum = "col s3 center";

  const repsButtons = [...Array(props.exerciseReps)].map(function(_, rep) {
    return (
      <div className={colNum} style={{marginBottom: '16px', height: '48px'}} >
        <input type="button" value={rep + 1} onClick={props.handleClick} style={repsButtonStyle}/>
      </div>
    )
  });

  return (
    <div className="RepsButtons col s12" style={{marginTop: '16px', marginBottom: '-8px' }} >
      {repsButtons}
    </div>
  );
};

const SkipExerciseButton = (props) => {
  return (
    <div className="SkipExerciseButton">
      <RaisedButton label="このエクササイズをスキップする" secondary={true} onClick={props.handleSkipExercise} fullWidth={true} />
    </div>
  );
};



class UserInputReps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: this.props.weight,
    }

    this.changeWeight = this.changeWeight.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSkipExercise = this.handleSkipExercise.bind(this);
  }

  changeWeight(event) {
    this.setState({
      weight: event.target.value,
    })
  }

  handleClick(event) {
    const url = '/api/v1/workouts/messages/reps';
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
        "menu_id": this.props.menuId,
        "exercise_id": this.props.exerciseId,
        "reps": event.target.value,
        "weight": this.state.weight,
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

  handleSkipExercise(event) {
    const url = '/api/v1/workouts/messages/skip';
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
      })
    })
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      return this.props.skipExercise(json)
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    return(
      <div>
        <div className="UserInputReps row">
          <div>
            <div className="col s12">
              重量
            </div>
            <div className="col s12 center">
              <div className="input-field inline">
                <input type='number' value={this.state.weight} onChange={this.changeWeight} />
              </div>
              kg
            </div>
          </div>
          <div>
            <div className="col s12">
              <hr style={{borderTopWidth: '0'}}/>
              回数
            </div>
            <RepsButtons className="col s12" exerciseReps={this.props.exerciseReps} handleClick={this.handleClick} />
          </div>
        </div>

        <SkipExerciseButton handleSkipExercise={this.handleSkipExercise} />
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
      return this.props.selectExercise(json)
    })
    .catch((err) => {
      console.error(err);
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

        <RaisedButton label="決定" primary={true} onClick={this.handleSubmit} fullWidth={true} />
      </div>
    );
  }
}

class UserChooseExercise extends React.Component {
  constructor(props) {
    super(props);

    this.yesClick = this.handleClick.bind(this, true);
    this.noClick = this.handleClick.bind(this, false);
  }

  handleClick(answer) {
    const url = '/api/v1/workouts/messages/exercises/choose';
    const csrfToken = document.getElementsByName('csrf-token').item(0).content;
    console.log(answer);

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
      return this.props.chooseExercise(json)
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="UserChooseExercise row">
        <FlatButton
          label="はい"
          primary={true}
          onClick={this.yesClick}
          className="col s6"
        />

        <FlatButton
          label="違う種目を選択"
          primary={false}
          onClick={this.noClick}
          className="col s6"
        />
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
      userInput = <UserInputReps sendReps={this.props.sendReps} menuId={this.props.menuId} exerciseId={this.props.exerciseId} exerciseReps={this.props.exerciseReps} weight={this.props.weight} skipExercise={this.props.skipExercise} />
    } else if (nextActionType === 'user_select_exercise') {
      userInput = <UserSelectExercise menuId={this.props.menuId} selectExercise={this.props.selectExercise} />
    } else if (nextActionType === 'user_choose_exercise') {
      userInput = <UserChooseExercise exerciseId={this.props.exerciseId} menuId={this.props.menuId} chooseExercise={this.props.chooseExercise} />
    }

    if (userInput) {
      return (
        <div className="WorkoutUserInput">
          <hr style={{borderTopWidth: '0'}} />
          <MuiThemeProvider>
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
