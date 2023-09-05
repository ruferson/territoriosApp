import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import { auth, db } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const Registro = () => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [nombre, setNombre] = useState('')
	const [email, setEmail] = useState('')
	const [contraseña, setContraseña] = useState('')
	const [contraseñaRepetida, setContraseñaRepetida] = useState('')
	const [loading, setLoading] = useState(false);
	const [errorNombre, setErrorNombre] = useState("")
	const [errorEmail, setErrorEmail] = useState("")
	const [errorCont, setErrorCont] = useState("")
	const [msg, setMsg] = useState('')

	const manejarRegistro = async () => {

		if (validarFormulario()) {
			setLoading(true);
			try {
				await createUserWithEmailAndPassword(auth, email, contraseña);
				await setDoc(doc(db, "users", auth.currentUser.uid), { email, nombre });
				await signInWithEmailAndPassword(auth, email, contraseña);
				setMsg('')
				setLoading(false);
			} catch (error) {
				console.log(error)
				setMsg('¡Hay un error en los datos!')
				setLoading(false);
				auth.signOut();
			}
		} else {
			setMsg("Hay errores en el formulario");
		}
	};

	const validarNombre = (nombre: string) => {
		let reNombre = /(-?([A-Z].\s)?([A-Z][a-z]+)\s?)+([A-Z]'([A-Z][a-z]+))?/g;
		if (reNombre.test(nombre)) {
			setErrorNombre("")
			return true;
		} else {
			setErrorNombre("El nombre no es correcto.")
			return false;
		}
	}
	const validarEmail = (email: string) => {
		let reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
		if (reEmail.test(email)) {
			setErrorEmail("")
			return true;
		} else {
			setErrorEmail("El e-mail no es correcto.")
			return false;
		}
	}
	const validarContraseña = (contraseña: string) => {
		let reContraseña = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
		if (reContraseña.test(contraseña) && (contraseña === contraseñaRepetida)) {
			setErrorCont("")
			return true;
		} else {
			setErrorCont("La contraseña necesita al menos: 8 caracteres, 1 letra mayúscula, y 1 letra minúscula.")
			return false;
		}
	}

	const validarFormulario = () => {
		validarNombre(nombre);
		validarEmail(email);
		validarContraseña(contraseña);

		return validarNombre(nombre) && validarEmail(email) && validarContraseña(contraseña);
	}

	return (
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<View style={globalStyles.contenido}>
				<Text style={globalStyles.subtitulo}>¡Bienvenido!</Text>
				{errorNombre !== '' ? (<Text style={{ color: 'darkred' }}>{errorNombre}</Text>) : <></>}
				<TextInput
					label="Nombre"
					value={nombre}
					style={globalStyles.input}
					mode='outlined'
					onChangeText={text => setNombre(text)}
				/>
				{errorEmail !== '' ? (<Text style={{ color: 'darkred' }}>{errorEmail}</Text>) : <></>}
				<TextInput
					label="E-Mail"
					value={email}
					style={globalStyles.input}
					mode='outlined'
					onChangeText={text => setEmail(text)}
				/>
				{errorCont !== '' ? (<Text style={{ color: 'darkred' }}>{errorCont}</Text>) : <></>}
				<TextInput
					label="Contraseña"
					value={contraseña}
					style={globalStyles.input}
					mode='outlined'
					secureTextEntry
					onChangeText={text => setContraseña(text)}
				/>
				<TextInput
					label="Repetir Contraseña"
					value={contraseñaRepetida}
					style={globalStyles.input}
					mode='outlined'
					secureTextEntry
					onChangeText={text => setContraseñaRepetida(text)}
				/>
				<Button
					style={globalStyles.boton}
					icon=""
					buttonColor={theme.colors.primary}
					mode="contained"
					compact
					onPress={() => manejarRegistro()}
				>
					Registrarse
				</Button>
				{msg !== '' ? (<Text style={{ color: 'darkred' }}>{msg}</Text>) : <></>}
				<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
			</View>
		</View>
	);
}

export default Registro;