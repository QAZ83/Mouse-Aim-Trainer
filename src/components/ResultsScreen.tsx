import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Trophy,
  Target,
  Clock,
  MousePointer,
  BarChart2,
  ArrowLeft,
  Share2,
} from "lucide-react";
import RecommendationsPanel, { Recommendation } from "./RecommendationsPanel";
import { generateRecommendations } from "@/lib/recommendations";

interface ResultsScreenProps {
  accuracy?: number;
  targetsHit?: number;
  totalTargets?: number;
  averageReactionTime?: number;
  clicksPerMinute?: number;
  sessionDuration?: number;
  onRetry?: () => void;
  onBackToMenu?: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  accuracy = 78,
  targetsHit = 42,
  totalTargets = 54,
  averageReactionTime = 345, // in milliseconds
  clicksPerMinute = 68,
  sessionDuration = 120, // in seconds
  onRetry = () => console.log("Retry clicked"),
  onBackToMenu = () => console.log("Back to menu clicked"),
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    // Generate recommendations based on performance metrics
    const generatedRecommendations = generateRecommendations(
      accuracy,
      averageReactionTime,
      clicksPerMinute,
      sessionDuration,
    );
    setRecommendations(generatedRecommendations);
  }, [accuracy, averageReactionTime, clicksPerMinute, sessionDuration]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-100">
      <Card className="w-full max-w-3xl bg-white">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-3xl font-bold mb-2">
            Training Session Results
          </CardTitle>
          <CardDescription>
            Great job! Here's how you performed in your training session.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Main stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<Target className="h-8 w-8 text-blue-500" />}
              title="Accuracy"
              value={`${accuracy}%`}
              description="Targets hit percentage"
            >
              <Progress value={accuracy} className="h-2 mt-2" />
            </StatCard>

            <StatCard
              icon={<Clock className="h-8 w-8 text-green-500" />}
              title="Reaction Time"
              value={`${averageReactionTime}ms`}
              description="Average response time"
            />

            <StatCard
              icon={<MousePointer className="h-8 w-8 text-purple-500" />}
              title="Clicks Per Minute"
              value={clicksPerMinute.toString()}
              description="Your clicking speed"
            />
          </div>

          {/* Additional stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center p-4 rounded-lg border bg-slate-50">
              <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <h3 className="font-medium">Targets Hit</h3>
                <p className="text-2xl font-bold">
                  {targetsHit}{" "}
                  <span className="text-sm text-slate-500 font-normal">
                    / {totalTargets}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg border bg-slate-50">
              <BarChart2 className="h-6 w-6 text-indigo-500 mr-3" />
              <div>
                <h3 className="font-medium">Session Duration</h3>
                <p className="text-2xl font-bold">
                  {Math.floor(sessionDuration / 60)}:
                  {(sessionDuration % 60).toString().padStart(2, "0")}{" "}
                  <span className="text-sm text-slate-500 font-normal">
                    minutes
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <RecommendationsPanel recommendations={recommendations} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={onBackToMenu}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Menu
          </Button>

          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="secondary"
              className="flex-1 sm:flex-initial flex items-center gap-2"
              onClick={() => console.log("Share results")}
            >
              <Share2 className="h-4 w-4" /> Share Results
            </Button>

            <Button className="flex-1 sm:flex-initial" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  description,
  children,
}) => {
  return (
    <div className="flex flex-col p-4 rounded-lg border bg-slate-50">
      <div className="flex items-center mb-2">
        {icon}
        <div className="ml-3">
          <h3 className="font-medium text-slate-700">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {children}
    </div>
  );
};

export default ResultsScreen;
