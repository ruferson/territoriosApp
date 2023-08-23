import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { auth } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const SignIn = () => {
  const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [email, setEmail] = useState('')
	const [passwd, setPasswd] = useState('')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')

	const onSignInHandler = async () => {
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, email, passwd);
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
		<View style={[globalStyles.contenedor, {backgroundColor: theme.colors.background}]}>
			<View style={globalStyles.contenido}>
				<Text style={globalStyles.subtitulo}>Bienvenido,</Text>
				<TextInput
					label="E-Mail"
					value={email}
					style={globalStyles.input}
					mode='outlined'
					onChangeText={text => setEmail(text)}
				/>
				<TextInput
					label="Contraseña"
					value={passwd}
					style={globalStyles.input}
					mode='outlined'
					secureTextEntry
					onChangeText={text => setPasswd(text)}
				/>
				<Button
					style={globalStyles.boton}
					icon=""
					buttonColor={theme.colors.primary}
					mode="contained"
					compact
					onPress={() => onSignInHandler()}
				>
					Iniciar Sesión
				</Button>
				{msg !== '' ? (<Text style={{ color: 'darkred' }}>{msg}</Text>) : <></>}
				<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
			</View>
		</View>
	);
}

export default SignIn;