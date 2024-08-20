# Django React Chat APP

### Running locally
```bash
$ git clone https://github.com/suhailvs/indeed_chat.git
$ cd indeed_chat
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