const postcssConfig = {
  plugins: {
    'postcss-import': {}, // Adicionar suporte a @import
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': false, // Desativar para evitar conflitos com o Tailwind
      }
    },
    '@tailwindcss/postcss': {
      config: './tailwind.config.ts',
      experimental: {
        applyDirectives: true,
        cssUtilities: true
      }
    },
    cssnano: {
      preset: [
        'default',
        {
          discardComments: { removeAll: true }
        },
      ],
    }
  },
};

export default postcssConfig;