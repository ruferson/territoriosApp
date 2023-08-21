import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { auth } from '../firebase/firebaseConfig';
import colors from '../styles/colors';
import globalStyles from '../styles/global';

const SignIn = () => {
	const theme = useTheme();
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
		<View style={globalStyles.contenedor}>
			<View style={globalStyles.contenido}>
				<Text style={globalStyles.subtitulo}>Bienvenido,</Text>
				<TextInput
					label="E-Mail"
					textColor={colors.light.textLow}
					value={email}
					style={globalStyles.input}
					mode='outlined'
					outlineColor={colors.light.secondary}
					activeOutlineColor={colors.light.primary}
					onChangeText={text => setEmail(text)}
				/>
				<TextInput
					label="Contraseña"
					textColor={colors.light.textLow}
					value={passwd}
					style={globalStyles.input}
					mode='outlined'
					outlineColor={colors.light.secondary}
					activeOutlineColor={colors.light.primary}
					secureTextEntry
					onChangeText={text => setPasswd(text)}
				/>
				<Button
					style={globalStyles.boton}
					icon=""
					buttonColor={colors.light.primary}
					mode="contained"
					compact
					onPress={() => onSignInHandler()}
				>
					Iniciar Sesión
				</Button>
				{msg !== '' ? (<Text style={{ color: 'darkred' }}>{msg}</Text>) : <></>}
				<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={colors.light.primary} />
			</View>
		</View>
	);
}

export default SignIn;