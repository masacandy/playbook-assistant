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
    this.props.sendWeight(this.state.weight);
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

class WorkoutUserInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const nextActionType = this.props.nextActionType
    let userInput = null;

    if (nextActionType === 'user_input_weight') {
      userInput = <UserInputWeight sendWeight={this.props.sendWeight} />
    }

    return (
      <div className="WorkoutUserInput">
        {userInput}
      </div>
    );
  }
};

export default WorkoutUserInput
