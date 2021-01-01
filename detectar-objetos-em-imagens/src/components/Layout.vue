<template>
  <div class="layout">
    <div class="layout__title"><slot name="title" /></div>
    <div class="layout__content">
      <div class="layout__view-1 layout__view">
        <div class="layout__view-1__title layout__view__title">
          <slot name="view1-title" />
        </div>
        <div class="layout__view-1__content layout__view__content">
          <slot name="view1" />
        </div>
      </div>
      <div class="layout__view-2 layout__view">
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
  margin: 10px;
  padding: 0px;
  box-sizing: content-box;
  overflow: hidden;
}
.layout__title {
  padding: 12px 12px 12px 12px;
  font-size: 1.1em;
  background-color: #1976d2;
  color: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
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
  padding: 8px;
  text-align: center;
}
.layout__view__content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  flex: 1;
}
.layout__view {
  min-width: 350px;
  display: flex;
  flex-direction: column;
}
</style>
