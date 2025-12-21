import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

// ===== QUESTIONS =====
export const addQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(collection(db, "questions"), {
      ...questionData,
      createdAt: serverTimestamp(),
      votesOptionA: 0,
      votesOptionB: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

export const getQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "questions"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting questions:", error);
    throw error;
  }
};

export const getQuestionsByCategory = async (category) => {
  try {
    const q = query(collection(db, "questions"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting questions by category:", error);
    throw error;
  }
};

export const getQuestion = async (questionId) => {
  try {
    const docRef = doc(db, "questions", questionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting question:", error);
    throw error;
  }
};

export const updateQuestion = async (questionId, data) => {
  try {
    const docRef = doc(db, "questions", questionId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    await deleteDoc(doc(db, "questions", questionId));
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

// ===== VOTES =====
export const addVote = async (userId, questionId, choice) => {
  try {
    // Проверяем, голосовал ли пользователь
    const q = query(
      collection(db, "votes"),
      where("userId", "==", userId),
      where("questionId", "==", questionId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Пользователь уже голосовал
      return { success: false, message: "Вы уже голосовали" };
    }

    // Добавляем голос
    await addDoc(collection(db, "votes"), {
      userId,
      questionId,
      choice, // 'A' или 'B'
      timestamp: serverTimestamp(),
    });

    // Обновляем счётчик голосов
    const questionRef = doc(db, "questions", questionId);
    const field = choice === "A" ? "votesOptionA" : "votesOptionB";
    await updateDoc(questionRef, {
      [field]: increment(1),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding vote:", error);
    throw error;
  }
};

export const getVotesByQuestion = async (questionId) => {
  try {
    const q = query(collection(db, "votes"), where("questionId", "==", questionId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting votes:", error);
    throw error;
  }
};

// ===== USERS =====
export const addUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        telegramId: userId,
        createdAt: serverTimestamp(),
      });
    }

    return userId;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// ===== CATEGORIES =====
const DEFAULT_CATEGORIES = [
  { id: "life", name: "Жизнь", emoji: "🌿" },
  { id: "money", name: "Деньги", emoji: "💰" },
  { id: "work", name: "Работа", emoji: "💼" },
  { id: "relationships", name: "Отношения", emoji: "💑" },
  { id: "tech", name: "Технологии", emoji: "🔧" },
  { id: "opinions", name: "Мнения / Споры", emoji: "🤔" },
  { id: "future", name: "Будущее", emoji: "🚀" },
  { id: "personality", name: "Личность", emoji: "👤" },
];

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    if (querySnapshot.empty) {
      // Если нет категорий в БД, возвращаем дефолтные
      return DEFAULT_CATEGORIES;
    }
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting categories:", error);
    return DEFAULT_CATEGORIES; // Вернуть дефолтные если ошибка
  }
};

export const initializeCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));

    // Если категории уже существуют, не создавать их снова
    if (!querySnapshot.empty) {
      console.log("Categories already exist");
      return;
    }

    // Создаем все дефолтные категории
    for (const category of DEFAULT_CATEGORIES) {
      await setDoc(doc(db, "categories", category.id), {
        name: category.name,
        emoji: category.emoji,
        createdAt: serverTimestamp(),
        questionsCount: 0,
      });
    }
    console.log("✅ Categories initialized successfully");
  } catch (error) {
    console.error("Error initializing categories:", error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      ...categoryData,
      createdAt: serverTimestamp(),
      questionsCount: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
