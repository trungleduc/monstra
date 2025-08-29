import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IEditorServices } from '@jupyterlab/codeeditor';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { MonstraWidgetFactory } from './monstra_widget_factory';
import { initServiceWorker } from './serviceworker';
import { IConnectionManager, MessageAction } from './interfaces';
import { UUID } from '@lumino/coreutils';
import { expose } from 'comlink';
import { IConnectionManagerToken } from './token';
import { ConnectionManager } from './connection_manager';

/**
 * Initialization data for the jupyter-monstra extension.
 */
export const swPlugin: JupyterFrontEndPlugin<IConnectionManager> = {
  id: 'jupyter-monstra:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  provides: IConnectionManagerToken,
  activate: async (app: JupyterFrontEnd): Promise<IConnectionManager> => {
    console.log('JupyterLab extension jupyter-monstra is activated!');
    const serviceWorker = await initServiceWorker();
    if (!serviceWorker) {
      throw new Error(
        'Failed to register the Service Worker, please make sure to use a browser that supports this feature.'
      );
    }

    const instanceId = UUID.uuid4();
    const { port1: mainToServiceWorker, port2: serviceWorkerToMain } =
      new MessageChannel();

    const commManager = new ConnectionManager(instanceId);
    expose(commManager, mainToServiceWorker);
    serviceWorker.postMessage(
      { type: MessageAction.INIT, data: { instanceId } },
      [serviceWorkerToMain]
    );
    return commManager;
  }
};

export const monstraDocument: JupyterFrontEndPlugin<void> = {
  id: 'monstra:doc',
  autoStart: true,
  requires: [IRenderMimeRegistry, IEditorServices, IConnectionManagerToken],
  activate: (
    app: JupyterFrontEnd,
    rendermime: IRenderMimeRegistry,
    editorServices: IEditorServices,
    connectionManager: IConnectionManager
  ): void => {
    const factoryName = 'monstra-dash';
    const factory = new MonstraWidgetFactory({
      name: factoryName,
      modelName: 'text',
      fileTypes: ['python'],
      manager: app.serviceManager,
      rendermime,
      connectionManager
    });
    app.docRegistry.addWidgetFactory(factory);
  }
};
