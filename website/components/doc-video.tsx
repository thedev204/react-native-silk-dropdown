import { PhoneFrame } from '@/components/phone-frame';

type Props = {
  src: string;
  caption?: string;
};

export default function DocVideo({ src, caption }: Props) {
  return (
    <figure className="not-prose my-8 flex flex-col items-center gap-3">
      <PhoneFrame src={src} label={caption ?? 'Demo'} size="sm" />
      {caption ? (
        <figcaption className="text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
