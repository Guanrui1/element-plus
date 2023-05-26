<template>
  <!--
    @description: 传送门组件
    @param: to 传送目标 dom
    @param: disabled 是否禁用传送
  -->
  <teleport to="body" :disabled="!appendToBody">
    <!--
      @description: 动画组件
      @param: name 设置 name, 方便添加动画 class
      @event: after-enter 动画事件?
      @event: after-leave 动画事件?
      @event: before-leave 动画事件?
    -->
    <transition
      name="dialog-fade"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @before-leave="beforeLeave"
    >
      <!--
        @description: overlay 组件功能未知, 猜测是遮罩?
        @directive: v-show 是否显示组件
        @param: custom-mask-event 自定义 mask 事件?
        @param: mask 遮罩是否显示?
        @param: overlay-class 自定义遮罩 class?
        @param: z-index 设置 z-index 层级?
      -->
      <el-overlay
        v-show="visible"
        custom-mask-event
        :mask="modal"
        :overlay-class="modalClass"
        :z-index="zIndex"
      >
        <!--
          @description: 弹窗主体，占满整个窗口
          @param: role 增强语义性
          @param: aria-modal 无障碍使用
          @param: aria-label 无障碍使用
          @param: aria-labelledby 无障碍使用
          @param: aria-describedby 无障碍使用
          @param: class 设置 class 为 el-overlay-dialog
          @param: style 动态设置 style 为 overlayDialogStyle
          @event: click 点击事件
          @event: mousedown 鼠标按下事件
          @event: mouseup 鼠标按下后回弹事件
        -->
        <div
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          :aria-labelledby="!title ? titleId : undefined"
          :aria-describedby="bodyId"
          :class="`${ns.namespace.value}-overlay-dialog`"
          :style="overlayDialogStyle"
          @click="overlayEvent.onClick"
          @mousedown="overlayEvent.onMousedown"
          @mouseup="overlayEvent.onMouseup"
        >
          <!--
            @description: element 捕获和处理 focus 组件?
            @param: loop 是否循环?
            @param: trapped 是否捕获 focus 事件?
            @param: focus-start-el 开始触发的 dom, container 算是一个固定值?
            @event: focus-after-trapped 捕获后聚焦事件
            @event: focus-after-released 释放后聚焦事件
            @event: focusout-prevented 阻止聚焦后事件
            @event: release-requested 请求释放后事件
          -->
          <el-focus-trap
            loop
            :trapped="visible"
            focus-start-el="container"
            @focus-after-trapped="onOpenAutoFocus"
            @focus-after-released="onCloseAutoFocus"
            @focusout-prevented="onFocusoutPrevented"
            @release-requested="onCloseRequested"
          >
            <el-dialog-content
              v-if="rendered"
              ref="dialogContentRef"
              v-bind="$attrs"
              :custom-class="customClass"
              :center="center"
              :align-center="alignCenter"
              :close-icon="closeIcon"
              :draggable="draggable"
              :fullscreen="fullscreen"
              :show-close="showClose"
              :title="title"
              @close="handleClose"
            >
              <template #header>
                <slot
                  v-if="!$slots.title"
                  name="header"
                  :close="handleClose"
                  :title-id="titleId"
                  :title-class="ns.e('title')"
                />
                <slot v-else name="title" />
              </template>
              <slot />
              <template v-if="$slots.footer" #footer>
                <slot name="footer" />
              </template>
            </el-dialog-content>
          </el-focus-trap>
        </div>
      </el-overlay>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, provide, ref, useSlots } from 'vue'
import { ElOverlay } from '@element-plus/components/overlay'
import { useDeprecated, useNamespace, useSameTarget } from '@element-plus/hooks'
import ElFocusTrap from '@element-plus/components/focus-trap'
import ElDialogContent from './dialog-content.vue'
import { dialogInjectionKey } from './constants'
import { dialogEmits, dialogProps } from './dialog'
import { useDialog } from './use-dialog'

defineOptions({
  name: 'ElDialog',
  inheritAttrs: false,
})

const props = defineProps(dialogProps)
defineEmits(dialogEmits)
const slots = useSlots()

useDeprecated(
  {
    scope: 'el-dialog',
    from: 'the title slot',
    replacement: 'the header slot',
    version: '3.0.0',
    ref: 'https://element-plus.org/en-US/component/dialog.html#slots',
  },
  computed(() => !!slots.title)
)

useDeprecated(
  {
    scope: 'el-dialog',
    from: 'custom-class',
    replacement: 'class',
    version: '2.3.0',
    ref: 'https://element-plus.org/en-US/component/dialog.html#attributes',
    type: 'Attribute',
  },
  computed(() => !!props.customClass)
)

const ns = useNamespace('dialog')
const dialogRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()
const dialogContentRef = ref()

const {
  visible,
  titleId,
  bodyId,
  style,
  overlayDialogStyle,
  rendered,
  zIndex,
  afterEnter,
  afterLeave,
  beforeLeave,
  handleClose,
  onModalClick,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onCloseRequested,
  onFocusoutPrevented,
} = useDialog(props, dialogRef)

provide(dialogInjectionKey, {
  dialogRef,
  headerRef,
  bodyId,
  ns,
  rendered,
  style,
})

const overlayEvent = useSameTarget(onModalClick)

const draggable = computed(() => props.draggable && !props.fullscreen)

defineExpose({
  /** @description whether the dialog is visible */
  visible,
  dialogContentRef,
})
</script>
