(() => {
  const tabs = document.querySelectorAll('[data-example]');
  const run = document.getElementById('run-request');
  const payload = document.getElementById('payload');
  const output = document.getElementById('response-output');
  const status = document.getElementById('response-status');
  let selected = 'health';
  document.getElementById('base-url').textContent = window.location.origin;

  function updateExample() {
    document.getElementById('request-code').textContent = selected === 'health'
      ? "fetch('/health')\n  .then(response => response.json())\n  .then(data => console.log(data));"
      : "fetch('/echo', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(" + payload.value + ")\n}).then(response => response.json());";
  }
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    selected = tab.dataset.example;
    tabs.forEach((item) => {
      item.classList.toggle('active', item === tab);
      item.setAttribute('aria-pressed', String(item === tab));
    });
    document.getElementById('payload-group').hidden = selected !== 'echo';
    status.textContent = 'まだ実行していません';
    output.textContent = '// リクエストを実行してください。';
    updateExample();
  }));
  payload.addEventListener('input', updateExample);
  run.addEventListener('click', async () => {
    run.disabled = true;
    tabs.forEach((tab) => { tab.disabled = true; });
    output.setAttribute('aria-busy', 'true');
    status.textContent = '送信中…';
    const start = performance.now();
    try {
      const options = { signal: AbortSignal.timeout(10000) };
      if (selected === 'echo') {
        const body = JSON.parse(payload.value);
        if (body === null || typeof body !== 'object') throw new Error('JSONオブジェクトまたは配列を入力してください。');
        Object.assign(options, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
      const response = await fetch(selected === 'health' ? '/health' : '/echo', options);
      const data = await response.json();
      status.textContent = `${response.status} ${response.statusText} · ${Math.round(performance.now() - start)} ms`;
      output.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      status.textContent = 'リクエストを確認してください';
      output.textContent = error instanceof SyntaxError ? 'JSONの形式が正しくありません。入力内容を確認してください。' : error.name === 'TimeoutError' ? '応答がタイムアウトしました。もう一度お試しください。' : error.message;
    } finally {
      run.disabled = false;
      tabs.forEach((tab) => { tab.disabled = false; });
      output.setAttribute('aria-busy', 'false');
    }
  });
  document.getElementById('copy-url').addEventListener('click', async () => {
    const label = document.getElementById('copy-label');
    try {
      await navigator.clipboard.writeText(window.location.origin);
      label.textContent = 'コピー済み';
      document.getElementById('copy-status').textContent = 'ベースURLをコピーしました。';
    } catch {
      label.textContent = '手動でコピー';
      document.getElementById('copy-status').textContent = 'コピーできませんでした。表示されているURLを選択してコピーしてください。';
    }
    setTimeout(() => { label.textContent = 'コピー'; }, 2500);
  });
})();
