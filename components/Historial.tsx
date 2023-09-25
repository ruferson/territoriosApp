import React, { ReactNode, useEffect, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import globalCSS from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import AñadirHistorial from './AñadirHistorial';
import TarjetaHistorial from './TarjetaHistorial';

const Historial = ({ historico, loadingHistorico, update, setUpdate, territorioID }: any) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [adding, setAñadiendo] = useState(false);
	const [terminado, setTerminado] = useState(false);

	useEffect(() => {
		if (!loadingHistorico) {
			const terminado = historico.length === 0 || !historico.find((value: any) => !value.fechaEntrada);
			setTerminado(terminado);
		}

	}, [historico, loadingHistorico]);

	const esEntreFechas = (fecha: Date, idEditando?: string): boolean => {
		const yaEsta = historico.find((value: any) => {
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
		return !!historico.find((value: any) => {
			if (idEditando) {
				if (value.id === idEditando) {
					return false;
				}
			}
			return salida.valueOf() <= (value.fechaSalida.toDate().valueOf()) && entrada.valueOf() >= (value.fechaEntrada.toDate().valueOf())
		})
	}

	const hayAntiguaSinCerrar = (fecha: Date, idEditando?: string): boolean => {
		const esAntiguo = historico.find((value: any) => {
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
		const listaOrdenada = historico.sort((a: any, b: any) => b.fechaSalida.toDate().valueOf() - a.fechaSalida.toDate().valueOf());
		return listaOrdenada.map((item: any, idx: number) => {
			return (
				<TarjetaHistorial
					key={idx} item={item} update={update} setUpdate={setUpdate} esEntreFechas={esEntreFechas} contieneFechas={contieneFechas} hayAntiguaSinCerrar={hayAntiguaSinCerrar}
				></TarjetaHistorial>
			)
		})
	}

	return (
		<View style={[globalCSS.contenedor, { backgroundColor: theme.colors.background }]}>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text style={[globalCSS.subSubtitulo, {}]}>
					Historial:
				</Text>
				{terminado ?
					<IconButton
						style={{ marginTop: '6%', marginBottom: '7%' }}
						icon={adding ? "minus-box" : "plus-box"}
						containerColor={theme.colors.secondary}
						iconColor={theme.colors.onSecondary}
						size={40}
						animated
						onPress={() => setAñadiendo(!adding)}
					></IconButton> : <></>}
			</View>
			{adding ? <AñadirHistorial
				id={territorioID} setAñadiendo={setAñadiendo} setUpdate={setUpdate} update={update} esEntreFechas={esEntreFechas} contieneFechas={contieneFechas} hayAntiguaSinCerrar={hayAntiguaSinCerrar}
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