import { useRef, useState, useEffect } from 'react';
import { io } from "socket.io-client";
import axios from 'axios';
import { useParams } from 'react-router';
export { Chat };

function Chat() {
  const AUTH_TOKEN = JSON.parse(localStorage.getItem('auth'));
  axios.defaults.headers.common['Authorization'] = `Token ${AUTH_TOKEN['key']}`;
  const socket = io('http://localhost:3010/', { path: '/socket.io', });
  const params = useParams();
  const room = params['id'];
  const me = AUTH_TOKEN['username'];
  const uuid = Math.ceil(Math.random() * 1000000); 
  const inputRef = useRef();
  const scrollRef = useRef();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/message/`).then((data) => {
      setChats(data?.data);
    });
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);
  if (room) {
    socket.emit('createroom', room);
    socket.on("message", (message) => {
      const data = JSON.parse(message);
      // Ignore messages from ourself
      if (data.uuid === uuid) return;
      setMessageList(data.msg)
    })
  }

  function setMessageList(msg) {
    const msgs = [...chats];
    msgs.push(msg);
    setChats(msgs);
  }
  function sendmessage(e) {
    e.preventDefault();
    let msg_txt = inputRef.current.value
    if (msg_txt.length > 0) {
      axios.post(`${process.env.REACT_APP_API_URL}/api/v1/message/`, { "room": room, "body": msg_txt }).then((data) => {
        // alert('axios success')
        setMessageList(data?.data)
        socket.emit('message', room, JSON.stringify({ 'msg': data?.data, 'uuid': uuid }));
        // inputRef.current.reset()
        inputRef.current.value = "";
      });
    }
  }
  return (
      <section>
        <div className="container py-5">
          <div className="row d-flex justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center p-3" style={{borderTop: "4px solid #ffa900"}}>
                  <h5 className="mb-0">Chat messages</h5>
                </div>
                <div className="card-body">
                  {chats.map((message) => {
                    return (
                      <div ref={scrollRef} key={message.id}>
                        <div className={`d-flex ${message.user === me ? "justify-content-end" : "justify-content-start"}`}>
                          <p className="small mb-1 text-muted">{message.timestamp}</p>
                        </div>
                        <div className={`d-flex flex-row ${message.user === me ? "justify-content-end mb-4 pt-1" : "justify-content-start"}`}>
                          <div>
                            <p className={`small p-2 ms-3 mb-3 rounded-3 ${message.user === me ? "text-white bg-warning" : "bg-secondary"}`}>
                              {message.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                  <form onSubmit={sendmessage} className="input-container">
                    <div className="input-group mb-0">
                      <input type="text" className="form-control" placeholder="Type message" ref={inputRef}
                        aria-label="Recipient's username" aria-describedby="button-addon2" />
                      <button data-mdb-button-init data-mdb-ripple-init className="btn btn-warning" style={{paddingTop: "-top: .55rem"}} type="submit">
                        Button
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}