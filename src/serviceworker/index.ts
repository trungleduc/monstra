export async function initServiceWorker(): Promise<
  ServiceWorker | undefined | null
> {
  if (!('serviceWorker' in navigator)) {
    console.error('Cannot start extension without service worker');

    return;
  }
  const SCOPE = '/extensions/jupyter-monstra/static';
  const fullWorkerUrl = `${SCOPE}/service-worker.js`;

  const registration =
    await navigator.serviceWorker.getRegistration(fullWorkerUrl);
  try {
    if (!registration || !registration.active) {
      await navigator.serviceWorker.register(fullWorkerUrl, {
        scope: SCOPE
      });
      const reg = await navigator.serviceWorker.getRegistration(fullWorkerUrl);
      if (!reg) {
        return;
      }
      if (reg.active) {
        return reg.active;
      }
      await new Promise<void>(resolve => {
        reg.addEventListener('controllerchange', () => {
          resolve();
        });
      });

      console.log(
        'Service worker newly registered',
        await navigator.serviceWorker.getRegistration(fullWorkerUrl)
      );
    } else {
      console.log('Service worker already registered', registration);
    }
  } catch (e) {
    console.error('Failed to register service worker', e);

    return;
  }

  return registration?.active;
}
