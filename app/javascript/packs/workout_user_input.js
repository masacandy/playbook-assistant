import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

class FinishWorkoutButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false
    }
  }

  handleModalOpen = () => {
    this.setState({openModal: true});
  };

  handleModalClose = () => {
    this.setState({openModal: false});
  };

  render() {
    const finishPath = "/user/workouts/" + gon.workout_id + "/finish";

    const actions = [
      <FlatButton
        label="はい"
        primary={true}
        href={finishPath}
      />,
      <FlatButton
        label="キャンセル"
        primary={false}
        onClick={this.handleModalClose}
      />,
    ];

    return (
      <div className="FinishWorkoutButton">
        <RaisedButton label="本日のワークアウトを終了する"
          secondary={true}
          onClick={this.handleModalOpen}
          fullWidth={true}
          disabled={this.props.disabled}
          disabledBackgroundColor={'gray'}
        />

        <Dialog
          actions={actions}
          open={this.state.openModal}
          onRequestClose={this.handleClose}
        >
        本当にワークアウトを終了しますか？
        </Dialog>
      </div>
    );
  }
};

class UserInputWeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intWeight: '',
      floatWeight: '',
      disabled: true,
    }

    this.changeIntWeight = this.changeIntWeight.bind(this);
    this.changeFloatWeight = this.changeFloatWeight.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  changeIntWeight(event) {
    this.setState({
      intWeight: event.target.value,
      disabled: parseInt(event.target.value + '.' + this.state.floatWeight) >= 0 ? false : true,
    })
  }

  changeFloatWeight(event) {
    this.setState({
      floatWeight: event.target.value,
      disabled: parseInt(this.state.intWeight + '.' + event.target.value) >= 0 ? false : true,
    })
  }

  handleSubmit(event) {
    const url = '/api/v1/workouts/messages/weights';
    const csrfToken = document.getElementsByName('csrf-token').item(0).content;
    const weight = parseFloat(this.state.intWeight + '.' + this.state.floatWeight);

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
        "weight": weight,
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
      return this.props.showErrorLog()
    });
  }

  handleEnter(event) {
    if (event.key === "Enter") {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div className="UserInputWeight container">
        <div className="col s12">
          重量
        </div>

        <div className="col s12 center">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <input type='tel' style={{height: '2rem', maxWidth: '40px'}} placeholder='0' value={this.state.intWeight} onChange={this.changeIntWeight} onKeyPress={this.handleEnter} />
            <span style={{marginLeft: '8px', marginRight: '8px'}}>
              <p>.</p>
            </span>
            <input type='tel' style={{height: '2rem', maxWidth: '40px'}} placeholder='0' value={this.state.floatWeight} onChange={this.changeFloatWeight} onKeyPress={this.handleEnter} />
            <span style={{marginLeft: '8px'}}><p>kg</p></span>
          </div>
        </div>

        <FlatButton label="重さを決定" primary={true} onClick={this.handleSubmit} fullWidth={true} disabled={this.state.disabled} />
      </div>
    );
  }
}

const repsButtonStyle = {
  border: '1px solid #039be5',
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '100%',
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

const SendingReps = () => {
  return (
    <div className="SendingReps col s12" style={{marginTop: '16px', marginBottom: '-8px' }} >
      <p className="center" style={{fontSize: '1.5rem', fontWeight: 'bold'}}>送信中・・・</p>
    </div>
  );
};


class SkipExerciseButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false
    }
  }

  handleModalOpen = () => {
    this.setState({openModal: true});
  };

  handleModalClose = () => {
    this.setState({openModal: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="はい"
        primary={true}
        onClick={this.props.handleSkipExercise}
      />,
      <FlatButton
        label="キャンセル"
        primary={false}
        onClick={this.handleModalClose}
      />,
    ];

    return (
      <div className="SkipExerciseButton">
        <RaisedButton label="このエクササイズをスキップする"
          secondary={true}
          onClick={this.handleModalOpen}
          fullWidth={true}
          disabled={this.props.disabled}
          disabledBackgroundColor={'gray'}
        />

        <Dialog
          actions={actions}
          open={this.state.openModal}
          onRequestClose={this.handleClose}
        >
        本当にこのエキササイズをスキップしますか？
        </Dialog>
      </div>
    );
  }
};



class UserInputReps extends React.Component {
  constructor(props) {
    super(props);

    let floatWeight = String(this.props.weight).split(".")[1];

    if (String(this.props.weight).split(".")[1] == undefined) {
      floatWeight = '0';
    }

    this.state = {
      intWeight: String(this.props.weight).split(".")[0],
      floatWeight: floatWeight,
      isLoading: false,
      secondsElapsed: 0,
      minutesElapsed: 0,
    }

    this.changeIntWeight = this.changeIntWeight.bind(this);
    this.changeFloatWeight = this.changeFloatWeight.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSkipExercise = this.handleSkipExercise.bind(this);
    this.plusTwoPointFiveKgWeight = this.plusTwoPointFiveKgWeight.bind(this);
    this.minusTwoPointFiveKgWeight = this.minusTwoPointFiveKgWeight.bind(this);
  }

  changeIntWeight(event) {
    this.setState({
      intWeight: event.target.value,
    })
  }

  changeFloatWeight(event) {
    this.setState({
      floatWeight: event.target.value,
    })
  }

  minusTwoPointFiveKgWeight() {
    const weight = parseFloat(this.state.intWeight + '.' + this.state.floatWeight) - 2.5;

    const intWeight = String(weight).split(".")[0];
    const floatWeight = String(weight).split(".")[1] || 0;

    this.setState({
      intWeight: intWeight,
      floatWeight: floatWeight,
    })
  }

  plusTwoPointFiveKgWeight(event) {
    const weight = parseFloat(this.state.intWeight + '.' + this.state.floatWeight) + 2.5;

    const intWeight = String(weight).split(".")[0];
    const floatWeight = String(weight).split(".")[1] || 0;

    this.setState({
      intWeight: intWeight,
      floatWeight: floatWeight,
    })
  }

  handleClick(event) {
    this.setState({ isLoading: true })

    const url = '/api/v1/workouts/messages/reps';
    const csrfToken = document.getElementsByName('csrf-token').item(0).content;
    const weight = parseFloat(this.state.intWeight + '.' + this.state.floatWeight);

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
        "weight": weight,
      })
    })
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.setState({ isLoading: false })

      return this.props.sendReps(json)
    })
    .catch((err) => {
      this.setState({ isLoading: false })
      console.error(err);
      return this.props.showErrorLog()
    });
  }

  handleSkipExercise(event) {
    this.setState({ isLoading: true })

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
      this.setState({ isLoading: false })

      return this.props.skipExercise(json)
    })
    .catch((err) => {
      this.setState({ isLoading: false })
      console.error(err);
      return this.props.showErrorLog()
    });
  }

  tick = () => {
    let seconds = this.state.secondsElapsed + 1;
    let minutes = this.state.minutesElapsed;

    if (seconds == 60) {
      seconds = 0;
      minutes = minutes + 1;
    }

    this.setState({
      secondsElapsed: seconds,
      minutesElapsed: minutes,
    });
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  render() {
    let repsButtonsField = <RepsButtons className="col s12" exerciseReps={this.props.exerciseReps} handleClick={this.handleClick} />

    if (this.state.isLoading) {
      repsButtonsField = <SendingReps className="center" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}/>
    }

    let seconds;
    let minutes;
    if (this.state.secondsElapsed < 10) {
      seconds = "0" + String(this.state.secondsElapsed);
    } else {
      seconds = String(this.state.secondsElapsed);
    }

    if (this.state.minutesElapsed < 10) {
      minutes = "0" + String(this.state.minutesElapsed);
    } else {
      minutes = String(this.state.minutesElapsed);
    }

    return(
      <div>
        <div className="UserInputReps row">
          <div>
            <div className="col s12">
              インターバル
            </div>
            <div className="col s12 center">
              <div style={{
                display: 'flex',
                justifyContent: 'center',
              }}>

                {minutes}:{seconds}
              </div>
            </div>

            <div className="col s12">
              <hr style={{borderTopWidth: '0'}}/>

              重量
            </div>
            <div className="col s12 center">
              <div style={{
                display: 'flex',
                justifyContent: 'center',
              }}>
                <input type='tel' style={{height: '2rem', maxWidth: '40px'}} placeholder='0' value={this.state.intWeight} onChange={this.changeIntWeight} onKeyPress={this.handleEnter} />
                <span style={{marginLeft: '8px', marginRight: '8px'}}>
                  <p>.</p>
                </span>
                <input type='tel' style={{height: '2rem', maxWidth: '40px'}} placeholder='0' value={this.state.floatWeight} onChange={this.changeFloatWeight} onKeyPress={this.handleEnter} />
                <span style={{marginLeft: '8px'}}><p>kg</p></span>
              </div>
            </div>
            <FlatButton
              label="+2.5kg"
              className="col s6"
              primary={true}
              onClick={this.plusTwoPointFiveKgWeight}
              disabled={this.state.isLoading}
            />
            <FlatButton
              label="-2.5kg"
              className="col s6"
              primary={true}
              onClick={this.minusTwoPointFiveKgWeight}
              disabled={this.state.isLoading}
            />
          </div>
          <div>
            <div className="col s12">
              <hr style={{borderTopWidth: '0'}}/>
              回数
            </div>
            {repsButtonsField}
          </div>
        </div>

        <SkipExerciseButton handleSkipExercise={this.handleSkipExercise} disabled={this.state.isLoading} />
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
        <div className="UserChooseExercise row" style={{marginBottom: '8px'}}>
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
