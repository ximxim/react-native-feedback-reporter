import type { IRNFRPermission } from '../../../hooks';

export interface IConsumerProps {
  RNFRPermission: IRNFRPermission;
  setRNFRPermission: (RNFRPermission: IRNFRPermission) => void;
}
