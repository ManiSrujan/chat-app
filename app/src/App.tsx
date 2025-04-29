import { Route, Switch } from "wouter";
import Chat from "./apps/chat/Chat";
import Login from "./apps/login/Login";

const App = () => {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/chat" component={Chat} />
    </Switch>
  );
};

export default App;
