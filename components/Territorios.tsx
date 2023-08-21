import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, DataTable, FAB, Text } from 'react-native-paper';
import useTerritorios from '../hooks/useTerritorios';
import colors from '../styles/colors';
import globalStyles from '../styles/global';

const Territorios = () => {
	const [page, setPage] = useState<number>(0);
	const numberOfItemsPerPageList = [4, 8];
	const [territoriosPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[1]);
	const [update, setUpdate] = useState<number>(0);
	const { territorios, loading } = useTerritorios(update)
	const from = page * territoriosPerPage;
	const to = Math.min((page + 1) * territoriosPerPage, territorios.length);
	const navigation = useNavigation();

	useEffect(() => {
		setPage(0);
	}, [territoriosPerPage, loading]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setUpdate(update + 1)
		});

		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	}, [navigation]);

	return (
		<View style={globalStyles.contenedor}>
		<Text style={globalStyles.version}>v1.0.0</Text>
			<FAB
				icon="plus"
				theme={{
					colors: {
						onPrimaryContainer: colors.light.basic,
						primaryContainer: colors.light.primary,
					},
					roundness: 3,
				}}
				style={globalStyles.fab}
				label="Añadir Territorio"
				onPress={() => navigation.navigate('AddTerritorio')}
			/>
			<View style={globalStyles.contenido}>
				<Text style={globalStyles.subtitulo}>Lista de Territorios</Text>
				{loading
					? (<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={colors.light.primary} />)
					: (
						<DataTable>
							<DataTable.Header
								style={{
									borderColor: colors.light.primary
								}}
							>
								<DataTable.Title>Número</DataTable.Title>
								<DataTable.Title>Barrio</DataTable.Title>
								<DataTable.Title numeric>Tipo</DataTable.Title>
								<DataTable.Title numeric>Activo</DataTable.Title>
							</DataTable.Header>

							{territorios.slice(from, to).map((item: any) => (
								<DataTable.Row key={item.id}
									style={{
										borderColor: colors.light.primary
									}}
									onPress={() => navigation.navigate('TerritorioDetalle', { numero: item.id })}
								>
									<DataTable.Cell>{item.id}</DataTable.Cell>
									<DataTable.Cell>{item.barrio}</DataTable.Cell>
									<DataTable.Cell numeric>{item.negocios ? 'Negocios' : 'Normal'}</DataTable.Cell>
									<DataTable.Cell numeric>{item.activo ? 'Sí' : 'No'}</DataTable.Cell>
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
									colors: {
										primary: colors.light.darkPrimary,
										elevation: {
											level2: colors.light.basic,
										}
									},
									roundness: 20,
								}}
							/>
						</DataTable>
					)
				}
			</View>
		</View>
	);
}

export default Territorios;