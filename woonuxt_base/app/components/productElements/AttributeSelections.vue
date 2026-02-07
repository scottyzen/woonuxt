<script setup lang="ts">
import type { ProductAttribute, ProductVariationFragment, VariationAttribute } from '#types/gql';

interface Props {
  attributes: ProductAttribute[];
  defaultAttributes?: { nodes: VariationAttribute[] } | null;
  variations?: ProductVariationFragment[] | null;
}

const { attributes, defaultAttributes, variations } = defineProps<Props>();
const emit = defineEmits(['attrs-changed']);

const selections = ref<Record<string, string>>({});

const primaryAttribute = computed(() => {
  if (!attributes?.length) return null;
  return attributes.find((attr) => ['pa_color', 'color'].includes(attr?.name || '')) ?? attributes[0];
});

const primarySelection = computed(() => {
  const primary = primaryAttribute.value;
  const name = primary?.name || '';
  if (!name) return '';
  return selections.value[name] ?? '';
});

const normalizeMatchToken = (name?: string | null): string =>
  (name ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s-_]+/g, '');

const stripPaPrefix = (name?: string | null): string =>
  (name ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/^pa[_-]/, '');

const normalizeMatchKey = (name?: string | null): string => normalizeMatchToken(stripPaPrefix(name));

const normalizeMatchValue = (value?: string | null): string => normalizeMatchToken(value);

const toSelectionName = (name?: string | null): string => {
  if (!name) return '';
  return name.charAt(0).toLowerCase() + name.slice(1);
};

const toHintLabel = (label?: string | null): string => (label ?? '').toString().trim().toLowerCase();

const getSelectionHint = (attr: ProductAttribute): string => {
  const primary = primaryAttribute.value;
  if (!primary || primary === attr) return '';
  if (primarySelection.value) return '';

  const primaryLabel = toHintLabel(primary.label ?? primary.name);
  const attrLabel = toHintLabel(attr.label ?? attr.name);
  if (!primaryLabel || !attrLabel) return '';

  return `Select ${primaryLabel} to see available ${attrLabel}`;
};

const getSelectedName = (attr: ProductAttribute, value?: string) => {
  if (!value) return '';
  if ('terms' in attr && attr?.terms?.nodes?.length) {
    return attr.terms.nodes.find((node: { slug?: string | null; name?: string | null }) => node?.slug === value)?.name ?? value;
  }

  return value;
};

const emitSelection = () => {
  const selectedVariations = attributes.map(
    (row): VariationAttribute => ({
      name: toSelectionName(row?.name),
      value: selections.value[row?.name ?? ''] ?? '',
    }),
  );

  emit('attrs-changed', selectedVariations);
};

const buildSelectionMap = (source: Record<string, string>, excludeName?: string): Record<string, string> => {
  const map: Record<string, string> = {};
  Object.entries(source).forEach(([key, value]) => {
    if (excludeName && key === excludeName) return;
    const normalizedKey = normalizeMatchKey(key);
    const normalizedValue = normalizeMatchValue(value);
    if (!normalizedKey || !normalizedValue) return;
    map[normalizedKey] = normalizedValue;
  });
  return map;
};

const normalizedVariations = computed(() => {
  if (!variations?.length) return [];
  return variations.map((variation) => {
    const attrs: Record<string, string> = {};
    variation?.attributes?.nodes?.forEach((attr: VariationAttribute) => {
      const key = normalizeMatchKey(attr.name);
      if (!key) return;
      attrs[key] = normalizeMatchValue(attr.value);
    });
    const specificity = Object.values(attrs).filter(Boolean).length;
    return { variation, attrs, specificity };
  });
});

const isOptionEnabled = (attrName: string, optionValue: string, source: Record<string, string> = selections.value): boolean => {
  if (!variations?.length) return true;
  const attrKey = normalizeMatchKey(attrName);
  const optionKey = normalizeMatchValue(optionValue);
  if (!attrKey || !optionKey) return true;

  const selectedMap = buildSelectionMap(source, attrName);

  return normalizedVariations.value.some((candidate) => {
    for (const [key, value] of Object.entries(selectedMap)) {
      const candidateValue = candidate.attrs[key];
      if (!candidateValue) continue;
      if (candidateValue !== value) return false;
    }

    const candidateAttrValue = candidate.attrs[attrKey];
    if (!candidateAttrValue) return true;
    return candidateAttrValue === optionKey;
  });
};

const matchesSelection = (candidateAttrs: Record<string, string>, source: Record<string, string>): boolean => {
  const selectedMap = buildSelectionMap(source);
  if (Object.keys(selectedMap).length === 0) return true;

  for (const [key, value] of Object.entries(selectedMap)) {
    const candidateValue = candidateAttrs[key];
    if (!candidateValue) continue;
    if (candidateValue !== value) return false;
  }

  return true;
};

const hasValidCombination = (source: Record<string, string>): boolean => {
  if (!variations?.length) return true;
  return normalizedVariations.value.some((candidate) => matchesSelection(candidate.attrs, source));
};

const findBestVariationForSelection = (source: Record<string, string>, requiredKey?: string): ProductVariationFragment | null => {
  if (!variations?.length) return null;
  const selectedMap = buildSelectionMap(source);
  if (requiredKey && !selectedMap[requiredKey]) return null;

  let best: { variation: ProductVariationFragment; score: number } | null = null;

  for (const candidate of normalizedVariations.value) {
    if (requiredKey) {
      const requiredValue = selectedMap[requiredKey];
      const candidateValue = candidate.attrs[requiredKey];
      if (candidateValue && candidateValue !== requiredValue) continue;
    }

    let matches = true;
    let matchedSpecific = 0;
    let mismatchedSpecific = 0;

    for (const [key, value] of Object.entries(selectedMap)) {
      const candidateValue = candidate.attrs[key];
      if (!candidateValue) continue;
      if (candidateValue !== value) {
        if (!requiredKey || key === requiredKey) {
          matches = false;
          break;
        }
        mismatchedSpecific += 1;
        continue;
      }
      if (candidateValue === value) matchedSpecific += 1;
    }

    if (!matches) continue;

    const score = matchedSpecific * 100 + candidate.specificity - mismatchedSpecific * 10;
    if (!best || score > best.score) {
      best = { variation: candidate.variation, score };
    }
  }

  return best?.variation ?? null;
};

const applyVariationSelections = (variation: ProductVariationFragment, source: Record<string, string>): Record<string, string> => {
  if (!variation?.attributes?.nodes) return source;

  const next = { ...source };
  const attrNodes = variation.attributes?.nodes;
  if (!attrNodes) return next;
  attributes.forEach((attr) => {
    const key = attr?.name ?? '';
    if (!key) return;

    const matchKey = normalizeMatchKey(key);
    const matchingAttr = attrNodes.find((variationAttr: VariationAttribute) => normalizeMatchKey(variationAttr.name) === matchKey);
    if (!matchingAttr) return;

    next[key] = matchingAttr.value ?? '';
  });

  return next;
};

const resolveInvalidSelections = (source: Record<string, string>, options: { allowEmpty?: boolean; preferClear?: boolean } = {}): Record<string, string> => {
  const allowEmpty = options.allowEmpty ?? true;
  const preferClear = options.preferClear ?? true;
  let next = { ...source };
  let changed = true;
  let guard = 0;

  while (changed && guard < 5) {
    guard += 1;
    changed = false;

    attributes.forEach((attr) => {
      const key = attr?.name ?? '';
      if (!key) return;

      const currentValue = next[key];
      if (currentValue && isOptionEnabled(key, currentValue, next)) return;
      if (!currentValue && allowEmpty) return;

      const options =
        attr.scope === 'LOCAL'
          ? (attr.options ?? []).filter((option): option is string => !!option)
          : ('terms' in attr ? (attr.terms?.nodes ?? []) : []).map((term) => term?.slug).filter((slug): slug is string => !!slug);

      const fallback = options.find((option) => isOptionEnabled(key, option, next)) ?? '';
      const nextValue = preferClear && currentValue ? '' : fallback;
      if (nextValue !== currentValue) {
        next = { ...next, [key]: nextValue };
        changed = true;
      }
    });
  }

  return next;
};

const handleSelectionChange = (changedKey?: string) => {
  if (!variations?.length) {
    emitSelection();
    return;
  }

  if (hasValidCombination(selections.value)) {
    emitSelection();
    return;
  }

  const requiredKey = changedKey ? normalizeMatchKey(changedKey) : undefined;
  const best = findBestVariationForSelection(selections.value, requiredKey);
  if (best) {
    selections.value = applyVariationSelections(best, selections.value);
    emitSelection();
    return;
  }

  const resolved = resolveInvalidSelections(selections.value, { allowEmpty: true, preferClear: true });
  const resolvedKeys = Object.keys(resolved);
  const currentKeys = Object.keys(selections.value);
  const hasChanges = resolvedKeys.length !== currentKeys.length || resolvedKeys.some((key) => selections.value[key] !== resolved[key]);

  if (hasChanges) {
    selections.value = resolved;
  }

  emitSelection();
};

const setInitialSelections = () => {
  const defaults = new Map<string, string>();
  defaultAttributes?.nodes?.forEach((attr: VariationAttribute) => {
    const key = normalizeMatchKey(attr.name);
    if (key) defaults.set(key, attr.value ?? '');
  });

  const nextSelections: Record<string, string> = { ...selections.value };
  attributes.forEach((attr) => {
    const key = attr?.name ?? '';
    if (!key) return;

    const matchKey = normalizeMatchKey(key);
    const defaultValue = defaults.get(matchKey);
    if (defaultValue !== undefined) {
      nextSelections[key] = defaultValue ?? '';
      return;
    }
  });

  const resolved = resolveInvalidSelections(nextSelections, { allowEmpty: true, preferClear: true });
  const currentKeys = Object.keys(selections.value);
  const resolvedKeys = Object.keys(resolved);
  const hasChanges = currentKeys.length !== resolvedKeys.length || resolvedKeys.some((key) => selections.value[key] !== resolved[key]);

  if (!hasChanges) return;

  selections.value = resolved;
  emitSelection();
};

const className = (name: string) => (name ? `name-${name.toLowerCase().split(' ').join('-')}` : '');

watch(
  () => [attributes, defaultAttributes, variations],
  () => setInitialSelections(),
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="flex flex-col justify-between gap-1" v-if="attributes">
    <div v-for="(attr, i) in attributes" :key="i" class="relative flex flex-wrap justify-between py-2">
      <!-- LOCAL -->
      <div v-if="attr.scope == 'LOCAL'" class="grid gap-2">
        <div class="text-sm dark:text-gray-300">
          {{ attr.label || attr.name }}
          <span v-if="selections[attr.name || '']" class="text-gray-400 dark:text-gray-500">: {{ getSelectedName(attr, selections[attr.name || '']) }}</span>
        </div>
        <div v-if="getSelectionHint(attr)" class="text-xs text-gray-400 dark:text-gray-500">
          {{ getSelectionHint(attr) }}
        </div>
        <div class="flex gap-2">
          <span v-for="(option, index) in (attr.options || []).filter((option): option is string => !!option)" :key="index">
            <label :for="`${option}_${index}`">
              <input
                :id="`${option}_${index}`"
                class="hidden"
                type="radio"
                :class="className(attr.name || '')"
                :name="attr.name || ''"
                :value="option"
                v-model="selections[attr.name || '']"
                :aria-disabled="!isOptionEnabled(attr.name || '', option)"
                @change="handleSelectionChange(attr.name || '')" />
              <span
                class="radio-button"
                :class="[`picker-${option}`, { 'is-disabled': !isOptionEnabled(attr.name || '', option) }]"
                :title="`${attr.label || attr.name}: ${option}`"
                >{{ option }}</span
              >
            </label>
          </span>
        </div>
      </div>

      <!-- COLOR SWATCHES -->
      <div v-else-if="attr.name == 'pa_color' || attr.name == 'color'" class="grid gap-2">
        <div class="text-sm">
          {{ $t('general.color') }}
          <span v-if="selections[attr.name || '']" class="text-gray-400">{{ getSelectedName(attr, selections[attr.name || '']) }}</span>
        </div>
        <div v-if="getSelectionHint(attr)" class="text-xs text-gray-400 dark:text-gray-500">
          {{ getSelectionHint(attr) }}
        </div>
        <div class="flex gap-2">
          <span
            v-for="(term, termIndex) in 'terms' in attr && attr.terms?.nodes ? attr.terms.nodes.filter((term) => term?.slug) : []"
            :key="term.slug || termIndex">
            <Tooltip :text="term.name || ''">
              <label :for="`${term.slug || ''}_${termIndex}`">
                <input
                  :id="`${term.slug || ''}_${termIndex}`"
                  class="hidden"
                  type="radio"
                  :class="className(attr.name || '')"
                  :name="attr.name || ''"
                  :value="term.slug || ''"
                  v-model="selections[attr.name || '']"
                  :aria-disabled="!isOptionEnabled(attr.name || '', term.slug || '')"
                  @change="handleSelectionChange(attr.name || '')" />
                <span
                  class="color-button"
                  :class="[`color-${term.slug}`, { 'is-disabled': !isOptionEnabled(attr.name || '', term.slug || '') }]"
                  :title="`${attr.label || attr.name}: ${term.name || term.slug}`"></span>
              </label>
            </Tooltip>
          </span>
        </div>
      </div>

      <!-- DROPDOWN -->
      <div v-else-if="'terms' in attr && (attr.terms?.nodes?.length || 0) > 8" class="grid gap-2">
        <div class="text-sm dark:text-gray-300">
          {{ attr.label || attr.name }}
          <span v-if="selections[attr.name || '']" class="text-gray-400 dark:text-gray-500">{{ getSelectedName(attr, selections[attr.name || '']) }}</span>
        </div>
        <div v-if="getSelectionHint(attr)" class="text-xs text-gray-400 dark:text-gray-500">
          {{ getSelectionHint(attr) }}
        </div>
        <select
          :id="attr.name || ''"
          :name="attr.name || ''"
          required
          class="border-white shadow-xs select dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          v-model="selections[attr.name || '']"
          @change="handleSelectionChange(attr.name || '')">
          <option disabled hidden>{{ $t('general.choose') }} {{ decodeURIComponent(attr.label || attr.name || '') }}</option>
          <option
            v-for="(term, dropdownIndex) in 'terms' in attr && attr.terms?.nodes ? attr.terms.nodes.filter((term) => term?.slug) : []"
            :key="term.slug || dropdownIndex"
            :value="term.slug || ''"
            :aria-disabled="!isOptionEnabled(attr.name || '', term.slug || '')"
            v-html="term.name" />
        </select>
      </div>

      <!-- CHECKBOXES -->
      <div v-else class="grid gap-2">
        <div class="text-sm dark:text-gray-300">
          {{ attr.label || attr.name }}
          <span v-if="selections[attr.name || '']" class="text-gray-400 dark:text-gray-500">: {{ getSelectedName(attr, selections[attr.name || '']) }}</span>
        </div>
        <div v-if="getSelectionHint(attr)" class="text-xs text-gray-400 dark:text-gray-500">
          {{ getSelectionHint(attr) }}
        </div>
        <div class="flex gap-2">
          <span v-for="(term, index) in 'terms' in attr && attr.terms?.nodes ? attr.terms.nodes.filter((term) => term?.slug) : []" :key="term.slug || index">
            <label :for="`${term.slug}_${index}`">
              <input
                :id="`${term.slug}_${index}`"
                class="hidden"
                type="radio"
                :class="className(attr.name || '')"
                :name="attr.name || ''"
                :value="term.slug || ''"
                v-model="selections[attr.name || '']"
                :aria-disabled="!isOptionEnabled(attr.name || '', term.slug || '')"
                @change="handleSelectionChange(attr.name || '')" />
              <span
                class="radio-button"
                :class="[`picker-${term.slug}`, { 'is-disabled': !isOptionEnabled(attr.name || '', term.slug || '') }]"
                :title="`${attr.label || attr.name}: ${term.slug}`"
                >{{ term.name }}</span
              >
            </label>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@reference "#tailwind";

.radio-button {
  @apply border-white dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 border-2 text-sm text-center outline-2 outline-gray-100 dark:outline-gray-600 py-1.5 px-3 transition-all text-gray-800 dark:text-gray-200 inline-block hover:outline-gray-500;
}

.radio-button.is-disabled {
  @apply opacity-40 hover:outline-gray-100 dark:hover:outline-gray-600;
}

.color-button {
  @apply border-white dark:border-gray-700 cursor-pointer bg-gray-50 border-2 rounded-2xl text-sm text-center outline-2 outline-gray-100 dark:outline-gray-600 transition-all text-gray-800 inline-block hover:outline-gray-500;
  width: 2rem;
  height: 2rem;
}

.color-button.is-disabled {
  @apply opacity-40 hover:outline-gray-100 dark:hover:outline-gray-600;
}

.color-green {
  @apply bg-green-500;
}

.color-blue {
  @apply bg-blue-500;
}

.color-red {
  @apply bg-red-500;
}

.color-yellow {
  @apply bg-yellow-500;
}

.color-orange {
  @apply bg-orange-500;
}

.color-purple {
  @apply bg-purple-500;
}

.color-black {
  @apply bg-black;
}

input[type='radio']:checked ~ span {
  @apply outline-2 outline-gray-500 dark:outline-gray-300;
}
</style>
