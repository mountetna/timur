import * as React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
  }

  render() {
    let { name } = this.props;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong in { name }.</h1>;
    }

    return this.props.children; 
  }
}
