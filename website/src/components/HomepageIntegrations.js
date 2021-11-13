import React from 'react';
import clsx from 'clsx';
import styles from './HomepageIntegrations.module.css';

const Platforms = [
  {
    title: 'JIRA',
    Svg: require('../../static/img/jira.svg').default,
  },
  {
    title: 'Slack',
    Svg: require('../../static/img/slack.svg').default,
  },
  {
    title: 'Github',
    Svg: require('../../static/img/github.svg').default,
  },
  {
    title: 'Trello',
    Svg: require('../../static/img/trello.svg').default,
  },
  {
    title: 'Hipchat',
    Svg: require('../../static/img/hipchat.svg').default,
  },
  {
    title: 'Discord',
    Svg: require('../../static/img/discord.svg').default,
  },
  {
    title: 'Microsoft Teams',
    Svg: require('../../static/img/microsoftTeams.svg').default,
  },
  {
    title: 'Many More',
    Svg: require('../../static/img/manymore.svg').default,
  },
];

function Logo({ Svg, title }) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Svg className={styles.integrationsSvg} alt={title} />
      </div>
    </div>
  );
}

export default function HomepageIntegrations() {
  return (
    <>
      <h2 className={styles.heading}>Send bug reports to many integrations</h2>
      <section className={styles.integrations}>
        <div className="container">
          <div className="row">
            {Platforms.map((props, idx) => (
              <Logo key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
