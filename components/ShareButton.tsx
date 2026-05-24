export function ShareButton() {
  return (
    <button className="share-button" type="button" data-share-button="" aria-label="このページを共有" title="このページを共有">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .13.88L8.91 8.42a3 3 0 1 0 0 7.16l6.22 3.54A3 3 0 1 0 16 17.4l-6.22-3.54a3.06 3.06 0 0 0 0-3.72L16 6.6A3 3 0 0 0 18 8Z" />
      </svg>
      <span>共有</span>
    </button>
  );
}
