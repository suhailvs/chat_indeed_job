import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { authActions } from '_store';

export { Users };

  
function Users() {
    const AUTH_TOKEN = JSON.parse(localStorage.getItem('auth'));
    axios.defaults.headers.common['Authorization'] = `Token ${AUTH_TOKEN['key']}`;
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const logout = () => dispatch(authActions.logout());
    useEffect(() => {
        
        getUsers()
    }, []);
    
    function getUsers() {
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/`).then((data) => {
            setUsers(data?.data);
        }).catch(function (error) {
            showError(error);
        });
    }
    
    function showError(error) {
        if (error.response) {
            console.log(error.response)
            if (error.response.status === 401) {
                logout()
            } else {
                alert(JSON.stringify(error.response.data));
            }
            
        } else {
            console.log(error)
            alert('error');
        }            
    }

    function btnChat(userid) {
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/`, { userid: userid,getroom: true }).then((data) => {
            navigate(`/chat/${data?.data?.room}`);
        }).catch(function (error) {
            showError(error);
        });
    }
    

    function btnInterest(user) {
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/`, { userid: user.id }).then((data) => {
            getUsers()
        }).catch(function (error) {
            showError(error);
        });
    }
    return (
        <div>
            <h1>Users</h1>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        {/* <th style={{ width: '30%' }}>First Name</th>
                        <th style={{ width: '30%' }}>Last Name</th> */}
                        <th style={{ width: '30%' }}>Username</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                    {(() => {
                                        if (user.interest_status === null) {
                                            return (<button className="btn btn-sm btn-primary me-1" onClick={() => btnInterest(user)}>
                                                Send Interest
                                            </button>)
                                        } else if (user.interest_status === 'pending') {
                                            return (<div>Pending or <button className="btn btn-sm btn-primary me-1" onClick={() => btnInterest(user)}>
                                                Accept Interest
                                            </button></div>)
                                        } else if (user.interest_status === 'accepted') {
                                            return (<button className="btn btn-sm btn-primary me-1" onClick={() => btnChat(user.id)}>Chat</button>)
                                        } else {
                                            return (user.interest_status)
                                        }

                                    })()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}