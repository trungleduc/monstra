export enum MessageAction {
  INIT = 'INIT'
}

export interface IConnectionManager {
  registerConnection(
    kernelExecutor: any
  ): Promise<{ instanceId: string; kernelClientId: string }>;
  generateResponse(option: {
    kernelClientId: string;
    urlPath?: string;
  }): Promise<any>;
}
