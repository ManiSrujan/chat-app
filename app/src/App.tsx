import { Route, Switch } from "wouter";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";
import { Routes } from "./common/constants";
import "./App.css";
import Chat from "./pages/chat";
import { Box, Theme } from "@radix-ui/themes";

const App = (): JSX.Element => {
  return (
    <Theme appearance={"dark"} panelBackground={"translucent"}>
      <Box width="100vw" height="100vh">
        <Switch>
          <Route path={Routes.SignUp} component={SignUp} />
          <Route path={Routes.SignIn} component={SignIn} />
          <Route path={Routes.Chat} component={Chat} />
        </Switch>
      </Box>
    </Theme>
  );
};

export default App;
