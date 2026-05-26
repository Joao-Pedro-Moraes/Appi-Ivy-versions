import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Esqueleto de Cores (Fácil de alterar quando o Figma chegar)
const COLORS = {
  primary: '#007AFF', // Cor do botão
  background: '#FFFFFF',
  text: '#000000',
  inputBorder: '#ccc',
  placeholder: '#888'
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (email === 'admin' && password === '123') {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Erro', 'Usuário ou senha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={COLORS.placeholder}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={COLORS.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* TouchableOpacity é melhor para design do que Button, pois aceita estilos de borda, cor e raio */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: COLORS.background 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center', 
    color: COLORS.text 
  },
  input: { 
    borderWidth: 1, 
    borderColor: COLORS.inputBorder, 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 8,
    color: COLORS.text
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});