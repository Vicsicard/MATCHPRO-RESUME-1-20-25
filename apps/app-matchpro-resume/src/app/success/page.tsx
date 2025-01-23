'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('Invalid session');
      setLoading(false);
      return;
    }

    // Verify the session status
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify session');
        }

        // Wait for 2 seconds to show success animation
        setTimeout(() => setLoading(false), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setLoading(false);
      }
    };

    verifySession();
  }, [searchParams]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Confirming your subscription...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 3,
        }}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => router.push('/dashboard')}>
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 3,
        textAlign: 'center',
      }}
    >
      <CheckCircle
        sx={{
          fontSize: 80,
          color: 'success.main',
          mb: 2,
        }}
      />
      <Typography variant="h4" gutterBottom>
        Thank You for Your Subscription!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Your subscription has been successfully activated. You now have access to all premium features.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => router.push('/dashboard')}
        sx={{ mt: 2 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6">Loading...</Typography>
        </Box>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
