import { IConnectionManager } from './interfaces';
import { UUID } from '@lumino/coreutils';

export class ConnectionManager implements IConnectionManager {
  constructor(public instanceId: string) {}

  async registerConnection(
    kernelExecutor: any
  ): Promise<{ instanceId: string; kernelClientId: string }> {
    const uuid = UUID.uuid4();

    this._kernelExecutors.set(uuid, kernelExecutor);

    return { instanceId: this.instanceId, kernelClientId: uuid };
  }

  async generateResponse(option: { kernelClientId: string }): Promise<any> {
    const executor = this._kernelExecutors.get(option.kernelClientId);
    console.log('called in main thread', option, executor);
    return { foo: 'bar' };
  }

  private _kernelExecutors = new Map<string, any>();
}
