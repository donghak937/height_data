import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import CharacterSidebar from './components/CharacterSidebar';
import ComparisonView from './components/ComparisonView';
import { filterCharacters } from './utils/koreanSearch';
import { subscribeCharacters, addCharacterDB, deleteCharacterDB, updateCharacterDB, initializeDataIfNeeded } from './data/firebaseUtils';

function App() {
    const [characters, setCharacters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCharacters, setSelectedCharacters] = useState([]);

    useEffect(() => {
        // Firebase 데이터 초기화 (필요시)
        initializeDataIfNeeded();

        // 실시간 데이터 구독
        const unsubscribe = subscribeCharacters((updatedList) => {
            setCharacters(updatedList);

            // 데이터 변경 시 선택된 캐릭터 목록도 동기화
            // (삭제된 캐릭터 필터링 및 정보 업데이트)
            setSelectedCharacters(prevSelected => {
                return prevSelected
                    .map(sel => updatedList.find(c => c.id === sel.id))
                    .filter(c => c !== undefined);
            });
        });

        return () => unsubscribe();
    }, []);

    const filteredCharacters = filterCharacters(characters, searchQuery);

    const handleCharacterSelect = (character) => {
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
        addCharacterDB(newCharacter);
    };

    const handleDeleteCharacter = (id) => {
        if (confirm('정말 삭제하시겠습니까? 모든 사용자에게서 삭제됩니다.')) {
            deleteCharacterDB(id);
        }
    };

    const handleUpdateCharacter = (id, updates) => {
        updateCharacterDB(id, updates);
    };

    const handleReorderCharacters = (newOrder) => {
        setSelectedCharacters(newOrder);
    };

    return (
        <div className="app">
            <div className="app-background"></div>

            <div className="container">
                <header className="app-header fade-in">
                    <h1>캐릭터 키 비교</h1>
                    <p className="app-subtitle">모든 데이터가 실시간으로 공유됩니다!</p>
                </header>

                <main className="app-main-grid">
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
