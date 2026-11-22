import { useEffect, useRef, useState } from 'react';
import type { MediaItem, FrameType } from '../data/content';
import { assetUrl } from '../utils/links';
import { CloseIcon } from './Icons';
import styles from '../styles/site.module.css';

export function MediaImage({
  item,
  className,
  priority = false,
  decorative = false,
  fullSize = false,
  thumbnail = false,
  sizes,
}: {
  item: MediaItem;
  className?: string;
  priority?: boolean;
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
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSrc(item.src)}
    />
  );
}

export function DeviceFrame({
  item,
  frame,
  address,
  title,
  priority = false,
  sizes,
}: {
  item: MediaItem;
  frame: FrameType;
  address?: string;
  title?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={styles.deviceFrame} data-frame={frame}>
      {(frame === 'browser' || frame === 'desktop' || frame === 'terminal') && (
        <div className={styles.deviceBar} aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{address ?? title}</span>
        </div>
      )}
      <MediaImage item={item} priority={priority} sizes={sizes} />
    </div>
  );
}

export function Gallery({
  media,
  frame,
  projectName,
  title,
  priority = false,
}: {
  media: MediaItem[];
  frame: FrameType;
  projectName: string;
  title?: string;
  priority?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const suppressClick = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const image = media[active];
  const hasSlides = media.length > 1;

  useEffect(() => {
    if (!opened) return;
    close.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [opened]);

  if (!image) return null;

  function move(direction: number) {
    setActive((index) => (index + direction + media.length) % media.length);
  }

  function openViewer() {
    dialog.current?.showModal();
    setOpened(true);
  }

  return (
    <div className={styles.gallery} data-frame={frame}>
      <div
        className={styles.galleryStage}
        onTouchStart={(event) => {
          suppressClick.current = false;
          const point = event.touches[0];
          touch.current = point ? { x: point.clientX, y: point.clientY } : null;
        }}
        onTouchEnd={(event) => {
          const point = event.changedTouches[0];
          const start = touch.current;
          touch.current = null;
          if (!hasSlides || !point || !start) return;
          const x = point.clientX - start.x;
          const y = point.clientY - start.y;
          if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.4) {
            suppressClick.current = true;
            move(x > 0 ? -1 : 1);
          }
        }}
      >
        {hasSlides && (frame === 'phone' || frame === 'print') && (
          <div className={styles.gallerySecondary} aria-hidden="true">
            <DeviceFrame item={media[(active + 1) % media.length]} frame={frame} title={title} />
          </div>
        )}
        <button
          ref={trigger}
          className={styles.galleryMain}
          type="button"
          onClick={(event) => {
            if (suppressClick.current && event.detail > 0) {
              suppressClick.current = false;
              return;
            }
            openViewer();
          }}
          aria-label={`View full size. ${image.alt}`}
        >
          <div key={image.src} className={styles.galleryImage}>
            <DeviceFrame
              item={image}
              frame={frame}
              title={title}
              priority={priority && active === 0}
              sizes={
                frame === 'phone' || frame === 'print'
                  ? undefined
                  : '(max-width: 900px) 92vw, 760px'
              }
            />
          </div>
          <span className={styles.expandHint}>View full size</span>
        </button>
      </div>

      <div className={styles.galleryToolbar} aria-label={`${projectName} screenshot controls`}>
        {hasSlides && (
          <button type="button" onClick={() => move(-1)} aria-label="Previous screenshot">
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
          <button type="button" onClick={() => move(1)} aria-label="Next screenshot">
            ›
          </button>
        )}
      </div>

      {hasSlides && (
        <div className={styles.thumbnails} aria-label={`${projectName} screenshots`}>
          {media.map((item, index) => (
            <button
              type="button"
              key={item.src}
              aria-current={index === active ? 'true' : undefined}
              onClick={() => setActive(index)}
              aria-label={`Show ${item.label ?? item.alt}`}
            >
              <MediaImage item={item} decorative thumbnail sizes="56px" />
            </button>
          ))}
        </div>
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
          trigger.current?.focus();
        }}
        onKeyDown={(event) => {
          if (!hasSlides || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
          event.preventDefault();
          move(event.key === 'ArrowLeft' ? -1 : 1);
        }}
      >
        {opened && (
          <div className={styles.lightboxInner}>
            <button
              ref={close}
              type="button"
              className={styles.lightboxClose}
              onClick={() => dialog.current?.close()}
              aria-label="Close screenshot"
            >
              <CloseIcon />
            </button>
            <MediaImage item={image} className={styles.lightboxImage} fullSize priority />
            <div className={styles.lightboxControls}>
              {hasSlides && (
                <button type="button" onClick={() => move(-1)}>
                  Previous
                </button>
              )}
              <a href={assetUrl(image.src)} target="_blank" rel="noopener noreferrer">
                Open original
              </a>
              {hasSlides && (
                <button type="button" onClick={() => move(1)}>
                  Next
                </button>
              )}
            </div>
            <p className={styles.srOnly} aria-live="polite">
              {image.alt}
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}
