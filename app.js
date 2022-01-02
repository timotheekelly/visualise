function handleInput() {
    var user = document.getElementById("user").value !== "" ? document.getElementById("user").value : undefined;
    var token = document.getElementById("token").value !== "" ? document.getElementById("token").value : undefined;

    main(user, token);
}

async function getRequest(url, token) {

    const headers = {
        'Authorization': `Token ${token}`
    }

    const response = (token == undefined) ? await fetch(url) : await fetch(url, {
        "method": "GET",
        "headers": headers
    });

    let data = await response.json();
    return data;
}

async function main(user, token) {
    let url = `https://api.github.com/users/${user}/repos`;
    
    let repo = await getRequest(url, token).catch(error => console.error(error));

    url = `https://api.github.com/users/${user}`;
    let user_info = await getRequest(url, token).catch(error => console.error(error));
    
    // Render chart
    hourlyCommitChart.render();
    dailyCommitChart.render();
    monthlyCommitChart.render();
    languagesChart.render();

    get_user_info(user_info);
    get_hourly_commits(repo, user, token);
    get_daily_commits(repo, user, token);
    get_monthly_commits(repo, user, token);
    get_languages(repo, user, token);
}

function get_user_info(user_info) {
    let img = document.getElementById('img');
    img.src = user_info.avatar_url

    let name = document.getElementById('name');
    name.innerHTML = `<h4>Name: </h4>${user_info.name}`;

    let username = document.getElementById('username');
    username.innerHTML = `<h4>Username: </h4>${user_info.login}`;

    let created_at = document.getElementById('date_created');
    created_at.innerHTML = `<h4>Date Created: </h3>${user_info.created_at}`;

    let public_repos = document.getElementById('public_repos');
    public_repos.innerHTML = `<h4>Public Repos: </h3>${user_info.public_repos}`;
}

async function get_hourly_commits(repo, user, token) {
    let data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    for (i in repo) {
        let url = `https://api.github.com/repos/${user}/${repo[i].name}/commits?per_page=100`;
        let commits = await getRequest(url, token).catch(error => console.error(error));

        for (j in commits) {
            let date = commits[j].commit.author.date;

            var d = new Date(date);
            let hour = hours[d.getHours()];

            for (i = 0; i < hours.length; i++) {
                if (hour == hours[i])
                    data[i] += 1;
            }
            
        }

    }

    for (i in hours)
        hours[i] = hours[i].toString() + ":00"

    hourlyCommitChart.updateOptions({
        series: [{
            data: data
          }],
          xaxis: {
            categories: hours
          }
      })
}

async function get_daily_commits(repo, user, token) {
    let data = [0,0,0,0,0,0,0];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (i in repo) {
        let url = `https://api.github.com/repos/${user}/${repo[i].name}/commits?per_page=100`;
        let commits = await getRequest(url, token).catch(error => console.error(error));

        for (j in commits) {
            let date = commits[j].commit.author.date;

            var d = new Date(date);
            let day = days[d.getDay()];

            for (i = 0; i < days.length; i++) {
                if (day == days[i])
                    data[i] += 1;
            }
            
        }

    }
    dailyCommitChart.updateOptions({
        series: [{
            data: data
          }],
          xaxis: {
            categories: days
          }
      })
}

async function get_monthly_commits(repo, user, token) {
    let data = [0,0,0,0,0,0,0,0,0,0,0,0];
    var months = [
        'January', 
        'February', 
        'March', 
        'April', 
        'May', 
        'June', 
        'July',
        'August', 
        'September', 
        'October', 
        'November', 
        'Decmber'
    ];

    for (i in repo) {
        let url = `https://api.github.com/repos/${user}/${repo[i].name}/commits?per_page=100`;
        let commits = await getRequest(url, token).catch(error => console.error(error));

        for (j in commits) {
            let date = commits[j].commit.author.date;

            var d = new Date(date);
            let month = months[d.getMonth()];

            for (i = 0; i < months.length; i++) {
                if (month == months[i])
                    data[i] += 1;
            }
            
        }

    }
    monthlyCommitChart.updateOptions({
        series: [{
            data: data
          }],
          xaxis: {
            categories: months
          }
      })
}



var optionsHourly = {
    chart: {
      type: 'area'
    },
    series: [{
      name: 'commits',
      data: []
    }],
    title: {
        text: "Commits per Hour",
        style: {
            color: "white",
        }
      },
    xaxis: {
        categories: [],
        labels: {
              style: {
              colors: 'white'
          },
       }
      },
    yaxis: {
        labels: {
            style: {
            colors: 'white'
        },
     }
    },
  }

var optionsDaily = {
    chart: {
        type: 'area'
      },
    series: [{
      name: 'commits',
      data: []
    }],
    title: {
        text: "Commits per Day",
        style: {
            color: "white",
        }
      },
    xaxis: {
        categories: [],
        labels: {
              style: {
              colors: 'white'
          },
       }
      },
    yaxis: {
        labels: {
            style: {
            colors: 'white'
        },
     }
    },
  }

var optionsMonthly = {
    chart: {
        type: 'bar'
      },
    series: [{
      name: 'commits',
      data: []
    }],
    title: {
        text: "Commits per Month",
        style: {
            color: "white",
        }
      },
    xaxis: {
      categories: [],
      labels: {
            style: {
            colors: 'white'
        },
     }
    },
    yaxis: {
        labels: {
            style: {
            colors: 'white'
        },
     }
    },
    plotOptions: {
        bar: {
          horizontal: true
        }
      }
  }

  var optionsLanguages = {
    series: [],
          chart: {
          width: '100%',
          type: 'pie',
        },
        labels: [],
        theme: {
          monochrome: {
            enabled: true
          }
        },
        title: {
          text: "Most Used Languages",
          style: {
            color: "white",
        }
        },
        legend: {
          show: true,
          labels: {
              colors: "white",
          }
        }
        };  
  
var hourlyCommitChart = new ApexCharts(document.querySelector("#hourly_commit_chart"), optionsHourly);
var dailyCommitChart = new ApexCharts(document.querySelector("#daily_commit_chart"), optionsDaily);
var monthlyCommitChart = new ApexCharts(document.querySelector("#monthly_commit_chart"), optionsMonthly);
var languagesChart = new ApexCharts(document.querySelector("#languages_chart"), optionsLanguages);

