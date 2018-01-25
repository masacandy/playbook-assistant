import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

class Logout extends React.Component {
  static muiName = 'FlatButton';

  render() {
    const logoutPath = '/users/sign_out';

    return (
      <FlatButton {...this.props} label="Logout" href={logoutPath}/>
    );
  }
}

class AppBarReact extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let logout;

    if (gon.logged) {
      logout = <Logout />
    }

    return (
      <div>
        <AppBar
          title="週２筋トレ部"
          showMenuIconButton={false}
          iconElementRight={logout}
          style={{
            position: 'fixed',
            marginTop: '-14px',
          }}
        />
      </div>
    )
  }
}

const App = () => {
  return (
    <MuiThemeProvider>
      <AppBarReact />
    </MuiThemeProvider>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('app_bar')
  )
})
