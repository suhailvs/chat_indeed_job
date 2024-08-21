import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '_store';

export { Nav };

function Nav() {
    const auth = useSelector(x => x.auth.value);
    const dispatch = useDispatch();
    const logout = () => dispatch(authActions.logout());
    const AUTH_TOKEN = JSON.parse(localStorage.getItem('auth'));
    // only show nav when logged in
    if (!auth) return null;
    return (
        <>
            <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top">
                <div className="container">
                    <a className='navbar-brand' href='/'>{AUTH_TOKEN['username']}</a>
                    <div className="navbar-nav">
                        <NavLink to="/" className="nav-item nav-link">Users</NavLink>
                        <button onClick={logout} className="btn btn-link nav-item nav-link">Logout</button>
                    </div>
                </div>
            </nav>
            <br /><br />
        </>
    );
}