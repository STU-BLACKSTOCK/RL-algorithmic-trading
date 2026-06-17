interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

function ErrorState({ title = "Error", message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state">
      <h3 className="error-state__title">{title}</h3>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button className="btn btn--secondary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ErrorState;
