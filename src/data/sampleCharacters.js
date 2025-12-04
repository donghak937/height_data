import { getRandomHue, getRandomSaturation } from '../utils/koreanSearch';

// 샘플 캐릭터 데이터
export const sampleCharacters = [
    {
        id: 1,
        name: '고등어',
        height: 165,
        gender: 'female',
        hue: 330,
        saturation: 1.0
    },
    {
        id: 2,
        name: '이주아',
        height: 158,
        gender: 'female',
        hue: 320,
        saturation: 1.2
    },
    {
        id: 3,
        name: '박민수',
        height: 178,
        gender: 'male',
        hue: 200,
        saturation: 0.8
    },
    {
        id: 4,
        name: '김철수',
        height: 175,
        gender: 'male',
        hue: 45,
        saturation: 1.0
    },
    {
        id: 5,
        name: '나루토',
        height: 166,
        gender: 'male',
        hue: 30,
        saturation: 1.1
    },
    {
        id: 6,
        name: '사쿠라',
        height: 161,
        gender: 'female',
        hue: 340,
        saturation: 1.0
    },
    {
        id: 7,
        name: '손오공',
        height: 175,
        gender: 'male',
        hue: 25,
        saturation: 1.0
    },
    {
        id: 8,
        name: '베지터',
        height: 164,
        gender: 'male',
        hue: 220,
        saturation: 0.9
    },
    {
        id: 9,
        name: '루피',
        height: 174,
        gender: 'male',
        hue: 0,
        saturation: 1.2
    },
    {
        id: 10,
        name: '조로',
        height: 181,
        gender: 'male',
        hue: 120,
        saturation: 0.8
    }
];

// LocalStorage 키
const STORAGE_KEY = 'character_height_data';

/**
 * 캐릭터 데이터를 LocalStorage에서 불러오기
 * @returns {Array} - 캐릭터 배열
 */
export function loadCharacters() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('캐릭터 데이터 로드 실패:', error);
    }

    // 저장된 데이터가 없으면 샘플 데이터 반환 및 저장
    saveCharacters(sampleCharacters);
    return sampleCharacters;
}

/**
 * 캐릭터 데이터를 LocalStorage에 저장
 * @param {Array} characters - 캐릭터 배열
 */
export function saveCharacters(characters) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
        console.error('캐릭터 데이터 저장 실패:', error);
    }
}

/**
 * 새 캐릭터 추가
 * @param {Object} character - 캐릭터 객체 {name, height, gender}
 * @returns {Array} - 업데이트된 캐릭터 배열
 */
export function addCharacter(character) {
    const characters = loadCharacters();
    const newCharacter = {
        id: Date.now(),
        ...character,
        gender: character.gender || 'male',
        hue: getRandomHue(),
        saturation: getRandomSaturation()
    };

    const updated = [...characters, newCharacter];
    saveCharacters(updated);
    return updated;
}

/**
 * 캐릭터 삭제
 * @param {number} id - 캐릭터 ID
 * @returns {Array} - 업데이트된 캐릭터 배열
 */
export function deleteCharacter(id) {
    const characters = loadCharacters();
    const updated = characters.filter(char => char.id !== id);
    saveCharacters(updated);
    return updated;
}
