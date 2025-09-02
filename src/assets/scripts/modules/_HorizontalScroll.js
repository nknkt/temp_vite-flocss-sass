function initHorizontalScroll() {
  const horizontalSections = document.querySelectorAll('.js-horizontal-scroll');
  const tracks = [];

  horizontalSections.forEach(container => {
    const track = container.querySelector('.js-products-track');
    if (!track) return;
    tracks.push({ container, track, currentX: 0 });
  });

  function handleWheel(e) {
    // メニューが開いている場合は横スクロールを無効化
    if (document.body.classList.contains('is-menu-open')) {
      return;
    }

    tracks.forEach(obj => {
      const { track } = obj;
      const trackRect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const maxScroll = track.scrollWidth - track.clientWidth;

      // 下スクロール時は下端、上スクロール時は上端で横スクロール
      if (
        (e.deltaY > 0 && trackRect.bottom <= windowHeight && trackRect.top < windowHeight) ||
        (e.deltaY < 0 && trackRect.top >= 0 && trackRect.bottom <= windowHeight)
      ) {
        // 端に到達していたら通常のホイール動作
        if ((obj.currentX <= 0 && e.deltaY < 0) || (obj.currentX >= maxScroll && e.deltaY > 0)) {
          return;
        }
        e.preventDefault();
        obj.currentX += e.deltaY;
        obj.currentX = Math.max(0, Math.min(obj.currentX, maxScroll));
        track.style.transform = `translateX(-${obj.currentX}px)`;
      }
    });
  }

  window.addEventListener('wheel', handleWheel, { passive: false });
}

window.addEventListener('load', initHorizontalScroll);

export default function HorizontalScroll() {}
