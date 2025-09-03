type LoadingProps = {
  message?: string;
};

export const Loading = ({ message = 'Loading...' }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  );
};
