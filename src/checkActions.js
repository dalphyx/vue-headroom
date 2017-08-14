function checkActions (states) {
  const direction = states.currentScrollY >= states.lastScrollY ? 'down' : 'up'
  const distanceScrolled = Math.abs(states.currentScrollY - states.lastScrollY)

  var action

  // Scrolling down and past the offset.
  // Unpinned the header.
  if (
    direction === 'down' &&
    states.currentScrollY >= states.offset &&
    distanceScrolled > states.downTolerance
  ) {
    action = 'unpin'

  // Now, it's time to up.
  // Pin the header.
  } else if (
    (direction === 'up' && distanceScrolled > states.upTolerance) ||
    states.currentScrollY <= states.offset
  ) {
    action = 'pin'
  }

  return action
}

export default checkActions
