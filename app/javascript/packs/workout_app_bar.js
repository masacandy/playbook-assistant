import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

class AppBarReact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const finishPath = "/user/workouts/" + gon.workout_id + "/finish";

    const actions = [
      <FlatButton
        label="キャンセル"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="ワークアウトの終了"
        primary={true}
        href={finishPath}
      />,
    ];

    return (
      <div>
        <AppBar
          title={gon.title}
          showMenuIconButton={true}
          iconElementLeft={<IconButton><NavigationClose /></IconButton>}
          onLeftIconButtonClick={this.handleOpen}
          style={{
            position: 'fixed',
          }}
        />
        <Dialog
          title="途中終了"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
        1度終了したワークアウトは途中から再開することはできませんがよろしいですか？
        </Dialog>
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
