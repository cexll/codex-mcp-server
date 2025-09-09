import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'Codex MCP Tool',
    titleTemplate: ':title | Codex MCP Tool Docs',
    description: 'Bridge OpenAI Codex with MCP-compatible clients. Run codex exec tasks, analyze large codebases, and stream progress to your MCP client.',
    base: '/codex-mcp-tool/',
    lastUpdated: true,
    cleanUrls: true,
    
    // Force dark mode by default
    //appearance: 'dark',
    
    head: [
      // Using emoji as favicon
      ['link', { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🤖</text></svg>' }],
      ['meta', { name: 'theme-color', content: '#0ea5e9' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'en' }],
      ['meta', { property: 'og:title', content: 'Codex MCP Tool | Bridge OpenAI Codex with MCP' }],
      ['meta', { property: 'og:site_name', content: 'Codex MCP Tool' }],
      ['meta', { property: 'og:description', content: 'Model Context Protocol server for Codex CLI integration. Analyze code, brainstorm ideas, and execute tasks with AI.' }],
      ['meta', { property: 'og:url', content: 'https://x51xxx.github.io/codex-mcp-tool/' }]
    ],
    
    themeConfig: {
    // No logo - using text branding instead
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Codex CLI', link: '/codex-cli-getting-started' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Installation', link: '/getting-started' },
          { text: 'Codex CLI Basics', link: '/codex-cli-getting-started' }
        ]
      },
      {
        text: 'Core Concepts',
        collapsed: false,
        items: [
          { text: 'How It Works', link: '/concepts/how-it-works' },
          { text: 'File Analysis (@)', link: '/concepts/file-analysis' },
          { text: 'Change Mode Format', link: '/concepts/change-mode' },
          { text: 'Model Selection', link: '/concepts/models' },
          { text: 'Sandbox Modes', link: '/concepts/sandbox' },
          { text: 'Authentication', link: '/authentication' }
        ]
      },
      {
        text: 'API Reference',
        collapsed: false,
        items: [
          {
            text: 'Tools',
            items: [
              { text: 'ask-codex', link: '/api/tools/ask-codex' },
              { text: 'brainstorm', link: '/api/tools/brainstorm' },
              { text: 'ping', link: '/api/tools/ping' },
              { text: 'help', link: '/api/tools/help' },
              { text: 'fetch-chunk', link: '/api/tools/fetch-chunk' },
              { text: 'timeout-test', link: '/api/tools/timeout-test' }
            ]
          }
        ]
      },
      {
        text: 'Examples',
        collapsed: false,
        items: [
          { text: 'Basic Usage', link: '/examples/basic-usage' },
          { text: 'Brainstorming', link: '/examples/brainstorming' },
          { text: 'Advanced Patterns', link: '/examples/advanced-patterns' }
        ]
      },
      {
        text: 'Resources',
        collapsed: false,
        items: [
          { text: 'Troubleshooting', link: '/resources/troubleshooting' },
          { text: 'FAQ', link: '/resources/faq' },
          { text: 'Configuration', link: '/config' },
          { text: 'Contributing', link: '/contributing' }
        ]
      },
      {
        text: 'Advanced',
        collapsed: true,
        items: [
          { text: 'Advanced Usage', link: '/advanced' },
          { text: 'Platform Sandboxing', link: '/platform-sandboxing' },
          { text: 'Experimental Features', link: '/experimental' },
          { text: 'Release Management', link: '/release_management' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/x51xxx/codex-mcp-tool' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Codex MCP Tool Contributors`
    },

    search: {
      provider: 'local',
      options: {
        placeholder: 'Search docs...',
        detailedView: true,
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search documentation'
          },
          modal: {
            noResultsText: 'No results found',
            resetButtonTitle: 'Clear search',
            footer: {
              selectText: 'to select',
              navigateText: 'to navigate',
              closeText: 'to close'
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/x51xxx/codex-mcp-tool/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },

    outline: {
      label: 'On this page',
      level: [2, 3]
    },

    returnToTopLabel: 'Return to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Appearance',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme'
  }
})
)
