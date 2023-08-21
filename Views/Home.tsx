import { onAuthStateChanged } from 'firebase/auth';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import SignIn from '../components/SignIn';
import Territorios from '../components/Territorios';
import { auth } from '../firebase/firebaseConfig';
import colors from '../styles/colors';
import globalStyles from '../styles/global';

const Home = () => {
	const theme = useTheme();
	const [signedIn, setSignedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	onAuthStateChanged(auth, (currentUser) => {
		if (auth !== null) {
			setSignedIn(!!currentUser);
		}
		setLoading(false);
	});

	return <>
		{
			loading
				? (
					<View style={globalStyles.contenedor}>
						<View style={globalStyles.contenido}>
							<Text style={globalStyles.subtitulo}>
								Probando a iniciar sesión...
							</Text>
							<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={colors.light.primary} />
						</View>
					</View >
				)
				: signedIn
					? (
						<>
							<Territorios>Hola</Territorios>
						</>
					)
					: (
						<SignIn />
					)
		}
	</>
}

export default Home;