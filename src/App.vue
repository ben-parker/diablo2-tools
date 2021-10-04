<template>
	<div id="app">
		<nav-sidebar class="sidebar" />
		<div id="page-wrapper" class="page-wrapper">
			<div id="content" class="content">
				<router-view />
			</div>
		</div>
	</div>
</template>

<script>
import NavSidebar from "./components/NavSidebar.vue";

export default {
	name: "App",
	components: {
		NavSidebar,
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	display: grid;
	grid-template-columns: 225px 1fr;
	column-gap: 10px;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
