import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Card, Checkbox, DataTable, FAB, IconButton, Modal, Portal, Searchbar, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import useTerritorios from '../hooks/useTerritorios';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const Territorios = () => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [page, setPage] = useState<number>(0);
	const numberOfItemsPerPageList = [4, 7];
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
		const existeTer = territorios.find((value) => value.id === numero);
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
		setTerritoriosList(filteredTerritorios);
	}

	return (
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
				}
			>
				<View style={[globalStyles.contenido, { flexDirection: 'row', justifyContent: 'space-between' }]}>
					<Text style={[globalStyles.subtitulo, { textAlign: 'right', width: '70%' }]}>
						Lista de Territorios
					</Text>
					<IconButton
						icon={filtrando ? 'filter-minus' : 'filter-plus'}
						iconColor={theme.colors.secondary}
						style={{top: 10, right: 20}}
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
								style={[globalStyles.input, { height: 45, marginBottom: 5 }]}
								mode='outlined'
								onChangeText={setFiltroBarrio}
								value={filtroBarrio}
							/>
							<TextInput
								label="Número Mínimo de Viviendas"
								style={[globalStyles.input, { height: 45 }]}
								mode='outlined'
								keyboardType='numeric'
								onChangeText={setFiltroViv}
								value={filtroViv}
							/>
							<SegmentedButtons
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
										label: 'Inactivos',
										showSelectedCheck: true
									},
								]}
							/>
							<View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
								<Button
									style={[globalStyles.boton, { marginBottom: 15, width: '48%' }]}
									icon=""
									buttonColor={theme.colors.error}
									mode="contained"
									compact
									onPress={() => {
										setFiltroBaja([]);
										setFiltroBarrio('');
										setFiltroViv('');
										setTerritoriosList(territorios);
									}}
								>
									<Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold', paddingTop: 2 }}>Limpiar Filtros</Text>
								</Button>
								<Button
									style={[globalStyles.boton, { marginBottom: 15, width: '48%' }]}
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
							style={[globalStyles.contenido, {
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
											<DataTable.Title textStyle={{ fontSize: 15 }} numeric>Baja</DataTable.Title>
										</DataTable.Header>

										{territoriosList.sort((a, b) => parseInt(a.id) - parseInt(b.id)).slice(from, to).map((item: any) => (
											<DataTable.Row key={item.id}
												style={{
													borderColor: theme.colors.primary,
													...!item.activo && { backgroundColor: theme.colors.errorContainer },
												}}
												onPress={() => navigation.navigate('TerritorioDetalle', { numero: item.id, update: () => setUpdate(currUpdate => currUpdate + 1) })}
											>
												<DataTable.Cell textStyle={{ fontSize: 15 }}>{item.id}</DataTable.Cell>
												<DataTable.Cell textStyle={{ fontSize: 15 }}>{item.barrio}</DataTable.Cell>
												<DataTable.Cell textStyle={{ fontSize: 15 }} numeric>{item.negocios ? 'Negocios' : 'Normal'}</DataTable.Cell>
												<DataTable.Cell textStyle={{ fontSize: 15 }} numeric>{item.activo ? 'No' : 'Sí'}</DataTable.Cell>
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
					) : <Text style={[globalStyles.subSubtitulo, { textAlign: 'center' }]}>No hay territorios disponibles</Text>
				}
			</ScrollView>
			<FAB
				icon="plus"
				theme={{
					roundness: 10,
				}}
				style={globalStyles.fab}
				label="Añadir Territorio"
				onPress={() => navigation.navigate('AddTerritorio', {
					update, setUpdate: () => setUpdate(currUpdate => currUpdate + 1), noExisteTer
				})}
			/>
		</View>
	);
}

export default Territorios;