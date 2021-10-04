<template>
	<div>
        <p>Calculate the maximum affix level of an imbued item.</p>
        <p>The affix level of an item determines which prefixes and suffixes can spawn on it.  Any affix with an affix level less than or equal to the item's affix level may show up.  When imbuing, the affix level of the resultant item is determined by your character's level and some internal properties of the item you give to Charsi.</p>
		<div class="content-wrapper">
            <div id="calc-wrapper">
                <label for="clvl">Character Level</label>
                <input type="number" id="clvl" min="8" max="99" placeholder="8-99" v-model="clvl" />
                <label for="qlvl">Item qlvl</label>
                <input type="number" id="qlvl" min="1" max="99" v-model="qlvl" />
                <label for="mlvl">Item Magic Level</label>
                <input type="number" id="mlvl" min="0" max="99" v-model="mlvl" />
            </div>
            <h3 v-show="alvl && this.clvl.length > 0">Calculated alvl is {{ alvl }}</h3>
        </div>

	</div>
</template>

<script>
export default {
	name: "SimpleImbueCalculator",
	data() {
		return {
			clvl: "",
			qlvl: "",
			mlvl: "",
		};
	},
	computed: {
		alvl() {
			let alvl;
			let clvl = parseInt(this.clvl) || 1;
			let qlvl = parseInt(this.qlvl) || 0;
			let mlvl = parseInt(this.mlvl) || 0;

			let ilvl = Math.max(clvl, 1) + 4;

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
	},
};
</script>

<style scoped>
.content-wrapper {
    text-align: center;
}

#calc-wrapper {
	display: grid;
	grid-template-columns: 150px 40px;
    justify-content: center;
	row-gap: 10px;
}

input[type="number"] {
	-moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}

</style>
