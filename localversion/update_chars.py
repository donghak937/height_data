import os
import sys
import traceback

print("Starting script...")
try:
    file_path = r'c:\Users\dongh\height_data\localversion\local_height_compare.html'
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        sys.exit(1)

    print(f"Reading {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"Read {len(content)} bytes.")

    # 1. Replace DEFAULT_CHARACTERS
    old_block = """        const DEFAULT_CHARACTERS = [
            { id: 1, name: '강지석', height: 182, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 2, name: '이수진', height: 165, gender: 'female', school: '나들목고등학교', color: '#EC4899' },
            { id: 3, name: '박민우', height: 178, gender: 'male', school: '나들목고등학교', color: '#3B82F6' },
            { id: 4, name: '최유나', height: 160, gender: 'female', school: '나들목고등학교', color: '#F472B6' },
            { id: 5, name: '김태호', height: 188, gender: 'male', school: '체육고등학교', color: '#10B981' }
        ];"""

    new_block = """        const DEFAULT_CHARACTERS = [
            { id: 1, name: '윤승빈', height: 186, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 2, name: '박준성', height: 173, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 3, name: '목솔', height: 188, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 4, name: '원승제', height: 163, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 5, name: '조지현', height: 167, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 6, name: '조민준', height: 165, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 7, name: '오기택', height: 174, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 8, name: '정동현', height: 177, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 9, name: '김원태', height: 181, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 10, name: '정군', height: 175, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 11, name: '이용환', height: 176, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 12, name: '심혁준', height: 171, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 13, name: '고규혁', height: 170, gender: 'male', school: '나들목고등학교', color: '#8B5CF6' },
            { id: 14, name: '오희민', height: 161, gender: 'female', school: '나들목고등학교', color: '#EC4899' },
            { id: 15, name: '고아영', height: 169, gender: 'female', school: '나들목고등학교', color: '#EC4899' },
            { id: 16, name: '조하랑', height: 158, gender: 'female', school: '나들목고등학교', color: '#EC4899' },
            { id: 17, name: '김채영', height: 173, gender: 'female', school: '나들목고등학교', color: '#EC4899' }
        ];"""

    if old_block in content:
        content = content.replace(old_block, new_block)
        print("Replaced DEFAULT_CHARACTERS")
    else:
        print("Could not find DEFAULT_CHARACTERS block")
        # Debug: print what it looks like in the file
        start_idx = content.find("const DEFAULT_CHARACTERS")
        if start_idx != -1:
            print("Found start at:", start_idx)
            print("Next 500 chars:", content[start_idx:start_idx+500])
        else:
            print("Could not find start of DEFAULT_CHARACTERS")

    # 2. Replace localStorage key
    if "'localCharacters'" in content:
        content = content.replace("'localCharacters'", "'localCharacters_v2'")
        print("Replaced 'localCharacters' key")
    else:
        print("'localCharacters' not found")

    print("Writing back to file...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Done.")

except Exception:
    traceback.print_exc()
