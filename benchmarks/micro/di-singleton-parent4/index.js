import {createBenchmark} from '../container';

export default createBenchmark(
  (container, ctor) => container.registerSingleton(ctor), 2, 6);
