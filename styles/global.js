import { StyleSheet } from 'react-native';
import colors from './colors';

const globalStyles = StyleSheet.create({
	version: {
		position: 'absolute',
    left: 5,
    bottom: 5,
	},
	contenedor: {
		flex: 1,
		backgroundColor: colors.light.basic,
	},
	contenido: {
		marginTop: '11%',
		flexDirection: 'column',
		marginHorizontal: '7%',
		flex: 1,
	},
	titulo: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 36,
		fontWeight: 'bold',
		color: colors.light.text
	},
	subtitulo: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 26,
		fontWeight: 'bold',
		color: colors.light.textLow,
		marginTop: 20
	},
	subSubtitulo: {
		marginBottom: 20,
		fontSize: 19,
		fontWeight: 'bold',
		color: colors.light.textLow,
		marginTop: 20
	},
	texto: {
		fontSize: 17,
		color: colors.light.textLow,
	},
	label: {
		marginBottom: 10,
		fontSize: 15,
		fontWeight: 'bold',
		color: colors.light.textLow,
		marginTop: 5
	},
	input: {
		color: colors.light.text,
		marginBottom: '4%'
	},
	boton: {
		marginTop: '4%',
		marginBottom: '10%',
		fontSize: 40
	},
	botonTexto: {
		textTransform: 'uppercase',
		fontWeight: 'bold',
		color: colors.light.text,
	},
	enlace: {
		color: colors.light.text,
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