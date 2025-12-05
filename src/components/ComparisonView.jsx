import React, { useState, useRef } from 'react';
import './ComparisonView.css';

export default function ComparisonView({ selectedCharacters, onRemoveCharacter, onUpdateCharacter }) {
    const [positions, setPositions] = useState({});
    const containerRef = useRef(null);
    const dragInfo = useRef(null);

    // 초기 위치 설정
    const getPosition = (charId, index) => {
        if (positions[charId]) return positions[charId];
        return { x: index * 130 + 50, y: 0 };
    };

    const onMouseDown = (e, charId, index) => {
        e.preventDefault();

        const container = containerRef.current;
        if (!container) return;

        // 초기 위치가 없으면 계산된 위치 사용
        const pos = positions[charId] || getPosition(charId, index);

        dragInfo.current = {
            id: charId,
            startMouseX: e.clientX,
            startMouseY: e.clientY,
            startPosX: pos.x,
            startPosY: pos.y
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!dragInfo.current) return;

        const { id, startMouseX, startMouseY, startPosX, startPosY } = dragInfo.current;

        const dx = e.clientX - startMouseX;
        const dy = startMouseY - e.clientY; // Y는 반대

        let newX = startPosX + dx;
        let newY = startPosY + dy;

        // 바닥 스냅 (20px 이내면 0으로)
        if (newY < 20 && newY > -20) {
            newY = 0;
        }

        // 경계
        newX = Math.max(0, newX);
        newY = Math.max(0, newY);

        setPositions(prev => ({
            ...prev,
            [id]: { x: newX, y: newY }
        }));
    };

    const onMouseUp = () => {
        dragInfo.current = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    if (selectedCharacters.length === 0) {
        return (
            <div className="comparison-empty">
                <div className="empty-icon">👥</div>
                <h3>캐릭터를 선택하여 키를 비교해보세요</h3>
                <p>왼쪽 사이드바에서 캐릭터를 클릭하면 여기에 추가됩니다</p>
            </div>
        );
    }


    // 고정된 기준 키 (200cm)를 사용하여 캐릭터가 추가되어도 크기가 변하지 않도록 함
    const referenceHeight = 200;
    const basePixelHeight = 900;

    return (
        <div className="comparison-view glass-card">
            <div className="comparison-header">
                <h2>키 비교</h2>
                <p className="comparison-subtitle">캐릭터를 드래그해서 위치를 조정하세요</p>
            </div>

            <div className="comparison-container" ref={containerRef}>
                {/* 그리드 */}
                <div className="grid-background">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="grid-line" />
                    ))}
                </div>

                {/* 바닥 빨간 라인 */}
                <div className="floor-line" />

                {/* 캐릭터들 */}
                {selectedCharacters.map((char, index) => {
                    const heightRatio = char.height / referenceHeight;
                    // 여캐 이미지가 남캐보다 머리 위 빈공간이 많아서 키 보정 필요
                    const isFemale = char.gender === 'female';
                    const heightCorrection = isFemale ? 1.12 : 1; // 12% 키움
                    const pixelHeight = basePixelHeight * heightRatio * heightCorrection;
                    const pos = getPosition(char.id, index);

                    return (
                        <div
                            key={char.id}
                            className="character-draggable"
                            style={{
                                left: pos.x,
                                bottom: pos.y + 60,
                                height: pixelHeight,
                                zIndex: index + 1
                            }}
                            onMouseDown={(e) => onMouseDown(e, char.id, index)}
                        >
                            {/* 삭제 버튼 */}
                            <button
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveCharacter(char.id);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                ✕
                            </button>

                            {/* 색상 변경 버튼 */}
                            <div className="color-picker-wrapper">
                                <input
                                    type="color"
                                    className="color-input"
                                    value={char.color || '#ff0000'}
                                    onChange={(e) => onUpdateCharacter(char.id, { color: e.target.value })}
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                />
                                <div className="color-icon" style={{ backgroundColor: char.color || `hsl(${char.hue || 0}, 70%, 50%)` }}></div>
                            </div>

                            {/* 캐릭터 실루엣 (CSS Mask 사용) */}
                            <div
                                className={`char-silhouette ${isFemale ? 'female' : ''}`}
                                style={{
                                    maskImage: `url(${isFemale ? '/female.png' : '/male.png'})`,
                                    WebkitMaskImage: `url(${isFemale ? '/female.png' : '/male.png'})`,
                                    backgroundColor: char.color || `hsl(${char.hue || 0}, 70%, 50%)`,
                                    opacity: 0.85
                                }}
                            />

                            {/* 키 표시 */}
                            <div className="height-label">{char.height}cm</div>


                            {/* 이름 표시 */}
                            <div className="name-label">{char.name}</div>

                            {/* 소속 표시 */}
                            {char.school && <div className="school-label">{char.school}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
