<template>
	<li class="added-affix">
		<affix-display :affix="affix" />
		<span class="remove" @click="remove">X</span>
	</li>
</template>

<script>
import AffixDisplay from "./AffixDisplay.vue";
export default {
	name: "AddedAffix",
	components: { AffixDisplay },
    props: ["affix"],
	methods: {
		remove() {
			this.$emit("remove");
		},
	},
};
</script>

<style scoped>
.remove {
    cursor: pointer;
}
</style>
