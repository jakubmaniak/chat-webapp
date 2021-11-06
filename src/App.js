import { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import { SessionContext, initialSessionContext } from './contexts/session-context';
import { SocketContext, initialSocketContext } from './contexts/socket-context';
import { ContactsContext, initialContactsContext } from './contexts/contacts-context';
import LoginPage from './pages/login/login';
import SignupPage from './pages/signup/signup';
import LogoutPage from './pages/logout/logout';
import MainPage from './pages/main/main';

import './App.scss';


// function ProtectedRoute({ children: Component, ...props }) {
//   console.log(Component);
//   return (
//     <Route
//       {...props}
//       render={(renderProps) => {
//         let x = Math.random();
//         return (
//           (x > 0.5) ? Component : (<p>Oooo</p>)
//         );
//       }}
//     />
//   );
// }

function App() {
  const [session, setSession] = useState(initialSessionContext);
  const [socket, setSocket] = useState(initialSocketContext);
  const [contacts, setContacts] = useState(initialContactsContext);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      <SocketContext.Provider value={{ socket, setSocket }}>
        <ContactsContext.Provider value={{ contacts, setContacts }}>
          <div className="app">
            <Router>
              <Switch>
                <Route path="/" exact component={LoginPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/logout" component={LogoutPage} />
                <Route path="/messages" component={MainPage} />
              </Switch>
            </Router>
          </div>
        </ContactsContext.Provider>
      </SocketContext.Provider>
    </SessionContext.Provider>
  );
}

export default App;
