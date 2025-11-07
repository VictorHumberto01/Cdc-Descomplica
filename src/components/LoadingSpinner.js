export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative h-12 w-12 animate-spin">
        <div className="absolute h-full w-full rounded-full border-4 border-amber-200"></div>
        <div className="absolute h-full w-full rounded-full border-4 border-amber-600 border-t-transparent"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">
        Carregando artigos...
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Isso pode levar alguns segundos
      </p>
    </div>
  );
}
