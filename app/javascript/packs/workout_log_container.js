import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

const WorkoutLogList = (props) => {
  console.log(props.workoutLog[0]);
  const workoutLogList = props.workoutLog.map(function(log) {
    let size = 12 / log.sets.length;
    const colSize = "col s" + size;

    const detail = log.sets.map(function(set) {
     return (
        <div>
          <div className={colSize}>
            {set.weight}kg / {set.rep}回
          </div>
        </div>
      )
    })

    return (
      <div style={{
        borderBottom: '1px solid rgb(224, 224, 224)',
        marginTop: '20px',
      }}>
        <div style={{
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          {log.name}
        </div>

        <div className="row">
          {detail}
        </div>
      </div>
    )
  })

  return (
    <div className="WorkoutLogList">
      <div className="container">
        {workoutLogList}
      </div>
      <RaisedButton label="TOPへ戻る" primary={true} href="/" fullWidth={true} />
    </div>
  );
};

class WorkoutLogContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      workoutLog: [],
    }
  }

  componentDidMount() {
    this.fetchWorkoutLogs(gon.workout_id);
  }

  fetchWorkoutLogs(id, setWorkouts) {
    const url = '/api/v1/workouts/' + id + '/finished_log';

    return fetch(url, { credentials: 'same-origin' }
    )
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.setState({
        workoutLog: json.workout_log,
      })

      return
    })
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    return (
      <div style={{
        paddingTop: '16px',
      }}
      >
        <WorkoutLogList workoutLog={this.state.workoutLog} />
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <MuiThemeProvider>
      <WorkoutLogContainer />
    </MuiThemeProvider>,
    document.getElementById('workout-log')
  )
})
