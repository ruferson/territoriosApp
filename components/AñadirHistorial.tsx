import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { auth, db } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import { territorioInterface } from '../interfaces/interfaces';

const AñadirHistorial = ({ id, setAdding, setUpdate, update, entreFechas, contieneFechas, antiguaSinCerrar }: any) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [publicador, setPublicador] = useState('')
	const [fechaSalida, setFechaSalida] = useState<Date>(new Date())
	const [fechaEntrada, setFechaEntrada] = useState<Date>()
	const [campaña, setCampaña] = useState('')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')

	const onSignInHandler = async () => {
		setLoading(true);
		if (publicador !== '' && fechaSalida !== undefined && campaña !== '') {
			setMsg('')

			if (!!fechaEntrada) {
				if (fechaEntrada < fechaSalida) {
					setMsg('La fecha de entrada no debería ser anterior a la fecha de salida.')
					setLoading(false);
					return;
				}
				if (entreFechas(fechaEntrada)) {
					setMsg('Hay un histórico que incluye la fecha de entrada indicada.')
					setLoading(false);
					return;
				}
				if (contieneFechas(fechaSalida, fechaEntrada)) {
					setMsg('Hay un histórico en el rango de fechas que has indicado.')
					setLoading(false);
					return;
				}
			}

			if (!fechaEntrada) {
				if (antiguaSinCerrar(fechaSalida)) {
					setMsg('No deberías añadir un histórico anterior a los actuales y que siga abierto.')
					setLoading(false);
					return;
				}
			}

			if (entreFechas(fechaSalida)) {
				setMsg('Hay un histórico que incluye la fecha salida indicada.')
				setLoading(false);
				return;
			}

			try {
				const historicoData = {
					publicador,
					terID: id,
					fechaSalida: Timestamp.fromDate(fechaSalida),
					...!!fechaEntrada && { fechaEntrada: Timestamp.fromDate(fechaEntrada) },
					campaña: campaña === 'campaña',
					uid: auth.currentUser?.uid
				}
				await addDoc(collection(db, "territorios", id, 'historico'), historicoData);
				if (!fechaEntrada) {
					await updateDoc(doc(db, "territorios", id), { ultimaFecha: Timestamp.fromDate(fechaSalida) });
				}
				setLoading(false);
				setAdding(false);
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
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background, marginBottom: '1%' }]}>
			<TextInput
				label="Nombre Publicador *"
				value={publicador}
				style={globalStyles.input}
				mode='outlined'
				onChangeText={text => setPublicador(text)}
			/>
			<DatePickerInput
				locale="es"
				style={globalStyles.input}
				label="Fecha de salida *"
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
			<Text style={globalStyles.label}>Tipo: *</Text>
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
					<Text style={{ color: 'darkred', fontSize: 15, textAlign: 'left' }}>* Obligatorio</Text>
			<Button
				style={globalStyles.boton}
				icon=""
				textColor={theme.colors.onSecondary}
				buttonColor={theme.colors.secondary}
				mode="contained"
				compact
				onPress={() => onSignInHandler()}
			>
				<Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>Añadir</Text>
			</Button>
		</View>
	);
}

export default AñadirHistorial;