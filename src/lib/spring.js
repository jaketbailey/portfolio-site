// A small spring animator in the style of Apple's UIKit springs: tuned with a
// damping ratio (1 = no overshoot) and a response in seconds, rather than raw
// stiffness/damping. Springs start from the current value and velocity, so an
// animation can be grabbed mid-flight and redirected without a jump.

const MAX_STEP = 1 / 120

export function animateSpring({
    from,
    to,
    velocity = 0, // px/s, e.g. the pointer's speed at release
    response = 0.35,
    dampingRatio = 1,
    onUpdate,
    onComplete,
}) {
    const stiffness = Math.pow((2 * Math.PI) / response, 2)
    const damping = (4 * Math.PI * dampingRatio) / response

    const state = { value: from, velocity, running: true }
    let last = performance.now()
    let frame

    const tick = (now) => {
        let dt = Math.min((now - last) / 1000, 0.064)
        last = now
        // Sub-step so a dropped frame doesn't destabilise the integration.
        while (dt > 0) {
            const step = Math.min(dt, MAX_STEP)
            const force =
                -stiffness * (state.value - to) - damping * state.velocity
            state.velocity += force * step
            state.value += state.velocity * step
            dt -= step
        }

        if (Math.abs(state.value - to) < 0.5 && Math.abs(state.velocity) < 10) {
            state.value = to
            state.velocity = 0
            state.running = false
            onUpdate(to)
            onComplete?.()
            return
        }
        onUpdate(state.value)
        frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return {
        // The live value and velocity, so an interruption can carry on from
        // exactly where the motion is.
        get value() {
            return state.value
        },
        get velocity() {
            return state.velocity
        },
        get running() {
            return state.running
        },
        stop() {
            state.running = false
            cancelAnimationFrame(frame)
        },
    }
}

// Where a flick would come to rest if left to decelerate like a scroll view
// (Apple's projection from "Designing Fluid Interfaces").
export function project(velocity, decelerationRate = 0.998) {
    return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

// Progressive resistance past an edge: the further you pull, the less it moves.
export function rubberband(overshoot, dimension, constant = 0.55) {
    return (
        (overshoot * dimension * constant) /
        (dimension + constant * Math.abs(overshoot))
    )
}
