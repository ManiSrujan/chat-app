import './app.css';
import { Route, Switch } from 'wouter';
import Login from './Login';

const App = () => {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/chat" component={() => <div>Chat Page</div>} />
    </Switch>
  );
};

export default App;
