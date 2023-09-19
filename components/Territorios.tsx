import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View, useColorScheme, Alert } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, DataTable, FAB, IconButton, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { esCaducado } from '../helpers/Calculos';
import useTerritorios from '../hooks/useTerritorios';
import { territorioInterface } from '../interfaces/interfaces';
import globalCSS from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import { auth } from '../firebase/firebaseConfig';

const Territorios = ({ offline, setOffline }: { offline: boolean, setOffline: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [page, setPage] = useState<number>(0);
	const numberOfItemsPerPageList = [4, 6];
	const [territoriosPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[1]);

	const [update, setUpdate] = useState<number>(0);
	const { territorios, loading } = useTerritorios(update)
	const [territoriosList, setTerritoriosList] = useState<any[]>([])
	const from = page * territoriosPerPage;
	const to = Math.min((page + 1) * territoriosPerPage, territorios.length);
	const [refreshing, setRefreshing] = useState(false);
	const [filtrando, setFiltrando] = useState(false);
	const [filtroBarrio, setFiltroBarrio] = useState<string>('');
	const [filtroViv, setFiltroViv] = useState<string>('');
	const [filtroBaja, setFiltroBaja] = useState<string[]>([]);
	const [filtroNegocios, setFiltroNegocios] = useState<string[]>([]);
	const [filtroDisponibles, setFiltroDisponibles] = useState<string[]>([]);
	const [filtroCaducado, setFiltroCaducado] = useState<string[]>([]);
	const navigation = useNavigation();

	useEffect(() => {
		setRefreshing(loading);
		setPage(0);
		if (territorios.length) {
			setTerritoriosList(territorios);
		}
	}, [territoriosPerPage, loading, territorios]);

	const onRefresh = () => {
		setUpdate(update + 1);
	};

	const noExisteTer = (numero: string) => {
		const existeTer = territorios.find((value) => value.numero === numero);
		return !existeTer;
	}

	const filtrarTerritorios = () => {
		let filteredTerritorios = filtroBarrio !== ''
			? territorios.filter((ter) => ter.barrio.toString().toLowerCase().includes(filtroBarrio.toLowerCase()))
			: territorios;
		filteredTerritorios = filtroViv !== ''
			? filteredTerritorios.filter((ter) => parseInt(ter.numViviendas.toString()) >= parseInt(filtroViv))
			: filteredTerritorios;
		filteredTerritorios = filtroBaja.length === 1
			? filteredTerritorios.filter((ter) => ter.activo === (filtroBaja[0] === 'activo'))
			: filteredTerritorios;
		filteredTerritorios = filtroNegocios.length === 1
			? filteredTerritorios.filter((ter) => ter.negocios === (filtroNegocios[0] === 'negocios'))
			: filteredTerritorios;
		filteredTerritorios = filtroDisponibles.length === 1
			? filteredTerritorios.filter((ter) => (filtroDisponibles[0] === 'disponible') ? (!ter.ultimaFecha && ter.activo) : (!!ter.ultimaFecha))
			: filteredTerritorios;
		filteredTerritorios = filtroCaducado.length === 1
			? filteredTerritorios.filter((ter) => esCaducado(ter) === (filtroCaducado[0] === 'caducados'))
			: filteredTerritorios;
		setTerritoriosList(filteredTerritorios);
	}

	return (
		<View style={[globalCSS.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
				}
			>
				<View style={[globalCSS.contenido, { marginTop: 30, marginHorizontal: 80, flexDirection: 'row', justifyContent: 'space-between' }]}>
					<Avatar.Icon size={30} icon="blank" style={{ borderRadius: 0 }} theme={{
						colors: {
							primary: theme.colors.available,
						},
					}} />
					<Avatar.Icon size={30} icon="blank" style={{ borderRadius: 0 }} theme={{
						colors: {
							primary: theme.colors.expired,
						},
					}} />
					<Avatar.Icon size={30} icon="blank" style={{ borderRadius: 0 }} theme={{
						colors: {
							primary: theme.colors.error,
						},
					}} />
				</View>
				<View style={[globalCSS.contenido, { marginTop: 2, marginHorizontal: 60, flexDirection: 'row', justifyContent: 'space-between' }]}>
					<Text>Disponible</Text>
					<Text style={{ marginLeft: 15 }}>Caducado</Text>
					<Text>Dado de baja</Text>
				</View>
				<View style={[globalCSS.contenido, { marginTop: 0, flexDirection: 'row', justifyContent: 'space-between' }]}>
					<Text style={[globalCSS.subtitulo, { textAlign: 'right', width: '70%' }]}>
						Lista de Territorios
					</Text>
					<IconButton
						icon={filtrando ? 'filter-minus' : 'filter-plus'}
						iconColor={theme.colors.secondary}
						style={{ top: 10, right: 20 }}
						size={35}
						rippleColor={theme.colors.secondaryContainer + '99'}
						animated
						onPress={() => setFiltrando(!filtrando)}
					/>
				</View>
				{filtrando
					? (
						<View style={[{ backgroundColor: theme.colors.secondaryContainer, paddingHorizontal: '5%', paddingTop: 3 }]}>
							<TextInput
								label="Barrio"
								style={[globalCSS.input, { height: 45, marginBottom: 5 }]}
								mode='outlined'
								onChangeText={setFiltroBarrio}
								value={filtroBarrio}
							/>
							<TextInput
								label="Número Mínimo de Viviendas"
								style={[globalCSS.input, { height: 45 }]}
								mode='outlined'
								keyboardType='numeric'
								onChangeText={setFiltroViv}
								value={filtroViv}
							/>
							<SegmentedButtons
								style={{ marginBottom: 10 }}
								value={filtroBaja}
								multiSelect
								onValueChange={setFiltroBaja}
								buttons={[
									{
										value: 'activo',
										label: 'Activos',
										showSelectedCheck: true
									},
									{
										value: 'inactivo',
										label: 'Dados de baja',
										showSelectedCheck: true
									},
								]}
							/>
							<SegmentedButtons
								value={filtroNegocios}
								style={{ marginBottom: 10 }}
								multiSelect
								onValueChange={setFiltroNegocios}
								buttons={[
									{
										value: 'normal',
										label: 'Normal',
										showSelectedCheck: true
									},
									{
										value: 'negocios',
										label: 'Negocios',
										showSelectedCheck: true
									},
								]}
							/>
							<SegmentedButtons
								value={filtroDisponibles}
								style={{ marginBottom: 10 }}
								multiSelect
								onValueChange={setFiltroDisponibles}
								buttons={[
									{
										value: 'disponible',
										label: 'Disponibles',
										showSelectedCheck: true
									},
									{
										value: 'noDisponible',
										label: 'En proceso',
										showSelectedCheck: true
									},
								]}
							/>
							<SegmentedButtons
								value={filtroCaducado}
								multiSelect
								onValueChange={setFiltroCaducado}
								buttons={[
									{
										value: 'caducados',
										label: 'Caducados',
										showSelectedCheck: true
									},
									{
										value: 'noCaducados',
										label: 'No caducados',
										showSelectedCheck: true
									},
								]}
							/>
							<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
								<Button
									style={[globalCSS.boton, { marginBottom: 15, width: '48%' }]}
									icon=""
									buttonColor={theme.colors.error}
									mode="contained"
									compact
									onPress={() => {
										setFiltroBaja([]);
										setFiltroNegocios([]);
										setFiltroCaducado([]);
										setFiltroDisponibles([]);
										setFiltroBarrio('');
										setFiltroViv('');
										setTerritoriosList(territorios);
									}}
								>
									<Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold', paddingTop: 2 }}>Limpiar Filtros</Text>
								</Button>
								<Button
									style={[globalCSS.boton, { marginBottom: 15, width: '48%' }]}
									icon=""
									buttonColor={theme.colors.secondary}
									mode="contained"
									compact
									onPress={() => filtrarTerritorios()}
								>
									<Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold', paddingTop: 2 }}>Aplicar</Text>
								</Button>
							</View>
						</View>
					)
					: <></>}
				{loading
					? (<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />)
					: territoriosList.length ? (
						<View
							style={[globalCSS.contenido, {
								margin: '1%',
								marginBottom: '30%',
								flexDirection: 'column',
								flex: 1,
							}]}
						>

							<Card
								style={{ height: '97%' }}>
								<Card.Content>
									<DataTable>
										<DataTable.Header
											style={{
												borderColor: theme.colors.primary
											}}
										>
											<DataTable.Title textStyle={{ fontSize: 15 }}>Número</DataTable.Title>
											<DataTable.Title textStyle={{ fontSize: 15 }}>Barrio</DataTable.Title>
											<DataTable.Title textStyle={{ fontSize: 15 }} numeric>Tipo</DataTable.Title>
										</DataTable.Header>

										{territoriosList.sort((a, b) => parseInt(a.numero) - parseInt(b.numero)).slice(from, to).map((item: territorioInterface) => (
											<DataTable.Row key={item.numero}
												style={{
													borderColor: theme.colors.primary,
													...(!item.ultimaFecha && item.activo) && { backgroundColor: theme.colors.availableContainer, color: theme.colors.onAvailableContainer },
													...esCaducado(item) && { backgroundColor: theme.colors.expiredContainer, color: theme.colors.onExpiredContainer },
													...!item.activo && { backgroundColor: theme.colors.errorContainer, color: theme.colors.onErrorContainer },
												}}
												// @ts-ignore "NEVER"
												onPress={() => navigation.navigate('TerritorioDetalle', { id: item.id, numero: item.numero, update: () => setUpdate(currUpdate => currUpdate + 1) })}
											>
												<DataTable.Cell textStyle={{ fontSize: 15 }}>{item.numero}</DataTable.Cell>
												<DataTable.Cell textStyle={{ fontSize: 15 }}>{item.barrio}</DataTable.Cell>
												<DataTable.Cell textStyle={{ fontSize: 15 }} numeric>{item.negocios ? 'Negocios' : 'Normal'}</DataTable.Cell>
											</DataTable.Row>
										))}

										<DataTable.Pagination
											page={page}
											numberOfPages={Math.ceil(territoriosList.length / territoriosPerPage)}
											onPageChange={(page) => setPage(page)}
											label={`${from + 1}-${to} of ${territoriosList.length}`}
											numberOfItemsPerPageList={numberOfItemsPerPageList}
											numberOfItemsPerPage={territoriosPerPage}
											onItemsPerPageChange={onItemsPerPageChange}
											showFastPaginationControls
											selectPageDropdownLabel={'Territorios por página'}
											theme={{
												roundness: 20,
											}}
										/>
									</DataTable>
								</Card.Content>
							</Card>
						</View>
					) : <Text style={[globalCSS.subSubtitulo, { textAlign: 'center' }]}>No hay territorios disponibles</Text>
				}
			</ScrollView>
			<FAB
				icon="account-off"
				theme={{
					roundness: 10,
					colors: {
						primaryContainer: theme.colors.errorContainer
					}
				}}
				style={globalCSS.fabLeft}
				label="Cerrar Sesión"
				size="small"
				onPress={() => {
					Alert.alert(
						`Vas a cerrar sesión`,
						'¿Estás seguro de que quieres cerrar sesión?',
						[
							{ text: "No", style: 'cancel' },
							{
								text: 'Sí, cerrar sesión',
								style: 'destructive',
								onPress: async () => {
									setOffline(false);
									await auth.signOut();
								},
							},
						]
					);
				}}
			/>
			<FAB
				icon="plus"
				theme={{
					roundness: 10,
				}}
				style={globalCSS.fabRight}
				label="Añadir Territorio"
				// @ts-ignore "NEVER"
				onPress={() => navigation.navigate('AñadirTerritorio', {
					update, setUpdate: () => setUpdate(currUpdate => currUpdate + 1), noExisteTer
				})}
			/>
		</View >
	);
}

export default Territorios;