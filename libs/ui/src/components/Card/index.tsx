import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const MotionCard = motion(StyledCard);

export interface CardProps extends Omit<MuiCardProps, 'css'> {
  animate?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, animate = true, ...props }, ref) => {
    const cardProps = animate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
        }
      : {};

    return (
      <MotionCard ref={ref} {...cardProps} {...props}>
        <CardContent>{children}</CardContent>
      </MotionCard>
    );
  }
);

Card.displayName = 'Card';
