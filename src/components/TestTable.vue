<script lang="ts">
let x = 'this "is" a test'

export default {
  data() {
    return {
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
        {
          name: "Cupcake",
          calories: 305,
        },
        {
          name: "Gingerbread",
          calories: 356,
        },
        {
          name: "Jelly bean",
          calories: 375,
        },
        {
          name: "Lollipop",
          calories: 392,
        },
        {
          name: "Honeycomb",
          calories: 408,
        },
        {
          name: "Donut",
          calories: 452,
        },
        {
          name: "KitKat",
          calories: 518,
        },
      ],
    }
  },
}
</script>

<template>
  <div style="width: 100%; overflow-x: auto">
    <table style="min-width: 80em" class="gns">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Name 2</th>
          <th class="text-left">Name 3</th>
          <th class="text-left">Calories</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>
          <td>Edit Delete</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.gns {
  background-color: red;
}
</style>
