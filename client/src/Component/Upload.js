import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import UploadCss from '../Style/Upload.module.css';

function Upload() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  let navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.accessToken) {
      alert('Only members can upload a post. Please log in.');
      navigate('/login');
    }
  }, []);

  const submitHandler = () => {
    if (title === '' || content === '') {
      return alert('Please fill in all the blanks.');
    }
    let body = {
      title: title,
      content: content,
      image: image,
      uid: user.uid,
    };
    axios.post('/api/post/submit', body).then((res) => {
      if (res.data.success) {
        alert('Post has been posted.');
        navigate('/');
      } else {
        alert('Post has not been posted. Please try again.');
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  const fileUpload = (e) => {
    var formData = new FormData();
    formData.append('file', e.target.files[0]);
    axios.post('/api/post/image/upload', formData).then((res) => {
      setImage(res.data.filePath);
    });
  }

  return (
    <div className={UploadCss.wrapper}>
      <div className={UploadCss.title}>
        <div>
          <label>Title</label>
        </div>
        <div>
          <input type='text' id='title' value={title} onChange={(e) => {setTitle(e.currentTarget.value)}} />
        </div>
      </div>
      <div className={UploadCss.file}>
        <Form.Control type='file' className='shadow-none' accept='image/*' onChange={(e) => fileUpload(e)} />
      </div>
      <div className={UploadCss.content}>
        <div>
          <label>Content</label>
        </div>
        <div>
          <textarea rows='10' type='text' id='content' value={content} onChange={(e) => {setContent(e.currentTarget.value)}}></textarea>
        </div>
      </div>
      <div className={UploadCss.btn}>
        <button onClick={() => {submitHandler()}}>Upload</button>
      </div>
    </div>
  );
}

export default Upload;