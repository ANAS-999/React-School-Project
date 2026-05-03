import { Icon } from "../common/Icon";
import "./EmptyState.css";

interface EmptyStateProps {
  type?: "empty" | "error";
  message?: string;
  subtext?: string;
  onRetry?: () => void;
  onClear?: () => void;
}

export const EmptyState = ({ type = "empty", message, subtext, onRetry, onClear }: EmptyStateProps) => {
  if (type === "error") {
    return (
      <div className="empty-state-container error">
        <Icon icon="fa-circle-exclamation" size="2xl" />
        <p>{message || "Something went wrong"}</p>
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="empty-state-container">
      <Icon icon="fa-tv" size="2xl" />
      <p>{message || "No results found"}</p>
      {subtext && <p className="empty-state-subtext">{subtext}</p>}
      {onClear && (
        <button className="btn btn-secondary" onClick={onClear}>
          Clear Filters
        </button>
      )}
    </div>
  );
};