<template>
	<div class="cHr"></div>
	<section id="idFrame">
		<section line="0"><div></div><div></div><div></div><div></div><div></div></section>
		<section line="1"><div></div><div></div><div></div><div></div><div></div></section>
		<section line="2"><div></div><div></div><div></div><div></div><div></div></section>
		<section line="3"><div></div><div></div><div></div><div></div><div></div></section>
		<section line="4"><div></div><div></div><div></div><div></div><div></div></section>
		<section line="5"><div></div><div></div><div></div><div></div><div></div></section>
	</section>
	
	<TheGameKeyboard />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheGameKeyboard from '@/components/TheGameKeyboard.vue'; // @ is an alias to /src

export default defineComponent({
	name: 'TheGame',
	components: {
		TheGameKeyboard,
	},
	provide: {
		user: 'John'
	}
});
</script>

<style scoped lang="scss">
	@use "@/components/TheGame.scss"
</style>
