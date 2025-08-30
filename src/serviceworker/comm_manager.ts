import { IConnectionManager, IDict } from '../interfaces';
import { wrap } from 'comlink';
export class CommManager {
  constructor() {}
  registerComm(instanceId: string, port: MessagePort): void {
    const comm = wrap<Omit<IConnectionManager, 'registerConnection'>>(port);

    this._commIds.set(instanceId, comm);
  }
  async getResponse(
    instanceId: string,
    kernelClientId: string,
    urlPath: string
  ): Promise<IDict | null> {
    const comm = this._commIds.get(instanceId);
    if (!comm) {
      throw new Error('Missing comm');
    }

    const response = await comm.generateResponse({ kernelClientId, urlPath });
    return response;
  }
  private _commIds: Map<
    string,
    Omit<IConnectionManager, 'registerConnection'>
  > = new Map();
}
