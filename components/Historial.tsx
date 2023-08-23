import React, { ReactNode, useEffect, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Card, IconButton, Text } from 'react-native-paper';
import useHistorico from '../hooks/useHistorico';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import AñadirHistorial from './AñadirHistorial';
import TarjetaHistorial from './TarjetaHistorial';

const Historial = ({ id, updatedTerritorio }: { id: string, updatedTerritorio: number }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [update, setUpdate] = useState(0);
	const [adding, setAdding] = useState(false);
	const { historico, loadingHistorico } = useHistorico(id, update)
	const [terminado, setTerminado] = useState(false);

	useEffect(() => {
		if (!loadingHistorico) {
			const terminado = historico.length === 0 || !historico.find((value: any) => !value.fechaEntrada);
			setTerminado(terminado);
		}
	}, [historico, loadingHistorico]);

	useEffect(() => {
		setUpdate(update + 1);
	}, [updatedTerritorio]);

	const entreFechas = (fecha: Date, idEditando?: string): boolean => {
		const yaEsta = historico.find((value) => {
			if (idEditando) {
				if (value.id === idEditando) {
					return false;
				}
			}
			if (value.fechaEntrada) {
				return fecha.valueOf() >= (value.fechaSalida.toDate().valueOf()) && fecha.valueOf() <= (value.fechaEntrada.toDate().valueOf());
			} else {
				return false;
			}
		});
		return !!yaEsta;
	}

	const contieneFechas = (salida: Date, entrada: Date, idEditando?: string): boolean => {
		return !!historico.find((value) => {
			if (idEditando) {
				if (value.id === idEditando) {
					return false;
				}
			}
			return salida.valueOf() <= (value.fechaSalida.toDate().valueOf()) && entrada.valueOf() >= (value.fechaEntrada.toDate().valueOf())
		})
	}

	const antiguaSinCerrar = (fecha: Date, idEditando?: string): boolean => {
		const esAntiguo = historico.find((value) => {
			if (idEditando) {
				if (value.id === idEditando) {
					return false;
				}
			}
			return fecha.valueOf() <= (value.fechaSalida.toDate().valueOf());
		});
		return !!esAntiguo;
	}

	const getHistorial = (): ReactNode => {
		const listaOrdenada = historico.sort((a, b) => b.fechaSalida.toDate().valueOf() - a.fechaSalida.toDate().valueOf());
		return listaOrdenada.map((item, idx) => {
			return (
				<TarjetaHistorial
					key={idx} item={item} update={update} setUpdate={setUpdate} entreFechas={entreFechas} contieneFechas={contieneFechas} antiguaSinCerrar={antiguaSinCerrar}
				></TarjetaHistorial>
			)
		})
	}

	return (
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text style={[globalStyles.subSubtitulo, {}]}>
					Historial
				</Text>
				{terminado ?
					<IconButton
						style={{ marginTop: '6%', marginBottom: '7%' }}
						icon={adding ? "minus-box" : "plus-box"}
						containerColor={theme.colors.secondary}
						iconColor={theme.colors.onSecondary}
						size={40}
						onPress={() => setAdding(!adding)}
					></IconButton> : <></>}
			</View>
			{adding ? <AñadirHistorial
				id={id} setAdding={setAdding} setUpdate={setUpdate} update={update} entreFechas={entreFechas} contieneFechas={contieneFechas} antiguaSinCerrar={antiguaSinCerrar}
			></AñadirHistorial> : <></>}

			{!loadingHistorico ?
				(
					<View style={{ marginBottom: 20 }}>
						{getHistorial()}
					</View>
				)
				: (<ActivityIndicator style={{ marginTop: '7%' }} animating={loadingHistorico} color={theme.colors.primary} />)}
		</View>
	);
}

export default Historial;