type Props = {
  children?: React.ReactNode;
};

export function MapPreview({ children }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-50">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {children}
    </div>
  );
}
