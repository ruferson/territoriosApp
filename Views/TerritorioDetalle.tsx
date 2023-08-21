import { useNavigation } from '@react-navigation/native';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Text } from 'react-native-paper';
import { db } from '../firebase/firebaseConfig';
import useTerritorio from '../hooks/useTerritorio';
import colors from '../styles/colors';
import { default as globalStyles } from '../styles/global';

const TerritorioDetalle = ({ route }: { route: any }) => {
	const { numero } = route.params;
	const [deleting, setDeleting] = useState(false);
	const { territorioData, loadingTerritorio } = useTerritorio(numero);
	const [loadingDelete, setLoadingDelete] = useState(false);
	const navigation = useNavigation()

	const borrarTerritorio = async () => {
		try {
			setLoadingDelete(true)
			await deleteDoc(doc(db, "territorios", numero));
			setLoadingDelete(false)
			setDeleting(false)
			navigation.goBack();
		} catch (error) {
			setLoadingDelete(false)
			console.log(error)
		}
	}

	return (
		<View style={globalStyles.contenedor}>
		<Text style={globalStyles.version}>v1.0.0</Text>
			<ScrollView>
				<Portal theme={{
					onPrimaryContainer: colors.light.darkPrimary,
					elevation: {
						level2: colors.light.basic,
					}
				}}>
					<Dialog visible={deleting} style={{ backgroundColor: colors.light.basic }} onDismiss={() => setDeleting(false)}>
						<Dialog.Title>¿Deseas borrar este territorio?</Dialog.Title>
						<Dialog.Content>
							<Text variant="bodyMedium">No lo podrás recuperar.</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button textColor='darkred' onPress={() => borrarTerritorio()}>Sí, borrar</Button>
							<Button textColor={colors.light.text} onPress={() => setDeleting(false)}>
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
					? (<ActivityIndicator style={{ marginTop: '20%' }} animating={loadingTerritorio} color={colors.light.primary} />)
					: (
						<View style={globalStyles.contenido}>
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
							<Button
								style={[globalStyles.boton, { marginTop: '10%' }]}
								icon=""
								buttonColor={'darkred'}
								mode="contained"
								compact
								onPress={() => setDeleting(true)}
							>
								<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Eliminar Territorio</Text>
							</Button>
						</View>
					)
				}
			</ScrollView>
		</View>
	);
}

export default TerritorioDetalle;