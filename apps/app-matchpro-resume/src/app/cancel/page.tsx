'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function CancelPage() {
  const router = useRouter();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 3,
        textAlign: 'center',
        px: 2,
      }}
    >
      <Cancel
        sx={{
          fontSize: 80,
          color: 'error.main',
          mb: 2,
        }}
      />
      <Typography variant="h4" gutterBottom>
        Subscription Cancelled
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Your subscription process was cancelled. No charges have been made to your account.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/pricing')}
        >
          Return to Pricing
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
}
