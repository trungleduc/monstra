import { PageConfig } from '@jupyterlab/coreutils';

export async function initServiceWorker(): Promise<
  ServiceWorker | undefined | null
> {
  if (!('serviceWorker' in navigator)) {
    console.error('Cannot start extension without service worker');

    return;
  }
  const fullLabextensionsUrl = PageConfig.getOption('fullLabextensionsUrl');
  const SCOPE = `${fullLabextensionsUrl}/jupyter-monstra/static`;
  const fullWorkerUrl = `${SCOPE}/service-worker.js`;

  try {
    const reg = await navigator.serviceWorker.register(fullWorkerUrl);

    if (!reg) {
      console.error('Missing service worker registration');
      return;
    }
    await reg.update();
    if (reg.installing) {
      const sw = reg.installing || reg.waiting;
      sw.onstatechange = () => {
        if (sw.state === 'installed') {
          window.location.reload();
        }
      };
    }
    if (reg.active) {
      return reg.active;
    }

    console.log(
      'Service worker newly registered',
      await navigator.serviceWorker.getRegistration(fullWorkerUrl)
    );
    return reg.active;
  } catch (e) {
    console.error('Failed to register service worker', e);

    return;
  }

  return registration?.active;
}
