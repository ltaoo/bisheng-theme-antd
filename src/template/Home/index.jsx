import React from 'react';

const redirect = {
  '/': '/docs/react/introduce-cn',
};

export default class HomePage extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    const pathname = `/${location.pathname}`;
    Object.keys(redirect).forEach((from) => {
      if (pathname.indexOf(from) === 0) {
        window.location.href = redirect[from];
      }
    });
  }

  render() {
    return <div />;
  }
}
