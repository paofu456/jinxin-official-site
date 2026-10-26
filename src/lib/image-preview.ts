interface PreviewOptions {
  closeLabel: string;
  returnFocus?: HTMLElement;
}

/** Keep documents fitted to the viewport, but let long reports scroll at readable width. */
export function showImagePreview(source: HTMLImageElement, options: PreviewOptions): void {
  const dialog = document.createElement('dialog');
  dialog.className = 'image-dialog';
  dialog.setAttribute('aria-label', source.alt || options.closeLabel);
  const image = source.cloneNode(true) as HTMLImageElement;
  image.loading = 'eager';
  image.removeAttribute('style');
  const setLayout = () => {
    dialog.classList.toggle('image-dialog--long', image.naturalHeight > image.naturalWidth * 2.4);
    if (image.naturalWidth) image.style.setProperty('--preview-width', `${Math.min(image.naturalWidth, 960)}px`);
  };
  image.addEventListener('load', setLayout);
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = options.closeLabel;
  dialog.append(close, image);
  document.body.append(dialog);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    dialog.remove();
    options.returnFocus?.focus({ preventScroll: true });
  });
  setLayout();
  dialog.showModal();
  close.focus();
}
