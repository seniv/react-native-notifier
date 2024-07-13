import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const s = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: '#007BFF',
    padding: 15,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

interface ButtonTypes {
  title: string;
  onPress: any;
}

const Button = ({ title, onPress }: ButtonTypes) => (
  <TouchableOpacity style={s.button} onPress={onPress}>
    <Text style={s.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default Button;
