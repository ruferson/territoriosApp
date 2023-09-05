import { onAuthStateChanged } from 'firebase/auth';
import React, { useState } from 'react';
import { ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, SegmentedButtons, Text } from 'react-native-paper';
import InicioSesion from '../components/InicioSesion';
import Registro from '../components/Registro';
import Territorios from '../components/Territorios';
import { auth } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const Home = () => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [pestaña, setPestaña] = useState('signIn');
	const [signedIn, setSignedIn] = useState(false);
	const [loading, setLoading] = useState(true);


	onAuthStateChanged(auth, (currentUser) => {
		if (auth !== null) {
			if (setSignedIn) {
				setSignedIn(!!currentUser);
			}
		}
		setLoading(false);
	});

	return (
		<>
			{
				loading
					? (
						<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
							<View style={globalStyles.contenido}>
								<Text style={globalStyles.subtitulo}>
									Probando a iniciar sesión...
								</Text>
								<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
							</View>
						</View >
					)
					: signedIn
						? <Territorios />
						: (
							<ScrollView style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
								<View style={[globalStyles.contenido, { marginTop: 100 }]}>
									<SegmentedButtons
										value={pestaña}
										multiSelect={false}
										onValueChange={setPestaña}
										buttons={[
											{
												value: 'signIn',
												label: 'Iniciar Sesión',
											},
											{
												value: 'signUp',
												label: 'Registrarse',
											},
										]}
									/>
									{pestaña === 'signIn' ? <InicioSesion /> : <Registro />}
									<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
								</View>
							</ScrollView >
						)
			}
		</>
	)
}

export default Home;