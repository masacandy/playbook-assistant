import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton';

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

export default UserInputWeight
