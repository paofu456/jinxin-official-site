interface InquiryMessages {
  sending: string; success: string; error: string; unknown: string;
  unavailable: string; rateLimited: string;
}

export function mountInquiryForm(form: HTMLFormElement): void {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[data-inquiry-status]')!;
  const messages: InquiryMessages = JSON.parse(form.dataset.messages || '{}');
  const endpoint = form.dataset.endpoint || '';
  const idleLabel = button.textContent || '';
  let busy = false;
  let previousContent = '';
  let submissionId = '';
  const report = (message: string, state: string) => {
    status.textContent = message;
    status.dataset.state = state;
  };
  let configured = false;
  try {
    const url = new URL(endpoint);
    configured = (url.protocol === 'https:' ||
      (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) && !url.username && !url.password;
  } catch { /* Missing configuration keeps the form closed. */ }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    if (!configured) { report(messages.unavailable, 'error'); return; }
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const content = Object.fromEntries(['name', 'phone', 'email', 'fax', 'message', 'website'].map(key => [key, String(values.get(key) || '').trim()]));
    const payload = { ...content, language: form.dataset.language || 'zh' };
    const fingerprint = JSON.stringify(payload);
    if (fingerprint !== previousContent) {
      submissionId = crypto.randomUUID();
      previousContent = fingerprint;
    }
    busy = true;
    button.disabled = true;
    button.textContent = messages.sending;
    form.setAttribute('aria-busy', 'true');
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]), textarea'));
    const readOnly = inputs.map(input => input.readOnly);
    inputs.forEach(input => { input.readOnly = true; });
    report(messages.sending, 'pending');
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, submissionId }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (response.ok && result.ok === true && result.code === 'submitted' && result.submissionId === submissionId) {
        form.reset();
        previousContent = '';
        submissionId = '';
        report(messages.success, 'success');
      } else {
        const message = result.code === 'send_unknown' ? messages.unknown :
          result.code === 'rate_limited' ? messages.rateLimited :
          result.code === 'not_configured' ? messages.unavailable : messages.error;
        report(message, 'error');
      }
    } catch { report(messages.unknown, 'error'); }
    finally {
      window.clearTimeout(timer);
      busy = false;
      button.disabled = false;
      button.textContent = idleLabel;
      form.removeAttribute('aria-busy');
      inputs.forEach((input, index) => { input.readOnly = readOnly[index]; });
    }
  });

  if (!configured) {
    button.disabled = true;
    report(messages.unavailable, 'error');
    return;
  }
  button.disabled = false;
  report('', 'idle');
}
