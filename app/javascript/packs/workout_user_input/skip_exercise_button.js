import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

class SkipExerciseButton extends React.Component {
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
    const actions = [
      <FlatButton
        label="はい"
        primary={true}
        onClick={this.props.handleSkipExercise}
      />,
      <FlatButton
        label="キャンセル"
        primary={false}
        onClick={this.handleModalClose}
      />,
    ];

    return (
      <div className="SkipExerciseButton">
        <FlatButton label="スキップ"
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
        本当にこのエキササイズをスキップしますか？
        </Dialog>
      </div>
    );
  }
};

export default SkipExerciseButton
