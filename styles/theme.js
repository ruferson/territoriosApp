import {
	MD3LightTheme as DefaultTheme,
} from 'react-native-paper';

export const lightTheme = {
	...DefaultTheme,
	myOwnProperty: true,
	...DefaultTheme.colors,
	colors: {
		strongPrimary: "#5b8067", // Color principal fuerte
		primary: "#69AFA4",  // Verde azulado suave
		onPrimary: "#000000", // Texto en color principal

		primaryContainer: "#9ACBC6",  // Contenedor del color principal
		onPrimaryContainer: "#000000", // Texto en contenedor del color principal

		secondary: "#53707C",  // Color secundario
		onSecondary: "#FFFFFF", // Texto en color secundario

		secondaryContainer: "#A0C1BD",  // Contenedor del color secundario
		onSecondaryContainer: "#18212a", // Texto en contenedor del color secundario

		tertiary: "#678F7D",  // Color terciario
		onTertiary: "#FFFFFF", // Texto en color terciario

		tertiaryContainer: "#9AC4BD",  // Contenedor del color terciario
		onTertiaryContainer: "#293210", // Texto en contenedor del color terciario

		error: "#BA1A1A",  // Color de error
		onError: "#FFFFFF", // Texto en color de error

		errorContainer: "#FFDAD6",  // Contenedor del color de error
		onErrorContainer: "#410002", // Texto en contenedor del color de error

		background: "#E3EBE6",  // Fondo principal
		onBackground: "#1D1B1E", // Texto en fondo principal

		surface: "#E3EBE6",  // Superficie
		onSurface: "#1b1d1b", // Texto en superficie

		surfaceVariant: "#9AC4BD",  // Variante de superficie
		onSurfaceVariant: "#464e46", // Texto en variante de superficie

		outline: "#678F7D",  // Esquema
		outlineVariant: "#B5C8C3", // Variante de esquema

		shadow: "#000000", // Sombra

		scrim: "#000000", // Velado

		inverseSurface: "#2F322F",  // Superficie inversa
		inverseOnSurface: "#F0F5EF", // Texto en superficie inversa

		inversePrimary: "#678F7D",  // Color principal invertido

		elevation: {
			level0: "transparent",
			level1: "#F3FBF4",
			level2: "#F0F9F0",
			level3: "#E9F7E9",
			level4: "#E6F5E5",
			level5: "#E8F4E6"
		},

		surfaceDisabled: "#1B1D1B",  // Superficie deshabilitada
		onSurfaceDisabled: "#1B1D1B", // Texto en superficie deshabilitada

		backdrop: "#3C323E",  // Fondo de primer plano

		strongExpired: "#8d9064", // Color de expiración fuerte
		expired: "#b5b67c",  // Color de expiración
		onExpired: "#000000", // Texto en color de expiración
		expiredContainer: "#e6e8c9",  // Contenedor del color de expiración
		onExpiredContainer: "#000000", // Texto en contenedor del color de expiración

		strongAvailable: "#5b8067", // Color disponible fuerte
		available: "#7CB58F", // Color disponible
		onAvailable: "#000000", // Texto en color disponible
		availableContainer: "#c5e7d7", // Contenedor del color disponible
		onAvailableContainer: "#000000", // Texto en contenedor del color disponible
    linkText: "#996600", // Color de texto de enlaces en el tema de light
		pureBackground: "#FFFFFF",
	}
};

export const darkTheme = {
	...DefaultTheme,
	myOwnProperty: true,
	...DefaultTheme.colors,
	colors: {
		strongPrimary: "#79B985", // Color principal fuerte
		primary: "#5C8A76",  // Verde azulado suave
		onPrimary: "#FFFFFF", // Texto en color principal

		primaryContainer: "#375A47", // Contenedor del color principal
		onPrimaryContainer: "#FFFFFF", // Texto en contenedor del color principal

		secondary: "#486A54",  // Color secundario
		onSecondary: "#FFFFFF", // Texto en color secundario

		secondaryContainer: "#2A3E31",  // Contenedor del color secundario
		onSecondaryContainer: "#FFFFFF", // Texto en contenedor del color secundario

		tertiary: "#51716C",  // Color terciario
		onTertiary: "#FFFFFF", // Texto en color terciario

		tertiaryContainer: "#395E56",  // Contenedor del color terciario
		onTertiaryContainer: "#FFFFFF", // Texto en contenedor del color terciario

		error: "#BA1A1A",  // Color de error
		onError: "#FFFFFF", // Texto en color de error

		errorContainer: "#41110B",  // Contenedor del color de error
		onErrorContainer: "#FFFFFF", // Texto en contenedor del color de error

		background: "#1D1B1E",  // Fondo principal
		onBackground: "#E3EBE6", // Texto en fondo principal

		surface: "#1D1B1E",  // Superficie
		onSurface: "#E3EBE6", // Texto en superficie

		surfaceVariant: "#324134",  // Variante de superficie
		onSurfaceVariant: "#E3EBE6", // Texto en variante de superficie

		outline: "#51716C",  // Esquema
		outlineVariant: "#8AA394", // Variante de esquema

		shadow: "#000000", // Sombra

		scrim: "#000000", // Velado

		inverseSurface: "#2F322F",  // Superficie inversa
		inverseOnSurface: "#F0F5EF", // Texto en superficie inversa

		inversePrimary: "#51716C",  // Color principal invertido

		elevation: {
			level0: "transparent",
			level1: "#1A1A1A",
			level2: "#1E1E1E",
			level3: "#222222",
			level4: "#252525",
			level5: "#272727"
		},

		surfaceDisabled: "#323232",  // Superficie deshabilitada
		onSurfaceDisabled: "#1B1B1B", // Texto en superficie deshabilitada

		backdrop: "#3C323E",  // Fondo de primer plano

		strongExpired: "#9ea172", // Color de expiración fuerte
		expired: "#3b3c2a",  // Color de expiración
		onExpired: "#FFFFFF", // Texto en color de expiración
		expiredContainer: "#3b3c2a",  // Contenedor del color de expiración
		onExpiredContainer: "#FFFFFF", // Texto en contenedor del color de expiración

		strongAvailable: "#79b985", // Color disponible fuerte
		available: "#527D5A", // Color disponible
		onAvailable: "#FFFFFF", // Texto en color disponible
		availableContainer: "#2E5042", // Contenedor del color disponible
		onAvailableContainer: "#FFFFFF", // Texto en contenedor del color disponible
    linkText: "#a59573", // Color de texto de enlaces en el tema de dark,
		pureBackground: "#000000",
	}
};
