"""Corta uma gravação longa (várias falas separadas por pausas) em um
arquivo por fala, na ordem dada.

Uso: python3 tools/dividir_audio.py gravacao.mp3 slugs.json audio/
  slugs.json: lista JSON de slugs, na mesma ordem em que foram faladas.

Precisa de ffmpeg (pip install imageio-ffmpeg já traz um).
"""
import json
import re
import subprocess
import sys

try:
    import imageio_ffmpeg
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FFMPEG = 'ffmpeg'


def detectar_silencios(arquivo, ruido, minimo):
    saida = subprocess.run(
        [FFMPEG, '-hide_banner', '-i', arquivo, '-af',
         f'silencedetect=noise={ruido}:d={minimo}', '-f', 'null', '-'],
        capture_output=True, text=True).stderr
    inicios = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', saida)]
    fins = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', saida)]
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', saida).groups()
    duracao = int(h) * 3600 + int(m) * 60 + float(s)
    return list(zip(inicios, fins)), duracao


def trechos_de_fala(silencios, duracao):
    trechos, pos = [], 0.0
    for inicio, fim in silencios:
        if inicio - pos > 0.08:
            trechos.append((pos, inicio))
        pos = fim
    if duracao - pos > 0.08:
        trechos.append((pos, duracao))
    return trechos


def main():
    arquivo, arquivo_slugs, pasta_saida = sys.argv[1:4]
    slugs = json.load(open(arquivo_slugs, encoding='utf-8'))

    # Tenta alguns limiares até o número de trechos bater com o de falas.
    tentativas = [(r, m) for m in (0.7, 0.6, 0.8, 0.5, 0.9, 1.0) for r in ('-38dB', '-34dB', '-42dB')]
    for ruido, minimo in tentativas:
        silencios, duracao = detectar_silencios(arquivo, ruido, minimo)
        trechos = trechos_de_fala(silencios, duracao)
        if len(trechos) == len(slugs):
            break
    else:
        sys.exit(f'Erro: {len(trechos)} trechos encontrados para {len(slugs)} falas em {arquivo}.')

    for (inicio, fim), slug in zip(trechos, slugs):
        a = max(0.0, inicio - 0.06)
        b = min(duracao, fim + 0.12)
        subprocess.run(
            [FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}',
             '-i', arquivo, '-af', 'afade=t=in:d=0.02', '-c:a', 'libmp3lame', '-q:a', '4',
             f'{pasta_saida}/{slug}.mp3'],
            check=True)
    print(f'{len(slugs)} falas salvas em {pasta_saida} (limiar {ruido}, pausa {minimo}s).')


if __name__ == '__main__':
    main()
