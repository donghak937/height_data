import React from 'react';
import './CharacterList.css';

export default function CharacterList({ characters, onCharacterClick }) {
    if (characters.length === 0) {
        return (
            <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>검색 결과가 없습니다</p>
                <p className="no-results-hint">다른 검색어를 시도해보세요</p>
            </div>
        );
    }

    return (
        <div className="character-list">
            {characters.map((character, index) => (
                <div
                    key={character.id}
                    className="character-card glass-card fade-in"
                    onClick={() => onCharacterClick(character)}
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="character-image-wrapper">
                        <img
                            src={character.image}
                            alt={character.name}
                            className="character-image"
                        />
                        <div className="character-overlay" style={{ background: character.color }}>
                            <span className="add-icon">+</span>
                        </div>
                    </div>
                    <div className="character-info">
                        <h3 className="character-name">{character.name}</h3>
                        <p className="character-height">{character.height}cm</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
