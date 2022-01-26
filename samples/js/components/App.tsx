import React from 'react'
import { Container } from 'src/components/Container'
import Header from './Header'
import Content from './Content'
import GithubCorner from 'react-github-corner'
import 'src/scss/notification.scss'

export default function App() {
  return (
    <React.Fragment>
      <Container
        types={[
          {
            htmlClasses: ['rnc__notification-item--awesome'],
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
  )
}
