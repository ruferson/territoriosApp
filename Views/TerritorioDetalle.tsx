import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Text } from 'react-native-paper';
import { auth, db } from '../firebase/firebaseConfig';
import useTerritorio from '../hooks/useTerritorio';
import { default as globalStyles } from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import Historial from '../components/Historial';
import { onAuthStateChanged } from 'firebase/auth';

const TerritorioDetalle = ({ route }: { route: any }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const { numero, update, setUpdate } = route.params;
	const [deleting, setDeleting] = useState(false);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const [updateTerritorio, setUpdateTerritorio] = useState(0);
	const { territorioData, loadingTerritorio } = useTerritorio(numero, updateTerritorio);
	const navigation = useNavigation();
	const [refreshing, setRefreshing] = useState(false);

	onAuthStateChanged(auth, (currentUser) => {
		if (auth === null) {
			navigation.navigate('Home');
		}
	});

	useEffect(() => {
		setRefreshing(loadingTerritorio);
	}, [loadingTerritorio]);

	const onRefresh = () => {
		setUpdateTerritorio(updateTerritorio + 1);
  };

	const borrarTerritorio = async () => {
		try {
			setLoadingDelete(true)
			await deleteDoc(doc(db, "territorios", numero));
			setLoadingDelete(false)
			setDeleting(false)
			setUpdate(update + 1)
			navigation.goBack();
		} catch (error) {
			setLoadingDelete(false)
			console.log(error)
		}
	}

	return (
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
			>
				<Portal>
					<Dialog visible={deleting} onDismiss={() => setDeleting(false)}>
						<Dialog.Title>¿Deseas borrar este territorio?</Dialog.Title>
						<Dialog.Content>
							<Text variant="bodyMedium">No lo podrás recuperar.</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button textColor='darkred' onPress={() => borrarTerritorio()}>Sí, borrar</Button>
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
				{loadingTerritorio
					? (<ActivityIndicator style={{ marginTop: '20%' }} animating={loadingTerritorio} color={theme.colors.primary} />)
					: (
						<View style={globalStyles.contenido}>
							<Button
								style={[globalStyles.boton, { marginBottom: 3 }]}
								icon=""
								buttonColor={'darkred'}
								mode="contained"
								compact
								onPress={() => setDeleting(true)}
							>
								<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Eliminar Territorio</Text>
							</Button>
							<Text style={globalStyles.subtitulo}>Nº{numero}</Text>
							{territorioData.img ?
								(
									<Text style={globalStyles.subSubtitulo}>Imagen</Text>
								) : <></>}
							<Text style={globalStyles.subSubtitulo}>Barrio</Text>
							<Text style={globalStyles.texto}>{territorioData.barrio}</Text>
							<Text style={globalStyles.subSubtitulo}>Descripción</Text>
							<Text style={globalStyles.texto}>{territorioData.descripcion}</Text>
							<Text style={globalStyles.subSubtitulo}>Número de Viviendas</Text>
							<Text style={globalStyles.texto}>{territorioData.numViviendas}</Text>
							<Text style={globalStyles.subSubtitulo}>Tipo</Text>
							<Text style={globalStyles.texto}>{territorioData.negocios ? 'Negocios' : 'Normal'}</Text>
							<Text style={globalStyles.subSubtitulo}>Dado de Baja</Text>
							<Text style={globalStyles.texto}>{territorioData.activo ? 'No' : 'Sí'}</Text>
							<Historial id={numero} updatedTerritorio={update}></Historial>
						</View>
					)
				}
			</ScrollView>
		</View>
	);
}

export default TerritorioDetalle;