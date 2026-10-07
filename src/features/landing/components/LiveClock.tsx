import {useSyncExternalStore} from 'react';
import {Text} from '@astryxdesign/core/Text';

// One shared 1s ticker for every subscriber, paused when nobody listens.
let now = new Date();
const subscribers = new Set<() => void>();
let timer: number | undefined;

function subscribe(callback: () => void) {
  subscribers.add(callback);
  if (subscribers.size === 1) {
    timer = window.setInterval(() => {
      now = new Date();
      subscribers.forEach((notify) => notify());
    }, 1000);
  }
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) window.clearInterval(timer);
  };
}

const formatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/** "10:32:11" — ticks every second. */
export function LiveClock() {
  const time = useSyncExternalStore(subscribe, () => now);
  return (
    <Text type="display-2" weight="bold" hasTabularNumbers>
      <time dateTime={time.toISOString()}>{formatter.format(time)}</time>
    </Text>
  );
}
