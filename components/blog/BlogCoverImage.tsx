import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
};

export function BlogCoverImage({ src, alt, className = "", sizes, priority, loading }: Props) {
  const commonImg = `object-cover ${className}`.trim();
  if (!src) {
    return <div className={`relative aspect-[16/10] w-full bg-slate-100 ${className}`} aria-hidden />;
  }
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
      <Image
        src={src}
        alt={alt || " "}
        fill
        className={commonImg}
        sizes={sizes ?? "(max-width: 768px) 100vw, 800px"}
        priority={priority}
        loading={priority ? undefined : loading ?? "lazy"}
      />
    </div>
  );
}
