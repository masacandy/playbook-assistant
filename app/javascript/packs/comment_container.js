import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import CommentList from './comment_list'

class CommentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: gon.comments,
    };
    this.fetchAPI = this.fetchAPI.bind(this);
  }

  fetchAPI() {
    fetch('/api/v1/test')
      .then((response) => {
        if (!response.ok) throw new Error("invalid");
        return response.json();
      })
      .then((result) => {
        const comments = this.state.comments;
        comments.push(result.comments[0]);
        this.setState({ comments: comments });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    console.log(this.state.comments);
    return (
      <div className="CommentContainer">
        <h1>Comments</h1>
        <CommentList comments={this.state.comments} />
        <button onClick={this.fetchAPI}>
          AddComment
        </button>
      </div>
    );
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CommentContainer />,
    document.body.appendChild(document.createElement('div')),
  )
})
