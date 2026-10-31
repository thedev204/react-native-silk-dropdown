type Props = {
  src: string;
  label: string;
  size?: 'md' | 'sm';
  controls?: boolean;
};

export function PhoneFrame({
  src,
  label,
  size = 'md',
  controls = false,
}: Props) {
  return (
    <div className={`phone-frame${size === 'sm' ? ' phone-frame--sm' : ''}`}>
      <video
        src={src.startsWith('/') ? src : `/${src}`}
        autoPlay
        muted
        loop
        playsInline
        controls={controls}
        aria-label={label}
      />
    </div>
  );
}
