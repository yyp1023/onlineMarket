import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Comment from './Comment';
import Avatar from 'react-avatar';
import moment from 'moment';
import DetailCss from '../Style/Detail.module.css';

function PostDetail() {
  const [postInfo, setPostInfo] = useState({});
  const [commentInfo, setCommentInfo] = useState('');
  const [commentList, setCommentList] = useState([]);
  const port = process.env.PORT || 5000;

  let params = useParams();
  let navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = () => {
    let body = {
      postNum: params.postNum
    };
    axios.post('/api/post/detail', body).then((res) => {
        if (res.data.success) {
            setPostInfo(res.data.detail);
            let postId = res.data.detail._id;
            getCommentList(postId);
        }
    }).catch((err) => {
        console.log(err);
    });
  }

  const deleteHandler = () => {
    if (window.confirm('Delete?')) {
      let body = {
        postNum: params.postNum,
      };
      axios.post('/api/post/delete', body).then((res) => {
          if (res.data.success) {
              alert('Post has been deleted.');
              navigate('/');
          }
      }).catch((err) => {
          alert('Post has not been deleted.');
      });
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (!commentInfo) {
      return alert('Please fill in the blank.');
    }
    let body = {
      comment: commentInfo,
      uid: user.uid,
      postId: postInfo._id,
    };
    axios.post('/api/comment/submit', body).then((res) => {
      if (res.data.success) {
        alert('Comment has been posted.');
        window.location.reload();
      } else {
        alert('Comment has not been posted. Please try again.');
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  const getCommentList = (postId) => {
    let body = {
      postId: postId,
    };
    axios.post('/api/comment/getComments', body).then((res) => {
      if (res.data.success) {
        setCommentList([...res.data.commentList]);
      }
    });
  }

  const setTime = (createdAt, updatedAt) => {
    if (createdAt !== updatedAt) {
      return moment(updatedAt).format('MMMM Do YYYY, hh:mma') + ' (Edited)';
    } else {
      return moment(createdAt).format('MMMM Do YYYY, hh:mma');
    }
  }

  return (
    <div>
      <div className={DetailCss.wrapper}>
        <div className={DetailCss.title}>{postInfo.title}</div>
        <div className={DetailCss.author}>
          <Avatar size='30' round={true} src={postInfo.author?.photoURL}></Avatar>
          <div className={DetailCss.authorName}>{postInfo.author?.displayName}</div>
        </div>
        <div className={DetailCss.date}>{setTime(postInfo.createdAt, postInfo.updatedAt)}</div>
        <hr />
        <div className={DetailCss.content}>
          {postInfo.image ? <img src={`http://localhost:${port}/${postInfo.image}`} /> : null}
          <div>{postInfo.content}</div>
        </div>
      </div>
      <div className={DetailCss.btn}>
        {user.uid === postInfo.author?.uid ?
        <div>
          <Link to={`/edit/${postInfo.postNum}`}>
            <button className={DetailCss.edit}>Edit</button>
          </Link>
          <button className={DetailCss.delete} onClick={() => {deleteHandler()}}>Delete</button>
        </div> :
        null}
      </div>
      <div className={DetailCss.comment}>
        {user.accessToken ?
        <div className={DetailCss.commentSubmit}>
          <input className={DetailCss.input} type='text' placeholder='Write a comment!' value={commentInfo} onChange={(e) => {setCommentInfo(e.currentTarget.value)}} />
          <button className={DetailCss.submit} onClick={(e) => {submitHandler(e)}}>Submit</button>
        </div> :
        null}
        <div>
          {commentList.map((comment, i) => {
            return <Comment key={i} comment={comment} />
          })}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;