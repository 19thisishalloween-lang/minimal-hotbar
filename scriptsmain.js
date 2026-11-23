// scripts/main.js
// Minimal Hotbar — сворачивает панель действий

console.log("Minimal Hotbar | Скрипт загружен");

Hooks.once("init", () => {
  console.log("Minimal Hotbar | Хук init");
  game.settings.register("minimal-hotbar", "collapsed", {
    scope: "client",
    config: false,
    type: Boolean,
    default: false
  });
});

Hooks.once("ready", () => {
  console.log("Minimal Hotbar | Хук ready");

  // Создаём кнопку-переключатель и вешаем её на body,
  // чтобы она не зависела от внутренней разметки хотбара.
  const toggle = document.createElement("button");
  toggle.id = "minimal-hotbar-toggle";
  toggle.type = "button";
  toggle.innerHTML = "▼";
  toggle.title = "Свернуть/развернуть панель";
  document.body.appendChild(toggle);
  console.log("Minimal Hotbar | Кнопка добавлена");

  // Применяем состояние: добавляем/убираем класс на body
  const applyState = (collapsed) => {
    document.body.classList.toggle("minimal-hotbar-collapsed", collapsed);
    toggle.innerHTML = collapsed ? "▲" : "▼";
  };

  // Читаем сохранённое состояние
  let collapsed = false;
  try {
    collapsed = game.settings.get("minimal-hotbar", "collapsed") ?? false;
  } catch (e) {
    console.warn("Minimal Hotbar | Не удалось прочитать настройку", e);
  }
  applyState(collapsed);
  console.log("Minimal Hotbar | Состояние применено:", collapsed);

  // Обработчик клика
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const newState = !document.body.classList.contains("minimal-hotbar-collapsed");
    applyState(newState);
    try {
      game.settings.set("minimal-hotbar", "collapsed", newState);
    } catch (e) {
      console.warn("Minimal Hotbar | Не удалось сохранить настройку", e);
    }
    console.log("Minimal Hotbar | Переключено в состояние:", newState);
  });
});