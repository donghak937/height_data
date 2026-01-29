import React from 'react';
import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="text"
                    className="input search-input"
                    placeholder="캐릭터 이름 검색 (초성 검색 가능, 예: ㄱㄷㅇ)"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {value && (
                    <button
                        className="clear-btn"
                        onClick={() => onChange('')}
                        aria-label="검색어 지우기"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
