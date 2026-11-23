import { useEffect, useRef, useState } from 'react';
import type { FrameType, MediaItem } from '../data/content';
import { assetUrl } from '../utils/links';
import { CloseIcon } from './Icons';
import styles from '../styles/site.module.css';

export function MediaImage({
  item,
  className,
  priority = false,
  eager = false,
  decorative = false,
  fullSize = false,
  thumbnail = false,
  sizes,
}: {
  item: MediaItem;
  className?: string;
  priority?: boolean;
  eager?: boolean;
  decorative?: boolean;
  fullSize?: boolean;
  thumbnail?: boolean;
  sizes?: string;
}) {
  const thumbnailSrc = thumbnail && item.thumbnailSrc;
  const [failedSrc, setFailedSrc] = useState<string>();
  if (failedSrc === item.src) {
    return decorative ? null : (
      <span className={styles.mediaUnavailable}>Image unavailable: {item.alt}</span>
    );
  }

  return (
    <img
      className={className}
      src={assetUrl(thumbnailSrc || item.src)}
      srcSet={
        !fullSize && !thumbnailSrc && item.smallSrc
          ? `${assetUrl(item.smallSrc)} ${item.smallWidth ?? 640}w, ${assetUrl(item.src)} ${item.width}w`
          : undefined
      }
      sizes={sizes ?? item.sizes}
      alt={decorative ? '' : item.alt}
      width={item.width}
      height={item.height}
      loading={eager || priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      onError={() => setFailedSrc(item.src)}
    />
  );
}

export function Gallery({
  media,
  frame,
  projectName,
}: {
  media: MediaItem[];
  frame: FrameType;
  projectName: string;
}) {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const image = media[active];
  const hasSlides = media.length > 1;
  const landscape = frame === 'browser' || frame === 'desktop' || frame === 'terminal';

  useEffect(() => {
    if (!opened) return;
    close.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [opened]);

  useEffect(() => {
    scrollArea.current?.scrollTo(0, 0);
  }, [active, zoomed]);

  if (!image) return null;

  function move(direction: number) {
    setActive((index) => (index + direction + media.length) % media.length);
  }

  return (
    <figure className={styles.gallery} data-frame={frame}>
      <div className={styles.galleryStage}>
        <a
          ref={trigger}
          href={assetUrl(image.src)}
          className={styles.galleryMain}
          onClick={(event) => {
            if (
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey ||
              !dialog.current?.showModal
            )
              return;
            event.preventDefault();
            dialog.current.showModal();
            setOpened(true);
          }}
          aria-label={`View full size. ${image.alt}`}
        >
          <MediaImage
            key={image.src}
            className={styles.galleryImage}
            item={image}
            priority={active === 0}
            eager
            sizes={landscape ? '(max-width: 760px) 92vw, 640px' : '(max-width: 420px) 47vw, 240px'}
          />
          <span className={styles.expandHint}>View full size</span>
        </a>
      </div>

      <figcaption className={styles.galleryToolbar}>
        {hasSlides && (
          <button
            data-enhanced
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous screenshot"
          >
            ‹
          </button>
        )}
        <p aria-live="polite">
          <strong>{image.label ?? 'Product screenshot'}</strong>
          {hasSlides && (
            <span>
              {active + 1} of {media.length}
            </span>
          )}
        </p>
        {hasSlides && (
          <button data-enhanced type="button" onClick={() => move(1)} aria-label="Next screenshot">
            ›
          </button>
        )}
      </figcaption>

      {hasSlides && (
        <ul className={styles.thumbnails} aria-label={`More ${projectName} screenshots`}>
          {media.map((item, index) => (
            <li key={item.src}>
              <a
                href={assetUrl(item.src)}
                aria-current={index === active ? 'true' : undefined}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  setActive(index);
                }}
                aria-label={`Show ${item.label ?? item.alt}`}
              >
                <MediaImage item={item} decorative thumbnail sizes="56px" />
              </a>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={`${projectName} screenshot viewer`}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onClose={() => {
          setOpened(false);
          setZoomed(false);
          trigger.current?.focus();
        }}
        onKeyDown={(event) => {
          if (
            event.target === scrollArea.current ||
            !hasSlides ||
            (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
          )
            return;
          event.preventDefault();
          move(event.key === 'ArrowLeft' ? -1 : 1);
        }}
      >
        {opened && (
          <div className={styles.lightboxInner}>
            <header className={styles.lightboxHeader}>
              <p aria-live="polite">{image.label ?? projectName}</p>
              <button
                ref={close}
                type="button"
                className={styles.iconButton}
                onClick={() => dialog.current?.close()}
                aria-label="Close screenshot"
              >
                <CloseIcon />
              </button>
            </header>
            <div
              ref={scrollArea}
              className={styles.lightboxViewport}
              data-zoomed={zoomed || undefined}
              tabIndex={zoomed ? 0 : undefined}
              role="region"
              aria-label="Screenshot"
            >
              <MediaImage item={image} className={styles.lightboxImage} fullSize eager />
            </div>
            <div className={styles.lightboxControls}>
              {hasSlides && (
                <button type="button" onClick={() => move(-1)}>
                  Previous
                </button>
              )}
              <button type="button" onClick={() => setZoomed(!zoomed)}>
                {zoomed ? 'Fit image' : 'Zoom in'}
              </button>
              <a href={assetUrl(image.src)} target="_blank" rel="noopener noreferrer">
                Open original
              </a>
              {hasSlides && (
                <button type="button" onClick={() => move(1)}>
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </figure>
  );
}
