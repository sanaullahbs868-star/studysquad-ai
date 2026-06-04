export default function ApexAIBadge() {
  return (
    <div
      className="fixed bottom-5 right-5 z-50 select-none pointer-events-none"
      data-ocid="apex_ai.badge"
      aria-hidden="true"
    >
      <div
        className="flex flex-col items-end gap-0.5 px-3 py-2 rounded-xl border border-primary/40 bg-background/80 backdrop-blur-md shadow-lg"
        style={{
          boxShadow:
            "0 0 16px oklch(0.7 0.15 180 / 0.3), 0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <span className="font-display font-bold text-sm text-primary tracking-wide leading-none">
          Apex AI
        </span>
        <span className="text-[10px] text-muted-foreground leading-none tracking-wider uppercase">
          An Artificial Intelligence
        </span>
      </div>
    </div>
  );
}
