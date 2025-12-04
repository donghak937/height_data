import React, { useState, useRef, useEffect } from 'react';
import './ComparisonView.css';

const SNAP_THRESHOLD = 20; // 바닥에 스냅되는 거리

export default function ComparisonView({ selectedCharacters, onRemoveCharacter, onReorderCharacters }) {
    const [draggedCharacter, setDraggedCharacter] = useState(null);
    const [positions, setPositions] = useState({});
    const containerRef = useRef(null);

    useEffect(() => {
        // 새 캐릭터가 추가되면 기본 위치 설정 (바닥에 붙임)
        const newPositions = { ...positions };
        selectedCharacters.forEach((char, index) => {
            if (!newPositions[char.id]) {
                newPositions[char.id] = {
                    x: index * 120 + 50,
                    y: 0 // 바닥에서 시작
                };
            }
        });
        setPositions(newPositions);
    }, [selectedCharacters]);

    const handleMouseDown = (e, character) => {
        if (e.button !== 0) return;
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        setDraggedCharacter({
            id: character.id,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.bottom
        });
    };

    const handleMouseMove = (e) => {
        if (!draggedCharacter || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        let x = e.clientX - containerRect.left - draggedCharacter.offsetX;
        let y = containerRect.bottom - e.clientY - draggedCharacter.offsetY;

        // 바닥에 가까우면 스냅
        if (Math.abs(y) < SNAP_THRESHOLD) {
            y = 0;
        }

        // 경계 제한
        x = Math.max(0, Math.min(x, containerRect.width - 100));
        y = Math.max(0, y);

        setPositions(prev => ({
            ...prev,
            [draggedCharacter.id]: { x, y }
        }));
    };

    const handleMouseUp = () => {
        setDraggedCharacter(null);
    };

    useEffect(() => {
        if (draggedCharacter) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [draggedCharacter]);

    if (selectedCharacters.length === 0) {
        return (
            <div className="comparison-empty">
                <div className="empty-icon">👥</div>
                <h3>캐릭터를 선택하여 키를 비교해보세요</h3>
                <p>왼쪽 사이드바에서 캐릭터를 클릭하면 여기에 추가됩니다</p>
            </div>
        );
    }

    const maxHeight = Math.max(...selectedCharacters.map(c => c.height));
    const basePixelHeight = 500;
    const gridLineCount = 15;

    return (
        <div className="comparison-view glass-card">
            <div className="comparison-header">
                <h2>키 비교</h2>
                <p className="comparison-subtitle">
                    캐릭터를 드래그해서 위치를 조정하세요
                </p>
            </div>

            <div
                className="comparison-container"
                ref={containerRef}
            >
                {/* 배경 그리드 */}
                <div className="grid-background">
                    {Array.from({ length: gridLineCount }).map((_, i) => (
                        <div key={i} className="grid-line" />
                    ))}
                </div>

                {/* 바닥 빨간 라인 */}
                <div className="floor-line"></div>

                <div className="characters-canvas">
                    {selectedCharacters.map((character, index) => {
                        const heightRatio = character.height / maxHeight;
                        const pixelHeight = basePixelHeight * heightRatio;
                        const position = positions[character.id] || { x: 0, y: 0 };
                        const zIndex = index + 1;

                        return (
                            <div
                                key={character.id}
                                className={`comparison-character-draggable ${draggedCharacter?.id === character.id ? 'dragging' : ''}`}
                                style={{
                                    left: `${position.x}px`,
                                    bottom: `${position.y}px`,
                                    zIndex: zIndex,
                                    height: `${pixelHeight}px`,
                                    cursor: 'move'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, character)}
                            >
                                <button
                                    className="remove-btn-floating"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveCharacter(character.id);
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    aria-label={`${character.name} 제거`}
                                >
                                    ✕
                                </button>

                                {/* 이미지 */}
                                <img
                                    src={character.gender === 'female' ? '/female.png' : '/male.png'}
                                    alt={character.name}
                                    className="character-image-draggable"
                                    style={{
                                        filter: `hue-rotate(${character.hue || 0}deg) saturate(${character.saturation || 1})`,
                                        opacity: 0.85
                                    }}
                                    draggable={false}
                                />

                                {/* 캐릭터 정보 (하단) */}
                                <div className="character-info-bottom">
                                    <p className="info-name">{character.name}</p>
                                    <p className="info-height">{character.height} cm</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
