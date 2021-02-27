import { NativeModules } from 'react-native';

type FeedbackReporterType = {
  multiply(a: number, b: number): Promise<number>;
};

const { FeedbackReporter } = NativeModules;

export default FeedbackReporter as FeedbackReporterType;
