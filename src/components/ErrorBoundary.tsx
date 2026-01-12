import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="max-w-md w-full glass-card p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-destructive" />
                        </div>

                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-muted-foreground mb-6">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>

                        {this.state.error && (
                            <details className="text-left mb-6 p-4 bg-muted rounded-lg">
                                <summary className="cursor-pointer text-sm font-medium text-foreground mb-2">
                                    Error Details
                                </summary>
                                <code className="text-xs text-muted-foreground break-all">
                                    {this.state.error.message}
                                </code>
                            </details>
                        )}

                        <Button onClick={this.handleReset} className="w-full">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
