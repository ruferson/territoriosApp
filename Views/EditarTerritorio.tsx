import { useNavigation } from '@react-navigation/native';
import { FieldValue, deleteField, doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { auth, db, storage } from '../firebase/firebaseConfig';
import globalCSS from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import { onAuthStateChanged } from 'firebase/auth';
import { territorioInterface } from '../interfaces/interfaces';
import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const EditarTerritorio = ({ route }: { route: any }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const { update, setUpdate, territorioData } = route.params;
	const [descripcion, setDescripcion] = useState(territorioData.descripcion)
	const [numViviendas, setNumViviendas] = useState(territorioData.numViviendas.toString())
	const [barrio, setBarrio] = useState(territorioData.barrio)
	const [tipo, setTipo] = useState(territorioData.negocios ? 'negocios' : 'normal')
	const [activo, setActivo] = useState(territorioData.activo ? 'true' : 'false')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')
	const [enlace, setEnlace] = useState(territorioData.enlace);
	const [imagen, setImagen] = useState<ImagePickerResponse | 'delete'>();
	const [guardado, setGuardado] = useState(false);
	const navigation = useNavigation();

	useEffect(() => navigation.addListener('beforeRemove', (e) => {
		if (guardado) {
			return;
		}

		e.preventDefault();

		Alert.alert(
			'¿Estás seguro de que quieres cancelar la edición?',
			'No se guardará ningún cambio.',
			[
				{ text: "No, continuar editando", style: 'cancel', onPress: () => { } },
				{
					text: 'Sí, cancelar edición',
					style: 'destructive',
					onPress: () => navigation.dispatch(e.data.action),
				},
			]
		);
	}), [navigation, guardado]);

	onAuthStateChanged(auth, () => {
		if (auth === null) {
			// @ts-ignore "NEVER"
			navigation.navigate('Inicio');
		}
	});

	const getBlobFromUri = async (uri: string): Promise<Blob> => {
		const blob: Blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				reject(new TypeError("Network request failed"));
			};
			xhr.responseType = "blob";
			xhr.open("GET", uri, true);
			xhr.send(null);
		});

		return blob;
	};

	const editTerritorioHandler = async () => {
		if (barrio !== '' && tipo !== '' && activo !== '') {
			setLoading(true);
			setMsg('')
			try {
				const newTerritorioData: territorioInterface = {
					numero: territorioData.numero,
					activo: activo === 'true',
					barrio,
					descripcion,
					negocios: tipo === 'negocios',
					numViviendas,
					enlace,
					uid: auth.currentUser?.uid || ''
				};
				if (imagen) {
					if (imagen !== 'delete' && imagen.assets) {
						const uri: string = imagen.assets[0].uri || '';
						const imgStorageRef = ref(storage, imagen.assets[0].fileName);
						const imageBlob = await getBlobFromUri(uri);
						await uploadBytes(imgStorageRef, imageBlob, { customMetadata: { terID: territorioData.id } });
						const url = await getDownloadURL(imgStorageRef);
						newTerritorioData.img = { path: imgStorageRef.fullPath, url };
					}
					if (territorioData.img && (imagen === 'delete' || (imagen.assets && territorioData.img.path !== imagen.assets[0].fileName))) {
						const imgStorageRef = ref(storage, territorioData.img.path);
						await updateDoc(doc(db, "territorios", territorioData.id), {
							img: deleteField()
						});
						await deleteObject(imgStorageRef);
					}
				}
				// @ts-ignore "STRING"
				await updateDoc(doc(db, "territorios", territorioData.id), newTerritorioData);
				setLoading(false);
				setGuardado(true);
				setUpdate(update + 1)
				navigation.goBack();
			} catch (error) {
				setGuardado(false);
				console.log(error)
			}
		} else {
			setMsg('¡Faltan datos!')
		}
	};

	return (
		<View style={[globalCSS.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView>
				<View style={globalCSS.contenido}>
					<Text style={globalCSS.subtitulo}>Editando Territorio Número {territorioData.numero}</Text>
					<TextInput
						label="Barrio *"
						value={barrio}
						style={globalCSS.input}
						mode='outlined'
						onChangeText={text => setBarrio(text)}
					/>
					<TextInput
						label="Enlace"
						value={enlace}
						style={globalCSS.input}
						mode='outlined'
						onChangeText={text => setEnlace(text)}
					/>
					<TextInput
						label="Descripción"
						value={descripcion}
						style={globalCSS.input}
						mode='outlined'
						numberOfLines={7}
						multiline
						onChangeText={text => setDescripcion(text)}
					/>
					<TextInput
						label="Número de Viviendas"
						value={numViviendas}
						style={globalCSS.input}
						keyboardType='numeric'
						mode='outlined'
						onChangeText={text => setNumViviendas(text.replace(/[^0-9]/g, ''))}
					/>
					<View style={{ ...((imagen && imagen !== 'delete' && imagen?.assets) || (territorioData.img?.url && imagen !== 'delete')) && { flexDirection: 'row', width: '100%', justifyContent: 'space-between' } }}>
						{((imagen && imagen !== 'delete' && imagen?.assets) || (territorioData.img?.url && imagen !== 'delete'))
							?
							<Button
								style={[globalCSS.boton, { borderRadius: 0, marginBottom: 15, width: '48%' }]}
								icon=""
								buttonColor={theme.colors.error}
								mode="contained"
								compact
								onPress={() => {
									if (territorioData.img && !imagen) {
										Alert.alert(
											'¿Estás seguro de que quieres eliminar la imagen que está subida?',
											'Solo podrás recuperarla si cancelas la edición del territorio.',
											[
												{ text: "No, cancelar", style: 'cancel' },
												{
													text: 'Sí, eliminar',
													style: 'destructive',
													onPress: () => setImagen('delete'),
												},
											]
										);
									} else {
										setImagen('delete');
									}
								}}
							>
								<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Borrar Imagen</Text>
							</Button>
							: <></>
						}
						<Button
							style={[globalCSS.boton, { borderRadius: 0, marginBottom: 15, ...((imagen && imagen !== 'delete' && imagen?.assets) || (territorioData.img?.url && imagen !== 'delete')) ? { width: '48%' } : { width: '100%' } }]}
							icon=""
							buttonColor={theme.colors.secondary}
							mode="contained"
							compact
							onPress={() => {
								launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.5 }, async (img) => {
									if (territorioData.img && !imagen) {
										Alert.alert(
											'¿Estás seguro de que quieres cambiar la imagen que está subida?',
											'Solo podrás recuperarla si cancelas la edición del territorio.',
											[
												{ text: "No, cancelar", style: 'cancel' },
												{
													text: 'Sí, cambiar',
													style: 'destructive',
													onPress: () => setImagen(img),
												},
											]
										);
									} else {
										setImagen(img);
									}
								});
							}}
						>
							<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>
								{(imagen && imagen !== 'delete' && (imagen?.assets || territorioData.img?.url)) ? 'Cambiar' : 'Añadir'} Imagen
							</Text>
						</Button>
					</View>

					{((imagen && imagen !== 'delete' && imagen.assets) || (territorioData.img?.url && imagen !== 'delete'))
						? (
							<Image
								style={{ width: '100%', height: 230, borderRadius: 15 }}
								source={{ uri: (imagen?.assets) ? imagen.assets[0].uri : territorioData.img?.url }}
							/>
						)
						: (<></>)
					}
					<Text style={[globalCSS.label, { ...(imagen && imagen !== 'delete' && (imagen?.assets || territorioData.img?.url)) && { marginTop: 20 } }]}>Tipo:</Text>
					<SegmentedButtons
						value={tipo}
						onValueChange={setTipo}
						buttons={[
							{
								value: 'normal',
								label: 'Normal',
							},
							{
								value: 'negocios',
								label: 'Negocios',
							},
						]}
						style={{ marginBottom: 10 }}
					/>
					<Text style={globalCSS.label}>Dado de baja:</Text>
					<SegmentedButtons
						value={activo}
						onValueChange={setActivo}
						buttons={[
							{
								value: 'true',
								label: 'No',
							},
							{
								value: 'false',
								label: 'Sí',
							},
						]}
						style={{ marginBottom: 20 }}
					/>
					{msg !== '' ? (<Text style={{ color: 'darkred', fontSize: 20, textAlign: 'center' }}>{msg}</Text>) : <></>}
					<Text style={{ color: 'darkred', fontSize: 15, textAlign: 'left' }}>* Obligatorio</Text>
					<Button
						style={globalCSS.boton}
						icon=""
						buttonColor={theme.colors.primary}
						mode="contained"
						compact
						onPress={() => editTerritorioHandler()}
					>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Guardar</Text>
					</Button>
					<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
				</View>
			</ScrollView>
		</View>
	);
}

export default EditarTerritorio;