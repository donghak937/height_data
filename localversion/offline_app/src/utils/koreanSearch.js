// 한글 초성 리스트
const CHOSUNG_LIST = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ',
    'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * 한글 문자열에서 초성만 추출
 * @param {string} str - 한글 문자열
 * @returns {string} - 초성 문자열
 */
export function getChosung(str) {
    let result = '';

    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i) - 0xAC00;

        // 한글 유니코드 범위 체크
        if (code > -1 && code < 11172) {
            const chosungIndex = Math.floor(code / 28 / 21);
            result += CHOSUNG_LIST[chosungIndex];
        } else {
            // 한글이 아닌 경우 그대로 추가
            result += str.charAt(i);
        }
    }

    return result;
}

/**
 * 검색어로 문자열 필터링 (초성 검색 지원)
 * @param {string} text - 검색 대상 텍스트
 * @param {string} query - 검색어 (초성 또는 완성형 한글)
 * @returns {boolean} - 매칭 여부
 */
export function matchesSearch(text, query) {
    if (!query) return true;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // 1. 일반 문자열 매칭
    if (lowerText.includes(lowerQuery)) {
        return true;
    }

    // 2. 초성 매칭
    const textChosung = getChosung(text);
    const queryChosung = getChosung(query);

    // 쿼리가 초성으로만 이루어져 있는지 확인
    const isChosungQuery = CHOSUNG_LIST.some(cho => query.includes(cho));

    if (isChosungQuery) {
        return textChosung.includes(query);
    }

    return false;
}

/**
 * 캐릭터 배열을 검색어로 필터링
 * @param {Array} characters - 캐릭터 배열
 * @param {string} query - 검색어
 * @returns {Array} - 필터링된 캐릭터 배열
 */
export function filterCharacters(characters, query) {
    if (!query.trim()) return characters;

    return characters.filter(character =>
        matchesSearch(character.name, query)
    );
}

/**
 * 랜덤 색상 Hue 생성 (0-360)
 */
export function getRandomHue() {
    return Math.floor(Math.random() * 360);
}

/**
 * 랜덤 Saturation 생성 (0.5-1.2)
 */
export function getRandomSaturation() {
    return 0.5 + Math.random() * 0.7;
}
