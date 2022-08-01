import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditCss from '../Style/Edit.module.css';

function Edit() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  let navigate = useNavigate();
  let params = useParams();
  
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = () => {
    let body = {
      postNum: params.postNum
    };
    axios.post('/api/post/detail', body).then((res) => {
        if (res.data.success) {
            setTitle(res.data.detail.title);
            setContent(res.data.detail.content);
        }
    }).catch((err) => {
        console.log(err);
    });
  }

  const submitHandler = () => {
    if (title === '' || content === '') {
      return alert('Please fill in all the blanks.');
    }
    let body = {
      title: title,
      content: content,
      postNum: params.postNum,
    };
    axios.post('/api/post/edit', body).then((res) => {
      if (res.data.success) {
        alert('Post has been edited.');
        navigate(`/post/${params.postNum}`);
      } else {
        alert('Post has not been edited.');
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div className={EditCss.wrapper}>
      <div className={EditCss.title}>
        <div>
          <label>Title</label>
        </div>
        <div>
          <input type='text' id='title' value={title} onChange={(e) => {setTitle(e.currentTarget.value)}} />
        </div>
      </div>
      <div className={EditCss.content}>
        <div>
          <label>Content</label>
        </div>
        <div>
          <textarea rows='10' type='text' id='content' value={content} onChange={(e) => {setContent(e.currentTarget.value)}}></textarea>
        </div>
      </div>
      <div className={EditCss.btn}>
        <button className={EditCss.submit} onClick={() => {submitHandler()}}>Submit</button>
        <button className={EditCss.cancel} onClick={() => {navigate(-1)}}>Cancel</button>
      </div>
    </div>
  );
}

export default Edit;