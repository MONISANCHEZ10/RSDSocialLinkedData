// @flow
import React from 'react'
import auth from 'solid-auth-client'

export default class PersonalInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {webId: null};
    }

    componentWillMount() {
    auth.trackSession(session =>
      this.setState({ webId: session && session.webId })
    )
  }

  render() {
    const { webId } = this.state
    return webId ? (
      <p>
         WebID is{' '}
        <a href={webId} target="_blank">
          <code>{webId}</code>
        </a>
        .
      </p>
    ) : null
  }
}
