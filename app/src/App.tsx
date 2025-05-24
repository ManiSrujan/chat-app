import { Route, Switch } from "wouter";
import Chat from "./apps/chat/Chat";
import SignUp from "./apps/signup";
import SignIn from "./apps/signin";
import { css } from "@emotion/css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./normalize.css";

const App = (): JSX.Element => {
  return (
    <div
      className={css`
        height: 100vh;
        width: 100vw;
        div {
          box-sizing: border-box;
        }
      `}
    >
      <Switch>
        <Route path="/" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/chat" component={Chat} />
      </Switch>
    </div>
  );
};

export default App;
