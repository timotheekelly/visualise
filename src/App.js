import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RepoDetails from "./RepoDetails";
import UserStats from './UserStats';
import './App.css';
import BarChart from './BarChart';
import * as d3 from "d3";

function App() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [repoList, setRepoList] = useState([]);
  const [repoCount, setRepoCount] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [details, setDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    d3.json("/chart-data.json").then((d) => {
      setData(d);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  useEffect(() => {
    setRepos([]);
    setDetails({});
  }, [username]);

  function handleSubmit(e) {
    e.preventDefault();
    searchRepos();
    searchUser();
    getCommits();
  };

  function searchUser(token) {
    setLoading(true);
    axios({
      method: "get",
      url: `https://api.github.com/users/${username}`,
      headers: {
        'Authorization': `beare ${token}`,
        'User-Agent': 'request'
      }
    }).then(res => {
      setLoading(false);
      setUserStats(res.data);
    })
  }

  function searchRepos(token) {
    setLoading(true);
    axios({
      method: "get",
      url: `https://api.github.com/users/${username}/repos`,
      headers: {
        'Authorization': `beare ${token}`,
        'User-Agent': 'request'
      }
    }).then(res => {
      setLoading(false);
      setRepos(res.data);
    })
  }


  function renderRepo(repo) {
    return (
      <div className="row" onClick={() => getDetails(repo.name)} key={repo.id}>
        <h2 className="repo-name" >
          {repo.name}
        </h2>
      </div>
    )
  }

  function getDetails(repoName, token) {
    setDetailsLoading(true);
    axios({
      method: "get",
      url: `https://api.github.com/repos/${username}/${repoName}`,
      headers: {
        'Authorization': `beare ${token}`,
        'User-Agent': 'request'
      }
    }).then(res => {
      setDetailsLoading(false);
      setDetails(res.data);
    });
  }

  function getCommits(token) {
    setDetailsLoading(true);
    axios({
      method: "get",
      url: `https://api.github.com/repos/freeCodeCamp/freeCodeCamp/commits?per_page=100`,
      headers: {
        'Authorization': `beare ${token}`,
        'User-Agent': 'request'
      }
    }).then(res => {
      setDetailsLoading(false);
      setDetails(res.data);

      let i = 0;
      let j = 0;
      let label = [];
      let dayCount = [];
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        for (j in res.data) {
          let date = res.data[j].commit.author.date;

          var d = new Date(date);
          let day = days[d.getDay()];

          if (label.includes(day)) {
              for (i = 0; i < label.length; i++)
                  if (day === label[i])
                  dayCount[i] += 1;

          } else {
              label.push(day);
              dayCount.push(1);
            }
          }
    console.log(dayCount);

      // let date = res.data[99].commit.author.date;
      // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      // var d = new Date(date);
    
    });
  }
  

  return (
    <div className="page">
      <div className="landing-page-container">
        <div className="left-side">
          <form className="form">
            <input
              className='input'
              value={username}
              placeholder='Github Username'
              onChange={ e => setUsername(e.target.value)}
            />
            <input
              className='token'
              value={token}
              placeholder='Github token'
              onChange={ e => setToken(e.target.value)}
            />
            <button className='button' onClick={handleSubmit}>{loading ? "Searching..." : "Search"}</button>
          </form>
          <div className="results-container">
            {repos.map(renderRepo)}
          </div>
        </div>
        <div className="barchart-container">
              {/* <BarChart data={this.state.data}/> */}
        </div> 
        <UserStats stats={userStats} loading={detailsLoading} />
        <RepoDetails details={details} loading={detailsLoading} />
      </div>
    </div>
  );
}

export default App;
