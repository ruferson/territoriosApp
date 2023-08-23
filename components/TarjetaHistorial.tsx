import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Card, Dialog, Portal, Text } from 'react-native-paper';
import { darkTheme, lightTheme } from '../styles/theme';
import globalStyles from '../styles/global';
import { DatePickerInput } from 'react-native-paper-dates';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import EditarHistorial from './EditarHistorial';

const TarjetaHistorial = ({ item, update, setUpdate, entreFechas, contieneFechas, antiguaSinCerrar }: any) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const entrada = item.fechaEntrada ? item.fechaEntrada.toDate() : new Date();
	const salida = item.fechaSalida.toDate();
	const [mostrarEntrada, setMostrarEntrada] = useState(false)
	const [nuevaFechaEntrada, setNuevaFechaEntrada] = useState<Date | undefined>(new Date());
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [añadiendoFechaEntrada, setAñadiendoFechaEntrada] = useState(false);
	const [msgFechaEntrada, setMsgFechaEntrada] = useState('');
	const [editing, setEditing] = useState(false);

	const deleteHistorico = async () => {
		setLoadingDelete(true)
		try {
			await deleteDoc(doc(db, "historicoTerritorios", item.id));
			setLoadingDelete(false)
			setDeleting(false)
			setUpdate(update + 1)
		} catch (error) {
			setLoadingDelete(false)
			console.log(error)
		}
	}

	const añadirFechaEntrada = async () => {
		setAñadiendoFechaEntrada(true)
		if (nuevaFechaEntrada && nuevaFechaEntrada >= salida) {
			try {
				const historico = doc(db, "historicoTerritorios", item.id);
				await updateDoc(historico, {
					fechaEntrada: nuevaFechaEntrada
				});
				setAñadiendoFechaEntrada(false)
				setUpdate(update + 1)
			} catch (error) {
				setAñadiendoFechaEntrada(false)
				console.log(error)
			}
		} else {
			setAñadiendoFechaEntrada(false)
			setMsgFechaEntrada('Fecha de entrada incorrecta.')
		}
	}

	return (
		<>
			<Portal>
				<Dialog visible={deleting} onDismiss={() => setDeleting(false)}>
					<Dialog.Title>¿Deseas borrar este historico?</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">No lo podrás recuperar.</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button textColor='darkred' onPress={() => deleteHistorico()}>Sí, borrar</Button>
						<Button onPress={() => setDeleting(false)}>
							<Text style={{ fontSize: 20, fontWeight: 'bold' }}>No, cancelar</Text>
						</Button>
					</Dialog.Actions>
					{loadingDelete
						? (<ActivityIndicator style={{ marginHorizontal: '7%' }} animating={loadingDelete} color={'darkred'} />)
						: <></>
					}
				</Dialog>
			</Portal>
			<Card
				theme={{
					colors: {
						...colorScheme === 'dark' && {
							elevation: {
								level1: "#3e413e",
							},
						},
						...!item.fechaEntrada && {
							elevation: {
								level1: colorScheme === 'dark' ? '#4a1212' : "#f0e0e0",
							},
						}
					}
				}}
				style={{ marginBottom: '5%' }}>
				<Card.Content>
					<Text variant="titleMedium">Publicador: <Text>{item.publicador}</Text></Text>
					<Text variant="titleMedium">Campaña: <Text>{item.campaña ? 'Sí' : 'No'}</Text></Text>
					<Text variant="titleMedium">Fecha salida: <Text>{`${salida.getDate()}-${salida.getMonth() + 1}-${salida.getFullYear()}`}</Text></Text>
					{item.fechaEntrada
						? <Text variant="titleMedium">Fecha entrada: <Text>{`${entrada.getDate()}-${entrada.getMonth() + 1}-${entrada.getFullYear()}`}</Text></Text>
						: <Text variant="bodyMedium">En proceso</Text>}
				</Card.Content>
				<Card.Actions>
					<View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
						<Button
							textColor={theme.colors.onPrimary}
							onPress={() => setDeleting(true)}
						>
							Eliminar
						</Button>
						<Button
							textColor={theme.colors.onPrimary}
							onPress={() => { setEditing(!editing); setMostrarEntrada(false); }}
						>
							{!editing ? 'Editar' : 'Cancelar edición'}
						</Button>
						{
							!item.fechaEntrada
								?
								<Button
									textColor={theme.colors.onPrimary}
									onPress={() => { setEditing(false); setMostrarEntrada(!mostrarEntrada); }}
								>
									{!mostrarEntrada ? 'Añadir entrada' : 'Cancelar entrada'}
								</Button>
								: <></>
						}
					</View>
				</Card.Actions>
				{
					mostrarEntrada
						? (
							<View style={{ marginHorizontal: 25 }}>
								<Text style={globalStyles.label}>Añadiendo fecha de entrada</Text>
								<DatePickerInput
									theme={{
										colors: {
											background: colorScheme === 'dark' ? '#4a1212' : "#f0e0e0",
										},
									}}
									locale="es"
									style={globalStyles.input}
									label="Fecha de entrada"
									value={nuevaFechaEntrada}
									withModal={false}
									onChange={(d) => setNuevaFechaEntrada(d)}
									onChangeText={(d) => {
										if (d === '') {
											setNuevaFechaEntrada(undefined)
										}
									}}
									inputMode="start"
									mode='outlined'
								/>
								{msgFechaEntrada !== '' ? (<Text style={{ color: 'darkred' }}>{msgFechaEntrada}</Text>) : <></>}
								{añadiendoFechaEntrada ? <ActivityIndicator style={{ marginTop: '7%' }} animating={añadiendoFechaEntrada} color={theme.colors.primary} /> : <></>}
								<Button
									style={globalStyles.boton}
									icon=""
									textColor={theme.colors.onSecondary}
									buttonColor={theme.colors.secondary}
									mode="contained"
									compact
									onPress={() => añadirFechaEntrada()}
								>
									<Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>Añadir fecha</Text>
								</Button>
							</View>
						)
						: <></>
				}
				{
					editing
						? (
							<EditarHistorial
								item={item} setUpdate={setUpdate} update={update} entreFechas={entreFechas} contieneFechas={contieneFechas} antiguaSinCerrar={antiguaSinCerrar}
							></EditarHistorial>
						)
						: <></>}
			</Card>
		</>
	)
}

export default TarjetaHistorial;