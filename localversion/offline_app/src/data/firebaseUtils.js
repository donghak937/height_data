import { loadCharacters, addCharacter, editCharacter, deleteCharacter, saveCharacters, sampleCharacters } from './sampleCharacters';

let subscribers = [];

function notifySubscribers() {
    const chars = loadCharacters();
    // createdAt 순으로 유지
    const sortedChars = chars.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    subscribers.forEach(callback => callback(sortedChars));
}

export const subscribeCharacters = (callback) => {
    subscribers.push(callback);
    const chars = loadCharacters();
    const sortedChars = chars.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    callback(sortedChars);
    return () => {
        subscribers = subscribers.filter(cb => cb !== callback);
    };
};

export const initializeDataIfNeeded = async () => {
    // loadCharacters() 함수가 내부적으로 초기화 로직을 수행합니다.
};

export const addCharacterDB = async (character) => {
    const newChar = { ...character, createdAt: Date.now() };
    addCharacter(newChar);
    notifySubscribers();
};

export const updateCharacterDB = async (id, updates) => {
    editCharacter(id, updates);
    notifySubscribers();
};

export const deleteCharacterDB = async (id) => {
    deleteCharacter(id);
    notifySubscribers();
};

export const resetData = async () => {
    if (!confirm("정말 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    saveCharacters(sampleCharacters);
    notifySubscribers();
    alert("데이터가 초기화되었습니다.");
};
