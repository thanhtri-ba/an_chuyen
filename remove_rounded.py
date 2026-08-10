import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove rounded-<something> except rounded-full
    # Also handles rounded-[32px] etc.
    new_content = re.sub(r'\brounded-(?!full\b)[a-zA-Z0-9\[\]\-]+\b', '', content)
    
    # Remove exact 'rounded' class
    new_content = re.sub(r'\brounded\b', '', new_content)
    
    # Clean up double spaces that might have been created
    new_content = re.sub(r'  +', ' ', new_content)
    # Clean up space before closing quote
    new_content = re.sub(r' "', '"', new_content)
    new_content = re.sub(r" '", "'", new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    src_dir = os.path.join('web', 'src')
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
