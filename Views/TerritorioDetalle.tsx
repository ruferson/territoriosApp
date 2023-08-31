import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Text } from 'react-native-paper';
import Historial from '../components/Historial';
import { auth, db } from '../firebase/firebaseConfig';
import useHistorico from '../hooks/useHistorico';
import useTerritorio from '../hooks/useTerritorio';
import { default as globalStyles } from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const TerritorioDetalle = ({ route }: { route: any }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const { numero, update: updateTerritorios } = route.params;

	const navigation = useNavigation();
	const [update, setUpdate] = useState(0);
	const { territorioData, loadingTerritorio } = useTerritorio(numero, update);
	const [activo, setActivo] = useState(true);

	const [refreshing, setRefreshing] = useState(false);
	const { historico, loadingHistorico } = useHistorico(numero, update)
	const [loading, setLoading] = useState(false);

	onAuthStateChanged(auth, () => {
		if (auth === null) {
			navigation.navigate('Home');
		}
	});

	useEffect(() => {
		setRefreshing(loadingTerritorio);
		updateTerritorios();
		if (territorioData) setActivo(territorioData.activo);
	}, [loadingTerritorio, territorioData]);

	const onRefresh = () => {
		setUpdate(update + 1);
	};

	const borrarTerritorio = async () => {
		try {
			setLoading(true);
			await deleteDoc(doc(db, "territorios", numero));
			if (historico.length) {
				const docRef = collection(db, "historicoTerritorios");
				const docSnap = await getDocs(query(docRef, where("idTerritorio", "==", numero)));
				docSnap.forEach(async (doc) => {
					await deleteDoc(doc.ref);
				})
			}
			updateTerritorios();
			navigation.goBack();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	const cambiarActividad = async () => {
		setLoading(true);
		setRefreshing(true);
		try {
			const newTerritorioData = {
				activo: !activo
			}
			await updateDoc(doc(db, "territorios", territorioData.id), newTerritorioData);
			updateTerritorios();
			setUpdate(update + 1)
			setLoading(false);
			setRefreshing(false);
		} catch (error) {
			console.log(error)
			setLoading(false);
			setRefreshing(false);
		}
	}

	return (
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
				}
			>
				<View style={[globalStyles.contenido]}>
					{loadingTerritorio || loading || territorioData === null
						? (<ActivityIndicator style={{ marginTop: '20%' }} animating={loadingTerritorio} color={theme.colors.primary} />)
						: (
							<>
								<Button
									style={[globalStyles.boton, { marginBottom: 3 }]}
									icon=""
									buttonColor={'darkred'}
									mode="contained"
									compact
									onPress={() => {
										Alert.alert(
											`¿Deseas borrar este territorio${historico.length ? ' junto a su historial' : ''}?`,
											'No lo podrás recuperar.',
											[
												{ text: "No, cancelar", style: 'cancel' },
												{
													text: 'Sí, borrar',
													style: 'destructive',
													onPress: () => borrarTerritorio(),
												},
											]
										);
									}}
								>
									<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Eliminar</Text>
								</Button>
								<Button
									style={[globalStyles.boton, { marginBottom: 3 }]}
									icon=""
									buttonColor={theme.colors.secondary}
									mode="contained"
									compact
									onPress={() => navigation.navigate('EditTerritorio', { update, setUpdate, territorioData })}
								>
									<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Editar</Text>
								</Button>
								<Button
									style={[globalStyles.boton, { marginBottom: 3 }]}
									icon=""
									buttonColor={theme.colors.secondaryContainer}
									textColor={theme.colors.onSecondaryContainer}
									mode="contained"
									compact
									onPress={() => cambiarActividad()}
								>
									<Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 4 }}>{activo ? 'Dar de baja' : 'Reactivar'}</Text>
								</Button>
								<Text style={[globalStyles.subtitulo, { ...!activo && { color: theme.colors.error } }]}>Número {numero}</Text>
								{territorioData.img?.url ?
									(
										<>
											<Text style={[globalStyles.subSubtitulo, { marginVertical: 0 }]}>Imagen:</Text>
											<Image
												style={{ width: '100%', height: 230, borderRadius: 5 }}
												source={{ uri: territorioData.img?.url }}
												loadingIndicatorSource={require('../assets/simple_ajax.gif')}
											/>
										</>
									)
									: <></>
								}
								<Text style={[globalStyles.subSubtitulo, { marginBottom: 1 }]}>Barrio:</Text>
								<Text style={globalStyles.texto}>{territorioData.barrio}</Text>
								<Text style={[globalStyles.subSubtitulo, { marginBottom: 1 }]}>Descripción:</Text>
								<Text style={globalStyles.texto}>{territorioData.descripcion === '' ? '-' : territorioData.descripcion}</Text>
								<Text style={[globalStyles.subSubtitulo, { marginBottom: 1 }]}>Número de Viviendas:</Text>
								<Text style={globalStyles.texto}>{territorioData.numViviendas === '' ? '-' : territorioData.numViviendas}</Text>
								<Text style={[globalStyles.subSubtitulo, { marginBottom: 1 }]}>Tipo:</Text>
								<Text style={globalStyles.texto}>{territorioData.negocios ? 'Negocios' : 'Normal'}</Text>
								<Text style={[globalStyles.subSubtitulo, { marginBottom: 1 }]}>Dado de Baja:</Text>
								<Text style={globalStyles.texto}>{territorioData.activo ? 'No' : 'Sí'}</Text>
								<Historial historico={historico} loadingHistorico={loadingHistorico} update={update} setUpdate={setUpdate} territorioID={numero} />
							</>
						)
					}
				</View>
			</ScrollView>
		</View>
	);
}

export default TerritorioDetalle;