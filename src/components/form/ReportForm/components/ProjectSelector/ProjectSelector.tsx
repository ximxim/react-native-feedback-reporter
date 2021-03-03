import { useQuery } from 'react-query';
import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';

import type { IProjectSelectorProps } from './ProjectSelector.types';
import type { IReportFormValues } from '../../ReportForm.types';

import { compare } from '../../../../../utils';
import { DropListPicker } from '../../../../data';
import { getAllProjects } from '../../../../../api';

export const ProjectSelector: FunctionComponent<IProjectSelectorProps> = ({}) => {
  const { data, isLoading } = useQuery('projects', getAllProjects);
  const { setValue, getValues } = useFormContext<IReportFormValues>();

  if (isLoading || !data) return null;

  return (
    <DropListPicker
      options={data.data.map((project) => ({
        key: project.key,
        value: project.name,
      }))}
      label="Project"
      defaultValue={
        data.data.find((issueType) => {
          const val = getValues('project') || '';
          return compare(issueType.name, val) || compare(issueType.key, val);
        })?.key
      }
      onChange={(val) => setValue('project', val)}
    />
  );
};
