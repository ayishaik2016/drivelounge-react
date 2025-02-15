import React, { Component, Suspense, lazy } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Redirect } from "react-router-dom";

NProgress.configure({ showSpinner: false });

// A higher-order component to wrap dynamic imports
const asyncComponent = (importFunc) => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense
      fallback={<div></div>} // Optional: You can display a spinner or loading text
    >
      <ErrorBoundary>
        <LazyComponent {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

// Error Boundary to handle loading failures and redirect if necessary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service here if needed
    NProgress.done();
  }

  render() {
    if (this.state.hasError) {
      return <Redirect to="/" />;
    }

    return this.props.children;
  }
}

export default asyncComponent;