<template>
	<div>
		{{ affix.name }} ({{ affix.effect }})
		<span class="affix-type" :class="affix.affix">{{ affix.affix }}</span>
	</div>
</template>

<script>
export default {
    name: "AffixDisplay",
    props: [ "affix" ]
};
</script>

<style scoped>
    .affix-type {
        border-radius: 5px;
        padding: 3px;
        font-size: 8pt;
    }

    .prefix {
        background: lightblue;
    }

    .suffix {
        background: goldenrod;
    }
</style>
