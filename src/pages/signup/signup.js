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


function SignupPage() {
    const history = useHistory();

    const { i18n, lang, setLang } = useI18n();
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

        api.userSignup({ username, password, lang: lang.code })
            .then((res) => {
                if (!res.error) {
                    localStorage.setItem('username', username);
                    history.replace('/messages');
                }
                else if (res.code === 'USER_ALREADY_EXISTS') {
                    toast.error('Użytkownik o tej nazwie już istnieje');
                }
                else if (res.code === 'USERNAME_TOO_SHORT') {
                    toast.error('Nazwa użytkownika powinna składać się z przynajmniej 3 znaków');
                }
                else if (res.code === 'FORBIDDEN_CHARACTERS') {
                    toast.error('Nazwa użytkownika może składać się z liter alfabetu łacińskiego, cyfr, kropek i spacji');
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
            <div className="login-form-wrapper">
                <form className="signup-form" onSubmit={submitForm}>
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
                    <input
                        value={repeatPassword}
                        onChange={(ev) => setRepeatPassword(ev.target.value)}
                        placeholder={i18n('repeatPassword')}
                        name="repeat-password"
                        type="password"
                    />
                    <button>{i18n('signUp')}</button>
                    <Link to="/login">{i18n('goToLogIn')}</Link>
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

export default SignupPage;