# Vueform Select All Checkboxes Plugin

This plugin enables complex "Select All" logic for Vueform. It handles bi-directional synchronization (Parent $\leftrightarrow$ Child) and prevents infinite loops using an internal locking mechanism. It supports standard checkboxes, checkbox groups, and nested structures.

## 📦 Installation

### 1. Create the Plugin File
Create a file named `CheckboxSelectAll.js` inside your plugins directory (e.g., `./vueform/plugins/CheckboxSelectAll.js`) and paste the plugin code into it.

### 2. Register in `vueform.config.js`
Import the plugin and add it to the `plugins` array in your Vueform configuration file.

```javascript
// vueform.config.js
import en from "@vueform/vueform/locales/en";
import vueform from "@vueform/vueform/dist/vueform";
import { defineConfig } from "@vueform/vueform";
import "@vueform/vueform/dist/vueform.css";

// 1. Import the custom plugin
import CheckboxSelectAll from "./vueform/plugins/CheckboxSelectAll";

export default defineConfig({
  theme: vueform,
  locales: { en },
  locale: "en",
  
  // 2. Add it to the plugins array
  plugins: [
    CheckboxSelectAll
  ],
});
```

## ⚙️ Configuration & Concepts

To set up the logic, you only need to configure three properties in your schema.

### A. Downstream (Parent $\rightarrow$ Children)
**Used on the Parent (Controller).**
When the parent is clicked, it forces all defined children to match its state.

-   **Prop:** `controls`
-   **Type:** `Array<String>`
-   **Value:** A list of **full paths** to the child elements.

### B. Upstream (Child $\rightarrow$ Parent)
**Used on the Child (Controlled).**
When a child is changed, it checks if all its siblings are selected. If yes, it checks the parent. If no, it unchecks the parent.

-   **Prop:** `controller`
-   **Type:** `String`
-   **Value:** The **full path** to the parent element.

### C. Internal Group "All"
**Used strictly inside a `checkboxgroup`.**
It designates one specific option within the `items` array as the "Select All" for that specific group.

-   **Prop:** `groupController`
-   **Type:** `Boolean`
-   **Value:** `true`
-   **Location:** Inside an object in the `items` array.

---

## 🚀 Usage Examples

### Example 1: Standard Checkbox Controlling Others
A standalone "Select All" checkbox controlling separate checkbox elements.

```javascript
{
  // 1. The Parent
  selectAll: {
    type: 'checkbox',
    text: 'Select All',
    // Tell parent who to control (Downstream)
    // NOTE: Must be the full path to find the element via form$.el(fullPath)
    controls: ['container.option1', 'container.option2']
  },
  container: {
    type: 'group',
    schema: {
      // 2. The Children
      option1: {
        type: 'checkbox',
        text: 'Option 1',
        // Tell child who controls it (Upstream)
        controller: 'selectAll' 
      },
      option2: {
        type: 'checkbox',
        text: 'Option 2',
        // Tell child who controls it (Upstream)
        controller: 'selectAll'
      }
    }
  }
}
```

### Example 2: Parent Controlling a CheckboxGroup
A standalone checkbox controlling a whole group list.

```javascript
{
  // 1. The Parent
  selectAll: {
    type: 'checkbox',
    controls: ['myGroup'] // Points to the group element
  },

  // 2. The Child (Group)
  myGroup: {
    type: 'checkboxgroup',
    controller: 'selectAll', // Points back to parent
    items: [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' }
    ]
  }
}
```

### Example 3: CheckboxGroup with Internal "Select All"
A group that contains its own "All" option inside the list.

```javascript
{
  myGroup: {
    type: 'checkboxgroup',
    items: [
      // 1. The Internal Controller
      { 
        value: 'all', 
        label: 'Select All', 
        groupController: true // <--- The Magic Prop
      },
      // 2. The Siblings
      { value: 'a', label: 'Item A' },
      { value: 'b', label: 'Item B' }
    ]
  }
}
```

### Example 4: Complex Nested Structure
A group that contains its own "All" option inside the list, and a main checkbox controlling the group.

```javascript
{
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
}
```
