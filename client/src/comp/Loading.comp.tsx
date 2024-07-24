import '../style/comp/Loading.comp.scss';

export const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={`loading ${className}`}>
      <div />
      <div />
    </div>
  );
};
