<template>
	<nav id="sidebar" class="sidebar">
		<div class="sidebar-scrollbox">
            <ol class="toc">
                <li class="chapter"><router-link :to="{ name: 'home' }"><strong>Diablo 2 Tools</strong></router-link></li>
                <li class="chapter"><a href="#">Imbuing</a></li>
                <li class="section"><router-link :to="{ name: 'imbue-calculator' }">Imbue Level Calculator</router-link></li>
                <li class="section"><router-link :to="{ name: 'simple-imbue-calculator' }">Imbue Affix Level Calculator</router-link></li>
            </ol>
        </div>
        <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
	</nav>
</template>

<script>
export default {
	name: "NavSidebar",
};
</script>

<style>
.toc {
    list-style: none outside none;
    padding-left: 0;
    line-height: 1.5em;
}

.toc li {
    display: flex;
}

.toc li a {
    display: block;
    padding: 0;
    text-decoration: none;
}

.toc li.section {
    margin-left: 10px;
}
.sidebar {
  background: #f7f7f7;

}
</style>
