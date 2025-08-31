import { IDisposable } from '@lumino/disposable';
import { KernelMessage } from '@jupyterlab/services';
export enum MessageAction {
  INIT = 'INIT'
}

export type IDict<T = any> = { [key: string]: T };
export interface IKernelExecutorParams {
  method: string;
  urlPath: string;
  headers: IDict;
  params?: string;
  requestBody?: ArrayBuffer;
}
export interface IKernelExecutor extends IDisposable {
  getResponse(options: IKernelExecutorParams): Promise<IDict>;
  executeCode(
    code: KernelMessage.IExecuteRequestMsg['content']
  ): Promise<string>;
}

export interface IConnectionManager {
  registerConnection(
    kernelExecutor: IKernelExecutor
  ): Promise<{ instanceId: string; kernelClientId: string }>;
  generateResponse(
    option: { kernelClientId: string } & IKernelExecutorParams
  ): Promise<IDict | null>;
}
