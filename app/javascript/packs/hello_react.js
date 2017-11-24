// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';

function send(name) {
  let type = 'REACT'
  if (name === "React") {
    type = 'DAVID'
  };

  return {
    type
  };
}

function formReducer(state, action) {
  switch (action.type) {
    case 'REACT':
      return Object.assign({}, state, {
        name: 'React',
      });
    case 'DAVID':
      return Object.assign({}, state, {
        name: 'David',
      });
    default:
      return state;
  }
}

const initialState = {
  name: 'David',
};

const store = createStore(formReducer, initialState);


class SubmittedMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.message,
    }
  }

  render() {
    return (
      <div>
        <h2>{this.state.message}</h2>
      </div>
    )
  }
}

const Message = () => {
  return (
    <div> yay </div>
    )
}


class ButtonTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      textValue: 'text',
      submitted: [],
    };

    this.changeText = this.changeText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  changeText(event) {
    this.setState({
      textValue: event.target.value,
    });
  }

  handleSubmit(event) {
    const array = this.state.submitted
    array.push(this.state.textValue);
    this.setState({
      submitted: array,
    });
  }

  handleEnter(event) {
    if (event.key === "Enter") {
      console.log(event.key === "Enter");
      this.handleSubmit();
    }
  }

  render() {
    const messages = [];
    const submittedMessages = [];

    for (var i = 0; i < this.state.num; i += 1) {
      messages.push(<Message />)
    }

    for (var i = 0; i <this.state.submitted.length; i +=1) {
      submittedMessages.push(<SubmittedMessage message={this.state.submitted[i]} />)
    }

    return (
      <div>
        <button onClick={() => this.props.handleClick(this.props.name)}>Change Name</button>
        <div>
          {messages}
        </div>
        <button onClick={() => this.setState({ num: this.state.num + 1})}>
          Add Message
        </button>
        <div>
          {submittedMessages}
        </div>
        <input type="text" value={this.state.textValue} onChange={this.changeText} onKeyPress={this.handleEnter}  />
        <button onClick={this.handleSubmit}>
          Submit
        </button>
      </div>
    )
  }
}

class Hello extends React.Component {
  render() {
    return (
      <div>
        <h1> Hello {this.props.name}! </h1>
        <ButtonTest handleClick={this.props.onClick} name={this.props.name} />
      </div>
    )
  }
}

// Hello.defaultProps = {
//   name: 'David'
// }
//
Hello.propTypes = {
  name: PropTypes.string
}

function mapStateToProps(state) {
  window.console.log(state);
  return {
    name: state.name,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onClick(name) {
      dispatch(send(name));
    },
  };
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Hello);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer />
    </Provider>,
    document.body.appendChild(document.createElement('div')),
  )
})
