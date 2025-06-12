import { getStylesConfig } from './config';

/**
 * Generate Tailwind theme configuration from styles-config.json
 * 从样式配置文件生成Tailwind主题配置
 */
export async function generateTailwindTheme() {
  const config = await getStylesConfig();
  
  // Convert styles-config.json to Tailwind theme format
  const theme: {
    colors: Record<string, Record<string, string>>;
    fontFamily: Record<string, string[]>;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    boxShadow: Record<string, string>;
    animation: Record<string, string>;
    keyframes: Record<string, Record<string, Record<string, string>>>;
  } = {
    colors: {},
    fontFamily: config.fonts,
    spacing: config.spacing,
    borderRadius: config.borderRadius,
    boxShadow: config.shadows,
    animation: {},
    keyframes: {}
  };

  // Process colors
  for (const [colorName, shades] of Object.entries(config.colors)) {
    if (typeof shades === 'object' && shades !== null) {
      theme.colors[colorName] = shades;
    }
  }

  // Process animations and keyframes
  for (const [animName, keyframeData] of Object.entries(config.animations)) {
    if (typeof keyframeData === 'object' && keyframeData !== null) {
      theme.keyframes[animName] = keyframeData as Record<string, Record<string, string>>;
      theme.animation[animName] = `${animName} 0.5s ease-in-out`;
    }
  }

  return theme;
}

/**
 * Generate CSS custom properties from styles config
 * 从样式配置生成CSS自定义属性
 */
export async function generateCSSVariables() {
  const config = await getStylesConfig();
  let cssVars = '';

  // Generate color variables
  for (const [colorCategory, shades] of Object.entries(config.colors)) {
    if (typeof shades === 'object' && shades !== null) {
      for (const [shade, value] of Object.entries(shades)) {
        cssVars += `  --color-${colorCategory}-${shade}: ${value};\n`;
      }
    }
  }

  // Generate spacing variables
  for (const [key, value] of Object.entries(config.spacing)) {
    cssVars += `  --spacing-${key}: ${value};\n`;
  }

  // Generate border radius variables
  for (const [key, value] of Object.entries(config.borderRadius)) {
    cssVars += `  --radius-${key}: ${value};\n`;
  }

  // Generate shadow variables
  for (const [key, value] of Object.entries(config.shadows)) {
    cssVars += `  --shadow-${key}: ${value};\n`;
  }

  return cssVars;
}

/**
 * Apply theme colors to component styles
 * 将主题颜色应用到组件样式
 */
export function getThemeColors() {
  return {
    // Game category colors from styles-config.json
    action: 'rgb(var(--color-game-action))',
    adventure: 'rgb(var(--color-game-adventure))',
    puzzle: 'rgb(var(--color-game-puzzle))',
    strategy: 'rgb(var(--color-game-strategy))',
    racing: 'rgb(var(--color-game-racing))',
    sports: 'rgb(var(--color-game-sports))',
    rpg: 'rgb(var(--color-game-rpg))',
    simulation: 'rgb(var(--color-game-simulation))',
    arcade: 'rgb(var(--color-game-arcade))',
    casual: 'rgb(var(--color-game-casual))',
    
    // Primary theme colors
    primary: {
      50: 'rgb(var(--color-primary-50))',
      100: 'rgb(var(--color-primary-100))',
      200: 'rgb(var(--color-primary-200))',
      300: 'rgb(var(--color-primary-300))',
      400: 'rgb(var(--color-primary-400))',
      500: 'rgb(var(--color-primary-500))',
      600: 'rgb(var(--color-primary-600))',
      700: 'rgb(var(--color-primary-700))',
      800: 'rgb(var(--color-primary-800))',
      900: 'rgb(var(--color-primary-900))',
      950: 'rgb(var(--color-primary-950))',
    },
    
    secondary: {
      50: 'rgb(var(--color-secondary-50))',
      100: 'rgb(var(--color-secondary-100))',
      200: 'rgb(var(--color-secondary-200))',
      300: 'rgb(var(--color-secondary-300))',
      400: 'rgb(var(--color-secondary-400))',
      500: 'rgb(var(--color-secondary-500))',
      600: 'rgb(var(--color-secondary-600))',
      700: 'rgb(var(--color-secondary-700))',
      800: 'rgb(var(--color-secondary-800))',
      900: 'rgb(var(--color-secondary-900))',
      950: 'rgb(var(--color-secondary-950))',
    }
  };
} 