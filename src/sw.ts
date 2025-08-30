// import { expose } from 'comlink';
import { MessageAction } from './interfaces';
import { CommManager } from './serviceworker/comm_manager';

const COMM_MANAGER = new CommManager();
/**
 * Install event listeners
 */
self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
self.addEventListener('message', onMessage);

/**
 * Handle installation
 */
async function onInstall(event: ExtendableEvent): Promise<void> {
  console.log('installing service worker');
  await self.skipWaiting();
}

/**
 * Handle activation.
 */
async function onActivate(event: ExtendableEvent): Promise<void> {
  event.waitUntil(self.clients.claim());
}

/**
 * Handle fetching a single resource.
 */
async function onFetch(event: FetchEvent): Promise<void> {
  const url = new URL(event.request.url);
  const pathAfterExtensionName = url.pathname.split(
    '/jupyter-monstra/static/'
  )[1];
  console.log('Intercepting', url.pathname);
  const pathName = pathAfterExtensionName.split('/');
  const instanceId = pathName[0];
  // const appType = pathName[1];
  const appId = pathName[2];
  const remainingPath = pathName.slice(3).join('/');
  if (instanceId && appId) {
    event.respondWith(
      (async () => {
        const data = await COMM_MANAGER.getResponse(
          instanceId,
          appId,
          remainingPath
        );

        if (data?.response) {
          return new Response(data.response);
        }
        return await fetch(url);
      })()
    );
  }

  return;
}

function onMessage(
  msg: MessageEvent<{ type: MessageAction; data: any }>
): void {
  const { type, data } = msg.data;

  switch (type) {
    case MessageAction.INIT: {
      const { instanceId } = data;
      const serviceWorkerToMain = msg.ports[0];
      COMM_MANAGER.registerComm(instanceId, serviceWorkerToMain);
      break;
    }
    default:
      break;
  }
}
