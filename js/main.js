// ИнструментБург — ремонт ИБП.
//
// Две задачи:
// 1) отметка целевых действий (WhatsApp / телефон) — без внешних скриптов;
// 2) страховка: если CSS не применился или анимации недоступны,
//    контент всё равно должен быть виден, а не застрять на opacity:0.

(function () {
  "use strict";

  // ── 1. Страховка видимости ──
  // Ставим класс на <html> как можно раньше. Если движок умеет keyframes
  // и пользователь не отключал движение, оставляем эффекты. Иначе — noanim.
  var root = document.documentElement;
  var canAnimate =
    typeof root.animate === "function" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches === false;

  if (!canAnimate) root.classList.add("noanim");

  // Страховка на случай, если CSS не догрузился: проверяем РЕАЛЬНОЕ состояние,
  // а не наличие анимации в разметке. Если через 1.2с элементы всё ещё скрыты —
  // значит CSS с эффектом не применился, и мы показываем контент принудительно.
  function revealFallback() {
    function show() {
      window.setTimeout(function () {
        var hidden = document.querySelectorAll(".rise");
        var stuck = 0;
        hidden.forEach(function (el) {
          if (parseFloat(getComputedStyle(el).opacity) < 0.95) stuck++;
        });
        if (stuck > 0) root.classList.add("noanim");
      }, 1200);
    }
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show);
  }
  revealFallback();

  // ── 2. Целевые действия ──
  var leads = document.querySelectorAll('a[href^="https://wa.me"], a[href^="tel:"]');

  leads.forEach(function (link) {
    link.addEventListener("click", function () {
      var action =
        link.getAttribute("data-track") ||
        (link.protocol === "tel:" ? "phone" : "whatsapp");

      if (window.gtag) {
        window.gtag("event", "generate_lead", { lead_type: action });
      }

      // Готовая точка подключения Яндекс.Метрики без загрузки внешнего скрипта.
      window.__ibpLead = (window.__ibpLead || []).concat([
        { action: action, at: Date.now() }
      ]);
    });
  });
})();
