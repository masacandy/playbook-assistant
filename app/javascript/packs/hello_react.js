// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

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
    }
    this.changeText = this.changeText.bind(this)
  }

  changeText(e) {
    this.setState({
      num: this.num + 1,
      textValue: e.target.value
    });
  }

  render() {
    const messages = [];

    for (var i = 0; i < this.state.num; i += 1) {
      messages.push(<Message />)
    }

    return (
      <div>
        <button onClick={this.props.change}>
          Change Name
        </button>
        <div>
          {messages}
        </div>
        <button onClick={() => this.setState({ num: this.state.num + 1})}>
          Add Message
        </button>
        <input type="text" value={this.state.textValue} onChange={this.changeText} />
      </div>
    )
  }
}

class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
    }
    this.changeNames = this.changeNames.bind(this)
  }

  changeNames() {
    var name = "React";
    if (this.state.name === "React") {
      name = "David"
    };
    this.setState({
      name: name
    });
  }


  render() {
    return (
  <div>
    <h1> Hello {this.state.name}! </h1>
    <ButtonTest change={this.changeNames} />
  </div>
  )
  }
}

Hello.defaultProps = {
  name: 'David'
}

Hello.propTypes = {
  name: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Hello />,
    document.body.appendChild(document.createElement('div')),
  )
})
