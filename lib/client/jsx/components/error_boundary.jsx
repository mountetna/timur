import * as React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState( { hasError: true } );
  }

  render() {
    let { children, replacement: Replacement } = this.props;
    let { hasError } = this.state;

    return hasError ? <Replacement/> : children;
  }
}
