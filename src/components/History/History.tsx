'use client';

import Link from 'next/link';
import { useHistory } from './hooks/useHistory';
import { buildRestUrl } from '@/utils/requestUtils';
import './history.css';

const History = () => {
  const { history, onClear } = useHistory();

  if (history.length === 0) {
    return (
      <div className="history-container empty" data-testid="history-empty">
        You haven&#39;t executed any requests yet.
      </div>
    );
  }

  return (
    <div className="history-container">
      <ul className="history-list" data-testid="history-list">
        {history.map((item) => (
          <li key={item.createdAt} className="history-item" data-testid="history-item">
            <span className="history-date" data-testid="history-date">
              {new Date(item.createdAt).toLocaleString()}
            </span>
            <Link
              href={buildRestUrl(item)}
              className="history-link"
              data-testid={`history-link-${item.createdAt}`}
            >
              [{item.method}] {item.url}
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="clear-history-button"
        onClick={onClear}
        data-testid="clear-history"
      >
        Clear History
      </button>
    </div>
  );
};

export default History;
