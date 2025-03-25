<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-more-horizontal"
  >
    <circle cx="12" cy="12" r="1" class="dot dot-1"></circle>
    <circle cx="19" cy="12" r="1" class="dot dot-2"></circle>
    <circle cx="5" cy="12" r="1" class="dot dot-3"></circle>
  </svg>
</template>

<style scoped>
.dot {
  transform-origin: center;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot-1 {
  animation-delay: -0.32s;
}

.dot-2 {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: translateY(0);
  }
  40% { 
    transform: translateY(-4px);
  }
}
</style> 