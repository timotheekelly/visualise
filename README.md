## How to run 
1. Clone the repo from `git clone https://github.com/timotheekelly/visualise.git`
2. cd visualiser
3. build the docker image with `docker build -t visualiser .`
4. run application with `docker run -d --name visualiser -p 80:80 visualiser`

You should be able to view at either `localhost` or `localhost:80`

![dashboard](images/dashboard.png)

You then enter the username of the profile you want to visualise 
(the authorisation token is optional but will be needed if API calls are exceeded)

![input](images/input-section.png)

![bio](images/bio.png)

![commits](images/commits-per-hour.png)

![commits](images/commits-per-day.png)

![commits](images/commits-per-month.png)

![languages](images/most-used-languages.png)

