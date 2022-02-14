<script lang="ts">
  import { page } from '$app/stores';

  export let to: string;
  export let title: string;
</script>

<li><a class:active={$page.url.pathname === to} href={to}>{title}</a></li>

<style lang="scss">
  li:not(:first-child) {
    position: relative;
    &::before {
      content: '·';
      display: inline-block;
      width: 2em;
      position: absolute;
      left: -1em;
      pointer-events: none;
    }
  }

  a {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: calc(var(--spacing) * 0.75);
      left: calc(var(--spacing) * 0.5);
      right: calc(var(--spacing) * 0.5);
      height: 2px;
      background: var(--color);
      transform: scaleX(0);
      transition: transform 0.2s;
    }
  }

  .active::after {
    transform: scaleX(1);
  }
</style>
