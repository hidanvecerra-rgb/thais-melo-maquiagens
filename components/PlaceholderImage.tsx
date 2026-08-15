// Nenhuma fotografia real foi fornecida ainda. Este componente marca
// visivelmente onde uma foto real deve entrar, sem fingir ser um
// trabalho real da Thais. Para substituir: basta trocar por <Image>
// (next/image) apontando para o caminho indicado em cada "path".
interface PlaceholderImageProps {
  path: string;
  label?: string;
  className?: string;
  variant?: "square" | "portrait" | "wide";
}

export default function PlaceholderImage({
  path,
  label,
  className,
  variant,
}: PlaceholderImageProps) {
  return (
    <div
      className={
        "placeholder-frame" + (variant ? ` ${variant}` : "") + (className ? ` ${className}` : "")
      }
      role="img"
      aria-label={label ?? "Fotografia a ser adicionada"}
    >
      <span className="placeholder-tag">{label ?? path}</span>
    </div>
  );
}
