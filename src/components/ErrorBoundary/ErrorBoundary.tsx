import React from 'react';
import { toast } from 'react-toastify';
import { withTranslation, WithTranslation } from 'react-i18next';

type Props = {
  children: React.ReactNode;
} & WithTranslation;

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(this.props.t('errorBoundary.console'), error, errorInfo);

    if (this.props.t) {
      toast.error(`${this.props.t('errorBoundary.toast')}: ${error.message}`);
    }
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h1>{t('errorBoundary.title')}</h1>
          <p>{t('errorBoundary.description')}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
