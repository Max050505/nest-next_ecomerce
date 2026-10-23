import { Throttle } from '@nestjs/throttler';

export const StrictThrottler = () =>
  Throttle({
    default: {
      ttl: 60_000,
      limit: 3,
    },
  });
export const ModerateThrottler = () =>
  Throttle({
    default: {
      ttl: 60_000,
      limit: 5,
    },
  });
export const RelaxedThrottler = () =>
  Throttle({
    default: {
      ttl: 60_000,
      limit: 20,
    },
  });
