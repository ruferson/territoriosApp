import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Image, ScrollView, View, useColorScheme } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { auth, db, storage } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import { onAuthStateChanged } from 'firebase/auth';
import { territorioInterface } from '../interfaces/interfaces';
import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const EditTerritorio = ({ route }: { route: any }) => {
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
	const [image, setImage] = useState<ImagePickerResponse | 'delete'>();
	const [reserveImage, setReserveImage] = useState<ImagePickerResponse>();
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
			navigation.navigate('Home');
		}
	});

	const getBlobFromUri = async (uri: string): Blob => {
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
	console.log(territorioData.img)

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
					uid: auth.currentUser?.uid
				}
				if (image) {
					console.log(image, territorioData.img)
					if (image !== 'delete') {
						const uri: string = image.assets[0].uri || '';
						const imgStorageRef = ref(storage, image.assets[0].fileName);
						const imageBlob = await getBlobFromUri(uri);
						await uploadBytes(imgStorageRef, imageBlob, { customMetadata: { terID: territorioData.id } });
						const url = await getDownloadURL(imgStorageRef);
						newTerritorioData.img = { path: imgStorageRef.fullPath, url };
					}
					if (territorioData.img && (image === 'delete' || territorioData.img.path !== image.assets[0].fileName)) {
						console.log(territorioData.img.path)
						const imgStorageRef = ref(storage, territorioData.img.path);
						await deleteObject(imgStorageRef);
					}
				}
				await setDoc(doc(db, "territorios", territorioData.numero), newTerritorioData);
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
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView>
				<View style={globalStyles.contenido}>
					<Text style={globalStyles.subtitulo}>Editando Territorio Número {territorioData.id}</Text>
					<TextInput
						label="Barrio *"
						value={barrio}
						style={globalStyles.input}
						mode='outlined'
						onChangeText={text => setBarrio(text)}
					/>
					<TextInput
						label="Descripción"
						value={descripcion}
						style={globalStyles.input}
						mode='outlined'
						numberOfLines={7}
						multiline
						onChangeText={text => setDescripcion(text)}
					/>
					<TextInput
						label="Número de Viviendas"
						value={numViviendas}
						style={globalStyles.input}
						keyboardType='numeric'
						mode='outlined'
						onChangeText={text => setNumViviendas(text.replace(/[^0-9]/g, ''))}
					/>
					<View style={{ ...((image?.assets || territorioData.img?.url) && image !== 'delete') && { flexDirection: 'row', width: '100%', justifyContent: 'space-between' } }}>
						{((image?.assets || territorioData.img?.url) && image !== 'delete')
							?
							<Button
								style={[globalStyles.boton, { borderRadius: 0, marginBottom: 15, width: '48%' }]}
								icon=""
								buttonColor={theme.colors.error}
								mode="contained"
								compact
								onPress={() => {
									if (territorioData.img && !image) {
										Alert.alert(
											'¿Estás seguro de que quieres eliminar la imagen que está subida?',
											'Solo podrás recuperarla si cancelas la edición del territorio.',
											[
												{ text: "No, cancelar", style: 'cancel' },
												{
													text: 'Sí, eliminar',
													style: 'destructive',
													onPress: () => setImage('delete'),
												},
											]
										);
									} else {
										setImage('delete');
									}
								}}
							>
								<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Borrar Imagen</Text>
							</Button>
							: <></>
						}
						<Button
							style={[globalStyles.boton, { borderRadius: 0, marginBottom: 15, ...((image?.assets || territorioData.img?.url) && image !== 'delete') ? { width: '48%' } : { width: '100%' } }]}
							icon=""
							buttonColor={theme.colors.secondary}
							mode="contained"
							compact
							onPress={() => {
								launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.5 }, async (img) => {
									if (territorioData.img && !image) {
										Alert.alert(
											'¿Estás seguro de que quieres cambiar la imagen que está subida?',
											'Solo podrás recuperarla si cancelas la edición del territorio.',
											[
												{ text: "No, cancelar", style: 'cancel' },
												{
													text: 'Sí, cambiar',
													style: 'destructive',
													onPress: () => setImage(img),
												},
											]
										);
									} else {
										setImage(img);
									}
								});
							}}
						>
							<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>
								{((image?.assets || territorioData.img?.url) && image !== 'delete') ? 'Cambiar' : 'Añadir'} Imagen
							</Text>
						</Button>
					</View>

					{((image?.assets || territorioData.img?.url) && image !== 'delete')
						? (
							<Image
								style={{ width: '100%', height: 230, borderRadius: 5 }}
								source={{ uri: image?.assets[0].uri || territorioData.img?.url }}
							/>
						)
						: (<></>)
					}
					<Text style={[globalStyles.label, { ...((image?.assets || territorioData.img?.url) && image !== 'delete') && { marginTop: 20 } }]}>Tipo:</Text>
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
					<Text style={globalStyles.label}>Dado de baja:</Text>
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
						style={globalStyles.boton}
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

export default EditTerritorio;