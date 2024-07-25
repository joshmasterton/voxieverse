import '../style/comp/Loading.comp.scss';

export const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={`loading ${className}`}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="15" fill="none" strokeWidth="0.25rem" />
      </svg>
    </div>
  );
};
