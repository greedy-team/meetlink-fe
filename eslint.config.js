import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] }, // 무시할 폴더
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier, // Prettier와 충돌하는 ESLint 규칙 끄기 (항상 마지막)
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // React Refresh (Vite 기본)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // console.log 경고 (배포 시 실수 방지)
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // 사용하지 않는 변수 경고 (TypeScript 설정과 중복되지만 더 엄격하게)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Import 정렬 규칙 (선택 사항이지만 추천)
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // React 관련 패키지
            ["^react", "^react-router", "^@tanstack"],
            // 외부 패키지 (shadcn 등)
            ["^@?\\w"],
            // 내부 컴포넌트 (@/components 등)
            ["^@/components", "^@/lib", "^@/hooks"],
            // 상대 경로
            ["^\\."],
            // 스타일
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
);
