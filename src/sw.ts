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
  event.respondWith(COMM_MANAGER.generateResponse(event.request));
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
