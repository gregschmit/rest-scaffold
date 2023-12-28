<script setup lang="ts"></script>

<template>
  <div class="rest-scaffold-topbar">
    <span class="rest-scaffold-head"></span>
    <sub class="rest-scaffold-secondary"></sub>
    <ul class="rest-scaffold-menu">
      <li><span class="rest-scaffold-spinner"></span></li>
    </ul>
  </div>
  <table>
    <tbody class="rest-scaffold-messages"></tbody>
  </table>
  <table>
    <thead class="rest-scaffold-headers"></thead>
    <tbody class="rest-scaffold-records"></tbody>
    <tfoot class="rest-scaffold-footer">
      <tr>
        <td>
          <span class="rest-scaffold-count"></span>
          <span class="rest-scaffold-pages"></span>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<style scoped></style>
