function checkActions(states) {
  const direction = states.currentScrollY.value >= states.lastScrollY.value ? 'down' : 'up'
  const distanceScrolled = Math.abs(states.currentScrollY.value - states.lastScrollY.value)
  const isInit = states.lastScrollY.value === undefined

  let action

  if (
    states.currentScrollY.value > states.height.value + states.offset.value &&
    states.state.value === 'unfixed' &&
    isInit
  ) {
    action = 'pin'

    // At the top and not fixed yet.
  } else if (states.currentScrollY.value <= states.offset.value && states.state.value !== 'unfixed') {
    action = 'unfix'

    // Unfixed and headed down. Carry on.
  } else if (
    states.currentScrollY.value <= states.height.value &&
    direction === 'down' &&
    states.state.value === 'unfixed'
  ) {
    action = 'none'
  } else if (
    states.currentScrollY.value > states.height.value + states.offset.value &&
    direction === 'down' &&
    states.state.value === 'unfixed' &&
    !isInit
  ) {
    action = 'unpin-snap'

    // Scrolling down and past the offset.
    // Unpinned the header.
  } else if (
    direction === 'down' &&
    ['pinned', 'unfixed'].indexOf(states.state.value) >= 0 &&
    states.currentScrollY.value > states.height.value + states.offset.value &&
    distanceScrolled > states.downTolerance.value
  ) {
    action = 'unpin'

    // Now, it's time to up.
    // Pin the header.
  } else if (
    direction === 'up' &&
    distanceScrolled > states.upTolerance.value &&
    ['pinned', 'unfixed'].indexOf(states.state.value) < 0
  ) {
    action = 'pin'

    // Still scrolling up, and inside the header.
    // Pin the header regardless of upTolerance
  } else if (
    direction === 'up' &&
    states.currentScrollY.value <= states.height.value &&
    ['pinned', 'unfixed'].indexOf(states.state.value) < 0
  ) {
    action = 'pin'
  } else {
    action = 'none'
  }

  return action
}

export default checkActions
