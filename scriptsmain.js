console.log("Minimal UI | Скрипт загружен");

Hooks.once("init", () => {
  game.settings.register("minimal-hotbar", "hidden", {
    scope: "client",
    config: false,
    type: Boolean,
    default: false
  });

  // Применяем класс сразу, чтобы не было "мигания" при загрузке
  try {
    if (game.settings.get("minimal-hotbar", "hidden")) {
      document.body.classList.add("minimal-ui-hidden");
    }
  } catch (e) { /* настройки ещё не готовы — ничего страшного */ }
});

Hooks.once("ready", () => {
  console.log("Minimal UI | ready");

  // Ищем кнопку-якорь (свёртывание боковой панели)
  const anchor = document.querySelector('[data-action="toggleState"]');

  // Создаём кнопку-переключатель
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "minimal-ui-toggle";
  btn.className = "ui-control plain icon fas fa-eye-slash";
  btn.title = "Скрыть/показать панели интерфейса";
  btn.setAttribute("aria-label", "Скрыть панели");

  if (anchor) {
    // Вставляем кнопку сразу после кнопки свёртывания сайдбара
    anchor.insertAdjacentElement("afterend", btn);
    console.log("Minimal UI | кнопка вставлена после toggleState");
  } else {
    // Резервный вариант: фиксируем в левом верхнем углу
    btn.style.position = "fixed";
    btn.style.left = "10px";
    btn.style.top = "220px";
    btn.style.zIndex = "1000";
    document.body.appendChild(btn);
    console.warn("Minimal UI | toggleState не найдена, кнопка помещена в левый верхний угол");
  }

  const applyState = (hidden) => {
    document.body.classList.toggle("minimal-ui-hidden", hidden);
    btn.classList.toggle("fa-eye", hidden);
    btn.classList.toggle("fa-eye-slash", !hidden);
    btn.title = hidden ? "Показать панели интерфейса" : "Скрыть панели интерфейса";
    btn.setAttribute("aria-label", hidden ? "Показать панели" : "Скрыть панели");
  };

  let hidden = false;
  try {
    hidden = game.settings.get("minimal-hotbar", "hidden") ?? false;
  } catch (e) {
    console.warn("Minimal UI | не удалось прочитать настройку", e);
  }
  applyState(hidden);

  btn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    hidden = !hidden;
    applyState(hidden);
    try {
      game.settings.set("minimal-hotbar", "hidden", hidden);
    } catch (e) {
      console.warn("Minimal UI | не удалось сохранить настройку", e);
    }
  });
});