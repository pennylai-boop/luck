type MascotProps = {
  height?: number | string;
  mirrored?: boolean;
};

function Mascot({ height = 280, mirrored = false }: MascotProps) {
  return (
    <img
      src="/mascot.png"
      alt="財神爺"
      style={{
        height,
        width: "auto",
        objectFit: "contain",
        transform: mirrored ? "scaleX(-1)" : undefined,
      }}
      draggable={false}
    />
  );
}

export function MascotLeft({ height = 280, mirrored = true }: MascotProps) {
  return <Mascot height={height} mirrored={mirrored} />;
}

export function MascotRight({ height = 280, mirrored = false }: MascotProps) {
  return <Mascot height={height} mirrored={mirrored} />;
}
