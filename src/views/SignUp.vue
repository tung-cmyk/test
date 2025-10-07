<template>
  <div class="card flex justify-center">
    <Form
      :resolver
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full sm:w-56"
    >
      <FormField
        v-slot="$field"
        name="username"
        initialValue=""
        class="flex flex-col gap-1"
      >
        <input
          type="text"
          placeholder="Username"
          :class="[{ error: $field?.invalid }]"
          v-bind="$field.props"
        />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $field.error?.message }}</Message
        >
      </FormField>
      <FormField
        v-slot="$field"
        name="password"
        initialValue="PrimeVue"
        class="flex flex-col gap-1"
      >
        <input
          v-model="$field.value"
          type="password"
          placeholder="Password"
          :class="[{ error: $field?.invalid }]"
          @input="$field.onInput"
          @blur="$field.onBlur"
          @change="$field.onChange"
        />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $field.error?.message }}</Message
        >
      </FormField>
      <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: "Username is required." }),
    password: z.string().min(1, { message: "Password is required." }),
  })
);

const onFormSubmit = ({ valid }) => {
  if (valid) {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
  }
};
</script>
<style scoped>
input {
  width: 100%;
  color: var(--p-inputtext-color);
  background: var(--p-inputtext-background);
  border: 1px solid var(--p-inputtext-border-color);
}

input.error {
  border-color: var(--p-inputtext-invalid-border-color);
}
</style>
