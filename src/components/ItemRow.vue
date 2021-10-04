<template>
	<tr>
		<td>{{ item.name }}</td>
		<td>{{ item.reqStr || "-" }}</td>
		<td>{{ item.reqDex || "-" }}</td>
		<td>{{ item.reqLvl || "-" }}</td>
		<td>{{ item | levelDisplay }}</td>
	</tr>
</template>

<script>
export default {
	name: "ItemRow",
	props: ["item"],
	filters: {
		levelDisplay(value) {
			if (value.maxClvl <= value.minClvl) {
				return value.minClvl;
			}

			return `${value.minClvl}-${value.maxClvl}`;
		}
	}
};
</script>

<style></style>
