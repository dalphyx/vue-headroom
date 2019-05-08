function checkActions (states) {
  const direction = states.currentScrollY >= states.lastScrollY ? 'down' : 'up'
  const distanceScrolled = Math.abs(states.currentScrollY - states.lastScrollY)
  const isInit = states.lastScrollY === undefined

  let action

  if (
    states.currentScrollY > (states.height + states.offset) &&
    states.state === 'unfixed' &&
    isInit  
  ) {
    action = 'pin'

  // At the top and not fixed yet.
  } else if (
    states.currentScrollY <= states.offset &&
    states.state !== 'unfixed'
  ) {
    action = 'unfix'

  // Unfixed and headed down. Carry on.
  } else if (
    states.currentScrollY <= states.height &&
    direction === 'down' &&
    states.state === 'unfixed'
  ) {
    action = 'none'
  } else if (
    states.currentScrollY > (states.height + states.offset) &&
    direction === 'down' &&
    states.state === 'unfixed' &&
    !isInit
  ) {
    action = 'unpin-snap'

  // Scrolling down and past the offset.
  // Unpinned the header.
  } else if (
    direction === 'down' &&
    ['pinned', 'unfixed'].indexOf(states.state) >= 0 &&
    states.currentScrollY > (states.height + states.offset) &&
    distanceScrolled > states.downTolerance
  ) {
    action = 'unpin'

  // Now, it's time to up.
  // Pin the header.
  } else if (
    direction === 'up' &&
    distanceScrolled > states.upTolerance &&
    ['pinned', 'unfixed'].indexOf(states.state) < 0
  ) {
    action = 'pin'

  // Still scrolling up, and inside the header.
  // Pin the header regardless of upTolerance
  } else if (
    direction === 'up' &&
    states.currentScrollY <= states.height &&
    ['pinned', 'unfixed'].indexOf(states.state) < 0
  ) {
    action = 'pin'
  } else {
    action = 'none' 
  }

  return action
}

export default checkActions
