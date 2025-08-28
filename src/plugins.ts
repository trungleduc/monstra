import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IEditorServices } from '@jupyterlab/codeeditor';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { MonstraWidgetFactory } from './monstra_widget_factory';

export const monstraDocument: JupyterFrontEndPlugin<void> = {
  id: 'monstra:doc',
  autoStart: true,
  requires: [IRenderMimeRegistry, IEditorServices],
  activate: (
    app: JupyterFrontEnd,
    rendermime: IRenderMimeRegistry,
    editorServices: IEditorServices
  ): void => {
    const factoryName = 'monstra-streamlit';
    const factory = new MonstraWidgetFactory({
      name: factoryName,
      modelName: 'text',
      fileTypes: ['python'],
      manager: app.serviceManager,
      rendermime
    });
    app.docRegistry.addWidgetFactory(factory);
  }
};
