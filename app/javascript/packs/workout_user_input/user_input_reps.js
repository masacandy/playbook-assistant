import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import SkipExerciseButton from './skip_exercise_button';
import ExerciseDetailButton from './exercise_detail_button';
import Divider from 'material-ui/Divider';

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
        <div className="UserInputReps">
          <Divider />
          <div className="row" style={{marginBottom: '1px'}}>
            <div className="col s12">
              <div className="col s4" style={{paddingLeft: '0'}}>
                インターバル
              </div>
              <div className="col s8 center">
                <span>
                  {minutes}:{seconds}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="row" style={{marginBottom: '1px'}}>
            <div className="col s12">
              重量
              <div className="col s12 center">
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <input type='tel' style={{height: '2rem', maxWidth: '40px'}} placeholder='0' value={this.state.intWeight} onChange={this.changeIntWeight} onKeyPress={this.handleEnter} />
                  <span style={{marginLeft: '8px', marginRight: '8px'}}>
                    <p>.</p>
                  </span>
                  <input type='tel' style={{height: '2rem', maxWidth: '40px'}} placeholder='0' value={this.state.floatWeight} onChange={this.changeFloatWeight} onKeyPress={this.handleEnter} />
                  <span style={{marginLeft: '8px'}}><p>kg</p></span>
                </div>
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

          <Divider />

          <div className="row">
            <div className="col s12">
              回数
            </div>
            {repsButtonsField}
          </div>

          <Divider />

          <div className="row" style={{marginBottom: '1px'}}>
            <div className="col s6">
              <ExerciseDetailButton exerciseId={this.props.exerciseId} />
            </div>
            <div className="col s6">
              <SkipExerciseButton handleSkipExercise={this.handleSkipExercise} disabled={this.state.isLoading} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserInputReps
