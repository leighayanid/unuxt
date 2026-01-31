<script setup lang="ts">
interface Props {
  delay?: number;
  duration?: number;
  distance?: number;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 0.6,
  distance: 30,
});
</script>

<template>
  <Motion
    :initial="{ opacity: 0, y: distance }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{
      duration,
      delay,
      type: 'spring',
      stiffness: 100,
      damping: 15,
    }"
  >
    <slot />
  </Motion>
</template>
