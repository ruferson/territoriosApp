import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import { auth } from '../firebase/firebaseConfig';
import globalCSS from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const InicioSesion = () => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [email, setEmail] = useState('')
	const [contraseña, setContraseña] = useState('')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')

	const manejarInicioSesion = async () => {
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, email, contraseña);
			setMsg('')
			setLoading(false);
		} catch (error) {
			console.log(error)
			setMsg('¡Hay un error en los datos!')
			setLoading(false);
			auth.signOut();
		}
	};

	return (
		<View style={[globalCSS.contenedor, { backgroundColor: theme.colors.background }]}>
			<View style={globalCSS.contenido}>
				<Text style={globalCSS.subtitulo}>¡Hola!</Text>
				<TextInput
					label="E-Mail"
					value={email}
					style={globalCSS.input}
					mode='outlined'
					onChangeText={text => setEmail(text)}
				/>
				<TextInput
					label="Contraseña"
					value={contraseña}
					style={globalCSS.input}
					mode='outlined'
					secureTextEntry
					onChangeText={text => setContraseña(text)}
				/>
				<Button
					style={globalCSS.boton}
					icon=""
					buttonColor={theme.colors.primary}
					mode="contained"
					compact
					onPress={() => manejarInicioSesion()}
				>
					Iniciar Sesión
				</Button>
				{msg !== '' ? (<Text style={{ color: 'darkred' }}>{msg}</Text>) : <></>}
				<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
			</View>
		</View>
	);
}

export default InicioSesion;