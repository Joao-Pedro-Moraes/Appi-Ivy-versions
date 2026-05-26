import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CONTEUDO_SOLO = {
  '1': {
    titulo: 'Compostagem Orgânica',
    xp: 100,
    texto:
      'A compostagem transforma restos de alimentos em adubo rico para o solo.',
    passos: [
      'Junte restos de frutas',
      'Misture com folhas secas',
      'Mantenha úmido',
    ],
  },

  '2': {
    titulo: 'Rotação de Culturas',
    xp: 150,
    texto:
      'Plantar diferentes espécies evita o esgotamento de nutrientes do solo.',
    passos: [
      'Divida o canteiro',
      'Alterne leguminosas',
      'Planeje o próximo ciclo',
    ],
  },
};

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams();

  const [estaFalando, setEstaFalando] = useState(false);

  const info = CONTEUDO_SOLO[id as keyof typeof CONTEUDO_SOLO];

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  if (!info) {
    return (
      <View style={styles.container}>
        <Text>Conteúdo não encontrado para o ID: {id}</Text>
      </View>
    );
  }

  const alternarVoz = () => {
    if (estaFalando) {
      Speech.stop();
      setEstaFalando(false);
    } else {
      setEstaFalando(true);

      const passosTexto = info.passos.join('. ');

      const textoCompleto = `
        ${info.titulo}. 
        ${info.texto}. 
        Passos para praticar: ${passosTexto}
      `;

      Speech.speak(textoCompleto, {
        language: 'pt-BR',
        rate: 1.0,

        onDone: () => {
          setEstaFalando(false);
        },

        onError: () => {
          setEstaFalando(false);
        },
      });
    }
  };

  async function concluirAtividade() {
  try {
    const usuario = auth.currentUser;

    if (!usuario) {
      Alert.alert(
        'Erro',
        'Nenhum usuário autenticado.'
      );
      return;
    }

    const usuarioId = usuario.uid;

    const userRef = doc(db, 'usuarios', usuarioId);

    const userSnap = await getDoc(userRef);

    let xpAtual = 1250;

    if (userSnap.exists()) {
      xpAtual = userSnap.data().xp || 1250;
    }

    const novoXp = xpAtual + info.xp;

    await setDoc(
      userRef,
      {
        nome: usuario.displayName,
        email: usuario.email,
        foto: usuario.photoURL,

        xp: novoXp,
        nivel: 5,
        ultimoModulo: info.titulo,
        atualizadoEm: new Date(),
      },
      { merge: true }
    );

    Alert.alert(
      'Parabéns!',
      `Você ganhou +${info.xp} XP\nXP atual: ${novoXp}`
    );
  } catch (error) {
    Alert.alert(
      'Erro Firebase',
      String(error)
    );

    console.log('Erro Firebase:', error);
  }
}

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: info.titulo,
          headerTintColor: '#2E7D32',
        }}
      />

      <View style={styles.headerImage}>
        <Ionicons
          name="leaf"
          size={60}
          color="#81C784"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>
          {info.titulo}
        </Text>

        <Text style={styles.xpText}>
          +{info.xp} XP de Aprendizado
        </Text>

        <TouchableOpacity
          style={[
            styles.audioButton,
            estaFalando && styles.audioButtonAtivo,
          ]}
          onPress={alternarVoz}
          activeOpacity={0.8}
        >
          <Ionicons
            name={
              estaFalando
                ? 'stop-circle'
                : 'volume-medium'
            }
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.audioButtonText}>
            {estaFalando
              ? 'Parar Leitura'
              : 'Ouvir Texto Explicativo'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.description}>
          {info.texto}
        </Text>

        <Text style={styles.sectionTitle}>
          Passos para Praticar:
        </Text>

        {info.passos.map((passo, index) => (
          <View
            key={index}
            style={styles.stepItem}
          >
            <View style={styles.stepDot} />

            <Text style={styles.stepText}>
              {passo}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={concluirAtividade}
        >
          <Text style={styles.buttonText}>
            Concluir e Ganhar XP
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerImage: {
    height: 180,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  body: {
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B5E20',
  },

  xpText: {
    color: '#FF9800',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15,
  },

  audioButton: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },

  audioButtonAtivo: {
    backgroundColor: '#C62828',
  },

  audioButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    lineHeight: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },

  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#388E3C',
    marginRight: 10,
  },

  stepText: {
    fontSize: 15,
    color: '#333',
  },

  button: {
    backgroundColor: '#388E3C',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});