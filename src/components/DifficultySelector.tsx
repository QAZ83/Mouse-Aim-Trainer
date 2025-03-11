import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Target, Zap, Settings } from "lucide-react";

export interface DifficultySettings {
  level: "easy" | "medium" | "hard" | "custom";
  targetSize: number;
  targetSpeed: number;
  targetCount: number;
  duration: number;
}

interface DifficultySelectorProps {
  open?: boolean;
  onClose?: () => void;
  onStartTraining?: (settings: DifficultySettings) => void;
}

const DifficultySelector = ({
  open = true,
  onClose = () => {},
  onStartTraining = () => {},
}: DifficultySelectorProps) => {
  const [activeTab, setActiveTab] = useState<string>("preset");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | "custom"
  >("medium");

  // Custom settings state
  const [customSettings, setCustomSettings] = useState<{
    targetSize: number;
    targetSpeed: number;
    targetCount: number;
    duration: number;
  }>({
    targetSize: 50,
    targetSpeed: 50,
    targetCount: 10,
    duration: 60,
  });

  const difficultyPresets = {
    easy: {
      targetSize: 80,
      targetSpeed: 30,
      targetCount: 5,
      duration: 60,
    },
    medium: {
      targetSize: 50,
      targetSpeed: 50,
      targetCount: 10,
      duration: 60,
    },
    hard: {
      targetSize: 30,
      targetSpeed: 80,
      targetCount: 15,
      duration: 60,
    },
  };

  const handleStartTraining = () => {
    const settings: DifficultySettings = {
      level: selectedDifficulty,
      ...(selectedDifficulty === "custom"
        ? customSettings
        : difficultyPresets[selectedDifficulty]),
    };
    onStartTraining(settings);
  };

  const handleCustomSettingChange = (
    setting: keyof typeof customSettings,
    value: number,
  ) => {
    setCustomSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
    if (selectedDifficulty !== "custom") {
      setSelectedDifficulty("custom");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Select Difficulty
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose a preset difficulty level or customize your training session.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="preset"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="preset" className="flex items-center gap-2">
              <Target size={16} /> Presets
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Settings size={16} /> Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4">
            <RadioGroup
              value={selectedDifficulty}
              onValueChange={(value) =>
                setSelectedDifficulty(
                  value as "easy" | "medium" | "hard" | "custom",
                )
              }
              className="grid grid-cols-1 gap-4"
            >
              {Object.entries(difficultyPresets).map(([level, settings]) => (
                <Label
                  key={level}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-slate-100 transition-colors ${selectedDifficulty === level ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}
                  htmlFor={level}
                >
                  <RadioGroupItem value={level} id={level} />
                  <div className="flex-1">
                    <div className="font-medium capitalize">{level}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      <div className="flex justify-between">
                        <span>Target Size: {settings.targetSize}%</span>
                        <span>Speed: {settings.targetSpeed}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Targets: {settings.targetCount}</span>
                        <span>Duration: {settings.duration}s</span>
                      </div>
                    </div>
                  </div>
                  {level === "easy" && (
                    <div className="text-green-500 text-sm font-medium">
                      Beginner
                    </div>
                  )}
                  {level === "medium" && (
                    <div className="text-yellow-500 text-sm font-medium">
                      Intermediate
                    </div>
                  )}
                  {level === "hard" && (
                    <div className="text-red-500 text-sm font-medium">
                      Advanced
                    </div>
                  )}
                </Label>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="targetSize">Target Size</Label>
                      <span className="text-sm text-slate-500">
                        {customSettings.targetSize}%
                      </span>
                    </div>
                    <Slider
                      id="targetSize"
                      min={10}
                      max={100}
                      step={5}
                      value={[customSettings.targetSize]}
                      onValueChange={(value) =>
                        handleCustomSettingChange("targetSize", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="targetSpeed">Target Speed</Label>
                      <span className="text-sm text-slate-500">
                        {customSettings.targetSpeed}%
                      </span>
                    </div>
                    <Slider
                      id="targetSpeed"
                      min={10}
                      max={100}
                      step={5}
                      value={[customSettings.targetSpeed]}
                      onValueChange={(value) =>
                        handleCustomSettingChange("targetSpeed", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="targetCount">Number of Targets</Label>
                      <span className="text-sm text-slate-500">
                        {customSettings.targetCount}
                      </span>
                    </div>
                    <Slider
                      id="targetCount"
                      min={1}
                      max={30}
                      step={1}
                      value={[customSettings.targetCount]}
                      onValueChange={(value) =>
                        handleCustomSettingChange("targetCount", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="duration">
                        Session Duration (seconds)
                      </Label>
                      <span className="text-sm text-slate-500">
                        {customSettings.duration}s
                      </span>
                    </div>
                    <Slider
                      id="duration"
                      min={10}
                      max={300}
                      step={10}
                      value={[customSettings.duration]}
                      onValueChange={(value) =>
                        handleCustomSettingChange("duration", value[0])
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartTraining}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Zap size={16} />
            Start Training
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DifficultySelector;
