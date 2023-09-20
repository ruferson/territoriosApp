import React from 'react';
import { Alert, View, useColorScheme } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { auth } from '../firebase/firebaseConfig';
import globalCSS from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const Verificar = () => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

	return (
		<View style={[globalCSS.contenedor, { backgroundColor: theme.colors.background }]}>
			<View style={[globalCSS.contenido, {marginTop: 180}]}>
				<Text style={globalCSS.subtitulo}>¡Bienvenido!</Text>
				<Text style={globalCSS.subSubtitulo}>Le hemos enviado un correo a su dirección de E-mail.</Text>
				<Text style={globalCSS.subSubtitulo}>Verifique su correo electrónico, inicie sesión de nuevo, y podrá acceder a la aplicación.</Text>
			</View>
			<FAB
				icon="account-off"
				theme={{
					roundness: 10,
					colors: {
						primaryContainer: theme.colors.errorContainer
					}
				}}
				style={globalCSS.fabLeft}
				label="Cerrar sesión"
				size="small"
				onPress={() => {
					Alert.alert(
						`Vas a cerrar sesión`,
						'¿Estás seguro de que quieres cerrar sesión?',
						[
							{ text: "No", style: 'cancel' },
							{
								text: 'Sí, cerrar sesión',
								style: 'destructive',
								onPress: async () => {
									await auth.signOut();
								},
							},
						]
					);
				}}
			/>
		</View >
	);
}

export default Verificar;