import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { auth, db } from '../../config/firebase';

const DATA = [
  { id: '1', titulo: 'Compostagem Orgânica', xp: '100', status: 'COMPLETED', cor: '#4CAF50', icon: 'leaf' },
  { id: '2', titulo: 'Rotação de Culturas', xp: '150', status: 'IN PROGRESS', cor: '#FF9800', icon: 'refresh' },
  { id: '3', titulo: 'Cobertura Morta', xp: '120', status: 'LOCKED', cor: '#795548', icon: 'layers' },
  { id: '4', titulo: 'Adubação Verde', xp: '200', status: 'LOCKED', cor: '#2196F3', icon: 'water' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [xp, setXp] = useState(1250);

  useFocusEffect(
    useCallback(() => {
      async function carregarXp() {
        try {
          const usuario = auth.currentUser;

          if (!usuario) {
            setXp(1250);
            return;
          }

          const userRef = doc(db, 'usuarios', usuario.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setXp(userSnap.data().xp || 1250);
          } else {
            setXp(1250);
          }
        } catch (error) {
          console.log('Erro ao carregar XP:', error);
          setXp(1250);
        }
      }

      carregarXp();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => {
    const isLocked = item.status === 'LOCKED';

    return (
      <TouchableOpacity
        style={[styles.card, isLocked && styles.cardLocked]}
        activeOpacity={isLocked ? 1 : 0.7}
        onPress={() => {
          if (isLocked) {
            Alert.alert(
              'Conteúdo Bloqueado',
              'Para acessar este módulo você deve concluir as atividades anteriores do seu plano de aprendizado.',
              [{ text: 'OK' }]
            );
          } else {
            router.push(`/detalhes/${item.id}` as any);
          }
        }}
      >
        <View style={styles.cardHeader}>
          <Ionicons
            name={isLocked ? 'lock-closed' : item.icon}
            size={22}
            color={isLocked ? '#999' : item.cor}
          />

          <Text style={styles.cardXP}>+{item.xp} XP</Text>
        </View>

        <Text style={[styles.cardTitle, isLocked && { color: '#999' }]}>
          {item.titulo}
        </Text>

        <View style={styles.statusContainer}>
          {item.status === 'COMPLETED' ? (
            <>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={[styles.statusText, { color: '#4CAF50' }]}>
                COMPLETED
              </Text>
            </>
          ) : item.status === 'IN PROGRESS' ? (
            <>
              <Ionicons name="play-circle" size={16} color="#FF9800" />
              <Text style={[styles.statusText, { color: '#FF9800' }]}>
                IN PROGRESS
              </Text>
            </>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="lock-closed" size={14} color="#999" />
              <Text style={[styles.statusText, { color: '#999' }]}>
                LOCKED
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.levelBanner}>
        <View>
          <Text style={styles.levelTitle}>Nível 5: Mestre da Terra</Text>
          <Text style={styles.levelXP}>{xp} / 2.000 XP</Text>
        </View>

        <Ionicons name="trophy" size={36} color="#FFD700" />
      </View>

      <Text style={styles.sectionTitle}>Objetivos de Aprendizado</Text>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDF2ED' },
  levelBanner: {
    backgroundColor: '#388E3C',
    margin: 20,
    marginTop: 40,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  levelTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  levelXP: { color: '#FFF', fontSize: 13, opacity: 0.8 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1B5E20', marginLeft: 20, marginBottom: 15 },
  listContent: { paddingHorizontal: 15, paddingBottom: 30 },
  row: { justifyContent: 'space-between' },
  card: {
    backgroundColor: '#FFF',
    width: '48%',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    height: 140,
    justifyContent: 'space-between',
    elevation: 3,
  },
  cardLocked: {
    backgroundColor: '#F5F5F5',
    elevation: 0,
    opacity: 0.8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardXP: { fontSize: 11, fontWeight: 'bold', color: '#777' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 10 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  statusText: { fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
});