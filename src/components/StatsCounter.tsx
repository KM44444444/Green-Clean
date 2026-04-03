import { useEffect, useState } from "react";

interface StatsCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const StatsCounter = ({ end, duration = 2000, suffix = "" }: StatsCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [end, duration]);

  return (
    <span className="text-3xl font-bold text-accent">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default StatsCounter;