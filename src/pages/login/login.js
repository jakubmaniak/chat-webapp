import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';
import useToast from '../../hooks/use-toast';

import 'react-toastify/dist/ReactToastify.css';
import '../../common/auth.scss';


function LoginPage() {
    const history = useHistory();
    const toast = useToast();
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
            .then((res) => {
                if (!res.error) {
                    localStorage.setItem('username', username);
                    history.replace('/messages');
                }
                else if (res.code === 'WRONG_PASSWORD') {
                    toast.error('Podane hasło jest nieprawidłowe');
                }
                else if (res.code === 'USER_NOT_FOUND') {
                    toast.error('Użytkownik o tej nazwie nie istnieje');
                }
                else if (res.code === 'PASSWORD_TOO_SHORT') {
                    toast.error('Podane hasło jest za krótkie');
                }
                else {
                    toast.error('Wystąpił nieokreślony błąd');
                }
            });
    }

    return (
        <div className="page login-page">
            <ToastContainer limit={4} />
            <form className="login-form" onSubmit={submitForm}>
                <header>
                    <div className="logo"></div>
                    <p>Lingee</p>
                </header>
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