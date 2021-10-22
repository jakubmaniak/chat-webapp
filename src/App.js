import { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import { SessionContext, initialSessionContext } from './contexts/session-context';
import LoginPage from './pages/login/login';
import MainPage from './pages/main/main';

import './App.scss';


function ProtectedRoute({ children: Component, ...props }) {
  console.log(Component);
  return (
    <Route
      {...props}
      render={(renderProps) => {
        let x = Math.random();
        return (
          (x > 0.5) ? Component : (<p>Oooo</p>)
        );
      }}
    />
  );
}

function App() {
  const [session, setSession] = useState(initialSessionContext);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      <div className="app">
        <Router>
          <Switch>
            <Route path="/" exact>
              <LoginPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/main">
              <MainPage />
            </Route>
          </Switch>
        </Router>
      </div>
    </SessionContext.Provider>
  );
}

export default App;
