<script>
  import "../../app.scss";
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file

</script>



<div class="container mx-auto">
  <slot />
</div>


<style lang="scss" >
:global(.card) {
  @apply border-black border-4 rounded-lg p-2 m-2 flex flex-col;
  box-shadow: 5px 5px 0px 0px #000000;

  &:has(header){
    @apply mt-10;
  }
  :global(header) {
    position: relative;
    @apply border-black border-4 rounded-full p-2 m-2 bg-yellow-400 self-center;
    @apply text-center text-2xl font-bold;
    @apply -mt-10 min-w-[30%] px-10;
    box-shadow: 5px 5px 0px 0px #000000;
  }
}

:global(.btn) {
  user-select: none;
  @apply border-black border-4 rounded-lg p-2 m-2  flex flex-row justify-center ;
  box-shadow: 5px 5px 0px 0px #000000;

  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  &:hover {
    transform: translate(-2px, -2px);
    @apply border-black border-4 rounded-lg;
    box-shadow: 7px 7px 0px 0px #000000;
  }

  &:active {
    transform: translate(0px, 0px);
    @apply border-black border-4 rounded-lg;
    box-shadow: 5px 5px 0px 0px #000000;
  }
}

</style>

