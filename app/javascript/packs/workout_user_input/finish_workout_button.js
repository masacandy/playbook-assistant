import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

class FinishWorkoutButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false
    }
  }

  handleModalOpen = () => {
    this.setState({openModal: true});
  };

  handleModalClose = () => {
    this.setState({openModal: false});
  };

  render() {
    const finishPath = "/user/workouts/" + gon.workout_id + "/finish";

    const actions = [
      <FlatButton
        label="はい"
        primary={true}
        href={finishPath}
      />,
      <FlatButton
        label="キャンセル"
        primary={false}
        onClick={this.handleModalClose}
      />,
    ];

    return (
      <div className="FinishWorkoutButton">
        <RaisedButton label="本日のワークアウトを終了する"
          secondary={true}
          onClick={this.handleModalOpen}
          fullWidth={true}
          disabled={this.props.disabled}
          disabledBackgroundColor={'gray'}
        />

        <Dialog
          actions={actions}
          open={this.state.openModal}
          onRequestClose={this.handleClose}
        >
        本当にワークアウトを終了しますか？
        </Dialog>
      </div>
    );
  }
};

export default FinishWorkoutButton
