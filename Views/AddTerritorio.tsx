import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, View, useColorScheme, Image, Platform } from 'react-native';
import { ActivityIndicator, Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { auth, db, storage } from '../firebase/firebaseConfig';
import globalStyles from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { territorioInterface } from '../interfaces/interfaces';

const AddTerritorio = ({ route }: { route: any }) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
	const { update, setUpdate, noExisteTer } = route.params;
	const [numero, setNumero] = useState('')
	const [descripcion, setDescripcion] = useState('')
	const [numViviendas, setNumVivienas] = useState('')
	const [barrio, setBarrio] = useState('')
	const [tipo, setTipo] = useState('normal')
	const [activo, setActivo] = useState('true')
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState('')
	const navigation = useNavigation();
	const [image, setImage] = useState<ImagePickerResponse>();

	onAuthStateChanged(auth, (currentUser) => {
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

	const addTerritorioHandler = async () => {
		if (numero !== '' && barrio !== '' && tipo !== '' && activo !== '') {
			if (parseInt(numero) >= 0) {
				if (noExisteTer(numero)) {
					setLoading(true);
					setMsg('')
					try {
						const territorioData: territorioInterface = {
							activo: activo === 'true',
							barrio,
							descripcion,
							negocios: tipo === 'negocios',
							numViviendas,
							uid: auth.currentUser?.uid
						}
						if (image) {
							const uri: string = image.assets[0].uri || '';
							const imgStorageRef = ref(storage, image.assets[0].fileName);
							const imageBlob = await getBlobFromUri(uri)
							await uploadBytes(imgStorageRef, imageBlob, { customMetadata: { terID: numero, uid: auth.currentUser?.uid || '' } });
							const url = await getDownloadURL(imgStorageRef);
							territorioData.img = {path: imgStorageRef.fullPath, url};
						}
						await setDoc(doc(db, "territorios", numero), territorioData);
						setLoading(false);
						setUpdate()
						navigation.goBack();
					} catch (error) {
						console.log(error)
					}
				} else {
					setMsg('El número de territorio indicado ya está siendo usado.')
				}
			} else {
				setMsg('¡Números incorrectos!')
			}
		} else {
			setMsg('¡Faltan datos!')
		}
	};

	return (
		<View style={[globalStyles.contenedor, { backgroundColor: theme.colors.background }]}>
			<ScrollView>
				<View style={globalStyles.contenido}>
					<Text style={globalStyles.subtitulo}>Nuevo Territorio</Text>
					<TextInput
						label="Número *"
						value={numero}
						keyboardType='numeric'
						style={globalStyles.input}
						mode='outlined'
						onChangeText={text => setNumero(text.replace(/[^0-9]/g, ''))}
					/>
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
						onChangeText={text => setNumVivienas(text.replace(/[^0-9]/g, ''))}
					/>
					<View style={{ ...image?.assets && { flexDirection: 'row', width: '100%', justifyContent: 'space-between' } }}>
						{image?.assets
							?
							<Button
								style={[globalStyles.boton, { borderRadius: 0, marginBottom: 15, width: '48%' }]}
								icon=""
								buttonColor={theme.colors.error}
								mode="contained"
								compact
								onPress={() => {
									setImage(undefined);
								}}
							>
								<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Borrar Imagen</Text>
							</Button>
							: <></>
						}
						<Button
							style={[globalStyles.boton, { borderRadius: 0, marginBottom: 15, ...image?.assets ? { width: '48%' } : { width: '100%' } }]}
							icon=""
							buttonColor={theme.colors.secondary}
							mode="contained"
							compact
							onPress={() => {
								launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.5 }, async (img) => {
									setImage(img);
								});
							}}
						>
							<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>{image?.assets ? 'Cambiar' : 'Añadir'} Imagen</Text>
						</Button>
					</View>

					{image?.assets
						? (
							<Image
								style={{ width: '100%', height: 230, borderRadius: 5 }}
								source={{ uri: image.assets[0].uri }}
							/>
						)
						: (<></>)
					}
					<Text style={[globalStyles.label, { ...image?.assets && { marginTop: 20 } }]}>Tipo:</Text>
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
						disabled={loading}
						style={[globalStyles.boton, { marginTop: 30 }]}
						icon=""
						buttonColor={theme.colors.primary}
						mode="contained"
						compact
						onPress={() => addTerritorioHandler()}
					>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 4 }}>Guardar</Text>
					</Button>
					<ActivityIndicator style={{ marginTop: '7%' }} animating={loading} color={theme.colors.primary} />
				</View>
			</ScrollView>
		</View>
	);
}

export default AddTerritorio;