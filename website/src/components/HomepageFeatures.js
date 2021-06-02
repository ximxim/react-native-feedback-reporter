import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'iOS and Android Friendly',
    Svg: require('../../static/img/platforms-logo.svg').default,
    description: (
      <>Currently, this package supports android and iOS platforms.</>
    ),
  },
  {
    title: 'Frictionless Setup',
    Svg: require('../../static/img/html-coding.svg').default,
    description: <>This tool works right out the box.</>,
  },
  {
    title: 'User Insight',
    Svg: require('../../static/img/react-native-mobile.svg').default,
    description: <>Get insight into a tester's experience.</>,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
