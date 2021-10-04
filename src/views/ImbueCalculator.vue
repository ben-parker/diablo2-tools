<template>
	<div id="calculator-container">
		<div id="affix-search-container">
			<label for="affix-search">Search affixes</label>
			<autocomplete
				id="affix-search"
				placeholder="Search affixes..."
				:searchList="affixes"
				:filter="affix => !added.map(a => a.group).includes(affix.group)"
				display="affix-display"
				v-on:selected="selected"
			/>
			<div class="information">*Note: only results for Armor are shown at this time</div>
			<div class="error">{{ this.errorMessage }}</div>
		</div>
		<div id="added-affixes">
			<h4>Affix List</h4>
			<ul>
				<added-affix
					v-for="(a, idx) in added"
					:key="a.text"
					:affix="a"
					v-on:remove="removeAffix(idx)"
				/>
			</ul>
		</div>
		<div id="shared-item-types">
			<h4>Shared item types</h4>
			<ul>
				<li v-for="t in itemTypes" :key="t.type">{{ t.type }}</li>
			</ul>
		</div>
		<div id="calculate">
			<button @click="generateResults">Calculate</button>
			<button @click="reset">Reset</button>
		</div>

		<div id="results">
			<div v-for="(val, key) in results" :key="key">
				<h3>{{ key }}</h3>
				<item-type-table :items="val" :added="added" :type="key" :affixes="affixes" :maxAffixLevel="maxAffixLevels[key]" />
			</div>
		</div>
	</div>
</template>

<script>
import Autocomplete from "../components/Autocomplete.vue";
import ItemTypeTable from "../components/ItemTypeTable.vue";
import AddedAffix from "../components/AddedAffix.vue";

export default {
	name: "ImbueCalculator",
	components: { Autocomplete, ItemTypeTable, AddedAffix },
	data() {
		return {
			prefixes: [],
			suffixes: [],
			groups: [],
			added: [],
			errorMessage: "",
			// itemTypes: [],
			results: [],
			armorTypes: [
				"Body Armor",
				"Boots",
				"Gloves",
				"Helms",
				"Pelts",
				"Barbarian Helms",
				"Belts",
				"Shields",
				"Paladin Shields",
				"Heads",
			],
			maxAffixLevels: {},
		};
	},
	methods: {
		removeAffix(idx) {
			this.added.splice(idx, 1);
		},
		async generateResults() {
			// waiting
			const baseUrl = process.env.VUE_APP_BASE_URL;
			this.results = [];
			this.maxAffixLevels = {};
			const itemTypes = this.itemTypes.map(t => t.type);

			// load item information
			let response = await fetch(baseUrl + "/data/armor.json");
			let data = await response.json();
			const armor = data.armor; //.filter(a => a.types.some(this.itemTypes));
			const items = armor;

			const results = items.reduce((prev, cur) => {
				if (!cur.types) return prev;
				for (let i = 0; i < cur.types.length; i++) {
					const type = cur.types[i];
					if (itemTypes.includes(type) || itemTypes.includes(type + "s")) {
						(prev[type] = prev[type] || []).push(cur);
					}
				}
				return prev;
			}, {});

			for (const type of Object.keys(results)) {
				this.maxAffixLevels[type] = this.maxAffixLevel(type);
			}

			this.results = results;
			// not waiting
		},
		reset() {
			this.added = [];
			this.results = [];
			this.errorMessage = "";
		},
		expandArmorTypes(itemTypes) {
			const armorIdx = itemTypes.map(i => i.type).indexOf("Armor");
			if (armorIdx < 0) return itemTypes;

			const armor = itemTypes[armorIdx];
			let expandedArmor = new Array(this.armorTypes.length);

			for (let i = 0; i < this.armorTypes.length; i++) {
				expandedArmor[i] = { alvl: armor.alvl, rarity: armor.alvl, type: this.armorTypes[i] };
			}

			return [
				...itemTypes.slice(0, armorIdx),
				...expandedArmor,
				...itemTypes.slice(armorIdx + 1, itemTypes.length),
			];
		},
		addAffix(selected) {
			const prefixCnt = this.added.filter(a => a.affix === "prefix").length;
			const suffixCnt = this.added.filter(a => a.affix === "suffix").length;

			if (prefixCnt === 3 && selected.affix === "prefix") {
				this.errorMessage = "Max number of prefixes reached";
				return;
			}

			if (suffixCnt === 3 && selected.affix === "suffix") {
				this.errorMessage = "Max number of suffixes reached";
				return;
			}

			if (this.added.length > 0) {
				// if there is an affix already selected that works with "Armor"
				// but selected item only works with some armor types
				// replace Armor with armor types of incoming item
				// const curItemTypes = this.itemTypes.map(i => i.type);
				const curItemTypes = this.itemTypes.map(a => a.type);
				const selectedItemTypes = selected.itemTypes.map(i => i.type);

				if (
					curItemTypes.includes("Armor") &&
					!selectedItemTypes.includes("Armor") &&
					selectedItemTypes.some(s => this.armorTypes.indexOf(s) >= 0)
				) {
					// this.itemTypes = this.expandArmorTypes(this.itemTypes);

					// replace item types within "added" list
					for (let i = 0; i < this.added.length; i++) {
						this.added[i].itemTypes = this.expandArmorTypes(this.added[i].itemTypes);
					}
				}

				// same thing but if selected affix includes "Armor"
				// but already-selected ones do not
				if (
					selectedItemTypes.includes("Armor") &&
					!curItemTypes.includes("Armor") &&
					curItemTypes.some(c => this.armorTypes.indexOf(c) >= 0)
				) {
					selected.itemTypes = this.expandArmorTypes(selected.itemTypes);
				}
			}

			this.added.push(selected);
		},
		selected(selected) {
			this.errorMessage = "";
			this.addAffix(selected);

			if (this.itemTypes.length === 0) {
				this.added.pop();
				this.errorMessage = "Cannot add affix -- combination of affixes cannot exist on any item.";
			}
		},
		maxAffixLevel(itemType) {
			const alvls = [];
			for (let i = 0; i < this.added.length; i++) {
				let type = this.added[i].itemTypes.find(
					t => t.type === itemType || t.type === itemType + "s"
				);

				if (type) {
					alvls.push(parseInt(type.alvl) || 0);
				} else {
					console.error(`could not find ${itemType} in ${this.added[i].itemTypes}`);
					return "not found";
				}
			}

			return Math.max(...alvls);
		},
	},
	computed: {
		affixes() {
			if (this.prefixes.length === 0 || this.suffixes === 0) return [];

			const affixes = [...this.prefixes, ...this.suffixes];
			return affixes.sort((a, b) => a.effect.localeCompare(b.effect));
		},
		itemTypes() {
			if (this.added.length === 0) return [];

			if (this.added.length === 1) return this.added[0].itemTypes;
			
			let itemTypes = this.added[0].itemTypes;
			for (let i = 1; i < this.added.length; i++) {
				const filtered = itemTypes.filter(type =>
					this.added[i].itemTypes.map(it => it.type).includes(type.type)
				);

				itemTypes = filtered;
				if (itemTypes.length === 0) break;
			}

			return itemTypes;
		},
	},
	filters: {
		affixDisplay(affix) {
			return `${affix.name} (${affix.effect}), alvl ${affix.alvl}`;
		},
	},
	async mounted() {
		const baseUrl = process.env.VUE_APP_BASE_URL;
		const p = await fetch(baseUrl + "/data/prefixes.json");
		const s = await fetch(baseUrl + "/data/suffixes.json");
		const prefixes = await p.json();
		const suffixes = await s.json();

		this.prefixes = prefixes.prefixes.reduce((acc, p) => {
			const types = p.itemTypes.filter(it => it.rarity === "rare");
			if (types.length > 0) {
				acc.push(({...p, itemTypes: types, affix: "prefix"}));
			}
			return acc;
		}, []);
		this.suffixes = suffixes.suffixes.reduce((acc, s) => {
			const types = s.itemTypes.filter(it => it.rarity === "rare");
			if (types.length > 0) {
				acc.push(({...s, itemTypes: types, affix: "suffix"}));
			}
			return acc;
		}, []);
	},
};
</script>

<style>
label {
	display: block;
	font-weight: bold;
	font-size: 10pt;
}

#calculator-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-areas:
		"search search"
		"added itemtypes"
		"calculate calculate"
		"results results";
	row-gap: 10px;
	column-gap: 20px;
}

#affix-search-container {
	grid-area: search;
}

#shared-item-types {
	grid-area: itemtypes;
}

#results {
	grid-area: results;
}

#added-affixes {
	grid-area: added;
}
#calculate {
	grid-area: calculate;
	justify-self: center;
}

input.autocomplete {
	width: 100%;
}

ul {
	margin: 0;
	padding-left: 10px;
}

li {
	list-style: none;
}
.autocomplete-container {
	width: 50%;
}

ul.autocomplete-results li {
	text-align: left;
	list-style: none;
	padding-top: 2px;
	padding-bottom: 2px;
}

ul.autocomplete-results li:hover {
	background: lightblue;
	cursor: pointer;
}

.error {
	color: red;
}

h4 {
	margin: 0;
	margin-top: 10px;
	margin-bottom: 10px;
}

button {
	margin: 10px;
}

.remove {
	color: red;
	margin-left: auto;
}

.added-affix {
	display: flex;
	margin-bottom: 10px;
}

.information {
	font-size: 8pt;
	font-style: italic;
}
</style>
