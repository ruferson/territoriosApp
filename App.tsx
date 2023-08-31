import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { LogBox, useColorScheme } from 'react-native';
import AddTerritorio from './Views/AddTerritorio';
import Home from './Views/Home';
import TerritorioDetalle from './Views/TerritorioDetalle';
import { darkTheme, lightTheme } from './styles/theme';
import { Text } from 'react-native-paper';
import globalStyles from './styles/global';
import EditTerritorio from './Views/EditTerritorio';
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
					name="Home"
					component={Home}
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
						headerRight: () => <Text style={[globalStyles.version, { color: theme.colors.onSecondary }]}>{appVersion}</Text>
					}}
				/>
				<Stack.Screen
					name="AddTerritorio"
					component={AddTerritorio}
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
						headerRight: () => <Text style={[globalStyles.version, { color: theme.colors.onSecondary }]}>{appVersion}</Text>
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
						headerRight: () => <Text style={[globalStyles.version, { color: theme.colors.onSecondary }]}>{appVersion}</Text>
					}}
				/>
				<Stack.Screen
					name="EditTerritorio"
					component={EditTerritorio}
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
						headerRight: () => <Text style={[globalStyles.version, { color: theme.colors.onSecondary }]}>{appVersion}</Text>
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
