'use client';

import { forwardRef } from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import styled from '../../styles/styled';

export type CardProps = Omit<MuiCardProps, 'css'> & {
  loading?: boolean;
};

const Container = styled.div<{ loading?: boolean }>`
  opacity: ${props => props.loading ? 0.7 : 1};
  transition: opacity 0.2s ease;
`;

const StyledCard = styled(MuiCard)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  transform-origin: center;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, loading, ...props }, ref) => {
    return (
      <Container loading={loading}>
        <StyledCard
          ref={ref}
          {...props}
        >
          {loading ? 'Loading...' : children}
        </StyledCard>
      </Container>
    );
  }
);

Card.displayName = 'Card';
