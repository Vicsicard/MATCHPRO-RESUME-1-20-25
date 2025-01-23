'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { Cancel } from '@mui/icons-material';

export default function CancelPage() {
  const router = useRouter();

  return (
    <Box
      className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4"
    >
      <div className="animate-bounce mb-6">
        <Cancel color="error" sx={{ fontSize: 64 }} />
      </div>
      <Typography variant="h4" component="h1" gutterBottom>
        Payment Cancelled
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
        Your payment was cancelled. No charges were made.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/pricing')}
        className="mt-6"
      >
        Try Again
      </Button>
    </Box>
  );
}
