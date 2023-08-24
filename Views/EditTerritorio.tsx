import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { auth, db } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import { onAuthStateChanged } from 'firebase/auth';

const EditTerritorio = ({ route }: { route: any }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const { updateTerritorio, setUpdateTerritorio, territorioData } = route.params;
	const [descripcion, setDescripcion] = useState(territorioData.descripcion)
	const [numViviendas, setNumViviendas] = useState(territorioData.numViviendas.toString())
	const [barrio, setBarrio] = useState(territorioData.barrio)
	const [tipo, setTipo] = useState(territorioData.negocios ? 'negocios' : 'normal')
	const [activo, setActivo] = useState(territorioData.activo ? 'true' : 'false')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')
	const navigation = useNavigation();

	onAuthStateChanged(auth, () => {
		if (auth === null) {
			navigation.navigate('Home');
		}
	});

	const addTerritorioHandler = async () => {
		if (descripcion !== '' && numViviendas !== '' && barrio !== '' && tipo !== '' && activo !== '') {
			if (parseInt(numViviendas) >= 1) {
				setLoading(true);
				setMsg('')
				try {
					const newTerritorioData = {
						activo: activo === 'true',
						barrio,
						descripcion,
						negocios: tipo === 'negocios',
						numViviendas,
					}
					await updateDoc(doc(db, "territorios", territorioData.id), newTerritorioData);
					setLoading(false);
					setUpdateTerritorio(updateTerritorio + 1)
					navigation.goBack();
				} catch (error) {
					console.log(error)
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
					<Text style={globalStyles.subtitulo}>Editando Territorio Número {territorioData.id}</Text>
					<TextInput
						label="Barrio"
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
						onChangeText={text => setNumViviendas(text.replace(/[^0-9]/g, ''))}
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
					<Button
						style={globalStyles.boton}
						icon=""
						buttonColor={theme.colors.primary}
						mode="contained"
						compact
						onPress={() => addTerritorioHandler()}
					>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Guardar</Text>
					</Button>
					<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
				</View>
			</ScrollView>
		</View>
	);
}

export default EditTerritorio;