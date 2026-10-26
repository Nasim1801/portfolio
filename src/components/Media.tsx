import { useEffect, useRef, useState } from 'react';
import type { MediaItem, FrameType } from '../data/content';
import { assetUrl } from '../utils/links';
import { CloseIcon } from './Icons';
import styles from '../styles/site.module.css';

export function MediaImage({
  item,
  className,
  placeholderLabel = 'Screenshot coming soon',
  priority = false,
}: {
  item: MediaItem;
  className?: string;
  placeholderLabel?: string;
  priority?: boolean;
}) {
  const [missing, setMissing] = useState(false);

  if (item.available === false || missing) {
    return (
      <div
        className={`${styles.mediaPlaceholder} ${className ?? ''}`}
        role="img"
        aria-label={item.alt}
      >
        <span>{placeholderLabel}</span>
      </div>
    );
  }

  const image = (
    <img
      className={className}
      src={assetUrl(item.fallbackSrc ?? item.src)}
      srcSet={
        item.smallSrc && !item.fallbackSrc
          ? `${assetUrl(item.smallSrc)} ${item.smallWidth ?? 640}w, ${assetUrl(item.src)} ${item.width}w`
          : undefined
      }
      sizes={item.smallSrc && !item.fallbackSrc ? item.sizes : undefined}
      alt={item.alt}
      width={item.width}
      height={item.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setMissing(true)}
    />
  );

  return item.fallbackSrc ? (
    <picture>
      <source
        srcSet={
          item.smallSrc
            ? `${assetUrl(item.smallSrc)} ${item.smallWidth ?? 640}w, ${assetUrl(item.src)} ${item.width}w`
            : assetUrl(item.src)
        }
        sizes={item.smallSrc ? item.sizes : undefined}
        type="image/webp"
      />
      {image}
    </picture>
  ) : (
    image
  );
}

export function OptionalImage({ item, className }: { item: MediaItem; className?: string }) {
  const [missing, setMissing] = useState(false);

  if (item.available === false || missing) return null;

  return (
    <img
      className={className}
      src={assetUrl(item.src)}
      alt={item.alt}
      width={item.width}
      height={item.height}
      loading="lazy"
      decoding="async"
      onError={() => setMissing(true)}
    />
  );
}

export function DeviceFrame({
  item,
  frame,
  compact = false,
  address,
  title,
  priority = false,
}: {
  item: MediaItem;
  frame: FrameType;
  compact?: boolean;
  address?: string;
  title?: string;
  priority?: boolean;
}) {
  if (frame === 'phone') {
    return (
      <div className={`${styles.phoneFrame} ${compact ? styles.phoneFrameCompact : ''}`}>
        <span className={styles.phoneSpeaker} aria-hidden="true" />
        <MediaImage item={item} className={styles.phoneImage} priority={priority} />
      </div>
    );
  }

  if (frame === 'desktop') {
    return (
      <div className={styles.desktopFrame}>
        <div className={styles.desktopBar} aria-hidden="true">
          <span />
          <span />
          <span />
          <div>{title ?? 'Desktop application'}</div>
        </div>
        <MediaImage item={item} className={styles.desktopImage} />
      </div>
    );
  }

  if (frame === 'terminal') {
    return (
      <div className={styles.terminalFrame}>
        <div className={styles.terminalBar} aria-hidden="true">
          <span />
          <span />
          <span />
          <div>{title ?? 'Test results'}</div>
        </div>
        <MediaImage item={item} className={styles.terminalImage} />
      </div>
    );
  }

  return (
    <div className={styles.browserFrame}>
      <div className={styles.browserBar} aria-hidden="true">
        <span />
        <span />
        <span />
        <div className={styles.browserAddress}>{address ?? 'localhost / project'}</div>
      </div>
      <MediaImage item={item} className={styles.browserImage} />
    </div>
  );
}

export function Gallery({
  media,
  frame,
  projectName,
  initialIndex = 0,
  frameForIndex,
  captions,
  address,
  title,
  proof,
}: {
  media: MediaItem[];
  frame: FrameType;
  projectName: string;
  initialIndex?: number;
  frameForIndex?: FrameType[];
  captions?: Array<string | undefined>;
  address?: string;
  title?: string;
  proof?: { index: number; caption: string };
}) {
  const [active, setActive] = useState(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowRight') setActive((value) => (value + 1) % media.length);
      if (event.key === 'ArrowLeft')
        setActive((value) => (value - 1 + media.length) % media.length);
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus();
    };
  }, [lightboxOpen, media.length]);

  const openAt = (index: number, trigger: HTMLElement) => {
    setActive(index);
    triggerRef.current = trigger;
    setLightboxOpen(true);
  };

  const scrollTo = (index: number) => {
    setActive(index);
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({ left: carousel.clientWidth * index, behavior: 'smooth' });
  };

  const sideIndexes = [(active + 1) % media.length, (active + 2) % media.length];
  const activeFrame = frameForIndex?.[active] ?? frame;
  const visibleThumbnails = media
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => index !== proof?.index);

  const framedImage = (index: number) => (
    <DeviceFrame
      item={media[index]}
      frame={frameForIndex?.[index] ?? frame}
      address={address}
      title={title}
    />
  );

  return (
    <div className={`${styles.gallery} ${frame === 'phone' ? styles.galleryPhone : ''}`}>
      {frame === 'phone' ? (
        <>
          <div className={styles.phoneGalleryStage}>
            <button
              className={`${styles.phoneGallerySide} ${styles.phoneGallerySideLeft}`}
              type="button"
              onClick={(event) => openAt(sideIndexes[0], event.currentTarget)}
              aria-label={`Open ${media[sideIndexes[0]].alt} full size`}
            >
              <DeviceFrame item={media[sideIndexes[0]]} frame="phone" compact />
            </button>
            <button
              className={styles.phoneGalleryMain}
              type="button"
              onClick={(event) => openAt(active, event.currentTarget)}
              aria-label={`View full size. ${media[active].alt}`}
            >
              <DeviceFrame item={media[active]} frame="phone" />
              <span className={styles.expandHint}>View full size</span>
            </button>
            <button
              className={`${styles.phoneGallerySide} ${styles.phoneGallerySideRight}`}
              type="button"
              onClick={(event) => openAt(sideIndexes[1], event.currentTarget)}
              aria-label={`Open ${media[sideIndexes[1]].alt} full size`}
            >
              <DeviceFrame item={media[sideIndexes[1]]} frame="phone" compact />
            </button>
          </div>

          <div
            ref={carouselRef}
            className={styles.mobileCarousel}
            aria-label={`${projectName} swipeable screenshot gallery`}
            onScroll={(event) => {
              const width = event.currentTarget.clientWidth;
              if (width) setActive(Math.round(event.currentTarget.scrollLeft / width));
            }}
          >
            {media.map((item, index) => (
              <button
                type="button"
                key={item.src}
                onClick={(event) => openAt(index, event.currentTarget)}
                aria-label={`Open ${item.alt} full size`}
              >
                <DeviceFrame item={item} frame="phone" />
              </button>
            ))}
          </div>
          <div className={styles.carouselDots} aria-label={`${projectName} gallery slides`}>
            {media.map((item, index) => (
              <button
                type="button"
                key={item.src}
                className={index === active ? styles.carouselDotActive : ''}
                onClick={() => scrollTo(index)}
                aria-label={`Show screenshot ${index + 1}: ${item.alt}`}
                aria-current={index === active ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      ) : (
        <button
          className={styles.galleryMain}
          type="button"
          onClick={(event) => openAt(active, event.currentTarget)}
          aria-label={`${address ?? projectName}. View full size. ${media[active].alt}`}
        >
          {framedImage(active)}
          <span className={styles.expandHint}>View full size</span>
        </button>
      )}

      {captions?.[active] && <p className={styles.galleryCaption}>{captions[active]}</p>}

      <div
        className={`${styles.thumbnails} ${frame === 'phone' ? styles.phoneThumbnails : ''}`}
        aria-label={`${projectName} screenshot gallery`}
      >
        {visibleThumbnails.map(({ item, index }) => (
          <button
            className={`${styles.thumbnail} ${index === active ? styles.thumbnailActive : ''}`}
            type="button"
            key={item.src}
            onClick={() => setActive(index)}
            aria-label={`Show ${item.alt}`}
            aria-current={index === active ? 'true' : undefined}
          >
            <MediaImage item={item} />
          </button>
        ))}
      </div>

      {proof && (
        <button
          className={styles.galleryProof}
          type="button"
          onClick={(event) => openAt(proof.index, event.currentTarget)}
          aria-label={`${proof.caption}. Open ${media[proof.index].alt} full size`}
        >
          {framedImage(proof.index)}
          <span>{proof.caption}</span>
        </button>
      )}

      {lightboxOpen && (
        <div
          ref={dialogRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName} screenshot viewer`}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setLightboxOpen(false);
          }}
        >
          <button
            ref={closeButtonRef}
            className={styles.lightboxClose}
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close full-size screenshot"
          >
            <CloseIcon />
          </button>
          <div className={styles.lightboxMedia}>
            <DeviceFrame item={media[active]} frame={activeFrame} address={address} title={title} />
          </div>
          {media.length > 1 && (
            <div className={styles.lightboxControls}>
              <button
                type="button"
                onClick={() => setActive((value) => (value - 1 + media.length) % media.length)}
              >
                Previous
              </button>
              <span aria-live="polite">
                {active + 1} / {media.length}
              </span>
              <button
                type="button"
                onClick={() => setActive((value) => (value + 1) % media.length)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
