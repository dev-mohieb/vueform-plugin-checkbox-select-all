import { watch, onMounted, nextTick } from "vue";

export default function CheckboxController() {
  return {
    apply: ["CheckboxElement", "CheckboxgroupElement"],
    props: {
      controls: { type: Array, default: null }, // External: Downstream
      controller: { type: String, default: null }, // External: Upstream
    },
    setup(props, context, component) {
      const { form$, el$ } = component;

      // --- Helpers ---
      const isComplete = (el) => {
        if (!el) return false;
        if (el.type === "checkbox") return el.value === true;
        if (el.type === "checkboxgroup") {
          // Complete if selected count equals total options count
          return el.value?.length > 0 && el.value?.length === el.items?.length;
        }
        return false;
      };

      const setElementState = (el, makeChecked) => {
        if (!el) return;
        if (el.type === "checkbox") {
          if (makeChecked && el.value !== true) el.check();
          if (!makeChecked && el.value !== false) el.uncheck();
        } else if (el.type === "checkboxgroup") {
          if (makeChecked && !isComplete(el)) el.checkAll();
          else if (!makeChecked && el.value?.length > 0) el.uncheckAll();
        }
      };

      onMounted(() => {
        nextTick(() => {
          // ---------------------------------------------------------
          // 1. EXTERNAL DOWNSTREAM (Main Controller -> This Element)
          // ---------------------------------------------------------
          if (props.controls && props.controls.length > 0) {
            watch(component.value, () => {
              if (el$.value.__locked) {
                el$.value.__locked = false;
                return;
              }
              const shouldCheck = isComplete(el$.value);
              props.controls.forEach((path) => {
                const child = form$.value.el$(path);
                if (child) setElementState(child, shouldCheck);
              });
            });
          }

          // ---------------------------------------------------------
          // 2. EXTERNAL UPSTREAM (This Element -> Main Controller)
          // ---------------------------------------------------------
          if (props.controller) {
            watch(component.value, () => {
              if (el$.value.__locked) {
                el$.value.__locked = false;
                return;
              }
              const parent = form$.value.el$(props.controller);
              if (!parent || !parent.controls) return;

              const allSiblingsChecked = parent.controls.every((path) => {
                const sibling = form$.value.el$(path);
                return sibling ? isComplete(sibling) : false;
              });

              const parentIsChecked = isComplete(parent);
              if (allSiblingsChecked !== parentIsChecked) {
                parent.__locked = true;
                setElementState(parent, allSiblingsChecked);
              }
            });
          }

          // ---------------------------------------------------------
          // 3. INTERNAL GROUP LOGIC (CheckboxGroup Only)
          // Handles the "All" option inside the items array
          // ---------------------------------------------------------
          if (el$.value.type === "checkboxgroup") {
            // Find the "All" option based on the custom property 'groupController'
            const controllerItem = el$.value.items.find(
              (option) => option.groupController
            );

            if (controllerItem) {
              const ctrlVal = controllerItem.value;
              const otherVals = el$.value.items
                .filter((i) => i.value !== ctrlVal)
                .map((i) => i.value);

              watch(component.value, (newVal, oldVal) => {
                // If locked by external logic, skip internal calculation
                if (el$.value.__lockedInternal) {
                  el$.value.__lockedInternal = false;
                  return;
                }

                // Determine what happened
                const wasChecked = oldVal.includes(ctrlVal);
                const isChecked = newVal.includes(ctrlVal);

                // Scenario A: User clicked "All" (Checked it)
                if (!wasChecked && isChecked) {
                  // Lock to prevent infinite recursion
                  el$.value.__lockedInternal = true;
                  el$.value.checkAll();
                  return;
                }

                // Scenario B: User clicked "All" (Unchecked it)
                if (wasChecked && !isChecked) {
                  el$.value.__lockedInternal = true;
                  el$.value.uncheckAll();
                  return;
                }

                // Scenario C: User clicked a Sibling (Check logic)
                const othersComplete = otherVals.every((v) =>
                  newVal.includes(v)
                );

                if (isChecked && !othersComplete) {
                  // "All" is checked, but a sibling is missing -> Uncheck "All"
                  el$.value.__lockedInternal = true;
                  el$.value.value = newVal.filter((v) => v !== ctrlVal);
                } else if (!isChecked && othersComplete) {
                  // "All" is unchecked, but all siblings are there -> Check "All"
                  el$.value.__lockedInternal = true;
                  el$.value.value = [...newVal, ctrlVal];
                }
              });
            }
          }
        });
      });

      return component;
    },
  };
}
