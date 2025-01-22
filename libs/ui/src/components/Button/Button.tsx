'use client';

import { forwardRef } from 'react';
import { ButtonProps as MuiButtonProps } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@emotion/styled';
import { m } from 'framer-motion';

export type ButtonProps = Omit<MuiButtonProps, 'css'> & {
  loading?: boolean;
};

const StyledButton = styled(MuiButton)`
  text-transform: none;
  border-radius: 8px;
  transition: all 0.2s ease;
`;

const defaultTransition = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 30,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, disabled, ...props }, ref) => {
    return (
      <m.div
        style={{
          display: 'inline-block',
          opacity: loading ? 0.7 : 1,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={defaultTransition}
      >
        <StyledButton
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? 'Loading...' : children}
        </StyledButton>
      </m.div>
    );
  }
);

Button.displayName = 'Button';
