// @flow
import React from 'react'
import auth from 'solid-auth-client'

export default class AuthButtons extends React.Component {

  constructor(props) {
    super(props)
    this.state = {loggedIn: false};
    auth.trackSession(session => this.setState({ loggedIn: !!session }))
  }

  logout() {
    auth.logout()
  }

  login() {
    const idp = window.prompt(
      'What is the URL of your identity provider?',
      'https://solid.community/'
    )
    if (idp) {
      auth.login(idp)
    }
  }

  render() {
    return this.state.loggedIn ? (
      <button onClick={this.logout}>Log out</button>
    ) : (
      <div>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}
