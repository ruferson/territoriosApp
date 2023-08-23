import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
	version: {
		position: 'absolute',
		right: 2,
		fontSize: 10,
	},
	contenedor: {
		flex: 1,
	},
	contenido: {
		marginTop: '7%',
		flexDirection: 'column',
		marginHorizontal: '7%',
		flex: 1,
	},
	titulo: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 36,
		fontWeight: 'bold',
	},
	subtitulo: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 26,
		fontWeight: 'bold',
		marginTop: 20
	},
	subSubtitulo: {
		marginBottom: 20,
		fontSize: 19,
		fontWeight: 'bold',
		marginTop: 20
	},
	texto: {
		fontSize: 17,
	},
	label: {
		marginBottom: 10,
		fontSize: 15,
		fontWeight: 'bold',
		marginTop: 5
	},
	input: {
		marginBottom: '4%'
	},
	boton: {
		marginTop: '4%',
		marginBottom: '10%',
		fontSize: 40
	},
	botonDerecha: {
		borderRadius: 50,
		marginTop: '2%',
		marginBottom: '4%',
		width: 55,
		height: 50
	},
	botonTexto: {
		textTransform: 'uppercase',
		fontWeight: 'bold',
	},
	enlace: {
		marginTop: 60,
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 18,
		textTransform: 'uppercase'
	},
	fab: {
		position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 30,
	}
});

export default globalStyles;