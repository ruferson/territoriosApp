import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Checkbox, Text, TextInput } from 'react-native-paper';
import { auth, db } from '../firebase/firebaseConfig';
import globalCSS from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const Registro = () => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [nombre, setNombre] = useState('');
	const [email, setEmail] = useState('');
	const [contraseña, setContraseña] = useState('');
	const [contraseñaRepetida, setContraseñaRepetida] = useState('');
	const [aceptados, setAceptados] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorNombre, setErrorNombre] = useState("");
	const [errorEmail, setErrorEmail] = useState("");
	const [errorCont, setErrorCont] = useState("");
	const [errorAcept, setErrorAcept] = useState("");
	const [msg, setMsg] = useState('');
	const [registroCompletado, setRegistroCompletado] = useState(false);

	const manejarRegistro = async () => {
		if (validarFormulario()) {
			setLoading(true);
			try {
				await createUserWithEmailAndPassword(auth, email, contraseña);
				if (auth.currentUser) {
					await setDoc(doc(db, "users", auth.currentUser.uid), { email, nombre });
					await sendEmailVerification(auth.currentUser);
					setRegistroCompletado(true);
					setMsg('')
					setLoading(false);
				} else {
					setMsg('¡Error inesperado! Prueba de nuevo.')
					throw new Error('¡Error inesperado! Prueba de nuevo.')
				}
			} catch (error) {
				console.log(error)
				setRegistroCompletado(false);
				setMsg('¡Hay un error en los datos!')
				setLoading(false);
				auth.signOut();
			}
		} else {
			setRegistroCompletado(false);
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
	const validarTerminosCondicionesUso = (aceptados: boolean) => {
		if (aceptados) {
			setErrorAcept("")
			return true;
		} else {
			setErrorAcept("Debes aceptar los Términos y Condiciones de Uso de la aplicación para poder usarla.")
			return false;
		}
	}

	const validarFormulario = () => {
		validarNombre(nombre);
		validarEmail(email);
		validarContraseña(contraseña);
		validarTerminosCondicionesUso(aceptados);

		return validarNombre(nombre) && validarEmail(email) && validarContraseña(contraseña) && validarTerminosCondicionesUso(aceptados);
	}

	return (
		<View style={[globalCSS.contenedor, { backgroundColor: theme.colors.background }]}>
			<View style={globalCSS.contenido}>
				<Text style={globalCSS.subtitulo}>¡Bienvenido!</Text>
				{errorNombre !== '' ? (<Text style={{ color: 'darkred' }}>{errorNombre}</Text>) : <></>}
				<TextInput
					label="Nombre"
					value={nombre}
					style={globalCSS.input}
					mode='outlined'
					onChangeText={text => setNombre(text)}
				/>
				{errorEmail !== '' ? (<Text style={{ color: 'darkred' }}>{errorEmail}</Text>) : <></>}
				<TextInput
					label="E-Mail"
					value={email}
					style={globalCSS.input}
					mode='outlined'
					onChangeText={text => setEmail(text)}
				/>
				{errorCont !== '' ? (<Text style={{ color: 'darkred' }}>{errorCont}</Text>) : <></>}
				<TextInput
					label="Contraseña"
					value={contraseña}
					style={globalCSS.input}
					mode='outlined'
					secureTextEntry
					onChangeText={text => setContraseña(text)}
				/>
				<TextInput
					label="Repetir Contraseña"
					value={contraseñaRepetida}
					style={globalCSS.input}
					mode='outlined'
					secureTextEntry
					onChangeText={text => setContraseñaRepetida(text)}
				/>
				{errorAcept !== '' ? (<Text style={{ color: 'darkred' }}>{errorAcept}</Text>) : <></>}
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
					<Checkbox
						status={aceptados ? 'checked' : 'unchecked'}
						onPress={() => {
							setAceptados(!aceptados);
						}}
					/>
					<Text>Acepto los Términos y Condiciones de Uso</Text>
				</View>
				<ScrollView nestedScrollEnabled={true} style={{ height: 130, backgroundColor: theme.colors.pureBackground, padding: 6, marginTop: 8, borderRadius: 5 }}>
					<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Términos y Condiciones de Uso de Territorios App</Text>

					<Text style={{ marginBottom: 6 }}>Fecha de la última actualización: [20-08-2024]</Text>

					<Text style={{ marginBottom: 6 }}>Bienvenido a Territorios App ("la Aplicación"). Antes de utilizar la aplicación, lea detenidamente los siguientes términos y condiciones.
						El acceso y uso de esta aplicación implica su acuerdo con estos términos y condiciones. Si no está de acuerdo con estos términos, no utilice la aplicación.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>1. Uso de la Aplicación:</Text>
					<Text style={{ marginBottom: 6 }}>Territorios App es una aplicación de código abierto diseñada para uso personal y gratuito. No está permitida su venta ni su uso con
						fines comerciales. Los usuarios son bienvenidos a modificar la aplicación bajo su propia responsabilidad.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>2. Registro y Verificación de Correo Electrónico:</Text>
					<Text style={{ marginBottom: 6 }}>Al utilizar el modo online de la aplicación, los usuarios deben registrarse y validar su dirección de correo electrónico. Al hacerlo,
						usted acepta que su correo electrónico y nombre se almacenan en nuestra base de datos para fines de identificación y comunicación.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>3. Subida de Imágenes:</Text>
					<Text style={{ marginBottom: 6 }}>Usted acepta no subir imágenes que sean pornográficas, violentas, ilegales o que infrinjan los derechos de autor. Además, se compromete
						a obtener el consentimiento de las personas cuyos nombres o imágenes suba a la aplicación.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>4. Consentimiento de Personas:</Text>
					<Text style={{ marginBottom: 6 }}>Usted es responsable de asegurarse de que tiene el consentimiento adecuado de las personas cuyos nombres o imágenes se incluyan en
						la aplicación. Nosotros no asumimos ninguna responsabilidad por el incumplimiento de esta obligación.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>5. Modo Online:</Text>
					<Text style={{ marginBottom: 6 }}>Al utilizar el modo online de la aplicación, comprende y acepta que todo lo que guarde estará en una base de datos a la que el
						propietario de la aplicación tiene acceso. Nos reservamos el derecho de eliminar contenido que consideremos inapropiado o que viole estos
						términos y condiciones sin previo aviso.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>6. Propiedad Intelectual:</Text>
					<Text style={{ marginBottom: 6 }}>La aplicación y su contenido están protegidos por derechos de autor y otras leyes de propiedad intelectual. Los usuarios pueden modificar
						la aplicación, pero deben respetar los derechos de autor originales y seguir los términos de la licencia de código abierto aplicable.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>7. Uso Apropiado:</Text>
					<Text style={{ marginBottom: 6 }}>Usted se compromete a utilizar la aplicación de manera responsable y legal. No debe realizar actividades que puedan dañar, interrumpir
						o sobrecargar nuestros servidores o la experiencia de otros usuarios.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>8. Cambios en los Términos:</Text>
					<Text style={{ marginBottom: 6 }}>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia después de su publicación
						en la aplicación. Le recomendamos que revise periódicamente los términos de uso.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>9. Terminación de la Cuenta:</Text>
					<Text style={{ marginBottom: 6 }}>Nos reservamos el derecho de suspender o cancelar su cuenta si incumple estos términos y condiciones.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>10. Ley Aplicable:</Text>
					<Text style={{ marginBottom: 6 }}>- Estos términos se regirán e interpretarán de acuerdo con las leyes del [país/estado] sin tener en cuenta sus conflictos de leyes.</Text>

					<Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>11. Contacto:</Text>
					<Text style={{ marginBottom: 6 }}>- Si tiene alguna pregunta o inquietud sobre estos términos y condiciones, puede ponerse en contacto con nosotros en [fs.ruben02@gmail.com].</Text>

					<Text style={{ marginBottom: 6 }}>Al utilizar Territorios App, usted acepta cumplir con estos términos y condiciones. Si no está de acuerdo con ellos, no utilice la aplicación.</Text>

					<Text style={{ marginBottom: 16 }}>Fecha de la última actualización: [20-08-2024]</Text>
				</ScrollView>
				<Button
					style={[globalCSS.boton, {marginBottom: 20}]}
					icon=""
					buttonColor={theme.colors.primary}
					mode="contained"
					compact
					onPress={() => manejarRegistro()}
				>
					Registrarse
				</Button>
				{msg !== '' ? (<Text style={{ color: 'darkred', marginBottom: 30 }}>{msg}</Text>) : <></>}
				{loading ? <ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} /> : <></>}
			</View>
		</View>
	);
}

export default Registro;