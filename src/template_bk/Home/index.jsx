import React from 'react';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.name = 'world';
  }

  handleClick() {
    console.log(`hello ${this.name}`);
  }

  render() {
    return (
      <div>
        <p>Home Page</p>
        <button type="button" onClick={this.handleClick}>click</button>
      </div>
    );
  }
}
