"use client";

interface LocationPromptProps {
  onRequestLocation: () => void;
  loading: boolean;
  error: string | null;
}

export default function LocationPrompt({
  onRequestLocation,
  loading,
  error,
}: LocationPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Vliegtuig Tracker
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Bekijk welke vliegtuigen er boven en rond jouw locatie vliegen.
        Realtime data van vliegtuigen in de lucht.
      </p>

      <button
        onClick={onRequestLocation}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Locatie ophalen..." : "Gebruik mijn locatie"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm max-w-md">
          {error}
        </div>
      )}
    </div>
  );
}
