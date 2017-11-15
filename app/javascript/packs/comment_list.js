import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const CommentList = (props) => {
  const comments = props.comments.map(function(comment) {
    return (
      <div>
        {comment.comment}
      </div>
    )
  });
  return (
    <div className="CommentList">
      {comments}
    </div>
  );
};

export default CommentList
