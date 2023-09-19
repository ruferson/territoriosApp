import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { LogBox, useColorScheme } from 'react-native';
import AñadirTerritorio from './Views/AñadirTerritorio';
import Inicio from './Views/Inicio';
import TerritorioDetalle from './Views/TerritorioDetalle';
import { darkTheme, lightTheme } from './styles/theme';
import { Text } from 'react-native-paper';
import globalCSS from './styles/global';
import EditarTerritorio from './Views/EditarTerritorio';
import { appVersion } from './constants/appVersion';

LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
]);

const Stack = createNativeStackNavigator();

const App = () => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Inicio"
					component={Inicio}
					options={{
						animation: 'fade',
						animationDuration: 3000,
						title: 'Inicio',
						headerStyle: {
							backgroundColor: theme.colors.primary,
						},
						headerTintColor: theme.colors.onSecondary,
						headerTitleStyle: {
							fontWeight: 'bold',
						},
						headerTitleAlign: 'center',
						headerRight: () => <Text style={[globalCSS.version, { color: theme.colors.onSecondary }]}>{appVersion}</Text>
					}}
				/>
				<Stack.Screen
					name="AñadirTerritorio"
					component={AñadirTerritorio}
					options={{
						animation: 'fade',
						animationDuration: 3000,
						title: 'Añadir Territorio',
						headerStyle: {
							backgroundColor: theme.colors.primary,
						},
						headerTintColor: theme.colors.onSecondary,
						headerTitleStyle: {
							fontWeight: 'bold',
						},
						headerTitleAlign: 'center',
						headerRight: () => <Text style={[globalCSS.version, { color: theme.colors.onSecondary }]}>{appVersion}</Text>
					}}
				/>
				<Stack.Screen
					name="TerritorioDetalle"
					component={TerritorioDetalle}
					options={{
						animation: 'fade',
						animationDuration: 3000,
						title: 'Detalles del Territorio',
						headerStyle: {
							backgroundColor: theme.colors.primary,
						},
						headerTintColor: theme.colors.onSecondary,
						headerTitleStyle: {
							fontWeight: 'bold',
						},
						headerTitleAlign: 'center',
						headerRight: () => <Text style={[globalCSS.version, { color: theme.colors.onSecondary }]}>{appVersion}</Text>
					}}
				/>
				<Stack.Screen
					name="EditarTerritorio"
					component={EditarTerritorio}
					options={{
						animation: 'fade',
						animationDuration: 3000,
						title: 'Editando Territorio',
						headerStyle: {
							backgroundColor: theme.colors.primary,
						},
						headerTintColor: theme.colors.onSecondary,
						headerTitleStyle: {
							fontWeight: 'bold',
						},
						headerTitleAlign: 'center',
						headerRight: () => <Text style={[globalCSS.version, { color: theme.colors.onSecondary }]}>{appVersion}</Text>
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
