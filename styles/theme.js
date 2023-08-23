import {
	MD3LightTheme as DefaultTheme,
} from 'react-native-paper';

export const lightTheme = {
	...DefaultTheme,
	myOwnProperty: true,
	...DefaultTheme.colors,
	colors: {
		primary: "#7CB58F",  // Verde claro
		onPrimary: "#000000",  // Texto oscuro para contraste en el color principal

		primaryContainer: "#c5e7d7",  // Contenedor del color principal: Verde claro suave
		onPrimaryContainer: "#000000",  // Texto oscuro para contraste en el contenedor del color principal

		secondary: "#5a6c63",  // Color secundario: Verde más oscuro
		onSecondary: "#FFFFFF",  // Texto blanco para contraste en el color secundario

		secondaryContainer: "#c8dad3",  // Contenedor del color secundario: Verde claro suave
		onSecondaryContainer: "#18212a",  // Texto oscuro para contraste en el contenedor del color secundario

		tertiary: "#6E8F7C",  // Color terciario: Verde azulado suave
		onTertiary: "#FFFFFF",  // Texto blanco para contraste en el color terciario

		tertiaryContainer: "#aed5c4",  // Contenedor del color terciario: Verde azulado suave
		onTertiaryContainer: "#293210",  // Texto oscuro para contraste en el contenedor del color terciario

		error: "#BA1A1A",  // Color de error: Rojo oscuro
		onError: "#FFFFFF",  // Texto blanco para contraste en el color de error

		errorContainer: "#FFDAD6",  // Contenedor del color de error: Tonos rojizos suaves
		onErrorContainer: "#410002",  // Texto oscuro para contraste en el contenedor del color de error

		background: "#E3EBE6",  // Fondo principal: Verde claro suave
		onBackground: "#1D1B1E",  // Texto oscuro para contraste en el fondo principal

		surface: "#E3EBE6",  // Superficie: Mismo tono que el fondo principal
		onSurface: "#1b1d1b",  // Texto oscuro para contraste en la superficie

		surfaceVariant: "#aed5bb",  // Variante de superficie: Verde azulado suave
		onSurfaceVariant: "#464e46",  // Texto oscuro para contraste en la variante de superficie

		outline: "#6E8F7C",  // Esquema: Verde azulado suave
		outlineVariant: "#C5CEB8",  // Variante de esquema: Verde claro suave

		shadow: "#000000",  // Sombra: Negro

		scrim: "#000000",  // Velado: Negro

		inverseSurface: "#2F322F",  // Superficie inversa: Verde azulado más oscuro
		inverseOnSurface: "#F0F5EF",  // Texto claro para contraste en la superficie inversa

		inversePrimary: "#6E8F7C",  // Color principal invertido: Verde azulado suave

		elevation: {
			level0: "transparent",  // Elevación 0: Transparente
			level1: "#F3FBF4",  // Elevación 1: Tonos claros
			level2: "#F0F9F0",  // Elevación 2: Tonos claros
			level3: "#E9F7E9",  // Elevación 3: Tonos claros
			level4: "#E6F5E5",  // Elevación 4: Tonos claros
			level5: "#E8F4E6"  // Elevación 5: Tonos claros
		},

		surfaceDisabled: "#1B1D1B",  // Superficie deshabilitada: Tonos oscuros para elementos deshabilitados
		onSurfaceDisabled: "#1B1D1B",  // Texto oscuro para contraste en superficie deshabilitada

		backdrop: "#3C323E"  // Fondo de primer plano: Tonos oscuros
	}
}

export const darkTheme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  ...DefaultTheme.colors,
  // Specify custom property in nested object
  colors: {
    primary: "#527D5A",  // Verde oscuro (versión más oscura del verde claro)
    onPrimary: "#FFFFFF",  // Texto blanco para contraste en el color principal

    primaryContainer: "#2E5042",  // Contenedor del color principal: Verde oscuro suave
    onPrimaryContainer: "#FFFFFF",  // Texto blanco para contraste en el contenedor del color principal

    secondary: "#3E4C3E",  // Color secundario: Verde oscuro más apagado
    onSecondary: "#FFFFFF",  // Texto blanco para contraste en el color secundario

    secondaryContainer: "#253230",  // Contenedor del color secundario: Verde oscuro suave
    onSecondaryContainer: "#FFFFFF",  // Texto blanco para contraste en el contenedor del color secundario

    tertiary: "#4E6F5C",  // Color terciario: Verde azulado oscuro
    onTertiary: "#FFFFFF",  // Texto blanco para contraste en el color terciario

    tertiaryContainer: "#385C48",  // Contenedor del color terciario: Verde azulado oscuro suave
    onTertiaryContainer: "#FFFFFF",  // Texto blanco para contraste en el contenedor del color terciario

    error: "#BA1A1A",  // Color de error: Rojo oscuro
    onError: "#FFFFFF",  // Texto blanco para contraste en el color de error

    errorContainer: "#FFDAD6",  // Contenedor del color de error: Tonos rojizos suaves
    onErrorContainer: "#410002",  // Texto oscuro para contraste en el contenedor del color de error

    background: "#1D1B1E",  // Fondo principal: Tonos oscuros
    onBackground: "#E3EBE6",  // Texto claro para contraste en el fondo principal

    surface: "#1D1B1E",  // Superficie: Mismo tono que el fondo principal
    onSurface: "#E3EBE6",  // Texto claro para contraste en la superficie

    surfaceVariant: "#324134",  // Variante de superficie: Verde oscuro suave
    onSurfaceVariant: "#E3EBE6",  // Texto claro para contraste en la variante de superficie

    outline: "#4E6F5C",  // Esquema: Verde azulado oscuro
    outlineVariant: "#8AA394",  // Variante de esquema: Verde claro suave

    shadow: "#000000",  // Sombra: Negro

    scrim: "#000000",  // Velado: Negro

    inverseSurface: "#2F322F",  // Superficie inversa: Verde azulado más oscuro
    inverseOnSurface: "#F0F5EF",  // Texto claro para contraste en la superficie inversa

    inversePrimary: "#4E6F5C",  // Color principal invertido: Verde azulado oscuro

    elevation: {
      level0: "transparent",  // Elevación 0: Transparente
      level1: "#1A1A1A",  // Elevación 1: Tonos oscuros
      level2: "#1E1E1E",  // Elevación 2: Tonos oscuros
      level3: "#222222",  // Elevación 3: Tonos oscuros
      level4: "#252525",  // Elevación 4: Tonos oscuros
      level5: "#272727"  // Elevación 5: Tonos oscuros
    },

    surfaceDisabled: "#323232",  // Superficie deshabilitada: Tonos oscuros para elementos deshabilitados
    onSurfaceDisabled: "#1B1B1B",  // Texto oscuro para contraste en superficie deshabilitada

    backdrop: "#3C323E"  // Fondo de primer plano: Tonos oscuros
  }
}
