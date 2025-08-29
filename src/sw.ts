// import { expose } from 'comlink';
import { MessageAction } from './interfaces';
import { CommManager } from './serviceworker/comm_manager';

self.addEventListener('install', event => {
  console.log('installing service worker');
});

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
  const pathName = url.pathname
    .replace('/extensions/jupyter-monstra/static/', '')
    .split('/');
  const instanceId = pathName[0];
  const appType = pathName[1];
  const appId = pathName[2];
  console.log('url is changed', pathName, appType, appId);

  const response = await COMM_MANAGER.getResponse(instanceId, appId, '');
  console.log('response', response);
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
