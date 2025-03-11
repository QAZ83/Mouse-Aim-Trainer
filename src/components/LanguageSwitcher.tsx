import React from "react";
import { Button } from "./ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getCurrentLanguage, languages, setLanguage } from "@/lib/i18n";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const [currentLang, setCurrentLang] = React.useState(getCurrentLanguage());

  // Update state when language changes
  React.useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      setCurrentLang(e.detail.language);
    };

    window.addEventListener(
      "languagechange",
      handleLanguageChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        "languagechange",
        handleLanguageChange as EventListener,
      );
    };
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as "en" | "ar");
    // Save to localStorage
    localStorage.setItem("language", lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          aria-label="Change language"
        >
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, langData]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={currentLang === code ? "bg-accent" : ""}
          >
            {langData.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
