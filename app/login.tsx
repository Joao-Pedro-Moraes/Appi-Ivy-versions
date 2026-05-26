import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../config/firebase";

GoogleSignin.configure({
  webClientId:
    "1098604639434-ejpoqqonadk2iuc7mkq1aq7f2o8e58sc.apps.googleusercontent.com",
});

export default function LoginScreen() {
  const router = useRouter();

  async function entrarComGoogle() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("Google não retornou idToken.");
      }

      const credential = GoogleAuthProvider.credential(idToken);

      const firebaseUser = await signInWithCredential(auth, credential);

      await setDoc(
        doc(db, "usuarios", firebaseUser.user.uid),
        {
          nome: firebaseUser.user.displayName,
          email: firebaseUser.user.email,
          foto: firebaseUser.user.photoURL,
          xp: 1250,
          nivel: 5,
        },
        { merge: true }
      );

      router.replace("/(tabs)");
    } catch (error) {
      console.log("Erro no login Google:", error);
      Alert.alert("Erro", "Não foi possível entrar com o Google.");
    }
  }

  function entrarComoConvidado() {
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="leaf" size={64} color="#388E3C" />

        <Text style={styles.title}>Appi Ivy</Text>

        <Text style={styles.subtitle}>Seja bem-vindo ao Appi Ivy</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={entrarComGoogle}
          activeOpacity={0.8}
        >
          <Ionicons
            name="logo-google"
            size={20}
            color="#FFF"
            style={{ marginRight: 12 }}
          />

          <Text style={styles.buttonText}>Entrar com o Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoButton}
          onPress={entrarComoConvidado}
          activeOpacity={0.8}
        >
          <Ionicons
            name="eye"
            size={20}
            color="#555"
            style={{ marginRight: 12 }}
          />

          <Text style={styles.demoButtonText}>Explorar como Convidado</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2ED",
    justifyContent: "space-between",
    padding: 30,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1B5E20",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: "#4285F4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  demoButton: {
    backgroundColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#CCC",
    marginTop: 12,
  },
  demoButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});