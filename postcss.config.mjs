const postcssConfig = {
  plugins: {
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true
      }
    },
    '@tailwindcss/postcss': {},
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