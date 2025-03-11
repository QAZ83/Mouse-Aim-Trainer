import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Target,
  BarChart2,
  Settings,
  Trophy,
  MousePointer,
} from "lucide-react";
import TranslatedText from "./TranslatedText";
import { getCurrentLanguage } from "@/lib/i18n";

interface MainMenuProps {
  onStartTraining?: () => void;
  onViewStatistics?: () => void;
  onAdjustSettings?: () => void;
}

const MainMenu = ({
  onStartTraining = () => {},
  onViewStatistics = () => {},
  onAdjustSettings = () => {},
}: MainMenuProps) => {
  const [hoverButton, setHoverButton] = useState<string | null>(null);

  const isRtl = getCurrentLanguage() === "ar";

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-[600px] mx-auto p-8 rounded-xl bg-slate-900 shadow-lg">
      <div className="mb-8 flex items-center">
        <MousePointer
          className={cn("h-8 w-8 text-blue-400", isRtl ? "ml-3" : "mr-3")}
        />
        <h1 className="text-3xl font-bold text-white">
          <TranslatedText id="app.title" />
        </h1>
      </div>

      <div className="w-full space-y-4 mt-4">
        <Button
          className={cn(
            "w-full py-6 text-lg flex items-center justify-start transition-all",
            hoverButton === "training" ? "bg-blue-600" : "bg-blue-500",
          )}
          onMouseEnter={() => setHoverButton("training")}
          onMouseLeave={() => setHoverButton(null)}
          onClick={onStartTraining}
        >
          <Target className={cn("h-6 w-6", isRtl ? "ml-4" : "mr-4")} />
          <TranslatedText id="menu.startTraining" />
        </Button>

        <Button
          className={cn(
            "w-full py-6 text-lg flex items-center justify-start transition-all",
            hoverButton === "statistics" ? "bg-purple-600" : "bg-purple-500",
          )}
          variant="default"
          onMouseEnter={() => setHoverButton("statistics")}
          onMouseLeave={() => setHoverButton(null)}
          onClick={onViewStatistics}
        >
          <BarChart2 className={cn("h-6 w-6", isRtl ? "ml-4" : "mr-4")} />
          <TranslatedText id="menu.viewStatistics" />
        </Button>

        <Button
          className={cn(
            "w-full py-6 text-lg flex items-center justify-start transition-all",
            hoverButton === "settings" ? "bg-emerald-600" : "bg-emerald-500",
          )}
          variant="default"
          onMouseEnter={() => setHoverButton("settings")}
          onMouseLeave={() => setHoverButton(null)}
          onClick={onAdjustSettings}
        >
          <Settings className={cn("h-6 w-6", isRtl ? "ml-4" : "mr-4")} />
          <TranslatedText id="menu.adjustSettings" />
        </Button>
      </div>

      <div className="mt-12 flex items-center text-slate-400">
        <Trophy className={cn("h-5 w-5", isRtl ? "ml-2" : "mr-2")} />
        <p className="text-sm">
          <TranslatedText id="menu.improvePrecision" />
        </p>
      </div>
    </div>
  );
};

export default MainMenu;
