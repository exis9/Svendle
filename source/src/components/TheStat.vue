<template>
	<Dialog v-model:visible="bModalStat"
		:closeOnEscape="true"
		:dismissableMask="true"
	>
		<template #header>
			<h3>Header</h3>
		</template>

		Content

		<template #footer>
			<Button label="No" icon="pi pi-times" class="p-button-text"/>
			<Button @click="handleClick($event)" label="Yes" icon="pi pi-check" autofocus />
		</template>
	</Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { sq } from '../sq';

export default defineComponent({
	name: 'TheStat',
	mounted(){
		sq('body').html('vv')
	}
});
</script>

<style scoped lang="scss">
</style>
