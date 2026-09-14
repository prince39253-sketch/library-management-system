document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     STATE — mirrors the original Python `library` dict
  ========================================================= */
  const library = {
    'Python Basics': 5,
    'Data Science': 3,
    'Machine Learning': 2,
  };

  const cardGrid = document.getElementById('cardGrid');
  const shelfCount = document.getElementById('shelfCount');
  const ledgerList = document.getElementById('ledgerList');
  const knownTitles = document.getElementById('knownTitles');
  const issueSelect = document.getElementById('issueSelect');

  /* =========================================================
     SPINE COLOR — deterministic per title, so each book keeps
     the same accent stripe across re-renders
  ========================================================= */
  const spinePalette = [
    'var(--spine-1)',
    'var(--spine-2)',
    'var(--spine-3)',
    'var(--spine-4)',
    'var(--spine-5)',
  ];

  function spineColorFor(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
    }
    return spinePalette[hash % spinePalette.length];
  }

  /* =========================================================
     RENDERING
  ========================================================= */
  function renderShelf(highlightTitle) {
    const titles = Object.keys(library);

    // shelf cards
    cardGrid.innerHTML = '';
    if (!titles.length) {
      cardGrid.innerHTML = '<p class="cards-empty">The shelf is empty.</p>';
    } else {
      titles.forEach((title) => {
        const qty = library[title];
        const card = document.createElement('div');
        card.className = 'card';
        if (title === highlightTitle) card.classList.add('just-updated');
        card.style.borderLeftColor = spineColorFor(title);
        card.innerHTML = `
          <p class="card-title">${escapeHtml(title)}</p>
          <span class="card-stamp ${qty > 0 ? 'in-stock' : 'out-of-stock'}">
            ${qty > 0 ? qty + ' on shelf' : 'none in'}
          </span>
        `;
        cardGrid.appendChild(card);
      });
    }
    shelfCount.textContent = `${titles.length} title${titles.length === 1 ? '' : 's'}`;

    // issue dropdown — only offer titles actually in stock
    issueSelect.innerHTML = '';
    const available = titles.filter((t) => library[t] > 0);
    if (!available.length) {
      const opt = document.createElement('option');
      opt.textContent = 'Nothing available to issue';
      opt.disabled = true;
      opt.selected = true;
      issueSelect.appendChild(opt);
    } else {
      available.forEach((title) => {
        const opt = document.createElement('option');
        opt.value = title;
        opt.textContent = `${title} (${library[title]} left)`;
        issueSelect.appendChild(opt);
      });
    }

    // datalist for return / add inputs
    knownTitles.innerHTML = '';
    titles.forEach((title) => {
      const opt = document.createElement('option');
      opt.value = title;
      knownTitles.appendChild(opt);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function logLedger(message, type = 'info') {
    const li = document.createElement('li');
    li.className = type;

    const time = document.createElement('span');
    time.className = 'ledger-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    li.appendChild(time);
    li.appendChild(document.createTextNode(message));
    ledgerList.appendChild(li);
  }

  /* =========================================================
     TABS
  ========================================================= */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const target = tab.dataset.panel;
      panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === target));
    });
  });

  /* =========================================================
     ISSUE BOOK  — same rule as the Python `elif choice == "2"` branch
  ========================================================= */
  document.getElementById('panel-issue').addEventListener('submit', (e) => {
    e.preventDefault();
    const bookName = issueSelect.value;

    if (!bookName) {
      logLedger('Pick a title to issue first.', 'warn');
      return;
    }
    if (library[bookName] > 0) {
      library[bookName] -= 1;
      logLedger(`${bookName} issued successfully!`, 'ok');
      renderShelf(bookName);
    } else {
      logLedger('Book not available!', 'warn');
      renderShelf();
    }
  });

  /* =========================================================
     RETURN BOOK — same rule as the Python `elif choice == "3"` branch
  ========================================================= */
  document.getElementById('panel-return').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('returnInput');
    const bookName = input.value.trim();
    if (!bookName) return;

    if (bookName in library) {
      library[bookName] += 1;
    } else {
      library[bookName] = 1;
    }
    logLedger(`${bookName} returned successfully!`, 'ok');
    input.value = '';
    renderShelf(bookName);
  });

  /* =========================================================
     ADD BOOK — same rule as the Python `elif choice == "4"` branch
  ========================================================= */
  document.getElementById('panel-add').addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('addTitle');
    const qtyInput = document.getElementById('addQty');
    const bookName = titleInput.value.trim();
    const quantity = parseInt(qtyInput.value, 10);

    if (!bookName || !Number.isFinite(quantity) || quantity < 1) {
      logLedger('Enter a title and a quantity of at least 1.', 'warn');
      return;
    }

    if (bookName in library) {
      library[bookName] += quantity;
    } else {
      library[bookName] = quantity;
    }
    logLedger(`Book added successfully! (${bookName} +${quantity})`, 'ok');
    titleInput.value = '';
    qtyInput.value = 1;
    renderShelf(bookName);
  });

  /* =========================================================
     INIT
  ========================================================= */
  renderShelf();
  logLedger('Welcome — the catalog is open.', 'info');
});
