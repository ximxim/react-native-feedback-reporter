import { useQuery } from 'react-query';
import React, { FunctionComponent } from 'react';

import type { IProjectSelectorProps } from './ProjectSelector.types';

import { DropListPicker } from '../../../../data';
import { getAllProjects } from '../../../../../api';

export const ProjectSelector: FunctionComponent<IProjectSelectorProps> = ({}) => {
  const { data, isLoading } = useQuery('projects', getAllProjects);

  if (isLoading || !data) return null;

  return (
    <DropListPicker
      options={data.data.map((project) => ({
        key: project.id,
        value: project.name,
      }))}
      onChange={console.log}
    />
  );
};
