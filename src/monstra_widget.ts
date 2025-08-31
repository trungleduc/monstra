import { DocumentWidget } from '@jupyterlab/docregistry';
import { Panel, Widget } from '@lumino/widgets';
import { MonstraDocModel } from './monstra_model';
import { PageConfig } from '@jupyterlab/coreutils';

export class MonstraDocWidget extends DocumentWidget {
  constructor(options: DocumentWidget.IOptions) {
    super(options);
  }

  dispose(): void {
    this.content.dispose();
    super.dispose();
  }
}

export class MonstraWidget extends Panel {
  constructor(options: MonstraWidget.IOptions) {
    super();
    this._model = options.model;
    this.addClass('mt-iframe-panel');
    this._model.initialize().then(connectionData => {
      if (!connectionData) {
        return;
      }
      const fullLabextensionsUrl = PageConfig.getOption('fullLabextensionsUrl');
      const iframe = document.createElement('iframe');
      iframe.src = `${fullLabextensionsUrl}/jupyter-monstra/static/${connectionData.instanceId}/dash/${connectionData.kernelClientId}/`;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      const w = new Widget({ node: iframe });
      w.addClass('mt-iframe-host');
      this.addWidget(w);
    });
  }

  get model(): MonstraDocModel {
    return this._model;
  }

  private _model: MonstraDocModel;
}

export namespace MonstraWidget {
  export interface IOptions {
    id: string;
    model: MonstraDocModel;
  }
}
