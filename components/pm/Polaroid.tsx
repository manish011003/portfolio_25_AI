import { ImageLightbox } from "./ImageLightbox";
import { Tape } from "./Doodles";

export function Polaroid({
  src,
  alt,
  caption,
  rotate = "-2deg",
  wide = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  rotate?: string;
  wide?: boolean;
}) {
  return (
    <figure
      className={`relative mx-auto w-full bg-cream p-2.5 pb-10 shadow-[0_16px_40px_rgba(17,17,17,0.14)] ${wide ? "max-w-3xl" : "max-w-[420px]"}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <Tape />
      <ImageLightbox src={src} alt={alt} caption={caption} className="block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="aspect-[16/10] w-full object-cover" />
      </ImageLightbox>
      {caption ? (
        <figcaption className="absolute bottom-2.5 left-0 right-0 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
