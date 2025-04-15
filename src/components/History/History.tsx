'use client';

import Link from 'next/link';
import { useHistory } from './hooks/useHistory';
import { buildRestUrl } from '@/utils/requestUtils';

const History = () => {
  const { history } = useHistory();

  if (history.length === 0) {
    return (
      <div data-testid="history-empty">
        You haven&#39;t executed any requests yet.
      </div>
    );
  }

  return (
    <ul data-testid="history-list">
      {history.map((item) => (
        <li key={item.createdAt} data-testid="history-item">
          <span data-testid="history-date">
            {new Date(item.createdAt).toLocaleString()}
          </span>
          <Link
            href={buildRestUrl(item)}
            data-testid={`history-link-${item.createdAt}`}
          >
            [{item.method}] {item.url}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default History;
