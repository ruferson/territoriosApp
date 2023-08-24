import { Timestamp, addDoc, collection, deleteField, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { auth, db } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const EditarHistorial = ({ item, setUpdate, update, entreFechas, contieneFechas, antiguaSinCerrar }: any) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [publicador, setPublicador] = useState(item.publicador)
	const [fechaEntrada, setFechaEntrada] = useState<Date | undefined>(item.fechaEntrada?.toDate())
	const [fechaSalida, setFechaSalida] = useState<Date | undefined>(item.fechaSalida.toDate())
	const [campaña, setCampaña] = useState(item.campaña ? 'campaña' : 'normal')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')

	const editarHistorial = async () => {
		setLoading(true);
		if (publicador !== '' && fechaSalida !== undefined && campaña !== '') {
			setMsg('')

			if (!!fechaEntrada) {
				if (fechaEntrada < fechaSalida) {
					setMsg('¡Hay un error en las fechas!')
					setLoading(false);
					return;
				}
				if (entreFechas(fechaEntrada, item.id)) {
					setMsg('Hay un histórico que incluye la fecha de entrada indicada.')
					setLoading(false);
					return;
				}
				if (contieneFechas(fechaSalida, fechaEntrada, item.id)) {
					setMsg('Hay un histórico en el rango de fechas que has indicado.')
					setLoading(false);
					return;
				}
			}

			if (!fechaEntrada) {
				if (antiguaSinCerrar(fechaSalida, item.id)) {
					setMsg('No deberías editar un histórico anterior a los actuales y hacer que siga abierto.')
					setLoading(false);
					return;
				}
			}

			if (entreFechas(fechaSalida, item.id)) {
				setMsg('Hay un histórico que incluye la fecha salida indicada.')
				setLoading(false);
				return;
			}

			try {
				const newHistoricoData = {
					publicador,
					idTerritorio: item.idTerritorio,
					fechaSalida: Timestamp.fromDate(fechaSalida),
					...!!fechaEntrada && { fechaEntrada: Timestamp.fromDate(fechaEntrada) },
					campaña: campaña === 'campaña',
				}
				await updateDoc(doc(db, "historicoTerritorios", item.id), newHistoricoData);

				if (!fechaEntrada) {
					await updateDoc(doc(db, "historicoTerritorios", item.id), {
						fechaEntrada: deleteField()
					});
				}

				setLoading(false);
				setUpdate(update + 1)

			} catch (error) {
				console.log(error)
				setMsg('¡Ha habido un error!')
				setLoading(false);
			}
		} else {
			setLoading(false);
			setMsg('¡Faltan campos!')
		}
	};

	return (
		<View style={{ marginHorizontal: '5%' }}>
		<Text style={globalStyles.label}>Editando</Text>
			<TextInput
				theme={{
					colors: {
						background: colorScheme === 'dark' ? "#3e413e" : 'transparent',
					},
				}}
				label="Nombre Publicador"
				value={publicador}
				style={globalStyles.input}
				mode='outlined'
				onChangeText={text => setPublicador(text)}
			/>
			<DatePickerInput
				theme={{
					colors: {
						background: colorScheme === 'dark' ? "#3e413e" : 'transparent',
					},
				}}
				locale="es"
				style={globalStyles.input}
				label="Fecha de salida"
				value={fechaSalida}
				withModal={false}
				onChange={(d) => setFechaSalida(d)}
				onChangeText={(d) => {
					if (d === '') {
						setFechaSalida(undefined)
					}
				}}
				inputMode="start"
				mode='outlined'
			/>
			<DatePickerInput
				theme={{
					colors: {
						background: colorScheme === 'dark' ? "#3e413e" : 'transparent',
					},
				}}
				locale="es"
				style={globalStyles.input}
				label="Fecha de entrada"
				value={fechaEntrada}
				withModal={false}
				onChange={(d) => setFechaEntrada(d)}
				onChangeText={(d) => {
					if (d === '') {
						setFechaEntrada(undefined)
					}
				}}
				inputMode="start"
				mode='outlined'
			/>
			<SegmentedButtons
				value={campaña}
				onValueChange={setCampaña}
				buttons={[
					{
						value: 'normal',
						label: 'Normal',
					},
					{
						value: 'campaña',
						label: 'Campaña',
					},
				]}
				style={{ marginVertical: 10 }}
			/>
			{msg !== '' ? (<Text style={{ color: 'darkred' }}>{msg}</Text>) : <></>}
			{loading ? <ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} /> : <></>}
			<Button
				style={globalStyles.boton}
				icon=""
				textColor={theme.colors.onSecondary}
				buttonColor={theme.colors.secondary}
				mode="contained"
				compact
				onPress={() => editarHistorial()}
			>
				<Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>Guardar</Text>
			</Button>
		</View>
	);
}

export default EditarHistorial;