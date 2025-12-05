import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDocs, writeBatch } from 'firebase/firestore';
import { sampleCharacters } from './sampleCharacters';

const COLLECTION_NAME = 'characters';

export const subscribeCharacters = (callback) => {
    // createdAt으로 정렬
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const chars = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id // Firestore Document ID를 React key/id로 사용
        }));
        callback(chars);
    });
};

let isInitializing = false;

export const initializeDataIfNeeded = async () => {
    if (isInitializing) return;

    try {
        isInitializing = true;
        const colRef = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(colRef);
        if (snapshot.empty) {
            console.log("DB가 비어있어 데이터를 초기화합니다...");
            const batch = writeBatch(db);
            // 약 20개 미만이므로 batch 하나로 충분 (limit 500)
            sampleCharacters.forEach((char, index) => {
                const docRef = doc(colRef);
                // 기존 id(숫자)는 버리고, 순서 유지를 위해 index 기반 createdAt 흉내
                const { id, ...data } = char;
                batch.set(docRef, { ...data, createdAt: Date.now() + index });
            });
            await batch.commit();
            console.log("데이터 초기화 완료!");
            alert("기본 데이터가 데이터베이스에 업로드되었습니다!");
        }
    } catch (error) {
        console.error("Firebase 초기화 에러:", error);
        alert("데이터베이스 연결 오류!\nFirebase 콘솔에서 '규칙(Rules)' 탭을 확인해주세요.\n\n에러 내용: " + error.message);
    } finally {
        isInitializing = false;
    }
};

export const addCharacterDB = async (character) => {
    await addDoc(collection(db, COLLECTION_NAME), {
        ...character,
        createdAt: Date.now()
    });
};

export const updateCharacterDB = async (id, updates) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
};

export const deleteCharacterDB = async (id) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
};

export const resetData = async () => {
    if (!confirm("정말 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;

    try {
        const colRef = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(colRef);
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log("모든 데이터 삭제 완료");

        // 초기화 플래그 리셋 후 다시 초기화
        isInitializing = false;
        await initializeDataIfNeeded();
        alert("데이터가 초기화되었습니다.");
    } catch (error) {
        console.error("데이터 초기화 실패:", error);
        alert("초기화 실패: " + error.message);
    }
};
