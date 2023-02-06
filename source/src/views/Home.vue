<template>
	<TheGame/>
	<router-view/>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import TheGame from '@/components/TheGame.vue'; // @ is an alias to /src
	
	export default defineComponent({
		name: 'Home',
		components: {
			TheGame,
		},
	});
</script>
