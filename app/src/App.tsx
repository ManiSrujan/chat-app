import { Route, Switch } from "wouter";
import Login from "./Login";
import Chat from "./Chat";

const App = () => {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/chat" component={Chat} />
    </Switch>
  );
};

export default App;
