import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, View, useColorScheme } from 'react-native';
import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import { ActivityIndicator, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { auth, db, storage } from '../firebase/firebaseConfig';
import { territorioInterface } from '../interfaces/interfaces';
import globalCSS from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

const AñadirTerritorio = ({ route }: { route: any }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const { update, setUpdate, noExisteTer } = route.params;
	const [numero, setNumero] = useState('')
	const [descripcion, setDescripcion] = useState('')
	const [numViviendas, setNumVivienas] = useState('')
	const [barrio, setBarrio] = useState('')
	const [tipo, setTipo] = useState('normal')
	const [activo, setActivo] = useState('true')
	const [imagen, setImagen] = useState<ImagePickerResponse>();
	const [enlace, setEnlace] = useState('');
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')
	const navigation = useNavigation();

	onAuthStateChanged(auth, (currentUser) => {
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

	const addTerritorioHandler = async () => {
		if (numero !== '' && barrio !== '' && tipo !== '' && activo !== '') {
			if (parseInt(numero) >= 0) {
				if (noExisteTer(numero)) {
					setLoading(true);
					setMsg('')
					try {
						const territorioData: territorioInterface = {
							numero,
							activo: activo === 'true',
							barrio,
							descripcion,
							negocios: tipo === 'negocios',
							numViviendas,
							enlace,
							uid: auth.currentUser?.uid
						}
						if (imagen && imagen.assets) {
							const uri: string = imagen.assets[0].uri || '';
							const imgStorageRef = ref(storage, imagen.assets[0].fileName);
							const imageBlob = await getBlobFromUri(uri)
							await uploadBytes(imgStorageRef, imageBlob, { customMetadata: { terID: numero, uid: auth.currentUser?.uid || '' } });
							const url = await getDownloadURL(imgStorageRef);
							territorioData.img = { path: imgStorageRef.fullPath, url };
						}
						await addDoc(collection(db, "territorios"), territorioData);
						setLoading(false);
						setUpdate()
						navigation.goBack();
					} catch (error) {
						setLoading(false);
						console.log(error)
					}
				} else {
					setLoading(false);
					setMsg('El número de territorio indicado ya está siendo usado.')
				}
			} else {
				setLoading(false);
				setMsg('¡Números incorrectos!')
			}
		} else {
			setLoading(false);
			setMsg('¡Faltan datos!')
		}
	};

	return (
		<View style={[globalCSS.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView>
				<View style={globalCSS.contenido}>
					<Text style={globalCSS.subtitulo}>Nuevo Territorio</Text>
					<TextInput
						label="Número *"
						value={numero}
						keyboardType='numeric'
						style={globalCSS.input}
						mode='outlined'
						onChangeText={text => setNumero(text.replace(/[^0-9]/g, ''))}
					/>
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
						onChangeText={text => setNumVivienas(text.replace(/[^0-9]/g, ''))}
					/>
					<View style={{ ...imagen?.assets && { flexDirection: 'row', width: '100%', justifyContent: 'space-between' } }}>
						{imagen?.assets
							?
							<Button
								style={[globalCSS.boton, { borderRadius: 0, marginBottom: 15, width: '48%' }]}
								icon=""
								buttonColor={theme.colors.error}
								mode="contained"
								compact
								onPress={() => {
									setImagen(undefined);
								}}
							>
								<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Borrar Imagen</Text>
							</Button>
							: <></>
						}
						<Button
							style={[globalCSS.boton, { borderRadius: 0, marginBottom: 15, ...imagen?.assets ? { width: '48%' } : { width: '100%' } }]}
							icon=""
							buttonColor={theme.colors.secondary}
							mode="contained"
							compact
							onPress={() => {
								launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.5 }, async (img) => {
									setImagen(img);
								});
							}}
						>
							<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>{imagen?.assets ? 'Cambiar' : 'Añadir'} Imagen</Text>
						</Button>
					</View>

					{imagen?.assets
						? (
							<Image
								style={{ width: '100%', height: 230, borderRadius: 5 }}
								source={{ uri: imagen.assets[0].uri }}
							/>
						)
						: (<></>)
					}
					<Text style={[globalCSS.label, { ...imagen?.assets && { marginTop: 20 } }]}>Tipo:</Text>
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
						disabled={loading}
						style={[globalCSS.boton, { marginTop: 30 }]}
						icon=""
						buttonColor={theme.colors.primary}
						mode="contained"
						compact
						onPress={() => {
							Alert.alert(
								`¿Estás seguro de que quieres crear el territorio?`,
								'Asegúrate de que los datos estén correctos.',
								[
									{ text: "No, seguir editando", style: 'cancel' },
									{
										text: 'Sí, crear',
										style: 'destructive',
										onPress: () => addTerritorioHandler(),
									},
								]
							);
						}}
					>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Guardar</Text>
					</Button>
					<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
				</View>
			</ScrollView>
		</View>
	);
}

export default AñadirTerritorio;