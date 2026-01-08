import { motion } from 'framer-motion';

const loadingMessages = [
  "Scanning for buzzword density...",
  "Evaluating action verb strength...",
  "Counting missing metrics...",
  "Preparing polite roast...",
  "Almost done judging..."
];

export function AnalyzingLoader() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated circles */}
      <div className="relative w-24 h-24 mb-8">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
        <motion.div
          className="absolute inset-4 rounded-full bg-primary/20"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-8 rounded-full bg-primary"
          animate={{
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Rotating messages */}
      <div className="h-6 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -24, -48, -72, -96, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {loadingMessages.map((message, index) => (
            <p 
              key={index}
              className="text-muted-foreground text-sm h-6 flex items-center justify-center"
            >
              {message}
            </p>
          ))}
          <p className="text-muted-foreground text-sm h-6 flex items-center justify-center">
            {loadingMessages[0]}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
