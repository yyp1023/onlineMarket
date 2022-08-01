import React, { useState, useEffect } from 'react';
import List from './List';
import axios from 'axios';
import HomePageCss from '../Style/HomePage.module.css';
import { BsSearch } from 'react-icons/bs'

function HomePage() {
  const [postList, setPostList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    let body = {
        search: search,
    }
    axios.post('/api/post/list', body).then((res) => {
      if (res.data.success) {
        setPostList([...res.data.list]);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div className={HomePageCss.wrapper}>
      <div>
        <input type='text' placeholder='Search...' value={search} onChange={(e) => {setSearch(e.currentTarget.value)}} onKeyDown={(e) => {if(e.keyCode === 13) {getList()}}} />
        <button onClick={() => {getList()}}><BsSearch /></button>
      </div>
      <List list={postList} />
    </div>
  );
}

export default HomePage;