import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-overlay" data-testid="loading">
      <div className="spinner" />
    </div>
  );
};

export default Loading;
