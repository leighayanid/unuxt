<script setup lang="ts">
interface Props {
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 0.5,
  direction: "up",
});

const offset = computed(() => {
  switch (props.direction) {
    case "up":
      return { y: 20 };
    case "down":
      return { y: -20 };
    case "left":
      return { x: 20 };
    case "right":
      return { x: -20 };
    default:
      return { y: 20 };
  }
});
</script>

<template>
  <Motion
    :initial="{ opacity: 0, ...offset }"
    :animate="{ opacity: 1, x: 0, y: 0 }"
    :transition="{ duration, delay }"
  >
    <slot />
  </Motion>
</template>
