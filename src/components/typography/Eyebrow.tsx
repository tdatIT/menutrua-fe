import type {ReactNode} from 'react';
import {Text} from '@astryxdesign/core/Text';

type EyebrowProps = {
  children: ReactNode;
  color?: 'accent' | 'primary' | 'secondary';
};

/** Small uppercase kicker above a headline ("TÍNH NĂNG ĐỒNG ĐỘI"). */
export function Eyebrow({children, color = 'accent'}: EyebrowProps) {
  return (
    <Text type="label" weight="bold" color={color} style={{textTransform: 'uppercase'}}>
      {children}
    </Text>
  );
}
