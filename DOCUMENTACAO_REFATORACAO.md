# Documentação da Refatoração Massiva

## 1. Visão Geral

O sistema é um portfólio web com Flask + Jinja2 no backend e HTML/CSS/JavaScript no frontend.

Responsabilidades gerais:
- Backend: roteamento HTTP e renderização de templates.
- Templates: estrutura das páginas e composição de seções.
- CSS: identidade visual e layout.
- JavaScript: interações de UI (FAQ, menu mobile, grid animado da home e fallback de reveal).

Objetivo desta refatoração:
- Reorganizar arquitetura e nomes para melhorar legibilidade e manutenção.
- Preservar 100% do comportamento funcional e visual.

## 2. Arquitetura

### Camadas adotadas

Backend (`src/portfolio`):
- `presentation`: rotas HTTP e adaptação para web.
- `application`: casos de uso/aplicação (montagem de página solicitada).
- `domain`: modelos de domínio (`TemplatePage`).
- `infrastructure`: integração com Flask/Jinja para renderização.

Frontend JS (`static/js`):
- `application`: orquestra inicialização das interações de página.
- `presentation/features`: módulos de UI por feature (faq, home-grid, menu, motion).
- Entradas compatíveis (`main.js`, `loader.js`): mantidas para preservar contratos externos.

### Fluxo do sistema

1. Requisição chega nas rotas da camada `presentation`.
2. A rota consulta a camada `application` para obter o descritor de página.
3. O descritor (`domain`) é renderizado via gateway de template (`infrastructure`).
4. O HTML entrega os mesmos assets estáticos.
5. O `main.js` inicializa interações de UI por módulos de feature.

## 3. Estrutura de Pastas

```text
refatoracao massiva/
  app.py
  pyproject.toml
  uv.lock
  DOCUMENTACAO_REFATORACAO.md
  src/
    portfolio/
      __init__.py
      application/
        page_service.py
      domain/
        pages.py
      infrastructure/
        template_gateway.py
      presentation/
        web/
          factory.py
          routes.py
  templates/
    base.html
    index.html
  static/
    assets/
      fonts/
      icons/
      images/
      cv.pdf
      resource_a0b5b4f11f8c.html
    css/
      base.css
      tokens.css
      components/
        *.css
    js/
      loader.js
      main.js
      reveal-fallback.js
      faq.js
      home-grid.js
      menu.js
      motion.js
      animation.js
      application/
        initialize-page-interactions.js
      presentation/
        features/
          faq/faq-accordion.js
          home/home-grid-interaction.js
          navigation/mobile-menu.js
          motion/motion-init.js
          motion/animation-init.js
```

## 4. Padrões Adotados

### Convenções de nome

- Funções com verbo e intenção clara:
  - `initializePageInteractions`
  - `initializeHomeGridInteraction`
  - `create_flask_app`
- Variáveis semânticas:
  - `navigationList`, `chainAnimationTimers`, `component_css_path`
- Arquivos por responsabilidade:
  - `template_gateway.py` para integração de render.
  - `page_service.py` para caso de uso de resolução de página.

### Organização de código

- Separação por camadas no backend.
- Separação por feature no frontend JS.
- Entry points mantidos para compatibilidade.
- Nenhuma dependência nova adicionada.

## 5. Comparação (Antes vs Depois)

### Antes

- Backend concentrado em `app.py` com responsabilidades misturadas.
- Frontend JS com múltiplas responsabilidades no mesmo nível de diretório.
- Menor clareza de fronteira entre orquestração e implementação de features.

### Depois

- Backend modular com camadas explícitas (`presentation/application/domain/infrastructure`).
- Frontend JS reorganizado por feature e com orquestrador único de inicialização.
- Nomes mais semânticos e previsíveis.
- Contratos públicos preservados (`/`, `/<name_page>`, templates e assets).

### Problemas resolvidos

- Acoplamento excessivo do backend em arquivo único.
- Dificuldade de localizar responsabilidades específicas no JS.
- Baixa escalabilidade estrutural para crescimento do projeto.

## 6. Guia de Manutenção

### Como adicionar novas features corretamente

Backend:
1. Defina/ajuste modelo na camada `domain` quando necessário.
2. Crie o caso de uso em `application`.
3. Adapte integração externa em `infrastructure`.
4. Exponha via rota em `presentation`.

Frontend:
1. Crie módulo da nova interação em `static/js/presentation/features/<feature>/`.
2. Conecte no orquestrador `static/js/application/initialize-page-interactions.js`.
3. Preserve `main.js` como ponto de entrada simples.

### Boas práticas no projeto

- Evitar lógica de negócio em rotas/controladores.
- Manter funções pequenas e com propósito único.
- Nomear variáveis por contexto de domínio/UI.
- Preservar contratos públicos (rotas, nomes de assets e imports de entrada).
- Validar compatibilidade com testes de rota e checagem de sintaxe JS/Python antes de concluir mudanças.

## Validação Executada

Validações aplicadas na versão refatorada:
- `python -m compileall -q app.py src`
- `node --check` em todos os arquivos JS
- Comparação de respostas HTTP entre projeto original e refatorado:
  - `/` -> status e body idênticos
  - `/index` -> status e body idênticos
  - `/pagina-inexistente` -> status e body idênticos (404)

Conclusão: funcionalidade e interface mantidas com estrutura interna reorganizada.
