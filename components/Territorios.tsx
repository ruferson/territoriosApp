import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Card, DataTable, FAB, Text } from 'react-native-paper';
import useTerritorios from '../hooks/useTerritorios';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const Territorios = () => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const [page, setPage] = useState<number>(0);
	const numberOfItemsPerPageList = [4, 8];
	const [territoriosPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[1]);

	const [update, setUpdate] = useState<number>(0);
	const { territorios, loading } = useTerritorios(update)
	const from = page * territoriosPerPage;
	const to = Math.min((page + 1) * territoriosPerPage, territorios.length);
	const [refreshing, setRefreshing] = useState(false);
	const navigation = useNavigation();

	useEffect(() => {
		setRefreshing(loading);
		setPage(0);
	}, [territoriosPerPage, loading]);

	const onRefresh = () => {
		setUpdate(update + 1);
	};

	const noExisteTer = (numero: string) => {
		const existeTer = territorios.find((value) => value.id === numero);
		return !existeTer;
	}

	return (
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView
				style={globalStyles.contenido}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
				}
			>
				<Text style={globalStyles.subtitulo}>Lista de Territorios</Text>
				{loading
					? (<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />)
					: territorios.length ? (
						<View
							style={{
								margin: '1%',
								marginBottom: '2%',
								flexDirection: 'column',
								flex: 1,
							}}
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

										{territorios.sort((a, b) => parseInt(a.id) - parseInt(b.id)).slice(from, to).map((item: any) => (
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
											numberOfPages={Math.ceil(territorios.length / territoriosPerPage)}
											onPageChange={(page) => setPage(page)}
											label={`${from + 1}-${to} of ${territorios.length}`}
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