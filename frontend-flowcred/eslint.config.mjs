import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'off'
    },
    ignores: [
      'src/app/avaliador/flows/novo/page.tsx',
      'src/app/avaliador/flows/page.tsx',
      'src/components/dashboard/consent/access-requests.tsx',
      'src/components/dashboard/consent/consent-management.tsx',
      'src/components/dashboard/credit/credit-relationship-card.tsx',
      'src/components/dashboard/integrations/integration-cards.tsx',
      'src/components/ui/fluid-particle.tsx',
      'src/components/user-profiles-section.tsx'
    ]
  }
];

export default eslintConfig;
