import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  security: {
    expiresIn: '1d',
    refreshIn: '7d',
    bcryptSaltOrRound: 12,
  },
};

export default (): Config => config;