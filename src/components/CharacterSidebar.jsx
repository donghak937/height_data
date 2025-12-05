import React, { useState } from 'react';
import './CharacterSidebar.css';

export default function CharacterSidebar({
    characters,
    onAddCharacter,
    onDeleteCharacter,
    onSelectCharacter,
    onReorderCharacters,
    selectedCharacters,
    onUpdateCharacter
}) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', height: '', gender: 'male', school: '' });
    const [editingId, setEditingId] = useState(null);
    const [dragIdx, setDragIdx] = useState(null);

    // 필터 상태
    const [genderFilter, setGenderFilter] = useState('all');
    const [schoolFilter, setSchoolFilter] = useState('all');

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

        const school = formData.school || '나들목고등학교';

        if (editingId) {
            onUpdateCharacter(editingId, { name: formData.name, height, gender: formData.gender, school });
            setEditingId(null);
        } else {
            onAddCharacter({ name: formData.name, height, gender: formData.gender, school });
        }

        setFormData({ name: '', height: '', gender: 'male', school: '' });
        setIsFormOpen(false);
    };

    const handleEditStart = (e, char) => {
        e.stopPropagation();
        setFormData({ name: char.name, height: char.height, gender: char.gender, school: char.school || '' });
        setEditingId(char.id);
        setIsFormOpen(true);
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: '', height: '', gender: 'male', school: '' });
    };

    const getColor = (char) => char.color || `hsl(${char.hue || 0}, 70%, 50%)`;

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

    // 필터링
    const uniqueSchools = [...new Set(characters.map(c => c.school || '기타'))].sort();

    const displayedCharacters = characters.filter(char => {
        const matchesGender = genderFilter === 'all' || char.gender === genderFilter;
        const matchesSchool = schoolFilter === 'all' || (char.school || '기타') === schoolFilter;
        return matchesGender && matchesSchool;
    });

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>캐릭터 목록</h3>
                <button className="add-btn" onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', height: '', gender: 'male', school: '' });
                    setIsFormOpen(!isFormOpen);
                }}>+</button>
            </div>

            {/* 필터 섹션 */}
            <div className="filters">
                <select className="filter-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                    <option value="all">전체 성별</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
                <select className="filter-select" value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)}>
                    <option value="all">전체 소속</option>
                    {uniqueSchools.map(school => (
                        <option key={school} value={school}>{school}</option>
                    ))}
                </select>
            </div>

            {isFormOpen && (
                <form className="add-form" onSubmit={handleSubmit}>
                    <div className="form-title">{editingId ? '캐릭터 수정' : '새 캐릭터 추가'}</div>
                    <input placeholder="이름" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <input type="number" placeholder="키(cm)" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                    <input placeholder="학교 (기본: 나들목고등학교)" value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} />
                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                    </select>
                    <div className="form-btns">
                        <button type="submit">{editingId ? '수정' : '추가'}</button>
                        <button type="button" onClick={handleCancel}>취소</button>
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
                            <div className="avatar" style={{ backgroundColor: getColor(char), position: 'relative', cursor: 'pointer' }}>
                                <input
                                    type="color"
                                    value={char.color || '#ff0000'}
                                    onChange={(e) => onUpdateCharacter(char.id, { color: e.target.value })}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                    title="색상 변경"
                                />
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
                <h4>전체 캐릭터 ({displayedCharacters.length})</h4>
                {displayedCharacters.map((char) => {
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
                            <div className="item-btns">
                                <button className="edit-btn" onClick={(e) => handleEditStart(e, char)}>✎</button>
                                <button className="del-btn" onClick={(e) => { e.stopPropagation(); if (confirm(`${char.name} 삭제?`)) onDeleteCharacter(char.id); }}>✕</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
