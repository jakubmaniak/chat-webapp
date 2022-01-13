import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import api from '../../api';
import { SessionContext } from '../../contexts/session-context';
import useToast from '../../hooks/use-toast';
import useI18n from '../../hooks/use-i18n';

import 'react-toastify/dist/ReactToastify.css';
import '../../common/auth.scss';


function LoginPage() {
    const history = useHistory();

    const { i18n, lang, setLang } = useI18n();
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
                else {
                    toast.error('Wystąpił nieokreślony błąd');
                }
            });
    }

    return (
        <div className="page login-page">
            <ToastContainer limit={4} />
            <div className="login-form-wrapper">
                <form className="login-form" onSubmit={submitForm}>
                    <header>
                        <div className="logo"></div>
                        <p>Lingee</p>
                    </header>
                    <input
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                        name="username"
                        placeholder={i18n('username')}
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <input
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        placeholder={i18n('password')}
                        name="password"
                        type="password"
                    />
                    <button>{i18n('logIn')}</button>
                    <Link to="/signup">{i18n('goToSignUp')}</Link>
                </form>
            </div>
            <div className="lang-select-container">
                {lang.code !== 'en' && <button onClick={() => setLang('en')}>English</button>}
                {lang.code !== 'de' && <button onClick={() => setLang('de')}>Deutsch</button>}
                {lang.code !== 'pl' && <button onClick={() => setLang('pl')}>Polski</button>}
            </div>
        </div>
    );
}

export default LoginPage;