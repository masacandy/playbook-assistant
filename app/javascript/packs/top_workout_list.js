import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class ListItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      exercises: {},
      selectedMenuId: null,
      selectedMenuName: {},
    }
  }

  fetchExercise = (menu_id) => {
    const url = '/api/v1/menus/' + menu_id;

    return fetch(url, {
      credentials: 'same-origin',
    }).then((response) => {
      if (!response.ok) throw new error("invalid");
      return response.json();
    })
    .then((json) => {
      this.setState({
        exercises: Object.assign(
          this.state.exercises,
          { [menu_id]: json.exercises.map(function(exercise) { return exercise.name }) },
        ),
        selectedMenuId: json.id,
        selectedMenuName: Object.assign(
          this.state.selectedMenuName,
          { [menu_id]: json.name }
        ),
        dialogOpen: true,
      });

      return
    })
    .catch((err) => {
      console.error(err);
    });


  };

  handleOpen(menu_id) {
    if (this.state.exercises[menu_id]) {
      this.setState({
        dialogOpen: true,
        selectedMenuId: menu_id,
      });

      return
    }

    this.fetchExercise(menu_id);
  };

  handleClose = () => {
    this.setState({
      dialogOpen: false,
      selectedMenuId: null,
    });
  };

  handleStart = (menu_id) => {
    const url = '/api/v1/workouts';
    const csrftoken = document.getElementsByName('csrf-token').item(0).content;

    return fetch(url, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'content-type':'application/json',
        'x-csrf-token': csrftoken,
      },
      body: JSON.stringify({
        workout: { menu_id: menu_id },
      })
    }).then((response) => {
      if (!response.ok) throw new error("invalid");
      return response.json();
    })
    .then((json) => {
      location.href = "/user/workouts/" + json.workout.id;

      return
    })
    .catch((err) => {
      console.error(err);
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="戻る"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="開始"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleStart.bind(this, this.state.selectedMenuId)}
      />,
    ];

    const originalThis = this;
    const listItems = gon.user_menus.map(function(menu) {
      return (
        <div>
          <ListItem
            primaryText={menu.name}
            onClick={originalThis.handleOpen.bind(originalThis, menu.id)}
            value={menu.id}
            //メニューの説明や最後に行った日を入れられるようにする
            //secondaryText="Jan 9, 2014"
          />
          <Divider />

        </div>
      )
    });

    let exercises = null;
    let title = null;
    if (this.state.selectedMenuId) {
      exercises = this.state.exercises[this.state.selectedMenuId].map(function(exercise) {
        return (
          <div>
            {exercise}
            <Divider />
          </div>
        )
      });

      title = this.state.selectedMenuName[this.state.selectedMenuId] + "のワークアウト";
    }

    return (
      <div className="ListItems">
        {listItems}
        <Dialog
          title={title}
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          {exercises}
        </Dialog>
      </div>
    );
  }
};

const ListExampleFolder = () => (
  <List>
    <Subheader style={{paddingTop: '8px'}}>登録ワークアウト</Subheader>

    <ListItems />
  </List>
);


class TopWorkoutList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <ListExampleFolder />
      </div>
    )
  }
}

const App = () => {
  return (
    <MuiThemeProvider>
      <TopWorkoutList />
    </MuiThemeProvider>
  )
}

document.addEventListener('turbolinks:load', () => {
//document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('top_workout_list')
  )
})
