import React, { useState } from 'react';
import './CharacterSidebar.css';

export default function CharacterSidebar({
    characters,
    onAddCharacter,
    onDeleteCharacter,
    onSelectCharacter,
    onReorderCharacters,
    selectedCharacters
}) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        height: '',
        gender: 'male'
    });
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.height) {
            alert('이름과 키를 입력해주세요!');
            return;
        }

        const height = parseInt(formData.height);
        if (isNaN(height) || height < 50 || height < 300) {
            alert('키는 50cm에서 300cm 사이의 숫자여야 합니다!');
            return;
        }

        onAddCharacter({
            name: formData.name,
            height: height,
            gender: formData.gender
        });

        setFormData({ name: '', height: '', gender: 'male' });
        setIsFormOpen(false);
    };

    // 선택된 캐릭터들의 드래그 앤 드롭 핸들러
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        // 임시로 순서 변경 표시
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newOrder = [...selectedCharacters];
        const [removed] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(dropIndex, 0, removed);

        onReorderCharacters(newOrder);
        setDraggedIndex(null);
    };

    return (
        <div className="character-sidebar glass-card">
            <div className="sidebar-header">
                <h3>캐릭터 목록</h3>
                <button
                    className="btn-add-small"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    title="캐릭터 추가"
                >
                    +
                </button>
            </div>

            {isFormOpen && (
                <div className="inline-form">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input input-small"
                            placeholder="이름"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="number"
                            className="input input-small"
                            placeholder="키(cm)"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        />
                        <select
                            className="input input-small"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </select>
                        <div className="form-actions-inline">
                            <button type="submit" className="btn btn-primary btn-small">
                                추가
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-small"
                                onClick={() => setIsFormOpen(false)}
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 선택된 캐릭터 목록 (드래그로 순서 변경 가능) */}
            {selectedCharacters.length > 0 && (
                <div className="selected-characters-section">
                    <h4 className="section-title">
                        선택된 캐릭터 ({selectedCharacters.length}/5)
                        <span className="layer-hint">드래그로 순서 변경 (앞쪽이 위에 표시)</span>
                    </h4>
                    <div className="selected-character-items">
                        {selectedCharacters.map((character, index) => (
                            <div
                                key={character.id}
                                className="selected-character-item"
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <span className="layer-number">{index + 1}</span>
                                <div className="item-info">
                                    <span className="item-name">{character.name}</span>
                                    <span className="item-height">{character.height}cm</span>
                                </div>
                                <button
                                    className="btn-delete-mini"
                                    onClick={() => onSelectCharacter(character)}
                                    title="비교에서 제거"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 전체 캐릭터 목록 */}
            <div className="all-characters-section">
                <h4 className="section-title">전체 캐릭터</h4>
                <div className="character-items">
                    {characters.map((character) => (
                        <div
                            key={character.id}
                            className="character-item"
                            onClick={() => onSelectCharacter(character)}
                        >
                            <div className="item-info">
                                <span className="item-name">{character.name}</span>
                                <span className="item-height">{character.height}cm · {character.gender === 'female' ? '여' : '남'}</span>
                            </div>
                            <button
                                className="btn-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`${character.name}을(를) 삭제하시겠습니까?`)) {
                                        onDeleteCharacter(character.id);
                                    }
                                }}
                                title="삭제"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
