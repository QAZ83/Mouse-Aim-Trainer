import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Recommendation {
  id: string;
  type: "critical" | "warning" | "positive" | "info";
  message: string;
  details?: string;
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  className?: string;
}

const RecommendationsPanel = ({
  recommendations = [],
  className,
}: RecommendationsPanelProps) => {
  if (recommendations.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-xl">Recommendations</CardTitle>
          <CardDescription>
            Complete a training session to receive personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-muted-foreground">
          <Info className="h-12 w-12 mb-4 opacity-50" />
          <p>No recommendations available yet</p>
          <p className="text-sm mt-2">
            Complete a training session to get personalized tips
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl">Recommendations</CardTitle>
        <CardDescription>
          Personalized tips to improve your performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <RecommendationItem
            key={recommendation.id}
            recommendation={recommendation}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const RecommendationItem = ({
  recommendation,
}: {
  recommendation: Recommendation;
}) => {
  const { type, message, details } = recommendation;

  const getIcon = () => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "positive":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "positive":
        return "bg-green-50 border-green-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className={cn("p-4 rounded-md border", getBgColor())}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div>
          <p className="font-medium">{message}</p>
          {details && (
            <p className="text-sm mt-1 text-muted-foreground">{details}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPanel;
