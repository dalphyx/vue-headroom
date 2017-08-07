// borrowed from modernizr
// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/transforms3d.js

function supports3d () {
  let div = document.createElement('div')
  let ret = false
  let properties = ['perspectiveProperty', 'WebkitPerspective']

  for (let i = properties.length - 1; i >= 0; i--) {
    ret = ret
      ? ret
      : div.style[properties[i]] !== undefined
  }

  if (ret) {
    let st = document.createElement('style')

    st.textContent = '#modernizr{width:0;height:0} @media (transform-3d),(-webkit-transform-3d){#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}'
    document.getElementsByTagName('head')[0].appendChild(st)
    div.id = 'modernizr'
    document.body.appendChild(div)

    ret = div.offsetWidth === 7 && div.offsetHeight === 18

    st.parentNode.removeChild(st)
    div.parentNode.removeChild(div)
  }

  return ret
}

export default supports3d
