import React, { useState, useEffect } from "react";
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
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  MousePointer,
  Settings,
  Save,
  RotateCcw,
  Info,
  RefreshCw,
  LightbulbIcon,
} from "lucide-react";
import {
  detectMouseDevice,
  estimateMouseDPI,
  getKnownMouseModels,
  getKnownMouseInfo,
  MouseDevice,
} from "@/lib/deviceDetection";
import RecommendationsPanel from "./RecommendationsPanel";
import { generateSettingsRecommendations } from "@/lib/recommendations";

export interface MouseSettingsConfig {
  sensitivity: number;
  dpi: number;
  pollingRate: number;
  acceleration: boolean;
  smoothing: number;
  profile: string;
}

interface MouseSettingsProps {
  open?: boolean;
  onClose?: () => void;
  onSaveSettings?: (settings: MouseSettingsConfig) => void;
  initialSettings?: Partial<MouseSettingsConfig>;
}

const MouseSettings = ({
  open = false,
  onClose = () => {},
  onSaveSettings = () => {},
  initialSettings = {},
}: MouseSettingsProps) => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [detectedDevice, setDetectedDevice] = useState<MouseDevice | null>(
    null,
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [knownModels, setKnownModels] = useState<string[]>([]);

  const [settings, setSettings] = useState<MouseSettingsConfig>({
    sensitivity: initialSettings.sensitivity ?? 50,
    dpi: initialSettings.dpi ?? 800,
    pollingRate: initialSettings.pollingRate ?? 1000,
    acceleration: initialSettings.acceleration ?? false,
    smoothing: initialSettings.smoothing ?? 0,
    profile: initialSettings.profile ?? "default",
  });

  const [recommendations, setRecommendations] = useState(
    generateSettingsRecommendations(
      settings.dpi,
      settings.sensitivity,
      settings.acceleration,
      settings.pollingRate,
    ),
  );

  useEffect(() => {
    // Load known mouse models
    setKnownModels(getKnownMouseModels());

    // Attempt to detect mouse device when component mounts
    const detectDevice = async () => {
      try {
        setIsDetecting(true);
        const device = await detectMouseDevice();
        setDetectedDevice(device);
        setIsDetecting(false);
      } catch (error) {
        console.error("Failed to detect mouse device:", error);
        setIsDetecting(false);
      }
    };

    detectDevice();
  }, []);

  const handleSettingChange = <K extends keyof MouseSettingsConfig>(
    setting: K,
    value: MouseSettingsConfig[K],
  ) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        [setting]: value,
      };

      // Update recommendations when settings change
      setRecommendations(
        generateSettingsRecommendations(
          newSettings.dpi,
          newSettings.sensitivity,
          newSettings.acceleration,
          newSettings.pollingRate,
        ),
      );

      return newSettings;
    });
  };

  const handleSaveSettings = () => {
    onSaveSettings(settings);
    onClose();
  };

  const handleResetToDefaults = () => {
    setSettings({
      sensitivity: 50,
      dpi: 800,
      pollingRate: 1000,
      acceleration: false,
      smoothing: 0,
      profile: "default",
    });
  };

  const handleDetectDPI = async () => {
    try {
      setIsDetecting(true);
      const estimatedDPI = await estimateMouseDPI();
      setSettings((prev) => ({
        ...prev,
        dpi: estimatedDPI,
      }));
      setIsDetecting(false);
    } catch (error) {
      console.error("Failed to estimate DPI:", error);
      setIsDetecting(false);
    }
  };

  const handleSelectMouseModel = (modelName: string) => {
    const modelInfo = getKnownMouseInfo(modelName);
    if (modelInfo) {
      setSettings((prev) => ({
        ...prev,
        dpi: modelInfo.dpi || prev.dpi,
        pollingRate: modelInfo.pollingRate || prev.pollingRate,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <MousePointer className="h-5 w-5" />
            ProMouseTuner Settings
          </DialogTitle>
          <DialogDescription className="text-center">
            Configure your mouse settings for optimal precision and performance.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full mb-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings size={16} /> General
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <MousePointer size={16} /> Advanced
            </TabsTrigger>
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <Save size={16} /> Profiles
            </TabsTrigger>
            <TabsTrigger value="device" className="flex items-center gap-2">
              <Info size={16} /> Device
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="flex items-center gap-2"
            >
              <LightbulbIcon size={16} /> Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="sensitivity">Mouse Sensitivity</Label>
                      <span className="text-sm text-slate-500">
                        {settings.sensitivity}%
                      </span>
                    </div>
                    <Slider
                      id="sensitivity"
                      min={1}
                      max={100}
                      step={1}
                      value={[settings.sensitivity]}
                      onValueChange={(value) =>
                        handleSettingChange("sensitivity", value[0])
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Adjust how responsive your mouse cursor is to physical
                      movement.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="dpi">DPI (Dots Per Inch)</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDetectDPI}
                        disabled={isDetecting}
                        className="h-8 text-xs"
                      >
                        {isDetecting ? (
                          <>
                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                            Detecting...
                          </>
                        ) : (
                          <>Detect DPI</>
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="dpi"
                        min={400}
                        max={16000}
                        step={100}
                        className="flex-1"
                        value={[settings.dpi]}
                        onValueChange={(value) =>
                          handleSettingChange("dpi", value[0])
                        }
                      />
                      <Input
                        type="number"
                        className="w-20"
                        value={settings.dpi}
                        onChange={(e) =>
                          handleSettingChange(
                            "dpi",
                            parseInt(e.target.value) || 800,
                          )
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher DPI means faster cursor movement for the same
                      physical distance.
                    </p>
                  </div>

                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <Label htmlFor="acceleration">Mouse Acceleration</Label>
                    <Switch
                      id="acceleration"
                      checked={settings.acceleration}
                      onCheckedChange={(checked) =>
                        handleSettingChange("acceleration", checked)
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    When enabled, faster physical movements result in
                    proportionally greater cursor distance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pollingRate">Polling Rate (Hz)</Label>
                    <Select
                      value={settings.pollingRate.toString()}
                      onValueChange={(value) =>
                        handleSettingChange("pollingRate", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select polling rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="125">125 Hz</SelectItem>
                        <SelectItem value="500">500 Hz</SelectItem>
                        <SelectItem value="1000">1000 Hz</SelectItem>
                        <SelectItem value="2000">2000 Hz</SelectItem>
                        <SelectItem value="4000">4000 Hz</SelectItem>
                        <SelectItem value="8000">8000 Hz</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      How frequently your mouse reports its position to your
                      computer.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="smoothing">Pointer Smoothing</Label>
                      <span className="text-sm text-slate-500">
                        {settings.smoothing}%
                      </span>
                    </div>
                    <Slider
                      id="smoothing"
                      min={0}
                      max={100}
                      step={5}
                      value={[settings.smoothing]}
                      onValueChange={(value) =>
                        handleSettingChange("smoothing", value[0])
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher values make cursor movement smoother but may
                      introduce latency.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile">Current Profile</Label>
                    <Select
                      value={settings.profile}
                      onValueChange={(value) =>
                        handleSettingChange("profile", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select profile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="precision">Precision</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Current Settings as New Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Import Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="device" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {detectedDevice ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Detected Mouse</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            setIsDetecting(true);
                            const device = await detectMouseDevice();
                            setDetectedDevice(device);
                            setIsDetecting(false);
                          }}
                          disabled={isDetecting}
                          className="h-8"
                        >
                          {isDetecting ? (
                            <>
                              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                              Detecting...
                            </>
                          ) : (
                            <>Refresh</>
                          )}
                        </Button>
                      </div>

                      <div className="bg-slate-100 p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-medium">Name:</div>
                          <div>{detectedDevice.name}</div>

                          <div className="font-medium">Manufacturer:</div>
                          <div>{detectedDevice.manufacturer || "Unknown"}</div>

                          <div className="font-medium">DPI:</div>
                          <div>{detectedDevice.dpi || "Unknown"}</div>

                          <div className="font-medium">Polling Rate:</div>
                          <div>
                            {detectedDevice.pollingRate
                              ? `${detectedDevice.pollingRate} Hz`
                              : "Unknown"}
                          </div>

                          <div className="font-medium">Buttons:</div>
                          <div>{detectedDevice.buttons || "Unknown"}</div>

                          <div className="font-medium">Connection:</div>
                          <div>
                            {detectedDevice.wireless ? "Wireless" : "Wired"}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Note: Some information may be estimated as browsers have
                        limited access to hardware details.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      {isDetecting ? (
                        <div className="flex flex-col items-center">
                          <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                          <p>Detecting your mouse device...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="mb-4">No mouse device detected</p>
                          <Button
                            onClick={async () => {
                              setIsDetecting(true);
                              const device = await detectMouseDevice();
                              setDetectedDevice(device);
                              setIsDetecting(false);
                            }}
                          >
                            Detect Now
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">
                      Select Known Mouse Model
                    </h3>
                    <Select onValueChange={handleSelectMouseModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a mouse model" />
                      </SelectTrigger>
                      <SelectContent>
                        {knownModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Selecting a model will automatically set DPI and polling
                      rate to manufacturer defaults.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <RecommendationsPanel recommendations={recommendations} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleResetToDefaults}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700"
            >
              Save Settings
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MouseSettings;
