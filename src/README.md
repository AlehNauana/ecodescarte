# Código-fonte do projeto

Esta pasta contém os arquivos-fonte da aplicação **EcoDescarte** — versão única e integrada (front-end puro: HTML, CSS e JavaScript).

## Telas (10)

**Administração:** `index.html` (Dashboard), `aprovacoes.html` (Aprovação de Pontos), `gestao-usuarios.html` (Gestão de Usuários), `gestao-administradores.html` (Administradores), `perfil-moderador.html` (Perfil do Moderador), `auditoria.html` (Auditoria/Logs/Relatórios).

**Área do Usuário:** `perfil-usuario.html` (Perfil), `formulario-descarte.html` (Formulário de Descarte), `formulario-sugestao.html` (Sugerir Ponto), `pontos-coleta.html` (Pontos de Coleta).

## Estrutura

```
src/
├── *.html                  # as 10 telas da aplicação
└── assets/
    ├── css/
    │   ├── tokens.css       # design system compartilhado (cores, fontes, espaçamentos)
    │   ├── eco-nav.css      # barra de navegação compartilhada (presente em todas as telas)
    │   └── *.css            # estilos específicos de cada tela
    ├── js/
    │   └── *.js             # lógica de cada tela
    ├── data/                # JSONs originais (referência para futura API)
    └── imagens/             # imagens locais (ícones são inline em SVG/emoji)
```

## Navegação

Todas as telas estão conectadas pela **barra de navegação compartilhada** (`eco-nav.css`), presente no topo de cada página, dividida em **Usuário** e **Administração**. O Dashboard (`index.html`) também possui um **menu lateral** completo com links para todas as telas.

## Como executar

Não há etapa de build nem dependências de instalação. Basta abrir `index.html` em um navegador moderno (Chrome, Firefox, Edge). As telas que antes dependiam de um servidor de dados foram convertidas para **dados embutidos** (mock) com operações em memória, de modo que tudo funciona offline, apenas abrindo o arquivo.
