import React, { useState } from "react";
import MainMenu from "./MainMenu";
import TrainingArea from "./TrainingArea";
import DifficultySelector from "./DifficultySelector";
import ResultsScreen from "./ResultsScreen";
import MouseSettings from "./MouseSettings";
import LanguageSwitcher from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

type AppView = "menu" | "training" | "results" | "settings";

interface DifficultySettings {
  level: "easy" | "medium" | "hard" | "custom";
  targetSize: number;
  targetSpeed: number;
  targetCount: number;
  duration: number;
}

const Home = () => {
  const [currentView, setCurrentView] = useState<AppView>("menu");
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
  const [isMouseSettingsOpen, setIsMouseSettingsOpen] = useState(false);
  const [trainingSettings, setTrainingSettings] =
    useState<DifficultySettings | null>(null);
  const [trainingResults, setTrainingResults] = useState({
    accuracy: 0,
    targetsHit: 0,
    totalTargets: 0,
    averageReactionTime: 0,
    clicksPerMinute: 0,
    sessionDuration: 0,
  });
  const [mouseSettings, setMouseSettings] = useState({
    sensitivity: 50,
    dpi: 800,
    pollingRate: 1000,
    acceleration: false,
    smoothing: 0,
    profile: "default",
  });

  const handleStartTraining = () => {
    setIsDifficultyModalOpen(true);
  };

  const handleDifficultySelected = (settings: DifficultySettings) => {
    setTrainingSettings(settings);
    setIsDifficultyModalOpen(false);
    setCurrentView("training");
  };

  const handleAdjustSettings = () => {
    setIsMouseSettingsOpen(true);
  };

  const handleSaveMouseSettings = (settings: any) => {
    setMouseSettings(settings);
    setIsMouseSettingsOpen(false);
  };

  const handleSessionComplete = (results: {
    hits: number;
    misses: number;
    accuracy: number;
    clicksPerMinute: number;
    averageReactionTime: number;
  }) => {
    setTrainingResults({
      accuracy: results.accuracy,
      targetsHit: results.hits,
      totalTargets: results.hits + results.misses,
      averageReactionTime: results.averageReactionTime,
      clicksPerMinute: results.clicksPerMinute,
      sessionDuration: trainingSettings?.duration || 60,
    });
    setCurrentView("results");
  };

  const handleBackToMenu = () => {
    setCurrentView("menu");
  };

  const handleRetry = () => {
    setCurrentView("training");
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4",
        currentView === "training" && "p-0",
      )}
    >
      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      {currentView === "menu" && (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Mouse Aim Trainer
          </h1>
          <MainMenu
            onStartTraining={handleStartTraining}
            onViewStatistics={() => console.log("View statistics clicked")}
            onAdjustSettings={handleAdjustSettings}
          />
        </div>
      )}

      {currentView === "training" && (
        <div className="w-full h-screen">
          <TrainingArea
            difficulty={trainingSettings?.level || "medium"}
            onSessionComplete={handleSessionComplete}
          />
        </div>
      )}

      {currentView === "results" && (
        <ResultsScreen
          accuracy={trainingResults.accuracy}
          targetsHit={trainingResults.targetsHit}
          totalTargets={trainingResults.totalTargets}
          averageReactionTime={trainingResults.averageReactionTime}
          clicksPerMinute={trainingResults.clicksPerMinute}
          sessionDuration={trainingResults.sessionDuration}
          onRetry={handleRetry}
          onBackToMenu={handleBackToMenu}
        />
      )}

      <DifficultySelector
        open={isDifficultyModalOpen}
        onClose={() => setIsDifficultyModalOpen(false)}
        onStartTraining={handleDifficultySelected}
      />

      <MouseSettings
        open={isMouseSettingsOpen}
        onClose={() => setIsMouseSettingsOpen(false)}
        onSaveSettings={handleSaveMouseSettings}
        initialSettings={mouseSettings}
      />
    </div>
  );
};

export default Home;
