var fontSize = 24
var alpha = 0.8

function wheel(sender) {
  function fontResize(sender) {
    if (sender.deltaY > 0) {
      fontSize += 1
    } else if (sender.deltaY < 0) {
      fontSize -= 1
    }
    document.body.style.fontSize = fontSize + 'pt'
  }

  function alphaSet(sender) {
    if (sender.deltaY > 0) {
      alpha += 0.1
      if (alpha > 1) alpha = 1
    } else if (sender.deltaY < 0) {
      alpha -= 0.1
      if (alpha < 0) alpha = 0
    }
    document.body.style.backgroundColor = 'rgba(70, 70, 70, '+ alpha + ')'
  }

  console.log(sender);

  if (sender.ctrlKey) {
    alphaSet(sender)
  } else {
    fontResize(sender)
  }
}
