import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Avatar from 'react-avatar';
import moment from 'moment';
import CommentCss from '../Style/Comment.module.css';

function Comment(props) {
  const [editBool, setEditBool] = useState(false);
  const [commentInfo, setCommentInfo] = useState(props.comment.comment);
  
  const user = useSelector((state) => state.user);

  const submitHandler = () => {
    let body = {
        uid: user.uid,
        comment: commentInfo,
        postId: props.comment.postId,
        commentId: props.comment._id,
    };
    axios.post('/api/comment/edit', body).then((res) => {
        if (res.data.success) {
            alert('Comment has been edited.');
        } else {
            alert('Comment has not been edited. Please try again.');
        }
        return window.location.reload();
    });
  }

  const deleteHandler = () => {
    if (window.confirm('Delete?')) {
        let body = {
            commentId: props.comment._id,
            postId: props.comment.postId,
        };
        axios.post('/api/comment/delete', body).then((res) => {
            if (res.data.success) {
                alert('Comment has been deleted.');
                window.location.reload();
            }
        }).catch((err) => {
            alert('Comment has not been deleted. Please try again.');
        });
    }
  }

  const setTime = (createdAt, updatedAt) => {
    if (createdAt !== updatedAt) {
      return moment(updatedAt).format('MMMM Do YYYY, hh:mma') + ' (Edited)';
    } else {
      return moment(createdAt).format('MMMM Do YYYY, hh:mma');
    }
  }

  return (
    <div className={CommentCss.wrapper}>
        {editBool ? 
        <div>
            <input className={CommentCss.input} type='text' value={commentInfo} onChange={(e) => {setCommentInfo(e.currentTarget.value)}} />
            <div className={CommentCss.commentBtn}>
                <button className={CommentCss.submit} onClick={() => {submitHandler()}}>Submit</button>
                <button className={CommentCss.cancel} onClick={() => {setEditBool(false)}}>Cancel</button>
            </div>
        </div> :
        <div>
            <div className={CommentCss.author}>
                <Avatar size='30' round={true} src={props.comment.author.photoURL}></Avatar>
                <div className={CommentCss.authorName}>{props.comment.author.displayName}</div>
            </div>
            <div className={CommentCss.date}>{setTime(props.comment.createdAt, props.comment.updatedAt)}</div>
            <div className={CommentCss.flex}>
                <div className={CommentCss.comment}>{props.comment.comment}</div>
                {props.comment.author.uid === user.uid ? 
                <div className={CommentCss.btn}>
                    <button className={CommentCss.edit} onClick={() => {setEditBool(true)}}>Edit</button>
                    <button className={CommentCss.delete} onClick={() => {deleteHandler()}}>Delete</button>
                </div> :
                null}
            </div>
        </div>}
    </div>
  );
}

export default Comment;