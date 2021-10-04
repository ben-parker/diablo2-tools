<template>
	<div class="autocomplete-container">
		<input
			type="search"
            class="autocomplete"
			:placeholder="placeholder"
			v-model="searchText"
			@input="search"
			@focus="search"
			@blur="hide"
			ref="search"
		/>
		<ul class="autocomplete-results" v-show="results.length > 0 || noResults">
			<template v-if="noResults">
                <li>No results.</li>
            </template>
            <template v-else>
                <li v-for="(a, idx) in results" :key="a.name + a.effect" @mousedown="selected(idx)">
                    <affix-display :affix="a" />
                </li>
            </template>
		</ul>
	</div>
</template>

<script>
import AffixDisplay from "./AffixDisplay.vue"
export default {
	name: "Autocomplete",
    components: { AffixDisplay },
	props: {
		searchList: {
			type: Array,
			required: true,
		},
		placeholder: {
			type: String,
			required: false,
		},
        filter: {
            type: Function,
            required: false,
        }
	},
	data() {
		return {
			searchText: "",
            results: [],
            noResults: false,
		};
	},
	methods: {
		search() {
			this.errorMessage = "";
            this.noResults = false;
			if (this.searchText.length < 3) {
				this.results = [];
				return;
			}

			const results = this.searchList.filter(a => a.name.toLowerCase().includes(this.searchText.toLowerCase()) 
                                                    || a.effect.toLowerCase().includes(this.searchText.toLowerCase())
            );
				
            if (this.filter) {
                const filtered = results.filter(r => this.filter(r));
                this.results = filtered.slice(0, 15);
            } else {
                this.results = results.slice(0, 15);
            }

            if (this.results.length === 0) {
                this.noResults = true;
            }
		},
		selected(idx) {
            this.$emit('selected', this.results[idx]);
		},
		hide() {
			this.results = [];
            this.noResults = false;
		},
	},
};
</script>

<style scoped>
.autocomplete-results {
	position: absolute;
	background: white;
	font-size: 10pt;
	margin: 0;
	padding: 0;
	border: 1px solid green;
	border-top: none;
	z-index: 99;
	top: 100%;
	left: 0;
	right: 0;
}

.autocomplete-container {
	position: relative;
	display: inline-block;
}
</style>
