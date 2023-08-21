import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { db } from '../firebase/firebaseConfig';
import colors from '../styles/colors';
import globalStyles from '../styles/global';

const AddTerritorio = () => {
	const [numero, setNumero] = useState('')
	const [descripcion, setDescripcion] = useState('')
	const [numViviendas, setNumVivienas] = useState('')
	const [barrio, setBarrio] = useState('')
	const [tipo, setTipo] = useState('normal')
	const [activo, setActivo] = useState('true')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')
	const navigation = useNavigation();

	const theme = {
		colors: {
			secondaryContainer: colors.light.secondary,
			onSecondaryContainer: 'white',
			primary: colors.light.darkPrimary,
		},
	};

	const addTerritorioHandler = async () => {
		if (numero !== '' && descripcion !== '' && numViviendas !== '' && barrio !== '' && tipo !== '' && activo !== '') {
			if (parseInt(numero) >= 0 && parseInt(numViviendas) >= 1) {
				setLoading(true);
				setMsg('')
				try {
					const territorioData = {
						activo,
						barrio,
						descripcion,
						negocios: tipo === 'negocios' ? true : false,
						numViviendas,
					}
					await setDoc(doc(db, "territorios", numero), territorioData);
					setLoading(false);
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
		<View style={globalStyles.contenedor}>
			<Text style={globalStyles.version}>v1.0.0</Text>
			<ScrollView>
				<View style={globalStyles.contenido}>
					<Text style={globalStyles.subtitulo}>Nuevo Territorio</Text>
					<TextInput
						label="Número"
						textColor={colors.light.textLow}
						value={numero}
						keyboardType='numeric'
						style={globalStyles.input}
						mode='outlined'
						outlineColor={colors.light.secondary}
						activeOutlineColor={colors.light.primary}
						onChangeText={text => setNumero(text.replace(/[^0-9]/g, ''))}
					/>
					<TextInput
						label="Barrio"
						textColor={colors.light.textLow}
						value={barrio}
						style={globalStyles.input}
						mode='outlined'
						outlineColor={colors.light.secondary}
						activeOutlineColor={colors.light.primary}
						onChangeText={text => setBarrio(text)}
					/>
					<TextInput
						label="Descripción"
						textColor={colors.light.textLow}
						value={descripcion}
						style={globalStyles.input}
						mode='outlined'
						multiline
						outlineColor={colors.light.secondary}
						activeOutlineColor={colors.light.primary}
						onChangeText={text => setDescripcion(text)}
					/>
					<TextInput
						label="Número de Viviendas"
						textColor={colors.light.textLow}
						value={numViviendas}
						style={globalStyles.input}
						keyboardType='numeric'
						mode='outlined'
						outlineColor={colors.light.secondary}
						activeOutlineColor={colors.light.primary}
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
						theme={theme}
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
						theme={theme}
						style={{ marginBottom: 20 }}
					/>
					{msg !== '' ? (<Text style={{ color: 'darkred', fontSize: 20, textAlign: 'center' }}>{msg}</Text>) : <></>}
					<Button
						style={globalStyles.boton}
						icon=""
						buttonColor={colors.light.primary}
						mode="contained"
						compact
						onPress={() => addTerritorioHandler()}
					>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Añadir</Text>
					</Button>
					<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={colors.light.primary} />
				</View>
			</ScrollView>
		</View>
	);
}

export default AddTerritorio;