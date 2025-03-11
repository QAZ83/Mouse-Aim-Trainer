import React from "react";
import { t } from "@/lib/i18n";

interface TranslatedTextProps {
  id: string;
  placeholders?: Record<string, string>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const TranslatedText: React.FC<TranslatedTextProps> = ({
  id,
  placeholders = {},
  className,
  as: Component = "span",
}) => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    // Force re-render when language changes
    const handleLanguageChange = () => {
      forceUpdate();
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange);
    };
  }, []);

  return <Component className={className}>{t(id, placeholders)}</Component>;
};

export default TranslatedText;
