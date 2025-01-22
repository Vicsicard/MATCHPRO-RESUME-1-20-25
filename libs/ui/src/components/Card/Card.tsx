'use client';

import { forwardRef } from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { styled } from '../../styles/styled';
import { m } from 'framer-motion';

export type CardProps = Omit<MuiCardProps, 'css'> & {
  loading?: boolean;
};

const StyledCard = styled(MuiCard)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const defaultTransition = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 30,
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, loading, ...props }, ref) => {
    return (
      <m.div
        style={{
          opacity: loading ? 0.7 : 1,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={defaultTransition}
      >
        <StyledCard
          ref={ref}
          {...props}
        >
          {loading ? 'Loading...' : children}
        </StyledCard>
      </m.div>
    );
  }
);

Card.displayName = 'Card';
