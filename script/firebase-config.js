// --- Importações do Firebase SDK ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


// Importa todas as funções necessárias do Firebase Authentication em uma única linha
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider,     // Para autenticação Google 
    signInWithPopup,        // Para autenticação Google
    onAuthStateChanged,     // Para observar o estado de autenticação do usuário
    sendPasswordResetEmail,
    updateProfile,           // Para atualizar o perfil do usuário (ex: nome)
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"; 


// Importa as funções necessárias do Firebase Realtime Database em uma única linha
import { 
    getDatabase, // Para obter a instância do Realtime Database
    ref,         // Para criar referências a locais no banco de dados
    set          // Para salvar dados no banco de dados
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1ILKkaRw-x091E4oUsZtJpRVg9cQQshE",
    authDomain: "projeto-gamif.firebaseapp.com",
    databaseURL: "https://projeto-gamif-default-rtdb.firebaseio.com",
    projectId: "projeto-gamif",
    storageBucket: "projeto-gamif.firebasestorage.app",
    messagingSenderId: "249783252827",
    appId: "1:249783252827:web:f31c96dcd227368f3ccc7e"
};

// Inicializa o Firebase com as configurações
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// --- Exporte o que quiser usar fora ---
export { 
  app, 
  auth, 
  db, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  ref,
  set,
  signOut
};