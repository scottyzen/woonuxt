type EnvSpec = {
  key: string;
  validate?: (v: string) => boolean;
  hint?: string;
};

const REQUIRED: EnvSpec[] = [
  {
    key: 'GQL_HOST',
    validate: (v) => /^https?:\/\/.+\/graphql$/.test(v),
    hint: 'must end with /graphql',
  },
  {
    key: 'NUXT_IMAGE_DOMAINS',
    validate: (v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean).length > 0,
    hint: 'comma-separated domains',
  },
];

export function validateEnv() {
  const errs: string[] = [];
  for (const { key, validate, hint } of REQUIRED) {
    const val = process.env[key]?.trim();
    if (!val) {
      errs.push(`Missing env: ${key}${hint ? ` (${hint})` : ''}`);
      continue;
    }
    if (validate && !validate(val)) errs.push(`Invalid env: ${key}${hint ? ` (${hint})` : ''}`);
  }
  if (errs.length) {
    console.error('\nEnvironment validation failed:\n- ' + errs.join('\n- '));
    console.error('\nFix your .env (see .env.example) and rerun.\n');
    process.exit(1);
  }
}
