import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import moment from 'moment';
import ListCss from '../Style/List.module.css';

function List(props) {
  const setTime = (createdAt, updatedAt) => {
    if (createdAt !== updatedAt) {
      return moment(updatedAt).format('MMMM Do YYYY, hh:mma') + ' (Edited)';
    } else {
      return moment(createdAt).format('MMMM Do YYYY, hh:mma');
    }
  }

  return (
    <div>
      {props.list.map((post, i) => {
        return (
          <div key={i} className={ListCss.wrapper}>
            <Link className={ListCss.decoration} to={`/post/${post.postNum}`}>
              <div className={ListCss.title}>{post.title}</div>
              <div className={ListCss.author}>
                <Avatar size='30' round={true} src={post.author.photoURL}></Avatar>
                <div className={ListCss.authorName}>{post.author.displayName}</div>
              </div>
              <div className={ListCss.content}>{post.content}</div>
              <div className={ListCss.date}>{setTime(post.createdAt, post.updatedAt)}</div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default List;