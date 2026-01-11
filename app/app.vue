<script setup>
const schema = {
  selectAllText: {
    type: "static",
    tag: "p",
    content: "<div>Select Fields to be Exported</div>",
    columns: { container: 9 },
  },

  // --- MAIN CONTROLLER ---
  selectAll: {
    type: "checkbox",
    text: "All Fields",
    columns: { container: 3 },
    align: "left",
    // EXTERNAL CONTROL: Controls the two groups
    controls: [
      "container.reqDetailsCheckboxes",
      "container.reqFieldsCheckboxes",
    ],
  },

  container: {
    type: "group",
    class: "dimBackground_50 scrollable",
    schema: {
      reqDetailsLabel: {
        type: "static",
        tag: "p",
        content: "<p>Requisition Details</p>",
      },

      // --- GROUP 1 ---
      reqDetailsCheckboxes: {
        type: "checkboxgroup",
        class: "flex-container",
        // EXTERNAL LINK: Points to Main Controller
        controller: "selectAll",
        items: [
          {
            // INTERNAL CONTROL: Marks this as the group's "All" button
            value: "0",
            label: "All",
            groupController: true,
          },
          { value: "1", label: "Requisition ID" },
          { value: "2", label: "Date Created" },
        ],
      },

      reqFieldsLabel: {
        type: "static",
        tag: "p",
        content: "<p>Requisition Fields</p>",
      },

      // --- GROUP 2 ---
      reqFieldsCheckboxes: {
        type: "checkboxgroup",
        class: "flex-container",
        // EXTERNAL LINK: Points to Main Controller
        controller: "selectAll",
        items: [
          {
            // INTERNAL CONTROL
            value: "0",
            label: "All",
            groupController: true,
          },
          { value: "1", label: "Field ID" },
          { value: "2", label: "Field Created" },
        ],
      },
    },
  },

  saveSelections: {
    type: "checkbox",
    text: "Save My Selections",
  },
};

const formData = ref(null);
</script>
<template>
  <div class="container">
    <ClientOnly>
      <div class="wrapper">
        <Vueform v-model="formData" :schema="schema" />
      </div>
      <pre class="dimBackground_50">
        {{ formData }}
      </pre>
    </ClientOnly>
  </div>
</template>
<!-- Ignore these -->
<style>
.container {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap-reverse;
  gap: 2rem;
}

.wrapper {
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
}

.dimBackground_50 {
  background-color: #f5f5f5;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.flex-container {
  & .vf-checkboxgroup-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  & .vf-checkbox-container {
    flex: 1;
  }
}

.vf-checkbox-text {
  white-space: nowrap;
}

pre {
  white-space: pre-wrap;
}
</style>
<!-- Ignore these -->
