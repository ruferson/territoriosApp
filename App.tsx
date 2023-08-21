import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import AddTerritorio from './Views/AddTerritorio';
import Home from './Views/Home';
import TerritorioDetalle from './Views/TerritorioDetalle';
import Colors from './styles/colors';
import { Text } from 'react-native-paper';

const Stack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Home"
					component={Home}
					options={{
						title: 'Inicio',
						headerStyle: {
							backgroundColor: Colors.light.primary,
						},
						headerTintColor: Colors.light.oppositeText,
						headerTitleStyle: {
							fontWeight: 'bold',
						},
						headerTitleAlign: 'center'
					}}
				/>
				<Stack.Screen
					name="AddTerritorio"
					component={AddTerritorio}
					options={{
						title: 'Añadir Territorio',
						headerStyle: {
							backgroundColor: Colors.light.primary,
						},
						headerTintColor: Colors.light.oppositeText,
						headerTitleStyle: {
							fontWeight: 'bold',
						},
						headerTitleAlign: 'center'
					}}
				/>
				<Stack.Screen
					name="TerritorioDetalle"
					component={TerritorioDetalle}
					options={{
						title: 'Detalles del Territorio',
						headerStyle: {
							backgroundColor: Colors.light.primary,
						},
						headerTintColor: Colors.light.oppositeText,
						headerTitleStyle: {
							fontWeight: 'bold',
						},
						headerTitleAlign: 'center'
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
