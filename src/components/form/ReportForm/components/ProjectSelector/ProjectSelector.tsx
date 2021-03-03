import { useQuery } from 'react-query';
import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';

import type { IProjectSelectorProps } from './ProjectSelector.types';
import type { IReportFormValues } from '../../ReportForm.types';

import { DropListPicker } from '../../../../data';
import { getAllProjects } from '../../../../../api';

export const ProjectSelector: FunctionComponent<IProjectSelectorProps> = ({}) => {
  const { data, isLoading } = useQuery('projects', getAllProjects);
  const { setValue, getValues } = useFormContext<IReportFormValues>();

  console.log(data);

  if (isLoading || !data) return null;

  return (
    <DropListPicker
      options={data.data.map((project) => ({
        key: project.id,
        value: project.name,
      }))}
      label="Project"
      defaultValue={getValues('project')}
      onChange={(val) => setValue('project', val)}
    />
  );
};
