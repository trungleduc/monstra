import { IConnectionManager, IDict, IKernelExecutor } from './interfaces';
import { UUID } from '@lumino/coreutils';

export class ConnectionManager implements IConnectionManager {
  constructor(public instanceId: string) {}

  async registerConnection(
    kernelExecutor: IKernelExecutor
  ): Promise<{ instanceId: string; kernelClientId: string }> {
    const uuid = UUID.uuid4();

    this._kernelExecutors.set(uuid, kernelExecutor);

    return { instanceId: this.instanceId, kernelClientId: uuid };
  }

  async generateResponse(options: {
    kernelClientId: string;
    urlPath?: string;
  }): Promise<IDict | null> {
    const { urlPath, kernelClientId } = options;
    const executor = this._kernelExecutors.get(kernelClientId);
    if (!executor) {
      return null;
    }
    const response = await executor.getResponse(urlPath ?? '');
    return { response };
  }

  private _kernelExecutors = new Map<string, IKernelExecutor>();
}
