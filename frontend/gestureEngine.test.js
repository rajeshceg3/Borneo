import { describe, expect, it, vi } from 'vitest'
import { bindGestureNavigation, detectSwipeDirection } from './src/gestureEngine'

describe('gesture engine', () => {
  it('detects horizontal and downward swipe directions', () => {
    expect(detectSwipeDirection({ x: 120, y: 100 }, { x: 40, y: 110 })).toBe('swipeLeft')
    expect(detectSwipeDirection({ x: 40, y: 100 }, { x: 130, y: 105 })).toBe('swipeRight')
    expect(detectSwipeDirection({ x: 80, y: 20 }, { x: 90, y: 100 })).toBe('swipeDown')
  })

  it('binds touch listeners and executes matching handlers', () => {
    const listeners = {}
    const element = {
      addEventListener: vi.fn((name, handler) => {
        listeners[name] = handler
      }),
      removeEventListener: vi.fn()
    }

    const handlers = {
      swipeLeft: vi.fn(),
      swipeRight: vi.fn(),
      swipeDown: vi.fn()
    }

    const unbind = bindGestureNavigation(element, handlers)

    listeners.touchstart({ touches: [{ clientX: 100, clientY: 100 }] })
    listeners.touchend({ changedTouches: [{ clientX: 20, clientY: 105 }] })

    expect(handlers.swipeLeft).toHaveBeenCalledTimes(1)

    unbind()

    expect(element.removeEventListener).toHaveBeenCalledTimes(2)
  })
})
