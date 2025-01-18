import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  padding: '10px 20px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  '&.MuiButton-containedPrimary': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  },
}));

const MotionButton = motion(StyledButton);

export interface ButtonProps extends Omit<MuiButtonProps, 'css'> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, ...props }, ref) => {
    return (
      <MotionButton
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';
