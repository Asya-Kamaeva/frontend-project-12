import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from '../slices/channelsSlice.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <div className='container h-100 my-4 overflow-hidden rounded shadow'>
      <div className='row h-100 bg-white flex-md-row'>
        <Channels />
        <Messages />
      </div>
    </div>
  );
};
export default Home;
