import { ABCWidgetFactory, DocumentRegistry } from '@jupyterlab/docregistry';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { ServiceManager } from '@jupyterlab/services';
import { Panel } from '@lumino/widgets';

import { MonstraDocWidget, MonstraWidget } from './monstra_widget';
import { UUID } from '@lumino/coreutils';
import { MonstraDocModel } from './monstra_model';
import { IConnectionManager } from './interfaces';

export class MonstraWidgetFactory extends ABCWidgetFactory<MonstraDocWidget> {
  constructor(options: MonstraWidgetFactory.IOptions) {
    super(options);
    this._options = options;
  }

  protected createNewWidget(
    context: DocumentRegistry.IContext<any>
  ): MonstraDocWidget {
    const content = new Panel();
    content.addClass('jp-monstra-document-panel');

    context.ready.then(async () => {
      const model = new MonstraDocModel({
        context,
        manager: this._options.manager,
        connectionManager: this._options.connectionManager
      });

      const monstraWidget = new MonstraWidget({
        model,
        id: UUID.uuid4()
      });
      content.addWidget(monstraWidget);
    });

    const widget = new MonstraDocWidget({
      context,
      content
    });

    return widget;
  }
  private _options: MonstraWidgetFactory.IOptions;
}

export namespace MonstraWidgetFactory {
  export interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    manager: ServiceManager.IManager;
    rendermime: IRenderMimeRegistry;
    connectionManager: IConnectionManager;
  }
}
