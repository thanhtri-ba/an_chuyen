import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '../../design-system/components/Button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Đã có lỗi xảy ra</h1>
            <p className="text-gray-500 mb-8">
              Rất xin lỗi, ứng dụng vừa gặp sự cố không mong muốn. Vui lòng thử tải lại trang.
            </p>
            <Button 
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              Quay lại trang chủ
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
