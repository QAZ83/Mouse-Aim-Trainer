import { Recommendation } from "@/components/RecommendationsPanel";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates personalized recommendations based on user performance metrics
 */
export const generateRecommendations = (
  accuracy: number,
  reactionTime: number,
  clicksPerMinute: number,
  sessionDuration: number,
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Accuracy recommendations
  if (accuracy < 50) {
    recommendations.push({
      id: uuidv4(),
      type: "critical",
      message: "Your accuracy is very low",
      details:
        "Focus on precision over speed. Try lowering your sensitivity and take more time to aim.",
    });
  } else if (accuracy < 70) {
    recommendations.push({
      id: uuidv4(),
      type: "warning",
      message: "Your accuracy needs improvement",
      details:
        "Try to balance speed and precision. Consider adjusting your DPI settings.",
    });
  } else if (accuracy > 90) {
    recommendations.push({
      id: uuidv4(),
      type: "positive",
      message: "Excellent accuracy!",
      details:
        "Your precision is very good. Consider increasing difficulty or speed.",
    });
  }

  // Reaction time recommendations
  if (reactionTime > 500) {
    recommendations.push({
      id: uuidv4(),
      type: "warning",
      message: "Your reaction time is slow",
      details:
        "Try to focus more on quick target acquisition. Consider increasing your polling rate.",
    });
  } else if (reactionTime < 250) {
    recommendations.push({
      id: uuidv4(),
      type: "positive",
      message: "Fast reaction time!",
      details:
        "Your reactions are quick. Try to maintain this speed while improving accuracy.",
    });
  }

  // Clicks per minute recommendations
  if (clicksPerMinute < 30) {
    recommendations.push({
      id: uuidv4(),
      type: "info",
      message: "Your clicking speed is below average",
      details:
        "Try to increase your clicking speed while maintaining accuracy.",
    });
  } else if (clicksPerMinute > 60) {
    recommendations.push({
      id: uuidv4(),
      type: "positive",
      message: "Good clicking speed",
      details:
        "Your clicking speed is above average. Focus on maintaining accuracy at this speed.",
    });
  }

  // Mouse settings recommendations based on performance
  if (accuracy < 60 && reactionTime > 400) {
    recommendations.push({
      id: uuidv4(),
      type: "info",
      message: "Consider adjusting your mouse settings",
      details:
        "Your current settings may not be optimal. Try lowering your DPI and disabling acceleration.",
    });
  }

  // Session duration recommendations
  if (sessionDuration < 30) {
    recommendations.push({
      id: uuidv4(),
      type: "info",
      message: "Try longer training sessions",
      details:
        "Longer sessions help build muscle memory. Aim for at least 2-3 minutes per session.",
    });
  } else if (sessionDuration > 180) {
    recommendations.push({
      id: uuidv4(),
      type: "info",
      message: "Consider shorter, more focused sessions",
      details:
        "Very long sessions can lead to fatigue. Try multiple shorter sessions with breaks in between.",
    });
  }

  return recommendations;
};

/**
 * Generates recommendations based on mouse settings
 */
export const generateSettingsRecommendations = (
  dpi: number,
  sensitivity: number,
  acceleration: boolean,
  pollingRate: number,
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // DPI recommendations
  if (dpi > 3000) {
    recommendations.push({
      id: uuidv4(),
      type: "warning",
      message: "Very high DPI setting",
      details:
        "High DPI can make precise movements difficult. Consider lowering unless you're using a high-resolution display.",
    });
  } else if (dpi < 400) {
    recommendations.push({
      id: uuidv4(),
      type: "warning",
      message: "Very low DPI setting",
      details:
        "Low DPI requires more physical movement. Consider increasing for better responsiveness.",
    });
  }

  // Sensitivity recommendations
  if (sensitivity > 80 && dpi > 1600) {
    recommendations.push({
      id: uuidv4(),
      type: "warning",
      message: "High sensitivity with high DPI",
      details:
        "This combination can make precise aiming difficult. Consider lowering one of these values.",
    });
  }

  // Acceleration recommendations
  if (acceleration) {
    recommendations.push({
      id: uuidv4(),
      type: "info",
      message: "Mouse acceleration is enabled",
      details:
        "For consistent aim, most competitive players disable acceleration for more predictable movements.",
    });
  }

  // Polling rate recommendations
  if (pollingRate < 500) {
    recommendations.push({
      id: uuidv4(),
      type: "info",
      message: "Low polling rate",
      details:
        "A higher polling rate (1000Hz+) can provide more responsive input for gaming.",
    });
  }

  return recommendations;
};

/**
 * Returns a set of default recommendations for new users
 */
export const getDefaultRecommendations = (): Recommendation[] => [
  {
    id: uuidv4(),
    type: "info",
    message: "Start with the accuracy training",
    details: "Focus on hitting targets accurately before working on speed.",
  },
  {
    id: uuidv4(),
    type: "info",
    message: "Adjust your mouse settings",
    details:
      "Find a comfortable DPI and sensitivity setting that allows for both precision and quick movements.",
  },
  {
    id: uuidv4(),
    type: "info",
    message: "Train regularly",
    details:
      "Short, regular practice sessions are more effective than occasional long sessions.",
  },
];
