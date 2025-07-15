// Configuração minimalista do PostCSS para compatibilidade com Vercel
export default {
  plugins: {
    // Apenas os plugins essenciais
    'postcss-preset-env': {
      stage: 3
    },
    // cssnano será aplicado automaticamente em produção pelo Next.js
  }
};