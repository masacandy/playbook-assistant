import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import ExerciseDetailContents from './exercise_detail_contents'

class ExerciseDetailButton extends React.Component {
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

  componentDidMount() {
    this.fetchExercise(this.props.exerciseId);
  }

  fetchExercise(id) {
    const url = '/api/v1/exercises/' + id;

    return fetch(url, { credentials: 'same-origin' }
    )
    .then((response) => {
      if (!response.ok) throw new Error("invalid");
      return response.json();
    })
    .then((json) => {
      this.setState({
        exerciseName: json.name,
        imageUrl: json.image_url,
        detailUrl: json.detail_url,
        youtubeUrl: json.youtube_url,
      });

      return
    })
    .catch((err) => {
      console.error(err);
    });
  };

  render() {
    const actions = [
      <FlatButton
        label="戻る"
        primary={true}
        onClick={this.handleModalClose}
      />
    ];

    return (
      <div className="FinishWorkoutButton">
        <FlatButton label="詳細"
          secondary={false}
          onClick={this.handleModalOpen}
          fullWidth={true}
          disabled={this.props.disabled}
          disabledBackgroundColor={'gray'}
        />

        <Dialog
          title={this.state.exerciseName}
          actions={actions}
          open={this.state.openModal}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        { this.state.exerciseName &&
          <ExerciseDetailContents
            imageUrl={this.state.imageUrl}
            detailUrl={this.state.detailUrl}
            youtubeUrl={this.state.youtubeUrl} />
        }
        </Dialog>
      </div>
    );
  }
};

export default ExerciseDetailButton;
