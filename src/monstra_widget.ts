import { DocumentWidget } from '@jupyterlab/docregistry';
import { Panel, Widget } from '@lumino/widgets';
import { MonstraDocModel } from './monstra_model';

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
    this._model.initialize().then(status => {
      if (!status) {
        return;
      }
      const iframe = document.createElement('iframe');
      const id = options.id;
      iframe.src = `/extensions/jupyter-monstra/static/${id}`;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      this.addWidget(new Widget({ node: iframe }));
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
