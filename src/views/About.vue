<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>


<script lang="ts">
	import { defineComponent } from 'vue';
	import { gb } from "@/global";
	import 'primeicons/primeicons.css';

	//gb.siteName = '33333'

	export default defineComponent({
		name: 'About',
		data(){
			console.log(gb)
			return {
				test: gb.siteName
			}
		},
	});
</script>
