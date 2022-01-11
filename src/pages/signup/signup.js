import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';

import 'react-toastify/dist/ReactToastify.css';
import '../../common/auth.scss';
import useToast from '../../hooks/use-toast';


function SignupPage() {
    const history = useHistory();
    const toast = useToast();
    const { session } = useContext(SessionContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');


    useEffect(() => {
        if (session.loggedIn) {
            history.replace('/messages');
        }
    }, []);

    function submitForm(ev) {
        ev.preventDefault();

        if (password !== repeatPassword) {
            toast.error('Podane hasła różnią się między sobą');
            return;
        }

        api.userSignup({ username, password })
            .then((res) => {
                if (!res.error) {
                    localStorage.setItem('username', username);
                    history.replace('/messages');
                }
                else if (res.code === 'USER_ALREADY_EXISTS') {
                    toast.error('Użytkownik o tej nazwie już istnieje');
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
        <div className="page signup-page">
            <ToastContainer limit={4} />
            <form className="signup-form" onSubmit={submitForm}>
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
                <input
                    value={repeatPassword}
                    onChange={(ev) => setRepeatPassword(ev.target.value)}
                    placeholder="Powtórz hasło"
                    name="repeat-password"
                    type="password"
                />
                <button>Zarejestruj</button>
                <Link to="/login">Zaloguj się</Link>
            </form>
        </div>
    );
}

export default SignupPage;