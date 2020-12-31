<template>
  <div class="layout">
    <div class="layout__title"><slot name="title" /></div>
    <div class="layout__content">
      <div class="layout__view-1">
        <div class="layout__view-1__title layout__view__title">
          <slot name="view1-title" />
        </div>
        <div class="layout__view-1__content layout__view__content">
          <slot name="view1" />
        </div>
      </div>
      <div class="layout__view-2">
        <div class="layout__view-2__title layout__view__title">
          <slot name="view2-title" />
        </div>
        <div class="layout__view-2__content layout__view__content">
          <slot name="view2" />
        </div>
      </div>
    </div>
    <div class="layout__buttons">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped>
.layout {
  border: 1px solid gray;
  width: 80%;
  min-height: 500px;
  height: 80%;
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
}
.layout__title {
  padding: 4px 8px;
  font-size: 1.1em;
  background-color: #1976d2;
  color: white;
  /*text-transform: uppercase;*/
}
.layout__content {
  flex: 1;
  display: flex;
}
.layout__content > div {
  flex: 1;
  background-color: #e8e8e8;
  border-bottom: 1px solid gray;
}
.layout__content > div:first-child {
  border-right: 1px solid gray;
}
.layout__buttons {
  padding: 8px;
  text-align: right;
}
.layout__view__title {
  background: rgba(0, 0, 0, 0.2);
  padding: 4px;
  text-align: center;
}
.layout__view__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
