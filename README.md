# Simulador Copa do Mundo 2026 · macro.markets

Simulador interativo one-page da Copa do Mundo 2026, com identidade visual do macro.markets, bracket híbrido e compartilhamento por URL + PNG.

## Como rodar localmente

```bash
cd world-cup-simulator
python3 -m http.server 8080
# Abra http://localhost:8080/
```

Qualquer servidor estático serve. Zero build, zero dependências.

## Como funciona

- **Fase de grupos**: digite placares ou clique no radio (força 1×0). A tabela atualiza ao vivo com os critérios oficiais de desempate da FIFA.
- **Classificação**: os 8 melhores terceiros sobem/descem o ranking automaticamente, animados com transições FLIP.
- **Mata-mata**: bracket mirror com conectores SVG no desktop, lista vertical por fase no mobile. O caminho do campeão destaca em verde assim que a final é definida.
- **Compartilhar**: gera PNG 1200×630 com o campeão e a mini-chave; o modal oferece copiar link, baixar imagem ou `navigator.share` nativo (mobile).
- **Tema**: dark/light, detecta preferência do sistema; o toggle persiste em `localStorage`.
- **Estado**: serializado em `#s=...` e em `localStorage`. Compartilhe a URL e o palpite restaura.

## Estrutura

```
styles/          # tokens.css (dark+light), base, components, sections
scripts/
  data/          # teams, groups, fixtures, bracket-template, third-place-map
  engine/        # puro, sem DOM — tiebreak, standings, qualifiers, bracket
  state/         # store, serialize, storage
  ui/            # hero, groups, thirds, bracket, champion, share, onboarding
  utils/         # keyboard, theme, dom helpers
  main.js        # bootstrap
```

## Deploy no GitHub Pages

1. Faça push para a branch configurada (`main` ou `gh-pages`).
2. Em Settings → Pages, aponte para a raiz do diretório `world-cup-simulator/`.
3. O site fica em `https://<user>.github.io/<repo>/world-cup-simulator/`.

Nada além de arquivos estáticos é necessário. Sem Node, sem build.
