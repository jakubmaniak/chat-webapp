import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';

import './login.scss';


function LoginPage() {
    const history = useHistory();
    const { session } = useContext(SessionContext);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        if (session.loggedIn) {
            history.replace('/messages');
        }
    }, []);

    function submitForm(ev) {
        ev.preventDefault();
        
        api.userLogin({ username, password })
            .then((results) => {
                if (!results.error) {
                    localStorage.setItem('username', username);
                    history.replace('/messages');
                }
            });
    }

    return (
        <div className="page login-page">
            <form className="login-form" onSubmit={submitForm}>
                <input
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                    name="username"
                    placeholder="Nazwa użytkownika"
                    autoComplete="off"
                    spellCheck="false"
                />
                <input
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Hasło"
                    name="password"
                    type="password"
                />
                <button>Zaloguj</button>
                <Link to="/signup">Załóż konto</Link>
            </form>
        </div>
    );
}

export default LoginPage;