import { IDisposable } from '@lumino/disposable';
import { KernelMessage } from '@jupyterlab/services';
export enum MessageAction {
  INIT = 'INIT'
}

export type IDict<T = any> = { [key: string]: T };
export interface IKernelExecutor extends IDisposable {
  getResponse(urlPath: string): Promise<string>;
  executeCode(
    code: KernelMessage.IExecuteRequestMsg['content']
  ): Promise<string>;
}

export interface IConnectionManager {
  registerConnection(
    kernelExecutor: IKernelExecutor
  ): Promise<{ instanceId: string; kernelClientId: string }>;
  generateResponse(option: {
    kernelClientId: string;
    urlPath?: string;
  }): Promise<IDict | null>;
}
