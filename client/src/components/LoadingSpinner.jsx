const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-16 w-16' : 'h-10 w-10';
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`relative ${sizeClass}`}>
        <div className={`${sizeClass} animate-spin rounded-full border-3 border-emerald-200/40 border-t-emerald-500 border-r-emerald-400 shadow-lg shadow-emerald-500/50`}></div>
        <div className={`absolute inset-0 ${sizeClass} animate-pulse rounded-full border-3 border-emerald-300/20`}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
