// import axios from 'axios';
// import { useEffect } from 'react';
import './App.css';
import IndexRouter from './router/IndexRouter';

function App() {
  // useEffect(() => {
  //   axios({
  //     url: '/api/mmdb/movie/v3/list/hot.json?ct=%E8%B4%BA%E5%B7%9E&ci=298&channelId=4'
  //   }).then(res => {
  //     console.log(res)
  //   })
  // }, [])
  return (
      <IndexRouter></IndexRouter>
  );
}

export default App;
