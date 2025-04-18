'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { RingLoader } from 'react-spinners';

type Props = {
  isLoading: boolean;
};

const SpinnerAnimated = ({ isLoading }: Props) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center my-auto me-2"
        >
          <RingLoader
            color="#ffffff"
            size={16}
            speedMultiplier={1.2}
            aria-label="Loading spinner"
            data-testid="loader"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpinnerAnimated;
