import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import AppProviders from './app-providers';
import LoginPage from './pages/login/login';
import SignupPage from './pages/signup/signup';
import LogoutPage from './pages/logout/logout';
import MainPage from './pages/main/main';
import NotFoundPage from './pages/not-found/not-found';

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
  return (
    <AppProviders>
      <div className="app">
        <Router>
          <Switch>
            <Route path="/" exact component={LoginPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/logout" component={LogoutPage} />
            <Route path="/messages/:type/:contact" component={MainPage} />
            <Route path="/messages" component={MainPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </div>
    </AppProviders>
  );
}

export default App;