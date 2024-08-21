# Django React Chat APP

### Running locally
```bash
$ git clone https://github.com/suhailvs/chat_indeed_job.git
$ cd chat_indeed_job
$ python3 -m venv env
$ source env/bin/activate
$ pip install -r requirements_min.txt
$ ./manage.py migrate
$ ./manage.py runserver
$ cd react_app
$ npm i
$ REACT_APP_API_URL='http://localhost:8000' npm start
$ cd react_app/server
$ npm i
$ npm run start
```
Now visit: http://localhost:3000


![setup](https://raw.github.com/suhailvs/chat_indeed_job/main/setup.gif)

### References

Site | Description
-|-
swagger|https://github.com/axnsan12/drf-yasg
react login|https://jasonwatmore.com/react-18-redux-user-registration-and-login-example-tutorial
chat design|https://mdbootstrap.com/docs/standard/extended/chat/#example4
django chat|https://github.com/narrowfail/django-channels-chat
screen shot|https://github.com/phw/peek
