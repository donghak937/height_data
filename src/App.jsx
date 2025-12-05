import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import CharacterSidebar from './components/CharacterSidebar';
import ComparisonView from './components/ComparisonView';
import { filterCharacters } from './utils/koreanSearch';
import { loadCharacters, addCharacter, deleteCharacter, editCharacter } from './data/sampleCharacters';

function App() {
    const [characters, setCharacters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCharacters, setSelectedCharacters] = useState([]);

    useEffect(() => {
        setCharacters(loadCharacters());
    }, []);

    const filteredCharacters = filterCharacters(characters, searchQuery);

    const handleCharacterSelect = (character) => {
        // 이미 선택된 경우 제거
        if (selectedCharacters.find(c => c.id === character.id)) {
            setSelectedCharacters(selectedCharacters.filter(c => c.id !== character.id));
            return;
        }

        if (selectedCharacters.length >= 5) {
            alert('최대 5개까지만 선택할 수 있습니다!');
            return;
        }

        setSelectedCharacters([...selectedCharacters, character]);
    };

    const handleRemoveFromComparison = (id) => {
        setSelectedCharacters(selectedCharacters.filter(c => c.id !== id));
    };

    const handleAddCharacter = (newCharacter) => {
        const updated = addCharacter(newCharacter);
        setCharacters(updated);
    };

    const handleDeleteCharacter = (id) => {
        const updated = deleteCharacter(id);
        setCharacters(updated);
        // 비교 목록에서도 제거
        setSelectedCharacters(selectedCharacters.filter(c => c.id !== id));
    };

    const handleReorderCharacters = (newOrder) => {
        setSelectedCharacters(newOrder);
    };

    const handleUpdateCharacter = (id, updates) => {
        // 영구 저장소 및 전체 목록 업데이트
        const updatedList = editCharacter(id, updates);
        setCharacters(updatedList);

        // 선택된 목록 업데이트
        setSelectedCharacters(selectedCharacters.map(char =>
            char.id === id ? { ...char, ...updates } : char
        ));
    };

    return (
        <div className="app">
            <div className="app-background"></div>

            <div className="container">
                <header className="app-header fade-in">
                    <h1>캐릭터 키 비교</h1>
                    <p className="app-subtitle">좋아하는 캐릭터들의 키를 비교해보세요!</p>
                </header>

                <main className="app-main-grid">
                    {/* 사이드바 */}
                    <aside className="sidebar-section fade-in">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        <CharacterSidebar
                            characters={filteredCharacters}
                            selectedCharacters={selectedCharacters}
                            onAddCharacter={handleAddCharacter}
                            onDeleteCharacter={handleDeleteCharacter}
                            onSelectCharacter={handleCharacterSelect}
                            onReorderCharacters={handleReorderCharacters}
                            onUpdateCharacter={handleUpdateCharacter}
                        />
                    </aside>

                    {/* 메인 비교 영역 */}
                    <section className="comparison-section-main fade-in">
                        <ComparisonView
                            selectedCharacters={selectedCharacters}
                            onRemoveCharacter={handleRemoveFromComparison}
                            onReorderCharacters={handleReorderCharacters}
                            onUpdateCharacter={handleUpdateCharacter}
                        />
                    </section>
                </main>
            </div>
        </div>
    );
}

export default App;
