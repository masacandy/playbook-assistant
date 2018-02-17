import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ActionInfo from 'material-ui/svg-icons/action/info';

class ListItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  handleClick(menu_id) {
    this.setState = { isLoading: true }

    const url = '/api/v1/workouts';
    const csrfToken = document.getElementsByName('csrf-token').item(0).content;

    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type':'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        workout: { menu_id: menu_id },
      })
    }).then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.setState = { isLoading: false }

      location.href = "/user/workouts/" + json.workout.id;

      return
    })
    .catch((err) => {
      this.setState = { isLoading: false }
      console.error(err);
    });
  }

  render() {
    const originalThis = this;
    const listItems = gon.user_menus.map(function(menu) {
      return (
        <ListItem
          rightIcon={<ActionInfo />}
          primaryText={menu.name}
          onClick={originalThis.handleClick.bind(originalThis, menu.id)}
          disabled={originalThis.state.isLoading}
          value={menu.id}
          //メニューの説明や最後に行った日を入れられるようにする
          //secondaryText="Jan 9, 2014"
        />
      )
    });

    return (
      <div className="ListItems">
        {listItems}
      </div>
    );
  }
};

const ListExampleFolder = () => (
  <List>
    <Subheader inset={true}>登録ワークアウト</Subheader>

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
