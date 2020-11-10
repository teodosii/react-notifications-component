import React, { useEffect, useState } from 'react';
import ReactNotification, { store } from 'src';
import { iNotification } from 'src/types/Notification';
import { getMessage, getTitle, getType } from 'samples/js/helpers/randomize';
import notification from 'samples/js/helpers/notification';
import Header from 'samples/js/components/Header';
import Content from 'samples/js/components/Content';
import GithubCorner from 'react-github-corner';

export default function App() {
  useEffect(() => {
    let intervalCount = 0
    setInterval(() => {
      if (intervalCount++ >= 3) return
      const object: iNotification = {};
      const type = getType();
      store.addNotification(
        Object.assign(object, notification, {
          title: getTitle(type),
          message: 'Custom types can be used as well. Pretty cool, huh!? Custom types can be used as well. Pretty cool, huh!?',
          width: [0, 400, 600, 200][Math.floor(Math.random() * 6) + 1],
          container: 'bottom-right',
          type: getType()
        })
      );
    }, 500);
  }, []);

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
