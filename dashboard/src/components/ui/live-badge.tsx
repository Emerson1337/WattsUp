export default function LiveBadge() {
  return (
    <div className="flex items-center dark:bg-red-800/50 bg-white w-fit py-1 px-2 border-red-500 border rounded-sm gap-2">
      <div className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
      </div>
      <span className="text-sm text-accent-foreground">Live</span>
    </div>
  );
}
