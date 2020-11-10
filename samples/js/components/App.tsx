import React from 'react';
import ReactNotification from 'src';
import Header from 'samples/js/components/Header';
import Content from 'samples/js/components/Content';
import GithubCorner from 'react-github-corner';

export default function App() {
  return (
    <React.Fragment>
      <ReactNotification
        types={[
          {
            htmlClasses: ['notification__item--awesome'],
            name: 'awesome'
          }
        ]}
        isMobile={true}
      />
      <Header />
      <Content />
      <GithubCorner
        // target="_blank"
        size={125}
        href="https://github.com/teodosii/react-notifications-component"
      />
    </React.Fragment>
  );
}
