import { useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { useFormContext } from 'react-hook-form';

import { compare } from '../../../utils';
import { getJIRAProjects } from '../queries';
import { IReportFormValues, IOption, GlobalProps } from '../../../components';

export const useJIRAProjects = () => {
  const { jira, authState } = useContext(GlobalProps);
  const { data, isLoading } = useQuery('JIRAProjects', getJIRAProjects, {
    enabled: !!authState.jira?.token || !!jira?.token,
  });
  const {
    setValue,
    register,
    unregister,
  } = useFormContext<IReportFormValues>();
  const projects = data?.data || [];

  useEffect(() => {
    if (!jira) return;

    register('JIRAProject');

    return () => {
      unregister(['JIRAProject']);
    };
  }, [register]);

  useEffect(() => {
    if (!jira) return;

    const val = jira?.projectField?.defaultValue || '';
    const found = projects.find(
      (issueType) => compare(issueType.name, val) || compare(issueType.key, val)
    );
    setValue('JIRAProject', found?.id);
  }, [isLoading]);

  const options: IOption[] = projects.map((project) => ({
    key: project.id,
    value: project.name,
  }));

  if (isLoading) return [];

  return options;
};
