import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import slides from "./slides";


const BackgroundPattern = ({  gradient }) => {
  const patterns = {
    dots: (
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }} />
      </div>
    ),
  };

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      {patterns.dots}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </>
  );
};




const generateParticles = (count, width = 1920, height = 1080) => {
  return Array.from({ length: count }).map(() => ({
    startX: Math.random() * width,
    startY: Math.random() * height,
    endX: Math.random() * width,
    endY: Math.random() * height,
    duration: Math.random() * 25 + 15,
  }));
};

// Generate globally once
const particlesData = generateParticles(30);

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particlesData.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white/20 rounded-full blur-[0.5px]"
          initial={{ x: p.startX, y: p.startY }}
          animate={{ x: p.endX, y: p.endY }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const ProgressBar = ({ current, total }) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/30 backdrop-blur-sm">
      <motion.div
        className={`h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 shadow-lg`}
        initial={{ width: "0%" }}
        animate={{ width: `${((current + 1) / total) * 100}%` }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
};

export default function Presentation() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const next = () => {
    if (index < slides.length - 1) {
      setDirection(1);
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index]);

  const slide = slides[index];
  const Icon = slide.icon;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1200 : -1200,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction) => ({
      x: direction < 0 ? 1200 : -1200,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    }),
  };

  const bulletVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.08 + 0.2,
        duration: 0.4,
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    }),
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -90, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 12,
        delay: 0.1,
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Animated background elements */}
      <FloatingParticles />
      
      {/* Dynamic glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]"
        animate={{
          x: mousePosition.x * 3,
          y: mousePosition.y * 3,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          type: "spring", 
          stiffness: 30, 
          damping: 30,
          scale: {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]"
        animate={{
          x: -mousePosition.x * 3,
          y: -mousePosition.y * 3,
          scale: [1, 1.15, 1],
        }}
        transition={{ 
          type: "spring", 
          stiffness: 30, 
          damping: 30,
          scale: {
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }
        }}
      />

      <motion.div
        className="w-full max-w-6xl relative z-10"
        style={{
          perspective: "1500px",
        }}
      >
        <ProgressBar current={index} total={slides.length} gradient={slide.gradient} />

        <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
          {/* Slide background pattern */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <BackgroundPattern pattern={slide.bgPattern} gradient={slide.gradient} />
            </motion.div>
          </AnimatePresence>

          {/* Content */}
          <div className="relative z-10 p-8 md:p-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 250, damping: 28 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  filter: { duration: 0.4 },
                }}
              >
                {/* Header with enhanced icon */}
                <div className="flex items-start gap-6 mb-10">
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    className="relative p-5 rounded-2xl shadow-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${slide.accentColor}dd, ${slide.accentColor})`
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <Icon className="w-12 h-12 text-white relative z-10" />
                    <div 
                      className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                      style={{ backgroundColor: slide.accentColor }}
                    />
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.h1
                      className="text-4xl md:text-6xl font-black mb-3 bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent leading-tight"
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {slide.title}
                    </motion.h1>
                    
                    {slide.subtitle && (
                      <motion.p
                        className="text-xl md:text-2xl text-gray-300 font-semibold mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                      >
                        {slide.subtitle}
                      </motion.p>
                    )}
                    
                    {slide.description && (
                      <motion.p
                        className="text-base md:text-lg text-gray-400 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        {slide.description}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Enhanced bullets with better spacing */}
                <ul className="space-y-6 mt-8">
                  {slide.bullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      custom={i}
                      variants={bulletVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex gap-5 items-start group"
                    >
                      <motion.div
                        className="relative mt-2"
                        whileHover={{ scale: 1.3 }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full shadow-lg relative z-10"
                          style={{ backgroundColor: slide.accentColor }}
                        />
                        <div 
                          className="absolute inset-0 w-3 h-3 rounded-full blur-md opacity-50"
                          style={{ backgroundColor: slide.accentColor }}
                        />
                      </motion.div>
                      
                      <motion.span
                        className="text-lg md:text-xl text-gray-100 flex-1 leading-relaxed font-medium"
                        whileHover={{ x: 8, color: "#ffffff" }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {bullet}
                      </motion.span>
                    </motion.li>
                  ))}
                </ul>

                {/* Subtle decorative elements */}
                <motion.div
                  className="absolute top-4 right-4 w-24 h-24 opacity-[0.05]"
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 180, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${slide.gradient} rounded-full`} />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Enhanced Navigation */}
            <motion.div
              className="flex justify-between items-center mt-14 pt-8 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={prev}
                disabled={index === 0}
                className="group relative overflow-hidden px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 border border-white/5"
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10"
                  style={{ backgroundColor: slide.accentColor }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center gap-2 text-white font-semibold">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </span>
              </Button>

              {/* Dot indicators with enhanced styling */}
              <div className="flex items-center gap-2.5">
                {slides.map((s, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className="group relative p-1"
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        i === index
                          ? "scale-125 shadow-lg"
                          : "bg-white/25 group-hover:bg-white/50 scale-100"
                      }`}
                      style={i === index ? { backgroundColor: slide.accentColor } : {}}
                    />
                    {i === index && (
                      <motion.div
                        className="absolute inset-0 rounded-full blur-md opacity-50"
                        style={{ backgroundColor: slide.accentColor }}
                        layoutId="activeDot"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={next}
                disabled={index === slides.length - 1}
                className="group relative overflow-hidden px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 border border-white/5"
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10"
                  style={{ backgroundColor: slide.accentColor }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center gap-2 text-white font-semibold">
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </span>
              </Button>
            </motion.div>

            {/* Keyboard hint with icon */}
            <motion.div
              className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use arrow keys or space to navigate</span>
            </motion.div>
          </div>
        </Card>

        {/* Enhanced slide counter badge */}
        <motion.div
          className="absolute -top-4 right-6 px-6 py-3 rounded-full shadow-2xl border-2 border-white/20"
          style={{ 
            background: `linear-gradient(135deg, ${slide.accentColor}dd, ${slide.accentColor})`
          }}
          initial={{ y: -60, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-white font-bold text-base md:text-lg drop-shadow-lg">
            {index + 1} / {slides.length}
          </span>
        </motion.div>
      </motion.div>

      {/* Elegant cursor follower */}
      <motion.div
        className="hidden md:block fixed w-8 h-8 border-2 border-white/30 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x * 50 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 960),
          y: mousePosition.y * 50 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 540),
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      />
    </div>
  );
}