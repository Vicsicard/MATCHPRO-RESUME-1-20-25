'use client';

import { ComponentType, forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';

type WithMotionProps<P> = Omit<P, keyof MotionProps> & {
  loading?: boolean;
};

export function withMotion<P>(Component: ComponentType<P>) {
  const MotionComponent = motion(Component);

  return forwardRef<HTMLElement, WithMotionProps<P> & MotionProps>((props, ref) => {
    const { loading, ...rest } = props;
    const motionProps: MotionProps = {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    };

    return (
      <MotionComponent
        ref={ref}
        {...motionProps}
        {...(rest as P)}
        style={{ opacity: loading ? 0.7 : 1 }}
      />
    );
  });
}
