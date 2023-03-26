<script>
  import '@skeletonlabs/skeleton/themes/theme-crimson.css';
  import '@skeletonlabs/skeleton/styles/all.css';
	import { onMount, onDestroy } from 'svelte';


  
  onMount(() => {
    // Hack for dark mode in Skeleton
    window.document.documentElement.classList.add('dark');
  });

  onDestroy(() => {
    // Hack for dark mode in Skeleton 
    window.document.documentElement.classList.remove('dark');
  });
</script>


<div class="dark">
  <slot />
</div>