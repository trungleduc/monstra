import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IDisposable } from '@lumino/disposable';
import { ServiceManager, Session, Kernel } from '@jupyterlab/services';
import { PromiseDelegate } from '@lumino/coreutils';
export class MonstraDocModel implements IDisposable {
  constructor(options: MonstraDocModel.IOptions) {
    this._context = options.context;
    this._manager = options.manager;
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  async initialize(): Promise<boolean> {
    if (this._kernelStarted) {
      return false;
    }
    const filePath = this._context.localPath;
    const sessionManager = this._manager.sessions;
    await sessionManager.ready;
    await this._manager.kernelspecs.ready;
    const specs = this._manager.kernelspecs.specs;
    if (!specs) {
      return false;
    }
    const { kernelspecs } = specs;
    let kernelName = Object.keys(kernelspecs)[0];
    if (kernelspecs[specs.default]) {
      kernelName = specs.default;
    }

    this._sessionConnection = await sessionManager.startNew({
      name: filePath,
      path: filePath,
      kernel: {
        name: kernelName
      },
      type: 'notebook'
    });
    const finish = new PromiseDelegate<void>();
    const cb = (_: Kernel.IKernelConnection, status: Kernel.Status) => {
      if (status === 'idle') {
        this._sessionConnection!.kernel?.statusChanged.disconnect(cb);
        finish.resolve();
      }
    };
    this._sessionConnection.kernel?.statusChanged.connect(cb);

    await finish.promise;
    this._kernelStarted = true;
    return true;
  }
  dispose(): void {
    this._isDisposed = true;
  }

  private _isDisposed = false;
  private _kernelStarted = false;
  private _sessionConnection: Session.ISessionConnection | undefined;
  private _manager: ServiceManager.IManager;
  private _context: DocumentRegistry.IContext<DocumentRegistry.IModel>;
}

export namespace MonstraDocModel {
  export interface IOptions {
    context: DocumentRegistry.IContext<DocumentRegistry.IModel>;
    manager: ServiceManager.IManager;
  }
}
