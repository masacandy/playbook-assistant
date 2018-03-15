import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

const ExerciseDetailContents = (props) => {
  return (
    <div className="ExerciseDetailContents">
      <div className="center-align">
        <img src={props.imageUrl} />
      </div>
      <div>
        <a href={props.detailUrl} target="_blank">
          <FlatButton primary={true} fullWidth={true} label="詳細解説ページを開く" />
        </a>
      </div>
      <div>
        <a href={props.youtubeUrl} target="_blank">
          <FlatButton primary={true} fullWidth={true} label="YouTubeリンクを開く" />
        </a>
      </div>
    </div>
  );
};

export default ExerciseDetailContents
