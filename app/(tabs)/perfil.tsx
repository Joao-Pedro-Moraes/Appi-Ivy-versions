import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFocusEffect, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { auth, db } from '../../config/firebase';

export default function PerfilScreen() {
  const router = useRouter();

  const [xp, setXp] = useState(1250);
  const [nome, setNome] = useState('Estudante de Solo');

  useFocusEffect(
    useCallback(() => {
      async function carregarPerfil() {
        try {
          const usuario = auth.currentUser;

          if (!usuario) {
            setXp(1250);
            setNome('Convidado');
            return;
          }

          const userRef = doc(db, 'usuarios', usuario.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const dados = userSnap.data();

            setXp(dados.xp || 1250);
            setNome(dados.nome || usuario.displayName || 'Estudante de Solo');
          }
        } catch (error) {
          console.log('Erro ao carregar perfil:', error);
        }
      }

      carregarPerfil();
    }, [])
  );

  async function sairDaConta() {
    try {
      await GoogleSignin.signOut();
      await auth.signOut();

      router.replace('/login');
    } catch (error) {
      console.log('Erro ao sair da conta:', error);

      Alert.alert(
        'Erro',
        'Não foi possível sair da conta.'
      );
    }
  }

  const progresso = Math.min((xp / 2000) * 100, 100);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={50} color="#388E3C" />
        </View>

        <Text style={styles.userName}>{nome}</Text>
        <Text style={styles.userSub}>Nível 5 • Aprendiz Verde</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpTitle}>Meu Progresso</Text>
          <Text style={styles.xpValue}>{xp} / 2.000 XP</Text>
        </View>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progresso}%` }]} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medalhas Desbloqueadas</Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <View style={[styles.badgeIcon, { backgroundColor: '#C8E6C9' }]}>
              <Ionicons name="leaf" size={30} color="#388E3C" />
            </View>

            <Text style={styles.badgeText}>Compostagem</Text>
          </View>

          <View style={styles.badge}>
            <View style={[styles.badgeIcon, { backgroundColor: '#F5F5F5' }]}>
              <Ionicons name="lock-closed" size={30} color="#9E9E9E" />
            </View>

            <Text style={styles.badgeText}>Horta</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={sairDaConta}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9F8' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#FFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1B5E20' },
  userSub: { fontSize: 14, color: '#666' },
  card: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 20, elevation: 2 },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  xpTitle: { fontWeight: 'bold', color: '#444' },
  xpValue: { color: '#388E3C', fontWeight: 'bold' },
  progressBg: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5 },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 5 },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20', marginBottom: 15 },
  badgeRow: { flexDirection: 'row', gap: 20 },
  badge: { alignItems: 'center' },
  badgeIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  badgeText: { fontSize: 12, color: '#666' },
  logoutButton: { margin: 40, alignItems: 'center' },
  logoutText: { color: '#D32F2F', fontWeight: 'bold' },
});