import { getRandomHue, getRandomSaturation } from '../utils/koreanSearch';

// 샘플 캐릭터 데이터 - gender 명확히 설정
export const sampleCharacters = [
    { id: 1, name: '윤승빈', height: 186, gender: 'male', school: '나들목고등학교', hue: 0, saturation: 1.0 },
    { id: 2, name: '박준성', height: 173, gender: 'male', school: '나들목고등학교', hue: 30, saturation: 1.0 },
    { id: 3, name: '목솔', height: 188, gender: 'male', school: '나들목고등학교', hue: 60, saturation: 1.0 },
    { id: 4, name: '원승제', height: 163, gender: 'male', school: '나들목고등학교', hue: 90, saturation: 1.0 },
    { id: 5, name: '조지현', height: 167, gender: 'male', school: '나들목고등학교', hue: 120, saturation: 1.0 },
    { id: 6, name: '조민준', height: 165, gender: 'male', school: '나들목고등학교', hue: 150, saturation: 1.0 },
    { id: 7, name: '오기택', height: 174, gender: 'male', school: '나들목고등학교', hue: 180, saturation: 1.0 },
    { id: 8, name: '정동현', height: 177, gender: 'male', school: '나들목고등학교', hue: 210, saturation: 1.0 },
    { id: 9, name: '김원태', height: 181, gender: 'male', school: '나들목고등학교', hue: 240, saturation: 1.0 },
    { id: 10, name: '정군', height: 175, gender: 'male', school: '나들목고등학교', hue: 270, saturation: 1.0 },
    { id: 11, name: '이용환', height: 176, gender: 'male', school: '나들목고등학교', hue: 300, saturation: 1.0 },
    { id: 12, name: '심혁준', height: 171, gender: 'male', school: '나들목고등학교', hue: 330, saturation: 1.0 },
    { id: 13, name: '고규혁', height: 170, gender: 'male', school: '나들목고등학교', hue: 15, saturation: 1.0 },
    { id: 14, name: '오희민', height: 161, gender: 'female', school: '나들목고등학교', hue: 320, saturation: 1.2 },
    { id: 15, name: '고아영', height: 169, gender: 'female', school: '나들목고등학교', hue: 340, saturation: 1.1 },
    { id: 16, name: '조하랑', height: 158, gender: 'female', school: '나들목고등학교', hue: 310, saturation: 1.2 },
    { id: 17, name: '김채영', height: 173, gender: 'female', school: '나들목고등학교', hue: 350, saturation: 1.1 }
];

const STORAGE_KEY = 'character_height_data_v2';

export function loadCharacters() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('로드 실패:', error);
    }
    saveCharacters(sampleCharacters);
    return sampleCharacters;
}

export function saveCharacters(characters) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
        console.error('저장 실패:', error);
    }
}

export function addCharacter(character) {
    const characters = loadCharacters();
    const newCharacter = {
        id: Date.now(),
        ...character,
        gender: character.gender || 'male',
        school: character.school || '나들목고등학교',
        hue: getRandomHue(),
        saturation: getRandomSaturation()
    };
    const updated = [...characters, newCharacter];
    saveCharacters(updated);
    return updated;
}

export function deleteCharacter(id) {
    const characters = loadCharacters();
    const updated = characters.filter(c => c.id !== id);
    saveCharacters(updated);
    return updated;
}

export function editCharacter(id, updates) {
    const characters = loadCharacters();
    const updated = characters.map(c => c.id === id ? { ...c, ...updates } : c);
    saveCharacters(updated);
    return updated;
}
