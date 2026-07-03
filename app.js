const chat = document.querySelector('#chat');
const composer = document.querySelector('#composer');
const input = document.querySelector('#messageInput');
const drawer = document.querySelector('#drawer');
const drawerBackdrop = document.querySelector('#drawerBackdrop');
const menuButton = document.querySelector('#menuButton');
const closeDrawer = document.querySelector('#closeDrawer');
const profileButton = document.querySelector('#profileButton');

const templates = {
  profile: `
    <strong>Профиль и анкета</strong>
    <p>Цель: поддержание формы. Бюджет: до 4500 ₽ в неделю. Ограничения: без арахиса, быстрые рецепты до 30 минут.</p>
    <div class="metrics">
      <div class="metric"><span>Белок</span>120 г/день</div>
      <div class="metric"><span>Готовка</span>до 30 мин</div>
    </div>
    <div class="card-actions">
      <button data-action="plan" type="button">Составить план</button>
      <button data-action="progress" type="button">Показать прогресс</button>
    </div>
  `,
  progress: `
    <strong>Прогресс за неделю</strong>
    <p>План выполнен на 72%. Самый частый пропуск — ужин после 21:00. Можно сделать ужины проще и дешевле.</p>
    <div class="metrics">
      <div class="metric"><span>Дней по плану</span>5 из 7</div>
      <div class="metric"><span>Экономия</span>≈ 620 ₽</div>
    </div>
    <div class="card-actions">
      <button data-action="plan" type="button">Обновить план</button>
    </div>
  `,
  plan: `
    <strong>План питания на день</strong>
    <ul class="mini-list">
      <li><b>Завтрак:</b> овсянка с бананом и творогом</li>
      <li><b>Обед:</b> гречка с курицей и овощами</li>
      <li><b>Ужин:</b> салат с тунцом и яйцом</li>
    </ul>
    <div class="metrics">
      <div class="metric"><span>Калории</span>≈ 1850 ккал</div>
      <div class="metric"><span>Стоимость</span>≈ 540 ₽</div>
    </div>
    <div class="card-actions">
      <button data-action="recipe" type="button">Показать рецепт</button>
      <button data-action="shopping" type="button">Создать покупки</button>
      <button data-action="replace" type="button">Заменить ужин</button>
    </div>
  `,
  recipe: `
    <strong>Рецепт: гречка с курицей</strong>
    <p>Время: 25 минут. Подходит для обеда и легко готовится на 2 порции.</p>
    <ul class="mini-list">
      <li>1. Отварить гречку.</li>
      <li>2. Обжарить курицу с луком и морковью.</li>
      <li>3. Смешать, добавить зелень и специи.</li>
    </ul>
    <div class="card-actions">
      <button data-action="shopping" type="button">Добавить ингредиенты</button>
      <button data-action="replace" type="button">Заменить рецепт</button>
    </div>
  `,
  shopping: `
    <strong>Список покупок</strong>
    <p>Собрал продукты из плана. Позиции можно отмечать прямо внутри карточки.</p>
    <div class="checklist">
      <label class="checkline"><input type="checkbox"> Гречка — 500 г</label>
      <label class="checkline"><input type="checkbox"> Куриное филе — 1 кг</label>
      <label class="checkline"><input type="checkbox"> Творог — 600 г</label>
      <label class="checkline"><input type="checkbox"> Бананы — 5 шт</label>
      <label class="checkline"><input type="checkbox"> Тунец — 2 банки</label>
    </div>
    <div class="card-actions">
      <button data-action="cart" type="button">Создать корзину</button>
      <button data-action="cheaper" type="button">Сделать дешевле</button>
    </div>
  `,
  cart: `
    <strong>Корзина готова</strong>
    <p>В корзину добавлено 18 товаров. Примерная стоимость: 3920 ₽.</p>
    <div class="card-actions">
      <button data-action="openCart" type="button">Открыть корзину</button>
      <button data-action="shopping" type="button">Изменить список</button>
    </div>
  `,
  history: `
    <strong>История чатов</strong>
    <ul class="mini-list">
      <li>План на неделю до 4000 ₽</li>
      <li>Рацион без молочных продуктов</li>
      <li>Быстрые ужины после тренировки</li>
    </ul>
  `,
  settings: `
    <strong>Настройки</strong>
    <p>Здесь будут уведомления, язык, интеграция с магазином и параметры персонализации LLM.</p>
  `,
  replace: `
    <strong>Замена ужина</strong>
    <p>Вместо салата с тунцом предлагаю омлет с овощами: дешевле, быстрее и без консервов.</p>
    <div class="card-actions">
      <button data-action="plan" type="button">Применить к плану</button>
      <button data-action="recipe" type="button">Показать рецепт</button>
    </div>
  `,
  cheaper: `
    <strong>Оптимизация бюджета</strong>
    <p>Можно заменить тунца на яйца, часть творога на кефир, а овощи взять сезонные. Экономия около 450 ₽.</p>
    <div class="card-actions">
      <button data-action="shopping" type="button">Обновить список</button>
    </div>
  `,
  openCart: `
    <strong>Демо-ссылка на корзину</strong>
    <p>В реальном приложении здесь откроется корзина магазина-партнёра. В прототипе это финальный шаг сценария.</p>
    <div class="card-actions">
      <button data-action="plan" type="button">Начать новый план</button>
    </div>
  `
};

const sectionToAction = {
  profile: 'profile',
  progress: 'progress',
  plans: 'plan',
  recipes: 'recipe',
  shopping: 'shopping',
  cart: 'cart',
  history: 'history',
  settings: 'settings'
};

function openDrawer() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  drawerBackdrop.hidden = false;
}

function closeDrawerPanel() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  drawerBackdrop.hidden = true;
}

function addBubble(content, type = 'assistant', asCard = false) {
  const bubble = document.createElement('article');
  bubble.className = `bubble ${type}${asCard ? ' card' : ''}`;
  bubble.innerHTML = content;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

function addUserMessage(message) {
  const safe = message.replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));
  addBubble(`<p>${safe}</p>`, 'user');
}

function runAction(action) {
  if (!templates[action]) return;
  addBubble(templates[action], 'assistant', true);
}

function answerMessage(message) {
  const text = message.toLowerCase();
  if (text.includes('план') || text.includes('рацион') || text.includes('меню')) return 'plan';
  if (text.includes('рецепт') || text.includes('готов')) return 'recipe';
  if (text.includes('покуп') || text.includes('список')) return 'shopping';
  if (text.includes('корз')) return 'cart';
  if (text.includes('проф') || text.includes('анкет')) return 'profile';
  if (text.includes('дешев') || text.includes('бюджет')) return 'cheaper';
  return null;
}

menuButton.addEventListener('click', openDrawer);
closeDrawer.addEventListener('click', closeDrawerPanel);
drawerBackdrop.addEventListener('click', closeDrawerPanel);
profileButton.addEventListener('click', () => runAction('profile'));

composer.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  addUserMessage(message);
  input.value = '';
  const action = answerMessage(message);
  setTimeout(() => {
    if (action) {
      runAction(action);
    } else {
      addBubble('<p>Понял запрос. В прототипе лучше всего работают сценарии: план, рецепт, покупки, корзина, профиль и бюджет.</p>', 'assistant');
    }
  }, 250);
});

document.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    runAction(actionButton.dataset.action);
    return;
  }

  const sectionButton = event.target.closest('[data-section]');
  if (sectionButton) {
    const action = sectionToAction[sectionButton.dataset.section];
    closeDrawerPanel();
    setTimeout(() => runAction(action), 160);
  }
});
