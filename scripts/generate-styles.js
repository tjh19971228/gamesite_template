const fs = require('fs');
const path = require('path');

/**
 * Generate dynamic Tailwind CSS from styles-config.json
 * 从样式配置文件生成动态Tailwind CSS
 */
async function generateDynamicStyles() {
  console.log('正在从 styles-config.json 生成样式...');

  // Read styles config
  const stylesConfigPath = path.join(process.cwd(), 'styles-config.json');
  const stylesConfig = JSON.parse(fs.readFileSync(stylesConfigPath, 'utf8'));

  // Generate CSS variables
  let cssVars = ':root {\n';
  
  // Color variables
  for (const [colorCategory, shades] of Object.entries(stylesConfig.colors)) {
    if (typeof shades === 'object' && shades !== null && colorCategory !== 'game') {
      // 处理颜色对象（如primary, secondary等）
      for (const [shade, value] of Object.entries(shades)) {
        // Convert hex to RGB for CSS variables
        const rgb = hexToRgb(value);
        if (rgb) {
          // Store RGB values for primary colors
          cssVars += `  --color-${colorCategory}-${shade}: ${rgb.r} ${rgb.g} ${rgb.b};\n`;
          cssVars += `  --color-${colorCategory}-${shade}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
        }
      }
    }
  }

  // 单独处理游戏分类颜色，确保它们有原始十六进制和RGB格式
  for (const [category, value] of Object.entries(stylesConfig.colors.game)) {
    const rgb = hexToRgb(value);
    if (rgb) {
      // 保存原始十六进制颜色
      cssVars += `  --color-game-${category}: ${value};\n`;
      // 添加RGB格式作为单独的变量，用于透明度调整
      cssVars += `  --color-game-${category}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
    }
  }

  // Spacing variables
  for (const [key, value] of Object.entries(stylesConfig.spacing)) {
    cssVars += `  --spacing-${key}: ${value};\n`;
  }

  // Border radius variables
  for (const [key, value] of Object.entries(stylesConfig.borderRadius)) {
    cssVars += `  --radius-${key}: ${value};\n`;
  }

  // Shadow variables
  for (const [key, value] of Object.entries(stylesConfig.shadows)) {
    cssVars += `  --shadow-${key}: ${value};\n`;
  }

  cssVars += '}\n\n';

  // Generate keyframes from animations
  let keyframeCSS = '';
  for (const [animName, keyframeData] of Object.entries(stylesConfig.animations)) {
    if (typeof keyframeData === 'object') {
      keyframeCSS += `@keyframes ${animName} {\n`;
      for (const [percentage, styles] of Object.entries(keyframeData)) {
        keyframeCSS += `  ${percentage} {\n`;
        for (const [property, value] of Object.entries(styles)) {
          const cssProperty = camelToDash(property);
          keyframeCSS += `    ${cssProperty}: ${value};\n`;
        }
        keyframeCSS += '  }\n';
      }
      keyframeCSS += '}\n\n';
    }
  }

  // Generate utility classes for game categories
  let utilityClasses = '';
  utilityClasses += '/* Game Category Colors */\n';
  for (const [category, color] of Object.entries(stylesConfig.colors.game)) {
    const rgb = hexToRgb(color);
    if (rgb) {
      utilityClasses += `.text-game-${category} { color: ${color}; }\n`;
      utilityClasses += `.bg-game-${category} { background-color: ${color}; }\n`;
      utilityClasses += `.border-game-${category} { border-color: ${color}; }\n`;
      
      // 添加带透明度的背景色工具类
      utilityClasses += `.bg-game-${category}-10 { background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1); }\n`;
      utilityClasses += `.bg-game-${category}-20 { background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2); }\n`;
      utilityClasses += `.bg-game-${category}-50 { background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5); }\n`;
    }
  }
  utilityClasses += '\n';

  // Read existing globals.css to preserve original content
  const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
  let existingCSS = '';
  
  if (fs.existsSync(globalsPath)) {
    existingCSS = fs.readFileSync(globalsPath, 'utf8');
    
    // Remove old dynamic styles section if it exists
    const startMarker = '/* === DYNAMIC STYLES START === */';
    const endMarker = '/* === DYNAMIC STYLES END === */';
    const startIndex = existingCSS.indexOf(startMarker);
    
    if (startIndex !== -1) {
      const endIndex = existingCSS.indexOf(endMarker);
      if (endIndex !== -1) {
        existingCSS = existingCSS.slice(0, startIndex) + existingCSS.slice(endIndex + endMarker.length);
      }
    }
  }

  // Combine all CSS
  const finalCSS = existingCSS + 
    '\n/* === DYNAMIC STYLES START === */\n' +
    '/* Generated from styles-config.json */\n\n' +
    cssVars + keyframeCSS + utilityClasses +
    '/* === DYNAMIC STYLES END === */\n';

  // Write the updated CSS file
  fs.writeFileSync(globalsPath, finalCSS);
  
  console.log('✅ 样式生成完成！已更新 src/app/globals.css');
  console.log(`   - 添加了 ${Object.keys(stylesConfig.colors).length} 个颜色主题`);
  console.log(`   - 添加了 ${Object.keys(stylesConfig.animations).length} 个动画`);
  console.log(`   - 添加了 ${Object.keys(stylesConfig.colors.game).length} 个游戏分类样式`);
}

/**
 * Convert hex color to RGB
 * 将十六进制颜色转换为RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert camelCase to dash-case
 * 将驼峰命名转换为短横线命名
 */
function camelToDash(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// Run the script
if (require.main === module) {
  generateDynamicStyles().catch(console.error);
}

module.exports = { generateDynamicStyles }; 