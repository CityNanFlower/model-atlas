#!/usr/bin/env python3
"""把 src 下的样式、图标、数据与脚本装配为单文件 index.html。"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / 'src'

def read(name: str) -> str:
    return (SRC / name).read_text(encoding='utf-8')

shell = read('shell.html')
styles = read('styles.css')
icons = read('icons.js')
meta = read('meta.js')
app = read('app.js')

data_files = [
    'data-origin.js',
    'data-language.js',
    'data-multimodal.js',
    'data-image.js',
    'data-video.js',
    'data-audio.js',
    'data-code.js',
    'data-science.js',
    'data-3d.js',
    'data-world.js',
    'data-expansion-a.js',
    'data-expansion-b.js',
    'data-more.js',
]
data = '\n\n'.join(read(name) for name in data_files)

parts = {
    '__CSS__': styles,
    '__ICONS__': icons,
    '__META__': meta,
    '__DATA__': data,
    '__APP__': app,
}

for marker, value in parts.items():
    if marker not in shell:
        raise SystemExit(f'missing marker: {marker}')
    if '</script>' in value.lower():
        raise SystemExit(f'unsafe </script> found in {marker}')
    shell = shell.replace(marker, value)

out = ROOT / 'index.html'
out.write_text(shell, encoding='utf-8')
print(f'built {out} ({out.stat().st_size:,} bytes)')
