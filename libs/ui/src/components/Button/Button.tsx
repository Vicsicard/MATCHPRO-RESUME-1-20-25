'use client';

import { forwardRef } from 'react';
import { ButtonProps as MuiButtonProps } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import styled from '@emotion/styled';

export type ButtonProps = Omit<MuiButtonProps, 'css'> & {
  loading?: boolean;
};

const Container = styled.div<{ loading?: boolean }>`
  display: inline-block;
  opacity: ${props => props.loading ? 0.7 : 1};
  transition: opacity 0.2s ease;
`;

const StyledButton = styled(MuiButton)`
  text-transform: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  transform-origin: center;
  
  &:hover {
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, disabled, ...props }, ref) => {
    return (
      <Container loading={loading}>
        <StyledButton
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? 'Loading...' : children}
        </StyledButton>
      </Container>
    );
  }
);

Button.displayName = 'Button';
