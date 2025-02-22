import { Text as DefaultText, View as DefaultView, useColorScheme } from 'react-native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

const Colors = {
  light: {
    text: '#2D1810',
    background: '#FFF8DC',
    tint: '#8B4513',
    tabIconDefault: '#ccc',
    tabIconSelected: '#8B4513',
  },
  dark: {
    text: '#F5F5DC',
    background: '#2D1810',
    tint: '#DEB887',
    tabIconDefault: '#ccc',
    tabIconSelected: '#DEB887',
  },
};