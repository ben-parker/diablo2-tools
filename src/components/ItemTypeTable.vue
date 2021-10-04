<template>
	<table>
		<thead>
			<th>item</th>
			<th>min str</th>
			<th>min dex</th>
			<th>req lvl</th>
			<th>imbue at char level</th>
		</thead>
		<tbody>
			<template v-for="(item, idx) in calcItems">
				<tr v-if="blankRows.includes(idx)" :key="idx"><td colspan="5"></td></tr>
				<item-row :key="item.name" :item="item" />
			</template>
		</tbody>
	</table>
</template>

<script>
import ItemRow from "./ItemRow.vue";

export default {
	components: { ItemRow },
	name: "ItemTypeTable",
	props: {
		items: {
			type: Array,
			required: true,
		},
		added: {
			type: Array,
			required: true,
		},
		affixes: {
			type: Array,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		maxAffixLevel: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
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
		};
	},
	methods: {
		findClvl(qlvl, mlvl, target) {
			for (let i = 8; i <= 99; i++) {
				const alvl = this.alvl(i, parseInt(qlvl), parseInt(mlvl));
				if (alvl >= target) return i;
			}

			return undefined;
		},
		alvl(clvl, qlvl, mlvl) {
			let alvl;
			let ilvl = Math.max(clvl, 8) + 4;

			if (ilvl > 99) ilvl = 99;
			if (qlvl > ilvl) ilvl = qlvl;

			if (mlvl > 0) {
				alvl = ilvl + mlvl;
			} else {
				alvl = ilvl < 99 - Math.floor(qlvl / 2) ? ilvl - Math.floor(qlvl / 2) : ilvl * 2 - 99;
			}

			if (alvl > 99) alvl = 99;

			return alvl;
		},
		nextHighestAffix(item, affixLevel) {
			// find min alvl of this qlvl (clvl 8)
			// if that is higher than nextAffixLevel, use that as the next affix level
			const minAlvl = this.alvl(8, item.qLvl, item.mLvl);

			const typeFiltered = this.affixes.filter(a =>
				a.itemTypes.some(it => this.affixTypeMatchesType(it))
			);

			const transformed = typeFiltered.map(a => ({
				name: a.name,
				effect: a.effect,
				itemType: a.itemTypes.find(it => this.affixTypeMatchesType(it)),
			}));

			const alvlFiltered = transformed.filter(
				t => parseInt(t.itemType.alvl) > Math.max(parseInt(affixLevel), minAlvl)
			);
			const sorted = alvlFiltered.sort((a, b) => a.itemType.alvl.localeCompare(b.itemType.alvl));
			const affix = sorted[0];

			return sorted.length > 0 ? affix : null;
		},
		affixTypeMatchesType(itemType) {
			if (itemType.type === this.type || itemType.type === this.type + "s") {
				return true;
			} else if (itemType.type === "Armor" && this.armorTypes.includes(this.type)) {
				return true;
			}

			return false;
		},
	},
	computed: {
		calcItems() {
			const results = new Array(this.items.length);
			for (let i = 0; i < this.items.length; i++) {
				const item = this.items[i];

				const reqLvl = Math.max(Math.floor(this.maxAffixLevel * 0.75), item.reqLvl || 0);
				const minClvl = this.findClvl(item.qLvl, item.mLvl, this.maxAffixLevel);

				const nextAffix = this.nextHighestAffix(item, this.maxAffixLevel);

				let maxClvl =
					nextAffix === null
						? 99
						: this.findClvl(item.qLvl, item.mLvl, nextAffix.itemType.alvl) - 1;

				results[i] = {
					...item,
					minClvl: minClvl,
					maxClvl: maxClvl,
					reqLvl: reqLvl,
					nextHighestAffix: nextAffix,
				};
			}

			return results;
		},
		blankRows() {
			if (this.items.length < 5) return [];

			const breakpoints = [];
			let lastTier = this.items[0].tier;
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].tier !== lastTier) {
					breakpoints.push(i);
					lastTier = this.items[i].tier;
				}
			}

			return breakpoints;
		},
	},
};
</script>

<style scoped>
table {
	table-layout: fixed;
	width: 100%;
	font: 8pt monospace;
	text-align: left;
}

td:empty::after {
	content: "\00a0";
}
</style>
