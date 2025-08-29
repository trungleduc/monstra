import { Token } from '@lumino/coreutils';
import { IConnectionManager } from './interfaces';

export const IConnectionManagerToken = new Token<IConnectionManager>(
  'monstra:connection-manager'
);
