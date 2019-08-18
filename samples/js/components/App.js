import React from "react";
import { ReactNotificationComponent } from "rc-notifications/react-notification-component";
import Header from "components/Header";
import Content from "components/Content";
import GithubCorner from "react-github-corner";

const App = () => {
  return (
    <React.Fragment>
      <ReactNotificationComponent
        types={[{
          htmlClasses: ["notification-awesome"],
          name: "awesome"
        }]}
        isMobile={true}
      />
      <Header />
      <Content />
      <GithubCorner
        target="_blank"
        size={125}
        href="https://github.com/teodosii/react-notifications-component" />
    </React.Fragment>
  );
}

export default App;