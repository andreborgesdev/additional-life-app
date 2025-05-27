"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ChatErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ChatErrorFallbackProps>;
}

interface ChatErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

function DefaultChatErrorFallback({
  error,
  resetError,
}: ChatErrorFallbackProps) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t("chat.error.title", "Chat Error")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t(
            "chat.error.description",
            "Something went wrong with the chat system. Please try again."
          )}
        </p>
        {error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
              {t("chat.error.technical_details", "Technical Details")}
            </summary>
            <code className="block text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded border text-red-600 dark:text-red-400">
              {error.message}
            </code>
          </details>
        )}
        <div className="space-y-3">
          <Button onClick={resetError} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("chat.error.retry", "Try Again")}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            {t("chat.error.reload_page", "Reload Page")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export class ChatErrorBoundary extends React.Component<
  ChatErrorBoundaryProps,
  ChatErrorBoundaryState
> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ChatErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chat Error Boundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultChatErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export function withChatErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ChatErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ChatErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ChatErrorBoundary>
  );

  WrappedComponent.displayName = `withChatErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}
