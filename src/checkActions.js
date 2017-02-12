function checkActions (states) {
  const direction = states.currentScrollY >= states.lastScrollY ? 'down' : 'up'
  const distanceScrolled = Math.abs(states.currentScrollY - states.lastScrollY)

  var action

  // Begining, at the top and not fixed.
  if (
    states.currentScrollY <= states.pinStart &&
    states.state !== 'unfixed'
  ) {
    action = 'unfix'

  // Still unfixed, scrolling down and passing the header.
  } else if (
    states.currentScrollY <= states.elemHeight &&
    direction === 'down' &&
    states.state === 'unfixed'
  ) {
    action = 'none'

  // Scrolling down and past the header.
  // Unpinned the header.
  } else if (
    direction === 'down' &&
    ['pinned', 'unfixed'].indexOf(states.state) >= 0 &&
    states.currentScrollY > (states.elemHeight + states.pinStart) &&
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

  // Still scrolling up and passing the header.
  // Pin the header regardless of upTolerance.
  } else if (
    direction === 'up' &&
    states.currentScrollY <= states.elemHeight &&
    ['pinned', 'unfixed'].indexOf(states.state) < 0
  ) {
    action = 'pin'
  } else {
    action = 'none'
  }

  return action
}

export default checkActions
