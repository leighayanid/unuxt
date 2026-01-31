export function useTheme() {
  const colorMode = useColorMode();
  const appConfig = useAppConfig();

  const isDark = computed(() => colorMode.value === "dark");
  const currentMode = computed(() => colorMode.value);

  function toggleColorMode() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  }

  function setColorMode(mode: "light" | "dark" | "system") {
    colorMode.preference = mode;
  }

  const primaryColor = computed(() => appConfig.ui?.colors?.primary || "blue");

  function setPrimaryColor(color: string) {
    if (appConfig.ui?.colors) {
      appConfig.ui.colors.primary = color;
    }
  }

  return {
    isDark,
    currentMode,
    toggleColorMode,
    setColorMode,
    primaryColor,
    setPrimaryColor,
  };
}
