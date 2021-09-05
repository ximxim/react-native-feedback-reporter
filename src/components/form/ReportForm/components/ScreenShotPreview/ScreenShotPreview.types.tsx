import type { ITabProps } from '../../../../ui';
import type { NavigationElementType } from '../../../../../hooks';

export interface IPreviewProps {
  components: Record<string, NavigationElementType>;
}

export interface IPreviewTab extends Partial<ITabProps> {
  name: string;
}
