"use client";

interface EmptyStateProps {
  error: string | null;
  errorType: string | null;
  loading: boolean;
}

export default function EmptyState({ error, errorType, loading }: EmptyStateProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <p className="text-xl text-gray-400">Vliegtuigen zoeken...</p>
      </div>
    );
  }

  if (error) {
    const isRetrying = errorType === "RATE_LIMIT" || errorType === "TIMEOUT" || errorType === "NETWORK";
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <p className="text-lg text-gray-600 max-w-md mb-2">{error}</p>
        {isRetrying && (
          <p className="text-sm text-gray-400">Wordt automatisch opnieuw geprobeerd.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <p className="text-xl text-gray-400 mb-2">Niets te zien hier</p>
      <p className="text-sm text-gray-400">
        Er vliegen op dit moment geen vliegtuigen in de buurt.
      </p>
    </div>
  );
}
