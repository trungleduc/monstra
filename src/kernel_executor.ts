import { KernelMessage, Session } from '@jupyterlab/services';
import { IKernelExecutor } from './interfaces';

export class KernelExecutor implements IKernelExecutor {
  constructor(options: KernelExecutor.IOptions) {
    this._sessionConnection = options.sessionConnection;
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }
  async getResponse(urlPath: string): Promise<string> {
    if (urlPath === '') {
      // Root path
      return this.executeCode({ code: 'import os\nos.listdir()' });
    }
    return this.executeCode({ code: `import os\nos.listdir('${urlPath}')` });
  }
  async executeCode(
    code: KernelMessage.IExecuteRequestMsg['content']
  ): Promise<string> {
    const kernel = this._sessionConnection?.kernel;
    if (!kernel) {
      throw new Error('Session has no kernel.');
    }
    return new Promise<string>((resolve, reject) => {
      const future = kernel.requestExecute(code, false, undefined);
      future.onIOPub = (msg: KernelMessage.IIOPubMessage): void => {
        const msgType = msg.header.msg_type;
        if (msgType === 'execute_result') {
          const content = (msg as KernelMessage.IExecuteResultMsg).content.data[
            'text/plain'
          ] as string;
          resolve(content);
        } else if (msgType === 'error') {
          console.error('Kernel operation failed', msg.content);
          reject(msg.content);
        }
      };
    });
  }

  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    this._sessionConnection.dispose();
  }

  private _isDisposed: boolean = false;
  private _sessionConnection: Session.ISessionConnection;
}

export namespace KernelExecutor {
  export interface IOptions {
    sessionConnection: Session.ISessionConnection;
  }
}
