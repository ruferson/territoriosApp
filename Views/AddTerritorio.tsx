import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { auth, db } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import { onAuthStateChanged } from 'firebase/auth';

const AddTerritorio = ({ route }: { route: any }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const { update, setUpdate, noExisteTer } = route.params;
	const [numero, setNumero] = useState('')
	const [descripcion, setDescripcion] = useState('')
	const [numViviendas, setNumVivienas] = useState('')
	const [barrio, setBarrio] = useState('')
	const [tipo, setTipo] = useState('normal')
	const [activo, setActivo] = useState('true')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')
	const navigation = useNavigation();

	onAuthStateChanged(auth, (currentUser) => {
		if (auth === null) {
			navigation.navigate('Home');
		}
	});

	const addTerritorioHandler = async () => {
		if (numero !== '' && barrio !== '' && tipo !== '' && activo !== '') {
			if (parseInt(numero) >= 0) {
				if (noExisteTer(numero)) {
					setLoading(true);
					setMsg('')
					try {
						const territorioData = {
							activo,
							barrio,
							descripcion,
							negocios: tipo === 'negocios',
							numViviendas,
						}
						await setDoc(doc(db, "territorios", numero), territorioData);
						setLoading(false);
						setUpdate(update + 1)
						navigation.goBack();
					} catch (error) {
						console.log(error)
					}
				} else {
					setMsg('El número de territorio indicado ya está siendo usado.')
				}
			} else {
				setMsg('¡Números incorrectos!')
			}
		} else {
			setMsg('¡Faltan datos!')
		}
	};

	return (
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView>
				<View style={globalStyles.contenido}>
					<Text style={globalStyles.subtitulo}>Nuevo Territorio</Text>
					<TextInput
						label="Número *"
						value={numero}
						keyboardType='numeric'
						style={globalStyles.input}
						mode='outlined'
						onChangeText={text => setNumero(text.replace(/[^0-9]/g, ''))}
					/>
					<TextInput
						label="Barrio *"
						value={barrio}
						style={globalStyles.input}
						mode='outlined'
						onChangeText={text => setBarrio(text)}
					/>
					<TextInput
						label="Descripción"
						value={descripcion}
						style={globalStyles.input}
						mode='outlined'
						multiline
						onChangeText={text => setDescripcion(text)}
					/>
					<TextInput
						label="Número de Viviendas"
						value={numViviendas}
						style={globalStyles.input}
						keyboardType='numeric'
						mode='outlined'
						onChangeText={text => setNumVivienas(text.replace(/[^0-9]/g, ''))}
					/>
					<Text style={globalStyles.label}>Tipo:</Text>
					<SegmentedButtons
						value={tipo}
						onValueChange={setTipo}
						buttons={[
							{
								value: 'normal',
								label: 'Normal',
							},
							{
								value: 'negocios',
								label: 'Negocios',
							},
						]}
						style={{ marginBottom: 10 }}
					/>
					<Text style={globalStyles.label}>Dado de baja:</Text>
					<SegmentedButtons
						value={activo}
						onValueChange={setActivo}
						buttons={[
							{
								value: 'true',
								label: 'No',
							},
							{
								value: 'false',
								label: 'Sí',
							},
						]}
						style={{ marginBottom: 20 }}
					/>
					{msg !== '' ? (<Text style={{ color: 'darkred', fontSize: 20, textAlign: 'center' }}>{msg}</Text>) : <></>}
					<Text style={{ color: 'darkred', fontSize: 15, textAlign: 'left' }}>* Obligatorio</Text>
					<Button
						style={globalStyles.boton}
						icon=""
						buttonColor={theme.colors.primary}
						mode="contained"
						compact
						onPress={() => addTerritorioHandler()}
					>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Añadir</Text>
					</Button>
					<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
				</View>
			</ScrollView>
		</View>
	);
}

export default AddTerritorio;