import React, { useState } from 'react';
import './CharacterManager.css';

export default function CharacterManager({ onAddCharacter }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        height: '',
        image: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.height) {
            alert('이름과 키를 입력해주세요!');
            return;
        }

        const height = parseInt(formData.height);
        if (isNaN(height) || height < 50 || height > 300) {
            alert('키는 50cm에서 300cm 사이의 숫자여야 합니다!');
            return;
        }

        onAddCharacter({
            name: formData.name,
            height: height,
            image: formData.image || `https://via.placeholder.com/150/8B5CF6/FFFFFF?text=${encodeURIComponent(formData.name)}`
        });

        setFormData({ name: '', height: '', image: '' });
        setIsOpen(false);
    };

    return (
        <div className="character-manager">
            <button
                className="btn btn-primary add-character-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="btn-icon">+</span>
                캐릭터 추가하기
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>새 캐릭터 추가</h2>
                            <button
                                className="modal-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="닫기"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="character-form">
                            <div className="form-group">
                                <label htmlFor="name">이름 *</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="input"
                                    placeholder="캐릭터 이름"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="height">키 (cm) *</label>
                                <input
                                    id="height"
                                    type="number"
                                    className="input"
                                    placeholder="예: 165"
                                    min="50"
                                    max="300"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="image">이미지 URL (선택사항)</label>
                                <input
                                    id="image"
                                    type="url"
                                    className="input"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                                <p className="form-hint">비워두면 자동으로 플레이스홀더 이미지가 생성됩니다</p>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>
                                    취소
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    추가하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
