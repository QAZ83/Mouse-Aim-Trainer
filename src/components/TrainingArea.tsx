import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Target, Settings, Pause, Play, RefreshCw, X } from "lucide-react";

interface TargetProps {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: { x: number; y: number };
  color: string;
}

interface TrainingAreaProps {
  difficulty?: "easy" | "medium" | "hard" | "custom";
  onSessionComplete?: (results: {
    hits: number;
    misses: number;
    accuracy: number;
    clicksPerMinute: number;
    averageReactionTime: number;
  }) => void;
}

const TrainingArea = ({
  difficulty = "medium",
  onSessionComplete = () => {},
}: TrainingAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sessionTime, setSessionTime] = useState(60); // seconds
  const [timeRemaining, setTimeRemaining] = useState(sessionTime);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Metrics
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const [lastTargetSpawnTime, setLastTargetSpawnTime] = useState(Date.now());

  // Settings
  const [targetCount, setTargetCount] = useState(5);
  const [targetSize, setTargetSize] = useState(
    difficulty === "easy" ? 50 : difficulty === "medium" ? 35 : 20,
  );
  const [targetSpeed, setTargetSpeed] = useState(
    difficulty === "easy" ? 2 : difficulty === "medium" ? 3.5 : 5,
  );

  // Initialize targets based on difficulty
  useEffect(() => {
    if (containerRef.current) {
      resetTargets();
    }
  }, [difficulty, containerRef.current]);

  // Timer countdown
  useEffect(() => {
    if (!sessionStarted || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStarted, isPaused]);

  // Move targets animation
  useEffect(() => {
    if (!sessionStarted || isPaused) return;

    const moveTargets = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      setTargets((prevTargets) => {
        return prevTargets.map((target) => {
          let newX = target.x + target.direction.x * target.speed;
          let newY = target.y + target.direction.y * target.speed;

          // Bounce off walls
          if (newX <= 0 || newX >= containerWidth - target.size) {
            target.direction.x *= -1;
            newX = target.x + target.direction.x * target.speed;
          }

          if (newY <= 0 || newY >= containerHeight - target.size) {
            target.direction.y *= -1;
            newY = target.y + target.direction.y * target.speed;
          }

          return { ...target, x: newX, y: newY };
        });
      });
    };

    const animationId = requestAnimationFrame(function animate() {
      moveTargets();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [sessionStarted, isPaused]);

  const resetTargets = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const newTargets: TargetProps[] = [];

    for (let i = 0; i < targetCount; i++) {
      const size = targetSize;
      newTargets.push({
        id: i,
        x: Math.random() * (containerWidth - size),
        y: Math.random() * (containerHeight - size),
        size,
        speed: targetSpeed,
        direction: {
          x: Math.random() > 0.5 ? 1 : -1,
          y: Math.random() > 0.5 ? 1 : -1,
        },
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      });
    }

    setTargets(newTargets);
    setLastTargetSpawnTime(Date.now());
  };

  const handleTargetClick = (targetId: number) => {
    if (!sessionStarted) {
      startSession();
      return;
    }

    // Record reaction time
    const now = Date.now();
    const reactionTime = now - lastTargetSpawnTime;
    setClickTimes((prev) => [...prev, reactionTime]);

    // Update hit count
    setHits((prev) => prev + 1);

    // Replace the clicked target with a new one
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      setTargets((prevTargets) => {
        return prevTargets.map((target) => {
          if (target.id === targetId) {
            const size = targetSize;
            return {
              ...target,
              x: Math.random() * (containerWidth - size),
              y: Math.random() * (containerHeight - size),
              direction: {
                x: Math.random() > 0.5 ? 1 : -1,
                y: Math.random() > 0.5 ? 1 : -1,
              },
              color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            };
          }
          return target;
        });
      });

      setLastTargetSpawnTime(now);
    }
  };

  const handleBackgroundClick = () => {
    if (!sessionStarted) {
      startSession();
      return;
    }

    // Count as a miss
    setMisses((prev) => prev + 1);
  };

  const startSession = () => {
    setSessionStarted(true);
    setTimeRemaining(sessionTime);
    setHits(0);
    setMisses(0);
    setClickTimes([]);
    resetTargets();
  };

  const pauseSession = () => {
    setIsPaused((prev) => !prev);
  };

  const resetSession = () => {
    setSessionStarted(false);
    setIsPaused(false);
    setTimeRemaining(sessionTime);
    setHits(0);
    setMisses(0);
    setClickTimes([]);
    resetTargets();
  };

  const endSession = () => {
    setSessionStarted(false);
    setIsPaused(false);

    // Calculate final metrics
    const totalClicks = hits + misses;
    const accuracy = totalClicks > 0 ? (hits / totalClicks) * 100 : 0;
    const clicksPerMinute = (hits / (sessionTime - timeRemaining)) * 60;
    const averageReactionTime =
      clickTimes.length > 0
        ? clickTimes.reduce((a, b) => a + b, 0) / clickTimes.length
        : 0;

    // Pass results to parent component
    onSessionComplete({
      hits,
      misses,
      accuracy,
      clicksPerMinute,
      averageReactionTime,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Top metrics bar */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="font-bold">Time:</span> {formatTime(timeRemaining)}
          </div>
          <div className="text-sm">
            <span className="font-bold">Hits:</span> {hits}
          </div>
          <div className="text-sm">
            <span className="font-bold">Misses:</span> {misses}
          </div>
          <div className="text-sm">
            <span className="font-bold">Accuracy:</span>{" "}
            {hits + misses > 0
              ? ((hits / (hits + misses)) * 100).toFixed(1)
              : "0"}
            %
          </div>
        </div>

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={pauseSession}
                  disabled={!sessionStarted}
                >
                  {isPaused ? <Play size={18} /> : <Pause size={18} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPaused ? "Resume" : "Pause"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={resetSession}>
                  <RefreshCw size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                >
                  <Settings size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main training area */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-gray-900 overflow-hidden cursor-crosshair"
        onClick={handleBackgroundClick}
      >
        {!sessionStarted && !isPaused && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Aim Training</h2>
              <p className="mb-6">Click anywhere to start</p>
              <Target size={64} className="mx-auto opacity-50" />
            </div>
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Paused</h2>
              <Button onClick={pauseSession}>Resume</Button>
            </div>
          </div>
        )}

        {targets.map((target) => (
          <div
            key={target.id}
            className="absolute rounded-full cursor-pointer"
            style={{
              left: `${target.x}px`,
              top: `${target.y}px`,
              width: `${target.size}px`,
              height: `${target.size}px`,
              backgroundColor: target.color,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleTargetClick(target.id);
            }}
          />
        ))}
      </div>

      {/* Settings panel */}
      {isSettingsOpen && (
        <div className="absolute right-0 top-16 w-80 bg-gray-800 p-4 rounded-l-lg shadow-lg text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Settings</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Session Duration (seconds)
              </label>
              <Slider
                value={[sessionTime]}
                min={10}
                max={300}
                step={10}
                onValueChange={(value) => setSessionTime(value[0])}
                disabled={sessionStarted}
              />
              <div className="text-right text-sm">{sessionTime}s</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Count</label>
              <Slider
                value={[targetCount]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setTargetCount(value[0])}
                disabled={sessionStarted}
              />
              <div className="text-right text-sm">{targetCount}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Size</label>
              <Slider
                value={[targetSize]}
                min={10}
                max={100}
                step={5}
                onValueChange={(value) => setTargetSize(value[0])}
                disabled={sessionStarted}
              />
              <div className="text-right text-sm">{targetSize}px</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Speed</label>
              <Slider
                value={[targetSpeed]}
                min={1}
                max={10}
                step={0.5}
                onValueChange={(value) => setTargetSpeed(value[0])}
                disabled={sessionStarted}
              />
              <div className="text-right text-sm">{targetSpeed}</div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                resetSession();
                setIsSettingsOpen(false);
              }}
              disabled={!sessionStarted && timeRemaining === sessionTime}
            >
              Apply & Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingArea;
