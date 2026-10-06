<script setup lang="ts">
const colorMode = useColorMode();

const modes = ["light", "dark", "system"];

const currentPref = computed(() => colorMode.preference || "system");

const nextPref = computed(() => {
  const currentIndex = modes.indexOf(currentPref.value as string);
  return modes[(currentIndex + 1) % modes.length];
});

const switchTheme = () => {
  colorMode.preference = nextPref.value as "light" | "dark" | "system";
};

const startViewTransition = (event: MouseEvent) => {
  if (!document.startViewTransition) {
    switchTheme();
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    switchTheme();
  });

  transition.ready.then(() => {
    const duration = 600;
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: duration,
        easing: "cubic-bezier(.76,.32,.29,.99)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
};
</script>

<template>
  <ClientOnly>
    <UButton
      :aria-label="`Switch to ${nextPref} mode`"
      :icon="`i-lucide-${currentPref === 'light' ? 'sun' : currentPref === 'dark' ? 'moon' : 'monitor'}`"
      color="neutral"
      variant="ghost"
      size="sm"
      class="rounded-full"
      @click="startViewTransition"
    />
    <template #fallback>
      <div class="size-4" />
    </template>
  </ClientOnly>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  z-index: 9999;
}
::view-transition-old(root) {
  z-index: 1;
}
</style>
