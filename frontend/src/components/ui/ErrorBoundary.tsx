"use client";

import { Component, type ReactNode } from "react";
import Button from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-xl font-bold text-zinc-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-zinc-500 mb-6">
            Don&apos;t worry, let&apos;s try again!
          </p>
          <Button variant="primary" onClick={this.handleRetry}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
