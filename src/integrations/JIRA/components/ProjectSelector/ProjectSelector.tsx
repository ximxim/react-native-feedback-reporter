import { useQuery } from 'react-query';
import React, { FunctionComponent, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import type { IProjectSelectorProps } from './ProjectSelector.types';

import { compare } from '../../../../utils';
import { getJIRAProjects } from '../../queries';
import { DropListPicker, IReportFormValues } from '../../../../components';

export const ProjectSelector: FunctionComponent<IProjectSelectorProps> = ({
  defaultValue,
  ...dropListPickerProps
}) => {
  const { data, isLoading } = useQuery('JIRAProjects', getJIRAProjects);
  const { setValue, watch } = useFormContext<IReportFormValues>();
  const projects = data?.data || [];

  useEffect(() => {
    const val = defaultValue || '';
    const found = projects.find(
      (issueType) => compare(issueType.name, val) || compare(issueType.key, val)
    );
    setValue('JIRAProject', found?.key);
  }, [isLoading]);

  const options = projects.map((project) => ({
    key: project.key,
    value: project.name,
  }));

  if (isLoading) return null;

  return (
    <DropListPicker
      {...dropListPickerProps}
      options={options}
      label="Project"
      defaultValue={watch('JIRAProject')}
      onChange={(val) => setValue('JIRAProject', val)}
    />
  );
};
