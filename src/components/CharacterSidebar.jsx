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
    const [formData, setFormData] = useState({ name: '', height: '', gender: 'male' });
    const [dragIdx, setDragIdx] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.height) {
            alert('이름과 키를 입력해주세요!');
            return;
        }
        const height = parseInt(formData.height);
        if (isNaN(height) || height < 50 || height > 300) {
            alert('키는 50~300 사이여야 합니다!');
            return;
        }
        onAddCharacter({ name: formData.name, height, gender: formData.gender });
        setFormData({ name: '', height: '', gender: 'male' });
        setIsFormOpen(false);
    };

    const getColor = (char) => `hsl(${char.hue || 0}, 70%, 50%)`;

    const handleDragStart = (e, idx) => setDragIdx(idx);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e, dropIdx) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === dropIdx) return;
        const newOrder = [...selectedCharacters];
        const [removed] = newOrder.splice(dragIdx, 1);
        newOrder.splice(dropIdx, 0, removed);
        onReorderCharacters(newOrder);
        setDragIdx(null);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>캐릭터 목록</h3>
                <button className="add-btn" onClick={() => setIsFormOpen(!isFormOpen)}>+</button>
            </div>

            {isFormOpen && (
                <form className="add-form" onSubmit={handleSubmit}>
                    <input placeholder="이름" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <input type="number" placeholder="키(cm)" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                    </select>
                    <div className="form-btns">
                        <button type="submit">추가</button>
                        <button type="button" onClick={() => setIsFormOpen(false)}>취소</button>
                    </div>
                </form>
            )}

            {/* 선택된 캐릭터 */}
            {selectedCharacters.length > 0 && (
                <div className="section">
                    <h4>선택됨 ({selectedCharacters.length}/5) <small>드래그로 순서=레이어</small></h4>
                    {selectedCharacters.map((char, idx) => (
                        <div
                            key={char.id}
                            className="selected-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, idx)}
                        >
                            <span className="layer-num">{idx + 1}</span>
                            <div className="avatar" style={{ backgroundColor: getColor(char) }}>
                                <img src={char.gender === 'female' ? '/female.png' : '/male.png'} alt="" />
                            </div>
                            <div className="info">
                                <span className="name" style={{ color: getColor(char) }}>{char.name}</span>
                                <span className="height">{char.height}cm</span>
                            </div>
                            <button className="remove-btn" onClick={() => onSelectCharacter(char)}>✕</button>
                        </div>
                    ))}
                </div>
            )}

            {/* 전체 캐릭터 */}
            <div className="section">
                <h4>전체 캐릭터</h4>
                {characters.map((char) => {
                    const isSelected = selectedCharacters.some(c => c.id === char.id);
                    return (
                        <div
                            key={char.id}
                            className={`char-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelectCharacter(char)}
                        >
                            <div className="info">
                                <span className="name">{char.name}</span>
                                <span className="height">{char.height}cm · {char.gender === 'female' ? '여' : '남'}</span>
                                {char.school && <span className="school-tag">{char.school}</span>}
                            </div>
                            <button className="del-btn" onClick={(e) => { e.stopPropagation(); if (confirm(`${char.name} 삭제?`)) onDeleteCharacter(char.id); }}>✕</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
